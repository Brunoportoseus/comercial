# terrenocuritibaeregiao.com.br — Hub “Terrenos Curitiba e Região”

Hub regional (hub-and-spoke) de terrenos na **Região Metropolitana de Curitiba (RMC)**.
Cada cidade tem **página com URL própria** (não aba de JS). Começa por **Almirante Tamandaré**
(portando o conteúdo do site atual); as demais cidades entram conforme houver produto/conteúdo.

Site estático (HTML/CSS/JS) + Cloudflare Pages Functions (formulário → D1/webhook).

## Estrutura de URLs (padrão travado: minúsculo, hífen, sem acento, barra final)

```
/                                     Home regional
/almirante-tamandare/                 Página da cidade  ✅ publicada
/almirante-tamandare/bela-vista/      Página de empreendimento  ✅
/guia-do-comprador/                   Institucional
/financiamento/                       Financiamento direto
/conteudos/                           Blog + 7 artigos (/conteudos/<slug>/)
/contato/ · /obrigado/ (noindex)
/fontes-e-metodologia/ · /politica-de-privacidade/ · /politica-de-cookies/ · /termos-de-uso/
/404.html
```
Cidades **sem produto/conteúdo** (São José dos Pinhais, Curitiba, Araucária, Campo Largo,
Fazenda Rio Grande, Pinhais, Piraquara) **ainda não têm página** — o domínio de cada uma
redireciona para a home (ver abaixo). Não publicar página fina (contamina o SEO do site).

## Publicar (novo projeto Cloudflare Pages)
1. **Workers & Pages → Create → Pages → Connect to Git** → repo `Brunoportoseus/comercial`.
2. **Project name:** `terreno-curitiba-e-regiao` · **Production branch:** `main` ·
   **Build command:** vazio · **Root directory (advanced):** `terreno-curitiba-e-regiao` ·
   **Build output directory:** `.`.
3. **Save and Deploy** → sai em `https://<projeto>.pages.dev`. Confirme `…/api/lead` respondendo `{"ok":false,"error":"Use POST."}`.
4. **D1 (leads):** crie o banco `leads-tat` e adicione o binding **`DB`** (a tabela é criada
   sozinha; ver `schema.sql`). Opcional: `LEADS_TOKEN` p/ `/api/leads-export`, `LEAD_WEBHOOK` p/ CRM.
5. **Analytics:** preencha GA4/GTM/Meta Pixel em `assets/js/config.js` (eventos já marcados:
   form_submit, whatsapp_click etc.).

## Mapa de domínios e redirects (301 — feito no painel Cloudflare, nível de domínio)

O hub é `terrenocuritibaeregiao.com.br`. Os demais domínios fazem **301** para o destino:

| Domínio | Destino do 301 |
|---|---|
| terrenocuritibaeregiao.com.br | **é o hub** (custom domain do projeto) |
| terrenoalmirantetamandare.com.br | `/almirante-tamandare/` |
| terrenosaojosedospinhais.com.br | home do hub (até existir `/sao-jose-dos-pinhais/`) |
| terrenoaraucaria.com.br | home do hub (até existir `/araucaria/`) |
| terrenocampolargo.com.br | home do hub |
| terrenofazendariogrande.com.br | home do hub |
| terrenopinhais.com.br | home do hub |
| terrenopiraquara.com.br | home do hub |

Como fazer no Cloudflare: adicione cada domínio à conta e use **Rules → Redirect Rules**
(ou **Bulk Redirects**) com 301 para o destino. O `_redirects` deste projeto já cuida das
**URLs legadas** do site de Almirante (ex.: `/empreendimentos/bela-vista/` → `/almirante-tamandare/bela-vista/`)
caso o domínio antigo seja apontado para o hub.

> ⚠️ **Não deixe as duas versões de Almirante indexadas ao mesmo tempo** (conteúdo duplicado).
> Assim que `/almirante-tamandare/` estiver no ar no hub, faça o 301 de
> `terrenoalmirantetamandare.com.br` → `/almirante-tamandare/` (ou coloque o site antigo em noindex).

## Pendências que BLOQUEIAM publicar/anunciar (fornecer antes)
- **CRECI** real — hoje `[CONFIRMAR CRECI]` no rodapé/contato. Sem CRECI não se anuncia (Meta/Google reprovam).
- **Autorização por escrito da EVEX** para veicular marca, estoque e preços.
- **Dados dos demais empreendimentos** (metragem, preço “a partir de”, entrada/parcela) para criar as páginas —
  hoje só o **Bela Vista** tem dados confirmados; os outros de Almirante aparecem como “sob consulta”.
- **IDs de GA4/GTM/Meta Pixel** e destino dos leads (D1/webhook/Kommo).
- Razão social/CNPJ do controlador (Política de Privacidade).

## Migração — o que foi portado do site de Almirante
Formulário com qualificação, transparência (fontes datadas, ressalvas), os 7 artigos do blog,
identidade visual (verde-petróleo/dourado), SEO técnico. Canonicals já apontam para o **hub**.
