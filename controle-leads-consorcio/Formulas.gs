/**
 * Controle de Leads de Consórcio — fórmulas e constantes de layout.
 * Arquivo apenas de definições (não acessa a planilha). Cole junto com Code.gs.
 */

var NOMES = {
  ajuda: 'Como usar',
  leads: 'Leads',
  hist: 'Histórico de contatos',
  painel: 'Painel do Bruno',
  cfg: 'Configurações',
  listas: 'Listas'
};

// Linhas de dados. Para comportar mais leads/interações, aumente e rode "Montar / atualizar planilha".
var L1 = 3, LN = 1002;     // Leads: linha 1 = blocos, linha 2 = títulos, dados da 3 à 1002
var H1 = 2, HN = 5001;     // Histórico: linha 1 = títulos, dados da 2 à 5001

var ETAPAS = [
  'Novo lead', 'Tentativa de contato', 'Contato estabelecido', 'Necessidades identificadas',
  'Simulação em elaboração', 'Proposta enviada', 'Em negociação', 'Aguardando decisão do cliente',
  'Venda concluída', 'Perdido', 'Sem resposta após tentativas', 'Atendimento pausado'
];
var PRODUTOS = ['Imóvel', 'Automóvel', 'Moto', 'Veículo pesado', 'Serviços', 'Outros', 'A identificar'];
var SITUACOES = [   // ordem = urgência (1 = mais urgente)
  'Primeiro contato atrasado', 'Proposta sem acompanhamento', 'Retorno atrasado', 'Sem próxima ação',
  'Sem atualização', 'Novo, dentro do prazo', 'Em dia', 'Encerrado'
];

function hr_(col) { return "'" + NOMES.hist + "'!$" + col + '$' + H1 + ':$' + col + '$' + HN; }
function lr_(col) { return 'Leads!$' + col + '$' + L1 + ':$' + col + '$' + LN; }

/** Horas úteis decorridas entre s (início da contagem, já dentro do expediente) e e. Resultado em dias (formatar [h]:mm). */
function elapsed_(s, e) {
  var sd = 'INT(' + s + ')', ed = 'INT(' + e + ')', m = 'MAX(' + e + ',' + s + ')';
  return 'IF(INT(' + m + ')=' + sd + ',MAX(0,MIN(' + m + ',' + sd + '+CFG_FIM)-' + s + '),' +
    '(' + sd + '+CFG_FIM-' + s + ')' +
    '+IF(' + ed + '-' + sd + '>1,NETWORKDAYS.INTL(' + sd + '+1,' + ed + '-1,CFG_FDS,CFG_FERIADOS)*(CFG_FIM-CFG_INICIO),0)' +
    '+IF(NETWORKDAYS.INTL(' + ed + ',' + ed + ',CFG_FDS,CFG_FERIADOS)=1,MAX(0,MIN(' + e + ',' + ed + '+CFG_FIM)-(' + ed + '+CFG_INICIO)),0))';
}

/** Fórmulas da linha r da aba Leads, indexadas pela letra da coluna. */
function formulasLeads_(r) {
  function c(col) { return '$' + col + r; }
  var A = c('A'), B = c('B'), C = c('C'), D = c('D'), M = c('M'), N = c('N'), O = c('O'), P = c('P'),
      R = c('R'), S = c('S'), T = c('T'), U = c('U'), Z = c('Z'), AA = c('AA'), AB = c('AB'), AE = c('AE'),
      AF = c('AF'), AH = c('AH'), AI = c('AI'), AL = c('AL'), AM = c('AM'), AN = c('AN'), AO = c('AO'),
      AP = c('AP'), AQ = c('AQ'), AR = c('AR'), AS = c('AS');
  var HID = hr_('B'), HD = hr_('C'), HG = hr_('G'), HM = hr_('M'), HK = hr_('N');
  var digitos = 'REGEXREPLACE(' + D + '&"","[^0-9]","")';
  var f = {};

  f.E = '=IF(' + D + '="","",HYPERLINK("https://wa.me/"&IF(OR(LEN(' + digitos + ')=10,LEN(' + digitos + ')=11),"55"&' + digitos + ',' + digitos + '),"Abrir conversa"))';

  // Vindos do Histórico (nada é digitado aqui)
  f.N = '=IF(' + A + '="","",IF(COUNTIFS(' + HID + ',' + A + ',' + HD + ',">0")=0,"",MINIFS(' + HD + ',' + HID + ',' + A + ',' + HD + ',">0")))';
  f.O = '=IF(' + A + '="","",IF(COUNTIFS(' + HID + ',' + A + ',' + HD + ',">0",' + HM + ',"Contato efetivo")=0,"",MINIFS(' + HD + ',' + HID + ',' + A + ',' + HM + ',"Contato efetivo",' + HD + ',">0")))';
  f.P = '=IF(' + A + '="","",IF(COUNTIFS(' + HID + ',' + A + ',' + HD + ',">0")=0,"",MAXIFS(' + HD + ',' + HID + ',' + A + ',' + HD + ',">0")))';
  f.Q = '=IF(' + P + '="","",IFERROR(INDEX(' + HG + ',MATCH(' + A + '&"|"&' + P + ',' + HK + ',0))&"",""))';

  // Automáticos
  var av = '(INT(' + AL + ')+CFG_FIM-' + AL + ')';
  var resto = '(CFG_PRAZO_H/24-' + av + ')';
  var dias = 'ROUNDUP(ROUND(' + resto + '/(CFG_FIM-CFG_INICIO),6),0)';
  f.AB = '=IF(' + AL + '="","",IF(CFG_PRAZO_H/24<=' + av + '+0.000000001,' + AL + '+CFG_PRAZO_H/24,' +
    'WORKDAY.INTL(INT(' + AL + '),' + dias + ',CFG_FDS,CFG_FERIADOS)+CFG_INICIO+' + resto + '-(' + dias + '-1)*(CFG_FIM-CFG_INICIO)))';
  f.AC = '=IF(OR(' + AL + '="",' + N + '=""),"",' + elapsed_(AL, N) + ')';
  f.AD = '=IF(OR(' + AL + '="",' + O + '=""),"",' + elapsed_(AL, O) + ')';
  f.AE = '=IF(' + P + '="","",IF(INT(' + P + ')>=TODAY(),0,NETWORKDAYS.INTL(INT(' + P + ')+1,TODAY(),CFG_FDS,CFG_FERIADOS)))';
  f.AG = '=IF(' + A + '="","",IF(ISNUMBER(' + AF + '),INT(NOW())-INT(' + AF + '),IF(AND(' + AM + '="Novo lead",ISNUMBER(' + B + ')),INT(NOW())-INT(' + B + '),"")))';
  f.AI = '=IF(' + A + '="","",IF(OR(' + AM + '="Venda concluída",' + AM + '="Perdido"),"Encerrado",IF(' + AR + '<>"",' + AR + ',IF(AND(ISNUMBER(' + B + '),' + N + '=""),"Novo, dentro do prazo","Em dia"))))';
  f.AH = '=IF(' + AI + '="","",IFERROR(TRIM(LEFT(' + AI + ',FIND("|",' + AI + ')-1)),' + AI + '))';
  f.AJ = '=IF(' + A + '="","",IF(' + AS + '="","OK",' + AS + '))';
  f.AK = '=IF(' + AH + '="","",IFERROR(MATCH(' + AH + ',Listas!$L$2:$L$9,0),""))';

  // Auxiliares
  f.AL = '=IF(NOT(ISNUMBER(' + B + ')),"",IF(NETWORKDAYS.INTL(INT(' + B + '),INT(' + B + '),CFG_FDS,CFG_FERIADOS)=1,' +
    'IF(' + B + '-INT(' + B + ')<CFG_INICIO,INT(' + B + ')+CFG_INICIO,IF(' + B + '-INT(' + B + ')<CFG_FIM,' + B + ',WORKDAY.INTL(INT(' + B + '),1,CFG_FDS,CFG_FERIADOS)+CFG_INICIO)),' +
    'WORKDAY.INTL(INT(' + B + '),1,CFG_FDS,CFG_FERIADOS)+CFG_INICIO))';
  f.AM = '=IF(' + A + '="","",IF(' + M + '="","Novo lead",' + M + '))';
  f.AN = '=IF(' + A + '="","",AND(' + S + '<>"",ISNUMBER(' + T + '),' + T + '>=NOW()))';
  f.AO = '=IF(' + A + '="","",AND(ISNUMBER(' + T + '),' + T + '<NOW(),IF(' + P + '="",TRUE,' + P + '<' + T + ')))';
  f.AP = '=IF(' + A + '="","",IF(ISNUMBER(' + U + '),INT(' + U + '),IF(AND(' + AM + '="Proposta enviada",ISNUMBER(' + AF + ')),INT(' + AF + '),"")))';
  f.AQ = '=IF(OR(' + A + '="",' + AP + '=""),"",IF(' + AP + '>=TODAY(),0,NETWORKDAYS.INTL(' + AP + '+1,TODAY(),CFG_FDS,CFG_FERIADOS)))';
  f.AR = '=IF(' + A + '="","",TEXTJOIN(" | ",TRUE,' +
    'IF(AND(ISNUMBER(' + B + '),' + N + '="",ISNUMBER(' + AB + '),NOW()>' + AB + '),"Primeiro contato atrasado",""),' +
    'IF(AND(ISNUMBER(' + AP + '),' + AQ + '>CFG_DIAS_PROPOSTA,IF(' + P + '="",TRUE,INT(' + P + ')<=' + AP + '),NOT(' + AN + ')),"Proposta sem acompanhamento",""),' +
    'IF(' + AO + ',"Retorno atrasado",""),' +
    'IF(AND(' + N + '<>"",NOT(' + AN + '),NOT(' + AO + ')),"Sem próxima ação",""),' +
    'IF(AND(' + P + '<>"",NOT(' + AN + '),' + AE + '>CFG_DIAS_ATENCAO),"Sem atualização","")))';
  var pos = 'MATCH(' + AM + ',Listas!$A$2:$A$13,0)';
  f.AS = '=IF(' + A + '="","",TEXTJOIN(" | ",TRUE,' +
    'IF(OR(' + C + '="",' + D + '=""),"Nome ou WhatsApp ausente",""),' +
    'IF(NOT(ISNUMBER(' + B + ')),"Data de encaminhamento ausente",""),' +
    'IF(' + M + '="","Etapa não preenchida",""),' +
    'IF(AND(' + AM + '="Novo lead",' + N + '<>""),"Contato já registrado, mas a etapa ainda é Novo lead",""),' +
    'IF(AND(' + N + '="",' + AM + '<>"Novo lead",' + AM + '<>"Perdido",' + AM + '<>"Atendimento pausado"),"Etapa avançada sem nenhum contato no Histórico",""),' +
    'IF(AND(' + O + '="",' + N + '<>"",IFERROR(AND(' + pos + '>=3,' + pos + '<=9),FALSE)),"Etapa exige contato efetivo, ainda não registrado",""),' +
    'IF(AND(' + AM + '="Proposta enviada",NOT(ISNUMBER(' + U + '))),"Proposta enviada sem data de envio",""),' +
    'IF(AND(' + AM + '="Perdido",' + AA + '=""),"Lead perdido sem motivo",""),' +
    'IF(AND(' + AM + '="Venda concluída",NOT(ISNUMBER(' + Z + '))),"Venda concluída sem data de fechamento",""),' +
    'IF(AND(' + AM + '="Atendimento pausado",' + R + '=""),"Pausado sem justificativa (preencher o resumo)",""),' +
    'IF(AND(' + AM + '="Atendimento pausado",NOT(ISNUMBER(' + T + '))),"Pausado sem data de revisão","")))';
  return f;
}

/** Fórmulas da linha r do Histórico. */
function formulasHist_(r) {
  return {
    L: '=IF($B' + r + '="","",IFERROR(INDEX(' + lr_('C') + ',MATCH($B' + r + ',' + lr_('A') + ',0)),"ID não encontrado"))',
    M: '=IF($G' + r + '="","",IFERROR(VLOOKUP($G' + r + ',Listas!$G$2:$H$40,2,FALSE),""))',
    N: '=IF(OR($B' + r + '="",$C' + r + '=""),"",$B' + r + '&"|"&$C' + r + ')'
  };
}

/* ---------------- Painel do Bruno ---------------- */

var P_BASE = lr_('B') + ',">="&$B$4,' + lr_('B') + ',"<"&$H$7,' + lr_('H') + ',$H$6';
var P_MASK = '(' + lr_('B') + '>=$B$4)*(' + lr_('B') + '<$H$7)*(((' + lr_('H') + '=$B$6)+($B$6="Todos"))>0)';
function p_noPeriodo_(col) { return lr_(col) + ',">="&$B$4,' + lr_(col) + ',"<"&$H$7,' + lr_('H') + ',$H$6'; }

/** Seção 1 (coorte por data de encaminhamento): r = linha, l = rótulo, f = fórmula, base = célula do denominador. */
var P_SEC1 = [
  { r: 10, l: 'Total de leads encaminhados', f: '=COUNTIFS(' + P_BASE + ')', base: null, n: 'Leads com data de encaminhamento dentro do período e do produto escolhido.' },
  { r: 11, l: 'Leads com tentativa de contato', f: '=COUNTIFS(' + P_BASE + ',' + lr_('N') + ',">0")', base: 'B10', n: 'Qualquer interação registrada no Histórico (tentativa sem resposta ou contato efetivo).' },
  { r: 12, l: 'Leads com contato efetivo', f: '=COUNTIFS(' + P_BASE + ',' + lr_('O') + ',">0")', base: 'B10', n: 'Pelo menos uma interação com resultado classificado como "Contato efetivo" (o cliente respondeu).' },
  { r: 13, l: 'Leads sem tentativa', f: '=B10-B11', base: 'B10', n: 'Nenhuma interação registrada no Histórico.' },
  { r: 14, l: 'Leads com primeira tentativa atrasada (ainda sem tentativa)', f: '=COUNTIFS(' + P_BASE + ',' + lr_('AI') + ',"*Primeiro contato atrasado*")', base: 'B10', n: 'Sem tentativa e prazo em horas úteis vencido (ver Configurações).' },
  { r: 15, l: 'Leads cuja primeira tentativa foi feita fora do prazo', f: '=SUMPRODUCT(' + P_MASK + '*ISNUMBER(' + lr_('AC') + ')*(' + lr_('AC') + '>CFG_PRAZO_H/24+0.000001))', base: 'B11', n: 'Já tiveram tentativa, mas depois do prazo. Denominador: leads com tentativa.' },
  { r: 16, l: 'Retornos atrasados', f: '=COUNTIFS(' + P_BASE + ',' + lr_('AI') + ',"*Retorno atrasado*")', base: 'B10', n: 'Próxima ação vencida, sem interação posterior, lead aberto.' },
  { r: 17, l: 'Leads sem próxima ação', f: '=COUNTIFS(' + P_BASE + ',' + lr_('AI') + ',"*Sem próxima ação*")', base: 'B10', n: 'Lead aberto, com contato, sem ação e data futura definidas.' },
  { r: 18, l: 'Propostas enviadas', f: '=SUMPRODUCT(' + P_MASK + '*((ISNUMBER(' + lr_('U') + ')+(' + lr_('M') + '="Proposta enviada"))>0))', base: 'B10', n: 'Leads com data de envio de proposta preenchida ou etapa "Proposta enviada".' },
  { r: 19, l: 'Leads em negociação', f: '=COUNTIFS(' + P_BASE + ',' + lr_('M') + ',"Em negociação")', base: 'B10', n: 'Etapa atual = Em negociação.' },
  { r: 20, l: 'Vendas concluídas', f: '=COUNTIFS(' + P_BASE + ',' + lr_('M') + ',"Venda concluída")', base: 'B10', n: 'Etapa atual = Venda concluída.' },
  { r: 21, l: 'Leads perdidos', f: '=COUNTIFS(' + P_BASE + ',' + lr_('M') + ',"Perdido")', base: 'B10', n: 'Etapa atual = Perdido.' },
  { r: 22, l: 'Leads encerrados sem resposta', f: '=COUNTIFS(' + P_BASE + ',' + lr_('M') + ',"Sem resposta após tentativas")', base: 'B10', n: 'Etapa "Sem resposta após tentativas" (não contam como perdidos).' }
];
/** Seção 2: percentuais pedidos (num/den são células da seção 1). */
var P_SEC2 = [
  { r: 26, l: '% de leads com contato efetivo', num: 'B12', den: 'B10', n: 'Leads com contato efetivo ÷ total de leads encaminhados no período.' },
  { r: 27, l: '% de leads que receberam proposta', num: 'B18', den: 'B10', n: 'Leads com proposta enviada ÷ total de leads encaminhados no período.' },
  { r: 28, l: 'Conversão de leads em vendas', num: 'B20', den: 'B10', n: 'Vendas concluídas ÷ total de leads encaminhados no período.' }
];
/** Seção 3: médias (leads sem registro ficam de fora, não entram como zero). */
var P_SEC3 = [
  { r: 32, l: 'Tempo médio até a primeira tentativa (horas úteis)', col: 'AC', n: 'Média só dos leads que já tiveram tentativa. Contagem a partir do início do expediente quando o lead chega fora do horário.' },
  { r: 33, l: 'Tempo médio até o contato efetivo (horas úteis)', col: 'AD', n: 'Média só dos leads que já tiveram contato efetivo.' }
];
/** Seção 4: resultados por data do evento (ignora a data de encaminhamento). */
var P_SEC4 = [
  { r: 37, l: 'Propostas enviadas no período', f: '=COUNTIFS(' + p_noPeriodo_('U') + ')', n: 'Pela data de envio da proposta.' },
  { r: 38, l: 'Vendas concluídas no período', f: '=COUNTIFS(' + lr_('M') + ',"Venda concluída",' + p_noPeriodo_('Z') + ')', n: 'Pela data de fechamento.' },
  { r: 39, l: 'Leads perdidos no período', f: '=COUNTIFS(' + lr_('M') + ',"Perdido",' + p_noPeriodo_('Z') + ')', n: 'Pela data de encerramento.' },
  { r: 40, l: 'Primeiras tentativas realizadas no período', f: '=COUNTIFS(' + p_noPeriodo_('N') + ')', n: 'Pela data da primeira tentativa.' },
  { r: 41, l: 'Primeiros contatos efetivos no período', f: '=COUNTIFS(' + p_noPeriodo_('O') + ')', n: 'Pela data do primeiro contato efetivo.' },
  { r: 42, l: 'Interações registradas no Histórico no período', f: '=COUNTIFS(' + hr_('C') + ',">="&$B$4,' + hr_('C') + ',"<"&$H$7)', n: 'Todas as interações, de todos os produtos (o Histórico não tem produto).' }
];
var P_SEC5_ROW0 = 46;  // 8 situações (linhas 46-53) + pendências (54)
var P_SEC6_ROW0 = 58;  // 12 etapas (linhas 58-69)
