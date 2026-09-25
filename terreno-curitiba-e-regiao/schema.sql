-- Tabela de leads do portal terrenoalmirantetamandare.com.br (Cloudflare D1)
-- A função /api/lead cria esta tabela automaticamente na primeira gravação;
-- este arquivo serve como referência e para criar/atualizar manualmente.
--
-- Criar com wrangler:
--   npx wrangler d1 execute leads-tat --file=./schema.sql
-- Ou cole o conteúdo no Console do banco (painel Cloudflare → D1 → leads-tat → Console).
--
-- gclid: Google Click ID capturado do lead (para conversão offline no Google Ads).
-- status/valor_negocio/convertido_em: preencha manualmente pelo Console do D1 quando
-- um lead fechar negócio, ex.:
--   UPDATE leads SET status='qualificado', valor_negocio=189000, convertido_em='2026-09-25 14:30:00'
--   WHERE id=42;
-- Depois exporte para o Google Ads em /api/leads-export?token=SEU_TOKEN&format=gads

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
  gclid TEXT,
  status TEXT DEFAULT 'novo',
  valor_negocio REAL,
  convertido_em TEXT,
  ip TEXT,
  user_agent TEXT,
  raw TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_criado_em ON leads (criado_em);
CREATE INDEX IF NOT EXISTS idx_leads_empreendimento ON leads (empreendimento_interesse);
