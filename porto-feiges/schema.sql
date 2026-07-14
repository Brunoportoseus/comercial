-- Schema do banco D1 — Porto & Feiges
-- Rodar com: wrangler d1 execute porto-feiges --file=./schema.sql --remote

CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT UNIQUE NOT NULL,
  title      TEXT NOT NULL,
  deck       TEXT,
  tags       TEXT,               -- separadas por vírgula, ex: "crm,vendas"
  cover      TEXT,               -- URL da imagem de capa (opcional)
  content    TEXT NOT NULL,      -- corpo do post em HTML
  published  INTEGER NOT NULL DEFAULT 1,  -- 1 = publicado, 0 = rascunho
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts (created_at DESC);
