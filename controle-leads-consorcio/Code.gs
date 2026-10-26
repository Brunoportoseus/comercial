/**
 * Controle de Leads de Consórcio — monta a planilha e ativa as automações.
 * Use junto com Formulas.gs (mesmo projeto do Apps Script).
 *
 * Menu: Controle de Leads > 1. Montar / atualizar planilha
 *                           2. Ativar automações
 * Rodar o passo 1 de novo é seguro: reaplica formatação, listas e fórmulas sem apagar os dados digitados.
 */

var COL = { id: 1, enc: 2, nome: 3, whats: 4, resp: 12, etapa: 13, etapaDesde: 32 };
var TOTAL_COLS_LEADS = 45; // A:AS

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Controle de Leads')
    .addItem('1. Montar / atualizar planilha', 'montarPlanilha')
    .addItem('2. Ativar automações (IDs, etapa e histórico)', 'instalarAutomacoes')
    .addSeparator()
    .addItem('Aplicar fuso horário das Configurações', 'aplicarFuso')
    .addToUi();
}

/* ====================== MONTAGEM ====================== */

function montarPlanilha() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetLocale('pt_BR');
  ss.setSpreadsheetTimeZone('America/Sao_Paulo');

  var ordem = [NOMES.ajuda, NOMES.leads, NOMES.hist, NOMES.painel, NOMES.cfg, NOMES.listas];
  var sheets = {};
  ordem.forEach(function (n) { sheets[n] = ss.getSheetByName(n) || ss.insertSheet(n); });
  ordem.forEach(function (n, i) { ss.setActiveSheet(sheets[n]); ss.moveActiveSheet(i + 1); });
  ss.getSheets().forEach(function (s) {            // remove a aba vazia padrão
    if (ordem.indexOf(s.getName()) < 0 && s.getLastRow() <= 1 && s.getLastColumn() <= 1) ss.deleteSheet(s);
  });

  montarListas_(sheets[NOMES.listas]);
  montarConfig_(ss, sheets[NOMES.cfg]);
  montarLeads_(ss, sheets[NOMES.leads]);
  montarHistorico_(ss, sheets[NOMES.hist]);
  montarPainel_(ss, sheets[NOMES.painel]);
  montarAjuda_(sheets[NOMES.ajuda]);

  ss.setActiveSheet(sheets[NOMES.leads]);
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Planilha montada.\n\nPróximo passo: menu Controle de Leads > 2. Ativar automações.');
}

var COR = { cadastro: '#1c4587', atend: '#274e13', auto: '#4a4a4a', aux: '#999999', cab: '#f3f3f3' };

function estiloCab_(rng, cor) {
  rng.setBackground(cor).setFontColor('#ffffff').setFontWeight('bold').setWrap(true)
    .setVerticalAlignment('middle').setHorizontalAlignment('center');
}

/* ---------- Listas ---------- */
function montarListas_(sh) {
  var tit = ['Etapas (não alterar nomes)', 'Produtos (não alterar)', 'Origens', 'Responsáveis', 'Canais', 'Tipos de interação',
    'Resultados', 'Classe do resultado', 'Próximas ações', 'Administradoras', 'Motivos de perda', 'Situações (ordem de urgência)', 'Filtro do painel'];
  sh.getRange(1, 1, 1, tit.length).setValues([tit]);
  estiloCab_(sh.getRange(1, 1, 1, tit.length), COR.auto);
  function col(c, arr) { sh.getRange(2, c, arr.length, 1).setValues(arr.map(function (v) { return [v]; })); }
  if (sh.getRange('A2').getValue() === '') {   // listas editáveis só são gravadas na 1ª montagem
    col(3, ['Meta Ads', 'Google Ads', 'Instagram orgânico', 'Indicação', 'WhatsApp direto', 'Site / landing page', 'Evento', 'Outros']);
    col(4, ['Pedro Ciceroni', 'Bruno Porto']);
    col(5, ['WhatsApp', 'Ligação', 'E-mail', 'Reunião', 'Outro']);
    col(6, ['Tentativa de contato', 'Conversa realizada', 'Envio de simulação', 'Envio de proposta', 'Retorno', 'Outro']);
    var res = [
      ['Não atendeu', 'Tentativa sem resposta'], ['Mensagem enviada, sem resposta', 'Tentativa sem resposta'],
      ['Número inválido / inexistente', 'Tentativa sem resposta'], ['Caixa postal / telefone desligado', 'Tentativa sem resposta'],
      ['Cliente respondeu', 'Contato efetivo'], ['Conversa realizada', 'Contato efetivo'],
      ['Cliente pediu retorno em outra data', 'Contato efetivo'], ['Cliente solicitou simulação / proposta', 'Contato efetivo'],
      ['Cliente recebeu proposta e vai analisar', 'Contato efetivo'], ['Cliente sem interesse', 'Contato efetivo'],
      ['Venda fechada', 'Contato efetivo']];
    sh.getRange(2, 7, res.length, 2).setValues(res);
    col(9, ['Ligar', 'Enviar WhatsApp', 'Enviar simulação', 'Enviar proposta', 'Cobrar retorno da proposta', 'Agendar reunião',
      'Aguardar documentos', 'Aguardar decisão do cliente', 'Revisar atendimento pausado', 'Nova tentativa de contato']);
    col(10, ['Embracon', 'Ademicon', 'Canopus', 'Rodobens', 'Porto Seguro Consórcio', 'Itaú Consórcio', 'Bradesco Consórcio',
      'Santander Consórcio', 'Banco do Brasil Consórcios', 'Caixa Consórcios', 'Outra']);
    col(11, ['Sem interesse', 'Sem condições financeiras', 'Fechou com concorrente', 'Desistiu da compra', 'Crédito não aprovado',
      'Contato inválido', 'Outro']);
  }
  col(1, ETAPAS);
  col(2, PRODUTOS);
  col(12, SITUACOES);
  col(13, ['Todos'].concat(PRODUTOS));
  sh.getRange('G1:H1').setNote('Coluna H define se o resultado conta como "Contato efetivo" (o cliente respondeu) ou "Tentativa sem resposta". ' +
    'Pode incluir novos resultados nas linhas abaixo (até a linha 40).');
  sh.setColumnWidths(1, 13, 200);
  sh.setFrozenRows(1);
}

/* ---------- Configurações ---------- */
function montarConfig_(ss, sh) {
  var primeira = sh.getRange('B3').getValue() === '';   // só grava valores padrão na 1ª montagem (preserva o que foi editado)
  sh.getRange('A1').setValue('Configurações e regras de acompanhamento').setFontSize(14).setFontWeight('bold');
  sh.getRange('A2:C2').setValues([['Parâmetro', 'Valor', 'Observação']]);
  estiloCab_(sh.getRange('A2:C2'), COR.auto);
  var linhas = [
    ['Prazo para primeira tentativa (horas úteis)', 2, 'Parâmetro inicial, não é condição comercial acordada. Conta só dentro do horário de atendimento.'],
    ['Início do atendimento', 9 / 24, 'Lead recebido antes disso começa a contar neste horário.'],
    ['Fim do atendimento', 18 / 24, 'Lead recebido depois disso começa a contar no próximo dia útil.'],
    ['Fuso horário', 'America/Sao_Paulo', 'Depois de alterar, use o menu Controle de Leads > Aplicar fuso horário.'],
    ['Prazo de atenção por ausência de interação (dias úteis)', 2, 'Gera "Sem atualização" quando passa deste limite e não há retorno futuro válido.'],
    ['Prazo para retorno após proposta (dias úteis)', 2, 'Gera "Proposta sem acompanhamento" quando passa deste limite sem nova interação.'],
    ['Responsável padrão', 'Pedro Ciceroni', 'Preenchido automaticamente em novos leads e interações.']
  ];
  linhas.forEach(function (l, i) {
    sh.getRange(3 + i, 1).setValue(l[0]); sh.getRange(3 + i, 3).setValue(l[2]);
    if (primeira) sh.getRange(3 + i, 2).setValue(l[1]);
  });
  sh.getRange('B4:B5').setNumberFormat('HH:mm');
  sh.getRangeList(['B3', 'B7:B8']).setNumberFormat('0');
  sh.getRange('B3:B9').setBackground('#fff2cc').setHorizontalAlignment('center');

  sh.getRange('A11:C11').setValues([['Dias de atendimento', 'Atende?', 'Observação']]);
  estiloCab_(sh.getRange('A11:C11'), COR.auto);
  var dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  sh.getRange(12, 1, 7, 1).setValues(dias.map(function (d) { return [d]; }));
  sh.getRange('B12:B18').insertCheckboxes().setBackground('#fff2cc');
  if (primeira) sh.getRange('B12:B18').setValues([[true], [true], [true], [true], [true], [false], [false]]);
  sh.getRange('A19').setValue('Código dos dias úteis (calculado, não editar)');
  sh.getRange('B19').setFormula('=IF(B12,0,1)&IF(B13,0,1)&IF(B14,0,1)&IF(B15,0,1)&IF(B16,0,1)&IF(B17,0,1)&IF(B18,0,1)');
  sh.getRange('C12').setValue('O horário de atendimento (linhas 4 e 5) vale para todos os dias marcados.');

  sh.getRange('E2').setValue('Feriados (um por linha)');
  estiloCab_(sh.getRange('E2'), COR.auto);
  sh.getRange('E4:E43').setNumberFormat('dd/MM/yyyy').setBackground('#fff2cc');
  sh.getRange('E3').setValue('Nenhum feriado cadastrado — hoje feriados contam como dia útil. Preencha aqui as datas.')
    .setFontColor('#a50e0e').setFontStyle('italic');
  sh.getRange('C3:C9').setWrap(true).setFontColor('#666666');
  sh.setColumnWidths(1, 1, 380); sh.setColumnWidth(2, 130); sh.setColumnWidth(3, 460); sh.setColumnWidth(4, 30); sh.setColumnWidth(5, 190);

  // validações simples
  sh.getRange('B3').setDataValidation(SpreadsheetApp.newDataValidation().requireNumberGreaterThan(0).setAllowInvalid(false).build());
  sh.getRange('B7:B8').setDataValidation(SpreadsheetApp.newDataValidation().requireNumberGreaterThanOrEqualTo(0).setAllowInvalid(false).build());

  var nomes = { CFG_PRAZO_H: 'B3', CFG_INICIO: 'B4', CFG_FIM: 'B5', CFG_DIAS_ATENCAO: 'B7', CFG_DIAS_PROPOSTA: 'B8',
    CFG_RESP_PADRAO: 'B9', CFG_FDS: 'B19', CFG_FERIADOS: 'E4:E43' };
  ss.getNamedRanges().forEach(function (nr) { if (nomes[nr.getName()]) nr.remove(); });
  Object.keys(nomes).forEach(function (n) { ss.setNamedRange(n, sh.getRange(nomes[n])); });
}

function aplicarFuso() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = ss.getSheetByName(NOMES.cfg).getRange('B6').getValue();
  ss.setSpreadsheetTimeZone(String(tz));
  SpreadsheetApp.getUi().alert('Fuso horário aplicado: ' + tz);
}

/* ---------- Leads ---------- */
var CAMPOS_LEADS = [
  // [título, largura, bloco, nota]
  ['ID do lead', 80, 'c', 'Gerado automaticamente ao digitar o nome ou WhatsApp. Permanente: não altere nem reutilize.'],
  ['Data e hora do encaminhamento', 140, 'c', 'Preenchida automaticamente com o horário atual se ficar em branco. Para leads antigos, digite a data real (atalho: Ctrl+Alt+Shift+; insere data e hora).'],
  ['Nome do cliente', 170, 'c', ''],
  ['WhatsApp (com DDD)', 130, 'c', 'Guardado como texto. Ex.: (41) 99999-9999.'],
  ['Abrir WhatsApp', 110, 'c', 'Link automático para abrir a conversa.'],
  ['Cidade/UF', 120, 'c', ''],
  ['Origem do lead', 130, 'c', 'Lista editável na aba Listas; aceita outros valores.'],
  ['Produto de interesse', 120, 'c', ''],
  ['Valor de crédito desejado', 120, 'c', ''],
  ['Parcela pretendida', 110, 'c', ''],
  ['Observações do encaminhamento', 240, 'c', ''],
  ['Responsável pelo atendimento', 140, 'c', 'Padrão: Pedro Ciceroni.'],
  ['Etapa atual', 190, 'a', 'Atualizada por Pedro. Também é atualizada automaticamente quando uma interação do Histórico informa "Nova etapa".'],
  ['1ª tentativa de contato (auto)', 130, 'a', 'Vem do Histórico: data da primeira interação registrada, mesmo sem resposta do cliente.'],
  ['1º contato efetivo (auto)', 130, 'a', 'Vem do Histórico: primeira interação com resultado classificado como "Contato efetivo" (o cliente respondeu).'],
  ['Última interação (auto)', 130, 'a', 'Vem do Histórico.'],
  ['Resultado do último contato (auto)', 200, 'a', 'Vem do Histórico.'],
  ['Resumo objetivo da situação do cliente', 280, 'a', 'Em "Atendimento pausado", registre aqui a justificativa.'],
  ['Próxima ação', 170, 'a', 'Atualizada automaticamente se a interação do Histórico informar próxima ação. Retorno agendado = próxima ação + data.'],
  ['Data e hora da próxima ação', 140, 'a', 'Em "Atendimento pausado", é a data de revisão.'],
  ['Data de envio da proposta', 120, 'a', ''],
  ['Valor do crédito proposto', 120, 'a', ''],
  ['Valor da parcela proposta', 120, 'a', ''],
  ['Administradora', 160, 'a', ''],
  ['Link da proposta (opcional)', 160, 'a', ''],
  ['Data de fechamento / encerramento', 130, 'a', ''],
  ['Motivo da perda', 170, 'a', 'Obrigatório quando a etapa for Perdido.'],
  ['Prazo da 1ª tentativa (auto)', 130, 'm', 'Data e hora limite, contando só o horário de atendimento (Configurações).'],
  ['Tempo até 1ª tentativa (horas úteis)', 120, 'm', 'Horas úteis entre o encaminhamento (ou o início do expediente) e a primeira tentativa.'],
  ['Tempo até 1º contato efetivo (horas úteis)', 120, 'm', 'Idem, até o primeiro contato em que o cliente respondeu.'],
  ['Dias úteis desde a última interação', 120, 'm', ''],
  ['Etapa desde (automático)', 130, 'm', 'Preenchida pelo script quando a etapa muda (valor fixo, não muda sozinho). Vazia = sem histórico suficiente.'],
  ['Dias na etapa atual', 100, 'm', 'Dias corridos desde a entrada na etapa atual. Vazio quando não há histórico suficiente.'],
  ['SITUAÇÃO DO ACOMPANHAMENTO', 210, 'm', 'Alerta mais urgente. Ordem: Primeiro contato atrasado > Proposta sem acompanhamento > Retorno atrasado > Sem próxima ação > Sem atualização.'],
  ['Todos os alertas', 260, 'm', 'Todas as pendências do lead, da mais para a menos urgente.'],
  ['Pendência de preenchimento', 300, 'm', 'Campos obrigatórios que faltam ou inconsistências.'],
  ['Prioridade (1 = mais urgente)', 90, 'm', 'Use para ordenar a lista pelo mais urgente.'],
  ['aux: início da contagem', 120, 'x', 'Auxiliar. Não editar.'],
  ['aux: etapa efetiva', 120, 'x', 'Auxiliar. Não editar.'],
  ['aux: retorno futuro válido', 110, 'x', 'Auxiliar. Não editar.'],
  ['aux: retorno vencido', 110, 'x', 'Auxiliar. Não editar.'],
  ['aux: data-base da proposta', 110, 'x', 'Auxiliar. Não editar.'],
  ['aux: dias úteis da proposta', 110, 'x', 'Auxiliar. Não editar.'],
  ['aux: alertas abertos', 200, 'x', 'Auxiliar. Não editar.'],
  ['aux: pendências', 200, 'x', 'Auxiliar. Não editar.']
];

function letra_(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - m) / 26); } return s; }

function montarLeads_(ss, sh) {
  var n = LN - L1 + 1;
  var ncols = CAMPOS_LEADS.length;
  if (sh.getMaxRows() < LN) sh.insertRowsAfter(sh.getMaxRows(), LN - sh.getMaxRows());
  if (sh.getMaxColumns() < ncols) sh.insertColumnsAfter(sh.getMaxColumns(), ncols - sh.getMaxColumns());
  if (sh.getFilter()) sh.getFilter().remove();

  // cabeçalhos
  sh.getRange(2, 1, 1, ncols).setValues([CAMPOS_LEADS.map(function (c) { return c[0]; })]);
  var cores = { c: COR.cadastro, a: COR.atend, m: COR.auto, x: COR.aux };
  CAMPOS_LEADS.forEach(function (c, i) {
    estiloCab_(sh.getRange(2, i + 1), cores[c[2]]);
    sh.setColumnWidth(i + 1, c[1]);
    if (c[3]) sh.getRange(2, i + 1).setNote(c[3]);
  });
  var blocos = [[1, 12, 'CADASTRO E ENCAMINHAMENTO (Bruno)', COR.cadastro], [13, 15, 'ATENDIMENTO (Pedro)', COR.atend],
    [28, 10, 'ACOMPANHAMENTO AUTOMÁTICO (não digitar)', COR.auto], [38, 8, 'AUXILIARES (ocultas)', COR.aux]];
  sh.getRange(1, 1, 1, ncols).breakApart();
  blocos.forEach(function (b) {
    var r = sh.getRange(1, b[0], 1, b[1]);
    r.merge(); r.setValue(b[2]); estiloCab_(r, b[3]);
  });
  sh.setRowHeight(1, 24); sh.setRowHeight(2, 62);

  // formatos
  var dados = function (c1, c2) { return sh.getRange(L1, c1, n, c2 - c1 + 1); };
  dados(1, ncols).setVerticalAlignment('middle');
  dados(4, 4).setNumberFormat('@');
  ['B', 'N', 'O', 'P', 'T', 'AB', 'AF'].forEach(function (l) { sh.getRange(l + L1 + ':' + l + LN).setNumberFormat('dd/MM/yyyy HH:mm'); });
  ['U', 'Z', 'AP'].forEach(function (l) { sh.getRange(l + L1 + ':' + l + LN).setNumberFormat('dd/MM/yyyy'); });
  ['I', 'J', 'V', 'W'].forEach(function (l) { sh.getRange(l + L1 + ':' + l + LN).setNumberFormat('R$ #,##0.00'); });
  ['AC', 'AD'].forEach(function (l) { sh.getRange(l + L1 + ':' + l + LN).setNumberFormat('[h]:mm'); });
  ['AE', 'AG', 'AK', 'AQ'].forEach(function (l) { sh.getRange(l + L1 + ':' + l + LN).setNumberFormat('0'); });
  dados(11, 11).setWrap(true); dados(18, 18).setWrap(true); dados(34, 36).setWrap(true);
  dados(14, 17).setBackground('#f3f3f3'); dados(28, 37).setBackground('#f3f3f3');

  // fórmulas
  var colunasFormula = ['E', 'N', 'O', 'P', 'Q', 'AB', 'AC', 'AD', 'AE', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS'];
  var mapa = {};
  for (var r = L1; r <= LN; r++) { var f = formulasLeads_(r); colunasFormula.forEach(function (c) { (mapa[c] = mapa[c] || []).push([f[c]]); }); }
  colunasFormula.forEach(function (c) { sh.getRange(c + L1 + ':' + c + LN).setFormulas(mapa[c]); });

  // listas suspensas
  var L = ss.getSheetByName(NOMES.listas);
  function lista(colLeads, colListas, ate, estrito) {
    var rng = L.getRange(colListas + '2:' + colListas + ate);
    sh.getRange(colLeads + L1 + ':' + colLeads + LN).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInRange(rng, true).setAllowInvalid(!estrito).build());
  }
  lista('G', 'C', 40, false); lista('H', 'B', 8, true); lista('L', 'D', 20, true); lista('M', 'A', 13, true);
  lista('S', 'I', 40, false); lista('X', 'J', 40, false); lista('AA', 'K', 30, true);
  var dataHora = SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).setHelpText('Digite uma data/hora válida, ex.: 26/10/2026 14:30').build();
  ['B', 'T', 'U', 'Z'].forEach(function (l) { sh.getRange(l + L1 + ':' + l + LN).setDataValidation(dataHora); });
  ['I', 'J', 'V', 'W'].forEach(function (l) {
    sh.getRange(l + L1 + ':' + l + LN).setDataValidation(SpreadsheetApp.newDataValidation().requireNumberGreaterThanOrEqualTo(0).setAllowInvalid(false).build());
  });

  // formatação condicional
  var regras = [];
  var rngSit = [sh.getRange('AH' + L1 + ':AH' + LN), sh.getRange('C' + L1 + ':C' + LN)];
  var cores2 = [
    ['Primeiro contato atrasado', '#ea9999', '#660000'], ['Proposta sem acompanhamento', '#f6b26b', '#5b3000'],
    ['Retorno atrasado', '#f9cb9c', '#5b3000'], ['Sem próxima ação', '#ffe599', '#594400'], ['Sem atualização', '#fff2cc', '#594400'],
    ['Novo, dentro do prazo', '#cfe2f3', '#0b3d6b'], ['Em dia', '#b6d7a8', '#1e4d12'], ['Encerrado', '#d9d9d9', '#444444']];
  cores2.forEach(function (c) {
    regras.push(SpreadsheetApp.newConditionalFormatRule().setRanges(rngSit)
      .whenFormulaSatisfied('=$AH' + L1 + '="' + c[0] + '"').setBackground(c[1]).setFontColor(c[2]).build());
  });
  regras.push(SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('AI' + L1 + ':AI' + LN)])
    .whenFormulaSatisfied('=AND($AI' + L1 + '<>"",$AI' + L1 + '<>"Em dia",$AI' + L1 + '<>"Encerrado",$AI' + L1 + '<>"Novo, dentro do prazo")')
    .setBackground('#fce5cd').setFontColor('#5b3000').build());
  regras.push(SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('AJ' + L1 + ':AJ' + LN)])
    .whenFormulaSatisfied('=AND($AJ' + L1 + '<>"",$AJ' + L1 + '<>"OK")').setBackground('#d9d2e9').setFontColor('#351c75').setBold(true).build());
  regras.push(SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('AJ' + L1 + ':AJ' + LN)])
    .whenFormulaSatisfied('=$AJ' + L1 + '="OK"').setFontColor('#38761d').build());
  regras.push(SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('T' + L1 + ':T' + LN)])
    .whenFormulaSatisfied('=AND(ISNUMBER($T' + L1 + '),$T' + L1 + '<NOW(),$AI' + L1 + '<>"Encerrado")').setFontColor('#cc0000').setBold(true).build());
  regras.push(SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('D' + L1 + ':D' + LN)])
    .whenFormulaSatisfied('=AND($D' + L1 + '<>"",OR(LEN(REGEXREPLACE($D' + L1 + '&"","[^0-9]",""))<10,LEN(REGEXREPLACE($D' + L1 + '&"","[^0-9]",""))>13))')
    .setBackground('#ea9999').build());
  var etapaCores = [['Venda concluída', '#b6d7a8'], ['Perdido', '#d9d9d9'], ['Atendimento pausado', '#e6e6e6'], ['Sem resposta após tentativas', '#fce5cd'], ['Proposta enviada', '#cfe2f3']];
  etapaCores.forEach(function (c) {
    regras.push(SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('M' + L1 + ':M' + LN)])
      .whenTextEqualTo(c[0]).setBackground(c[1]).build());
  });
  sh.setConditionalFormatRules(regras);

  // proteção "aviso" nas colunas automáticas
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) { p.remove(); });
  ['E', 'N:Q', 'AB:AK', 'AL:AS'].forEach(function (a) {
    var c = a.split(':'); var c2 = c[1] || c[0];
    sh.getRange(c[0] + L1 + ':' + c2 + LN).protect().setDescription('Coluna automática').setWarningOnly(true);
  });

  // filtro, congelamento e ocultação
  sh.getRange(2, 1, n + 1, ncols).createFilter();
  sh.setFrozenRows(2); sh.setFrozenColumns(3);
  sh.hideColumns(38, 8);
  sh.setTabColor('#1c4587');
}

/* ---------- Histórico ---------- */
function montarHistorico_(ss, sh) {
  var tit = ['ID da interação', 'ID do lead', 'Data e hora', 'Responsável', 'Canal', 'Tipo', 'Resultado', 'Resumo objetivo', 'Nova etapa (se mudou)',
    'Próxima ação', 'Data e hora da próxima ação', 'Cliente (auto)', 'Classe do resultado (auto)', 'aux: chave'];
  var n = HN - H1 + 1;
  if (sh.getMaxRows() < HN) sh.insertRowsAfter(sh.getMaxRows(), HN - sh.getMaxRows());
  if (sh.getFilter()) sh.getFilter().remove();
  sh.getRange(1, 1, 1, tit.length).setValues([tit]);
  estiloCab_(sh.getRange(1, 1, 1, 11), COR.atend);
  estiloCab_(sh.getRange(1, 12, 1, 2), COR.auto);
  estiloCab_(sh.getRange(1, 14), COR.aux);
  sh.setRowHeight(1, 48);
  var larg = [95, 90, 140, 130, 100, 150, 230, 320, 190, 170, 140, 170, 170, 100];
  larg.forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
  sh.getRange('A1').setNote('Gerado automaticamente ao informar o ID do lead. Uma linha por interação: nunca apague nem sobrescreva linhas antigas, acrescente uma nova.');
  sh.getRange('B1').setNote('Escolha o ID na lista (ou digite). O nome do cliente aparece na coluna L.');
  sh.getRange('C1').setNote('Se ficar em branco, é preenchida com o horário atual. Atalho: Ctrl+Alt+Shift+; insere data e hora.');
  sh.getRange('G1').setNote('O resultado define se foi só tentativa ou contato efetivo (classe na coluna M). Preencha sempre.');
  sh.getRange('I1').setNote('Preencha só se a etapa mudou. Atualiza a etapa na aba Leads (somente se esta for a interação mais recente do lead).');
  sh.getRange('J1').setNote('Se preenchida, atualiza a próxima ação na aba Leads (somente se for a interação mais recente).');

  sh.getRange('C2:C' + HN).setNumberFormat('dd/MM/yyyy HH:mm'); sh.getRange('K2:K' + HN).setNumberFormat('dd/MM/yyyy HH:mm');
  sh.getRange('H2:H' + HN).setWrap(true);
  sh.getRange('L2:N' + HN).setBackground('#f3f3f3');

  var mapa = { L: [], M: [], N: [] };
  for (var r = H1; r <= HN; r++) { var f = formulasHist_(r); ['L', 'M', 'N'].forEach(function (c) { mapa[c].push([f[c]]); }); }
  ['L', 'M', 'N'].forEach(function (c) { sh.getRange(c + H1 + ':' + c + HN).setFormulas(mapa[c]); });

  var L = ss.getSheetByName(NOMES.listas);
  function lista(col, colL, ate, estrito) {
    sh.getRange(col + H1 + ':' + col + HN).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInRange(L.getRange(colL + '2:' + colL + ate), true).setAllowInvalid(!estrito).build());
  }
  lista('D', 'D', 20, true); lista('E', 'E', 10, true); lista('F', 'F', 20, true); lista('G', 'G', 40, true);
  lista('I', 'A', 13, true); lista('J', 'I', 40, false);
  sh.getRange('B' + H1 + ':B' + HN).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(NOMES.leads).getRange('A' + L1 + ':A' + LN), true).setAllowInvalid(false)
    .setHelpText('Use um ID existente na aba Leads.').build());
  var dh = SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).setHelpText('Data e hora válidas, ex.: 26/10/2026 14:30').build();
  sh.getRange('C' + H1 + ':C' + HN).setDataValidation(dh); sh.getRange('K' + H1 + ':K' + HN).setDataValidation(dh);

  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('G' + H1 + ':G' + HN)])
      .whenFormulaSatisfied('=AND($B' + H1 + '<>"",$G' + H1 + '="")').setBackground('#ffe599').build(),
    SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('L' + H1 + ':L' + HN)])
      .whenTextEqualTo('ID não encontrado').setBackground('#ea9999').build(),
    SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('M' + H1 + ':M' + HN)])
      .whenTextEqualTo('Contato efetivo').setBackground('#b6d7a8').setFontColor('#1e4d12').build(),
    SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange('M' + H1 + ':M' + HN)])
      .whenTextEqualTo('Tentativa sem resposta').setBackground('#fff2cc').setFontColor('#594400').build()
  ]);
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) { p.remove(); });
  sh.getRange('L' + H1 + ':N' + HN).protect().setDescription('Coluna automática').setWarningOnly(true);
  sh.getRange(1, 1, n + 1, 13).createFilter();
  sh.setFrozenRows(1); sh.setFrozenColumns(2);
  sh.hideColumns(14);
  sh.setTabColor('#274e13');
}

/* ---------- Painel do Bruno ---------- */
function montarPainel_(ss, sh) {
  var salvo = sh.getRange('B4:B6').getValues();            // preserva filtros já escolhidos
  sh.getRange('A1:H80').clear(); sh.getRange('A1:H80').clearDataValidations();
  sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 400); sh.setColumnWidth(2, 120); sh.setColumnWidth(3, 120); sh.setColumnWidth(4, 120); sh.setColumnWidth(5, 520);
  sh.setColumnWidth(6, 20); sh.setColumnWidth(7, 20); sh.setColumnWidth(8, 90);
  sh.getRange('A1').setValue('Painel do Bruno — acompanhamento dos leads').setFontSize(16).setFontWeight('bold');
  sh.getRange('A2').setValue('Os números são calculados pelas abas Leads e Histórico de contatos. Altere só as 3 células amarelas.').setFontColor('#666666');

  sh.getRange('A4:A6').setValues([['Encaminhados de (data inicial)'], ['Encaminhados até (data final)'], ['Produto']]).setFontWeight('bold');
  var hoje = new Date(); var ini = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  var jaTem = salvo[0][0] !== '' && salvo[1][0] !== '' && salvo[2][0] !== '';
  sh.getRange('B4:B5').setValues(jaTem ? [[salvo[0][0]], [salvo[1][0]]] : [[ini], [hoje]]).setNumberFormat('dd/MM/yyyy');
  sh.getRange('B6').setValue(jaTem ? salvo[2][0] : 'Todos');
  sh.getRange('B4:B6').setBackground('#fff2cc').setHorizontalAlignment('center').setFontWeight('bold');
  sh.getRange('B6').setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInRange(ss.getSheetByName(NOMES.listas).getRange('M2:M9'), true).setAllowInvalid(false).build());
  sh.getRange('B4:B5').setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).build());
  sh.getRange('E4').setValue('A seção 1 conta os leads pela data de ENCAMINHAMENTO (coorte). A seção 4 conta eventos pela data em que aconteceram.')
    .setFontColor('#666666').setWrap(true);
  sh.getRange('H5').setValue('auxiliares').setFontColor('#999999');
  sh.getRange('H6').setFormula('=IF($B$6="Todos","*",$B$6)').setFontColor('#999999');
  sh.getRange('H7').setFormula('=INT($B$5)+1').setFontColor('#999999').setNumberFormat('0');

  function secao(linha, titulo, cabecalhos) {
    sh.getRange(linha, 1, 1, 5).setBackground('#1c4587').setFontColor('#ffffff').setFontWeight('bold');
    sh.getRange(linha, 1).setValue(titulo);
    sh.getRange(linha + 1, 1, 1, 5).setValues([cabecalhos]).setBackground('#d9e2f3').setFontWeight('bold').setWrap(true);
    sh.getRange(linha + 1, 2, 1, 3).setHorizontalAlignment('center');
  }
  var corpo = function (r1, r2) { sh.getRange(r1, 2, r2 - r1 + 1, 3).setHorizontalAlignment('center'); sh.getRange(r1, 5, r2 - r1 + 1, 1).setFontColor('#666666').setWrap(true); };

  // 1
  secao(8, '1. Leads encaminhados no período — situação atual deles', ['Indicador', 'Leads', 'Base (denominador)', '% da base', 'Como é calculado']);
  P_SEC1.forEach(function (s) {
    sh.getRange(s.r, 1).setValue(s.l); sh.getRange(s.r, 2).setFormula(s.f); sh.getRange(s.r, 5).setValue(s.n);
    if (s.base) { sh.getRange(s.r, 3).setFormula('=' + s.base); sh.getRange(s.r, 4).setFormula('=IF(C' + s.r + '=0,"—",B' + s.r + '/C' + s.r + ')'); }
  });
  corpo(10, 22); sh.getRange('D10:D22').setNumberFormat('0.0%'); sh.getRange('B10:B22').setFontWeight('bold');

  // 2
  secao(24, '2. Percentuais (com numerador e denominador)', ['Indicador', 'Resultado', 'Numerador', 'Denominador', 'Definição']);
  P_SEC2.forEach(function (s) {
    sh.getRange(s.r, 1).setValue(s.l);
    sh.getRange(s.r, 2).setFormula('=IF(D' + s.r + '=0,"—",C' + s.r + '/D' + s.r + ')').setNumberFormat('0.0%').setFontWeight('bold');
    sh.getRange(s.r, 3).setFormula('=' + s.num); sh.getRange(s.r, 4).setFormula('=' + s.den); sh.getRange(s.r, 5).setValue(s.n);
  });
  corpo(26, 28);

  // 3
  secao(30, '3. Tempos médios (horas úteis) — leads sem registro ficam de fora, não entram como zero', ['Indicador', 'Média (h:mm)', 'Leads considerados', 'Leads sem registro', 'Observação']);
  P_SEC3.forEach(function (s) {
    var c = lr_(s.col);
    sh.getRange(s.r, 1).setValue(s.l);
    sh.getRange(s.r, 2).setFormula('=IFERROR(AVERAGEIFS(' + c + ',' + P_BASE + ',' + c + ',">=0"),"—")').setNumberFormat('[h]:mm').setFontWeight('bold');
    sh.getRange(s.r, 3).setFormula('=COUNTIFS(' + P_BASE + ',' + c + ',">=0")');
    sh.getRange(s.r, 4).setFormula('=$B$10-C' + s.r); sh.getRange(s.r, 5).setValue(s.n);
  });
  corpo(32, 33);

  // 4
  secao(35, '4. Resultados ocorridos no período — pela data do evento, não importa quando o lead foi encaminhado', ['Indicador', 'Quantidade', '', '', 'Data usada']);
  P_SEC4.forEach(function (s) { sh.getRange(s.r, 1).setValue(s.l); sh.getRange(s.r, 2).setFormula(s.f).setFontWeight('bold'); sh.getRange(s.r, 5).setValue(s.n); });
  corpo(37, 42);

  // 5
  secao(44, '5. Carteira hoje — todos os leads, sem filtro de período', ['Situação do acompanhamento', 'Alerta principal', 'Com este alerta (qualquer)', '', 'Observação']);
  for (var i = 0; i < SITUACOES.length; i++) {
    var r = P_SEC5_ROW0 + i;
    sh.getRange(r, 1).setFormula('=Listas!L' + (2 + i));
    sh.getRange(r, 2).setFormula('=COUNTIF(' + lr_('AH') + ',$A' + r + ')');
    sh.getRange(r, 3).setFormula('=COUNTIF(' + lr_('AI') + ',"*"&$A' + r + '&"*")');
  }
  sh.getRange('E46').setValue('Alerta principal = o mais urgente de cada lead; a coluna ao lado também conta leads em que ele aparece como pendência secundária.');
  sh.getRange('A54').setValue('Leads com pendência de preenchimento');
  sh.getRange('B54').setFormula('=SUMPRODUCT((' + lr_('A') + '<>"")*(' + lr_('AJ') + '<>"OK"))');
  corpo(46, 54); sh.getRange('B46:B54').setFontWeight('bold');

  // 6
  secao(56, '6. Funil por etapa — leads encaminhados no período', ['Etapa atual', 'Leads', '% do total', '', '']);
  for (var j = 0; j < ETAPAS.length; j++) {
    var rr = P_SEC6_ROW0 + j;
    sh.getRange(rr, 1).setFormula('=Listas!A' + (2 + j));
    sh.getRange(rr, 2).setFormula('=COUNTIFS(' + P_BASE + ',' + lr_('M') + ',$A' + rr + ')');
    sh.getRange(rr, 3).setFormula('=IF($B$10=0,"—",B' + rr + '/$B$10)').setNumberFormat('0.0%');
  }
  corpo(58, 69); sh.getRange('B58:B69').setFontWeight('bold');

  // destaques: números que exigem ação
  var vermelho = function (a1) {
    return SpreadsheetApp.newConditionalFormatRule().setRanges([sh.getRange(a1)]).whenNumberGreaterThan(0)
      .setBackground('#f4cccc').setFontColor('#990000').build();
  };
  sh.setConditionalFormatRules([vermelho('B14'), vermelho('B15'), vermelho('B16'), vermelho('B17'), vermelho('B54'),
    vermelho('B46'), vermelho('B47'), vermelho('B48'), vermelho('B49'), vermelho('B50')]);
  sh.setFrozenRows(0);
  sh.setTabColor('#cc0000');
}

/* ---------- Como usar ---------- */
function montarAjuda_(sh) {
  sh.clear(); sh.setHiddenGridlines(true); sh.setColumnWidth(1, 900);
  var t = [
    ['COMO USAR ESTA PLANILHA', 'h'],
    ['Quem faz o quê', 's'],
    ['Bruno: cadastra o lead na aba Leads (colunas azuis, A a L). O ID e o horário de encaminhamento são preenchidos sozinhos. Acompanha tudo pela aba Painel do Bruno e pela coluna SITUAÇÃO DO ACOMPANHAMENTO.', ''],
    ['Pedro: registra cada contato na aba Histórico de contatos (uma linha por interação) e atualiza as colunas verdes da aba Leads (resumo, proposta, fechamento, motivo da perda).', ''],
    ['Regra de ouro: toda tentativa ou conversa vira uma linha nova no Histórico. Nunca apague nem sobrescreva linhas antigas.', ''],
    ['Tentativa x contato efetivo', 's'],
    ['Tentativa sem resposta: ligou, mandou mensagem e o cliente não respondeu. Conta como execução do atendimento, mas NÃO como contato.', ''],
    ['Contato efetivo: o cliente respondeu ou conversou. Quem define é o campo Resultado (a aba Listas, colunas G e H, diz qual resultado é qual).', ''],
    ['Importante: os registros mostram que o atendimento foi executado e no prazo; não provam a qualidade da conversa. A etapa "Em atendimento" sozinha não prova nada.', ''],
    ['Campos automáticos (não digitar)', 's'],
    ['1ª tentativa, 1º contato efetivo, última interação e resultado do último contato vêm do Histórico. Etapa e próxima ação da aba Leads são atualizadas quando a interação do Histórico informa "Nova etapa" / "Próxima ação" (só se for a interação mais recente do lead).', ''],
    ['Alertas (do mais para o menos urgente)', 's'],
    ['1 Primeiro contato atrasado: sem tentativa e o prazo em horas úteis venceu.', ''],
    ['2 Proposta sem acompanhamento: proposta enviada, prazo de retorno vencido, sem interação depois do envio e sem retorno futuro agendado.', ''],
    ['3 Retorno atrasado: a data da próxima ação passou e não houve interação desde então.', ''],
    ['4 Sem próxima ação: lead aberto, já contatado, sem ação e data futura definidas.', ''],
    ['5 Sem atualização: dias úteis sem interação acima do limite e sem retorno futuro válido.', ''],
    ['Também: Novo, dentro do prazo / Em dia / Encerrado (venda concluída ou perdido). Se o lead tem várias pendências, todas aparecem em "Todos os alertas" e a mais urgente vira a situação principal.', ''],
    ['Retorno futuro agendado (próxima ação + data futura) é respeitado: não gera "Sem atualização".', ''],
    ['Decisões de regra a confirmar', 's'],
    ['Feriados NÃO estão incluídos: cadastre-os em Configurações (coluna E) para que não contem como dia útil.', ''],
    ['"Sem resposta após tentativas" e "Atendimento pausado" são tratados como leads ABERTOS (não são perdidos): geram alerta se ficarem sem próxima ação e data. Marque "Perdido" + motivo para encerrar de vez.', ''],
    ['Atendimento pausado: justificativa = campo Resumo; data de revisão = Data e hora da próxima ação. Se faltar qualquer um, aparece em Pendência de preenchimento.', ''],
    ['Proposta enviada: o alerta usa a data de envio. Sem data, usa a data de entrada na etapa e avisa a pendência.', ''],
    ['Dicas', 's'],
    ['Para ordenar pelo mais urgente: filtro da coluna "Prioridade (1 = mais urgente)" (crescente). Atalho para inserir data e hora: Ctrl+Alt+Shift+; (ponto e vírgula).', ''],
    ['Colunas em cinza e as auxiliares (ocultas) têm fórmulas: não digite nelas. Para mais de 1000 leads, ajuste LN em Formulas.gs e rode "Montar / atualizar planilha".', '']
  ];
  t.forEach(function (l, i) {
    var c = sh.getRange(i + 1, 1); c.setValue(l[0]).setWrap(true).setVerticalAlignment('top');
    if (l[1] === 'h') c.setFontSize(16).setFontWeight('bold');
    if (l[1] === 's') c.setFontWeight('bold').setBackground('#d9e2f3').setFontSize(11);
  });
  sh.setTabColor('#999999');
}

/* ====================== AUTOMAÇÕES ====================== */

function instalarAutomacoes() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'aoEditar') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('aoEditar').forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet()).onEdit().create();
  SpreadsheetApp.getUi().alert('Automações ativadas.\n\n• Novo lead: gera ID, horário de encaminhamento, responsável e etapa "Novo lead".\n• Nova interação no Histórico: gera ID, horário e responsável, e atualiza etapa / próxima ação do lead.\n• Mudança de etapa: registra "Etapa desde".');
}

function aoEditar(e) {
  if (!e || !e.range) return;
  var nome = e.range.getSheet().getName();
  var lock = LockService.getDocumentLock();
  lock.waitLock(20000);
  try {
    if (nome === NOMES.leads) editouLeads_(e);
    else if (nome === NOMES.hist) editouHistorico_(e);
  } finally { lock.releaseLock(); }
}

function proximoId_(chave, prefixo, largura, existentes) {
  var props = PropertiesService.getDocumentProperties();
  var n = Number(props.getProperty(chave) || 0);
  existentes.forEach(function (v) { var m = String(v[0]).match(/(\d+)$/); if (m) n = Math.max(n, Number(m[1])); });
  return {
    proximo: function () { n++; var s = String(n); while (s.length < largura) s = '0' + s; return prefixo + s; },
    salvar: function () { props.setProperty(chave, String(n)); }
  };
}

function respPadrao_() {
  var v = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMES.cfg).getRange('B9').getValue();
  return v || 'Pedro Ciceroni';
}

function editouLeads_(e) {
  var sh = e.range.getSheet();
  var r1 = Math.max(e.range.getRow(), L1), r2 = Math.min(e.range.getLastRow(), LN);
  if (r2 < r1) return;
  var c1 = e.range.getColumn(), c2 = e.range.getLastColumn();
  var n = r2 - r1 + 1, agora = new Date();
  var ids = sh.getRange(r1, 1, n, 1).getValues();
  var enc = sh.getRange(r1, 2, n, 1).getValues();
  var nomes = sh.getRange(r1, 3, n, 2).getValues();            // C:D
  var resp = sh.getRange(r1, COL.resp, n, 1).getValues();
  var etapa = sh.getRange(r1, COL.etapa, n, 1).getValues();
  var desde = sh.getRange(r1, COL.etapaDesde, n, 1).getValues();
  var todosIds = sh.getRange(L1, 1, LN - L1 + 1, 1).getValues();
  var ger = proximoId_('ultimoLead', 'L-', 4, todosIds);
  var mudou = false;
  for (var i = 0; i < n; i++) {
    var temDados = nomes[i][0] !== '' || nomes[i][1] !== '';
    if (ids[i][0] === '' && temDados) {
      ids[i][0] = ger.proximo();
      if (enc[i][0] === '') enc[i][0] = agora;
      if (resp[i][0] === '') resp[i][0] = respPadrao_();
      if (etapa[i][0] === '') etapa[i][0] = 'Novo lead';
      desde[i][0] = enc[i][0] instanceof Date ? enc[i][0] : agora;
      mudou = true;
    } else if (ids[i][0] !== '' && c1 <= COL.etapa && c2 >= COL.etapa) {
      desde[i][0] = etapa[i][0] === '' ? '' : agora;       // etapa editada à mão
      mudou = true;
    }
  }
  if (!mudou) return;
  sh.getRange(r1, 1, n, 1).setValues(ids);
  sh.getRange(r1, 2, n, 1).setValues(enc);
  sh.getRange(r1, COL.resp, n, 1).setValues(resp);
  sh.getRange(r1, COL.etapa, n, 1).setValues(etapa);
  sh.getRange(r1, COL.etapaDesde, n, 1).setValues(desde);
  ger.salvar();
}

function editouHistorico_(e) {
  var sh = e.range.getSheet();
  var r1 = Math.max(e.range.getRow(), H1), r2 = Math.min(e.range.getLastRow(), HN);
  if (r2 < r1) return;
  var c1 = e.range.getColumn(), c2 = e.range.getLastColumn();
  var n = r2 - r1 + 1, agora = new Date();
  var idsI = sh.getRange(r1, 1, n, 1).getValues();
  var lead = sh.getRange(r1, 2, n, 1).getValues();
  var data = sh.getRange(r1, 3, n, 1).getValues();
  var resp = sh.getRange(r1, 4, n, 1).getValues();
  var campos = sh.getRange(r1, 9, n, 3).getValues();            // I:K
  var todos = sh.getRange(H1, 1, HN - H1 + 1, 3).getValues();   // A:C
  var ger = proximoId_('ultimaInteracao', 'I-', 5, todos.map(function (x) { return [x[0]]; }));
  var propagar = [];
  var mudou = false;
  for (var i = 0; i < n; i++) {
    if (lead[i][0] === '') continue;
    var nova = false;
    if (idsI[i][0] === '') {
      idsI[i][0] = ger.proximo(); nova = true;
      if (data[i][0] === '') data[i][0] = agora;
      if (resp[i][0] === '') resp[i][0] = respPadrao_();
      mudou = true;
    }
    if (nova || (c1 <= 11 && c2 >= 9)) propagar.push({ lead: String(lead[i][0]), data: data[i][0], etapa: campos[i][0], acao: campos[i][1], dtAcao: campos[i][2] });
  }
  if (mudou) {
    sh.getRange(r1, 1, n, 1).setValues(idsI);
    sh.getRange(r1, 3, n, 1).setValues(data);
    sh.getRange(r1, 4, n, 1).setValues(resp);
    ger.salvar();
  }
  if (!propagar.length) return;

  // data da interação mais recente de cada lead
  var maisRecente = {};
  todos = sh.getRange(H1, 2, HN - H1 + 1, 2).getValues();       // B:C
  todos.forEach(function (x) {
    if (x[0] === '' || !(x[1] instanceof Date)) return;
    var t = x[1].getTime();
    if (!(x[0] in maisRecente) || t > maisRecente[x[0]]) maisRecente[x[0]] = t;
  });
  var L = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOMES.leads);
  var colIds = L.getRange(L1, 1, LN - L1 + 1, 1).getValues();
  propagar.forEach(function (p) {
    if (!(p.data instanceof Date) || p.data.getTime() < maisRecente[p.lead]) return;   // só a interação mais recente atualiza o lead
    for (var k = 0; k < colIds.length; k++) {
      if (String(colIds[k][0]) !== p.lead) continue;
      var linha = L1 + k;
      if (p.etapa !== '') {
        var atual = L.getRange(linha, COL.etapa).getValue();
        if (atual !== p.etapa) { L.getRange(linha, COL.etapa).setValue(p.etapa); L.getRange(linha, COL.etapaDesde).setValue(p.data); }
      }
      if (p.acao !== '') L.getRange(linha, 19).setValue(p.acao);        // S
      if (p.dtAcao !== '') L.getRange(linha, 20).setValue(p.dtAcao);    // T
      break;
    }
  });
}
