# Funil de conversão no GA4 — terrenoscuritibaeregiao.com.br

Dicionário dos eventos que o site envia e como montar o funil no GA4. O código está em
`terreno-curitiba-e-regiao/assets/js/site.js` (função `window.trackEvent`).

Os eventos só saem para quem aceitou os cookies (`requireCookieConsent` em `assets/js/config.js`).
Todos passam por `window.trackEvent`, que envia ao `dataLayer` (GTM), ao GA4 (`gtag`) e ao Pixel da Meta.

## Parâmetros padrão (vão em todo evento)

| Parâmetro | Valores |
|---|---|
| `page_type` | `home`, `cidade`, `empreendimento`, `financiamento`, `comparar`, `contato`, `guia-do-comprador`, `conteudo`, `cluster`, `institucional`, `obrigado`, `outro` |
| `empreendimento` | Nome do empreendimento da página (só em páginas de empreendimento). Ex.: `Condomínio Bela Vista` |
| `cidade` | Cidade do empreendimento (só em páginas de empreendimento). Ex.: `Almirante Tamandaré` |

## Eventos do funil

| Etapa | Evento | Quando dispara | Parâmetros extras |
|---|---|---|---|
| Visita | `page_view` | Automático do GA4 | — |
| Interesse em imóvel | `view_empreendimento` | Ao abrir uma página de empreendimento (1x por carregamento) | — |
| Descoberta (home) | `budget_select` | Escolha de faixa de parcela no topo da home | `faixa_parcela`, `resultados` |
| Descoberta (home) | `budget_result_click` | Clique num empreendimento sugerido pelo assistente | `faixa_parcela` |
| Ferramenta | `tool_use` | 1ª interação da pessoa com uma ferramenta, por página | `tool`: `simulador_financiamento`, `potencial_construtivo`, `simulador_financiamento_geral`, `busca_preco_cidade`, `comparar` |
| Intenção de contato | `open_form` | Abertura do formulário (modal) | `cta_location`, `cta_text`, `lead_source_tool`, `faixa_parcela` |
| Intenção de contato | `form_start` | Primeiro foco em um campo do formulário | — |
| **Lead** | `form_submit` | **Só quando o servidor confirma o cadastro** | `success` (`true`), `form_location` (`modal`/`pagina`), `cta_location`, `cta_text`, `lead_source_tool`, `faixa_parcela`, `interesse_form` |
| Falha | `form_error` | Envio falhou (servidor, validação ou rede) | `status` (HTTP; `0` = rede) e os mesmos de `form_submit` |
| **Contato** | `whatsapp_click` | Clique em qualquer botão de WhatsApp do site | `location` |
| Pós-lead | `lead_whatsapp_click` | WhatsApp da tela "Recebemos seus dados" | — |
| Compartilhamento | `share_empreendimento` | Compartilhar pelo WhatsApp, copiar link ou compartilhamento nativo | `share_method`, `share_position`, `page_url` |
| SEO local | `seo_link_click` | Clique em link marcado `data-seo` (páginas `/terrenos/…`, blocos "Encontre pelo seu perfil" e "Compare com outros terrenos") | `seo_origem`, `cluster`, `link_url`, `link_text` |
| Outros | `phone_click`, `select_faixa` | Clique em telefone; escolha da faixa de investimento no formulário | — |

### Conversões do Google Ads
Só `whatsapp_click` e `form_submit` disparam conversão do Ads (`adsConversions` em `config.js`).
- `form_submit` passou a disparar **somente em envio bem-sucedido**. Antes disparava também quando o envio
  falhava (e a tela de sucesso aparecia mesmo sem o lead ter sido gravado). Falhas agora geram `form_error`,
  sem conversão.
- `lead_whatsapp_click` **não** conta conversão: a pessoa já converteu ao cadastrar.

## Configuração no GA4 (uma vez)

1. **Administrador → Exibição de dados → Definições personalizadas → Dimensões personalizadas → Criar**
   (escopo *Evento*). Cadastre:

   | Nome | Parâmetro |
   |---|---|
   | Tipo de página | `page_type` |
   | Empreendimento | `empreendimento` |
   | Cidade do empreendimento | `cidade` |
   | Ferramenta usada | `tool` |
   | Faixa de parcela | `faixa_parcela` |
   | Origem do lead | `lead_source_tool` |
   | Posição do CTA | `cta_location` |
   | Texto do CTA | `cta_text` |
   | Local do formulário | `form_location` |
   | Método de compartilhamento | `share_method` |
   | Posição do compartilhamento | `share_position` |
   | Origem do link de SEO | `seo_origem` |
   | Cluster de SEO | `cluster` |

   O GA4 padrão permite 50 dimensões de evento. Dimensões só valem a partir da data de criação.
2. **Administrador → Exibição de dados → Eventos** (ou *Eventos-chave*): marque como evento-chave
   `form_submit`, `whatsapp_click` e `lead_whatsapp_click`. (Não marque `form_error`.)
3. **Explorar → Exploração de funil** com estas etapas, nesta ordem:
   1. `page_view` com `page_type` = `home` (ou sem filtro para o funil completo)
   2. `view_empreendimento`
   3. `tool_use`
   4. `open_form`
   5. `form_submit`
   6. `lead_whatsapp_click`

   Em paralelo, um segundo funil só de contato: `view_empreendimento` → `whatsapp_click`.
   Segmente por *Origem / mídia da sessão* para separar tráfego pago de orgânico.
4. **Explorar → Exploração em formato livre**, linhas *Empreendimento* e colunas *Nome do evento*,
   para ver qual empreendimento gera mais uso de simulador, formulário e WhatsApp.

## Perguntas que o funil responde

- Onde o tráfego pago se perde: visita → empreendimento → ferramenta → formulário → lead.
- Qual ferramenta (simulador, potencial construtivo, busca por preço, assistente de parcela) leva mais
  gente a abrir o formulário.
- Qual botão converte mais: `cta_location` e `cta_text` em `open_form` e `form_submit`. É a base para comparar
  os textos dos CTAs por intenção (mapa em `docs/cta-por-intencao.md`).
- Taxa de falha do envio: `form_error` dividido por `form_error` + `form_submit`.

## Etapas fora do site (lead qualificado → venda)

O site mede até o lead e o WhatsApp. O que acontece depois (qualificação e venda) fica no CRM e precisa ser
levado de volta:

- O `gclid` já é capturado e gravado com cada lead (coluna `gclid` no D1). Com ele dá para importar
  **conversões offline** no Google Ads (lead qualificado e venda), o que faz o Ads otimizar por
  qualidade, não só por volume.
- Para cruzar com o GA4 seria preciso guardar também um identificador do lead (por exemplo, o `id` da linha no
  D1) e enviá-lo no `form_submit`; isso exige a API `functions/api/lead.js` devolver o `id`.
  Ainda não implementado.

## Como consultar pelo Claude

O servidor em `mcp-google-analytics/` lê esses eventos. Exemplo de relatório de funil:
`ga4_run_report` com dimensão `eventName` e métrica `eventCount`, filtrando os eventos da tabela acima.
Os clusters de SEO estão descritos em `docs/seo-clusters.md`.
Para abrir por empreendimento, use a dimensão personalizada `customEvent:empreendimento` (depois de cadastrada).
