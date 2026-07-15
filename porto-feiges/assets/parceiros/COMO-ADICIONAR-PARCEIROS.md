# Como adicionar logos de parceiros

A seção **Parceiros** da Home monta os logos automaticamente a partir desta pasta.

## Como fazer

1. Coloque os arquivos dos logos aqui em `porto-feiges/assets/parceiros/`
2. Nomeie **exatamente** assim, em sequência (sem pular números):
   - `parceiro-1.png`
   - `parceiro-2.png`
   - `parceiro-3.png`
   - … e assim por diante (até `parceiro-20`)
3. Commit (pode ser direto na `main`). Em ~1 min o site republica e os logos aparecem.

## Formatos aceitos

`.png` · `.svg` · `.jpg` · `.webp` — o site tenta essas extensões automaticamente.
Recomendado: **PNG ou SVG com fundo transparente**.

## Comportamento automático

- A seção **só aparece** quando existe pelo menos 1 arquivo (`parceiro-1`).
- Slots sem arquivo **somem** — não precisa mexer no código.
- A ordem na tela segue a numeração dos arquivos.

## Dica

Se um logo estiver muito grande ou pequeno em relação aos outros, me avise que eu ajusto o tamanho daquele card — ou padronize as imagens com uma margem interna parecida antes de subir.
