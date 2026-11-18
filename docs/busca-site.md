# Busca do site (lupa no cabeçalho) — terreno-curitiba-e-regiao

Busca global, visível no desktop e no mobile (ícone de lupa ao lado do menu). Abre um painel com
resultados agrupados: **Empreendimentos** (com cidade, bairro, metragem, preço, entrada/parcela),
**Cidades**, **Terrenos por perfil**, **Conteúdos** e **Páginas**.

## Como funciona

- **Índice estático:** `terreno-curitiba-e-regiao/assets/js/search-index.json`, gerado por
  `scripts/busca/gerar.py` a partir do array `PROD` da home (fonte única de preço/entrada/parcela) e do
  `<title>`/`<meta description>` de todas as páginas públicas. Páginas `noindex` (admin, obrigado, 404) ficam fora.
- **Carregamento sob demanda:** o JSON (~36 KB) só é baixado quando a pessoa abre a busca (ou passa o mouse na lupa).
  Nenhum custo para quem não busca.
- **Casamento de texto:** por prefixo de palavra, sem acentos e sem maiúsculas ("sao jose" acha "São José dos Pinhais";
  "140 m²" acha os lotes de 140 m²). Toda palavra digitada precisa casar em algum campo (título, cidade/bairro,
  palavras-chave ou descrição); o título pesa mais.
- **Valores:** "até 200 mil", "200mil", "R$ 250.000" ou "250000" acrescentam o grupo
  **"Empreendimentos até R$ X"** com os empreendimentos de preço publicado dentro do limite, do mais barato
  ao mais caro. Se houver cidade/bairro junto ("200 mil almirante"), restringe a ela.
- **Teclado:** `↑`/`↓` navegam, `Enter` abre o resultado destacado (ou o primeiro), `Esc` fecha, `Ctrl/Cmd+K` abre.
- **Atalhos por URL:** `/?busca=termo` abre a busca já preenchida; qualquer link `href="#buscar"` abre o painel
  (usado na página 404).
- **Sem resultado:** mensagem com links para `/terrenos/` e `/comparar/`; o rodapé do painel tem
  "Não achou? Fale com o corretor", que abre o formulário de lead com `lead_source_tool=busca_site`.

## Analytics (GA4, via `window.trackEvent`)

| Evento | Quando | Parâmetros |
|---|---|---|
| `tool_use` | ao abrir a busca | `tool: busca_site` |
| `search` | 0,7 s depois de parar de digitar (1x por termo) | `search_term`, `resultados` |
| `search_result_click` | clique em um resultado | `search_term`, `link_url`, `tipo`, `posicao` |
| `search_quick_click` | clique em uma "busca frequente" (painel vazio) | `link_text`, `link_url` |

## Manutenção

Depois de **criar/remover páginas** ou **alterar o `PROD`** (preço, entrada, parcela, bairro), rode da raiz do repositório:

```
python3 scripts/busca/gerar.py
```

Idempotente: reescreve o JSON. Para o site de imóveis (mesma estrutura):
`SEO_ROOT=imoveis-curitiba-e-regiao SEO_BRAND="Imóveis Curitiba e Região" python3 scripts/busca/gerar.py`
(o site de imóveis ainda **não** tem o botão da lupa nem o JS/CSS da busca; é só o gerador que já está pronto).

Arquivos envolvidos: botão `.nav-search` no cabeçalho de todas as páginas (antes do CTA "Receber opções"),
estilos em `assets/css/site.css` (bloco "Busca do site"), lógica em `assets/js/site.js` (bloco "Busca do site").
As "buscas frequentes" do painel vazio são a lista `QUICK` no JS.
