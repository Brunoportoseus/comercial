# Banco de Leads — Diagnóstico de Tráfego Pago

O formulário de interesse do site grava cada envio num banco **Cloudflare D1**
(via `POST /api/lead` no `_worker.js`). Os leads podem ser consultados e
exportados em `/admin` (protegido por senha).

Enquanto o banco **não** estiver configurado, o site funciona normalmente e o
formulário cai no **fallback do WhatsApp** — nenhum lead é perdido.

## Ativar a gravação (uma vez)

Pré-requisito: `wrangler` autenticado na conta Cloudflare
(`npx wrangler login`), rodando dentro da pasta `auditoria-trafego-pago/`.

1. **Criar o banco D1**
   ```bash
   wrangler d1 create diagnostico-trafego-leads
   ```
   Copie o `database_id` que o comando retorna.

2. **Ligar o banco no `wrangler.jsonc`**
   Descomente o bloco `d1_databases` (no fim do arquivo) e cole o `database_id`:
   ```jsonc
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "diagnostico-trafego-leads",
       "database_id": "SEU_DATABASE_ID_AQUI"
     }
   ]
   ```
   > Atenção: ao descomentar, remova a vírgula inicial (`,`) do comentário e
   > garanta que há uma vírgula após o `]` de `routes`, para o JSON ficar válido.

3. **Criar a tabela**
   ```bash
   wrangler d1 execute diagnostico-trafego-leads --file=./schema.sql --remote
   ```

4. **Definir os segredos do painel `/admin`**
   ```bash
   wrangler secret put ADMIN_PASSWORD   # a senha que você vai usar no /admin
   wrangler secret put AUTH_SECRET      # uma string aleatória longa (assina a sessão)
   ```

5. **Publicar** (`wrangler deploy`, ou o deploy automático da Cloudflare ao
   dar push no `main`).

Pronto: os envios passam a ser gravados e ficam visíveis em
`https://www.diagnosticotrafegopago.com.br/admin`.

## Se você usa o painel da Cloudflare (Workers Builds) em vez do wrangler

- **D1:** crie o banco em *Storage & Databases → D1*, rode o `schema.sql` na aba
  *Console*, e adicione o binding **DB** em *Workers & Pages → (projeto) →
  Settings → Bindings → D1*.
- **Segredos:** *Settings → Variables and Secrets* → adicione `ADMIN_PASSWORD` e
  `AUTH_SECRET` como **Secret**.

## Consultar / exportar

- Painel: `/admin` (login com `ADMIN_PASSWORD`).
- Exportar tudo em CSV: botão **Exportar CSV** no painel (ou `/api/leads.csv`).
- Consulta rápida por linha de comando:
  ```bash
  wrangler d1 execute diagnostico-trafego-leads --remote \
    --command "SELECT created_at, nome, empresa, email, whatsapp FROM leads ORDER BY created_at DESC LIMIT 20;"
  ```

## Campos gravados

`nome`, `empresa`, `whatsapp`, `email`, `site`, `segmento`, `investimento`,
`plataformas`, `quem` (quem administra), `crm`, `pacote`, `dificuldade`,
`origem`, além de `user_agent`, `referer`, `ip` e `created_at`.
