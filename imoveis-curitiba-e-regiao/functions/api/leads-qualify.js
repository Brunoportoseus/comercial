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
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...CORS } });

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
    const r = await env.DB.prepare(
      `UPDATE leads SET status=?, valor_negocio=?, convertido_em=? WHERE id=?`
    ).bind(status, valor, convertidoEm, id).run();
    if (!r.meta || r.meta.changes === 0) return json({ ok: false, error: "Lead não encontrado." }, 404);
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: String(e && e.message) }, 500);
  }
}
