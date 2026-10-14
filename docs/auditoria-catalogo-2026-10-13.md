# Auditoria do catálogo (13/10/2026)

Cruzamento da especificação "Atualização do catálogo imobiliário" (pasta EVEX no Drive) com o site. A tabela completa está em
`auditoria-catalogo-2026-10-13.csv`.

## O que entrou no ar (nos dois sites)

- **Vila Moraes** (Curitiba, Portão): página nova em `/curitiba/vila-moraes/`, só com dados estruturais do material. Preço, entrada,
  entrega e estoque ficam "sob consulta".
- **Residencial Ravena** e **Colinas do Tanguá**: ficha técnica completada (torre, unidades, plantas, tipologias, lazer, vagas, CEP).
- Cartões e comparador de Curitiba, sitemap e array `PROD` da home atualizados. As páginas de cluster de SEO não mudam: `gerar.py`
  agora trata "sobrado" como produto que não é terreno (como já fazia com apartamentos e casas).

## O que NÃO foi publicado, e por quê

Regra da especificação: não publicar preço, entrega ou estoque sem validação da equipe, e não tratar projeto de casa como casa à venda.

- Preços do espelho histórico da Vila Moraes (R$ 850 mil e R$ 900 mil) e da Ravena; sinal/entrada de fichas antigas; entrega
  (06/2026 da Vila Moraes, 21/12/2026 do Colinas); exemplo de R$ 278 mil do Colinas.
- **Fýsi Residencial** e **Jardim Florença**: produto, localização, preço e estoque a validar.
- Demais nomes da lista ampliada: a especificação não traz endereço, tipo, área, preço nem estoque.
- Quebec e Vista Alegre: material tem projetos de casa, que não comprovam oferta de casa pronta.

## Pendências para a equipe

1. Confirmar preços e estoque por unidade (Vila Moraes e Ravena) e o status da entrega.
2. Enviar fotos autorizadas e plantas baixas (nenhum arquivo de imagem foi incorporado; há um `TODO` na página da Vila Moraes).
3. Confirmar se o Colinas do Tanguá tem tipo de 1 dormitório (a especificação cita "Tipos 1, 2, 2 com suíte e 3").
4. Confirmar a natureza das unidades do Jardim Mazza (lote ou casa).
5. Dados de endereço, tipo e preço dos demais empreendimentos para novas páginas.

## Atualização (13/10/2026, segunda rodada)

- **Bela Vista** atualizado com o relatório de estoque: 16 lotes à venda a R$ 209.800 (140 e 144,06 m²), entrada de 4% (R$ 8.392) e
  parcelas recalculadas com as regras da tabela anterior (312x e 252x a 0,9% a.m., 192x a 1,0% a.m.). Saiu a promoção do lote 32.
- **Páginas novas "sob consulta"** (autorizadas pelo Bruno), com o que o Drive confirma: Floresta do Lago (Campo Largo), Fazenda Di Trento
  (Piraquara), Ecopark (Quatro Barras, com página de cidade nova) e Residencial Foggiatto (São José dos Pinhais). Nenhuma tem endereço,
  preço nem foto, porque os arquivos do Drive não trazem endereço e as tabelas são de 2024 e 2025.
- As tabelas EVEX da pasta Floresta usam 0,9488% a.m. nas parcelas de 120x e 180x, a mesma taxa aplicada ao Cortona.
- `gerar.py` e `integrar.py` agora aceitam `SEO_ROOT`, `SEO_SITE` e `SEO_BRAND` para gerar as páginas de cluster do site de imóveis
  (veja `docs/seo-clusters.md`).

## Atualização (13/10/2026, terceira rodada: outras pastas do Drive)

- A cópia da pasta no Drive do Bruno é a única que abre os arquivos; as pastas originais da EVEX aparecem vazias para o Claude.
- **Páginas novas "sob consulta"** (autorizadas): Lockwood, NOA, Mirá e Fýsi (Curitiba) e Vivendas do Sol (São José dos Pinhais). Sem preço e sem foto.
- **Mirá** ficou sem endereço e sem metragem porque o e-book e a tabela trazem endereços diferentes.
- **Fýsi**: as casas do folder são projetos de exemplo; a condição de 2026 (sinal de 20%, 60x, IPCA + 1% ao mês) não foi publicada.
- **Vivendas do Parque**: o e-book fala em lotes de 122 m², mas a metragem do site (a partir de 140 m²) não foi alterada, porque falta o preço do lote menor.
- Sem acesso: Canet Junior, Bairru (demais empreendimentos), Paraíso e Elio Winter (Lumina, Dona Sofia).

## Atualização (13/10/2026, quarta rodada)

- **Firenze** passou a mostrar a ficha técnica do Drive: 139 lotes, lotes residenciais de 128 a 386,32 m², lazer entregue e parâmetros construtivos. O "a partir de R$ 281.600" é coerente com o lote de 128 m² (R$ 2.200 por m²).
- Fichas de Siena, Cortona e Morada do Bosque não foram encontradas; a pasta "Morada do Bosque" compartilhada pela Bairru aparece vazia.

## Atualização (14/10/2026, quinta rodada: tabelas de outubro/2026)

Fonte: pasta "Outros Materiais" (cópia no Drive do Bruno) e textos enviados no chat. As pastas Moradas do Bosque, Terras de Pietro, Bela Vista
(originais da Bairru/Elio Winter), Palazzo Stival, Venezian, Sprada 402 e a pasta MAKE IT (SharePoint) continuam sem arquivos legíveis.

- **Vista Alegre (Araucária):** tabela de 13/10/2026 (GV Sul) com 61 lotes disponíveis de 126 a 606,36 m²; "a partir de" passou de R$ 190.060,20 para
  **R$ 170.100** (lote de 126 m²). Sinal de 4% (parcelável em 2x), 120x e 180x a 1% a.m. O lote 3/2/1 tem a parcela de 120x omitida na página,
  porque a tabela traz R$ 3.337,83 e o cálculo dá R$ 3.018,34. O lote "sócios" (quadra 10, lote 11) não foi publicado.
- **Jardim Mazza:** valores já coincidiam com o texto (R$ 189.000, sinal de R$ 7.560, 312x/252x/192x). O simulador passou a usar o sinal de 4%, como a tabela.
- **Quebec (SJP):** lote 41 de 161,09 m², R$ 160.000, sinal de R$ 6.400 (4%), 312x/252x/192x. Conferido pela Tabela Price.
- **Origens (Curitiba):** tabela 09/2026 (gerada em 29/09/2026), 22 lotes disponíveis de 131,62 a 253,10 m², a partir de R$ 429.607,68. Plano: ato, parcela anual,
  11 mensais e financiamento de cerca de 80%; entrega em setembro de 2027. Lotes "Reservada" não foram listados.
- **Foggiatto (SJP), Santa Helena e João Andreassa (Campo Largo), Santa Bárbara (Fazenda Rio Grande):** tabela "Diversos" de outubro/2026 (entrada de 10%,
  48x sem juros em alguns, 60x a 0,75% e 120x/180x/240x a 0,9488% a.m.). Todas as parcelas foram conferidas pela Tabela Price.
- **Floresta Angá (Pinhais, página nova):** book (77 lotes a partir de 815 m², Estrada Ecológica de Pinhais, 1168) e tabela de outubro/2026 (37 unidades,
  de R$ 1.277.219,26 a R$ 2.974.271,45; entrada de 10% e 36 mensais). Sem simulador, porque o saldo é reajustado pelo INCC.
- **Kasa Vik (Campo Comprido, Curitiba, página nova):** tabela de outubro/2026 (válida até 31/10/2026) com 21 lotes dos urbanísticos Vik 264 e Vik 428;
  ato de 10%, 8 mensais (5%) e 85% na entrega (CVCO), financiável em até 180x a 0,8% a.m. + IPCA. O endereço não consta. Entrega confirmada pelo Bruno em 14/10: Vik 264 em julho/2027; novembro/2028 ficou para o Vik 428 (por exclusão). O lote 43 do Vik 428 tem plano diferente e ficou sem parcelas.
- **Vistas do Brasil e Villa Belluno (Fazenda Rio Grande, páginas novas):** só as condições do texto enviado (sem tabela). O Villa Belluno não tem valor total nem prazo.
- **Imóvel na Rua Lourenço Pinto (Centro de Curitiba, página nova):** terreno de 386,74 m² com 1.165,40 m² construídos, R$ 4.000.000, entrada de 20% e 48 meses a 1% a.m. + IPCA.
- **Morada do Bosque:** da tabela de 24/01/2026 entraram a entrada de 5% (R$ 16.615), a metragem (250 a 378,39 m²) e as parcelas do lote de 250 m² (180x de R$ 3.665,06).
- **Não publicados:** Floresta Wolf (sem cidade/endereço), Edge (apartamentos), Palazzo Stival, Venezian, Sprada 402, Terras de Pietro e MAKE IT (sem acesso aos arquivos).
- Cidades novas com produto: **Fazenda Rio Grande** e **Pinhais** (páginas de cidade convertidas).
