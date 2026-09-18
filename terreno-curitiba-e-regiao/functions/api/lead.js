/**
 * POST /api/lead — recebe leads do portal terrenoalmirantetamandare.com.br
 *
 * Cloudflare Pages Function. Estratégia de persistência (nesta ordem, se disponível):
 *   1. Banco de dados D1  ......... binding "DB"          (recomendado)
 *   2. Webhook externo (CRM/Make) . variável "LEAD_WEBHOOK" (ex.: Kommo, n8n, Zapier)
 *   3. E-mail (via webhook)  ...... variável "LEAD_EMAIL_WEBHOOK"
 *
 * Nenhuma credencial fica no código: tudo vem de variáveis de ambiente/bindings
 * configurados no painel do Cloudflare Pages (Settings → Environment variables / D1).
 *
 * Para criar a tabela no D1:
 *   CREATE TABLE IF NOT EXISTS leads (
 *     id INTEGER PRIMARY KEY AUTOINCREMENT,
 *     criado_em TEXT, nome TEXT, telefone TEXT, email TEXT, cidade TEXT,
 *     objetivo TEXT, faixa_investimento TEXT, forma_pagamento TEXT, prazo TEXT,
 *     regiao TEXT, observacoes TEXT, empreendimento_interesse TEXT,
 *     pagina_origem TEXT, referrer TEXT,
 *     utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT,
 *     ip TEXT, user_agent TEXT, raw TEXT
 *   );
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...CORS } });

// Esquema da tabela de leads. A função cria a tabela sozinha na primeira
// gravação, então no painel basta criar o banco D1 e adicionar o binding "DB".
const LEADS_SCHEMA = `CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  criado_em TEXT, nome TEXT, telefone TEXT, email TEXT, cidade TEXT,
  objetivo TEXT, faixa_investimento TEXT, forma_pagamento TEXT, prazo TEXT,
  regiao TEXT, observacoes TEXT, empreendimento_interesse TEXT,
  pagina_origem TEXT, referrer TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT,
  ip TEXT, user_agent TEXT, raw TEXT
)`;

async function ensureLeadsTable(db) {
  await db.prepare(LEADS_SCHEMA).run();
}

function escapeHtml(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Envia o lead por e-mail via Resend (https://resend.com).
// Requer as variáveis: RESEND_API_KEY e LEAD_EMAIL_TO (destino).
// Opcional: LEAD_EMAIL_FROM (remetente verificado; padrão usa o sandbox do Resend).
async function sendLeadEmail(env, lead) {
  const key = env.RESEND_API_KEY;
  const to = env.LEAD_EMAIL_TO;
  if (!key || !to) return { skipped: true };
  const from = env.LEAD_EMAIL_FROM || "Leads <onboarding@resend.dev>";
  const rows = [
    ["Nome", lead.nome], ["Telefone", lead.telefone], ["E-mail", lead.email],
    ["Cidade", lead.cidade], ["Empreendimento", lead.empreendimento_interesse],
    ["Objetivo", lead.objetivo], ["Faixa de investimento", lead.faixa_investimento],
    ["Forma de pagamento", lead.forma_pagamento], ["Prazo", lead.prazo], ["Região", lead.regiao],
    ["Observações", lead.observacoes], ["Página de origem", lead.pagina_origem],
    ["Campanha (UTM)", [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")],
    ["Enviado em", lead.criado_em],
  ];
  const trs = rows.filter((r) => r[1]).map(
    (r) => `<tr><td style="padding:7px 12px;font-weight:600;background:#f3f5f2;border:1px solid #e5e7e6">${r[0]}</td>` +
           `<td style="padding:7px 12px;border:1px solid #e5e7e6">${escapeHtml(r[1])}</td></tr>`
  ).join("");
  const digits = String(lead.telefone || "").replace(/\D/g, "");
  const waNum = digits.length >= 12 ? digits : "55" + digits;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1e2a2e;max-width:640px">
    <h2 style="color:#0e3a42;margin:0 0 4px">Novo lead — Terrenos Curitiba e Região</h2>
    <p style="color:#4b5a58;margin:0 0 16px">Recebido pelo formulário do site.</p>
    <table style="border-collapse:collapse;width:100%">${trs}</table>
    <p style="margin:18px 0">
      <a href="https://wa.me/${waNum}" style="background:#25d366;color:#fff;padding:11px 18px;border-radius:8px;text-decoration:none;font-weight:700">Responder no WhatsApp</a>
      ${lead.email ? `&nbsp;&nbsp;<a href="mailto:${escapeHtml(lead.email)}" style="color:#0e3a42">Responder por e-mail</a>` : ""}
    </p>
  </div>`;
  const subjExtra = lead.empreendimento_interesse ? " — " + lead.empreendimento_interesse : (lead.cidade ? " — " + lead.cidade : "");
  const payload = { from, to: [to], subject: `Novo lead: ${lead.nome}${subjExtra}`, html };
  if (lead.email) payload.reply_to = lead.email;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify(payload),
  });
  return { ok: r.ok, status: r.status };
}

function insertLead(db, lead, body) {
  return db
    .prepare(
      `INSERT INTO leads
       (criado_em,nome,telefone,email,cidade,objetivo,faixa_investimento,forma_pagamento,prazo,
        regiao,observacoes,empreendimento_interesse,pagina_origem,referrer,
        utm_source,utm_medium,utm_campaign,utm_content,utm_term,ip,user_agent,raw)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      lead.criado_em, lead.nome, lead.telefone, lead.email, lead.cidade, lead.objetivo,
      lead.faixa_investimento, lead.forma_pagamento, lead.prazo, lead.regiao, lead.observacoes,
      lead.empreendimento_interesse, lead.pagina_origem, lead.referrer,
      lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_content, lead.utm_term,
      lead.ip, lead.user_agent, JSON.stringify(body)
    )
    .run();
}

// Notifica o corretor no WhatsApp via CallMeBot (grátis, https://www.callmebot.com/blog/free-api-whatsapp-messages/).
// Requer: LEAD_WA_PHONE (número que RECEBE, formato internacional só dígitos) e LEAD_WA_APIKEY.
async function notifyWhatsApp(env, lead) {
  const phone = String(env.LEAD_WA_PHONE || "").replace(/\D/g, "");
  const apikey = env.LEAD_WA_APIKEY;
  if (!phone || !apikey) return { skipped: true };
  const d = String(lead.telefone || "").replace(/\D/g, "");
  const waNum = d.length >= 12 ? d : "55" + d;
  const utm = [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ");
  const lines = [
    "🟢 *Novo lead — Terrenos Curitiba e Região*",
    "👤 " + lead.nome,
    "📱 " + lead.telefone + " (wa.me/" + waNum + ")",
    lead.email ? "✉️ " + lead.email : "",
    lead.empreendimento_interesse ? "🏗️ " + lead.empreendimento_interesse : "",
    lead.cidade ? "📍 " + lead.cidade : "",
    lead.objetivo ? "🎯 " + lead.objetivo : "",
    lead.faixa_investimento ? "💰 " + lead.faixa_investimento : "",
    utm ? "📊 " + utm : "",
  ].filter(Boolean);
  const url = "https://api.callmebot.com/whatsapp.php?phone=" + phone +
    "&text=" + encodeURIComponent(lines.join("\n")) + "&apikey=" + encodeURIComponent(apikey);
  const r = await fetch(url, { method: "GET" });
  return { ok: r.ok, status: r.status };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet() {
  return json({ ok: false, error: "Use POST." }, 405);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "JSON inválido." }, 400);
  }

  // Honeypot anti-spam
  if (body.website) return json({ ok: true }); // finge sucesso p/ o bot

  // Validação mínima
  const nome = String(body.nome || "").trim();
  const telefone = String(body.telefone || "").replace(/\D/g, "");
  const email = String(body.email || "").trim();
  if (nome.length < 2) return json({ ok: false, error: "Nome obrigatório." }, 422);
  if (telefone.length < 10) return json({ ok: false, error: "Telefone inválido." }, 422);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return json({ ok: false, error: "E-mail inválido." }, 422);
  if (body.consentimento !== true)
    return json({ ok: false, error: "Consentimento obrigatório." }, 422);

  const lead = {
    criado_em: new Date().toISOString(),
    nome,
    telefone,
    email,
    cidade: String(body.cidade || "").trim(),
    objetivo: String(body.objetivo || "").trim(),
    faixa_investimento: String(body.faixa_investimento || "").trim(),
    forma_pagamento: String(body.forma_pagamento || "").trim(),
    prazo: String(body.prazo || "").trim(),
    regiao: String(body.regiao || "").trim(),
    observacoes: String(body.observacoes || "").trim().slice(0, 2000),
    empreendimento_interesse: String(body.empreendimento_interesse || "").trim(),
    pagina_origem: String(body.pagina_origem || "").trim(),
    referrer: String(body.referrer || "").trim(),
    utm_source: String(body.utm_source || "").trim(),
    utm_medium: String(body.utm_medium || "").trim(),
    utm_campaign: String(body.utm_campaign || "").trim(),
    utm_content: String(body.utm_content || "").trim(),
    utm_term: String(body.utm_term || "").trim(),
    ip: request.headers.get("CF-Connecting-IP") || "",
    user_agent: request.headers.get("User-Agent") || "",
  };

  let persisted = false;
  const errors = [];

  // 1) D1 — cria a tabela automaticamente se ainda não existir
  if (env.DB) {
    try {
      await insertLead(env.DB, lead, body);
      persisted = true;
    } catch (e) {
      if (/no such table/i.test(String(e && e.message))) {
        try {
          await ensureLeadsTable(env.DB);
          await insertLead(env.DB, lead, body);
          persisted = true;
        } catch (e2) {
          errors.push("d1:" + (e2 && e2.message));
        }
      } else {
        errors.push("d1:" + (e && e.message));
      }
    }
  }

  // 2) Webhook externo (CRM / automação)
  if (env.LEAD_WEBHOOK) {
    try {
      const r = await fetch(env.LEAD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (r.ok) persisted = true; else errors.push("webhook:" + r.status);
    } catch (e) {
      errors.push("webhook:" + (e && e.message));
    }
  }

  // 3) Notificação por e-mail (Resend)
  if (env.RESEND_API_KEY && env.LEAD_EMAIL_TO) {
    try {
      const er = await sendLeadEmail(env, lead);
      if (er.ok) persisted = true; else if (!er.skipped) errors.push("email:" + er.status);
    } catch (e) {
      errors.push("email:" + (e && e.message));
    }
  }

  // 4) Notificação por WhatsApp (CallMeBot)
  if (env.LEAD_WA_PHONE && env.LEAD_WA_APIKEY) {
    try {
      const wr = await notifyWhatsApp(env, lead);
      if (wr.ok) persisted = true; else if (!wr.skipped) errors.push("whatsapp:" + wr.status);
    } catch (e) {
      errors.push("whatsapp:" + (e && e.message));
    }
  }

  // Se nenhum destino está configurado, registra no log e ainda responde ok
  const anyDest = env.DB || env.LEAD_WEBHOOK || (env.RESEND_API_KEY && env.LEAD_EMAIL_TO) || (env.LEAD_WA_PHONE && env.LEAD_WA_APIKEY);
  if (!anyDest) {
    console.log("LEAD (sem destino configurado):", JSON.stringify(lead));
    return json({ ok: true, stored: false, note: "Configure DB, LEAD_WEBHOOK, e-mail (Resend) ou WhatsApp (CallMeBot)." });
  }

  if (!persisted) return json({ ok: false, error: "Falha ao registrar o lead.", detail: errors }, 502);
  return json({ ok: true, stored: true });
}
