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
 *   /api/leads-export?token=SEU_TOKEN&format=gads → CSV pronto para importar como
 *     conversão offline no Google Ads (Ferramentas → Conversões → Uploads → Cliques).
 *     Só inclui leads com status='qualificado' e gclid preenchido (marque isso no
 *     Console do D1, veja schema.sql). Nome da conversão vem de GADS_CONVERSION_NAME
 *     (variável de ambiente) ou do parâmetro &conv_name=; moeda de GADS_CURRENCY
 *     (padrão BRL).
 *   Cabeçalho alternativo: Authorization: Bearer SEU_TOKEN
 */

// Colunas adicionadas depois da criação inicial da tabela — em bancos D1 antigos
// que ainda não gravaram nenhum lead desde o deploy, um SELECT com elas dá erro
// "no such column" até a 1ª gravação migrar a tabela (ver ensureLeadsColumns em lead.js).
const MIGRATABLE_COLUMNS = [
  "gclid", "status", "valor_negocio", "convertido_em",
  "entrada_informada", "faixa_parcela", "simulacao_financeira", "potencial_construtivo",
  "lead_source_tool", "consentimento_texto",
];

const COLUMNS = [
  "id", "criado_em", "nome", "telefone", "email", "cidade", "objetivo",
  "faixa_investimento", "forma_pagamento", "prazo", "regiao", "observacoes",
  "empreendimento_interesse", "pagina_origem", "referrer",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  ...MIGRATABLE_COLUMNS,
  "ip", "user_agent",
];

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

// Converte uma data para o formato exigido pelo Google Ads, no fuso de São Paulo
// (UTC-3, sem horário de verão desde 2019). Aceita: só data ("2026-09-25" → meio-dia
// local), data+hora digitada à mão sem fuso (tratada como horário de Brasília, ex.:
// "2026-09-25 14:30:00", como no exemplo do schema.sql) ou um instante explícito com
// fuso/"Z" (ex.: o "criado_em" salvo em UTC), que aí sim é convertido para -03:00.
function toGAdsTime(v) {
  if (!v) return "";
  const s = String(v).trim();
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
  if (m && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(s)) return `${m[1]} ${m[2]}-03:00`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s} 12:00:00-03:00`;
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  const sp = new Date(d.getTime() - 3 * 3600 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${sp.getUTCFullYear()}-${pad(sp.getUTCMonth() + 1)}-${pad(sp.getUTCDate())} ` +
    `${pad(sp.getUTCHours())}:${pad(sp.getUTCMinutes())}:${pad(sp.getUTCSeconds())}-03:00`;
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
  const format = (url.searchParams.get("format") || "csv").toLowerCase();

  if (format === "gads") {
    const convName = url.searchParams.get("conv_name") || env.GADS_CONVERSION_NAME || "Lead qualificado (offline)";
    const currency = env.GADS_CURRENCY || "BRL";
    let qrows = [];
    try {
      const res = await env.DB.prepare(
        `SELECT gclid, valor_negocio, convertido_em, criado_em FROM leads
         WHERE status='qualificado' AND gclid IS NOT NULL AND gclid != '' ORDER BY id DESC LIMIT ?`
      ).bind(limit).all();
      qrows = (res && res.results) || [];
    } catch (e) {
      // Tabela/colunas ainda não existem (nenhum lead qualificado registrado ainda)
      if (!/no such (table|column)/i.test(String(e && e.message))) {
        return new Response(JSON.stringify({ ok: false, error: String(e && e.message) }), {
          status: 500, headers: { "Content-Type": "application/json" },
        });
      }
    }
    const header = "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency";
    const body = qrows.map((r) => [
      csvCell(r.gclid), csvCell(convName), csvCell(toGAdsTime(r.convertido_em || r.criado_em)),
      csvCell(r.valor_negocio || ""), csvCell(currency),
    ].join(",")).join("\n");
    const csv = "﻿" + header + (body ? "\n" + body : "");
    const date = new Date().toISOString().slice(0, 10);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="google-ads-offline-conversions-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  let rows = [];
  try {
    const res = await env.DB.prepare(
      `SELECT ${COLUMNS.join(",")} FROM leads ORDER BY id DESC LIMIT ?`
    ).bind(limit).all();
    rows = (res && res.results) || [];
  } catch (e) {
    const msg = String(e && e.message);
    if (/no such table/i.test(msg)) {
      rows = [];
    } else if (/no such column|no column named|has no column/i.test(msg)) {
      // Colunas novas ainda não migraram nesta tabela — cai para as colunas
      // originais e completa o resto em branco, sem perder os leads já salvos.
      const LEGACY_COLUMNS = COLUMNS.filter((c) => !MIGRATABLE_COLUMNS.includes(c));
      const blanks = {}; MIGRATABLE_COLUMNS.forEach((c) => { blanks[c] = ""; });
      try {
        const res2 = await env.DB.prepare(
          `SELECT ${LEGACY_COLUMNS.join(",")} FROM leads ORDER BY id DESC LIMIT ?`
        ).bind(limit).all();
        rows = ((res2 && res2.results) || []).map((r) => ({ ...blanks, ...r }));
      } catch (e2) {
        return new Response(JSON.stringify({ ok: false, error: String(e2 && e2.message) }), {
          status: 500, headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      return new Response(JSON.stringify({ ok: false, error: msg }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }
  }

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
