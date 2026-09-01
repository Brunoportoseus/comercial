/*
 * Conecta Consórcios — Cloudflare Worker (entrypoint)
 * -------------------------------------------------------------------------
 * Responsabilidades:
 *   1. Redirecionar www -> apex (mantendo caminho e query).
 *   2. Servir os arquivos estáticos (binding ASSETS).
 *   3. Expor POST /api/lead: recebe o formulário, valida no SERVIDOR e
 *      encaminha para o destino real por uma camada de integração
 *      DESACOPLADA (webhook / CRM / Kommo / e-mail / banco de dados).
 *
 * NENHUM segredo fica no código. Tudo vem de variáveis de ambiente / secrets,
 * configuráveis no painel Cloudflare ou via `wrangler secret put`.
 *
 * Variáveis de ambiente suportadas (todas OPCIONAIS — ver README.md):
 *   LEAD_WEBHOOK_URL   URL genérica que recebe o lead em JSON (POST).
 *   KOMMO_WEBHOOK_URL  URL do webhook de entrada do Kommo (se usar Kommo).
 *   LEAD_EMAIL_TO      e-mail de destino (requer RESEND_API_KEY).
 *   RESEND_API_KEY     chave da API Resend para envio de e-mail (secret).
 *   TURNSTILE_SECRET   (opcional) valida token do Cloudflare Turnstile.
 *
 * Se NENHUM destino estiver configurado, o Worker responde 200 e apenas
 * registra o lead no log de observabilidade — assim o formulário nunca fica
 * "só visual" e a equipe conecta o destino real depois, sem tocar no front.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1) Redireciona www -> apex (produção). Ajuste o domínio se necessário.
    if (url.hostname === "www.conectaconsorciosbrasil.com.br") {
      url.hostname = "conectaconsorciosbrasil.com.br";
      return Response.redirect(url.toString(), 301);
    }

    // 2) API de captação de leads
    if (url.pathname === "/api/lead") {
      if (request.method !== "POST") {
        return json({ success: false, error: "Método não permitido" }, 405);
      }
      return handleLead(request, env, ctx);
    }

    // 3) Assets estáticos
    return env.ASSETS.fetch(request);
  },
};

/* ----------------------------------------------------------------------- */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function sanitize(value, max = 300) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001f\u007f]/g, " ") // remove caracteres de controle
    .trim()
    .slice(0, max);
}

function isValidBrPhone(digits) {
  if (!/^\d{10,11}$/.test(digits)) return false;
  const ddd = parseInt(digits.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  if (digits.length === 11 && digits.charAt(2) !== "9") return false;
  return true;
}

const OBJETIVOS = ["comprar", "construir", "reformar", "terreno", "outro"];

async function handleLead(request, env, ctx) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ success: false, error: "Requisição inválida" }, 400);
  }

  // --- Proteção anti-spam ------------------------------------------------
  // Honeypot: bots preenchem campos escondidos.
  if (sanitize(body.website)) {
    return json({ success: true }); // finge sucesso, descarta silenciosamente
  }
  // Tempo mínimo de preenchimento (bots enviam instantaneamente).
  if (typeof body.elapsed === "number" && body.elapsed < 1500) {
    return json({ success: true });
  }

  // --- Validação no servidor --------------------------------------------
  const nome = sanitize(body.nome, 120);
  const whatsapp = sanitize(body.whatsapp, 15).replace(/\D/g, "");
  const email = sanitize(body.email, 160);
  const objetivo = sanitize(body.objetivo, 40);

  const errors = [];
  if (nome.length < 2) errors.push("nome");
  if (!isValidBrPhone(whatsapp)) errors.push("whatsapp");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");
  if (!OBJETIVOS.includes(objetivo)) errors.push("objetivo");
  if (body.consent !== true) errors.push("consent");

  if (errors.length) {
    return json(
      { success: false, error: "Dados inválidos", fields: errors },
      422
    );
  }

  // --- (Opcional) Cloudflare Turnstile ----------------------------------
  if (env.TURNSTILE_SECRET) {
    const okTurnstile = await verifyTurnstile(
      env.TURNSTILE_SECRET,
      sanitize(body.turnstileToken, 4000),
      request.headers.get("CF-Connecting-IP") || ""
    );
    if (!okTurnstile) {
      return json({ success: false, error: "Falha na verificação" }, 403);
    }
  }

  // --- Monta o lead normalizado -----------------------------------------
  const lead = {
    nome,
    whatsapp, // só dígitos (DDD + número)
    email: email || null,
    objetivo,
    faixa: sanitize(body.faixa, 40) || null,
    prazo: sanitize(body.prazo, 40) || null,
    periodo: sanitize(body.periodo, 40) || null,
    origem: sanitize(body.origem, 80) || "landing:conecta-consorcios",
    userAgent: sanitize(request.headers.get("User-Agent"), 300),
    ip: request.headers.get("CF-Connecting-IP") || null,
    recebidoEm: new Date().toISOString(),
  };

  // --- Camada de integração DESACOPLADA ---------------------------------
  // Executa em background para não atrasar a resposta ao usuário.
  const deliver = deliverLead(lead, env);
  if (ctx && typeof ctx.waitUntil === "function") {
    ctx.waitUntil(deliver.catch(() => {}));
  } else {
    await deliver.catch(() => {});
  }

  // Log de observabilidade (visível no painel Cloudflare).
  console.log("lead_recebido", JSON.stringify({ nome, whatsapp, objetivo }));

  return json({ success: true });
}

/**
 * Encaminha o lead para todos os destinos configurados.
 * Adicione novos destinos aqui sem tocar no front-end.
 */
async function deliverLead(lead, env) {
  const tasks = [];

  if (env.LEAD_WEBHOOK_URL) {
    tasks.push(postJson(env.LEAD_WEBHOOK_URL, lead));
  }

  if (env.KOMMO_WEBHOOK_URL) {
    // Kommo aceita o payload; o mapeamento de campos é feito no fluxo do Kommo.
    tasks.push(postJson(env.KOMMO_WEBHOOK_URL, lead));
  }

  if (env.LEAD_EMAIL_TO && env.RESEND_API_KEY) {
    tasks.push(sendEmail(lead, env));
  }

  if (!tasks.length) {
    // Nenhum destino configurado ainda. Não falha — apenas registra.
    console.log(
      "lead_sem_destino",
      "Configure LEAD_WEBHOOK_URL, KOMMO_WEBHOOK_URL ou LEAD_EMAIL_TO."
    );
    return;
  }

  await Promise.allSettled(tasks);
}

async function postJson(targetUrl, payload) {
  const res = await fetch(targetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.log("webhook_falhou", targetUrl, res.status);
  }
}

async function sendEmail(lead, env) {
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const linha = (k, v) => (v ? `<p><strong>${k}:</strong> ${esc(v)}</p>` : "");
  const html =
    `<h2>Novo lead — Conecta Consórcios</h2>` +
    linha("Nome", lead.nome) +
    linha("WhatsApp", lead.whatsapp) +
    linha("E-mail", lead.email) +
    linha("Objetivo", lead.objetivo) +
    linha("Faixa de crédito", lead.faixa) +
    linha("Prazo", lead.prazo) +
    linha("Período p/ contato", lead.periodo) +
    linha("Origem", lead.origem) +
    linha("Recebido em", lead.recebidoEm);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // CONFIRMAR: remetente precisa ser um domínio verificado no Resend.
      from: env.LEAD_EMAIL_FROM || "Conecta Consórcios <no-reply@conectaconsorciosbrasil.com.br>",
      to: [env.LEAD_EMAIL_TO],
      subject: `Novo lead: ${lead.nome} (${lead.objetivo})`,
      html,
    }),
  });
  if (!res.ok) {
    console.log("email_falhou", res.status);
  }
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form }
    );
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    return false;
  }
}
