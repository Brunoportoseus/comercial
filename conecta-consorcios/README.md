# Conecta Consórcios — Landing Page

Landing page institucional para captação de leads de **consórcio de imóveis**.
Objetivo: gerar contatos qualificados para atendimento consultivo — **sem**
exibir planos, valores, tabelas comerciais ou promessas de contemplação.

## Stack

Segue o padrão já usado no repositório (ex.: `bruno-porto`):
HTML/CSS/JS estático + **Cloudflare Worker** (`_worker.js`) para o endpoint do
formulário. Sem framework de build, sem dependências desnecessárias.

```
conecta-consorcios/
├── index.html              # Página principal (todas as seções)
├── css/styles.css          # Design system (mobile-first, WCAG AA)
├── js/config.js            # ⭐ Config central: WhatsApp, endpoint, analytics
├── js/main.js              # Interações, validação, analytics, cookies
├── _worker.js              # Worker: /api/lead + integração desacoplada
├── wrangler.jsonc          # Config Cloudflare (rotas, domínio)
├── .assetsignore           # Arquivos não servidos como assets
├── .dev.vars.example       # Exemplo de variáveis/secrets locais
├── robots.txt / sitemap.xml
├── assets/                 # Logos (placeholder), favicon, OG (a incluir)
├── privacidade/            # Política de Privacidade (rascunho)
└── termos/                 # Termos de Uso (rascunho)
```

## Como rodar localmente

**Opção A — preview estático (sem backend):**
```bash
cd conecta-consorcios
python3 -m http.server 8080
# abra http://localhost:8080
```
O formulário tentará `POST /api/lead`; sem o Worker rodando ele exibe o estado
de erro e oferece o WhatsApp como alternativa (comportamento esperado offline).

**Opção B — com o Worker (backend do formulário):**
```bash
cd conecta-consorcios
npx wrangler dev
```

## Configuração (arquivo único)

Edite **`js/config.js`** para ajustar sem tocar no resto:
- `whatsapp.number` / `whatsapp.message` — número e mensagem inicial;
- `leadEndpoint` — rota do formulário (padrão `/api/lead`);
- `analytics.gtmId` **ou** `analytics.ga4Id` — deixe vazio até ter os IDs
  oficiais (nada é carregado e nenhum cookie de terceiros é criado sem isso);
- `contato.*` — e-mail, site, Instagram exibidos.

## Destino dos leads (backend)

O `_worker.js` valida no servidor e encaminha o lead por uma **camada de
integração desacoplada**. Configure **um ou mais** destinos por
variáveis de ambiente / secrets (painel Cloudflare ou `wrangler secret put`) —
nunca no código:

| Variável | Destino |
|---|---|
| `LEAD_WEBHOOK_URL` | Webhook genérico (POST JSON) |
| `KOMMO_WEBHOOK_URL` | Webhook de entrada do Kommo |
| `LEAD_EMAIL_TO` + `RESEND_API_KEY` | E-mail (via Resend) |
| `TURNSTILE_SECRET` | (opcional) Cloudflare Turnstile anti-bot |

Sem nenhum destino configurado, o Worker responde sucesso e apenas registra o
lead no log de observabilidade — o formulário nunca fica "só visual".
Para adicionar um banco de dados (ex.: D1), inclua o binding no `wrangler.jsonc`
e uma função de gravação em `deliverLead()`.

## Deploy

- **Cloudflare (produção, domínio próprio):** `npx wrangler deploy`
  (após adicionar o domínio ativo na conta Cloudflare). O redirect www → apex
  está no `_worker.js`.
- **GitHub Pages (preview):** o workflow `deploy-pages.yml` publica esta pasta
  em `https://brunoportoseus.github.io/comercial/conecta-consorcios/` (sem o
  backend do Worker — o form usa o fallback de WhatsApp).

## Proteção anti-spam

Honeypot (campo oculto), verificação de tempo mínimo de preenchimento e
validação server-side. Turnstile pode ser ativado com `TURNSTILE_SECRET`.

## Acessibilidade

Mobile-first, HTML semântico, navegação por teclado, foco visível, contraste
AA, labels reais, mensagens de erro com `aria-live`, e respeito a
`prefers-reduced-motion`.

## ⚠️ Dados a confirmar antes de publicar

Ver seção "Dados a confirmar" no rodapé da página e o `assets/README.md`.
Resumo:
- Razão social, CNPJ, endereço, foro;
- Relacionamento oficial Conecta ↔ Servopa e **autorização de uso das marcas/logos**;
- Arquivos oficiais de logotipo, favicon e imagem OG (`assets/og-card.jpg`);
- Tempo de mercado e quaisquer números (consorciados, contemplações) — não publicar sem fonte oficial atualizada;
- Canais de atendimento (WhatsApp, e-mail, Instagram);
- Destino real dos leads (webhook/Kommo/e-mail/DB);
- Revisão jurídica de Política de Privacidade e Termos de Uso;
- Depoimentos reais (ou remover a seção).
