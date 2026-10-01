# Fontes do site

As fontes **Manrope** (títulos) e **Inter** (texto) são servidas pelo próprio site, em `terreno-curitiba-e-regiao/assets/fonts/`
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
| `manrope-latin.woff2` | títulos (pesos 500 a 800), pré-carregada | 24 KB |
| `inter-latin.woff2` | texto (pesos 400 a 700), pré-carregada | 47 KB |
| `manrope-latin-ext.woff2`, `inter-latin-ext.woff2` | só baixadas se a página tiver caracteres fora do latino comum | 14 KB e 83 KB |

`font-display: swap`: o texto aparece na hora com a fonte do sistema e troca quando a fonte chega.

Licença: Manrope e Inter usam a SIL Open Font License 1.1, que permite hospedar e redistribuir as fontes.

## Se trocar ou atualizar uma fonte

Os arquivos estão em `/assets/*`, que tem cache de 1 ano (`_headers`). Para trocar um arquivo, use **outro nome** (ex.:
`inter-latin-2.woff2`) e atualize o `@font-face` e os `<link rel="preload">` das páginas. Para obter os arquivos, abra a URL do
Google Fonts desejada com um navegador atual (`https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap`) e baixe
os `.woff2` dos blocos `latin` e `latin-ext`.
