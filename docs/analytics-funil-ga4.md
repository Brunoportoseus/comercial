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
| **Lead** | `form_submit` | **Só quando o servidor confirma o cadastro** | `success` (`true`), `lead_id`, `form_location` (`modal`/`pagina`), `cta_location`, `cta_text`, `lead_source_tool`, `faixa_parcela`, `interesse_form` |
| Falha | `form_error` | Envio falhou (servidor, validação ou rede) | `status` (HTTP; `0` = rede) e os mesmos de `form_submit` |
| **Contato** | `whatsapp_click` | Clique em qualquer botão de WhatsApp do site | `location` |
| Pós-lead | `lead_whatsapp_click` | WhatsApp da tela "Recebemos seus dados" | `lead_id` |
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
   | ID do lead | `lead_id` |
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
- **`lead_id`:** a API `functions/api/lead.js` devolve o `id` da linha gravada no D1 (`lead_id`, `null` se só o
  webhook ou o e-mail guardou o lead), e o site o envia no `form_submit` e no `lead_whatsapp_click`. É o mesmo `id` que
  aparece na página `/admin/`, na exportação (`/api/leads-export`) e em `/api/leads-qualify`. Assim dá para ligar o
  evento do GA4 ao lead no CRM e, depois, ao lead qualificado ou à venda. É só um número sequencial: não carrega nome,
  telefone nem e-mail, e não deve ser trocado por dados pessoais.
- **Qualificação de volta ao GA4 (fase 2):** quando um lead é marcado como qualificado em `/admin/` (ou via
  `/api/leads-qualify`), o servidor envia um evento ao GA4 pelo Measurement Protocol, ligado ao mesmo visitante que gerou
  o lead. Veja a seção abaixo.

## Qualificação e venda no GA4 (Measurement Protocol)

Fluxo: o formulário envia o `ga_client_id` e o `ga_session_id` (cookies `_ga` e `_ga_<id>`) junto com o lead, **só para
quem aceitou os cookies**; `/api/lead` os grava no D1 (validados no formato do GA). Ao marcar o lead, `/api/leads-qualify`
envia o evento correspondente ao GA4.

| Status do lead | Evento no GA4 |
|---|---|
| `qualificado` (botão "Marcar qualificado" do `/admin/`) | `qualify_lead` |
| `fechado` (botão "Marcar fechado" do `/admin/`; `vendido` e `convertido` também valem por `/api/leads-qualify`) | `close_convert_lead` |
| `novo` e qualquer outro | nenhum (um evento enviado ao GA4 não pode ser desfeito) |

No `/admin/`, "Marcar fechado" pede o valor da venda e a data do fechamento (o valor vem preenchido se o lead já tinha sido
qualificado com valor), pede confirmação (o evento não pode ser desfeito no GA4) e, ao salvar, mostra um aviso com o resultado
do envio ao GA4 (enviado, já enviado, sem consentimento de cookies, não configurado ou falha). "Reverter" volta o lead para
`novo` e não envia nada ao GA4.

**Google Ads:** o CSV de conversões offline (`/api/leads-export?format=gads`, botão "Baixar CSV Google Ads") inclui leads
`qualificado` **e** `fechado` com `gclid`; o fechado sai com o valor e a data do fechamento. Se o mesmo lead já foi enviado
como qualificado e depois fecha, o novo arquivo traz outra linha para o mesmo clique (outro horário e valor): configure a ação de
conversão no Google Ads para contar *uma* conversão por clique, ou envie as vendas como outra ação com
`&status=fechado&conv_name=NOME_DA_ACAO` (e as qualificações com `&status=qualificado`).

Parâmetros do evento: `lead_id`, `lead_status`, `empreendimento`, `lead_source_tool`, `faixa_parcela`, `session_id` (quando
existe), e `value` + `currency` (BRL) quando o valor do negócio foi informado. **Nenhum dado pessoal** (nome, telefone, e-mail)
vai ao GA4.

### Configurar (uma vez)

1. **GA4 → Administrador → Fluxos de dados → o fluxo web → Measurement Protocol API secrets → Criar.** Copie o *segredo*.
2. **Cloudflare Pages → o projeto `terreno-curitiba-e-regiao` → Settings → Variables and Secrets** (Production), como
   *Secret* no segredo:
   - `GA4_MEASUREMENT_ID` = `G-09VDSHN8G3` (o mesmo de `assets/js/config.js`)
   - `GA4_API_SECRET` = o segredo criado no passo 1
3. **Testar sem gravar nada no GA4:** crie também `GA4_MP_DEBUG` = `1`, faça um novo deploy (ou *Retry deployment*), envie um
   lead de teste **aceitando os cookies**, marque-o como qualificado em `/admin/` e veja a resposta de
   `/api/leads-qualify` (aba Rede do navegador): `ga4.validationMessages` vazio = formato aceito. Depois remova
   `GA4_MP_DEBUG`, refaça o deploy e repita com outro lead de teste: o evento aparece em Tempo real em poucos minutos.
4. **GA4 → Eventos → marque como evento-chave** `qualify_lead` e `close_convert_lead` (se quiser vê-los como conversões), e
   cadastre as dimensões `lead_status` (e `lead_id`, `empreendimento`, `lead_source_tool`, `faixa_parcela`, se faltarem).

### Limites e cuidados

- **Só leads novos, de visitantes que aceitaram os cookies.** Lead antigo, ou de quem recusou, não tem `ga_client_id`: é
  qualificado normalmente, sem evento (`ga4.reason = "sem_client_id"` na resposta).
- **Sem duplicar:** a coluna `ga_eventos` guarda o que já foi enviado; marcar de novo o mesmo estágio não repete o evento.
  Reverter para `novo` e qualificar outra vez também não repete.
- **Falha no GA4 não atrapalha:** a qualificação no D1 é salva antes, e o motivo aparece em `ga4.reason`
  (`ga4_erro`, `ga4_http_<código>`, `ga4_nao_configurado`).
- **Atribuição:** o evento chega dias depois do clique. O `session_id` guardado tenta ligá-lo à sessão original; se o GA4 não
  casar, ele entra pelo usuário (relatórios por usuário e por `lead_id`), e a origem em relatórios de sessão pode aparecer
  como "(not set)". Para o Google Ads, o caminho de otimização continua sendo a importação por `gclid`.
- **Privacidade:** o `client_id` vem dos cookies de análise e só é coletado com aceite; a política de cookies já diz que o
  GA4 é usado com consentimento. Se quiser, vale mencionar na política de privacidade que o estágio do atendimento
  (lead qualificado) é associado ao identificador de análise, sem dados pessoais.

## Como consultar pelo Claude

O servidor em `mcp-google-analytics/` lê esses eventos. Exemplo de relatório de funil:
`ga4_run_report` com dimensão `eventName` e métrica `eventCount`, filtrando os eventos da tabela acima.
Os clusters de SEO estão descritos em `docs/seo-clusters.md`.
Para abrir por empreendimento, use a dimensão personalizada `customEvent:empreendimento` (depois de cadastrada).
