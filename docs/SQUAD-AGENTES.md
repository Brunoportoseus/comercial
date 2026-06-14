# Squad de Agentes — Projeto Bruno Porto Seus

> Estrutura de agentes especializados que executou a construção do site
> [www.brunoportoseus.com.br](https://www.brunoportoseus.com.br),
> incluindo blog, admin e infraestrutura de hospedagem.
>
> Esta estrutura também serve como **template reproduzível** para novos
> projetos de consultoria digital — basta repetir o fluxo trocando o
> conteúdo do cliente.

---

## Visão geral do squad

```
                ┌──────────────────────────────┐
                │   ORQUESTRADOR (Claude)      │
                │  Coordena agentes, mantém    │
                │  contexto e prioridades      │
                └──────────────┬───────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼─────┐         ┌──────▼──────┐        ┌─────▼─────┐
   │ ESTRATÉGIA│         │  PRODUÇÃO   │        │  INFRA &  │
   │ & CONTEÚDO│         │  DIGITAL    │        │  DEPLOY   │
   └────┬─────┘         └──────┬──────┘        └─────┬─────┘
        │                       │                     │
  ┌─────┴──────┐           ┌────┴────┐          ┌─────┴─────┐
  │            │           │         │          │           │
Brand Voice  Copy      Designer    Dev        DevOps    DNS/Domínio
Agent       Agent       Agent     Agent       Agent       Agent
```

---

## 🎯 Agentes — funções e entregas

### 1. Agente Orquestrador *(Claude principal)*

Camada de coordenação. Mantém visão de produto, prioriza tarefas, evita
retrabalho e garante consistência entre módulos.

| Função | Entregável |
|---|---|
| Capturar requisitos do cliente | Conversa contínua sem perda de contexto |
| Priorizar próximos passos | Ordem natural: site → blog → admin → infra |
| Coordenar entregas paralelas | Commits únicos coerentes |
| Documentar decisões | Este próprio documento |

---

### 2. Brand Voice Agent

Define a personalidade textual da marca, o que pode e não pode ser dito,
e o tom geral.

| Função | Entregável |
|---|---|
| Slogan da marca | "Comercial · Growth · Digital · IA" |
| Tom de voz | Consultivo, direto, sem hype |
| Posicionamento | "Cresce o comercial das empresas pelo digital" |
| Palavras-chave a usar/evitar | "Estruturar" > "organizar"; "resultados sustentáveis" |

---

### 3. Copy Agent

Escreve todos os textos do site e do blog — hero, serviços, experiência,
formação, descrições de marcas, posts inteiros.

| Função | Entregável |
|---|---|
| Hero copy | "Vender mais pela internet com estratégia, IA e processos bem feitos." |
| Lead / sub-hero | Bio profissional (3-4 linhas) |
| Cards de serviços | 6 frentes de atuação |
| Timeline de experiência | 4 períodos (1992-presente) |
| **Blog — posts** | 3 artigos completos (IA, CRM, E-commerce) |
| CTAs | Mensagens de WhatsApp pré-preenchidas |
| Open Graph (compartilhamento) | Títulos e descrições para redes sociais |

---

### 4. Designer Agent

Define identidade visual: paleta, tipografia, layouts, microinterações,
logos e cartões para redes sociais.

| Função | Entregável |
|---|---|
| Sistema de cores | `#3da5ff → #7c5cff → #a06bff` (gradiente principal) |
| Tipografia | Inter (corpo) + Sora (títulos) |
| Layout responsivo | Desktop, tablet, mobile + safe-area iOS |
| Componentes | Cards, chips, timeline, hero, navbar |
| Logos | Geração de 6 conceitos modernos (BP monogram escolhido) |
| Favicons | `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png` |
| **Social Card** | `og-card.jpg` (1200×630) com foto + branding |
| Tratamento de fotos | Remoção de fundo branco, escala uniforme, filtro de logos |

---

### 5. Dev Agent (Frontend)

Escreve, refatora e mantém HTML/CSS/JS. Garante performance, acessibilidade
e responsividade.

| Função | Entregável |
|---|---|
| HTML semântico | Site principal + 3 posts de blog + admin + listagem |
| CSS responsivo | Sistema de design unificado em variáveis CSS |
| JavaScript | Menu hamburger, scroll reveal, live preview do markdown |
| Acessibilidade | aria-labels, navegação por teclado, contraste AAA |
| Performance | Fonts preload, lazy assets, sem dependências pesadas |
| **Admin SPA** | `/admin/` — editor markdown + integração com GitHub API |

---

### 6. Marketing Agent (Conteúdo do Blog)

Pesquisa e produz conteúdo evergreen para SEO e prova social.

| Função | Entregável |
|---|---|
| Estratégia editorial | 3 pilares: IA, CRM, E-commerce |
| Posts publicados | "IA aplicada no comercial", "CRM que vende", "5 ajustes em e-commerce" |
| Estrutura padrão | Lead + seções + callouts + CTA + WhatsApp |
| SEO básico | Meta description, OG tags, URLs limpas |

---

### 7. DevOps Agent (Deploy & Hospedagem)

Configura repositório, pipeline de deploy contínuo e hospedagem.

| Função | Entregável |
|---|---|
| Repositório | GitHub `Brunoportoseus/comercial` |
| Pipeline CI/CD | Push em `main` → deploy automático |
| Hospedagem | Cloudflare Workers Static Assets |
| Arquivo de config | `wrangler.jsonc` + `_worker.js` + `.assetsignore` |
| Cache & CDN | CDN global da Cloudflare (Free tier) |
| HTTPS | Certificado automático via Cloudflare |

---

### 8. DNS & Domínio Agent

Gerencia registro de domínio, propagação DNS e roteamento.

| Função | Entregável |
|---|---|
| Domínio | `brunoportoseus.com.br` (Registro.br) |
| Migração DNS | Nameservers → Cloudflare |
| Custom Domain | `www.brunoportoseus.com.br` → Worker |
| Redirect SEO | `brunoportoseus.com.br` → `www` (301) |
| SSL | Universal SSL da Cloudflare |

---

## 🛠️ Stack final entregue

| Camada | Tecnologia | Custo |
|---|---|---|
| **Código** | HTML + CSS + JS vanilla | R$ 0 |
| **Versionamento** | GitHub | R$ 0 |
| **Hospedagem** | Cloudflare Workers Static Assets | R$ 0 |
| **CDN + HTTPS** | Cloudflare Free | R$ 0 |
| **DNS** | Cloudflare Free | R$ 0 |
| **Domínio** | Registro.br | ~R$ 40/ano |
| **Admin do blog** | SPA + GitHub API | R$ 0 |
| **Total mensal** | — | **R$ 3,33** (só domínio) |

---

## 📦 Estrutura de arquivos

```
bruno-porto/
├── index.html              ← Site principal (one-page)
├── wrangler.jsonc          ← Config Cloudflare Workers
├── _worker.js              ← Worker que serve os assets
├── .assetsignore           ← Arquivos ignorados do bundle
│
├── assets/
│   ├── bruno.jpg           ← Foto do hero
│   ├── logo-bp.png         ← Logo do navbar
│   ├── og-card.jpg         ← Social card (compartilhamento)
│   ├── favicon.ico
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   └── logos/              ← 18 logos de marcas atendidas
│
├── blog/
│   ├── index.html          ← Listagem de posts
│   ├── blog.css            ← Estilos do blog
│   └── posts/
│       ├── ia-no-comercial/index.html
│       ├── crm-que-vende/index.html
│       └── ecommerce-conversao/index.html
│
└── admin/
    └── index.html          ← Painel admin (login PAT + editor markdown)
```

---

## 🔁 Como replicar pra outro cliente

Cada agente acima vira um "checklist" para o próximo projeto:

1. **Brand Voice** — entrevista com o cliente: o que ele faz, pra quem, posicionamento
2. **Copy** — produz texto inicial baseado no PDF/dossiê
3. **Designer** — coleta logo, fotos, cores preferidas; gera identidade
4. **Dev** — duplica `bruno-porto/` → `cliente-x/` e troca conteúdo
5. **Marketing** — produz 3 posts iniciais
6. **DevOps** — novo Worker na Cloudflare apontando pra pasta
7. **DNS** — migra DNS do cliente pra Cloudflare e conecta domínio

Tempo estimado para um novo cliente com este template: **6 a 12 horas** de trabalho coordenado.

---

## 🎯 Princípios do squad

1. **Conteúdo > Design**. Texto bom em layout simples bate visual bonito com conteúdo fraco.
2. **Performance é feature**. CDN, sem frameworks pesados, sem dependências externas.
3. **Reaproveitamento**. Cada agente cria componentes reutilizáveis.
4. **Documentação como código**. Este arquivo, o `COMO-ADICIONAR-POST.md`, comentários em commits.
5. **Custo mínimo, qualidade máxima**. Stack gratuita, profissional.
6. **Cliente autônomo**. Admin do blog + GitHub web permitem manutenção sem dev.

---

_Documento mantido pelo Orquestrador. Atualizar quando novos agentes/responsabilidades forem adicionados ao squad._
