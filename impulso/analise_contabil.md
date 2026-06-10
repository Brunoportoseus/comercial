# Análise Contábil — Plano de Negócios Impulso (Agência de E-commerce)

**Parecer técnico emitido com base em LC 123/06, LC 155/16, Resolução CGSN 140/2018, Lei 9.249/95, Lei 8.212/91, RIR/2018 (Decreto 9.580/18) e Pronunciamentos do CPC.**

---

## 1. Anexo do Simples Nacional Aplicável

### Enquadramento legal

A atividade de "desenvolvimento de e-commerce / criação de lojas virtuais" classifica-se nos CNAEs **6201-5/01 (desenvolvimento de programas de computador sob encomenda)** ou **6209-1/00 (suporte técnico em TI)**. Por força do **art. 18, §5º-I, inciso XVI da LC 123/06** (incluído pela LC 155/16), tais atividades são tributadas pelo **Anexo III OU Anexo V**, dependendo do **Fator R**.

### Fator R — art. 18, §5º-M, LC 123/06

> **Fator R = Folha de Salários (12 meses) ÷ Receita Bruta (12 meses)**
>
> - **Fator R ≥ 28%** → tributação pelo **Anexo III** (alíquota inicial 6%)
> - **Fator R < 28%** → tributação pelo **Anexo V** (alíquota inicial 15,5%) — **MUITO mais caro**

**Folha de salários inclui pró-labore** (art. 26 da Resolução CGSN 140/2018), bem como INSS patronal e FGTS.

### Cálculo do Fator R para Impulso

| Faturamento mensal | Folha (pró-labore R$ 8k × 12) | Receita 12m | Fator R | Anexo |
|---|---|---|---|---|
| R$ 20.000 | R$ 96.000 | R$ 240.000 | **40,0%** | III |
| R$ 30.000 | R$ 96.000 | R$ 360.000 | **26,7%** | **V (risco)** |
| R$ 35.000 | R$ 96.000 | R$ 420.000 | **22,9%** | V |
| R$ 50.000 | R$ 96.000 | R$ 600.000 | **16,0%** | V |

**Alerta crítico:** acima de ~R$ 28.500/mês, a Impulso cai no Anexo V. Para permanecer no Anexo III, **aumentar pró-labore ou contratar CLT** torna-se obrigatório.

### Alíquotas efetivas — Anexo III (LC 123/06, Anexo III)

| Faixa RBT12 | Alíquota nominal | Dedução | Alíquota efetiva (topo) |
|---|---|---|---|
| Até R$ 180.000 | 6,00% | — | 6,00% |
| R$ 180.000,01 a R$ 360.000 | 11,20% | R$ 9.360 | 8,40% |
| R$ 360.000,01 a R$ 720.000 | 13,50% | R$ 17.640 | 11,05% |
| R$ 720.000,01 a R$ 1.800.000 | 16,00% | R$ 35.640 | 14,02% |

### Premissa "12% fixo"

- Válida para faturamento entre **R$ 400k e R$ 720k/ano** (R$ 33k a R$ 60k/mês).
- **Abaixo de R$ 30k/mês**: alíquota efetiva fica entre 6% e 8,4% (premissa de 12% é **conservadora demais**).
- **Acima de R$ 720k/ano**: efetivo ultrapassa 12% (chega a 14% no topo da 4ª faixa).

---

## 2. Pró-Labore R$ 8.000 (R$ 4.000/sócio)

### Tratamento contábil

Pró-labore é **despesa de pessoal** (CPC 33 — Benefícios a Empregados, por analogia, e CPC 00 (R2)). Registra-se em **conta de resultado** (Despesas Administrativas → Pró-labore), **NÃO** se confunde com distribuição de lucros (esta debita Lucros Acumulados no PL).

### INSS (art. 21 Lei 8.212/91)

- **11% sobre o pró-labore**, retido pela PJ e recolhido em GPS código 1007, **limitado ao teto do RGPS** (em 2026 ≈ R$ 8.157,41).
- Por sócio: **R$ 4.000 × 11% = R$ 440/mês** (R$ 880/mês total).
- **Patronal 20% é DISPENSADO** — o Simples já recolhe via DAS (art. 13, VI, LC 123/06).

### IRPF mensal (tabela 2026, RIR/2018 art. 677)

Considerando faixa: pró-labore R$ 4.000 − INSS R$ 440 = base **R$ 3.560**.

| Base | Alíquota | Dedução |
|---|---|---|
| Até R$ 2.428,80 | isento | — |
| 2.428,81 a 2.826,65 | 7,5% | R$ 182,16 |
| 2.826,66 a 3.751,05 | 15% | R$ 394,16 |
| 3.751,06 a 4.664,68 | 22,5% | R$ 675,49 |

Base R$ 3.560,00 → faixa 15%: **IR = (3.560 × 15%) − 394,16 = R$ 139,84/sócio** (≈ R$ 280/mês total, DARF 0561).

### Estratégia ótima de mix

**Distribuição de lucros é isenta de IR (art. 10, Lei 9.249/95)**. Portanto:

- Pró-labore = **mínimo necessário** para sustentar o Fator R ≥ 28% (Anexo III).
- Excedente do lucro → **distribuição isenta**, sem INSS, sem IR.
- R$ 4k/sócio é equilíbrio razoável: cobre Fator R até ~R$ 28k/mês de faturamento e mantém INSS contributivo para aposentadoria do sócio.

---

## 3. Estrutura Completa de Custos — Agência Home Office

### Custos fixos mensais

| Item | Valor estimado |
|---|---|
| Pró-labore (2 sócios) | R$ 8.000 |
| INSS sócios (11%) | R$ 880 |
| Honorário contábil | R$ 600–900 |
| Internet + telefone | R$ 250 |
| Ferramentas SaaS (Figma, ChatGPT, Notion, ClickUp, Loom) | R$ 400–700 |
| E-mail corporativo (Google Workspace × 2) | R$ 120 |
| Hospedagem/domínio site institucional | R$ 50 |
| Certificado Digital A1 (R$ 220/ano ÷ 12) | R$ 20 |
| Antivírus, backup nuvem | R$ 80 |
| Energia/água (alocação home office) | R$ 200 |
| Seguro RC profissional (recomendado) | R$ 150 |

### Custos variáveis

- DAS Simples (% da receita)
- Taxas de gateway/recebimento (Pix, cartão): 0,99%–4,99%
- Comissão de vendas/parcerias indicadores: 10–20%
- Tráfego pago repassado (Meta/Google Ads quando inclusos)
- Plugins/apps Shopify por projeto
- Stock de imagens, fontes, templates específicos por projeto

### Custos comumente esquecidos (CHECKLIST)

1. **Provisão de 13º pró-labore** — embora não obrigatório por lei, prática contábil recomenda (CPC 25 — Provisões).
2. **Provisão de férias proporcionais** dos sócios (1/12 ao mês).
3. **Contingência fiscal/trabalhista** — 1–2% da receita (CPC 25).
4. **ISS antecipado** em municípios com substituição tributária.
5. **Taxa de Fiscalização de Estabelecimento (TFE)** anual da prefeitura.
6. **Alvará de funcionamento** (mesmo home office, alguns municípios exigem).
7. **Renovação Junta Comercial** quando alterar contrato social.
8. **Sindicato patronal/contribuição assistencial** (verificar convenção).
9. **DIRF, DEFIS, ECF, DCTFWeb** — custos com obrigações acessórias.
10. **Devoluções/cancelamentos** (1–3% — projetos 48h com garantia).
11. **Sublimite estadual ICMS** (não aplica a serviço puro, mas atenção se vender app/produto).
12. **Multa por atraso DAS** (provisão de risco).

---

## 4. DRE Modelo para Serviços (CPC 26 — Apresentação das Demonstrações)

```
RECEITA OPERACIONAL BRUTA
  (+) Projeto 48 Horas
  (+) Projetos Personalizados
  (+) Planos Mensais de Suporte (recorrente — MRR)
  (+) Comissão Parceria Plataformas (20%)
  (+) Gestão de Tráfego Pago (fee)
= RECEITA BRUTA TOTAL

(–) DEDUÇÕES DA RECEITA
  (–) ISS (componente do DAS)
  (–) Cancelamentos/Devoluções
  (–) Descontos comerciais incondicionais

= RECEITA OPERACIONAL LÍQUIDA

(–) CUSTOS DOS SERVIÇOS PRESTADOS (CSP)
  (–) Mão de obra direta (horas técnicas executoras)
  (–) Licenças/plugins/apps por projeto
  (–) Subcontratados (freelas pontuais)
  (–) Taxas de gateway recebimento

= LUCRO BRUTO  →  margem bruta

(–) DESPESAS OPERACIONAIS
  (–) Comerciais (tráfego pago próprio, CRM, comissões)
  (–) Administrativas (contador, SaaS, internet, energia)
  (–) Pró-labore + INSS sócios
  (–) Provisões (13º, férias, contingências — CPC 25)

= EBITDA  →  margem EBITDA

(–) Depreciação/amortização (equipamentos — CPC 27)

= EBIT (Resultado Operacional)

(–) Resultado Financeiro (juros, IOF)

= LAIR
(–) IRPJ + CSLL (já contidos no DAS Simples)
= LUCRO LÍQUIDO DO EXERCÍCIO  →  margem líquida
```

---

## 5. Ponto de Equilíbrio Contábil

**Fórmula:** PE = Custos Fixos ÷ Margem de Contribuição %

**Premissas:**
- Custos fixos totais = R$ 12.500 (pró-labore R$ 8.000 + INSS R$ 880 + admin R$ 3.620)
- Margem de contribuição média = **72%** (serviço com baixo custo variável)

**Cálculo:**
PE = 12.500 / 0,72 = R$ 17.361/mês

Considerando DAS (Anexo III, 1ª faixa) de 6% sobre receita = R$ 1.042 → MC líquida cai para ~66%:

PE ajustado = 12.500 / 0,66 = R$ 18.939/mês

**Faturamento mínimo realista: ~R$ 19.000/mês** para empate. Margem de segurança recomendada: operar a partir de **R$ 25.000/mês**.

---

## 6. Riscos Contábeis/Fiscais Específicos

### a) Receita de parceria Shopify (exterior)

A comissão recebida da Shopify (Irlanda/EUA) é **exportação de serviço**:
- **ISS: isento** se o resultado se verificar no exterior (LC 116/03, art. 2º, I). **Atenção:** alguns municípios contestam — verificar legislação municipal.
- **PIS/COFINS-Importação: NÃO aplica** (a Impulso é prestadora, não tomadora).
- **IRRF/CIDE:** não incidem sobre receita auferida do exterior pela PJ brasileira.
- **Tributação no DAS:** entra como receita de exportação — Anexo III com **isenção de PIS/COFINS/ISS** (art. 18, §14, LC 123/06). Apenas IRPJ/CSLL/CPP no DAS.
- **Câmbio:** registrar contrato de câmbio; variação cambial = receita/despesa financeira (CPC 02).

### b) Distribuição de lucros isenta

- **Art. 10, Lei 9.249/95** — isenta de IR na pessoa física.
- **Resolução CGSN 140/18, art. 145** — limite isento = aplicação dos percentuais de presunção do Lucro Presumido (32% para serviços) sobre receita bruta, **menos os tributos do Simples**.
- Distribuição acima desse limite **só é isenta com escrituração contábil regular** (Livro Diário registrado) demonstrando lucro maior. **RECOMENDAÇÃO FORTE: manter contabilidade completa.**

### c) Desenquadramento do Simples

- **Art. 17, LC 123/06** — atividades vedadas. **Desenvolvimento de software/sites NÃO é vedado** (confirmado pelo art. 18, §5º-D e §5º-I).
- **Vedações relevantes:** sócio domiciliado no exterior; sócio com participação >10% em outra empresa cuja soma da receita ultrapasse R$ 4,8 mi; débitos com INSS/Fazenda.

### d) Substituição tributária do ISS

Alguns municípios (SP, RJ, BH) impõem **retenção na fonte** quando tomador é PJ local de grande porte. Empresa Simples sofre retenção pela alíquota efetiva do Anexo III (art. 21, §4º, LC 123/06) — informar o tomador o percentual correto via PGDAS.

### e) NFS-e

**Obrigatória nacionalmente** desde 2023 via padrão nacional NFS-e (Convênio CGSN). Necessário certificado digital e credenciamento na prefeitura.

### f) Sócio com participação em outra empresa

Verificar: se algum sócio tem outra PJ cujo somatório de receita > R$ 4,8 mi/ano, há desenquadramento (art. 3º, §4º, IV, LC 123/06).

---

## 7. Contador Especializado

**SIM, obrigatório.** Justificativas:

- Gestão mensal do **Fator R** (única alavanca contra salto de 6% → 15,5%).
- Cálculo da receita de exportação (Shopify) com isenções específicas.
- Apuração do **limite de distribuição isenta** com escrituração completa.
- Obrigações acessórias: PGDAS-D (mensal), DEFIS (anual), DCTFWeb, eSocial doméstico de sócios.

**Honorários de mercado 2026 (ME serviços, Simples):**

| Perfil | Faixa |
|---|---|
| Contador online (Contabilizei, Agilize) | R$ 200–350 |
| Contador local generalista | R$ 400–700 |
| **Contador especializado em TI/agência** (recomendado) | **R$ 700–1.200** |

**Recomendação: R$ 800/mês** com escritório que tenha clientes do mesmo nicho.

---

## 8. Cinco Ações Contábeis-Fiscais OBRIGATÓRIAS antes do primeiro faturamento

1. **Constituir a PJ corretamente** — Contrato Social na Junta Comercial com CNAEs 6201-5/01 (principal), 6202-3/00, 6209-1/00, 7319-0/03 (tráfego pago/publicidade), 6311-9/00 (hospedagem). Capital social compatível.

2. **Optar pelo Simples Nacional** no Portal do Simples em até **30 dias** após CNPJ (ou até 31/janeiro para empresas existentes) — Resolução CGSN 140/18, art. 6º.

3. **Emitir Certificado Digital A1 (e-CNPJ)** e credenciar-se para **NFS-e nacional** + prefeitura local.

4. **Estruturar plano de contas e contratar contador** com escrituração contábil completa (Livro Diário + Razão) — habilita distribuição de lucros acima do limite presumido e atende CPC PME.

5. **Cadastrar pró-labore no eSocial**, gerar GPS/DARF de INSS e IRRF mensais, e formalizar **acordo de sócios** (vesting, retiradas, política de distribuição de lucros) — protege contra autuação por distribuição disfarçada (art. 60, Decreto-Lei 1.598/77; RIR/2018 art. 528).

---

**Conclusão:** O modelo é viável, tributariamente eficiente no Anexo III (6–8,4% efetivo até R$ 30k/mês) e o pró-labore de R$ 8k é **calibrado adequadamente** para sustentar o Fator R nesse patamar. **Atenção crítica** ao monitoramento mensal do Fator R conforme o faturamento cresce — esse é o principal risco fiscal recorrente da operação.
