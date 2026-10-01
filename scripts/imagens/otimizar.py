#!/usr/bin/env python3
"""Otimiza as fotos do site: gera variantes WebP em vários tamanhos e troca as tags <img> das páginas por
versões com srcset/sizes e width/height (o navegador baixa só o tamanho de que precisa e a página não "pula").

Uso (da raiz do repositório):  python3 scripts/imagens/otimizar.py
Idempotente: não refaz variantes que já existem nem tags que já foram trocadas. Mantenha em JPG as fotos usadas em
og:image/twitter:image (redes sociais leem melhor em JPG); as demais podem ser apagadas depois (ficam nos WebP e no git).
Veja docs/imagens.md.
"""
import glob
import os
import re
import sys

from PIL import Image

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "terreno-curitiba-e-regiao"))
IMG = os.path.join(ROOT, "assets", "img")
WIDTHS = [640, 1000, 1400]
QUALITY = 78
CAP = {"hero-home": 1800}  # a foto de capa ocupa a tela toda: mantém a largura original (até 1800)
DEFAULT_CAP = 1400

# sizes por contexto (onde a foto aparece no layout)
SIZES = {
    "bg": "100vw",
    # No celular a foto ocupa ~91% da largura; declarar 85vw faz telas 3x escolherem a variante de 1000 px
    # (praticamente igual na tela) em vez da de 1400 px, que pesa quase o dobro.
    "media": "(max-width: 560px) 85vw, (max-width: 900px) 50vw, 360px",      # galeria (3 → 2 → 1 coluna)
    "post": "(max-width: 560px) 85vw, (max-width: 900px) 100vw, 360px",      # cards de artigo/empreendimento
    "seal": "(max-width: 900px) 100vw, 540px",                               # foto principal do topo das cidades
    "feature": "(max-width: 900px) 100vw, 50vw",                             # empreendimento em destaque
    "article": "(max-width: 800px) 100vw, 760px",                            # imagem dentro do artigo
}
SKIP = re.compile(r"logo|favicon|corretor|evex-logo|video-poster|og-card")


def variants(width, name):
    cap = CAP.get(name, DEFAULT_CAP)
    ws = [w for w in WIDTHS if w <= min(width, cap)]
    top = min(width, cap)
    if not ws or top > ws[-1] * 1.05:
        ws.append(top)
    return sorted(set(ws))


def gerar(path, name):
    im = Image.open(path)
    im.load()
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")
    made, ws = [], variants(im.width, name)
    for w in ws:
        out = os.path.join(IMG, f"{name}-{w}.webp")
        if not os.path.exists(out):
            h = round(im.height * w / im.width)
            (im if w == im.width else im.resize((w, h), Image.LANCZOS)).save(out, "WEBP", quality=QUALITY, method=6)
            made.append(out)
    return ws, im.size, made


def contexto(tag, before, pagina):
    cls = (re.search(r'class="([^"]*)"', tag) or [None, ""])[1].split()
    if "hero__bg" in cls:
        return "bg"
    if "post__img" in cls:
        return "post"
    parents = re.findall(r'<(?:figure|div|section|article|a|span)[^>]*class="([^"]*)"', before)
    p = (parents[-1] if parents else "").split()
    if "media" in p:
        return "media"
    if "hero__seal" in p:
        return "seal"
    if "emp-feature__seal" in p:
        return "feature"
    if not p or pagina.startswith("conteudos/"):  # foto solta no corpo de um artigo
        return "article"
    return None


def main():
    # 1) quais fotos aparecem em <img>
    htmls = [f for f in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True) if "/admin/" not in f.replace(os.sep, "/")]
    usadas = set()
    for f in htmls:
        for m in re.finditer(r'<img\b[^>]*\bsrc="/assets/img/([^"?]+)\.jpg', open(f, encoding="utf-8").read()):
            if not SKIP.search(m.group(1)):
                usadas.add(m.group(1))
    info, novos = {}, 0
    for name in sorted(usadas):
        p = os.path.join(IMG, name + ".jpg")
        if not os.path.exists(p):
            sys.exit("foto ausente: " + p)
        ws, size, made = gerar(p, name)
        info[name] = (ws, size)
        novos += len(made)
    print(f"fotos: {len(info)} · variantes novas: {novos}")

    # 2) troca das tags
    trocadas, ignoradas = 0, []
    for f in htmls:
        h = open(f, encoding="utf-8").read()

        def troca(m):
            nonlocal trocadas
            tag = m.group(0)
            s = re.search(r'\bsrc="/assets/img/([^"?]+)\.jpg(?:\?[^"]*)?"', tag)
            if not s or s.group(1) not in info or "srcset=" in tag:
                return tag
            name = s.group(1)
            ws, (ow, oh) = info[name]
            ctx = contexto(tag, h[max(0, m.start() - 400):m.start()], os.path.relpath(f, ROOT).replace(os.sep, "/"))
            if ctx is None:
                ignoradas.append((os.path.relpath(f, ROOT), name))
                return tag
            base = [w for w in ws if w <= 1000][-1]
            srcset = ", ".join(f"/assets/img/{name}-{w}.webp {w}w" for w in ws)
            novo = tag.replace(s.group(0), f'src="/assets/img/{name}-{base}.webp" srcset="{srcset}" sizes="{SIZES[ctx]}"')
            if "width=" not in novo and "height=" not in novo:
                tw = ws[-1]
                novo = novo.replace("<img ", f'<img width="{tw}" height="{round(oh * tw / ow)}" ', 1)
            if ctx == "media" and ws[-1] > base:  # o zoom da galeria usa a versão grande
                novo = novo.replace("<img ", f'<img data-full="/assets/img/{name}-{ws[-1]}.webp" ', 1)
            trocadas += 1
            return novo

        h2 = re.sub(r"<img\b[^>]*>", troca, h)
        if h2 != h:
            open(f, "w", encoding="utf-8").write(h2)
    print("tags trocadas:", trocadas)
    if ignoradas:
        print("contexto não reconhecido (não trocadas):", ignoradas)
        sys.exit(1)


if __name__ == "__main__":
    main()
