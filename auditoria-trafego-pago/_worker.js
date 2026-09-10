/**
 * Diagnóstico de Tráfego Pago — Worker
 *
 * Rotas de API:
 *   POST /api/lead        → grava um lead do formulário de interesse no D1 (público)
 *   POST /api/login       → autentica o painel /admin (senha em ADMIN_PASSWORD)
 *   POST /api/logout      → encerra a sessão
 *   GET  /api/me          → diz se a sessão está autenticada
 *   GET  /api/leads       → lista os leads (protegido)
 *   GET  /api/leads.csv   → exporta os leads em CSV (protegido)
 *
 * Redireciona 301 os hosts não-canônicos para www.diagnosticotrafegopago.com.br.
 * O resto é servido como asset estático.
 *
 * O binding do banco (env.DB) só existe depois que o D1 for criado e ligado no
 * wrangler.jsonc. Enquanto isso, o site funciona normalmente e /api/lead
 * responde de forma graciosa (o formulário cai no fallback do WhatsApp).
 */

const CANON = "www.diagnosticotrafegopago.com.br";
const REDIRECT = new Set([
  "diagnosticotrafegopago.com.br",
  "auditoriatrafegopago.com.br",
  "www.auditoriatrafegopago.com.br",
]);

const COOKIE = "dtp_sess";
const SESSION_TTL = 60 * 60 * 12; // 12h em segundos

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redireciona hosts não-canônicos para o domínio canônico (SEO).
    if (REDIRECT.has(url.hostname)) {
      url.hostname = CANON;
      return Response.redirect(url.toString(), 301);
    }

    const p = url.pathname.replace(/\/$/, "") || "/";

    try {
      if (p === "/api/lead" && request.method === "POST") return createLead(request, env);
      if (p === "/api/login" && request.method === "POST") return login(request, env);
      if (p === "/api/logout" && request.method === "POST") return logout();
      if (p === "/api/me" && request.method === "GET") return json({ authed: await isAuthed(request, env) });
      if (p === "/api/leads" && request.method === "GET") return listLeads(request, env);
      if (p === "/api/leads.csv" && request.method === "GET") return exportLeads(request, env);
    } catch (err) {
      return json({ error: "internal", detail: String((err && err.message) || err) }, 500);
    }

    return env.ASSETS.fetch(request);
  },
};

/* ───────────────────────── Leads ───────────────────────── */

async function createLead(request, env) {
  const body = await request.json().catch(() => ({}));

  // Honeypot: bots costumam preencher campos ocultos. Se veio preenchido,
  // fingimos sucesso e ignoramos (não gravamos).
  if (body.website) return json({ ok: true, saved: false });

  const nome = clean(body.nome, 120);
  if (!nome) return json({ ok: false, error: "nome_obrigatorio" }, 400);

  const lead = {
    nome,
    empresa: clean(body.empresa, 160),
    whatsapp: clean(body.whatsapp, 40),
    email: clean(body.email, 160),
    site: clean(body.site, 200),
    segmento: clean(body.segmento, 120),
    investimento: clean(body.investimento, 80),
    plataformas: clean(body.plataformas, 200),
    quem: clean(body.quem, 80),
    crm: clean(body.crm, 40),
    pacote: clean(body.pacote, 80),
    dificuldade: clean(body.dificuldade, 2000),
    origem: clean(body.origem, 80) || CANON,
  };

  // Sem banco configurado ainda: não quebra o fluxo do formulário.
  if (!env.DB) return json({ ok: false, saved: false, reason: "db_nao_configurado" });

  const ua = clean(request.headers.get("User-Agent"), 400);
  const ref = clean(request.headers.get("Referer"), 400);
  const ip = clean(request.headers.get("CF-Connecting-IP"), 60);

  await env.DB.prepare(
    `INSERT INTO leads
       (nome, empresa, whatsapp, email, site, segmento, investimento, plataformas, quem, crm, pacote, dificuldade, origem, user_agent, referer, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      lead.nome, lead.empresa, lead.whatsapp, lead.email, lead.site, lead.segmento,
      lead.investimento, lead.plataformas, lead.quem, lead.crm, lead.pacote,
      lead.dificuldade, lead.origem, ua, ref, ip
    )
    .run();

  return json({ ok: true, saved: true });
}

async function listLeads(request, env) {
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  if (!env.DB) return json({ error: "db_nao_configurado" }, 503);
  const { results } = await env.DB.prepare(
    `SELECT id, nome, empresa, whatsapp, email, site, segmento, investimento,
            plataformas, quem, crm, pacote, dificuldade, origem, created_at
     FROM leads ORDER BY created_at DESC, id DESC LIMIT 1000`
  ).all();
  return json({ leads: results || [] });
}

async function exportLeads(request, env) {
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  if (!env.DB) return json({ error: "db_nao_configurado" }, 503);
  const { results } = await env.DB.prepare(
    `SELECT created_at, nome, empresa, whatsapp, email, site, segmento, investimento,
            plataformas, quem, crm, pacote, dificuldade, origem
     FROM leads ORDER BY created_at DESC, id DESC LIMIT 5000`
  ).all();

  const cols = [
    "created_at", "nome", "empresa", "whatsapp", "email", "site", "segmento",
    "investimento", "plataformas", "quem", "crm", "pacote", "dificuldade", "origem",
  ];
  const head = cols.join(",");
  const rows = (results || []).map((r) => cols.map((c) => csvCell(r[c])).join(","));
  const csv = "﻿" + [head, ...rows].join("\r\n"); // BOM p/ acentos no Excel

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-diagnosticotrafegopago.csv"`,
    },
  });
}

/* ───────────────────────── Auth ───────────────────────── */

const enc = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function makeToken(env) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const sig = await hmac(env.AUTH_SECRET || "dev-secret", String(exp));
  return `${exp}.${sig}`;
}

async function isAuthed(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
  if (!match) return false;
  const [exp, sig] = decodeURIComponent(match[1]).split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(env.AUTH_SECRET || "dev-secret", exp);
  return timingSafeEqual(sig, expected);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function login(request, env) {
  const body = await request.json().catch(() => ({}));
  const pass = (body.password || "").toString();
  const expected = env.ADMIN_PASSWORD || "";
  if (!expected) return json({ error: "admin_password_nao_configurada" }, 500);
  if (pass.length !== expected.length || !timingSafeEqual(pass, expected)) {
    return json({ error: "senha_incorreta" }, 401);
  }
  const token = await makeToken(env);
  return json({ ok: true }, 200, {
    "Set-Cookie": `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`,
  });
}

function logout() {
  return json({ ok: true }, 200, {
    "Set-Cookie": `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  });
}

/* ───────────────────────── Helpers ───────────────────────── */

function clean(v, max) {
  if (v == null) return "";
  // remove caracteres de controle (mantem tab, quebras \n e \r)
  const s = String(v).trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return s.length > max ? s.slice(0, max) : s;
}

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}
