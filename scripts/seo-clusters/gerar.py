#!/usr/bin/env python3
"""Gera as páginas de cluster de SEO local em terreno-curitiba-e-regiao/terrenos/.

Fonte única dos dados: o array PROD embutido em terreno-curitiba-e-regiao/index.html.
Estrutura (cabeçalho, menu, rodapé, modal de contato) é clonada de um artigo existente,
para as páginas novas acompanharem qualquer ajuste global do layout.

Uso (da raiz do repositório):  python3 scripts/seo-clusters/gerar.py
Idempotente: reescreve as páginas a cada execução. Veja docs/seo-clusters.md.
"""
import html
import json
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "terreno-curitiba-e-regiao")
ROOT = os.path.normpath(ROOT)
SITE = "https://terrenoscuritibaeregiao.com.br"
TEMPLATE = os.path.join(ROOT, "conteudos", "terreno-em-condominio-fechado-vale-a-pena", "index.html")
ATUALIZADO_ISO = "2026-10-01"
ATUALIZADO_TXT = "outubro de 2026"
ATUALIZADO_CURTO = "1 de out. de 2026"

esc = html.escape


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


# ---------------------------------------------------------------- dados
def load_prod():
    src = read(os.path.join(ROOT, "index.html"))
    m = re.search(r"var PROD=(\[.*?\]);", src, re.S)
    if not m:
        sys.exit("PROD não encontrado em index.html")
    return json.loads(m.group(1))


def num(s):
    """'1.631,85' -> 1631.85"""
    return float(s.replace(".", "").replace(",", ".")) if s else None


def brl(v, dec=False):
    s = f"{v:,.2f}" if dec else f"{v:,.0f}"
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")


PROD = load_prod()
BY_SLUG = {e["slug"]: e for e in PROD}


def is_terreno(e):
    t = e["tipo"].lower()
    return not (t.startswith("apartamentos") or "casas" in t)


def preco_txt(e):
    return e["precoDisp"] if e["preco"] else "Sob consulta"


def entrada_txt(e):
    return "R$ " + e["entrada"] if e["entrada"] else "—"


def parcela_txt(e):
    return "R$ " + e["parcela"] + "/mês" if e["parcela"] else "—"


# ---------------------------------------------------------------- clusters
FAQ_BASE = [
    ("O financiamento é feito por banco?",
     "Nos empreendimentos com parcelamento direto, o pagamento é feito em parcelas mensais combinadas com o "
     "empreendimento, sem financiamento bancário. Há análise de crédito, e a aprovação não é garantida."),
    ("As parcelas mudam ao longo do contrato?",
     "As parcelas são reajustadas uma vez por ano pelo IPCA, conforme o contrato. Por isso, o valor da primeira "
     "parcela não é o valor das parcelas finais."),
    ("Posso antecipar parcelas ou quitar antes do prazo?",
     "Sim. Ao antecipar parcelas ou quitar o saldo, há abatimento proporcional dos juros futuros."),
    ("Os valores desta página podem mudar?",
     "Podem. Preço, entrada, parcela e disponibilidade são informados pelo empreendimento (EVEX Imóveis) e estão "
     "sujeitos a alteração. Confirme as condições atualizadas com um corretor antes de decidir."),
]

ECOVILLE_II_NOTA = (
    "Ecoville II: entrada e parcela correspondem aos lotes promocionais (a partir de R$ 149.900). "
    "O lote padrão custa R$ 168.300, com entrada de R$ 6.732 e parcela de R$ 1.548,72."
)

ART = {
    "custos": ("/conteudos/custos-que-vao-alem-do-preco-do-terreno/", "Custos que vão além do preço do terreno"),
    "docs": ("/conteudos/documentos-para-verificar-antes-da-compra/", "Documentos para verificar antes da compra"),
    "zoneamento": ("/conteudos/como-consultar-o-zoneamento-de-um-lote/", "Como consultar o zoneamento de um lote"),
    "analisar": ("/conteudos/o-que-analisar-antes-de-comprar-um-terreno/", "O que analisar antes de comprar um terreno"),
    "findireto": ("/conteudos/financiamento-direto-de-terreno-como-funciona/", "Financiamento direto de terreno: como funciona"),
    "atd": ("/conteudos/vale-a-pena-comprar-terreno-em-almirante-tamandare/", "Vale a pena comprar terreno em Almirante Tamandaré?"),
    "infra": ("/conteudos/obras-de-infraestrutura-nas-ruas-de-almirante-tamandare/", "Obras de infraestrutura nas ruas de Almirante Tamandaré"),
    "curitiba": ("/conteudos/vale-a-pena-comprar-terreno-em-curitiba/", "Vale a pena comprar terreno em Curitiba?"),
    "araucaria": ("/conteudos/terrenos-em-araucaria-o-que-saber-antes-de-comprar/", "Terrenos em Araucária: o que saber antes de comprar"),
    "sjp": ("/conteudos/terrenos-em-sao-jose-dos-pinhais-bairros-precos-e-como-comprar/", "Terrenos em São José dos Pinhais: bairros, preços e como comprar"),
    "condominio": ("/conteudos/terreno-em-condominio-fechado-vale-a-pena/", "Terreno em condomínio fechado vale a pena?"),
}

CLUSTERS = [
    {
        "slug": "entrada-ate-10-mil",
        "short": "Entrada de até R$ 10 mil",
        "desc_card": "Empreendimentos em que a entrada informada não passa de R$ 10 mil.",
        "title": "Terrenos com entrada de até R$ 10 mil na região de Curitiba",
        "h1": "Terrenos com entrada de até R$ 10 mil na região de Curitiba",
        "meta": "Terrenos com entrada de até R$ 10 mil em Almirante Tamandaré: veja preço, entrada e parcela de cada empreendimento e compare antes de falar com um corretor.",
        "filter": lambda e: bool(e["entrada"]) and num(e["entrada"]) <= 10000,
        "sort": lambda e: num(e["entrada"]),
        "lead": ("A entrada costuma ser o primeiro obstáculo de quem quer comprar um terreno. Na nossa seleção, "
                 "{n} empreendimentos têm entrada informada de até R$ 10 mil, o que equivale a cerca de 4% a 5% do preço do lote. "
                 "Todos ficam em Almirante Tamandaré, na Região Metropolitana de Curitiba."),
        "sections": [
            ("O que a entrada baixa não mostra",
             ["<p>Uma entrada pequena facilita o começo, mas o que pesa no orçamento ao longo dos anos é a <strong>parcela mensal</strong>. "
              "Compare sempre as duas: a entrada e a parcela. As parcelas são reajustadas uma vez por ano pelo IPCA, conforme o contrato.</p>",
              "<p>Fora o terreno, há custos como ITBI, escritura e registro. Veja o que entra na conta em "
              "<a href=\"{custos_u}\" data-seo=\"artigo\">{custos_t}</a>.</p>"]),
            ("Como escolher entre as opções",
             ["<ul class=\"checks\">"
              "<li><strong>Parcela que cabe no mês:</strong> use o <a href=\"/#orcamento\" data-seo=\"home\">assistente de orçamento</a> ou o "
              "<a href=\"/financiamento/\" data-seo=\"financiamento\">simulador de financiamento</a>.</li>"
              "<li><strong>Tipo de terreno:</strong> condomínio fechado tem taxa condominial e regras próprias; veja "
              "<a href=\"{condominio_u}\" data-seo=\"artigo\">quando vale a pena</a>.</li>"
              "<li><strong>Metragem e bairro:</strong> compare na tabela acima e abra a página de cada empreendimento.</li></ul>"]),
        ],
        "faq": [
            ("A entrada de até R$ 10 mil vale para todos os lotes?",
             "Os valores desta página são os informados por empreendimento. Cada um tem lotes e condições próprias, e as "
             "condições podem variar por lote. Confirme com um corretor qual lote se enquadra."),
        ],
        "related": ["ate-200-mil-almirante-tamandare", "financiamento-direto", "lamenha-grande"],
        "articles": ["findireto", "custos"],
    },
    {
        "slug": "ate-200-mil-almirante-tamandare",
        "short": "Até R$ 200 mil em Almirante Tamandaré",
        "desc_card": "Terrenos em Almirante Tamandaré com preço a partir de até R$ 200 mil.",
        "title": "Terrenos até R$ 200 mil em Almirante Tamandaré",
        "h1": "Terrenos até R$ 200 mil em Almirante Tamandaré",
        "meta": "Terrenos em Almirante Tamandaré com preço de até R$ 200 mil: compare empreendimentos, metragem, entrada e parcela e veja qual combina com o seu orçamento.",
        "filter": lambda e: e["cid"] == "almirante-tamandare" and bool(e["preco"]) and e["preco"] <= 200000,
        "sort": lambda e: e["preco"],
        "lead": ("Almirante Tamandaré concentra a maior parte dos terrenos acessíveis da nossa seleção. {n} empreendimentos "
                 "têm preço a partir de até R$ 200 mil, com entrada e parcela informadas. O Condomínio Bela Vista, a partir de R$ 205.000, "
                 "fica um pouco acima desse teto e também vale a comparação."),
        "sections": [
            ("O que muda de um empreendimento para outro",
             ["<p>Preço parecido não significa produto igual. Três dos quatro empreendimentos são condomínios fechados; o Residencial "
              "Jardim Mazza é um residencial unifamiliar em série, com lotes a partir de 158,2 m². A metragem mínima também varia: "
              "o Valparaíso começa em 140 m²; os Ecoville, em 180 m².</p>",
              "<p>Para entender a cidade antes de decidir, leia <a href=\"{atd_u}\" data-seo=\"artigo\">{atd_t}</a> e "
              "<a href=\"{infra_u}\" data-seo=\"artigo\">{infra_t}</a>.</p>"]),
            ("Antes de fechar, confira",
             ["<ul class=\"checks\">"
              "<li>Matrícula e documentação do lote — veja <a href=\"{docs_u}\" data-seo=\"artigo\">os documentos para verificar</a>.</li>"
              "<li>Zoneamento e o que é permitido construir — <a href=\"{zoneamento_u}\" data-seo=\"artigo\">como consultar</a>.</li>"
              "<li>Custos além do preço: ITBI, escritura e registro — <a href=\"{custos_u}\" data-seo=\"artigo\">entenda</a>.</li></ul>"]),
        ],
        "faq": [
            ("O preço inclui escritura e registro?",
             "Os valores informados são os do terreno. ITBI, escritura e registro são custos à parte, como em qualquer compra "
             "de imóvel. Peça ao corretor a estimativa completa."),
        ],
        "related": ["entrada-ate-10-mil", "lamenha-grande", "140-m2-almirante-tamandare"],
        "articles": ["atd", "custos"],
    },
    {
        "slug": "lamenha-grande",
        "short": "Terrenos em Lamenha Grande",
        "desc_card": "Empreendimentos no bairro Lamenha Grande, em Almirante Tamandaré.",
        "title": "Terrenos em Lamenha Grande, Almirante Tamandaré",
        "h1": "Terrenos em Lamenha Grande, Almirante Tamandaré",
        "meta": "Terrenos em Lamenha Grande (Almirante Tamandaré): Ecoville I e II, Valparaíso e Jardim Mazza. Compare preço, metragem, entrada e parcela.",
        "filter": lambda e: "lamenha grande" in e["bairro"].lower(),
        "sort": lambda e: e["preco"],
        "lead": ("Lamenha Grande, em Almirante Tamandaré, reúne {n} dos empreendimentos que comercializamos: Condomínio Ecoville I, "
                 "Condomínio Ecoville II, Condomínio Valparaíso e Residencial Jardim Mazza. Todos têm preço, entrada e parcela informados."),
        "sections": [
            ("Como comparar quatro empreendimentos no mesmo bairro",
             ["<p>Estando no mesmo bairro, a diferença está no produto: <strong>tipo</strong> (três condomínios fechados e um residencial "
              "unifamiliar em série), <strong>metragem</strong> (de 140 m² no Valparaíso a 302 m²), <strong>preço</strong> e "
              "<strong>parcela</strong>. A tabela acima reúne os números; as páginas de cada empreendimento trazem a simulação completa.</p>",
              "<p>Se ainda está em dúvida entre condomínio e loteamento, veja "
              "<a href=\"{condominio_u}\" data-seo=\"artigo\">{condominio_t}</a>.</p>"]),
            ("Visite antes de decidir",
             ["<p>Fotos e tabelas ajudam, mas a decisão de compra de um terreno pede ver o lote, o entorno e o acesso. "
              "Peça a um corretor para agendar uma visita aos empreendimentos que entraram na sua lista.</p>"]),
        ],
        "faq": [
            ("Qual dos empreendimentos de Lamenha Grande tem a menor entrada?",
             "Pelos valores informados, o Condomínio Ecoville II tem a menor entrada (R$ 7.495 nos lotes promocionais; "
             "R$ 6.732 no lote padrão). Compare também a parcela, que é o que pesa no orçamento mensal."),
        ],
        "related": ["entrada-ate-10-mil", "ate-200-mil-almirante-tamandare", "140-m2-almirante-tamandare"],
        "articles": ["atd", "condominio"],
    },
    {
        "slug": "140-m2-almirante-tamandare",
        "short": "Terrenos de 140 m² em Almirante Tamandaré",
        "desc_card": "Lotes a partir de 140 m² em Almirante Tamandaré.",
        "title": "Terrenos de 140 m² em Almirante Tamandaré",
        "h1": "Terrenos de 140 m² em Almirante Tamandaré",
        "meta": "Terrenos a partir de 140 m² em Almirante Tamandaré: Bela Vista, Valparaíso e Jardim Veneza. Veja metragem, preço, entrada e parcela.",
        "filter": lambda e: e["cid"] == "almirante-tamandare" and e["slug"] in ("bela-vista", "valparaiso", "jardim-veneza"),
        "sort": lambda e: (e["preco"] is None, e["preco"] or 0),
        "lead": ("Se você procura um lote menor, com 140 m², {n} empreendimentos de Almirante Tamandaré têm lotes nessa metragem: "
                 "Condomínio Bela Vista (140 m² a 270 m²), Condomínio Valparaíso (140 m² a 302 m²) e Residencial Jardim Veneza "
                 "(a partir de 140 m²). Em São José dos Pinhais, o Residencial Cortona tem lotes de 128 m²."),
        "sections": [
            ("O que dá para construir em 140 m²",
             ["<p>Isso depende do <strong>zoneamento</strong>, dos recuos e do regulamento do condomínio, e não só da metragem. "
              "Antes de escolher o lote, consulte a taxa de ocupação e os recuos. Veja "
              "<a href=\"{zoneamento_u}\" data-seo=\"artigo\">como consultar o zoneamento</a>; as páginas dos empreendimentos têm uma "
              "calculadora de potencial construtivo.</p>"]),
            ("Lote menor, parcela menor?",
             ["<p>O preço varia com a metragem, mas isso depende do lote e do empreendimento. Confira na tabela o preço "
              "<em>a partir de</em> e peça ao corretor os lotes de 140 m² disponíveis, pois nem todos os lotes estão sempre em estoque.</p>"]),
        ],
        "faq": [
            ("O Jardim Veneza tem preço publicado?",
             "Não. O preço do Residencial Jardim Veneza é informado sob consulta. Fale com um corretor para receber as condições atuais."),
        ],
        "related": ["ate-200-mil-almirante-tamandare", "lamenha-grande", "entrada-ate-10-mil"],
        "articles": ["zoneamento", "analisar"],
    },
    {
        "slug": "financiamento-direto",
        "short": "Financiamento direto (sem banco)",
        "desc_card": "Empreendimentos com entrada e parcela publicadas no parcelamento direto.",
        "title": "Terrenos com financiamento direto, sem banco, na região de Curitiba",
        "h1": "Terrenos com financiamento direto (sem banco) na região de Curitiba",
        "meta": "Terrenos com parcelamento direto, sem financiamento bancário, em Almirante Tamandaré, São José dos Pinhais e Curitiba. Veja entrada, parcela e como funciona.",
        "filter": lambda e: bool(e["parcela"]),
        "sort": lambda e: num(e["parcela"]),
        "lead": ("No parcelamento direto, você paga o terreno em parcelas mensais combinadas com o empreendimento, sem financiamento "
                 "bancário. Reunimos {n} empreendimentos da região com entrada e parcela publicadas, em Almirante Tamandaré, "
                 "São José dos Pinhais e Curitiba."),
        "sections": [
            ("Como funciona o parcelamento direto",
             ["<ul class=\"checks\">"
              "<li><strong>Sem banco:</strong> o pagamento é feito em parcelas mensais, direto com o empreendimento.</li>"
              "<li><strong>Análise de crédito:</strong> há análise, e a aprovação não é garantida.</li>"
              "<li><strong>Reajuste anual pelo IPCA:</strong> as parcelas são atualizadas uma vez por ano, conforme o contrato.</li>"
              "<li><strong>Quitação antecipada:</strong> ao antecipar parcelas ou quitar o saldo, há abatimento proporcional dos juros futuros.</li></ul>",
              "<p>Para o passo a passo completo, leia <a href=\"{findireto_u}\" data-seo=\"artigo\">{findireto_t}</a>. "
              "Para testar valores, use o <a href=\"/financiamento/\" data-seo=\"financiamento\">simulador de financiamento</a>.</p>"]),
            ("Prazo, juros e entrada variam por empreendimento",
             ["<p>Não existe uma regra única: cada empreendimento define entrada, prazo, juros e parcela. "
              "Por isso, compare a <strong>parcela</strong> e o <strong>valor total pago</strong>, não só a entrada. "
              "No Condomínio Ecoville I, por exemplo, uma entrada ampliada de R$ 40 mil reduz a parcela de R$ 1.656,39 para "
              "R$ 1.342,54 em 312 meses (0,9% a.m.).</p>"]),
        ],
        "faq": [],
        "related": ["entrada-ate-10-mil", "ate-200-mil-almirante-tamandare", "perto-de-curitiba"],
        "articles": ["findireto", "custos"],
    },
    {
        "slug": "perto-de-curitiba",
        "short": "Terrenos perto de Curitiba",
        "desc_card": "Opções em Curitiba, Almirante Tamandaré, São José dos Pinhais e Araucária.",
        "title": "Terrenos perto de Curitiba: opções por cidade",
        "h1": "Terrenos perto de Curitiba: opções por cidade",
        "meta": "Terrenos em Curitiba e nas cidades vizinhas (Almirante Tamandaré, São José dos Pinhais e Araucária): compare empreendimentos, preços e metragens.",
        "filter": is_terreno,
        "sort": lambda e: (e["cid"], e["preco"] is None, e["preco"] or 0),
        "by_city": True,
        "lead": ("Almirante Tamandaré, São José dos Pinhais e Araucária fazem parte da Região Metropolitana de Curitiba e fazem divisa com a "
                 "capital. Reunimos aqui os {n} empreendimentos de terrenos que comercializamos, agrupados por cidade."),
        "sections": [
            ("Como escolher a cidade",
             ["<p>Preço, perfil de bairro e acesso variam de cidade para cidade. Para um panorama de cada uma, leia "
              "<a href=\"{atd_u}\" data-seo=\"artigo\">Almirante Tamandaré</a>, "
              "<a href=\"{sjp_u}\" data-seo=\"artigo\">São José dos Pinhais</a>, "
              "<a href=\"{curitiba_u}\" data-seo=\"artigo\">Curitiba</a> e "
              "<a href=\"{araucaria_u}\" data-seo=\"artigo\">Araucária</a>.</p>",
              "<p>Quer comparar lado a lado? Use a página <a href=\"/comparar/\" data-seo=\"comparar\">comparar empreendimentos</a>.</p>"]),
            ("Atenção ao que significa “sob consulta”",
             ["<p>Quando o preço aparece como sob consulta, o empreendimento não tem valor publicado no momento. "
              "Isso não quer dizer que esteja indisponível: peça as condições atuais a um corretor.</p>"]),
        ],
        "faq": [],
        "related": ["financiamento-direto", "ate-200-mil-almirante-tamandare", "entrada-ate-10-mil"],
        "articles": ["analisar", "docs"],
    },
]
BY_CLUSTER = {c["slug"]: c for c in CLUSTERS}


def members(c):
    items = [e for e in PROD if c["filter"](e)]
    items.sort(key=c["sort"])
    return items


# ---------------------------------------------------------------- HTML
def links_fmt(text):
    d = {}
    for k, (u, t) in ART.items():
        d[k + "_u"] = u
        d[k + "_t"] = t
    out = text
    for k, v in d.items():
        out = out.replace("{" + k + "}", v)
    return out


def emp_link(e, cl):
    return f'<a href="{e["url"]}" data-seo="cluster_{cl}">{esc(e["nome"])}</a>'


def table_html(items, cl, by_city=False):
    head = ("<thead><tr><th>Empreendimento</th><th>Metragem</th><th>Preço a partir de</th>"
            "<th>Entrada</th><th>Parcela/mês</th></tr></thead>")
    rows = []
    last = None
    for e in items:
        if by_city and e["cidade"] != last:
            rows.append(f'<tr><th colspan="5" style="background:var(--bg-cream);color:var(--petrol)">{esc(e["cidade"])}</th></tr>')
            last = e["cidade"]
        rows.append(
            f'<tr><td>{emp_link(e, cl)}<br><small style="color:var(--muted)">{esc(e["bairro"])}</small></td><td>{esc(e["metragem"])}</td>'
            f'<td>{esc(preco_txt(e))}</td><td>{esc(entrada_txt(e))}</td><td>{esc(parcela_txt(e)).replace("/mês", "")}</td></tr>')
    return f'<div class="table-scroll"><table class="data data--cluster">{head}<tbody>{"".join(rows)}</tbody></table></div>'


def cards_html(items, cl):
    out = []
    for e in items:
        extra = ""
        if e["entrada"] and e["parcela"]:
            extra = (f'<br><span style="color:var(--muted);font-size:.85rem">Entrada de R$ {e["entrada"]} · '
                     f'parcelas de R$ {e["parcela"]}/mês</span>')
        preco = f'A partir de {esc(e["precoDisp"])}' if e["preco"] else "Preço sob consulta"
        out.append(
            f'<a class="post post--emp" href="{e["url"]}" data-seo="cluster_{cl}"><div class="post__body">'
            f'<span class="post__cat">{esc(e["bairro"])} · {esc(e["cidade"])}</span>'
            f'<h3>{esc(e["nome"])}</h3>'
            f'<p class="post__excerpt">{esc(e["tipo"])} · {esc(e["metragem"])}</p>'
            f'<p style="margin:.2rem 0 .6rem"><strong>{preco}</strong>{extra}</p>'
            f'<span class="post__more">Ver empreendimento →</span></div></a>')
    return f'<div class="cluster-cards">{"".join(out)}</div>'


def related_html(c):
    chips = "".join(
        f'<a class="chip" href="/terrenos/{r}/" data-seo="relacionado">{esc(BY_CLUSTER[r]["short"])}</a>'
        for r in c["related"])
    chips += '<a class="chip" href="/terrenos/" data-seo="hub">Todos os perfis</a>'
    arts = "".join(
        f'<li><a href="{ART[a][0]}" data-seo="artigo">{esc(ART[a][1])}</a></li>' for a in c["articles"])
    return (f'<h2>Veja também</h2><div class="cluster-links">{chips}</div>'
            f'<h3>Para ler antes de decidir</h3><ul class="refs">{arts}</ul>')


def faq_items(c):
    return list(c["faq"]) + (FAQ_BASE if c["slug"] != "perto-de-curitiba" else FAQ_BASE[3:])


def build_cluster_main(c, items):
    n = len(items)
    cl = c["slug"]
    lead = links_fmt(c["lead"]).format(n=n) if "{n}" in c["lead"] else links_fmt(c["lead"])
    body = [
        '<span class="eyebrow">Terrenos por perfil</span>',
        f'<h1>{esc(c["h1"])}</h1>',
        f'<div class="article__meta"><span class="cat">Seleção EVEX Imóveis</span>'
        f'<span>Terrenos Curitiba e Região</span><span>Atualizado em {ATUALIZADO_CURTO}</span></div>',
        f'<p>{lead}</p>',
        f'<h2>{"Empreendimentos por cidade" if c.get("by_city") else "Comparativo rápido"}</h2>',
        table_html(items, cl, c.get("by_city")),
    ]
    notas = []
    if any(e["slug"] == "ecoville-ii" for e in items) and any(e["entrada"] for e in items):
        notas.append(ECOVILLE_II_NOTA)
    notas.append("Condições informadas pelo empreendimento (EVEX Imóveis). Valores e prazos sujeitos a alteração, ao reajuste anual "
                 "pelo IPCA e à análise de crédito e disponibilidade.")
    body.append('<p class="source">' + " ".join(f"<span>{esc(n_)}</span>" for n_ in notas)
                + f' <b>Atualizado em {ATUALIZADO_TXT}.</b></p>')
    if not c.get("by_city"):
        body.append("<h2>Conheça cada empreendimento</h2>")
        body.append(cards_html(items, cl))
    for h2, paras in c["sections"]:
        body.append(f"<h2>{esc(h2)}</h2>")
        body.extend(links_fmt(p) for p in paras)
    body.append("<h2>Perguntas frequentes</h2>")
    for q, a in faq_items(c):
        body.append(f"<h3>{esc(q)}</h3><p>{esc(a)}</p>")
    body.append(
        '<section class="callout" id="receber-opcoes" style="margin-top:2.4rem">'
        f'<strong>Quer receber só as opções que combinam com este perfil?</strong>'
        '<p style="margin:.4rem 0 .8rem">Diga a cidade, o orçamento e a parcela que cabe no seu mês. Retornamos com as opções, '
        'sem promessa de aprovação de crédito ou de valorização.</p>'
        f'<button class="btn btn--primary" data-open-form data-emp="" data-lead-tool="cluster_{cl}">Quero receber as opções deste perfil</button> '
        '<a class="btn btn--outline" href="/comparar/" data-seo="comparar">Comparar empreendimentos</a></section>')
    body.append(related_html(c))
    body.append('<h2>Fontes consultadas</h2><ul class="refs"><li>Condições informadas pelos empreendimentos, via EVEX Imóveis '
                f'(atualizado em {ATUALIZADO_TXT}).</li><li><a href="/fontes-e-metodologia/">Fontes e metodologia do portal</a>.</li></ul>')
    return ('<main id="main">\n\n<article class="article"><div class="wrap" style="padding-top:8px">\n  '
            + "\n  ".join(body) + "\n</div></article>\n\n</main>")


def build_hub_main():
    cards = []
    for c in CLUSTERS:
        n = len(members(c))
        cards.append(
            f'<a class="post post--emp" href="/terrenos/{c["slug"]}/" data-seo="hub_card"><div class="post__body">'
            f'<span class="post__cat">{n} empreendimento{"s" if n != 1 else ""}</span>'
            f'<h3>{esc(c["short"])}</h3><p class="post__excerpt">{esc(c["desc_card"])}</p>'
            f'<span class="post__more">Ver terrenos →</span></div></a>')
    body = [
        '<span class="eyebrow">Terrenos por perfil</span>',
        "<h1>Terrenos na região de Curitiba por entrada, preço, bairro e metragem</h1>",
        f'<div class="article__meta"><span class="cat">Seleção EVEX Imóveis</span>'
        f'<span>Terrenos Curitiba e Região</span><span>Atualizado em {ATUALIZADO_CURTO}</span></div>',
        "<p>Cada pessoa começa a procura por um critério diferente: quanto dá de entrada, quanto pode pagar por mês, em qual "
        "bairro ou que tamanho de lote. Escolha abaixo o perfil mais parecido com o seu e veja os empreendimentos que se encaixam, "
        "com preço, entrada e parcela informados.</p>",
        '<div class="cluster-cards">' + "".join(cards) + "</div>",
        '<p class="source"><b>Condições informadas pelos empreendimentos (EVEX Imóveis).</b> Valores e prazos sujeitos a alteração, '
        f'ao reajuste anual pelo IPCA e à análise de crédito e disponibilidade. <b>Atualizado em {ATUALIZADO_TXT}.</b></p>',
        '<section class="callout" id="receber-opcoes" style="margin-top:2.4rem">'
        "<strong>Não sabe por onde começar?</strong>"
        '<p style="margin:.4rem 0 .8rem">Diga a cidade, o orçamento e a parcela que cabe no seu mês, e receba as opções que combinam com você.</p>'
        '<button class="btn btn--primary" data-open-form data-emp="" data-lead-tool="cluster_hub">Quero receber as opções</button> '
        '<a class="btn btn--outline" href="/#orcamento" data-seo="home">Escolher pela parcela mensal</a></section>',
        "<h2>Para ler antes de decidir</h2><ul class=\"refs\">"
        + "".join(f'<li><a href="{ART[a][0]}" data-seo="artigo">{esc(ART[a][1])}</a></li>'
                  for a in ("analisar", "findireto", "custos", "docs")) + "</ul>",
    ]
    return ('<main id="main">\n\n<article class="article"><div class="wrap" style="padding-top:8px">\n  '
            + "\n  ".join(body) + "\n</div></article>\n\n</main>")


def jsonld(tpl_head, page_url, title, desc, crumbs, items, faq):
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', tpl_head, re.S)
    graph = json.loads(m.group(1))["@graph"]
    base = [g for g in graph if g["@type"] in ("WebSite", "RealEstateAgent")]
    page = {"@type": "CollectionPage", "@id": page_url + "#page", "url": page_url, "name": title, "description": desc,
            "inLanguage": "pt-BR", "dateModified": ATUALIZADO_ISO,
            "isPartOf": {"@id": SITE + "/#website"}, "publisher": {"@id": SITE + "/#org"}}
    if items:
        page["mainEntity"] = {
            "@type": "ItemList", "numberOfItems": len(items),
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": e["nome"], "url": SITE + e["url"]}
                                for i, e in enumerate(items)]}
    out = base + [page]
    if faq:
        out.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
    crumb_list = []
    for i, (name, url) in enumerate(crumbs):
        li = {"@type": "ListItem", "position": i + 1, "name": name}
        if url:
            li["item"] = SITE + url
        crumb_list.append(li)
    out.append({"@type": "BreadcrumbList", "itemListElement": crumb_list})
    return json.dumps({"@context": "https://schema.org", "@graph": out}, ensure_ascii=False)


def render(tpl, slug_path, title, desc, main, crumbs, items, faq):
    url = SITE + slug_path
    full_title = f"{title} | Terrenos Curitiba e Região"
    if len(full_title) > 70:  # evita título cortado no Google
        full_title = title
    h = tpl
    # cabeçalho: title/description/canonical/og/twitter
    h = re.sub(r"<title>.*?</title>", lambda m: f"<title>{esc(full_title, False)}</title>", h, count=1, flags=re.S)
    h = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + esc(desc) + m.group(2), h, count=1)
    h = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), h, count=1)
    h = re.sub(r'(<meta property="og:type" content=")article(")', r"\1website\2", h, count=1)
    h = re.sub(r'(<meta property="og:title" content=")[^"]*(")', lambda m: m.group(1) + esc(full_title) + m.group(2), h, count=1)
    h = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + esc(desc) + m.group(2), h, count=1)
    h = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), h, count=1)
    h = re.sub(r'(<meta name="twitter:title" content=")[^"]*(")', lambda m: m.group(1) + esc(full_title) + m.group(2), h, count=1)
    h = re.sub(r'(<meta name="twitter:description" content=")[^"]*(")', lambda m: m.group(1) + esc(desc) + m.group(2), h, count=1)
    ld = jsonld(tpl, url, title, desc, crumbs, items, faq)
    h = re.sub(r'(<script type="application/ld\+json">).*?(</script>)', lambda m: m.group(1) + ld + m.group(2), h, count=1, flags=re.S)
    # menu: nenhum item do topo é a página atual
    h = h.replace('<a href="/conteudos/" aria-current="page">Conteúdos</a>', '<a href="/conteudos/">Conteúdos</a>')
    # breadcrumbs
    lis = []
    for i, (name, u) in enumerate(crumbs):
        if i == len(crumbs) - 1:
            lis.append(f'<li aria-current="page">{esc(name)}</li>')
        else:
            lis.append(f'<li><a href="{u}">{esc(name)}</a></li>')
    crumbs_html = ('<nav class="crumbs" aria-label="Você está aqui"><div class="wrap"><ol>' + "".join(lis)
                   + "</ol></div></nav>")
    h, n = re.subn(r'<nav class="crumbs".*?</nav>\s*<main id="main">.*?</main>',
                   lambda m: crumbs_html + main, h, count=1, flags=re.S)
    if n != 1:
        sys.exit("estrutura crumbs/main não encontrada no template")
    return h


def main():
    tpl = read(TEMPLATE)
    if 'href="/financiamento/">Financiamento</a></li>' not in tpl:
        sys.exit("template inesperado")
    pages = []
    hub_desc = ("Terrenos na região de Curitiba por perfil: entrada até R$ 10 mil, preço até R$ 200 mil, bairro, metragem e "
                "financiamento direto. Compare e escolha.")
    pages.append(("terrenos/index.html", render(
        tpl, "/terrenos/", "Terrenos por perfil: entrada, preço, bairro e metragem", hub_desc, build_hub_main(),
        [("Início", "/"), ("Terrenos por perfil", None)], [], [])))
    for c in CLUSTERS:
        items = members(c)
        if not items:
            sys.exit(f"cluster vazio: {c['slug']}")
        pages.append((f"terrenos/{c['slug']}/index.html", render(
            tpl, f"/terrenos/{c['slug']}/", c["title"], c["meta"], build_cluster_main(c, items),
            [("Início", "/"), ("Terrenos por perfil", "/terrenos/"), (c["h1"], None)], items, faq_items(c))))
    for rel, text in pages:
        write(os.path.join(ROOT, rel), text)
        print("ok", rel, len(text))
    # lista de membros por empreendimento (usada pelos blocos "Veja também")
    mapa = {}
    for c in CLUSTERS:
        for e in members(c):
            mapa.setdefault(e["slug"], []).append(c["slug"])
    print(json.dumps(mapa, ensure_ascii=False))


if __name__ == "__main__":
    main()
