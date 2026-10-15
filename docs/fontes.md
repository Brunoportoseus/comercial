# Fontes do site

As fontes **DM Sans** (títulos) e **Manrope** (texto, menu, botões e informação comercial como preços) são servidas pelo próprio site (site Terrenos; o site Imóveis ainda usa Manrope e Inter), em `terreno-curitiba-e-regiao/assets/fonts/`
(`@font-face` no topo de `assets/css/site.css`). Antes vinham do Google Fonts.

Por quê:
- **Privacidade (LGPD):** o Google Fonts fazia o navegador de cada visitante falar com servidores do Google assim que a página
  abria, antes de qualquer resposta ao aviso de cookies, expondo o IP. Agora não há nenhum pedido a `fonts.googleapis.com` nem
  a `fonts.gstatic.com`.
- **Velocidade:** some uma folha de estilo externa que bloqueava a renderização e duas conexões extras (`preconnect`). As duas
  fontes principais são pré-carregadas (`<link rel="preload" … crossorigin>` em cada página).

O que há na pasta (formato woff2, fontes variáveis; as mesmas que o Google serve, nos mesmos intervalos de caracteres):

| Arquivo | Uso | Peso |
|---|---|---|
| `dmsans-latin.woff2` | títulos h1 a h4 (pesos 500 a 700, eixo de tamanho óptico), pré-carregada | 61 KB |
| `manrope-latin.woff2` | texto, menu, botões e preços (pesos 400 a 800), pré-carregada | 24 KB |
| `dmsans-latin-ext.woff2`, `manrope-latin-ext.woff2` | só baixadas se a página tiver caracteres fora do latino comum | 31 KB e 14 KB |

Papéis no CSS (`:root` de `assets/css/site.css`): `--font-display` (DM Sans) nos títulos; `--font-head` e `--font-body` (Manrope) no
resto. A Inter deixou de ser usada no site Terrenos (15/10/2026) e os arquivos foram removidos. Como o Manrope tem altura-x menor
que a Inter, o corpo do texto subiu de 17 para 17,6 px.

`font-display: swap`: o texto aparece na hora com a fonte do sistema e troca quando a fonte chega.

Licença: DM Sans e Manrope usam a SIL Open Font License 1.1, que permite hospedar e redistribuir as fontes.

## Se trocar ou atualizar uma fonte

Os arquivos estão em `/assets/*`, que tem cache de 1 ano (`_headers`). Para trocar um arquivo, use **outro nome** (ex.:
`dmsans-latin-2.woff2`) e atualize o `@font-face` e os `<link rel="preload">` das páginas. Para obter os arquivos, abra a URL do
Google Fonts desejada com um navegador atual (`https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500..700&display=swap`) e baixe
os `.woff2` dos blocos `latin` e `latin-ext`.
