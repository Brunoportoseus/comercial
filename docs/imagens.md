# Imagens do site

As fotos das páginas são servidas em **WebP, em vários tamanhos** (`srcset`/`sizes`), e as tags `<img>` trazem `width` e
`height` (a página não "pula" enquanto a foto carrega). O navegador baixa só o tamanho de que precisa: um celular baixa a
versão de 1000 px, um notebook, a de 640 px; a versão grande (1400 px) só é baixada quando alguém abre o zoom da galeria.

Medição local de 1 de out. de 2026, página inteira com rolagem (só imagens de `assets/img/`):

| Página | Antes | Celular (tela 3x) | Notebook |
|---|---|---|---|
| Home | 891 KB | 425 KB | 352 KB |
| Almirante Tamandaré | 1,5 MB | 739 KB | 279 KB |
| Bela Vista | 2,9 MB | 865 KB | 387 KB |
| Sierra Vista | 3,4 MB | 1,0 MB | 449 KB |
| Jardim Mazza | 2,3 MB | 1,4 MB | 760 KB |

Total das 8 páginas medidas: −58% no celular e −78% no notebook.

## Como funciona

- `scripts/imagens/otimizar.py` (rode da raiz do repositório) gera, para cada foto usada em `<img>`,
  `assets/img/<nome>-<largura>.webp` (640, 1000, 1400 px, e a largura original quando passa de 1400; a capa da home vai até
  1774 px) e troca a tag da foto nas páginas. É idempotente: não refaz o que já existe.
- Os **JPGs originais continuam em `assets/img/`**. São usados em `og:image`/`twitter:image` e no JSON-LD (redes sociais leem
  JPG com mais segurança) e servem de fallback para links antigos. Nada foi apagado.
- Os arquivos novos têm nomes novos, então o cache de 1 ano de `/assets/*` (`_headers`) não atrapalha.
- Na galeria, `data-full` aponta para a versão grande e o zoom (`site.js`) a usa.
- `sizes` por contexto está no topo do script. No celular a galeria declara `85vw` de propósito: a foto ocupa ~91% da largura,
  mas assim telas 3x escolhem a versão de 1000 px (quase igual na tela) em vez da de 1400 px, que pesa quase o dobro.

## Foto nova

1. Coloque o JPG em `terreno-curitiba-e-regiao/assets/img/` (use ~1600 px de largura, sem mais que isso).
2. Use a tag no HTML normalmente (`<img src="/assets/img/nome.jpg" alt="…" loading="lazy">`; a galeria usa `figure.media`).
3. Rode `python3 scripts/imagens/otimizar.py`. Ele gera os WebP e troca a tag. Se avisar "contexto não reconhecido", a foto está
   num lugar do layout que ainda não tem `sizes`: adicione o contexto em `SIZES`/`contexto()`.
4. Foto de capa do `og:image` continua em JPG (a tag `<meta>` não é trocada).

## Limpeza opcional

Depois da troca, 54 JPGs (≈12,9 MB) deixaram de ser referenciados por qualquer página (as fotos de galeria e a capa da home), e
alguns já estavam sem uso antes (`masterplan.jpg`, `lote2.jpg`, `video-poster.jpg`, `rec1`–`rec3`). Podem ser apagados para
enxugar o repositório; ficam no histórico do git.
