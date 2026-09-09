-- Schema do banco D1 — Leads do formulário de interesse
-- Site: www.diagnosticotrafegopago.com.br
--
-- Criar o banco e rodar o schema (uma vez):
--   wrangler d1 create diagnostico-trafego-leads
--   (cole o database_id retornado em wrangler.jsonc, no bloco d1_databases)
--   wrangler d1 execute diagnostico-trafego-leads --file=./schema.sql --remote

CREATE TABLE IF NOT EXISTS leads (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Etapa 1 · Contato
  nome          TEXT NOT NULL,
  empresa       TEXT,
  whatsapp      TEXT,
  email         TEXT,
  site          TEXT,
  -- Etapa 2 · Operação
  segmento      TEXT,
  investimento  TEXT,           -- faixa de investimento mensal em mídia
  plataformas   TEXT,           -- plataformas utilizadas (texto livre)
  quem          TEXT,           -- quem administra as campanhas
  crm           TEXT,           -- utiliza CRM? (Sim/Não/Parcialmente)
  pacote        TEXT,           -- pacote de interesse
  dificuldade   TEXT,           -- principal dificuldade hoje
  -- Metadados
  origem        TEXT,           -- host de origem do envio
  user_agent    TEXT,
  referer       TEXT,
  ip            TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
