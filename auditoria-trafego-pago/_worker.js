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

    const method = request.method;

    try {
      if (p === "/api/lead" && method === "POST") return createLead(request, env);
      if (p === "/api/login" && method === "POST") return login(request, env);
      if (p === "/api/logout" && method === "POST") return logout();
      if (p === "/api/me" && method === "GET") return json({ authed: await isAuthed(request, env) });
      if (p === "/api/leads" && method === "GET") return listLeads(request, env);
      if (p === "/api/leads.csv" && method === "GET") return exportLeads(request, env);

      // ── Sitemap dinâmico (inclui artigos do blog) ──
      if (p === "/sitemap.xml" && method === "GET") return sitemap(env);

      // ── API do Blog ──
      if (p === "/api/blog/posts" && method === "GET") return blogListApi(request, env, url);
      if (p === "/api/blog/posts" && method === "POST") return blogCreate(request, env);
      if (p === "/api/blog/seed" && method === "POST") return blogSeed(request, env);
      const one = p.match(/^\/api\/blog\/posts\/([^/]+)$/);
      if (one && method === "GET") return blogGetApi(decodeURIComponent(one[1]), request, env);
      if (one && method === "PUT") return blogUpdate(decodeURIComponent(one[1]), request, env);
      if (one && method === "DELETE") return blogDelete(decodeURIComponent(one[1]), request, env);

      // ── Páginas do Blog (SSR) ──
      if (method === "GET") {
        if (p === "/blog") return blogIndexPage(env, url);
        const mc = p.match(/^\/blog\/categoria\/([^/]+)$/);
        if (mc) return blogCategoryPage(decodeURIComponent(mc[1]), env, url);
        if (p === "/blog/autor/bruno-porto") return blogAuthorPage(env, url);
        const ma = p.match(/^\/blog\/([^/]+)$/);
        if (ma) return blogArticlePage(decodeURIComponent(ma[1]), env, url);
      }
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

/* ═══════════════════════════════════════════════════════════
   BLOG — Diagnóstico de Tráfego Pago
   ═══════════════════════════════════════════════════════════ */

const CATS = [
  ["diagnostico-de-trafego-pago", "Diagnóstico de tráfego pago"],
  ["google-ads", "Google Ads"],
  ["meta-ads", "Meta Ads"],
  ["leads-e-conversao", "Leads e conversão"],
  ["landing-pages", "Landing pages"],
  ["rastreamento-e-dados", "Rastreamento e dados"],
  ["vendas-e-atendimento", "Vendas e atendimento"],
  ["metricas-e-rentabilidade", "Métricas e rentabilidade"],
  ["agencias-e-gestao-de-trafego", "Agências e gestão de tráfego"],
  ["e-commerce", "E-commerce"],
  ["inteligencia-artificial", "Inteligência artificial"],
  ["estrategia-digital", "Estratégia digital"],
];
const CAT_MAP = Object.fromEntries(CATS);
const catLabel = (s) => CAT_MAP[s] || s || "";

const SITE = "https://www.diagnosticotrafegopago.com.br";
const AUTHOR_NAME = "Bruno Porto Seus";
const AUTHOR_BIO =
  "Bruno Porto atua há mais de 30 anos em negócios e mais de duas décadas no digital, integrando marketing, vendas, e-commerce e inteligência artificial. Realiza diagnósticos independentes de performance em tráfego pago, analisando toda a jornada — da campanha ao processo comercial — para mostrar onde a empresa perde dinheiro entre o anúncio e a venda.";

async function ensurePostsTable(env) {
  if (!env.DB) return false;
  try {
    await env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, subtitle TEXT, category TEXT, tags TEXT, excerpt TEXT, content TEXT NOT NULL, seo_title TEXT, seo_description TEXT, cover TEXT, cover_alt TEXT, author TEXT DEFAULT 'Bruno Porto Seus', reading_time INTEGER, pillar TEXT, related TEXT, cta_type TEXT, featured INTEGER NOT NULL DEFAULT 0, noindex INTEGER NOT NULL DEFAULT 0, published INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')), published_at TEXT)"
    ).run();
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published)").run();
    await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_posts_created ON posts (created_at DESC)").run();
    return true;
  } catch (e) { return false; }
}

/* ---------- helpers de conteúdo ---------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function slugify(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70);
}
function stripTags(s) { return String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
function readingTimeOf(html, given) {
  if (given) return given;
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
function fmtDate(v) {
  if (!v) return "";
  const d = new Date(String(v).replace(" ", "T") + (String(v).includes("Z") ? "" : "Z"));
  if (isNaN(d)) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function isoDate(v) {
  if (!v) return "";
  const d = new Date(String(v).replace(" ", "T") + (String(v).includes("Z") ? "" : "Z"));
  return isNaN(d) ? "" : d.toISOString();
}
function withTocIds(html) {
  const toc = [];
  const out = String(html || "").replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (m, attrs, inner) => {
    const text = stripTags(inner);
    let id = (attrs.match(/id="([^"]+)"/) || [])[1];
    if (!id) { id = slugify(text) || ("sec-" + (toc.length + 1)); attrs += ` id="${id}"`; }
    toc.push({ id, text });
    return `<h2${attrs}>${inner}</h2>`;
  });
  return { html: out, toc };
}
function faqFromContent(html) {
  const faqs = [];
  const re = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<div class="fa">([\s\S]*?)<\/div>\s*<\/details>/g;
  let m;
  while ((m = re.exec(html))) faqs.push({ q: stripTags(m[1]), a: stripTags(m[2]) });
  return faqs;
}

/* ---------- CTAs ---------- */
const CTAS = {
  campanha: { h: "Sua campanha pode estar desperdiçando orçamento sem aparecer no relatório.", p: "Solicite uma análise independente do seu tráfego pago." },
  leads: { h: "Recebe muitos contatos, mas poucos têm perfil de compra?", p: "Descubra se o problema está na segmentação, na promessa ou na qualificação dos leads." },
  conversao: { h: "Os anúncios geram interesse, mas as vendas não acontecem?", p: "O problema pode estar depois do clique — na página, no formulário ou no atendimento." },
  agencia: { h: "Inseguro com os resultados apresentados pela sua agência?", p: "Obtenha uma segunda opinião independente, sem interromper o trabalho dela." },
  rentabilidade: { h: "Suas campanhas estão gerando lucro ou apenas faturamento?", p: "Descubra onde sua empresa perde dinheiro entre o anúncio e a venda." },
  default: { h: "Você investe em tráfego pago, mas está inseguro com os resultados?", p: "Solicite uma análise independente e descubra se o problema está nas campanhas, na qualidade dos leads, na página de destino ou no processo comercial." },
};
function ctaBlock(type) {
  const c = CTAS[type] || CTAS.default;
  return `<div class="article-cta"><h3>${esc(c.h)}</h3><p>${esc(c.p)}</p><a class="btn btn-primary" href="/#form" data-ev="cta_blog_${esc(type || "default")}">Solicitar diagnóstico</a></div>`;
}

/* ---------- shell / layout ---------- */
function waFloat() {
  return `<a class="wa" href="https://wa.me/5541998448989?text=Ol%C3%A1%20Bruno%2C%20quero%20uma%20avalia%C3%A7%C3%A3o%20inicial." target="_blank" rel="noopener" aria-label="Falar no WhatsApp" data-ev="whatsapp_float"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A8 8 0 0 0 4 14.6L3 20l5.5-1a8 8 0 0 0 11.4-7.3 8 8 0 0 0-2.3-5.4Zm-5.6 12.3a6.6 6.6 0 0 1-3.4-.9l-.24-.15-3.3.62.63-3.2-.16-.26A6.65 6.65 0 1 1 12 18.6Z"/></svg></a>`;
}
function bhdr() {
  return `<a class="skip" href="#conteudo">Pular para o conteúdo</a><header class="bhdr"><div class="wrap in"><a class="brand" href="/"><img src="/assets/logo-mark.svg" alt="" width="34" height="34"><div><b>Bruno Porto</b><span>Diagnóstico de Tráfego Pago</span></div></a><nav><a class="hide-sm" href="/blog">Blog</a><a class="hide-sm" href="/#pacotes">Pacotes</a><a class="cta" href="/#form" data-ev="cta_header">Solicitar diagnóstico</a></nav></div></header>`;
}
function bfoot() {
  return `<footer class="bfoot"><div class="wrap"><div class="in"><div><b style="color:#fff;font-family:Sora,sans-serif">Diagnóstico de Tráfego Pago</b><div style="font-size:.8rem;margin-top:.25rem">Análise independente · sem comissão sobre mídia</div></div><nav style="display:flex;gap:1.2rem;flex-wrap:wrap"><a href="/blog">Blog</a><a href="/#pacotes">Pacotes</a><a href="/#faq">Dúvidas</a><a href="/privacidade/">Privacidade</a><a href="https://soubrunoporto.com.br/" target="_blank" rel="noopener">Bruno Porto</a></nav></div><div class="in" style="margin-top:.9rem;font-size:.86rem"><div>📧 <a href="mailto:bruno@soubrunoporto.com.br">bruno@soubrunoporto.com.br</a> &nbsp;·&nbsp; 📞 <a href="tel:+5541998448989">+55 (41) 99844-8989</a></div></div><div class="legal">© ${new Date().getFullYear()} Midialike LTDA · Curitiba/PR. Análise independente, sem comissão sobre mídia e sem vínculo com agências. As recomendações não constituem garantia de resultado.</div></div></footer>`;
}
function shell(o) {
  const ogType = o.ogType || "website";
  const img = o.image ? `<meta property="og:image" content="${esc(o.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${esc(o.image)}">` : "";
  const robots = o.noindex ? `<meta name="robots" content="noindex, follow">` : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${robots}<title>${esc(o.title)}</title><meta name="description" content="${esc(o.description)}"><link rel="canonical" href="${esc(o.canonical)}"><meta name="theme-color" content="#0B172A"><meta property="og:type" content="${ogType}"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Diagnóstico de Tráfego Pago"><meta property="og:title" content="${esc(o.title)}"><meta property="og:description" content="${esc(o.description)}"><meta property="og:url" content="${esc(o.canonical)}">${img}<link rel="icon" type="image/x-icon" href="/assets/favicon.ico"><link rel="preload" as="font" type="font/woff2" href="/assets/fonts/sora-latin.woff2" crossorigin><link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-latin.woff2" crossorigin><link rel="stylesheet" href="/blog.css">${o.headExtra || ""}</head><body>${bhdr()}<main id="conteudo">${o.body}</main>${bfoot()}${waFloat()}<script>window.dataLayer=window.dataLayer||[];document.addEventListener("click",function(e){var a=e.target.closest("[data-ev]");if(a){try{window.dataLayer.push({event:"bp_"+a.getAttribute("data-ev")});}catch(_){}}});</script>${o.bodyScript || ""}</body></html>`;
}
function htmlResp(str, status = 200) {
  return new Response(str, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
function cardImg(post) {
  if (post.cover) return `<div class="img"><img src="${esc(post.cover)}" alt="${esc(post.cover_alt || post.title)}" loading="lazy"></div>`;
  return `<div class="img" style="display:flex;align-items:flex-end;padding:1rem;background:linear-gradient(135deg,#14243A,#21344D)"><span class="cat-pill" style="background:rgba(255,255,255,.12);border-color:transparent;color:#fff">${esc(catLabel(post.category))}</span></div>`;
}
function cardEl(post) {
  const rt = readingTimeOf(post.content || "", post.reading_time);
  return `<article class="card" data-search="${esc((post.title + " " + (post.excerpt || "") + " " + catLabel(post.category) + " " + (post.tags || "")).toLowerCase())}">${cardImg(post)}<div class="body"><span class="cat-pill">${esc(catLabel(post.category))}</span><h3><a href="/blog/${esc(post.slug)}">${esc(post.title)}</a></h3><p>${esc(post.excerpt || "")}</p><div class="meta"><span>${esc(fmtDate(post.published_at || post.created_at))}</span><span>${rt} min de leitura</span></div></div></article>`;
}
function ctaSection() {
  return `<section class="wrap"><div class="cta-block"><div><h2>Você investe em tráfego pago, mas está inseguro com os resultados?</h2><p>Solicite uma análise independente e descubra se o problema está nas campanhas, na qualidade dos leads, na página de destino ou no processo comercial.</p></div><a class="btn btn-primary" href="/#form" data-ev="cta_blog_lista">Quero solicitar um diagnóstico</a></div></section>`;
}
function catsNav(active) {
  return `<nav class="cats" aria-label="Categorias">${CATS.map(([s, l]) => `<a href="/blog/categoria/${s}"${active === s ? ' class="active"' : ""}>${esc(l)}</a>`).join("")}</nav>`;
}

/* ---------- páginas SSR ---------- */
async function fetchPosts(env, { category, limit } = {}) {
  await ensurePostsTable(env);
  await maybeSeed(env);
  if (!env.DB) return [];
  let q = "SELECT slug,title,subtitle,category,tags,excerpt,cover,cover_alt,reading_time,featured,content,created_at,published_at FROM posts WHERE published=1";
  const binds = [];
  if (category) { q += " AND category=?"; binds.push(category); }
  q += " ORDER BY featured DESC, COALESCE(published_at, created_at) DESC";
  if (limit) q += " LIMIT " + Number(limit);
  const { results } = await env.DB.prepare(q).bind(...binds).all();
  return results || [];
}

async function blogIndexPage(env, url) {
  const posts = await fetchPosts(env);
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.slug !== (featured && featured.slug));
  let featHtml = "";
  if (featured) {
    const rt = readingTimeOf(featured.content || "", featured.reading_time);
    featHtml = `<section class="wrap"><article class="feature">${cardImg(featured)}<div class="body"><span class="cat-pill">${esc(catLabel(featured.category))}</span><h2><a href="/blog/${esc(featured.slug)}">${esc(featured.title)}</a></h2><p style="color:var(--muted)">${esc(featured.excerpt || "")}</p><div class="meta"><span>Por ${esc(AUTHOR_NAME)}</span><span>${esc(fmtDate(featured.published_at || featured.created_at))}</span><span>${rt} min de leitura</span></div><p style="margin-top:1rem"><a class="btn btn-primary" href="/blog/${esc(featured.slug)}">Ler artigo</a></p></div></article></section>`;
  }
  const list = rest.length
    ? `<section class="wrap"><div class="grid" id="grid">${rest.map(cardEl).join("")}</div><p class="empty" id="noResults" hidden>Nenhum artigo encontrado para a sua busca.</p></section>`
    : (featured ? "" : `<section class="wrap"><p class="empty">Em breve, os primeiros conteúdos.</p></section>`);
  const body = `<section class="wrap blog-hero"><span class="eyebrow">Blog</span><h1>Conteúdos sobre tráfego pago, leads, vendas e rentabilidade</h1><p>Entenda onde suas campanhas podem estar perdendo dinheiro e aprenda a avaliar os resultados do tráfego pago além dos cliques e das métricas das plataformas.</p><div class="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><input id="q" type="search" placeholder="Qual é a sua dúvida sobre tráfego pago?" aria-label="Buscar no blog"></div>${catsNav("")}</section>${featHtml}${ctaSection()}${list}`;
  const bodyScript = `<script>(function(){var q=document.getElementById("q"),g=document.getElementById("grid"),nr=document.getElementById("noResults");if(!q||!g)return;q.addEventListener("input",function(){var v=q.value.trim().toLowerCase();var n=0;g.querySelectorAll(".card").forEach(function(c){var ok=!v||(c.getAttribute("data-search")||"").indexOf(v)>-1;c.hidden=!ok;if(ok)n++;});if(nr)nr.hidden=n>0;});})();</script>`;
  return htmlResp(shell({
    title: "Blog · Diagnóstico de Tráfego Pago | Bruno Porto",
    description: "Conteúdos sobre tráfego pago, leads, conversão, vendas e rentabilidade para empresários que investem em Google Ads e Meta Ads e querem avaliar os resultados.",
    canonical: SITE + "/blog", body, bodyScript,
  }));
}

async function blogCategoryPage(cat, env, url) {
  if (!CAT_MAP[cat]) return htmlResp(notFoundBody(), 404);
  const posts = await fetchPosts(env, { category: cat });
  const list = posts.length
    ? `<div class="grid">${posts.map(cardEl).join("")}</div>`
    : `<p class="empty">Ainda não há artigos nesta categoria. <a href="/blog">Ver todos os conteúdos</a>.</p>`;
  const body = `<section class="wrap blog-hero"><nav class="breadcrumb"><a href="/">Início</a> › <a href="/blog">Blog</a> › <span>${esc(catLabel(cat))}</span></nav><span class="eyebrow">Categoria</span><h1>${esc(catLabel(cat))}</h1>${catsNav(cat)}</section><section class="wrap">${list}</section>${ctaSection()}`;
  const ld = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog" },
    { "@type": "ListItem", position: 3, name: catLabel(cat), item: SITE + "/blog/categoria/" + cat },
  ] };
  return htmlResp(shell({
    title: catLabel(cat) + " · Blog | Diagnóstico de Tráfego Pago",
    description: "Artigos sobre " + catLabel(cat).toLowerCase() + " para empresários que investem em tráfego pago e querem avaliar os resultados.",
    canonical: SITE + "/blog/categoria/" + cat, body,
    headExtra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  }));
}

async function blogAuthorPage(env, url) {
  const posts = await fetchPosts(env, { limit: 12 });
  const list = posts.length ? `<div class="grid">${posts.map(cardEl).join("")}</div>` : "";
  const body = `<section class="wrap blog-hero"><nav class="breadcrumb"><a href="/">Início</a> › <a href="/blog">Blog</a> › <span>Autor</span></nav><div class="author-box" style="margin-top:1rem"><img src="/assets/bruno.jpg" alt="Foto de Bruno Porto" width="72" height="72"><div><h3>Bruno Porto Seus</h3><p>${esc(AUTHOR_BIO)}</p><p style="margin-top:.7rem;display:flex;gap:1rem;flex-wrap:wrap"><a href="https://soubrunoporto.com.br/" target="_blank" rel="noopener">Site oficial</a><a href="https://www.linkedin.com/in/brunoportoseus/" target="_blank" rel="noopener">LinkedIn</a></p></div></div><h2 style="margin:2rem 0 1rem">Artigos publicados</h2>${list}</section>${ctaSection()}`;
  const ld = { "@context": "https://schema.org", "@type": "Person", name: AUTHOR_NAME, url: SITE + "/blog/autor/bruno-porto", description: AUTHOR_BIO, image: SITE + "/assets/bruno.jpg", sameAs: ["https://soubrunoporto.com.br/", "https://www.linkedin.com/in/brunoportoseus/"] };
  return htmlResp(shell({
    title: "Bruno Porto · Autor | Diagnóstico de Tráfego Pago",
    description: "Bruno Porto — 30+ anos em negócios e mais de duas décadas no digital. Diagnóstico independente de performance em tráfego pago.",
    canonical: SITE + "/blog/autor/bruno-porto", body,
    headExtra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  }));
}

async function blogArticlePage(slug, env, url) {
  await ensurePostsTable(env);
  await maybeSeed(env);
  if (!env.DB) return htmlResp(notFoundBody(), 404);
  const post = await env.DB.prepare("SELECT * FROM posts WHERE slug=? AND published=1").bind(slug).first();
  if (!post) return htmlResp(notFoundBody(), 404);

  const { html: contentHtml, toc } = withTocIds(post.content || "");
  const rt = readingTimeOf(post.content || "", post.reading_time);
  const canonical = SITE + "/blog/" + post.slug;
  const pub = isoDate(post.published_at || post.created_at);
  const upd = isoDate(post.updated_at || post.published_at || post.created_at);

  const tocHtml = toc.length
    ? `<div class="toc-mobile"><details><summary>Neste artigo</summary><ul>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ul></details></div>`
    : "";
  const tocSide = toc.length
    ? `<aside class="toc-side"><div class="lbl">Neste artigo</div><ul>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join("")}</ul></aside>`
    : "<aside></aside>";

  // relacionados
  let related = [];
  const relSlugs = (post.related || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (relSlugs.length) {
    const ph = relSlugs.map(() => "?").join(",");
    const r = await env.DB.prepare(`SELECT slug,title,excerpt,category,cover,cover_alt,reading_time,content,created_at,published_at FROM posts WHERE published=1 AND slug IN (${ph})`).bind(...relSlugs).all();
    related = r.results || [];
  }
  if (related.length < 2 && post.category) {
    const r = await env.DB.prepare("SELECT slug,title,excerpt,category,cover,cover_alt,reading_time,content,created_at,published_at FROM posts WHERE published=1 AND category=? AND slug<>? ORDER BY COALESCE(published_at,created_at) DESC LIMIT 3").bind(post.category, post.slug).all();
    for (const p of (r.results || [])) if (!related.find((x) => x.slug === p.slug)) related.push(p);
  }
  related = related.slice(0, 3);
  const relatedHtml = related.length
    ? `<section class="related"><h2>Continue lendo</h2><div class="grid">${related.map(cardEl).join("")}</div></section>`
    : "";

  const shareUrl = encodeURIComponent(canonical);
  const shareTxt = encodeURIComponent(post.title);
  const share = `<div class="share"><span>Compartilhar:</span><a href="https://wa.me/?text=${shareTxt}%20${shareUrl}" target="_blank" rel="noopener" data-ev="share_wa">WhatsApp</a><a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener" data-ev="share_li">LinkedIn</a><a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener" data-ev="share_fb">Facebook</a></div>`;

  const cover = post.cover
    ? `<figure class="article-cover"><img src="${esc(post.cover)}" alt="${esc(post.cover_alt || post.title)}" width="1120" height="560"></figure>`
    : "";

  const body = `<article class="article-wrap"><nav class="breadcrumb"><a href="/">Início</a> › <a href="/blog">Blog</a>${post.category ? ` › <a href="/blog/categoria/${esc(post.category)}">${esc(catLabel(post.category))}</a>` : ""} › <span>${esc(post.title)}</span></nav><header class="article-head">${post.category ? `<span class="cat-pill">${esc(catLabel(post.category))}</span>` : ""}<h1>${esc(post.title)}</h1>${post.subtitle ? `<p class="sub">${esc(post.subtitle)}</p>` : ""}<div class="byline"><img src="/assets/bruno.jpg" alt="Foto de Bruno Porto" width="44" height="44"><div class="who"><b>${esc(post.author || AUTHOR_NAME)}</b><span>Publicado em ${esc(fmtDate(post.published_at || post.created_at))} · ${post.updated_at && post.updated_at !== post.created_at ? "Atualizado em " + esc(fmtDate(post.updated_at)) + " · " : ""}${rt} min de leitura</span></div></div>${cover}</header></article><div class="article-wrap"><div class="article-layout"><div class="prose">${tocHtml}${contentHtml}${ctaBlock(post.cta_type)}<div class="author-box"><img src="/assets/bruno.jpg" alt="Foto de Bruno Porto" width="72" height="72"><div><h3>Sobre o autor · ${esc(AUTHOR_NAME)}</h3><p>${esc(AUTHOR_BIO)}</p></div></div>${share}${relatedHtml}</div>${tocSide}</div></div>`;

  // structured data
  const ld = [{
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.seo_description || post.excerpt || "",
    image: post.cover || SITE + "/assets/og-card.jpg",
    datePublished: pub, dateModified: upd,
    author: { "@type": "Person", name: AUTHOR_NAME, url: "https://soubrunoporto.com.br/" },
    publisher: { "@type": "Person", name: AUTHOR_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    articleSection: catLabel(post.category), inLanguage: "pt-BR",
  }, {
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog" },
      ...(post.category ? [{ "@type": "ListItem", position: 3, name: catLabel(post.category), item: SITE + "/blog/categoria/" + post.category }] : []),
      { "@type": "ListItem", position: post.category ? 4 : 3, name: post.title, item: canonical },
    ],
  }];
  const faqs = faqFromContent(post.content || "");
  if (faqs.length) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

  const headExtra = ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join("") +
    `<meta property="article:published_time" content="${esc(pub)}"><meta property="article:modified_time" content="${esc(upd)}"><meta property="article:author" content="${esc(AUTHOR_NAME)}">`;

  return htmlResp(shell({
    title: (post.seo_title || post.title) + " | Diagnóstico de Tráfego Pago",
    description: post.seo_description || post.excerpt || "",
    canonical, ogType: "article", image: post.cover || SITE + "/assets/og-card.jpg",
    noindex: !!post.noindex, headExtra, body,
  }));
}

function notFoundBody() {
  return shell({
    title: "Página não encontrada | Diagnóstico de Tráfego Pago",
    description: "Conteúdo não encontrado.", canonical: SITE + "/blog", noindex: true,
    body: `<section class="wrap blog-hero"><h1>Conteúdo não encontrado</h1><p>O artigo que você procura pode ter sido movido ou ainda não foi publicado.</p><p style="margin-top:1.2rem"><a class="btn btn-primary" href="/blog">Ver todos os conteúdos</a></p></section>`,
  });
}

/* ---------- API do blog ---------- */
async function blogListApi(request, env, url) {
  await ensurePostsTable(env);
  const authed = await isAuthed(request, env);
  const q = (url.searchParams.get("q") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  let sql = "SELECT slug,title,category,tags,excerpt,cover,featured,published,created_at,updated_at,published_at FROM posts";
  const conds = [], binds = [];
  if (!authed) conds.push("published=1");
  if (category) { conds.push("category=?"); binds.push(category); }
  if (q) { conds.push("(lower(title) LIKE ? OR lower(excerpt) LIKE ? OR lower(tags) LIKE ?)"); const t = "%" + q.toLowerCase() + "%"; binds.push(t, t, t); }
  if (conds.length) sql += " WHERE " + conds.join(" AND ");
  sql += " ORDER BY featured DESC, COALESCE(published_at,created_at) DESC LIMIT 200";
  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return json({ posts: results || [] });
}
async function blogGetApi(slug, request, env) {
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  await ensurePostsTable(env);
  const row = await env.DB.prepare("SELECT * FROM posts WHERE slug=?").bind(slug).first();
  if (!row) return json({ error: "not_found" }, 404);
  return json({ post: row });
}
function postFromBody(b) {
  return {
    title: clean(b.title, 200), subtitle: clean(b.subtitle, 300), category: clean(b.category, 60),
    tags: clean(b.tags, 300), excerpt: clean(b.excerpt, 400), content: String(b.content || ""),
    seo_title: clean(b.seo_title, 200), seo_description: clean(b.seo_description, 320),
    cover: clean(b.cover, 400), cover_alt: clean(b.cover_alt, 200),
    author: clean(b.author, 120) || AUTHOR_NAME, reading_time: b.reading_time ? Number(b.reading_time) : null,
    pillar: clean(b.pillar, 120), related: clean(b.related, 400), cta_type: clean(b.cta_type, 40),
    featured: b.featured ? 1 : 0, noindex: b.noindex ? 1 : 0, published: b.published === false ? 0 : 1,
  };
}
async function blogCreate(request, env) {
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  await ensurePostsTable(env);
  const b = await request.json().catch(() => ({}));
  const p = postFromBody(b);
  const slug = slugify(b.slug || p.title);
  if (!slug || !p.title) return json({ error: "titulo_e_slug_obrigatorios" }, 400);
  const exists = await env.DB.prepare("SELECT 1 FROM posts WHERE slug=?").bind(slug).first();
  if (exists) return json({ error: "slug_ja_existe", slug }, 409);
  await env.DB.prepare(
    "INSERT INTO posts (slug,title,subtitle,category,tags,excerpt,content,seo_title,seo_description,cover,cover_alt,author,reading_time,pillar,related,cta_type,featured,noindex,published,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  ).bind(slug, p.title, p.subtitle, p.category, p.tags, p.excerpt, p.content, p.seo_title, p.seo_description, p.cover, p.cover_alt, p.author, p.reading_time, p.pillar, p.related, p.cta_type, p.featured, p.noindex, p.published, p.published ? new Date().toISOString() : null).run();
  return json({ ok: true, slug });
}
async function blogUpdate(slug, request, env) {
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  await ensurePostsTable(env);
  const b = await request.json().catch(() => ({}));
  const cur = await env.DB.prepare("SELECT slug,published,published_at FROM posts WHERE slug=?").bind(slug).first();
  if (!cur) return json({ error: "not_found" }, 404);
  const p = postFromBody(b);
  const newSlug = slugify(b.slug || slug);
  if (newSlug !== slug) {
    const clash = await env.DB.prepare("SELECT 1 FROM posts WHERE slug=?").bind(newSlug).first();
    if (clash) return json({ error: "slug_ja_existe", slug: newSlug }, 409);
  }
  const publishedAt = cur.published_at || (p.published ? new Date().toISOString() : null);
  await env.DB.prepare(
    "UPDATE posts SET slug=?,title=?,subtitle=?,category=?,tags=?,excerpt=?,content=?,seo_title=?,seo_description=?,cover=?,cover_alt=?,author=?,reading_time=?,pillar=?,related=?,cta_type=?,featured=?,noindex=?,published=?,published_at=?,updated_at=datetime('now') WHERE slug=?"
  ).bind(newSlug, p.title, p.subtitle, p.category, p.tags, p.excerpt, p.content, p.seo_title, p.seo_description, p.cover, p.cover_alt, p.author, p.reading_time, p.pillar, p.related, p.cta_type, p.featured, p.noindex, p.published, publishedAt, slug).run();
  return json({ ok: true, slug: newSlug });
}
async function blogDelete(slug, request, env) {
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  await ensurePostsTable(env);
  await env.DB.prepare("DELETE FROM posts WHERE slug=?").bind(slug).run();
  return json({ ok: true });
}
async function blogSeed(request, env) {
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  await ensurePostsTable(env);
  let created = 0, skipped = 0;
  for (const s of SEED_POSTS) {
    const exists = await env.DB.prepare("SELECT 1 FROM posts WHERE slug=?").bind(s.slug).first();
    if (exists) { skipped++; continue; }
    const p = postFromBody(s);
    await env.DB.prepare(
      "INSERT INTO posts (slug,title,subtitle,category,tags,excerpt,content,seo_title,seo_description,cover,cover_alt,author,reading_time,pillar,related,cta_type,featured,noindex,published,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    ).bind(s.slug, p.title, p.subtitle, p.category, p.tags, p.excerpt, p.content, p.seo_title, p.seo_description, p.cover, p.cover_alt, p.author, p.reading_time, p.pillar, p.related, p.cta_type, p.featured, p.noindex, p.published, new Date().toISOString()).run();
    created++;
  }
  return json({ ok: true, created, skipped, total: SEED_POSTS.length });
}

async function insertPost(env, s) {
  const p = postFromBody(s);
  await env.DB.prepare(
    "INSERT INTO posts (slug,title,subtitle,category,tags,excerpt,content,seo_title,seo_description,cover,cover_alt,author,reading_time,pillar,related,cta_type,featured,noindex,published,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
  ).bind(s.slug, p.title, p.subtitle, p.category, p.tags, p.excerpt, p.content, p.seo_title, p.seo_description, p.cover, p.cover_alt, p.author, p.reading_time, p.pillar, p.related, p.cta_type, p.featured, p.noindex, p.published, new Date().toISOString()).run();
}

// Carga automática dos artigos-semente na primeira vez que o blog é aberto
// (só quando a tabela está vazia). Evita depender de POST manual.
let _seedChecked = false;
async function maybeSeed(env) {
  if (_seedChecked || !env.DB) return;
  _seedChecked = true;
  try {
    await ensurePostsTable(env);
    const r = await env.DB.prepare("SELECT COUNT(*) AS c FROM posts").first();
    if (r && Number(r.c) === 0) {
      for (const s of SEED_POSTS) {
        const exists = await env.DB.prepare("SELECT 1 FROM posts WHERE slug=?").bind(s.slug).first();
        if (!exists) await insertPost(env, s);
      }
    }
  } catch (e) {}
}

/* ---------- sitemap dinâmico ---------- */
async function sitemap(env) {
  const urls = [
    { loc: SITE + "/", pri: "1.0", freq: "weekly" },
    { loc: SITE + "/blog", pri: "0.8", freq: "weekly" },
    { loc: SITE + "/blog/autor/bruno-porto", pri: "0.4", freq: "monthly" },
    { loc: SITE + "/privacidade/", pri: "0.3", freq: "yearly" },
  ];
  for (const [s] of CATS) urls.push({ loc: SITE + "/blog/categoria/" + s, pri: "0.5", freq: "weekly" });
  try {
    await ensurePostsTable(env);
    await maybeSeed(env);
    if (env.DB) {
      const { results } = await env.DB.prepare("SELECT slug, COALESCE(updated_at,published_at,created_at) AS lm FROM posts WHERE published=1 ORDER BY lm DESC LIMIT 2000").all();
      for (const r of (results || [])) urls.push({ loc: SITE + "/blog/" + r.slug, pri: "0.7", freq: "monthly", lm: String(r.lm || "").slice(0, 10) });
    }
  } catch (e) {}
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lm ? `<lastmod>${u.lm}</lastmod>` : ""}<changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

/* ---------- artigos-semente (carga inicial) ---------- */
const SEED_POSTS = [
  {
    slug: "muitos-leads-e-poucas-vendas-onde-esta-o-problema",
    title: "Muitos leads e poucas vendas: onde está o problema?",
    subtitle: "Quando o volume de contatos cresce mas o faturamento não acompanha, o gargalo raramente está só no anúncio. Veja como localizar onde o dinheiro se perde.",
    category: "leads-e-conversao",
    tags: "leads,conversão,vendas,qualidade de leads",
    excerpt: "Receber muitos leads e vender pouco é um sintoma, não um diagnóstico. O problema pode estar na segmentação, na promessa do anúncio, na qualificação, na página ou no atendimento.",
    seo_title: "Muitos leads e poucas vendas: onde está o problema?",
    seo_description: "Recebe muitos leads e vende pouco? Entenda as causas mais comuns — segmentação, promessa, qualificação, página e atendimento — e como identificar cada uma.",
    cta_type: "leads",
    featured: 1,
    related: "como-saber-se-o-trafego-pago-esta-funcionando,cliques-nao-sao-vendas-como-avaliar-o-resultado-real",
    content: `<p>Se a sua empresa recebe muitos contatos vindos dos anúncios, mas poucos viram venda, o primeiro passo é entender uma coisa: <strong>quantidade de leads não é qualidade de leads</strong>. Volume alto com venda baixa é um sintoma que pode ter origem em vários pontos diferentes da jornada.</p>
<p>A resposta direta é: o problema pode estar em cinco lugares — na <strong>segmentação</strong>, na <strong>promessa do anúncio</strong>, na <strong>qualificação</strong>, na <strong>página de destino</strong> ou no <strong>atendimento comercial</strong>. Encontrar em qual deles a sua operação está perdendo dinheiro é justamente o trabalho de um diagnóstico.</p>
<h2>As causas mais comuns</h2>
<p>Antes de aumentar ou cortar orçamento, vale investigar cada hipótese com calma.</p>
<h3>1. Segmentação atraindo o público errado</h3>
<p>Se os anúncios alcançam pessoas fora da sua região, fora do seu ticket ou sem intenção de compra, o volume sobe e a qualidade cai. Muitos leads "curiosos" costumam indicar público amplo demais ou mal definido.</p>
<h3>2. Promessa exagerada no anúncio</h3>
<p>Anúncios que prometem "grátis", "barato" ou "sem compromisso" atraem contatos que não têm perfil de compra. O lead entra, mas some quando percebe o preço ou a condição real.</p>
<h3>3. Falta de qualificação</h3>
<p>Formulários curtos demais ou campanhas de mensagem sem nenhuma pergunta de triagem enchem o funil de contatos sem informação. Sem qualificar, o time comercial gasta tempo com quem nunca compraria.</p>
<h3>4. Página de destino desalinhada</h3>
<p>Quando o anúncio promete uma coisa e a página mostra outra, o lead chega confuso. Uma página lenta, sem clareza de oferta ou com formulário ruim também derruba a qualidade de quem chega até o fim.</p>
<h3>5. Atendimento comercial</h3>
<p>Às vezes o lead é bom e o problema está depois: demora para responder, falta de cadência de contato, abordagem fraca. Um lead que espera horas por resposta esfria — e a culpa acaba, injustamente, no tráfego.</p>
<div class="box alert"><div class="box-t">⚠️ Cuidado com a conclusão precoce</div><p>Culpar "o tráfego" ou "a agência" antes de olhar a jornada inteira é o erro mais caro. O mesmo lead pode ser ruim por segmentação ou bom com atendimento ruim — e a decisão muda completamente conforme a causa real.</p></div>
<h2>Como identificar em qual ponto está o problema</h2>
<p>Uma forma simples de começar é comparar o comportamento em cada etapa:</p>
<table><thead><tr><th>Sintoma</th><th>Onde investigar primeiro</th></tr></thead><tbody><tr><td>Muitos contatos fora da região ou sem perfil</td><td>Segmentação e promessa do anúncio</td></tr><tr><td>Leads não respondem depois do primeiro contato</td><td>Qualificação e velocidade de atendimento</td></tr><tr><td>Leads pedem preço e somem</td><td>Oferta, posicionamento e página</td></tr><tr><td>Time comercial diz que "lead é ruim"</td><td>Comparar qualidade por campanha e por anúncio</td></tr></tbody></table>
<p>O ponto-chave é <strong>medir a qualidade por origem</strong>: qual campanha, anúncio ou palavra-chave gera clientes — e não apenas contatos. Sem esse cruzamento entre marketing e vendas, a discussão vira opinião.</p>
<h2>Consequências financeiras de não resolver</h2>
<p>Enquanto a causa não é localizada, dois custos correm juntos: a <strong>verba de mídia</strong> gasta atraindo o público errado e o <strong>tempo do time comercial</strong> consumido com contatos sem perfil. É um desperdício que não aparece claramente no relatório de cliques, mas pesa no caixa.</p>
<h2>Quando procurar uma análise independente</h2>
<p>Se marketing e comercial já apontam o dedo um para o outro, se os relatórios mostram "bons números" mas a venda não vem, ou se você não consegue dizer com clareza <em>qual campanha gera cliente</em>, é hora de uma leitura de fora — que cruza campanhas, qualidade dos leads, página e processo comercial sem defender nenhum lado.</p>
<section class="faq"><h2>Perguntas frequentes</h2>
<details><summary>Muitos leads baratos são bons?</summary><div class="fa">Nem sempre. Lead barato pode sair caro se não tem perfil de compra: consome tempo do time e não converte. O que importa é o custo por cliente, não só o custo por lead.</div></details>
<details><summary>A qualidade dos leads é responsabilidade do gestor de tráfego?</summary><div class="fa">Em parte. A segmentação e a promessa do anúncio influenciam muito a qualidade, mas oferta, página, qualificação e atendimento também. Por isso a análise precisa olhar a jornada inteira.</div></details>
<details><summary>Como saber qual campanha gera vendas, e não só contatos?</summary><div class="fa">Integrando as campanhas ao CRM e registrando o resultado comercial de cada lead. Assim é possível avaliar qualidade por campanha, anúncio e palavra-chave.</div></details>
</section>
<div class="box resume"><div class="box-t">Em resumo</div><p>Muitos leads e poucas vendas é um sintoma com várias causas possíveis: segmentação, promessa, qualificação, página e atendimento. Antes de mexer no orçamento, descubra <strong>em qual ponto</strong> o dinheiro se perde — medindo qualidade por origem e olhando a jornada do anúncio até a venda.</p></div>`,
  },
  {
    slug: "como-saber-se-o-trafego-pago-esta-funcionando",
    title: "Como saber se o tráfego pago está funcionando?",
    subtitle: "Cliques e impressões não respondem a pergunta que importa. Veja como avaliar o resultado real das suas campanhas de forma objetiva.",
    category: "metricas-e-rentabilidade",
    tags: "roas,métricas,resultado,vendas",
    excerpt: "Tráfego pago funcionando não é ter muitos cliques — é gerar vendas com rentabilidade. Veja quais sinais observar além das métricas das plataformas.",
    seo_title: "Como saber se o tráfego pago está funcionando?",
    seo_description: "Descubra como avaliar se o tráfego pago está funcionando de verdade: além de cliques e impressões, o que olhar para medir vendas e rentabilidade.",
    cta_type: "rentabilidade",
    featured: 0,
    related: "muitos-leads-e-poucas-vendas-onde-esta-o-problema,cliques-nao-sao-vendas-como-avaliar-o-resultado-real",
    content: `<p>É comum abrir o painel do Google Ads ou do Meta e ver muitos cliques, impressões e um "ROAS" verde — e ainda assim não ter certeza se a campanha dá resultado. A dúvida é legítima: <strong>as métricas da plataforma medem publicidade, não necessariamente o resultado comercial da sua empresa</strong>.</p>
<p>De forma direta: o tráfego pago está funcionando quando gera <strong>vendas com rentabilidade</strong> — clientes que cabem no seu custo de aquisição e deixam margem. Cliques, curtidas e leads são etapas do caminho, não o destino.</p>
<h2>Por que cliques e impressões enganam</h2>
<p>Esses números mostram <em>alcance</em> e <em>interesse</em>, mas não dizem se houve venda nem se ela foi lucrativa. Uma campanha pode ter CTR alto e custo por clique baixo e, mesmo assim, atrair o público errado. São as chamadas métricas de vaidade: positivas na tela, silenciosas no caixa.</p>
<h2>O que realmente indica que está funcionando</h2>
<ul>
<li><strong>Vendas atribuíveis</strong> às campanhas — e não só conversões no painel.</li>
<li><strong>Custo de aquisição de cliente (CAC)</strong> dentro do que o seu negócio suporta.</li>
<li><strong>Qualidade dos leads</strong>: contatos com perfil real de compra.</li>
<li><strong>Margem</strong> preservada depois de descontar mídia, impostos e custos.</li>
<li><strong>Consistência</strong> ao longo do tempo, não um pico isolado.</li>
</ul>
<div class="box info"><div class="box-t">ℹ️ Conversão no painel ≠ venda</div><p>Uma "conversão" pode ser um clique no botão, um formulário enviado ou uma mensagem iniciada. Isso não é a mesma coisa que uma venda fechada com margem. Confundir os dois é a origem de muitas decisões erradas.</p></div>
<h2>Como avaliar na prática</h2>
<p>Comece respondendo, com dados, a três perguntas:</p>
<table><thead><tr><th>Pergunta</th><th>O que ela revela</th></tr></thead><tbody><tr><td>Quantas vendas vieram de cada campanha?</td><td>Se a mídia gera receita ou só contatos</td></tr><tr><td>Quanto custou para conquistar cada cliente?</td><td>Se o CAC cabe na sua margem</td></tr><tr><td>Esses clientes deram lucro?</td><td>Se a campanha gera rentabilidade, não só faturamento</td></tr></tbody></table>
<p>Para conseguir responder, é preciso que <strong>rastreamento, campanhas e CRM estejam conversando</strong>. Sem isso, o número do painel e a realidade do caixa seguem em mundos separados.</p>
<h2>Consequências de olhar só para o painel</h2>
<p>Decidir aumentar ou cortar verba com base apenas em cliques e conversões da plataforma pode escalar o desperdício ou desligar o que estava dando certo. O risco financeiro não está no número em si — está em confiar no número errado.</p>
<h2>Quando procurar uma análise independente</h2>
<p>Se você não consegue afirmar, com dados, quanto cada campanha vendeu e se deu lucro, um diagnóstico independente ajuda a ligar mídia, rastreamento e vendas — e a responder, de uma vez, se o investimento está funcionando.</p>
<section class="faq"><h2>Perguntas frequentes</h2>
<details><summary>Um ROAS alto significa lucro?</summary><div class="fa">Não necessariamente. O ROAS compara receita e investimento em mídia, mas não considera margem, impostos, custo do produto e devoluções. É possível ter ROAS alto e prejuízo.</div></details>
<details><summary>Quanto tempo até saber se a campanha funciona?</summary><div class="fa">Depende do volume de conversões e do ciclo de venda. Decisões precoces, com poucos dados, costumam levar a conclusões erradas. O importante é ter dados suficientes e consistência.</div></details>
<details><summary>Preciso de ferramentas caras para medir isso?</summary><div class="fa">Não. Na maioria dos casos, o que falta não é ferramenta, e sim organização: rastreamento correto, integração com o CRM e registro do resultado comercial de cada lead.</div></details>
</section>
<div class="box resume"><div class="box-t">Em resumo</div><p>Tráfego pago funcionando é aquele que gera vendas com rentabilidade — não o que tem mais cliques. Avalie vendas atribuíveis, CAC, qualidade dos leads e margem, com rastreamento e CRM integrados, para decidir com número real e não com métrica de vaidade.</p></div>`,
  },
  {
    slug: "cliques-nao-sao-vendas-como-avaliar-o-resultado-real",
    title: "Cliques não são vendas: como avaliar o resultado real do tráfego pago",
    subtitle: "O clique é o começo da jornada, não o fim. Entenda por que separar métricas de mídia dos resultados comerciais muda as suas decisões.",
    category: "metricas-e-rentabilidade",
    tags: "métricas,cliques,vendas,rentabilidade",
    excerpt: "O clique mede interesse; a venda mede resultado. Veja como avaliar o tráfego pago pelo que importa para o caixa da empresa.",
    seo_title: "Cliques não são vendas: como avaliar o resultado real",
    seo_description: "Cliques medem interesse, não faturamento. Aprenda a avaliar o tráfego pago pelo resultado comercial — vendas, CAC e margem — e a decidir com dados.",
    cta_type: "rentabilidade",
    featured: 0,
    related: "como-saber-se-o-trafego-pago-esta-funcionando,muitos-leads-e-poucas-vendas-onde-esta-o-problema",
    content: `<p>Todo relatório de tráfego pago começa mostrando cliques. O problema é quando ele <strong>termina</strong> ali. O clique indica que alguém teve interesse suficiente para tocar no anúncio — é um bom sinal, mas está a vários passos de uma venda.</p>
<p>Direto ao ponto: para avaliar o resultado real, você precisa acompanhar a jornada além do clique — <strong>lead, oportunidade, venda e margem</strong>. Cada etapa perde parte das pessoas, e é no conjunto que se descobre se a mídia dá retorno.</p>
<h2>A distância entre o clique e a venda</h2>
<p>Entre clicar e comprar, existem etapas onde o resultado pode escorrer:</p>
<ul>
<li>O clique vira <strong>visita</strong> — e a página pode não convencer.</li>
<li>A visita vira <strong>lead</strong> — e o formulário pode filtrar mal.</li>
<li>O lead vira <strong>oportunidade</strong> — se o atendimento for rápido e bom.</li>
<li>A oportunidade vira <strong>venda</strong> — se a oferta e o preço fizerem sentido.</li>
<li>A venda gera <strong>margem</strong> — ou apenas faturamento sem lucro.</li>
</ul>
<div class="box tip"><div class="box-t">✓ Boa prática</div><p>Monte uma visão simples do funil com números de cada etapa. Onde houver a maior queda, provavelmente está a maior oportunidade de ganho — e nem sempre é no anúncio.</p></div>
<h2>Métricas de mídia x métricas de negócio</h2>
<table><thead><tr><th>Métricas de mídia</th><th>Métricas de negócio</th></tr></thead><tbody><tr><td>Impressões, cliques, CTR, CPC</td><td>Leads qualificados, vendas, CAC</td></tr><tr><td>Conversões no painel</td><td>Receita atribuível e margem</td></tr><tr><td>ROAS da plataforma</td><td>Lucro por campanha</td></tr></tbody></table>
<p>As métricas de mídia são úteis para <em>operar</em> a campanha. As de negócio são as que respondem se <strong>vale a pena</strong>. Um bom acompanhamento usa as duas — mas decide pela segunda.</p>
<h2>Consequências de decidir pelo clique</h2>
<p>Escalar uma campanha "porque o CPC está baixo" pode significar comprar mais tráfego que não vende. Cortar uma "porque teve poucos cliques" pode desligar a que trazia os melhores clientes. A decisão baseada no clique isolado é uma aposta às cegas.</p>
<h2>Quando procurar uma análise independente</h2>
<p>Se o seu relatório para no clique ou na conversão do painel, e você ainda não enxerga vendas e margem por campanha, um diagnóstico independente ajuda a reconstruir o funil completo e a mostrar onde o investimento perde eficiência.</p>
<section class="faq"><h2>Perguntas frequentes</h2>
<details><summary>Então cliques não servem para nada?</summary><div class="fa">Servem, sim — para operar e otimizar campanhas no dia a dia. O que não se deve é decidir se o investimento vale a pena olhando apenas para cliques, sem ligar à venda.</div></details>
<details><summary>Como ligar o clique à venda?</summary><div class="fa">Com rastreamento correto e integração ao CRM, registrando a origem de cada lead e o desfecho comercial. Assim é possível atribuir vendas e margem a cada campanha.</div></details>
</section>
<div class="box resume"><div class="box-t">Em resumo</div><p>Cliques medem interesse; vendas medem resultado. Avalie o tráfego pago pela jornada completa — lead, oportunidade, venda e margem — e decida pelas métricas de negócio, não pelas de mídia isoladas.</p></div>`,
  },
];
