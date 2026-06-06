# Squad de Finanças — Empresas de Serviços

5 agentes especialistas para apoiar a gestão financeira do Studio (e empresas de serviços em geral). Cada um tem foco bem definido e pode ser invocado pelo Claude Code via `subagent_type` ou diretamente em um prompt.

## Como invocar

No Claude Code, basta pedir em linguagem natural e mencionar o tipo de análise. Exemplo:

> "Use o cfo-servicos para me dar um diagnóstico executivo do trimestre."

Ou direto via Agent tool:

```
Agent(subagent_type="cfo-servicos", prompt="Analise Jan-Jun/2026 e me dê DRE + 3 recomendações.")
```

## Squad

| Agente | Quando usar |
|---|---|
| `cfo-servicos` | Visão executiva — DRE, margem, runway, KPIs, diagnóstico geral. |
| `fluxo-caixa-servicos` | Conciliação bancária, projeção 30/60/90d, alertas de gap de caixa. |
| `tributos-servicos` | Estimativa de carga tributária, Fator R, Anexo correto, prazos. |
| `custos-precos-servicos` | Custo por serviço, ponto de equilíbrio, revisão de tabela de preços. |
| `auditor-comprovantes` | Cruzamento de comprovantes, gaps documentais, risco de glosa. |

## Workflow sugerido (mensal)

1. **Dia 1 do mês**: `fluxo-caixa-servicos` — fechar o mês anterior, projetar o atual.
2. **Dia 5**: `auditor-comprovantes` — cobrar comprovantes pendentes.
3. **Dia 10**: `tributos-servicos` — checar Fator R e alíquota antes do DAS (dia 20).
4. **Dia 25**: `cfo-servicos` — relatório executivo do mês.
5. **Trimestral**: `custos-precos-servicos` — revisar tabela de preços.

## Inputs comuns

- Planilha consolidada: `Controle_Financeiro_2026.xlsx` (aba `Lançamentos` é a fonte de verdade).
- Extratos brutos: pasta com CSVs Nubank e XLSX Mercado Pago.
- Comprovantes: chats do WhatsApp exportados (pasta `wa_chats/`).

## Princípios compartilhados pelos agentes

- **Não inventam** valores. Se faltar dado, declaram.
- **Separam Esfera Pessoal x Studio** sempre que a coluna existir.
- **Excluem transferências internas** dos totais (Bruno↔Bruno, Bruno→Denise).
- **Formato BR**: `R$ 0.000,00` e `dd/mm/aaaa`.
- **Citam aba!linha** quando referenciam um dado da planilha.
- **Encaminham ao contador** quando o tema é jurídico/contábil vinculante.
