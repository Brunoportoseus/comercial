# Squad de Negócios — Agentes Especializados

Squad de 7 subagentes especializados para apoiar decisões de negócio com profundidade técnica e visão multidisciplinar.

## Membros do Squad

| # | Agente | Foco | Modelo |
|---|--------|------|--------|
| 1 | **contabil** | Contabilidade societária e tributária (BR GAAP, CPC, IFRS) | sonnet |
| 2 | **direito** | Direito empresarial, contratos, compliance, LGPD | sonnet |
| 3 | **financas** | Modelagem financeira, valuation, viabilidade (VPL/TIR) | sonnet |
| 4 | **planejamento-estrategico** | Estratégia, OKRs, Porter, Canvas, posicionamento | sonnet |
| 5 | **consultor-critico** | Devil's advocate — desafia premissas, pré-mortem | opus |
| 6 | **analista-mercado** | TAM/SAM/SOM, concorrência, tendências, GTM | sonnet |
| 7 | **analista-dados** | Estatística, BI, modelagem, A/B test, causalidade | sonnet |

## Fluxos de colaboração sugeridos

### Avaliar um novo negócio / produto
```
analista-mercado → financas → contabil + direito (paralelo)
              → planejamento-estrategico → consultor-critico
```

### Decisão de investimento (M&A, capex)
```
financas + analista-dados (paralelo) → contabil + direito (due diligence paralela)
                                    → consultor-critico
```

### Plano estratégico anual
```
analista-mercado + analista-dados (paralelo) → planejamento-estrategico
                                            → financas (orçamento)
                                            → consultor-critico
```

### Lançamento / pivot de produto
```
analista-mercado → analista-dados (validação) → planejamento-estrategico
              → financas → consultor-critico
```

## Regras de uso

1. **Sempre encerre com `consultor-critico`** antes de qualquer decisão relevante. É o filtro final.
2. **Paralelize** chamadas independentes (ex.: contábil e jurídico podem rodar simultâneos).
3. Cada agente **cita fontes** (CPC, artigo, fonte de dado). Não aceite afirmação sem citação.
4. **Premissas explícitas**: qualquer agente que assumir algo deve marcar com "⚠️ Suposição:".
5. Os agentes **não tomam decisão** — entregam análise. A decisão é do humano.

## Como invocar

No Claude Code, basta pedir explicitamente:
- *"Use o agente `financas` para calcular o VPL deste projeto"*
- *"Peça uma análise de mercado e depois faça o pressure-test com o `consultor-critico`"*

Ou deixe o Claude principal orquestrar:
- *"Quero abrir uma holding patrimonial — acione o squad"*
