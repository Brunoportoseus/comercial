-- Schema do blog — Diagnóstico de Tráfego Pago (tabela no mesmo banco D1)
-- A tabela também é criada automaticamente pelo Worker (ensurePostsTable),
-- então rodar este arquivo é opcional.

CREATE TABLE IF NOT EXISTS posts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  subtitle        TEXT,
  category        TEXT,                          -- slug de uma das 12 categorias
  tags            TEXT,                          -- CSV: "google-ads,leads"
  excerpt         TEXT,                          -- resumo curto
  content         TEXT NOT NULL,                 -- corpo do artigo em HTML
  seo_title       TEXT,                          -- title exclusivo (SEO)
  seo_description TEXT,                           -- meta description exclusiva
  cover           TEXT,                          -- URL da imagem de capa
  cover_alt       TEXT,                          -- texto alternativo da capa
  author          TEXT DEFAULT 'Bruno Porto Seus',
  reading_time    INTEGER,                       -- minutos (auto se vazio)
  pillar          TEXT,                          -- slug da página pilar relacionada
  related         TEXT,                          -- CSV de slugs relacionados
  cta_type        TEXT,                          -- campanha|leads|conversao|agencia|rentabilidade|default
  featured        INTEGER NOT NULL DEFAULT 0,    -- 1 = artigo em destaque na home
  noindex         INTEGER NOT NULL DEFAULT 0,    -- 1 = não indexar
  published       INTEGER NOT NULL DEFAULT 1,    -- 1 = publicado, 0 = rascunho
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  published_at    TEXT
);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published);
CREATE INDEX IF NOT EXISTS idx_posts_created   ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category  ON posts (category);
