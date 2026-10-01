/**
 * POST /api/leads-qualify — marca um lead como qualificado/fechado (ou reverte),
 * usado pela página /admin/ para não precisar mais rodar UPDATE manual no Console do D1.
 *
 * Protegido pelo mesmo token de /api/leads-export (variável LEADS_TOKEN).
 *
 * Body JSON:
 *   { id: 42, status: "qualificado", valor_negocio: 189000, convertido_em: "2026-09-25 14:30:00" }
 *   status é opcional (padrão "qualificado"); valor_negocio e convertido_em são opcionais.
 *   Para reverter, envie status: "novo" (ou outro valor).
 *
 * Também devolve o estágio ao GA4 (Measurement Protocol), para o funil e os relatórios do GA4 enxergarem o
 * lead qualificado/fechado, ligado ao mesmo visitante (client_id) que gerou o lead:
 *   status "qualificado"                 → evento qualify_lead
 *   status "fechado" | "vendido" | "convertido" → evento close_convert_lead
 *   qualquer outro status (ex.: "novo")  → nenhum evento (um evento enviado ao GA4 não pode ser desfeito).
 * Só envia quando: GA4_MEASUREMENT_ID e GA4_API_SECRET estão definidos (variáveis do Cloudflare Pages), o lead
 * tem ga_client_id (o visitante aceitou cookies) e o evento ainda não foi enviado para esse lead.
 * GA4_MP_DEBUG=1 usa o endpoint de validação do Google (não grava nada no GA4) e devolve as mensagens na
 * resposta (campo ga4.validationMessages). Falha no GA4 nunca desfaz a qualificação no D1.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...CORS } });

const GA4_EVENT_BY_STATUS = {
  qualificado: "qualify_lead",
  fechado: "close_convert_lead",
  vendido: "close_convert_lead",
  convertido: "close_convert_lead",
};

const cut = (v, n = 100) => String(v == null ? "" : v).slice(0, n); // limite de 100 caracteres por parâmetro no GA4

// Envia o estágio do lead ao GA4. Nunca lança erro: devolve { sent, reason? } para ir na resposta.
async function sendToGa4(env, id, status, valor, lead) {
  const name = GA4_EVENT_BY_STATUS[status];
  if (!name) return { sent: false, reason: "status_sem_evento" };
  const measurementId = String(env.GA4_MEASUREMENT_ID || "").trim();
  const apiSecret = String(env.GA4_API_SECRET || "").trim();
  if (!measurementId || !apiSecret) return { sent: false, reason: "ga4_nao_configurado" };
  if (!lead || !/^\d{1,12}\.\d{1,12}$/.test(String(lead.ga_client_id || ""))) {
    return { sent: false, reason: "sem_client_id" }; // lead antigo ou visitante sem consentimento de cookies
  }
  const debug = !!env.GA4_MP_DEBUG && String(env.GA4_MP_DEBUG) !== "0";
  const already = String(lead.ga_eventos || "").split(",").filter(Boolean);
  if (!debug && already.includes(name)) return { sent: false, reason: "ja_enviado", event: name };

  const params = {
    lead_id: String(id),
    lead_status: cut(status, 40),
    empreendimento: cut(lead.empreendimento_interesse),
    lead_source_tool: cut(lead.lead_source_tool),
    faixa_parcela: cut(lead.faixa_parcela),
    engagement_time_msec: 100, // sem isto o GA4 pode não mostrar o evento nos relatórios em tempo real
  };
  if (/^\d{1,12}$/.test(String(lead.ga_session_id || ""))) params.session_id = String(lead.ga_session_id);
  if (valor !== null && Number.isFinite(valor) && valor > 0) { params.value = valor; params.currency = "BRL"; }
  for (const k of Object.keys(params)) if (params[k] === "") delete params[k];

  const url = "https://www.google-analytics.com/" + (debug ? "debug/" : "") + "mp/collect" +
    "?measurement_id=" + encodeURIComponent(measurementId) + "&api_secret=" + encodeURIComponent(apiSecret);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: String(lead.ga_client_id), events: [{ name, params }] }),
      signal: AbortSignal.timeout(4000),
    });
    if (debug) {
      const j = await r.json().catch(() => ({}));
      return { sent: false, reason: "debug", event: name, validationMessages: j.validationMessages || [] };
    }
    if (!r.ok) return { sent: false, reason: "ga4_http_" + r.status, event: name };
    return { sent: true, event: name };
  } catch (e) {
    return { sent: false, reason: "ga4_erro", event: name }; // não repassa a mensagem: a URL contém o api_secret
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const expected = env.LEADS_TOKEN;
  if (!expected) return json({ ok: false, error: "Desativado: defina LEADS_TOKEN." }, 403);

  const auth = request.headers.get("Authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || bearer;
  if (token !== expected) return json({ ok: false, error: "Não autorizado." }, 401);

  if (!env.DB) return json({ ok: false, error: "Banco D1 não configurado (binding DB)." }, 501);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "JSON inválido." }, 400);
  }

  const id = parseInt(body.id, 10);
  if (!id) return json({ ok: false, error: "id obrigatório." }, 422);

  const status = String(body.status || "qualificado").trim().slice(0, 40);
  const valor = body.valor_negocio !== undefined && body.valor_negocio !== null && body.valor_negocio !== ""
    ? Number(body.valor_negocio) : null;
  if (valor !== null && !Number.isFinite(valor)) return json({ ok: false, error: "valor_negocio inválido." }, 422);
  const convertidoEm = String(
    body.convertido_em || new Date().toISOString().slice(0, 19).replace("T", " ")
  ).trim().slice(0, 40);

  try {
    // lead atual (IDs do GA4 e eventos já enviados). Em bancos ainda sem as colunas do GA4, segue sem elas.
    let lead = null;
    try {
      lead = await env.DB.prepare(
        `SELECT ga_client_id, ga_session_id, ga_eventos, empreendimento_interesse, lead_source_tool, faixa_parcela
         FROM leads WHERE id=?`
      ).bind(id).first();
    } catch (e) {
      if (!/no such column/i.test(String(e && e.message))) throw e;
      lead = await env.DB.prepare(
        `SELECT empreendimento_interesse, lead_source_tool, faixa_parcela FROM leads WHERE id=?`
      ).bind(id).first();
    }
    if (!lead) return json({ ok: false, error: "Lead não encontrado." }, 404);

    const r = await env.DB.prepare(
      `UPDATE leads SET status=?, valor_negocio=?, convertido_em=? WHERE id=?`
    ).bind(status, valor, convertidoEm, id).run();
    if (!r.meta || r.meta.changes === 0) return json({ ok: false, error: "Lead não encontrado." }, 404);

    const ga4 = await sendToGa4(env, id, status, valor, lead);
    if (ga4.sent) {
      const eventos = String(lead.ga_eventos || "").split(",").filter(Boolean).concat(ga4.event).join(",");
      try {
        await env.DB.prepare(`UPDATE leads SET ga_eventos=? WHERE id=?`).bind(eventos, id).run();
      } catch (e) { /* o evento já foi enviado; só perde a trava contra duplicidade */ }
    }
    return json({ ok: true, ga4 });
  } catch (e) {
    return json({ ok: false, error: String(e && e.message) }, 500);
  }
}
