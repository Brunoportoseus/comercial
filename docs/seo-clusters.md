# Clusters de SEO local — /terrenos/

Páginas que respondem a buscas por perfil ("terreno entrada até 10 mil", "terreno até 200 mil em Almirante
Tamandaré", "terrenos em Lamenha Grande"…), ligando a busca ao empreendimento certo.

| URL | Critério |
|---|---|
| `/terrenos/` | Hub com todos os perfis |
| `/terrenos/entrada-ate-10-mil/` | entrada informada ≤ R$ 10.000 |
| `/terrenos/ate-200-mil-almirante-tamandare/` | Almirante Tamandaré, preço ≤ R$ 200.000 |
| `/terrenos/lamenha-grande/` | bairro Lamenha Grande |
| `/terrenos/140-m2-almirante-tamandare/` | lotes de 140 m² (Bela Vista, Valparaíso, Jardim Veneza) |
| `/terrenos/financiamento-direto/` | empreendimentos com entrada e parcela publicadas |
| `/terrenos/perto-de-curitiba/` | todos os terrenos, por cidade |

## Como funciona

- **Fonte única dos dados:** o array `PROD` da home (`terreno-curitiba-e-regiao/index.html`). As tabelas e os
  cards são gerados a partir dele; ao atualizar preço, entrada ou parcela lá, é só rodar de novo.
- `scripts/seo-clusters/gerar.py` (raiz do repositório) reescreve as 7 páginas de `terreno-curitiba-e-regiao/terrenos/`.
  Cabeçalho, menu, rodapé e modal são clonados de um artigo existente (`conteudos/terreno-em-condominio-fechado-vale-a-pena/`),
  então acompanham ajustes globais de layout.
- `scripts/seo-clusters/integrar.py` costura as páginas ao site, com marcadores `<!--seo:…-->` (pode rodar várias vezes):
  link "Terrenos por perfil" no rodapé de todas as páginas, seção "Encontre pelo seu perfil" na home (`#perfis`),
  bloco nas 8 páginas de cidade, bloco "Compare com outros terrenos" nas páginas de empreendimento e URLs no `sitemap.xml`.

```
python3 scripts/seo-clusters/gerar.py && python3 scripts/seo-clusters/integrar.py
```

Se mudar o `?v=` global (cache-busting), rode `gerar.py` depois: ele herda o valor do artigo-modelo.

## Novo cluster

Adicione um item em `CLUSTERS` (`gerar.py`): `slug`, `title`, `h1`, `meta`, `filter`, `sort`, `lead`, `sections`, `faq`,
`related`, `articles`. Inclua o slug em `HOME_CARDS`/`CITY_SLUGS` (`integrar.py`) se for aparecer na home ou nas cidades.

## Regras de conteúdo

- Só afirmar o que está confirmado: preço, entrada, parcela e metragem do `PROD`; reajuste anual pelo IPCA;
  quitação antecipada com abatimento proporcional dos juros; parcelamento direto (sem banco) com análise de crédito.
- Não afirmar distâncias, valorização nem "menor/maior" sem base nos números publicados.
- Ecoville II: entrada e parcela são dos lotes promocionais; o lote padrão (R$ 168.300 / R$ 6.732 / R$ 1.548,72)
  aparece em nota abaixo da tabela.
- Todas as páginas trazem fonte (EVEX Imóveis) e data "Atualizado em …". Revisar a data quando os valores mudarem.

## Medição (GA4)

- `page_type = cluster` nas páginas de `/terrenos/`.
- `seo_link_click` em todo link `a[data-seo]`: `seo_origem` (`cluster_<slug>`, `relacionado`, `hub`, `hub_card`, `artigo`,
  `home_perfil`, `cidade`, `empreendimento`…), `cluster` (slug da página), `link_url`, `link_text`.
- O CTA da página abre o formulário com `lead_source_tool = cluster_<slug>` (`cluster_hub` no hub); ele chega em
  `open_form`, `form_submit` e na coluna `lead_source_tool` do lead.
- Cadastre `seo_origem` e `cluster` como dimensões de evento no GA4 (veja `analytics-funil-ga4.md`).

## Depois de publicar

1. Search Console → Sitemaps: reenviar `sitemap.xml` (agora com 59 URLs).
2. Inspeção de URL nos 7 endereços novos → "Solicitar indexação".
3. Acompanhar em 4–8 semanas: impressões/cliques por página em Desempenho, e no GA4 `seo_link_click` e leads com
   `lead_source_tool` começando em `cluster_`.
