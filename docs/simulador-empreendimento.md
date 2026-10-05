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
Sem taxa publicada (juros travados em 0,9%): Sierra Vista, Vista Alegre, Le Vert, Vivendas do Parque, Firenze, Siena e Morada do Bosque.

**Cortona (desde 5 de out. de 2026):** a condição publicada traz só as parcelas (120x de R$ 3.131,23 e 180x de R$ 2.597,64, entrada de 5%),
sem a taxa. As duas parcelas correspondem à mesma taxa mensal, 0,948879% (equivale a 12% ao ano), então o simulador a usa **travada**
(`data-taxa="0.948879"`) para reproduzir exatamente as parcelas publicadas (180x aparece de início; ao mudar o prazo para 120, dá R$ 3.131,23).
A entrada mínima é de 5% (`minEnt` com 0.05; no simulador geral, `"minPct": 0.05` no Cortona do `EMPS` de `/financiamento/`).

## Quando a EVEX publicar condições de um empreendimento

1. Atualize `data-preco`, `data-entrada`, `data-prazo` e `data-taxa` da seção `#empsim`.
2. Se agora há taxa publicada, remova `readonly aria-readonly="true"` do `<input id="sTaxa">` e a nota "Taxa de referência da estimativa (fixa)."
   Se deixar de haver, faça o inverso (e `data-taxa="0.9"`).
3. Ajuste o texto de apoio do simulador ("Ajuste a entrada … e o prazo. O preço e os juros são de referência." sem taxa; "… o prazo e os juros." com taxa).
4. Mantenha `data-preco` igual ao preço do array `PROD` da home (para o Ecoville II, o do lote padrão).

A parcela é uma **estimativa pela Tabela Price**, sem o reajuste anual pelo IPCA; a condição real é confirmada com o corretor.
