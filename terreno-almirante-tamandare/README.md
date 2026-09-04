# terrenoalmirantetamandare.com.br

Portal regional de informações e oportunidades imobiliárias em **Almirante Tamandaré (PR)**.
Site estático (HTML + CSS + JS), rápido, responsivo e otimizado para SEO, com formulário de
captação de leads processado por uma **Cloudflare Pages Function**.

> Não é uma landing page de propaganda: é um portal de conteúdo (cidade, infraestrutura,
> bairros, guia do comprador e notícias) com uma curadoria de empreendimentos integrada.

---

## 1. Estrutura do projeto

```
terreno-almirante-tamandare/
├── index.html                      # Página inicial
├── conheca-almirante-tamandare/    # Sobre a cidade (dados IBGE)
├── infraestrutura/                 # Rodovia dos Minérios (PR-092) e serviços
├── bairros/                        # Bairros e regiões (estrutura escalável)
├── guia-do-investidor/             # Checklist e perfis de compra
├── empreendimentos/
│   ├── index.html                  # Lista de empreendimentos
│   ├── bela-vista/                 # Página completa do Bela Vista
│   └── nova-oportunidade/          # 2º empreendimento (placeholder)
├── noticias/                       # Blog/SEO (índice + 6 artigos)
├── contato/                        # Fale com um especialista
├── obrigado/                       # Página de conversão (noindex)
├── politica-de-privacidade/ · politica-de-cookies/ · termos-de-uso/
├── fontes-e-metodologia/           # Transparência de dados
├── 404.html                        # Página de erro personalizada
├── sitemap.xml · robots.txt        # SEO técnico
├── _headers · _redirects           # Configuração do Cloudflare Pages
├── assets/
│   ├── css/site.css                # Design system (uma folha de estilo)
│   ├── js/config.js                # ⚙️ CONFIGURAÇÃO (edite aqui)
│   ├── js/site.js                  # Interações (nav, modal, form, analytics)
│   └── img/                        # Imagens (reais do Bela Vista + ilustrativas)
└── functions/api/lead.js           # Endpoint que recebe/armazena os leads
```

Cada página é um HTML autônomo (bom para SEO). O cabeçalho, o rodapé e o formulário seguem
o mesmo padrão em todas elas.

## 2. Como editar

| O que mudar | Onde |
|---|---|
| WhatsApp, telefone, e-mail, texto padrão | `assets/js/config.js` |
| **Faixas de investimento** (fonte única) | `assets/js/config.js` → `faixas: [...]` |
| IDs do GA4 / GTM / Meta Pixel | `assets/js/config.js` → `analytics` |
| Cores, fontes, espaçamentos | `assets/css/site.css` (variáveis em `:root`) |
| Textos e seções de uma página | o `index.html` da respectiva pasta |

> As faixas de investimento são renderizadas no formulário a partir do `config.js`
> (basta editar a lista — o `<select>` é preenchido automaticamente).

## 3. Formulário e leads

O formulário valida os campos obrigatórios (nome, WhatsApp, e-mail, objetivo e
consentimento), valida telefone/e-mail, tem honeypot antispam, evita envios duplicados,
preserva os dados em caso de erro e registra automaticamente:
data/hora, página de origem, referrer, empreendimento de interesse e parâmetros **UTM**.

O envio é feito por `POST /api/lead` (Cloudflare Pages Function). A função grava o lead
**na ordem de disponibilidade**:

1. **Banco de dados D1** (binding `DB`) — recomendado;
2. **Webhook** externo (variável `LEAD_WEBHOOK`) — para CRM/automação (Kommo, n8n, Make, Zapier…);

Nenhuma credencial fica no código — tudo vem de variáveis/bindings do Cloudflare.
Se nenhum destino estiver configurado, o lead é registrado no log e o visitante ainda
recebe a confirmação + botão de WhatsApp (nunca se perde a conversa).

## 4. Publicação (Cloudflare Pages — recomendado)

1. No painel do Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**
   (ou upload direto). Defina o **diretório raiz** como `terreno-almirante-tamandare`.
   Não há etapa de build (site estático): _Build command_ vazio, _Output directory_ = `/`.
2. **Criar o banco D1** (painel: **Storage & databases → D1 → Create** com o nome
   `leads-tat`; ou `npx wrangler d1 create leads-tat`).
   A tabela `leads` é **criada automaticamente** pela função na primeira gravação —
   não precisa rodar SQL. Se preferir criar/atualizar manualmente, use o `schema.sql`
   deste diretório (`npx wrangler d1 execute leads-tat --file=./schema.sql`, ou cole no
   Console do banco).
3. Em **Settings → Functions → D1 database bindings**, adicione o binding
   **Variable name = `DB`** apontando para `leads-tat` e faça **Retry deployment**.
4. (Opcional) Em **Settings → Environment variables**:
   - `LEAD_WEBHOOK` — URL do seu CRM/automação (Kommo, Make, n8n) para receber cada lead;
   - `LEADS_TOKEN` — senha para exportar os leads pelo endpoint (veja abaixo).
5. **Exportar leads** (com `LEADS_TOKEN` definido):
   - CSV (abre no Excel/Sheets): `https://SEU-SITE/api/leads-export?token=SEU_TOKEN`
   - JSON: `…/api/leads-export?token=SEU_TOKEN&format=json`
   - Também: `npx wrangler d1 execute leads-tat --command "SELECT * FROM leads ORDER BY id DESC;"`
   > `/api/leads-export` fica desativado enquanto `LEADS_TOKEN` não for definido (retorna 403).
   > Está fora dos buscadores (robots.txt bloqueia `/api/`).

> Também funciona como site estático em qualquer hospedagem, mas aí o `/api/lead` não roda:
> os leads dependeriam do webhook/WhatsApp. Cloudflare Pages é o caminho indicado.

## 5. Apontar o domínio `terrenoalmirantetamandare.com.br`

1. No projeto do Pages: **Custom domains → Set up a domain** → informe
   `terrenoalmirantetamandare.com.br` (e `www.` se desejar).
2. Se o DNS já estiver na Cloudflare, os registros são criados automaticamente.
   Caso contrário, no seu provedor de DNS crie:
   - `terrenoalmirantetamandare.com.br` → **CNAME** para o host `*.pages.dev` indicado pelo Pages
     (ou os registros que o painel exibir);
   - `www` → **CNAME** para o mesmo destino.
3. Aguarde a propagação e o certificado SSL (automático na Cloudflare).
4. Confira o `canonical`/OG: as URLs já usam `https://terrenoalmirantetamandare.com.br`.
   Se o domínio final mudar, ajuste `SITE_URL` e regenere (ver seção 8) ou edite os `<link rel="canonical">`.

## 6. Analytics e conversões

Preencha os IDs em `config.js`. Os scripts (GA4, GTM, Meta Pixel) só carregam **após o
consentimento de cookies**. Eventos enviados para `dataLayer`/gtag/fbq:

`view_empreendimento`, `open_form`, `form_start`, `select_faixa`, `form_submit`,
`whatsapp_click`, `phone_click`.

## 7. Informações ainda pendentes do responsável

Marcadas no código como `[INFORMAÇÃO PENDENTE]` / `[CONFIRMAR]` (comentários HTML, não
aparecem para o visitante). Solicitar ao cliente:

- Logotipo / definição do nome da marca do portal;
- Nome completo do responsável, **CRECI** e situação profissional;
- E-mail oficial e endereço comercial;
- **Bela Vista:** tabela completa de preços por lote, demais metragens, documentação
  (matrícula/registro), link de localização e imagens reais adicionais;
- Nome e dados do **2º empreendimento**;
- Destino dos leads (CRM/D1/webhook) e credenciais no painel;
- Links das redes sociais e política comercial/jurídica.

## 8. Regerar o site (opcional)

As páginas foram geradas por um script para manter cabeçalho/rodapé/SEO consistentes.
O resultado (HTML) é o que está versionado e pode ser editado diretamente. Se preferir
regenerar em lote, o script-fonte pode ser mantido fora da pasta publicada.

## 9. Checklist de testes (feito)

- [x] Estrutura HTML válida e JSON-LD (Schema.org) em todas as páginas
- [x] Responsivo (desktop, tablet, celular) sem rolagem horizontal
- [x] Menu hambúrguer no mobile
- [x] Modal de lead abre e valida; faixas vindas do `config.js`
- [x] Links de WhatsApp/telefone/e-mail e ano do rodapé populados por JS
- [x] Página 404 e página de agradecimento
- [x] `sitemap.xml`, `robots.txt`, canonical, Open Graph, breadcrumbs
- [ ] Após publicar: testar envio real do formulário (D1/webhook) e eventos de analytics
