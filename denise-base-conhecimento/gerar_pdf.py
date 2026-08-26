# -*- coding: utf-8 -*-
"""
Base de Conhecimento (Perguntas e Respostas) — Studio Denise de Paula.
PDF para a IA de atendimento automático do Kommo.

Fonte: repositório oficial do site (Brunoportoseus/studio) — index.html
(FAQ oficial com 51 perguntas + páginas) e blog.html (7 artigos completos).
As perguntas e respostas do FAQ e os artigos são carregados de conteudo.json.
Horários informados pela própria Denise (não constam no site).
"""

import os, json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle, KeepTogether
)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "base-conhecimento-denise-de-paula-kommo.pdf")
DATA = json.load(open(os.path.join(HERE, "conteudo.json"), encoding="utf-8"))

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
st_art_t = S("at", fontName="Helvetica-Bold", fontSize=12.5, leading=16, textColor=ROSE)
st_art_c = S("ac", fontName="Helvetica-Bold", fontSize=8.5, leading=11, textColor=GREY)
st_art_h = S("ah", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=DARK)
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
    return [Spacer(1, 4), t, Spacer(1, 6)]


def qa(q, a):
    qcell = Table([[Paragraph("P: " + q, st_q)]], colWidths=[170 * mm])
    qcell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BG_Q),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("LINEBELOW", (0, 0), (-1, -1), 2, ROSE),
    ]))
    abox = Table([[Paragraph("R: " + a, st_a)]], colWidths=[170 * mm])
    abox.setStyle(TableStyle([
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("LINEBELOW", (0, 0), (-1, -1), 0.6, LINE),
    ]))
    return KeepTogether([qcell, abox, Spacer(1, 7)])


def article(art):
    flow = [Paragraph(art["cat"].upper(), st_art_c), Spacer(1, 2), Paragraph(art["title"], st_art_t), Spacer(1, 5)]
    for p in art["paras"]:
        short = len(p) < 60 and not p.rstrip().endswith((".", "!", "?", ":"))
        flow.append(Paragraph(p, st_art_h if short else st_body))
        flow.append(Spacer(1, 4 if short else 5))
    flow.append(Spacer(1, 2))
    flow.append(HRFlowable(width="100%", thickness=0.6, color=LINE))
    flow.append(Spacer(1, 8))
    return KeepTogether(flow) if len(art["paras"]) <= 6 else flow


story = []

# ---------------- CABEÇALHO ----------------
story.append(Spacer(1, 6))
story.append(Paragraph("Studio Denise de Paula", st_title))
story.append(Spacer(1, 2))
story.append(Paragraph("Micropigmentação em Curitiba &bull; Batel &bull; Pioneira no Brasil", st_sub))
story.append(Spacer(1, 8))
story.append(Paragraph("BASE DE CONHECIMENTO PARA ATENDIMENTO AUTOMÁTICO (IA / KOMMO)",
                       S("cap", fontName="Helvetica-Bold", fontSize=11, textColor=DARK, alignment=TA_CENTER)))
story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=1, color=LINE))
story.append(Spacer(1, 8))

instr = (
    "<b>Instruções para a IA de atendimento:</b> use este documento como fonte oficial para responder as "
    "clientes pelo WhatsApp/chat. Responda sempre em português, de forma acolhedora, curta e objetiva. "
    "<b>Nunca informe preços</b> — quando a cliente perguntar de valores, direcione para o atendimento no "
    "WhatsApp <b>(41) 97401-6961</b> e ofereça a <b>avaliação gratuita</b>. Casos de saúde (gravidez, "
    "amamentação, diabetes, herpes, alergias, uso de ácidos/medicamentos) devem sempre ser avaliados "
    "presencialmente. O conteúdo abaixo vem do site oficial micropigmentacaodenisedp.com.br."
)
box = Table([[Paragraph(instr, st_warn)]], colWidths=[170 * mm])
box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), BG_WARN),
    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#E5C89A")),
    ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
]))
story.append(box)
story.append(Spacer(1, 10))

# ===== 1. SOBRE =====
story += section_header("1. Sobre a Denise e o Studio")
for q, a in [
    ("Quem é a Denise de Paula?",
     "Denise de Paula atua em micropigmentação há mais de 35 anos, com formação em técnicas avançadas de "
     "sobrancelhas, lábios e delineado de olhos. É pioneira da micropigmentação no Brasil, com mais de 10.000 "
     "clientes atendidas e trabalhos realizados no Brasil, na Argentina e em outros países. O studio fica no "
     "Batel, em Curitiba/PR, e é referência em resultado natural, seguro e personalizado."),
    ("O que torna o trabalho da Denise diferente?",
     "Cada atendimento começa com uma escuta cuidadosa — traços, estilo, tom de pele e expressão são "
     "respeitados antes de qualquer desenho. Nas palavras da Denise: “Minha missão não é mudar seu rosto — "
     "é revelar a melhor versão de você que sempre existiu.” O foco é o resultado natural e harmonioso, "
     "feito sob medida para cada rosto."),
    ("Quanta experiência a Denise tem?",
     "Mais de 35 anos de experiência, mais de 10.000 clientes atendidas e atendimentos em 3 países (Brasil, "
     "Argentina e outros). É reconhecida como pioneira da micropigmentação no Brasil."),
]:
    story.append(qa(q, a))

# ===== 2. LOCALIZAÇÃO, CONTATO E HORÁRIOS =====
story += section_header("2. Localização, Contato e Horários")
for q, a in [
    ("Onde fica o studio? Qual o endereço?",
     "O studio fica na Rua Buenos Aires, 457, no bairro Batel, em Curitiba/PR — CEP 80250-070. Agendamentos e "
     "dúvidas pelo WhatsApp (41) 97401-6961."),
    ("Qual o horário de atendimento?",
     "O atendimento é de segunda a sexta, das 9h às 19h, e aos sábados, das 9h às 12h — sempre com hora "
     "marcada. Para verificar disponibilidade, chame no WhatsApp (41) 97401-6961."),
    ("Qual o WhatsApp e o e-mail de contato?",
     "WhatsApp (41) 97401-6961 e e-mail contato@micropigmentacaodenisedp.com.br. Você também pode enviar "
     "mensagem pelo formulário do site."),
    ("Vocês atendem clientes de fora de Curitiba?",
     "Sim. O studio recebe clientes de Curitiba, da região metropolitana e de outras cidades e estados. O "
     "ideal é agendar com antecedência pelo WhatsApp (41) 97401-6961 para organizar avaliação e procedimento."),
]:
    story.append(qa(q, a))

# ===== 3. SERVIÇOS =====
story += section_header("3. Serviços Oferecidos")
for q, a in [
    ("Quais serviços vocês oferecem?",
     "Micropigmentação de sobrancelhas (fio a fio, sombreado ou híbrido), micropigmentação labial (aquarela, "
     "contorno ou efeito batom), delineado de olhos, combo sobrancelha + labial, correção/renovação de "
     "trabalhos anteriores (refazer sobrancelhas, lábios ou delineado) e remoção a laser de micropigmentação "
     "antiga. Todos com pigmentos de alta fixação e foco em resultado natural e duradouro."),
    ("O que é micropigmentação?",
     "É um procedimento semipermanente que implanta pigmentos de alta qualidade nas camadas superficiais da "
     "pele, simulando fios naturais ou criando um efeito de sombra suave. Diferente da tatuagem, o pigmento se "
     "degrada gradualmente e desaparece de forma natural ao longo de 1 a 3 anos."),
    ("Vocês fazem correção de trabalho feito por outra profissional?",
     "Sim. O studio faz correção e renovação (“refazer”) de sobrancelhas, lábios e delineado feitos "
     "anteriormente, além de remoção a laser quando necessário. Cada caso é avaliado presencialmente para "
     "definir a melhor solução."),
    ("O que é o combo sobrancelha + labial?",
     "É a transformação completa em uma só sessão: sobrancelhas e lábios redesenhados juntos. A indicação e o "
     "valor são definidos na avaliação gratuita."),
]:
    story.append(qa(q, a))

# ===== 4. AVALIAÇÃO, AGENDAMENTO E VALORES =====
story += section_header("4. Avaliação, Agendamento e Valores")
for q, a in [
    ("Como funciona a avaliação gratuita?",
     "A avaliação é presencial, gratuita e sem compromisso. Inclui análise facial e mapeamento do formato "
     "ideal, estudo de cor e técnica recomendada, explicação do procedimento passo a passo, esclarecimento de "
     "dúvidas e apresentação do investimento. Dura cerca de 30 a 40 minutos."),
    ("Como faço para agendar?",
     "Pelo WhatsApp (41) 97401-6961 ou pelo formulário do site. A equipe verifica a agenda e marca a sua "
     "avaliação ou procedimento no melhor horário para você."),
    ("Quanto tempo dura o procedimento?",
     "A consulta de avaliação dura cerca de 30 a 40 minutos. O procedimento completo — incluindo desenho, "
     "anestesia e aplicação — dura em média de 2h a 3h, conforme a técnica e a área tratada (a aplicação em si "
     "leva cerca de 1h a 1h30). Reserve o dia para aproveitar com tranquilidade."),
    ("Quanto custa? Qual o valor?",
     "Os valores são informados diretamente pelo nosso atendimento. Chame no WhatsApp (41) 97401-6961 que a "
     "equipe passa os valores e as condições; a técnica ideal e o investimento são confirmados na avaliação "
     "presencial gratuita, sem surpresas."),
    ("O retoque está incluso?",
     "O primeiro retoque (retoque de finalização) é feito entre 30 e 45 dias após o procedimento e está "
     "incluso — ele ajusta cor, simetria e cobertura após a cicatrização. Depois disso, recomendam-se retoques "
     "anuais de manutenção; a inclusão de retoques adicionais pode variar conforme o pacote, confirmado no "
     "atendimento."),
]:
    story.append(qa(q, a))

# ===== 5/6/7 do FAQ oficial (conteudo.json) =====
story += section_header("5. Micropigmentação de Sobrancelhas — Dúvidas")
for it in DATA["sobrancelhas"]:
    story.append(qa(it["q"], it["a"]))

story += section_header("6. Micropigmentação Labial — Dúvidas")
for it in DATA["labial"]:
    story.append(qa(it["q"], it["a"]))

story += section_header("7. Segurança, Saúde e Contraindicações")
for it in DATA["seguranca"]:
    story.append(qa(it["q"], it["a"]))

# ===== 8. BLOG =====
story += section_header("8. Artigos do Blog (conteúdo educativo)")
for art in DATA["artigos"]:
    flow = article(art)
    if isinstance(flow, list):
        story.extend(flow)
    else:
        story.append(flow)

# rodapé final
story.append(Spacer(1, 6))
story.append(HRFlowable(width="100%", thickness=0.6, color=LINE))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "Studio Denise de Paula &bull; Rua Buenos Aires, 457, Batel, Curitiba/PR (CEP 80250-070) &bull; "
    "WhatsApp (41) 97401-6961 &bull; contato@micropigmentacaodenisedp.com.br &bull; "
    "micropigmentacaodenisedp.com.br. Conteúdo oficial do site. Valores e casos de saúde são sempre "
    "confirmados na avaliação gratuita ou pelo atendimento.", st_foot))


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
                        leftMargin=20 * mm, rightMargin=20 * mm, topMargin=16 * mm, bottomMargin=20 * mm,
                        title="Base de Conhecimento - Studio Denise de Paula (IA Kommo)",
                        author="Studio Denise de Paula")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF gerado:", OUT)
