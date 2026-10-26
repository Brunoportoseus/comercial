# Controle de Leads de Consórcio (Google Sheets)

Planilha compartilhada para Bruno Porto (capta e acompanha) e Pedro Ciceroni (atende).
A planilha é montada por um Apps Script, que cria abas, listas suspensas, fórmulas, alertas e painel.

## Instalação (5 minutos)

1. Abra a planilha **Controle de Leads – Consórcio** no Google Drive (ou qualquer planilha nova).
2. Menu **Extensões > Apps Script**.
3. Apague o conteúdo de `Código.gs`, cole o conteúdo de `Code.gs` deste repositório.
4. Clique em **+ > Script**, nomeie `Formulas` e cole o conteúdo de `Formulas.gs`. Salve (Ctrl+S).
5. Volte à planilha e recarregue a página. Aparece o menu **Controle de Leads**.
6. **Controle de Leads > 1. Montar / atualizar planilha** (autorize na primeira vez).
7. **Controle de Leads > 2. Ativar automações**.
8. Compartilhe a planilha com o Pedro como **Editor**. O script roda com a autorização de quem instalou as automações.

Rodar o passo 1 de novo é seguro: reaplica formatação, listas e fórmulas sem apagar dados, configurações ou filtros do painel.

## Abas

| Aba | Função |
|---|---|
| Como usar | Regras e definições em uma página |
| Leads | Uma linha por lead. Azul = Bruno, verde = Pedro, cinza = automático |
| Histórico de contatos | Uma linha por interação. Nunca se apaga |
| Painel do Bruno | Indicadores com filtro de período e produto |
| Configurações | Prazos, horário, dias úteis, feriados |
| Listas | Opções das listas suspensas e classificação dos resultados |

## O que é automático

- **Sem Apps Script (fórmulas):** 1ª tentativa, 1º contato efetivo, última interação, resultado do último contato, prazos, tempos em horas úteis, alertas, pendências e painel.
- **Com Apps Script (valores fixos, nunca fórmulas voláteis):**
  - ID permanente do lead (`L-0001`) e da interação (`I-00001`).
  - Data/hora de encaminhamento e da interação, quando deixadas em branco.
  - Responsável padrão e etapa "Novo lead" em novos leads.
  - "Etapa desde" (base de "Dias na etapa atual").
  - Etapa, próxima ação e data da próxima ação da aba Leads quando a interação mais recente do Histórico informa esses campos.

## Regras adotadas (confirmar)

- Tentativa sem resposta e contato efetivo se distinguem pelo campo **Resultado** (aba Listas, colunas G e H, editável).
- Feriados **não** estão incluídos até serem cadastrados em Configurações (coluna E).
- "Sem resposta após tentativas" e "Atendimento pausado" são leads abertos. Só "Venda concluída" e "Perdido" são "Encerrado".
- Atendimento pausado: justificativa = Resumo; data de revisão = Data da próxima ação. Cada falta é apontada separadamente.
- Prioridade dos alertas: Primeiro contato atrasado > Proposta sem acompanhamento > Retorno atrasado > Sem próxima ação > Sem atualização.
- Retorno futuro válido = próxima ação preenchida + data futura. Ele suprime "Sem atualização", "Sem próxima ação" e "Proposta sem acompanhamento".
- "Retorno atrasado" só dispara se não houve interação depois da data agendada.
- Prazos em dias úteis contam os dias úteis depois da data de referência (sexta → terça = 2).
- Proposta enviada: conta se houver data de envio ou a etapa for "Proposta enviada".

## Limites

- 1000 leads e 5000 interações pré-formatados. Para mais, altere `LN`/`HN` em `Formulas.gs` e rode o passo 1.
- Se duas interações do mesmo lead tiverem exatamente o mesmo minuto, "Resultado do último contato" mostra a primeira.
- Os registros comprovam execução e prazos, não a qualidade da conversa.
