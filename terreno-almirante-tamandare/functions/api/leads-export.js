/**
 * GET /api/leads-export — exporta os leads gravados no D1 (CSV ou JSON).
 *
 * Protegido por token: defina a variável de ambiente LEADS_TOKEN no painel do
 * Cloudflare Pages (Settings → Environment variables). Sem token configurado,
 * o endpoint fica desativado (403). Nunca coloque o token no código do site.
 *
 * Uso:
 *   /api/leads-export?token=SEU_TOKEN            → CSV (abre/baixa em planilha)
 *   /api/leads-export?token=SEU_TOKEN&format=json
 *   /api/leads-export?token=SEU_TOKEN&limit=500
 *   Cabeçalho alternativo: Authorization: Bearer SEU_TOKEN
 */

const COLUMNS = [
  "id", "criado_em", "nome", "telefone", "email", "cidade", "objetivo",
  "faixa_investimento", "forma_pagamento", "prazo", "regiao", "observacoes",
  "empreendimento_interesse", "pagina_origem", "referrer",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "ip", "user_agent",
];

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Autenticação por token
  const expected = env.LEADS_TOKEN;
  if (!expected) {
    return new Response(JSON.stringify({ ok: false, error: "Exportação desativada: defina LEADS_TOKEN." }), {
      status: 403, headers: { "Content-Type": "application/json" },
    });
  }
  const auth = request.headers.get("Authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const token = url.searchParams.get("token") || bearer;
  if (token !== expected) {
    return new Response(JSON.stringify({ ok: false, error: "Não autorizado." }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: "Banco D1 não configurado (binding DB)." }), {
      status: 501, headers: { "Content-Type": "application/json" },
    });
  }

  const limit = Math.min(parseInt(url.searchParams.get("limit") || "1000", 10) || 1000, 10000);
  let rows = [];
  try {
    const res = await env.DB.prepare(
      `SELECT ${COLUMNS.join(",")} FROM leads ORDER BY id DESC LIMIT ?`
    ).bind(limit).all();
    rows = (res && res.results) || [];
  } catch (e) {
    // Tabela ainda não existe → nenhum lead
    if (/no such table/i.test(String(e && e.message))) rows = [];
    else return new Response(JSON.stringify({ ok: false, error: String(e && e.message) }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  const format = (url.searchParams.get("format") || "csv").toLowerCase();
  if (format === "json") {
    return new Response(JSON.stringify({ ok: true, count: rows.length, leads: rows }, null, 2), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const header = COLUMNS.join(",");
  const body = rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(",")).join("\n");
  const csv = "﻿" + header + "\n" + body; // BOM p/ acentos no Excel
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
