#!/usr/bin/env python3
"""Costura as páginas de cluster ao resto do site (idempotente; marcadores <!--seo:...-->).

- rodapé de todas as páginas: link "Terrenos por perfil"
- home: seção "Encontre pelo seu perfil" depois de #destaques
- páginas de cidade: bloco antes da faixa de CTA final
- páginas de empreendimento: bloco "Compare com outros terrenos" antes de #interesse
- sitemap.xml: URLs dos clusters
Uso: python3 scripts/seo-clusters/integrar.py (depois de gerar.py)
"""
import glob
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gerar  # noqa: E402

ROOT = gerar.ROOT
CL = gerar.BY_CLUSTER
FOOT_OLD = '<li><a href="/financiamento/">Financiamento</a></li>'
FOOT_NEW = FOOT_OLD + '<li><a href="/terrenos/">Terrenos por perfil</a></li>'


def rw(path, fn):
    with open(path, encoding="utf-8") as f:
        s = f.read()
    new = fn(s)
    if new != s:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new)
        return True
    return False


def chips(slugs, hub=True, where="bloco"):
    out = "".join(f'<a class="chip" href="/terrenos/{s}/" data-seo="{where}">{gerar.esc(CL[s]["short"])}</a>' for s in slugs)
    if hub:
        out += f'<a class="chip" href="/terrenos/" data-seo="{where}">Todos os perfis</a>'
    return out


def insert_once(s, marker, anchor, block, before=True):
    if f"<!--seo:{marker}-->" in s:
        s = re.sub(rf"<!--seo:{marker}-->.*?<!--/seo:{marker}-->", lambda m: block, s, count=1, flags=re.S)
        return s
    if s.count(anchor) != 1:
        raise SystemExit(f"âncora ({marker}) deve ocorrer 1x, achou {s.count(anchor)}")
    return s.replace(anchor, block + anchor if before else anchor + block)


def wrap(marker, inner):
    return f"<!--seo:{marker}-->{inner}<!--/seo:{marker}-->"


# 1) rodapé
n = 0
files = [p for p in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)
         if "/terrenos/" not in p.replace(os.sep, "/") and "/admin/" not in p.replace(os.sep, "/")]
for p in files:
    def f(s):
        if FOOT_OLD not in s or '/terrenos/">Terrenos por perfil' in s:
            return s
        return s.replace(FOOT_OLD, FOOT_NEW, 1)
    n += rw(p, f)
print("rodapé:", n)

# 2) home
HOME_CARDS = ["entrada-ate-10-mil", "ate-200-mil-almirante-tamandare", "lamenha-grande", "140-m2-almirante-tamandare",
              "financiamento-direto", "perto-de-curitiba"]
home_cards = "".join(
    f'<a class="post post--emp" href="/terrenos/{s}/" data-seo="home_perfil"><div class="post__body">'
    f'<h3>{gerar.esc(CL[s]["short"])}</h3><p class="post__excerpt">{gerar.esc(CL[s]["desc_card"])}</p>'
    f'<span class="post__more">Ver terrenos →</span></div></a>' for s in HOME_CARDS)
home_block = wrap("home", (
    '\n<section class="section section--soft" id="perfis"><div class="wrap">'
    '<div class="section-head center"><span class="eyebrow">Terrenos por perfil</span>'
    '<h2>Encontre pelo seu perfil</h2>'
    '<p>Procure pela entrada que cabe no bolso, pelo preço, pelo bairro ou pela metragem.</p></div>'
    f'<div class="post-grid">{home_cards}</div>'
    '<p class="center" style="margin-top:1.4rem"><a class="btn btn--outline" href="/terrenos/" data-seo="home_perfil">Ver todos os perfis</a></p>'
    '</div></section>\n'))
p = os.path.join(ROOT, "index.html")
def f(s):
    if "<!--seo:home-->" in s:
        return insert_once(s, "home", "", home_block)
    i = s.find('id="destaques"')
    j = s.find("</section>", i) + len("</section>")
    if i < 0 or j < len("</section>"):
        raise SystemExit("destaques não encontrado")
    return s[:j] + home_block + s[j:]
print("home:", rw(p, f))

# 3) cidades
CITY_SLUGS = {
    "almirante-tamandare": ["entrada-ate-10-mil", "ate-200-mil-almirante-tamandare", "lamenha-grande", "140-m2-almirante-tamandare",
                            "financiamento-direto", "perto-de-curitiba"],
    "sao-jose-dos-pinhais": ["financiamento-direto", "perto-de-curitiba"],
    "curitiba": ["financiamento-direto", "perto-de-curitiba"],
    "araucaria": ["perto-de-curitiba"],
    "campo-largo": ["perto-de-curitiba"],
    "fazenda-rio-grande": ["perto-de-curitiba"],
    "pinhais": ["perto-de-curitiba"],
    "piraquara": ["perto-de-curitiba"],
}
CITY_ANCHORS = ['<section class="section section--tight">\n  <div class="wrap"><div class="ctaband">',
                '<section class="section"><div class="wrap"><div class="ctaband">']


def city_anchor(s):
    found = [a for a in CITY_ANCHORS if s.count(a) == 1]
    if len(found) != 1:
        raise SystemExit("âncora da faixa de CTA não encontrada em página de cidade")
    return found[0]


for city, slugs in CITY_SLUGS.items():
    p = os.path.join(ROOT, city, "index.html")
    block = wrap("cidade", (
        '<section class="section section--tight"><div class="wrap">'
        '<h2>Encontre pelo seu perfil</h2>'
        '<p>Veja os terrenos da região organizados por entrada, preço, bairro e metragem.</p>'
        f'<div class="cluster-links">{chips(slugs, True, "cidade")}</div></div></section>\n\n'))
    print("cidade", city, rw(p, lambda s: insert_once(s, "cidade", "" if "<!--seo:cidade-->" in s else city_anchor(s), block)))

# 4) empreendimentos
mapa = {}
for c in gerar.CLUSTERS:
    for e in gerar.members(c):
        mapa.setdefault(e["slug"], []).append(c["slug"])
EMP_ANCHOR = '<section class="section" id="interesse">'
cnt = 0
for e in gerar.PROD:
    slugs = mapa.get(e["slug"])
    p = os.path.join(ROOT, e["cid"], e["slug"], "index.html")
    if not slugs:
        continue
    if not os.path.exists(p):
        raise SystemExit("página não encontrada: " + p)
    # "perto de Curitiba" é o cluster mais genérico: vai por último
    slugs = [s for s in slugs if s != "perto-de-curitiba"] + ["perto-de-curitiba"]
    block = wrap("emp", (
        '<section class="section section--tight"><div class="wrap">'
        '<h2>Compare com outros terrenos</h2>'
        f'<p>Veja outras opções com o mesmo perfil do {gerar.esc(e["nome"])}.</p>'
        f'<div class="cluster-links">{chips(slugs, True, "empreendimento")}</div></div></section>\n\n'))
    cnt += rw(p, lambda s: insert_once(s, "emp", EMP_ANCHOR, block))
print("empreendimentos:", cnt)

# 5) sitemap
sm = os.path.join(ROOT, "sitemap.xml")
urls = ["/terrenos/"] + [f"/terrenos/{c['slug']}/" for c in gerar.CLUSTERS]
def f(s):
    for u in urls:
        loc = f"<loc>{gerar.SITE}{u}</loc>"
        if loc in s:
            continue
        entry = (f"  <url><loc>{gerar.SITE}{u}</loc><lastmod>{gerar.ATUALIZADO_ISO}</lastmod>"
                 f"<changefreq>weekly</changefreq><priority>0.8</priority></url>\n")
        s = s.replace("</urlset>", entry + "</urlset>")
    return s
print("sitemap:", rw(sm, f))
