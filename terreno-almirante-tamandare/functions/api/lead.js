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

  // 1) D1
  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO leads
         (criado_em,nome,telefone,email,cidade,objetivo,faixa_investimento,forma_pagamento,prazo,
          regiao,observacoes,empreendimento_interesse,pagina_origem,referrer,
          utm_source,utm_medium,utm_campaign,utm_content,utm_term,ip,user_agent,raw)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        lead.criado_em, lead.nome, lead.telefone, lead.email, lead.cidade, lead.objetivo,
        lead.faixa_investimento, lead.forma_pagamento, lead.prazo, lead.regiao, lead.observacoes,
        lead.empreendimento_interesse, lead.pagina_origem, lead.referrer,
        lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_content, lead.utm_term,
        lead.ip, lead.user_agent, JSON.stringify(body)
      ).run();
      persisted = true;
    } catch (e) {
      errors.push("d1:" + (e && e.message));
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

  // Se nenhum destino está configurado, registra no log e ainda responde ok
  if (!env.DB && !env.LEAD_WEBHOOK) {
    console.log("LEAD (sem destino configurado):", JSON.stringify(lead));
    return json({ ok: true, stored: false, note: "Configure DB (D1) ou LEAD_WEBHOOK." });
  }

  if (!persisted) return json({ ok: false, error: "Falha ao registrar o lead.", detail: errors }, 502);
  return json({ ok: true, stored: true });
}
