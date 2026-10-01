# Relatório do GA4 — pedido pronto para o Claude Code

O servidor `mcp-google-analytics/` roda na VM, então o relatório é gerado lá: abra o `claude` no terminal da VM
(onde o `google-analytics` está configurado; veja `mcp-google-analytics/README.md`) e cole o pedido abaixo.

## Quando rodar

- **1ª rodada: ~7 dias depois de o funil, os clusters de SEO e os CTAs por intenção entrarem no ar** (1 de out. de 2026).
  Antes disso o relatório sai quase vazio.
- **Leitura dos CTAs: 2 a 4 semanas** e pelo menos ~30 aberturas do formulário por texto. Antes disso, é só tendência.
- Depois, repetir a cada 2 a 4 semanas.

## Antes de rodar

Cadastre no GA4 as dimensões de evento (Administrador → Exibição de dados → Definições personalizadas), listadas em
`docs/analytics-funil-ga4.md`: `page_type`, `empreendimento`, `cidade`, `tool`, `faixa_parcela`, `lead_source_tool`,
`cta_location`, `cta_text`, `form_location`, `share_method`, `share_position`, `seo_origem`, `cluster`, `lead_id`, `lead_status`.
Cada dimensão só vale a partir da data de criação; sem cadastro, os blocos 3 a 8 dão erro.

## Pedido

```
Monte o relatório do GA4 de terrenoscuritibaeregiao.com.br usando ga4_run_report.
Período: os últimos 7 dias (e compare com os 7 anteriores, se houver dados).
Para cada bloco, mostre uma tabela e 1 ou 2 linhas de leitura. Diga explicitamente
quando faltar dado, em vez de inferir.

1. Visão geral: sessões, usuários, taxa de engajamento, por origem/mídia da sessão
   (sessionSourceMedium). Separe tráfego pago de orgânico.
2. Funil (eventCount e usuários por eventName): page_view, view_empreendimento, tool_use,
   open_form, form_submit, lead_whatsapp_click, whatsapp_click. Calcule a taxa de cada
   etapa para a seguinte. Taxa de falha do envio: form_error / (form_error + form_submit).
3. Por empreendimento (customEvent:empreendimento): view_empreendimento, tool_use,
   open_form, form_submit, whatsapp_click.
4. Ferramentas (customEvent:tool em tool_use): qual leva mais gente a abrir o formulário.
5. Assistente de parcela da home: budget_select por customEvent:faixa_parcela e
   budget_result_click.
6. CTAs: open_form e form_submit por customEvent:cta_text x customEvent:cta_location.
   Taxa = form_submit / open_form. Compare só botões na mesma posição e no mesmo tipo
   de página (customEvent:page_type). Trate como inconclusivo o que tiver menos de
   ~30 aberturas por texto.
7. Clusters de SEO: page_type = cluster; sessões por pagePath (/terrenos/…), origem
   orgânica, seo_link_click por customEvent:seo_origem, e leads com
   customEvent:lead_source_tool começando em "cluster_".
8. Compartilhamento: share_empreendimento por customEvent:share_method.
9. Qualificação (depois de configurar o Measurement Protocol, veja analytics-funil-ga4.md): qualify_lead e
   close_convert_lead por customEvent:empreendimento e customEvent:lead_source_tool, com a soma de value (eventValue).
   Compare com form_submit dos mesmos empreendimentos/origens para ver quais geram lead qualificado, não só lead.

Se uma dimensão personalizada der erro, é porque ainda não foi cadastrada no GA4; liste
quais faltam. Ao final, resuma em 5 linhas: o que está bom, o que está travando o funil e
a ação que eu faria primeiro.
```

## Referências

- Eventos e parâmetros: `docs/analytics-funil-ga4.md`
- Textos dos CTAs e como compará-los: `docs/cta-por-intencao.md`
- Clusters de SEO e medição: `docs/seo-clusters.md`
- Sem a VM: exporte as tabelas do GA4 em CSV (Explorar → exportar) e peça a análise ao Claude.
