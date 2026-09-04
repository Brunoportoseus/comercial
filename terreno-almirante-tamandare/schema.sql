-- Tabela de leads do portal terrenoalmirantetamandare.com.br (Cloudflare D1)
-- A função /api/lead cria esta tabela automaticamente na primeira gravação;
-- este arquivo serve como referência e para criar/atualizar manualmente.
--
-- Criar com wrangler:
--   npx wrangler d1 execute leads-tat --file=./schema.sql
-- Ou cole o conteúdo no Console do banco (painel Cloudflare → D1 → leads-tat → Console).

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  criado_em TEXT,
  nome TEXT,
  telefone TEXT,
  email TEXT,
  cidade TEXT,
  objetivo TEXT,
  faixa_investimento TEXT,
  forma_pagamento TEXT,
  prazo TEXT,
  regiao TEXT,
  observacoes TEXT,
  empreendimento_interesse TEXT,
  pagina_origem TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  ip TEXT,
  user_agent TEXT,
  raw TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_criado_em ON leads (criado_em);
CREATE INDEX IF NOT EXISTS idx_leads_empreendimento ON leads (empreendimento_interesse);
