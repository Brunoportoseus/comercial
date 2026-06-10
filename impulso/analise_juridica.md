# Análise Jurídica — Impulso (Agência de Implementação de E-commerce)

## 1. Risco da promessa "48 horas"

### Publicidade enganosa (CDC arts. 30, 35, 37 §1º)
- Promessa "48h" é oferta vinculante. Atraso recorrente → direito de cumprimento forçado, restituição + perdas e danos. Risco PROCON, ACP, ação individual.

### B2B (CC) ou B2C (CDC)?
Teoria Finalista Mitigada (STJ):
- **Cliente PJ que adquire e-commerce como INSUMO** → empresário, regido pelo CC (arts. 593-609).
- **MEI vulnerável tecnicamente** → pode invocar CDC.
- **PF (hobby)** → consumidor pleno.

**Recomendação:** contrato **dual-track** (B2B/CC e B2C/CDC, mais protetivo).

### Blindagem do prazo
- **Cláusula "Marco Zero"**: prazo só inicia após (i) pagamento entrada, (ii) briefing assinado eletronicamente, (iii) assets obrigatórios recebidos, (iv) aceite da Política do Projeto 48 Horas.
- **Cláusula de suspensão**: prazo suspende automaticamente em pendência do cliente.
- **Cláusula penal moratória** (art. 411 CC, limite art. 412): 2% + 0,33%/dia, cap 10% do projeto.

### Política Pública obrigatória
Documento autônomo no site, aceite eletrônico, com: incluso, não incluso, requisitos do cliente, hipóteses de suspensão, regra de contagem (dias úteis ou corridos), horário de início. **Sem essa Política → art. 37 §3º CDC (publicidade enganosa por omissão).**

## 2. Tipo societário

- **LTDA** recomendada (arts. 1.052-1.087 CC). SLU descartada (2 sócios).

### Cláusulas obrigatórias do Contrato Social
1. Quotas e capital (evitar 50/50 puro sem desempate)
2. Administração (atos isolados x conjuntos, alçadas)
3. Pró-labore (art. 1.071 IV)
4. Distribuição de lucros (art. 1.007, pode ser desproporcional)
5. Vesting/cliff via acordo de sócios apartado (cliff 12m, vesting 36-48m)
6. Não-competição (máx 5 anos por analogia art. 1.147)
7. Buy/Sell e resolução de impasse (shotgun, texas shoot-out, mediação+arbitragem)
8. Tag/drag along, direito de preferência
9. Apuração de haveres (art. 1.031)
10. Exclusão de sócio remisso (arts. 1.004, 1.030)
11. Foro/arbitragem

### CNAEs adequados
- **6201-5/01** Desenvolvimento programas sob encomenda (principal)
- 6311-9/00 Tratamento dados, portais
- 6202-3/00 Consultoria TI
- 6319-4/00 Outros serviços TI
- 7020-4/00 Consultoria em gestão
- 7311-4/00 Agências publicidade (cuidado: CONAR/sindicato)
- 7319-0/04 Marketing direto (mais adequado para tráfego pago)

## 3. Contrato de Prestação de Serviços — Cláusulas Obrigatórias

1. **Objeto FECHADO/taxativo** (art. 114 CC interpretação restritiva)
2. Condições de validade do prazo (replica gatilhos Política)
3. **Aceite e homologação (DoD)**: prazo 5 dias úteis para manifestação; silêncio = aceite tácito (art. 111 CC)
4. **Política de revisões**: 2 rodadas estéticas; excedente R$/h; prazo 3 dias úteis
5. **Change Request** (escopo adicional via aditivo escrito)
6. **Pagamento, mora, cláusula penal**: juros 1% a.m. (art. 406 CC c/c art. 161 §1º CTN); multa 2%; correção IPCA
7. **Cancelamento/rescisão**: taxa mobilização não reembolsável (20-30%); retenção proporcional ao executado (art. 603 CC)
8. **Limitação de responsabilidade**: cap = valor pago; exclusão de lucros cessantes/indiretos. Em B2C: art. 51 I CDC veda exoneração total — usar cláusula redutora.
9. **Garantia**: B2C → art. 26 II CDC = 90 dias (não 30!); B2B → art. 445 CC (30 ou 90 dias)
10. **Foro de eleição**: sede Impulso; em B2C, art. 101 I CDC prevalece
11. **Confidencialidade mútua** (vigência + 5 anos)
12. **Propriedade intelectual** (Lei 9.610/98 e 9.609/98):
    - Design final + textos: cessão ao cliente após pagamento integral
    - **Templates, snippets, boilerplate, metodologia: propriedade da Impulso** (licença não exclusiva)
    - Portfólio/cases: autorização expressa
13. **LGPD** (Lei 13.709/18):
    - Definir papel por contrato (art. 5º VI/VII): operadora (regra) ou co-controladora (tráfego pago/segmentação própria)
    - **DPA** obrigatório (art. 39)
    - Medidas de segurança (arts. 46-49)
    - Sub-operadores back-to-back
    - Base legal (art. 7º)
    - Comunicação de incidentes (art. 48)
14. **Isenção sobre plataformas de terceiros** (Shopify/Tray/Nuvemshop/Woo): risco do cliente
15. **Isenção sobre integrações de terceiros** (gateways, frete, ERP): responsabilidade dos provedores

## 4. Termo de Aceite / Briefing — campos mínimos
1. Identificação (CNPJ/CPF, responsável legal, e-mail)
2. Plataforma + plano contratado
3. Escopo detalhado
4. Assets recebidos (lista + data/hora)
5. Conteúdo recebido
6. Credenciais (canal seguro)
7. **Marco Zero** (data/hora)
8. Cronograma + janela homologação
9. Definition of Done objetivo
10. Aceite eletrônico com IP, timestamp, hash (Lei 14.063/20 + MP 2.200-2/01)

## 5. Suporte e Manutenção
- **SLA resposta ≠ SLA resolução** (P1 8h / P2 24h / P3 5 du)
- Escopo "preto e branco"; banco de horas para excedente
- Vigência mínima 12m: válida B2B; B2C atenção art. 51 IV e art. 39 V CDC. Multa rescisória proporcional (Súmula 543 STJ por analogia)
- Reajuste IPCA (recomendado pelo BCB) com IGP-M substituto; periodicidade ≥ 12m (Lei 10.192/01 art. 2º §1º)

## 6. Parceria com Plataformas

### Natureza jurídica dos 20%
Mais próximo de representação comercial diluída (Lei 4.886/65) ou contrato atípico (art. 425 CC). Classificação tributária: **comissão por indicação/intermediação** (serviço tributável).

### Tributação
- ISS — item 10.02 ou 17.12 LC 116/03 (agenciamento/intermediação)
- No Simples: Anexo III/V conforme Fator R; NFS-e mensal
- **Plataforma estrangeira** (Shopify Inc.) = exportação de serviço:
  - ISS: não incide se resultado verificado no exterior (art. 2º I LC 116/03)
  - PIS/COFINS: alíquota zero exportação; já no DAS
  - IRRF/CIDE/PIS-COFINS-Importação **NÃO se aplicam à Impulso recebedora** (esses incidem na remessa ao exterior, não no ingresso)
  - **Câmbio**: contrato de câmbio + instituição autorizada (Lei 14.286/21)

### Cláusulas a vetar no Partner Agreement
- Exclusividade
- Non-solicit excessivo
- Churn responsibility prolongado
- Clawback ampla
- Foro estrangeiro sem arbitragem (Lei 9.307/96)

## 7. Mídia Paga / Tráfego Pago

### Fluxo financeiro
**NUNCA receber verba de mídia em conta da Impulso.** Cliente paga DIRETO Meta/Google/TikTok. Justificativas:
- Estoura sublimite Simples (LC 123/06 art. 3º §14)
- Risco glosa + reclassificação
- Risco COAF (Lei 9.613/98)
- Exposição cambial

A Impulso cobra **fee de gestão** (% ou fixo) — só isso é receita própria com NFS-e.

### Não garantia de resultado
Cláusula expressa: "A Impulso não garante volume, ROAS, CPA, faturamento ou ROI." Atenção art. 39 IV e art. 37 §1º CDC — não prometer resultado na publicidade da própria Impulso.

## 8. Cinco Riscos Top-of-Mind

1. **Publicidade enganosa "48h"** sem Política + gatilhos contratuais
2. **Receber verba de mídia em conta própria** (risco fiscal/COAF)
3. **Ausência de DPA + papel LGPD indefinido** (multa até 2% faturamento, cap R$ 50mi — art. 52 II)
4. **Contrato social 50/50 sem buy/sell** — paralisia → dissolução judicial (art. 1.034 CC)
5. **IP não segregado** entre boilerplate Impulso e entregável cliente

## 9. Sete Ações Jurídicas Obrigatórias Antes da 1ª Venda

1. Registrar LTDA na Junta + CNAEs corretos + Simples; inscrições municipal/estadual
2. Assinar Acordo de Sócios (vesting, cliff, não-competição, buy/sell, arbitragem)
3. Publicar Termos de Uso + Política de Privacidade (LGPD + Marco Civil Lei 12.965/14)
4. Publicar Política do Projeto 48 Horas com aceite eletrônico
5. Aprovar contrato-padrão B2B e B2C (dual-track), Termo de Aceite/Briefing, DPA
6. **Registrar marca "Impulso" no INPI** (Lei 9.279/96), classes 35 (publicidade), 42 (TI), 41 (treinamento)
7. Contratar seguro RC profissional (E&O) + canal LGPD (DPO + e-mail + fluxo de incidentes)

### Complementares
- Assinatura eletrônica qualificada/avançada (ICP-Brasil ou Lei 14.063/20)
- Conta PJ segregada
- Contabilidade especializada em tech
- Revisão semestral de contratos

---

**Disclaimer**: análise consultiva, não substitui parecer formal de advogado constituído. Jurisprudência e legislação podem mudar — revisar semestralmente. Não constitui parecer formal nos termos do art. 2º §1º EAOAB.
