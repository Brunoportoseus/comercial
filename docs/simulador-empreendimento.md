# Simulador das páginas de empreendimento (`#empsim`)

Cada página de empreendimento com preço tem um simulador (`<section id="empsim" data-preco data-entrada data-prazo data-taxa>`),
com o script embutido na própria página. Regras desde 1 de out. de 2026:

| Campo | Regra |
|---|---|
| **Preço** | Travado (`readonly`) no valor do empreendimento (`data-preco`). É o preço de partida; nas páginas do Ecoville II usa o lote padrão (R$ 168.300). |
| **Entrada** e **Prazo** | Editáveis. |
| **Juros** com taxa publicada | Editável, começa na taxa da tabela de condições da página (ex.: 0,9% a.m.). |
| **Juros** sem taxa publicada | Travado (`readonly`) em **0,9% a.m.** (`data-taxa="0.9"`), com a nota "Taxa de referência da estimativa (fixa)". |

Páginas com taxa publicada (tabela de condições com juros): Bela Vista, Ecoville I e II, Jardim Mazza e Valparaíso.
Sem taxa publicada (juros travados em 0,9%): Sierra Vista, Vista Alegre, Le Vert e Vivendas do Parque.

**Cortona (desde 5 de out. de 2026):** a condição publicada traz só as parcelas (120x de R$ 3.131,23 e 180x de R$ 2.597,64, entrada de 5%),
sem a taxa. As duas parcelas correspondem à mesma taxa mensal, 0,948879% (equivale a 12% ao ano), então o simulador a usa **travada**
(`data-taxa="0.948879"`) para reproduzir exatamente as parcelas publicadas (180x aparece de início; ao mudar o prazo para 120, dá R$ 3.131,23).
A entrada mínima é de 5% (`minEnt` com 0.05; no simulador geral, `"minPct": 0.05` no Cortona do `EMPS` de `/financiamento/`).
A mesma conta bate com a tela do app da incorporadora (lote L-168: à vista R$ 236.800, entrada R$ 11.840, 180x de R$ 2.611,76), que também reajusta pelo IPCA.

**Cortona por grupo de lotes (desde 5 de out. de 2026):** a página tem um seletor `#sLote` com 5 grupos de lotes (cada `<option>` traz `data-preco` e `data-entrada`): 120…195 e 124…181 (128 m²), 66 e 67 (160 m²), 48 (178,16 m²) e 88 (204 m²). Ao trocar o grupo, o preço e a entrada mínima (5%, com centavos: `Math.round(p*5)/100`) são recalculados. As parcelas de todos os grupos conferem com a taxa de 0,948879% a.m. O preço de partida (`data-preco`) é o do primeiro grupo, R$ 235.520, que é o "a partir de" dos cards, da home e das páginas de SEO.

**Siena, Firenze e Morada do Bosque (desde 5 de out. de 2026):** usam a **mesma taxa travada de 0,948879% a.m.** (`data-taxa="0.948879"` e `"taxa": 0.948879` no `EMPS`), com a entrada mínima padrão de 10% (a incorporadora ainda não publicou a entrada desses). As parcelas são estimativas; o PDF de São José dos Pinhais mostra entrada de 10% e 120x/180x calculadas com essa taxa.

## Quando a EVEX publicar condições de um empreendimento

1. Atualize `data-preco`, `data-entrada`, `data-prazo` e `data-taxa` da seção `#empsim`.
2. Se agora há taxa publicada, remova `readonly aria-readonly="true"` do `<input id="sTaxa">` e a nota "Taxa de referência da estimativa (fixa)."
   Se deixar de haver, faça o inverso (e `data-taxa="0.9"`).
3. Ajuste o texto de apoio do simulador ("Ajuste a entrada … e o prazo. O preço e os juros são de referência." sem taxa; "… o prazo e os juros." com taxa).
4. Mantenha `data-preco` igual ao preço do array `PROD` da home (para o Ecoville II, o do lote padrão).

A parcela é uma **estimativa pela Tabela Price**, sem o reajuste anual pelo IPCA; a condição real é confirmada com o corretor.
