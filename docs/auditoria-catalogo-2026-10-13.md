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
