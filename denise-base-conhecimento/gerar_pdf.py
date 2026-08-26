# -*- coding: utf-8 -*-
"""
Gera a Base de Conhecimento (Perguntas e Respostas) do Studio Denise de Paula
em PDF, para ser usada pela IA de atendimento automático do Kommo.

Conteúdo extraído do site oficial micropigmentacaodenisedp.com.br
(páginas: home, /sobrancelhas, /denise-de-paula, /contato).
Itens não encontrados no site estão marcados como [CONFIRMAR COM A DENISE].
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle,
    KeepTogether, PageBreak
)

OUT = "/home/user/comercial/denise-base-conhecimento/base-conhecimento-denise-de-paula-kommo.pdf"

# ---- Paleta ----
ROSE = colors.HexColor("#8C5A6E")
DARK = colors.HexColor("#2E2A2C")
GREY = colors.HexColor("#6B6467")
LINE = colors.HexColor("#E3D9DD")
BG_Q = colors.HexColor("#F6EFF2")
BG_WARN = colors.HexColor("#FBF3E7")

styles = getSampleStyleSheet()


def S(name, **kw):
    return ParagraphStyle(name, parent=styles["Normal"], **kw)


st_title = S("t", fontName="Helvetica-Bold", fontSize=24, leading=28, textColor=ROSE, alignment=TA_CENTER)
st_sub = S("s", fontName="Helvetica", fontSize=11, leading=15, textColor=GREY, alignment=TA_CENTER)
st_h2 = S("h2", fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=colors.white)
st_q = S("q", fontName="Helvetica-Bold", fontSize=11.5, leading=15, textColor=DARK)
st_a = S("a", fontName="Helvetica", fontSize=10.5, leading=15, textColor=colors.HexColor("#332F31"))
st_body = S("b", fontName="Helvetica", fontSize=10.5, leading=15, textColor=colors.HexColor("#332F31"))
st_warn = S("w", fontName="Helvetica", fontSize=10, leading=14, textColor=colors.HexColor("#5c4415"))
st_foot = S("f", fontName="Helvetica", fontSize=8.5, leading=11, textColor=GREY, alignment=TA_CENTER)


def section_header(title):
    t = Table([[Paragraph(title, st_h2)]], colWidths=[170 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ROSE),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


def qa(q, a):
    qcell = Table([[Paragraph("P: " + q, st_q)]], colWidths=[170 * mm])
    qcell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BG_Q),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("LINEBELOW", (0, 0), (-1, -1), 2, ROSE),
    ]))
    if isinstance(a, str):
        a = [a]
    acells = [Paragraph("R: " + a[0], st_a)]
    for extra in a[1:]:
        acells.append(Spacer(1, 3))
        acells.append(Paragraph(extra, st_a))
    abox = Table([[acells]], colWidths=[170 * mm])
    abox.setStyle(TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("LINEBELOW", (0, 0), (-1, -1), 0.6, LINE),
    ]))
    return KeepTogether([qcell, abox, Spacer(1, 7)])


def confirmar(texto):
    row = Table(
        [[Paragraph("&rarr; " + texto, st_a),
          Paragraph('<font color="#B23B3B"><b>[CONFIRMAR COM A DENISE]</b></font>', st_a)]],
        colWidths=[118 * mm, 52 * mm])
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return KeepTogether([row])


story = []

# ---------------- CABEÇALHO ----------------
story.append(Spacer(1, 6))
story.append(Paragraph("Studio Denise de Paula", st_title))
story.append(Spacer(1, 2))
story.append(Paragraph("Micropigmentação Clássica e Realista &bull; Batel, Curitiba/PR", st_sub))
story.append(Spacer(1, 8))
story.append(Paragraph("BASE DE CONHECIMENTO PARA ATENDIMENTO AUTOMÁTICO (IA / KOMMO)",
                       S("cap", fontName="Helvetica-Bold", fontSize=11, textColor=DARK, alignment=TA_CENTER)))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=1, color=LINE))
story.append(Spacer(1, 8))

instr = (
    "<b>Instruções para a IA de atendimento:</b> use este documento como fonte oficial para "
    "responder as clientes pelo WhatsApp/chat. Responda sempre em português, de forma acolhedora, "
    "curta e objetiva. Não invente preços, horários nem promessas de resultado. Sempre que a cliente "
    "quiser valores, agendamento ou tiver caso específico (gravidez, doença de pele, diabetes, uso de "
    "medicamentos), oriente a agendar a <b>avaliação gratuita</b> ou falar direto no WhatsApp "
    "<b>(41) 97401-6961</b>. Itens marcados como [CONFIRMAR COM A DENISE] ainda precisam ser preenchidos."
)
box = Table([[Paragraph(instr, st_warn)]], colWidths=[170 * mm])
box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), BG_WARN),
    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#E5C89A")),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
]))
story.append(box)
story.append(Spacer(1, 12))

# ================= 1. SOBRE =================
story.append(section_header("1. Sobre o Studio e a Denise de Paula"))
story.append(Spacer(1, 6))
story += [
    qa("Quem é a Denise de Paula?",
       "A Denise de Paula é micropigmentadora com mais de 30 anos de experiência (mais de 35 anos de atuação "
       "na área da beleza) e mais de 10.000 clientes atendidas. É referência e pioneira no Brasil na técnica "
       "fio a fio, reconhecida pelo trabalho ultra-natural e realista. O studio fica no bairro Batel, em Curitiba/PR."),
    qa("O que é o Studio Denise de Paula?",
       "É um studio especializado em micropigmentação de sobrancelhas, olhos e lábios, além de remoção de "
       "micropigmentação. Cada procedimento começa com um mapeamento facial completo, analisando proporções, "
       "estrutura óssea e expressão natural do rosto, para um resultado único e harmonioso."),
    qa("Por que escolher a Denise de Paula?",
       "São mais de 30 anos de experiência, milhares de clientes atendidas e reconhecimento como referência "
       "na técnica fio a fio no Brasil. O foco é o resultado natural, feito sob medida para cada rosto, com "
       "pigmentos de alta qualidade e atendimento acolhedor do início ao fim."),
]

# ================= 2. LOCALIZAÇÃO E CONTATO =================
story.append(section_header("2. Localização, Contato e Horários"))
story.append(Spacer(1, 6))
story += [
    qa("Onde fica o studio? Qual o endereço?",
       "O studio fica no bairro Batel, em Curitiba/PR. O endereço completo é informado no agendamento."),
]
story.append(confirmar("Endereço completo (rua, número), ponto de referência e estacionamento:"))
story += [
    qa("Qual o WhatsApp / telefone para contato?",
       "O contato é pelo WhatsApp (41) 97401-6961. Por ele você tira dúvidas, recebe orientações e agenda "
       "sua avaliação ou procedimento."),
    qa("Qual o horário de atendimento?",
       "O atendimento é de segunda a sexta, das 9h às 19h, e aos sábados, das 9h às 12h — sempre com hora "
       "marcada. Para verificar disponibilidade e agendar, chame no WhatsApp (41) 97401-6961."),
]
story += [
    qa("Vocês atendem clientes de fora de Curitiba?",
       "Sim. O studio recebe clientes de Curitiba, região metropolitana e de outras cidades. O ideal é "
       "agendar com antecedência pelo WhatsApp (41) 97401-6961 para organizar a avaliação e o procedimento na "
       "mesma viagem, quando possível."),
]

# ================= 3. SERVIÇOS =================
story.append(section_header("3. Serviços e Técnicas"))
story.append(Spacer(1, 6))
story += [
    qa("Quais serviços vocês oferecem?",
       "Micropigmentação de sobrancelhas, de olhos (delineado/contorno) e de lábios, além de remoção de "
       "micropigmentação antiga. Tudo com técnicas naturais e personalizadas para cada cliente."),
    qa("O que é micropigmentação?",
       "É um procedimento semipermanente que implanta pigmentos de alta qualidade nas camadas superficiais "
       "da pele, simulando fios naturais ou criando um efeito de sombra suave. O resultado valoriza o rosto de "
       "forma natural e dura, em média, de 1 a 3 anos."),
    qa("Quais as técnicas de sobrancelha e qual é a ideal para mim?",
       ["A técnica ideal depende do seu tipo de pele, da quantidade de pelos e da sua preferência estética. "
        "As principais são:",
        "&bull; <b>Fio a fio:</b> desenha os fios um a um, resultado ultra-natural. Ideal para peles secas a normais.",
        "&bull; <b>Esfumado / sombreado:</b> efeito de sombra (aspecto de sobrancelha maquiada). Costuma durar "
        "mais em peles oleosas.",
        "&bull; <b>Híbrido:</b> combina fio a fio + esfumado, para um resultado natural com mais definição.",
        "Na avaliação gratuita a Denise indica a melhor técnica para o seu caso."]),
    qa("Vocês fazem micropigmentação labial?",
       "Sim. A micropigmentação labial realça o contorno e dá cor aos lábios, com resultado natural. É indicada "
       "para quem quer os lábios com aparência mais viva e definida. A técnica e o tom ideais são definidos na avaliação."),
    qa("Vocês fazem micropigmentação nos olhos / delineado?",
       "Sim. Fazemos o delineado / contorno dos olhos, que realça o olhar de forma natural ou mais marcante, "
       "conforme a sua preferência, definida na avaliação."),
    qa("Vocês fazem remoção de micropigmentação?",
       "Sim. O studio faz remoção de micropigmentação antiga ou malfeita, incluindo técnicas de remoção e "
       "laser. O plano de remoção (número de sessões e intervalo) é definido após avaliar o seu caso presencialmente."),
]

# ================= 4. AVALIAÇÃO E AGENDAMENTO =================
story.append(section_header("4. Avaliação e Agendamento"))
story.append(Spacer(1, 6))
story += [
    qa("Como funciona a avaliação?",
       "A avaliação é presencial e gratuita. Nela a Denise analisa o seu rosto e a sua pele, indica a técnica "
       "ideal e apresenta o investimento sem surpresas. Só depois disso o procedimento é agendado."),
    qa("A avaliação é paga?",
       "Não. A avaliação presencial é gratuita e sem compromisso."),
    qa("Como faço para agendar?",
       "É só chamar no WhatsApp (41) 97401-6961. A equipe verifica a agenda e marca a sua avaliação ou "
       "procedimento no melhor horário para você."),
    qa("Preciso fazer a avaliação antes do procedimento?",
       "Sim, sempre. A avaliação garante a indicação correta da técnica, do formato e do tom, e permite tirar "
       "todas as dúvidas antes de começar. É o que assegura um resultado natural e seguro."),
]

# ================= 5. DOR E CONFORTO =================
story.append(section_header("5. Dor, Conforto e Duração do Procedimento"))
story.append(Spacer(1, 6))
story += [
    qa("A micropigmentação dói?",
       "É bem tranquilo. Antes do procedimento aplicamos anestésicos tópicos de alta qualidade. A maioria das "
       "clientes descreve a sensação como um arranhadinho leve ou uma leve pressão, muito mais confortável do "
       "que imaginam. A região da sobrancelha é menos sensível do que a dos lábios."),
    qa("Usa anestesia?",
       "Sim, anestésico tópico (em pomada/gel) de alta qualidade, aplicado na pele antes e durante o "
       "procedimento para o seu conforto."),
    qa("Quanto tempo dura o procedimento?",
       "Em média 1 hora por procedimento, já incluindo o mapeamento e o desenho feitos antes da aplicação."),
]

# ================= 6. CICATRIZAÇÃO E CUIDADOS =================
story.append(section_header("6. Cicatrização e Cuidados (pós-procedimento)"))
story.append(Spacer(1, 6))
story += [
    qa("Como é a cicatrização? Fica muito escuro no começo?",
       "A cicatrização completa leva de 28 a 40 dias. Na primeira semana a sobrancelha fica mais escura e pode "
       "descamar levemente — isso é totalmente normal. Entre o 10º e o 30º dia a cor suaviza, e o resultado "
       "final aparece depois desse período."),
    qa("Vou poder trabalhar / sair normalmente depois?",
       "Sim. É um procedimento com recuperação tranquila. Nos primeiros dias a cor fica mais intensa e há "
       "leve descamação, mas você mantém a rotina normal seguindo os cuidados orientados (evitar molhar em "
       "excesso, sol direto, piscina/mar e coçar a região nos primeiros dias)."),
    qa("Quais cuidados devo ter depois?",
       ["Nos primeiros dias, siga as orientações entregues pelo studio. De modo geral: manter a região limpa e "
        "seca, evitar sol direto, piscina, mar, sauna e suor intenso, não coçar nem retirar as casquinhas, e "
        "usar apenas o produto indicado.",
        "As orientações completas de pós-procedimento são entregues no dia do atendimento."]),
    qa("Posso usar maquiagem, ácido ou fazer as sobrancelhas depois?",
       "Na região micropigmentada, evite maquiagem e produtos com ácido/retinol durante a cicatrização (cerca "
       "de 30 dias). Depois de cicatrizado, ácidos e retinol na região aceleram o desbotamento do pigmento, "
       "então devem ser usados com cuidado. Orientações detalhadas são dadas na avaliação."),
]

# ================= 7. DURABILIDADE E RETOQUE =================
story.append(section_header("7. Durabilidade e Retoque"))
story.append(Spacer(1, 6))
story += [
    qa("Quanto tempo dura a micropigmentação?",
       "Em média de 1 a 3 anos. O pigmento é formulado para se degradar de forma gradual e homogênea, sem "
       "manchas. A duração varia conforme o tipo de pele, a exposição ao sol, o uso de ácidos/retinol e os "
       "cuidados pós-procedimento."),
    qa("Por que em algumas pessoas dura menos?",
       "Peles oleosas tendem a degradar o pigmento mais rápido. Sol em excesso, uso de ácidos e retinol na "
       "região e falta de cuidado também reduzem a duração."),
    qa("Preciso fazer retoque?",
       "Sim. Retoques periódicos (em geral anuais) mantêm o resultado sempre bonito e natural. Há também o "
       "retoque de finalização, feito algumas semanas após o primeiro procedimento, para ajustar cor e "
       "cobertura depois da cicatrização."),
    qa("O retoque está incluso no valor?",
       "A política de retoque (retoque de finalização incluso e prazos) é informada na avaliação."),
]
story.append(confirmar("Retoque de finalização incluso? Em quantos dias? Valor do retoque anual:"))

# ================= 8. INDICAÇÕES E CONTRAINDICAÇÕES =================
story.append(section_header("8. Indicações e Contraindicações"))
story.append(Spacer(1, 6))
story += [
    qa("A micropigmentação serve para quem tem pouco pelo ou falhas?",
       "Sim. É uma ótima solução para quem tem falhas, sobrancelhas ralas ou pouco pelo, corrigindo o formato e "
       "devolvendo simetria ao rosto de forma natural."),
    qa("Quem tem alopecia, hipotireoidismo ou fez quimioterapia pode fazer?",
       "A micropigmentação de sobrancelhas costuma ser uma solução segura e natural para restaurar a simetria "
       "facial nesses casos, incluindo alopecia, hipotireoidismo e pós-quimioterapia. Cada caso é avaliado "
       "individualmente na avaliação presencial."),
    qa("Grávidas ou lactantes podem fazer?",
       "Por segurança, casos de gestação e amamentação precisam ser avaliados individualmente. Oriente a "
       "cliente a informar isso na avaliação ou no WhatsApp (41) 97401-6961 para uma orientação personalizada."),
    qa("Diabéticos, alérgicos ou quem usa algum medicamento podem fazer?",
       "Depende de cada caso. Condições como diabetes, alergias, problemas de pele na região ou uso de certos "
       "medicamentos precisam ser avaliadas antes. O ideal é relatar tudo na avaliação gratuita, para uma "
       "orientação segura e personalizada."),
    qa("Existe alguma contraindicação?",
       "As contraindicações são verificadas caso a caso, na avaliação presencial. Por isso é importante "
       "informar o seu histórico de saúde (gestação, amamentação, diabetes, alergias, condições de pele e "
       "medicamentos em uso) para uma orientação segura e personalizada."),
]

# ================= 9. VALORES E PAGAMENTO =================
story.append(section_header("9. Valores e Pagamento"))
story.append(Spacer(1, 6))
story += [
    qa("Quanto custa? Qual o valor da micropigmentação?",
       "Os valores são informados diretamente pelo nosso atendimento. Chame no WhatsApp (41) 97401-6961 que a "
       "equipe passa os valores e as condições para você; a técnica ideal é confirmada na avaliação presencial "
       "gratuita."),
    qa("Vocês parcelam? Quais as formas de pagamento?",
       "As formas de pagamento e as condições são informadas pelo atendimento no WhatsApp (41) 97401-6961."),
]

# ================= ANEXO: DADOS A CONFIRMAR =================
story.append(PageBreak())
story.append(section_header("Anexo: Dados que faltam confirmar com a Denise"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "Os itens abaixo não estavam disponíveis no site e precisam ser preenchidos para a IA responder com "
    "precisão. Assim que você me passar, atualizo o PDF:", st_body))
story.append(Spacer(1, 8))
faltam = [
    "Endereço completo (rua, número, complemento), ponto de referência e estacionamento.",
    "Política de retoque: retoque de finalização incluso? Em quantos dias? Valor do retoque anual.",
    "Existe blog com posts? Se sim, enviar títulos + textos para incluir na base.",
    "Redes sociais e link de agendamento online (se houver).",
]
for item in faltam:
    story.append(Paragraph("&bull; " + item, st_body))
    story.append(Spacer(1, 4))

story.append(Spacer(1, 14))
story.append(HRFlowable(width="100%", thickness=0.6, color=LINE))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "Documento gerado como base de conhecimento para atendimento automático (IA Kommo) do Studio Denise de "
    "Paula. Conteúdo extraído do site oficial micropigmentacaodenisedp.com.br. Valores, horários e casos "
    "clínicos devem ser sempre confirmados na avaliação gratuita ou pelo WhatsApp (41) 97401-6961.", st_foot))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawString(20 * mm, 12 * mm, "Studio Denise de Paula — Base de conhecimento (IA / Kommo)")
    canvas.drawRightString(190 * mm, 12 * mm, "Pág. %d" % doc.page)
    canvas.setStrokeColor(LINE)
    canvas.line(20 * mm, 15 * mm, 190 * mm, 15 * mm)
    canvas.restoreState()


doc = SimpleDocTemplate(OUT, pagesize=A4,
                        leftMargin=20 * mm, rightMargin=20 * mm,
                        topMargin=16 * mm, bottomMargin=20 * mm,
                        title="Base de Conhecimento - Studio Denise de Paula (IA Kommo)",
                        author="Studio Denise de Paula")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF gerado:", OUT)
