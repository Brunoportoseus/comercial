# Meta Ads e o site Terrenos Curitiba e Região

Documento de apoio ao **Briefing Meta Ads de 15/10/2026**. Reúne o que o site já faz, o que mudou neste ciclo e o que depende de
configuração fora do código. Nada aqui afirma que campanhas foram publicadas ou que valores estão vigentes: antes de anunciar,
confirmar tabela, entrada, prazo e disponibilidade com a EVEX.

## 1. O que mudou no site (seção 6 do briefing)

**Perguntas de qualificação nos formulários.** Todos os formulários de lead (modal e formulários das páginas) mostram, antes do
consentimento, o bloco opcional "Ajude o corretor a trazer a melhor opção", com as opções do briefing:

| Campo (`name`) | Pergunta | Opções |
|---|---|---|
| `faixa_entrada` | Quanto você dispõe para a entrada? | Até R$ 6 mil · R$ 6–10 mil · R$ 10–20 mil · Acima de R$ 20 mil |
| `faixa_parcela` | Qual parcela mensal você procura? | Até R$ 1 mil · R$ 1–1,5 mil · R$ 1,5–2 mil · Acima de R$ 2 mil |
| `prazo` | Prazo para comprar | Até 3 meses · 3–6 meses · Somente pesquisando |
| `objetivo` | Finalidade | Construir para morar · Investimento · Ainda indefinida |

Só nome, WhatsApp, interesse e consentimento continuam obrigatórios (menos atrito). Os campos `prazo` e `objetivo` já existiam
em "mais detalhes" com outras opções; foram movidos para o bloco, sem duplicar. Se o visitante veio do assistente de parcela da
home, a resposta escolhida no formulário vale mais que o rótulo do assistente.

**IDs do Meta no lead.** O site guarda `fbclid` (e monta `fbc`) ao chegar de um anúncio e lê o cookie `_fbp` quando o Pixel está
ativo. Os três só vão junto do lead **se o visitante aceitou os cookies** (mesma regra dos IDs do GA4). O servidor valida o formato
antes de gravar.

**Servidor (`/api/lead`).** Novas colunas em D1: `faixa_entrada`, `fbclid`, `fbc`, `fbp`. Bancos existentes migram sozinhos na
primeira gravação (`ALTER TABLE`). O e-mail e o aviso de WhatsApp ao corretor passam a mostrar entrada, parcela e prazo, e se o
lead veio do Meta Ads. O webhook (`LEAD_WEBHOOK`) recebe os mesmos campos novos.

**Eventos.** `form_submit` leva `faixa_entrada`, `faixa_parcela`, `prazo_compra` e `finalidade` (sem dados pessoais). Com o Pixel
ativo, o evento já vira `Lead` (ver `assets/js/site.js`).

## 2. Pendências fora do código

1. **ID do Pixel da Meta:** `analytics.metaPixel` em `assets/js/config.js` está vazio. Sem ele o Pixel não carrega.
2. **Kommo:** definir a URL do webhook em `LEAD_WEBHOOK` (variável do Cloudflare Pages) e criar os campos da seção 4.
3. **Conversions API (CAPI):** exige token do Meta e uma função nova no servidor; não foi implementada. `fbc` e `fbp` já ficam
   guardados para quando for.
4. **Valores das ofertas:** ver a seção 7.

## 3. Nomenclatura e UTMs

Parâmetros de URL do anúncio (macros dinâmicas do Meta):

```
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

| Nível | Padrão | Exemplo |
|---|---|---|
| Campanha | `tcr_leads_{destino}_{AAAAMM}` | `tcr_leads_whatsapp_202610` |
| Conjunto | `{geo}_amplo_{posicionamento}` | `curitiba-atamandare_amplo_adv` |
| Anúncio | `{empreendimento}_{teste}_{formato}` | `ecoville2_t01-preco_4x5` |

Use só minúsculas, sem acento, com hífen ou sublinhado. O site já grava `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content` e `utm_term` em cada lead.

## 4. Mapeamento para o Kommo

Campos do payload do webhook (`/api/lead`) e destino sugerido no Kommo:

| Campo do payload | Campo / tag no Kommo |
|---|---|
| `nome`, `telefone`, `email` | Contato |
| `empreendimento_interesse` | Campo do lead "Empreendimento" |
| `faixa_entrada` | Campo "Faixa de entrada" |
| `faixa_parcela` | Campo "Faixa de parcela" |
| `prazo` | Campo "Prazo para compra" |
| `objetivo` | Campo "Finalidade" |
| `utm_source`, `utm_medium` | Campos "Origem" e "Mídia" |
| `utm_campaign` | Campo "Campanha" |
| `utm_content` | Campo "Anúncio" |
| `fbclid` | Campo "Clique Meta" (opcional) |
| `status` (`novo`, `qualificado`…) | Etapa do funil + campo "Status comercial" |

Tags: `meta-ads`, uma tag por empreendimento, `qualificado` ou `desqualificado`. Motivos de desqualificação (campo de lista):
entrada insuficiente, parcela incompatível, localização, falta de timing, contato inválido, desistência, oferta indisponível.
Entrada compatível **não** significa lead aprovado: avaliar parcela, saldo total e regras vigentes.

## 5. Fluxo do WhatsApp (especificação)

1. Mensagem de boas-vindas citando o empreendimento do anúncio.
2. Perguntas na ordem: entrada → parcela → prazo → finalidade (mesmas opções da seção 1, como botões).
3. Gravar as respostas nos campos do Kommo e marcar a tag de qualificação.
4. Encaminhar ao corretor com o resumo; registrar visita agendada e visita realizada.

## 6. Checklist de revisão antes de publicar

- [ ] Preço, entrada, prazo e parcela do anúncio conferidos com a EVEX no dia (nunca apresentar a entrada como preço do terreno).
- [ ] Categoria especial de anúncio (Moradia/Habitação) e limites de segmentação confirmados na conta.
- [ ] Sem gênero, estado civil ou renda presumida na segmentação; geografia só a permitida.
- [ ] Sem promessa de aprovação de crédito, valorização ou "garantido"; imagens sintéticas identificadas como ilustração.
- [ ] Páginas de destino e UTMs testados; Pixel e eventos disparando após aceite de cookies.
- [ ] Consentimento (LGPD) no formulário e no fluxo de WhatsApp.
- [ ] Criativos nos formatos 1080×1350 (Feed), 1080×1920 (Stories/Reels, áreas seguras) e 1080×1080 (carrossel).

## 7. Briefing × site (conferência de 15/10/2026)

O briefing diz que seus números são históricos e exigem validação. Comparação com o que o site publica hoje:

| Empreendimento | Briefing | Site | Situação |
|---|---|---|---|
| Ecoville I | 180 m², entrada R$ 7.200, 312x R$ 1.656,39 | igual | Confere |
| Ecoville II | promoção de 215,24 m², entrada R$ 5.996, 312x R$ 1.379,46 (preço de referência R$ 149.900) | promoção de 180 m² com sinal de 5% (R$ 7.495, parcela R$ 1.497,12); lote padrão R$ 168.300 com entrada de 4% | **Divergente: confirmar com a EVEX** |
| Valparaíso | 140 m², entrada R$ 7.952, 312x R$ 1.829,48 | cartão da home igual ao briefing, mas o simulador da página usa entrada de 10% (R$ 19.880) | **Inconsistência interna: confirmar a entrada** |
| Bela Vista | 140 m², entrada R$ 8.200 | 140–144,06 m², R$ 209.800, entrada R$ 8.392 (estoque de 13/10) | Briefing desatualizado; o site segue o estoque de 13/10 |

Os criativos do teste 01 ("R$ 5.996 de entrada") e do teste 04 ("entradas a partir de R$ 5.996") dependem da confirmação do Ecoville II.

## 8. Relatório semanal (modelo)

| Métrica | Fórmula |
|---|---|
| Leads recebidos | Leads no Kommo com a tag `meta-ads` na semana |
| % qualificada | Qualificados ÷ recebidos |
| **CPLQ** (principal) | Gasto ÷ leads qualificados |
| Custo por visita realizada | Gasto ÷ visitas realizadas |
| Taxa de visita | Visitas realizadas ÷ qualificados |
| CAC | Gasto ÷ vendas |
| CTR de link, CPC de link | Gerenciador de Anúncios |

Quebrar por criativo, empreendimento e destino (WhatsApp × formulário) e listar os motivos de desqualificação. Decidir pausa ou
escala só com amostra suficiente e com a leitura de qualidade comercial, não só CTR ou CPL. O cenário do briefing (CPL R$ 35,
40% de qualificação, CPLQ ≈ R$ 87,50) é hipotético e deve ser trocado pelos dados reais.
