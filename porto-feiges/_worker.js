/**
 * Porto & Feiges — Worker
 * Roteia:
 *   /api/*            → API do admin (auth, posts CRUD, upload de imagem)
 *   /blog/posts/:slug → SSR do post a partir do D1 (bom para SEO / preview no WhatsApp)
 *   resto            → assets estáticos (landing, /blog/, /admin/, css, imagens)
 */

const COOKIE = "pf_sess";
const SESSION_TTL = 60 * 60 * 12; // 12h em segundos

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;

    try {
      if (p === "/api" || p.startsWith("/api/")) {
        return await handleApi(request, env, url);
      }
      // SSR de post individual a partir do D1
      const m = p.match(/^\/blog\/posts\/([^/]+)\/?$/);
      if (m && env.DB) {
        const res = await renderPost(decodeURIComponent(m[1]), env);
        if (res) return res;
        // se não achou no D1, cai para 404 estático
      }
    } catch (err) {
      return json({ error: "internal", detail: String(err && err.message || err) }, 500);
    }

    return env.ASSETS.fetch(request);
  },
};

/* ───────────────────────── API ───────────────────────── */

async function handleApi(request, env, url) {
  const p = url.pathname.replace(/\/$/, "");
  const method = request.method;

  // rotas públicas
  if (p === "/api/posts" && method === "GET")      return listPosts(request, env, url);
  if (p === "/api/login" && method === "POST")     return login(request, env);
  if (p === "/api/logout" && method === "POST")    return logout();
  if (p === "/api/me" && method === "GET")         return json({ authed: await isAuthed(request, env) });

  // servir imagem do R2 (público)
  const img = p.match(/^\/api\/images\/(.+)$/);
  if (img && method === "GET")                     return serveImage(decodeURIComponent(img[1]), env);

  // rota pública: post individual (usada pelo admin e por fetch)
  const one = p.match(/^\/api\/posts\/(.+)$/);
  if (one && method === "GET")                     return getPost(one[1], env);

  // ─── daqui em diante exige auth ───
  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);

  if (p === "/api/posts" && method === "POST")     return createPost(request, env);
  if (p === "/api/upload" && method === "POST")    return uploadImage(request, env);
  if (p === "/api/seed" && method === "POST")      return seedPosts(env);
  if (one && method === "PUT")                     return updatePost(one[1], request, env);
  if (one && method === "DELETE")                  return deletePost(one[1], env);

  return json({ error: "not_found" }, 404);
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
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL}`,
    },
  });
}

function logout() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
    },
  });
}

/* ───────────────────────── Posts CRUD ───────────────────────── */

function slugify(s) {
  return (s || "")
    .toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

async function listPosts(request, env, url) {
  if (!env.DB) return json({ posts: [] });
  await ensureSeeded(env); // carrega as matérias iniciais na primeira visita
  const all = url.searchParams.get("all") === "1" && (await isAuthed(request, env));
  const where = all ? "" : "WHERE published = 1";
  const { results } = await env.DB.prepare(
    `SELECT slug, title, deck, tags, cover, published FROM posts ${where} ORDER BY created_at DESC`
  ).all();
  return json({ posts: results || [] });
}

async function getPost(slug, env) {
  if (!env.DB) return json({ error: "sem_banco" }, 500);
  const row = await env.DB.prepare(`SELECT * FROM posts WHERE slug = ?`).bind(slug).first();
  if (!row) return json({ error: "not_found" }, 404);
  return json({ post: row });
}

async function createPost(request, env) {
  if (!env.DB) return json({ error: "sem_banco" }, 500);
  const b = await request.json().catch(() => ({}));
  const title = (b.title || "").trim();
  if (!title) return json({ error: "titulo_obrigatorio" }, 400);
  const slug = slugify(b.slug || title);
  if (!slug) return json({ error: "slug_invalido" }, 400);
  const exists = await env.DB.prepare(`SELECT 1 FROM posts WHERE slug = ?`).bind(slug).first();
  if (exists) return json({ error: "slug_ja_existe", slug }, 409);
  await env.DB.prepare(
    `INSERT INTO posts (slug, title, deck, tags, cover, content, published)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    slug, title, b.deck || "", normTags(b.tags), b.cover || "", b.content || "",
    b.published === false ? 0 : 1
  ).run();
  return json({ ok: true, slug });
}

async function updatePost(slug, request, env) {
  if (!env.DB) return json({ error: "sem_banco" }, 500);
  const b = await request.json().catch(() => ({}));
  const row = await env.DB.prepare(`SELECT slug FROM posts WHERE slug = ?`).bind(slug).first();
  if (!row) return json({ error: "not_found" }, 404);
  const newSlug = b.slug ? slugify(b.slug) : slug;
  if (newSlug !== slug) {
    const clash = await env.DB.prepare(`SELECT 1 FROM posts WHERE slug = ?`).bind(newSlug).first();
    if (clash) return json({ error: "slug_ja_existe", slug: newSlug }, 409);
  }
  await env.DB.prepare(
    `UPDATE posts SET slug=?, title=?, deck=?, tags=?, cover=?, content=?, published=?, updated_at=datetime('now')
     WHERE slug=?`
  ).bind(
    newSlug, (b.title || "").trim(), b.deck || "", normTags(b.tags), b.cover || "",
    b.content || "", b.published === false ? 0 : 1, slug
  ).run();
  return json({ ok: true, slug: newSlug });
}

async function deletePost(slug, env) {
  if (!env.DB) return json({ error: "sem_banco" }, 500);
  await env.DB.prepare(`DELETE FROM posts WHERE slug = ?`).bind(slug).run();
  return json({ ok: true });
}

function normTags(t) {
  if (Array.isArray(t)) return t.join(",");
  return (t || "").toString().split(",").map((x) => x.trim().toLowerCase()).filter(Boolean).join(",");
}

/* ───────────────────────── Imagens (R2) ───────────────────────── */

async function uploadImage(request, env) {
  if (!env.IMAGES) return json({ error: "sem_bucket" }, 500);
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return json({ error: "sem_arquivo" }, 400);
  const type = file.type || "application/octet-stream";
  if (!/^image\//.test(type)) return json({ error: "tipo_invalido" }, 400);
  const ext = (type.split("/")[1] || "bin").replace("jpeg", "jpg");
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await env.IMAGES.put(key, file.stream(), { httpMetadata: { contentType: type } });
  return json({ ok: true, url: `/api/images/${key}` });
}

async function serveImage(key, env) {
  if (!env.IMAGES) return new Response("sem bucket", { status: 500 });
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response("nao encontrada", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("etag", obj.httpEtag);
  return new Response(obj.body, { headers });
}

/* ───────────────────────── SSR do post ───────────────────────── */

function esc(s) {
  return (s || "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const NAV = `
<nav class="nav"><div class="wrap nav-inner">
  <a href="/" class="nav-brand"><img src="/assets/Logo%20Porto%20e%20Feiges_branca.png" alt="Porto & Feiges" onerror="this.onerror=null;this.src='/assets/logo.svg'" /></a>
  <button class="nav-toggle" id="navToggle" aria-label="Abrir menu" aria-expanded="false">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
  </button>
  <div class="nav-links" id="navLinks">
    <a href="/#problema">O problema</a>
    <a href="/#servicos">O que fazemos</a>
    <a href="/#metodo">Método</a>
    <a href="/#quem">Quem somos</a>
    <a href="/blog/" class="active">Blog</a>
    <a href="/#contato" class="nav-cta">Agendar diagnóstico</a>
  </div>
</div></nav>`;

const FOOTER = `
<footer class="blog-footer"><div class="wrap footer-inner">
  <span class="footer-brand">Porto &amp; Feiges</span>
  <span class="footer-right">Curitiba/PR</span>
</div></footer>`;

const WPP_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L.057 23.882l6.174-1.621A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.016-1.374l-.36-.213-3.664.96.978-3.578-.233-.371A9.818 9.818 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/></svg>`;

const ARROW = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

function chipsHtml(tags) {
  return (tags || "").split(",").map((t) => t.trim()).filter(Boolean)
    .map((t) => `<span class="chip">${esc(cap(t))}</span>`).join("");
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

async function renderPost(slug, env) {
  const post = await env.DB.prepare(`SELECT * FROM posts WHERE slug = ? AND published = 1`).bind(slug).first();
  if (!post) return null;

  const { results: rel } = await env.DB.prepare(
    `SELECT slug, title, deck, tags FROM posts WHERE slug != ? AND published = 1 ORDER BY created_at DESC LIMIT 2`
  ).bind(slug).all();

  const relatedHtml = (rel || []).map((r) => `
    <a href="/blog/posts/${esc(r.slug)}/" class="post-card">
      <div class="post-chips">${chipsHtml(r.tags)}</div>
      <h2>${esc(r.title)}</h2>
      <p>${esc(r.deck || "")}</p>
      <span class="post-cta">Ler ${ARROW}</span>
    </a>`).join("");

  const wppMsg = encodeURIComponent(`Oi, li o artigo "${post.title}" no blog da Porto & Feiges e quero agendar um diagnóstico`);
  const coverHtml = post.cover
    ? `<img src="${esc(post.cover)}" alt="${esc(post.title)}" style="border-radius:10px;margin:0 0 2rem;width:100%;object-fit:cover;max-height:420px" />`
    : "";

  const html = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${esc(post.title)} — Blog Porto & Feiges</title>
<meta name="description" content="${esc(post.deck || post.title)}" />
<meta property="og:title" content="${esc(post.title)}" />
<meta property="og:description" content="${esc(post.deck || "")}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://portoefeiges.com.br/blog/posts/${esc(post.slug)}/" />
${post.cover ? `<meta property="og:image" content="${esc(post.cover)}" />` : ""}
<link rel="icon" href="/assets/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/blog/blog.css" />
</head>
<body>
${NAV}
<header class="post-header"><div class="wrap">
  <a href="/blog/" class="back-link"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Blog</a>
  <div class="post-chips">${chipsHtml(post.tags)}</div>
  <h1>${esc(post.title)}</h1>
  <p class="post-deck">${esc(post.deck || "")}</p>
</div></header>
<section class="post-body"><div class="wrap">
  <div class="post-content">
    ${coverHtml}
    ${post.content}
    <div class="post-cta-inline">
      <p><strong>Quer entender o que está travando a sua operação?</strong><br>Uma conversa de 1h já dá clareza para agir.</p>
      <a href="https://wa.me/5541999999999?text=${wppMsg}" class="btn-wpp" target="_blank" rel="noopener">${WPP_ICON} Agendar diagnóstico</a>
    </div>
  </div>
  ${relatedHtml ? `<div class="related-posts"><h2>Leia também</h2><div class="related-grid">${relatedHtml}</div></div>` : ""}
</div></section>
${FOOTER}
<script>
  var t=document.getElementById('navToggle'),l=document.getElementById('navLinks');
  t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o);});
</script>
</body>
</html>`;

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

/* ───────────────────────── Seed ───────────────────────── */

// Garante que as matérias base existam. Insere apenas os slugs do SEED que
// ainda não estão no banco (idempotente, sem auth). Não sobrescreve edições
// feitas no admin. Retorna quantas foram inseridas.
async function ensureSeeded(env) {
  if (!env.DB) return 0;
  const { results } = await env.DB.prepare(`SELECT slug FROM posts`).all();
  const existentes = new Set((results || []).map((r) => r.slug));
  let inseridos = 0;
  for (const post of SEED) {
    if (existentes.has(post.slug)) continue;
    await env.DB.prepare(
      `INSERT OR IGNORE INTO posts (slug, title, deck, tags, cover, content, published) VALUES (?, ?, ?, ?, ?, ?, 1)`
    ).bind(post.slug, post.title, post.deck, post.tags, post.cover || "", post.content).run();
    inseridos++;
  }
  return inseridos;
}

async function seedPosts(env) {
  if (!env.DB) return json({ error: "sem_banco" }, 500);
  const inserted = await ensureSeeded(env);
  return json({ ok: true, inseridos: inserted, skipped: inserted === 0 });
}

const SEED = [
  {
    slug: "do-improviso-ao-sistema",
    title: "Do improviso ao sistema: o que muda na prática",
    deck: "Não é sobre tecnologia nem sobre contratar mais gente. É sobre instalar a lógica que faz a operação se repetir sem o dono no centro de tudo.",
    tags: "método",
    cover: "/assets/blog/do-improviso.svg",
    content: `
<p>A maioria das PMEs que atendemos cresceu com o dono na linha de frente. Ele vende, ele decide, ele resolve. É uma força enorme no começo — e um teto invisível depois.</p>
<p>Quando o negócio depende de uma pessoa para funcionar, ele não cresce além dessa pessoa. Ela pode trabalhar mais horas, mas o limite é físico. A alternativa não é contratar mais gente: é mudar como as coisas são feitas.</p>
<h2>O que significa "ter sistema"</h2>
<p>Sistema não é ERP. Não é planilha. Não é software de gestão. <strong>Sistema é a lógica documentada de como as coisas acontecem</strong> — independente de quem está executando.</p>
<p>Quando você tem sistema, um novo vendedor sabe o que fazer depois de receber um lead. O atendente sabe como tratar uma reclamação. O gerente sabe qual relatório olhar na segunda de manhã para saber se a semana vai ser boa ou ruim.</p>
<blockquote>A empresa que só funciona com o dono presente não é uma empresa — é um emprego com CNPJ.</blockquote>
<h2>Três sinais de que você ainda está no improviso</h2>
<h3>1. Você não sabe o que gerou a venda do mês passado</h3>
<p>Mês bom aconteceu. Mas você não sabe se foi o post do Instagram, a indicação ou o vendedor que liga mais. Sem rastrear a origem, você não consegue repetir.</p>
<h3>2. Sua equipe te procura para decidir coisas simples</h3>
<p>Desconto acima de 10%: chama o dono. Prazo fora do padrão: chama o dono. Cada chamado interrompe seu raciocínio e consome energia que deveria ir para crescimento.</p>
<h3>3. O onboarding de um novo funcionário é "observar quem já faz"</h3>
<p>Sem processo documentado, o conhecimento fica na cabeça das pessoas. Quando alguém sai, vai junto. Quando alguém entra, leva meses para entender como as coisas funcionam.</p>
<h2>Por onde começa a mudança</h2>
<p>O ponto de partida não é a ferramenta. É o diagnóstico: quais processos acontecem com mais frequência e mais impacto no resultado? Começa por aí. Mapeia como acontece hoje — com todos os atalhos que ninguém fala em reunião. Depois pergunta: <strong>como isso deveria acontecer</strong> para ser confiável e repetível?</p>
<h2>O que a instalação do sistema libera</h2>
<p>Quando o sistema está rodando, o dono para de ser operação e começa a ser gestor. Olha para os indicadores, decide com dado, e dedica tempo ao que só ele pode fazer. É isso que a passagem do improviso para o sistema representa — não menos trabalho, mas <strong>trabalho que escala.</strong></p>`,
  },
  {
    slug: "crm-que-funciona",
    title: "CRM que funciona para PME: o que importa antes de escolher a ferramenta",
    deck: "A maioria das implementações de CRM falha antes de começar. O erro não é de sistema — é de processo. O que resolver primeiro.",
    tags: "crm,vendas",
    cover: "/assets/blog/crm.svg",
    content: `
<p>Toda semana alguém nos procura com a mesma história: "A gente tentou implementar CRM. Ficou seis meses, a equipe odiou, abandonamos. Qual sistema você recomenda?"</p>
<p>A resposta que ninguém quer ouvir: o problema provavelmente não era o sistema.</p>
<h2>Por que a maioria dos CRMs falha em PMEs</h2>
<p>CRM falha por uma razão simples: <strong>você não pode automatizar um processo que não existe</strong>. Se a equipe de vendas não tem funil definido, critérios de qualificação nem cadência de follow-up, instalar CRM só digitaliza o caos.</p>
<blockquote>CRM é memória. Mas você precisa primeiro decidir o que é digno de ser lembrado.</blockquote>
<h2>O que resolver antes de contratar a ferramenta</h2>
<h3>Defina o seu funil de vendas real</h3>
<p>Não o funil ideal. O funil que acontece hoje. Como um lead entra? Quem recebe? O que acontece nas primeiras 2 horas? Quando é qualificado? Quando é descartado?</p>
<h3>Estabeleça critérios de qualificação</h3>
<p>Nem todo lead merece o mesmo esforço. Uma PME tem equipe pequena — tempo com lead frio é tempo tirado de lead quente. Defina o perfil ideal: segmento, porte, dor principal.</p>
<h3>Monte a cadência de follow-up</h3>
<p>A maior perda de receita nas PMEs não é de lead novo — é de lead que não foi acompanhado. Quantas propostas abertas você tem agora? Sabe quando foi o último contato? <strong>CRM resolve esse rastreamento, mas a cadência você decide antes.</strong></p>
<h2>Qual ferramenta escolher</h2>
<p>Para a maioria das PMEs, a resposta é: a mais simples que resolve. Três fatores determinam adoção:</p>
<ul>
<li><strong>Menos campos obrigatórios.</strong> Cada campo extra é uma razão para não registrar.</li>
<li><strong>Mobile funcional.</strong> Se o vendedor não usa no celular, não usa.</li>
<li><strong>Integração com WhatsApp.</strong> No Brasil, a venda acontece no WhatsApp.</li>
</ul>
<h2>O primeiro mês de CRM</h2>
<p>Não configure tudo de uma vez. Comece com o básico: cadastro, estágio, responsável e próxima ação. Depois de 30 dias usando, você sabe o que falta — aí expande. Começar com tudo configurado garante metade sem uso.</p>`,
  },
  {
    slug: "trafego-pago-sem-base",
    title: "Por que tráfego pago não funciona sem a base comercial pronta",
    deck: "Você não tem problema de tráfego. Você tem problema de conversão. Jogar dinheiro em anúncio em cima de funil quebrado só acelera o prejuízo.",
    tags: "tráfego,vendas",
    cover: "/assets/blog/trafego.svg",
    content: `
<p>É o diagnóstico que mais repetimos: empresa reclamando que "tráfego não funciona" quando o problema está na conversão, não na aquisição.</p>
<p>Você paga para trazer uma pessoa até a sua loja, site ou WhatsApp. E aí, o que acontece? Se o que acontece é fraco, contratar mais tráfego só escala o problema.</p>
<h2>O funil tem três etapas. As PMEs erram nas duas últimas.</h2>
<p>Tráfego resolve a primeira: trazer gente. O que converte é o que vem depois:</p>
<ul>
<li><strong>A oferta:</strong> o visitante entende em 5 segundos o que você vende e por que é melhor?</li>
<li><strong>O atendimento:</strong> quando o lead chega, alguém atende rápido e sabe qualificar?</li>
<li><strong>O fechamento:</strong> existe processo ou cada vendedor fecha do seu jeito?</li>
</ul>
<blockquote>Mais tráfego em cima de funil quebrado é gasolina em fogueira. Você queima mais dinheiro, mais rápido.</blockquote>
<h2>Como saber se você está pronto</h2>
<h3>Teste com orgânico primeiro</h3>
<p>Se você publica um post ou manda uma oferta para a base e ninguém responde, o problema não é distribuição — é a oferta. Pagar para distribuir isso mais largo não muda o resultado.</p>
<h3>Meça a conversão do que já entra</h3>
<p>Quantos leads por semana? Quantos viram orçamento? Quantos orçamentos viram venda? Se não sabe responder, não sabe se o problema é tráfego ou conversão.</p>
<h3>O tempo de resposta importa</h3>
<p>Um lead que pede orçamento às 10h e recebe retorno às 15h já esfriou. Antes de investir em tráfego, garanta atendimento em menos de 30 minutos no horário comercial.</p>
<h2>Quando faz sentido ligar o tráfego</h2>
<p>Quando você tem oferta testada, prova social básica, atendimento responsivo e capacidade de entregar. Aí tráfego é alavanca — você acelera algo que já funciona.</p>`,
  },
  {
    slug: "5-numeros-pme-toda-semana",
    title: "Os 5 números que todo dono de PME deveria olhar toda semana",
    deck: "Você não precisa de um painel gigante. Precisa de cinco indicadores que cabem numa folha e dizem se a semana vai ser boa ou ruim.",
    tags: "gestão,vendas",
    cover: "/assets/blog/indicadores.svg",
    content: `
<p>Uma das primeiras coisas que percebemos em uma PME é que o dono decide muito no instinto. Instinto é valioso — mas sozinho não escala. O contrapeso é olhar poucos números, sempre os mesmos, toda semana.</p>
<p>Não é sobre virar analista de dados. É sobre ter um painel mental simples que te avisa cedo quando algo desandou.</p>
<h2>Os cinco números</h2>
<h3>1. Leads que entraram</h3>
<p>Quantas oportunidades novas chegaram na semana, por qualquer canal. Se esse número cai e você só percebe no fim do mês pela queda no caixa, já perdeu tempo de reação.</p>
<h3>2. Taxa de conversão</h3>
<p>De cada 10 oportunidades, quantas viraram venda? Esse número revela se o problema é de topo (pouco lead) ou de fundo (lead que não fecha).</p>
<h3>3. Ticket médio</h3>
<p>Quanto vale, em média, cada venda. Subir o ticket costuma ser mais barato que dobrar o volume — e a maioria das PMEs nunca trabalha isso de propósito.</p>
<h3>4. Propostas em aberto</h3>
<p>Quanto de receita está parada esperando um sim. É o dinheiro mais fácil de recuperar — e o mais esquecido, por falta de follow-up.</p>
<h3>5. Caixa projetado das próximas semanas</h3>
<p>Não o saldo de hoje: o que entra e sai nas próximas 4-6 semanas. É o número que tira o dono do sufoco de decisões de última hora.</p>
<blockquote>Se você olha esses cinco toda segunda, para de ser surpreendido pelo próprio negócio.</blockquote>
<h2>Como começar sem complicar</h2>
<p>Não precisa de sistema no primeiro dia. Uma planilha e 15 minutos na segunda de manhã já mudam o jogo. A ferramenta vem depois, quando o hábito já existe e você sabe exatamente o que quer automatizar.</p>`,
  },
  {
    slug: "tirar-operacao-da-cabeca-do-dono",
    title: "Processos: como tirar a operação da cabeça do dono",
    deck: "Documentar processo não é burocracia. É o que permite delegar sem perder qualidade — e sair de dentro da operação sem que tudo pare.",
    tags: "processos,método",
    cover: "/assets/blog/processos.svg",
    content: `
<p>O gargalo mais comum na PME que cresceu no improviso não é dinheiro nem gente. É que tudo passa pela cabeça de uma pessoa: o dono. Ele sabe o preço certo, a exceção que pode, o cliente que merece atenção especial. E enquanto isso mora só na cabeça dele, ninguém consegue assumir de verdade.</p>
<h2>Por que "contratar alguém bom" não resolve sozinho</h2>
<p>Você contrata um gerente competente e, três meses depois, ele ainda te pergunta tudo. Não é incompetência — é que não existe processo para ele seguir. Sem o mapa, cada decisão vira uma ida ao dono.</p>
<blockquote>Delegar sem processo é terceirizar a dúvida, não a decisão.</blockquote>
<h2>O que significa "documentar um processo"</h2>
<p>Não é escrever um manual de 40 páginas que ninguém lê. É registrar, de forma curta e prática, três coisas:</p>
<ul>
<li><strong>O gatilho:</strong> quando esse processo começa (ex.: cliente pede orçamento).</li>
<li><strong>Os passos:</strong> o que fazer, na ordem, incluindo as exceções mais comuns.</li>
<li><strong>O resultado esperado:</strong> como saber que foi bem feito.</li>
</ul>
<h2>Comece pelos processos que mais se repetem</h2>
<p>Não tente documentar tudo. Liste o que acontece toda semana e tem impacto no cliente ou no caixa: atendimento a um lead, fechamento de venda, pós-venda, cobrança. Documente esses primeiro. São 20% dos processos que resolvem 80% das idas ao dono.</p>
<h2>O teste final</h2>
<p>Um processo está bem documentado quando uma pessoa nova consegue executá-lo lendo o registro, sem te interromper. Quando você chega nesse ponto em cada processo-chave, a operação para de depender da sua presença — e você volta a ser dono, não operador.</p>`,
  },
  {
    slug: "ia-no-atendimento-por-onde-comecar",
    title: "Automação e IA no atendimento: por onde começar sem virar robô",
    deck: "IA no atendimento não é substituir gente por bot. É tirar da equipe o trabalho repetitivo para ela cuidar do que realmente precisa de humano.",
    tags: "automação,ia",
    cover: "/assets/blog/automacao-ia.svg",
    content: `
<p>Toda semana surge uma ferramenta nova de IA prometendo revolucionar o atendimento. E toda semana algum dono de PME testa, se frustra e conclui que "não é para o meu negócio". O problema quase nunca é a tecnologia — é começar pelo lugar errado.</p>
<h2>O erro: querer automatizar a conversa toda</h2>
<p>Colocar um bot para "resolver tudo" costuma dar errado. O cliente sente que está falando com uma parede, e a equipe perde a confiança na ferramenta. Automação boa é invisível: ela tira o atrito, não adiciona.</p>
<blockquote>Automatize a tarefa repetitiva, não o relacionamento.</blockquote>
<h2>Por onde começar (nesta ordem)</h2>
<h3>1. Respostas de primeira linha</h3>
<p>Horário, endereço, formas de pagamento, status de pedido. Perguntas que se repetem o dia inteiro e não precisam de ninguém pensando. Automatizar isso já libera horas da equipe.</p>
<h3>2. Triagem e roteamento</h3>
<p>A IA entende o que o cliente quer e direciona para a pessoa certa, com o contexto já organizado. O vendedor recebe a conversa pronta para avançar, não do zero.</p>
<h3>3. Follow-up que não deixa lead esfriar</h3>
<p>Lembrar de retomar um orçamento parado, enviar a proposta prometida, checar se ficou alguma dúvida. É onde a PME mais perde venda — e onde a automação mais devolve dinheiro.</p>
<h2>A regra de ouro</h2>
<p>Sempre deixe um caminho fácil para falar com um humano. A IA cuida do volume e da velocidade; a pessoa cuida da relação e da exceção. Feito assim, o cliente é melhor atendido e a equipe trabalha menos apagando incêndio.</p>`,
  },
  {
    slug: "ecommerce-pme-plataforma-nao-e-o-problema",
    title: "E-commerce para PME: a plataforma quase nunca é o problema",
    deck: "Trocar de plataforma raramente resolve uma loja que não vende. O que trava está na operação, na oferta e no pós-clique — não no software.",
    tags: "e-commerce,vendas",
    cover: "/assets/blog/ecommerce.svg",
    content: `
<p>"A gente vai trocar de plataforma para vender mais." Ouvimos isso com frequência — e quase sempre é a solução errada para o problema errado. A plataforma é a parte mais visível, então vira a culpada fácil. Mas o que impede a loja de vender costuma estar em outro lugar.</p>
<h2>O que realmente trava uma loja de PME</h2>
<ul>
<li><strong>Operação:</strong> pedido que demora a ser separado, estoque desatualizado, frete mal configurado. O cliente até compra — a experiência depois é que queima.</li>
<li><strong>Oferta:</strong> foto ruim, descrição genérica, nenhuma razão clara para comprar de você e não do concorrente com preço parecido.</li>
<li><strong>Pós-clique:</strong> o visitante chega, mas não há prova social, não há atendimento rápido, o checkout tem fricção. A venda escorre no fim do funil.</li>
</ul>
<blockquote>Uma plataforma nova em cima de uma operação bagunçada é uma loja bonita que continua não vendendo.</blockquote>
<h2>Quando trocar faz sentido de verdade</h2>
<p>Existe hora certa para migrar: quando a plataforma atual não integra com seu estoque, não escala com o volume, ou cobra tanto que come a margem. Aí sim a troca é investimento. Fora disso, é fuga do problema real.</p>
<h2>A ordem certa</h2>
<p>Primeiro arrume a operação e a oferta. Depois otimize o pós-clique. Só então, se ainda fizer sentido, discuta plataforma. Nessa ordem, cada real investido tem retorno — e você não paga uma migração cara para descobrir que o problema continua.</p>`,
  },
  {
    slug: "raio-x-de-performance-como-funciona",
    title: "Raio-X de Performance: como funciona o nosso diagnóstico",
    deck: "Antes de propor qualquer coisa, a gente escuta e mapeia. Uma hora estruturada que já entrega clareza — mesmo que você siga sozinho depois.",
    tags: "método",
    cover: "/assets/blog/raio-x.svg",
    content: `
<p>Desconfie de quem manda proposta antes de entender seu negócio. Toda empresa é diferente, e a mesma "solução" aplicada no escuro costuma resolver o sintoma errado. Por isso todo trabalho na Porto &amp; Feiges começa pelo mesmo lugar: o Raio-X de Performance.</p>
<h2>O que é</h2>
<p>Uma conversa estruturada de cerca de uma hora, sem powerpoint e sem enrolação. O objetivo não é te vender — é entender onde está o dinheiro represado na sua operação comercial e digital.</p>
<h2>O que a gente mapeia</h2>
<ul>
<li><strong>Como entra a demanda</strong> — canais, volume, qualidade dos leads.</li>
<li><strong>Como funciona a venda</strong> — funil, follow-up, conversão, ticket.</li>
<li><strong>Onde a operação depende do dono</strong> — os gargalos que impedem escala.</li>
<li><strong>O que já existe de digital</strong> — site, CRM, tráfego, automação — e o que gera retorno de fato.</li>
</ul>
<blockquote>No fim da conversa, você sai com um diagnóstico claro do que atacar primeiro — com ou sem a gente.</blockquote>
<h2>Por que priorização importa</h2>
<p>A maioria das empresas tem dez frentes para melhorar. Tentar tudo ao mesmo tempo é como não fazer nada. O Raio-X aponta as duas ou três alavancas que mais movem o resultado nos próximos 90 dias — e é por elas que a gente começa.</p>
<h2>O que vem depois</h2>
<p>Se fizer sentido seguir juntos, o diagnóstico vira um plano em sprints de 90 dias, com metas semanais e execução mão na massa. Se não fizer, você fica com a clareza mesmo assim. Diagnóstico bom não deixa ninguém no prejuízo.</p>`,
  },
];

/* ───────────────────────── util ───────────────────────── */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
