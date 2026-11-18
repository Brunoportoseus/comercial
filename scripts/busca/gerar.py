#!/usr/bin/env python3
"""Gera o índice da busca do site (lupa no cabeçalho) em assets/js/search-index.json.

Fontes:
  - array PROD da home (index.html): empreendimentos com cidade, bairro, tipo, metragem, preço, entrada e parcela;
  - <title> e <meta name="description"> de todas as páginas públicas (cidades, conteúdos, perfis, institucionais).
Páginas com noindex (admin, obrigado, 404) ficam fora.

Uso (da raiz do repositório):  python3 scripts/busca/gerar.py
Idempotente: reescreve o JSON a cada execução. Rode depois de criar páginas ou alterar o PROD.
Para o site de imóveis (mesma estrutura): SEO_ROOT=imoveis-curitiba-e-regiao SEO_BRAND="Imóveis Curitiba e Região" python3 scripts/busca/gerar.py
"""
import datetime
import html
import json
import os
import re
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..",
                                     os.environ.get("SEO_ROOT", "terreno-curitiba-e-regiao")))
BRAND = os.environ.get("SEO_BRAND", "Terrenos Curitiba e Região")
OUT = os.path.join(ROOT, "assets", "js", "search-index.json")

CIDADES = {
    "almirante-tamandare": "Almirante Tamandaré", "sao-jose-dos-pinhais": "São José dos Pinhais",
    "curitiba": "Curitiba", "araucaria": "Araucária", "campo-largo": "Campo Largo",
    "fazenda-rio-grande": "Fazenda Rio Grande", "pinhais": "Pinhais", "piraquara": "Piraquara",
    "quatro-barras": "Quatro Barras",
}
# Páginas que não entram na busca, mesmo indexáveis
IGNORAR = {"/obrigado/", "/404.html", "/admin/"}


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def meta(src, name):
    m = re.search(r'<meta\s+name="%s"\s+content="([^"]*)"' % re.escape(name), src)
    return html.unescape(m.group(1)).strip() if m else ""


def title_of(src):
    m = re.search(r"<title>([^<]*)</title>", src)
    t = html.unescape(m.group(1)).strip() if m else ""
    # tira o sufixo da marca e o complemento depois de " | "
    t = re.sub(r"\s*\|\s*" + re.escape(BRAND) + r"\s*$", "", t)
    return t.split(" | ")[0].strip()


def load_prod(src):
    m = re.search(r"var PROD=(\[.*?\]);", src, re.S)
    if not m:
        sys.exit("PROD não encontrado em index.html")
    return json.loads(m.group(1))


def clean(s):
    return re.sub(r"\s+", " ", s or "").strip()


def main():
    home = read(os.path.join(ROOT, "index.html"))
    prod = load_prod(home)
    by_url = {e["url"]: e for e in prod}
    itens = []
    vistos = set()

    # 1) Empreendimentos (dados do PROD: fonte única de preço/entrada/parcela)
    for e in prod:
        page = os.path.join(ROOT, e["url"].strip("/"), "index.html")
        if not os.path.exists(page):
            print("aviso: sem página para", e["url"], file=sys.stderr)
            continue
        desc = meta(read(page), "description")
        cond = []
        if e.get("entrada"):
            cond.append("Entrada R$ " + e["entrada"])
        if e.get("parcela"):
            cond.append("Parcela R$ " + e["parcela"] + "/mês")
        itens.append({
            "tipo": "empreendimento",
            "titulo": e["nome"],
            "url": e["url"],
            "sub": clean(e["cidade"] + (" · " + e["bairro"] if e["bairro"] and e["bairro"] != e["cidade"] else "")),
            "desc": clean(e["tipo"] + " · " + e["metragem"]),
            "preco": e["precoDisp"],
            "precoNum": e["preco"],
            "cond": " · ".join(cond),
            "kw": clean(" ".join([e["cidade"], e["bairro"], e["slug"].replace("-", " "), e["tipo"], e["metragem"], e["cid"].replace("-", " "), desc])),
        })
        vistos.add(e["url"])

    # 2) Demais páginas públicas
    for dirpath, _dirs, files in os.walk(ROOT):
        for fn in files:
            if not fn.endswith(".html"):
                continue
            path = os.path.join(dirpath, fn)
            rel = "/" + os.path.relpath(path, ROOT).replace(os.sep, "/")
            url = rel[:-len("index.html")] if rel.endswith("/index.html") else rel
            if url in vistos or url in IGNORAR or any(url.startswith(x) for x in IGNORAR):
                continue
            src = read(path)
            robots = meta(src, "robots")
            if "noindex" in robots or not re.search(r"<title>", src):
                continue
            if "nav-toggle" not in src:   # não é página do site (ex.: verificação do Google)
                continue
            titulo, desc = title_of(src), meta(src, "description")
            parts = [p for p in url.split("/") if p]
            if url == "/":
                tipo, sub = "pagina", "Página inicial"
            elif len(parts) == 1 and parts[0] in CIDADES:
                tipo, sub = "cidade", "Cidade da Região Metropolitana de Curitiba"
                titulo = "Terrenos em " + CIDADES[parts[0]]
            elif parts[0] == "conteudos":
                tipo, sub = "conteudo", "Conteúdo" if len(parts) > 1 else "Blog"
            elif parts[0] == "terrenos":
                tipo, sub = "perfil", "Terrenos por perfil"
            elif len(parts) == 2 and parts[0] in CIDADES:
                tipo, sub = "pagina", CIDADES[parts[0]]
            else:
                tipo, sub = "pagina", "Página do site"
            kw = " ".join(p.replace("-", " ") for p in parts)
            if parts and parts[0] in CIDADES:
                kw += " " + CIDADES[parts[0]]
            itens.append({"tipo": tipo, "titulo": clean(titulo), "url": url, "sub": sub, "desc": clean(desc), "kw": clean(kw)})

    ordem = {"empreendimento": 0, "cidade": 1, "perfil": 2, "conteudo": 3, "pagina": 4}
    itens.sort(key=lambda i: (ordem[i["tipo"]], i["url"]))
    out = {"gerado": datetime.date.today().isoformat(), "total": len(itens), "itens": itens}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print("ok:", OUT, "—", len(itens), "itens", {k: sum(1 for i in itens if i["tipo"] == k) for k in ordem})


if __name__ == "__main__":
    main()
