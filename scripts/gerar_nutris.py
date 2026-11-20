"""Gera uma página de prévia (com a foto da nutri) para cada nutricionista aprovada.
Roda no GitHub Actions. Lê só dados públicos do Supabase (nutris aprovadas)
e mexe apenas na pasta n/ do site."""
import html
import json
import os
import shutil
import urllib.request

URL = "https://akvytzbynpxnslsuijub.supabase.co"
KEY = "sb_publishable_vFOmn0CItTsyYx9tZ-L3Hg_7LikKzje"
BASE = "https://izaquielll.github.io/Fr-familia/"
FALLBACK_IMG = BASE + "img/og/vitrine.jpg"
PASTA = "n"

req = urllib.request.Request(
    f"{URL}/rest/v1/fr_nutris?select=slug,nome,foto_url,especialidades,formacao&status=eq.aprovada",
    headers={"apikey": KEY, "Authorization": f"Bearer {KEY}"},
)
nutris = json.load(urllib.request.urlopen(req, timeout=30))

os.makedirs(PASTA, exist_ok=True)
validos = set()
for n in nutris:
    slug = n.get("slug") or ""
    if not slug or not all(c.isalnum() or c == "-" for c in slug):
        continue
    validos.add(slug)
    nome = html.escape(n.get("nome") or "Nutricionista")
    esp = html.escape(n.get("especialidades") or "Treino + nutrição online")
    img = html.escape(n.get("foto_url") or FALLBACK_IMG)
    titulo = f"{nome} · Nutricionista parceira da Família FR"
    desc = f"{esp}. Monte o seu plano de treino e nutrição com a indicação de {nome}."
    os.makedirs(f"{PASTA}/{slug}", exist_ok=True)
    with open(f"{PASTA}/{slug}/index.html", "w", encoding="utf-8") as f:
        f.write(f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Família FR">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{img}">
<meta property="og:url" content="{BASE}{PASTA}/{slug}/">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="{desc}">
<script>var p=new URLSearchParams(location.search);p.set("nutri","{slug}");location.replace("../../?"+p.toString());</script>
<meta http-equiv="refresh" content="1; url=../../?nutri={slug}">
<style>body{{background:#0f100d;color:#f3f4ef;font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0}}a{{color:#d4ff3a}}</style>
</head><body><p>Abrindo… <a href="../../?nutri={slug}">toque aqui se não abrir</a></p></body></html>
""")

# remove páginas de nutris que não estão mais aprovadas (só dentro da pasta n/)
for d in os.listdir(PASTA):
    caminho = os.path.join(PASTA, d)
    if os.path.isdir(caminho) and d not in validos:
        shutil.rmtree(caminho)

print("Nutris aprovadas:", sorted(validos) or "nenhuma")

# ===== Consultoria + Nutri com cada nutri: combo/<slug>/ com a arte trocada =====
import re
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import arte_combo

ARTE_BASE = "img/og/combo.jpg"  # arte original (já com a Fabíola)
meta = open("combo/index.html", encoding="utf-8").read()
desc_base = html.unescape(re.search(r'og:description" content="([^"]*)"', meta).group(1))

combos = {"fabiola": {"nome": "Fabíola Amorim", "img": ARTE_BASE}}
fotos = {}
for n in nutris:
    slug = n.get("slug") or ""
    if slug not in validos:
        continue
    foto = None
    if n.get("foto_url"):
        try:
            foto = urllib.request.urlopen(n["foto_url"], timeout=30).read()
        except Exception as e:
            print("Sem foto para", slug, e)
    l1, l2 = arte_combo.linhas(n.get("especialidades"), n.get("formacao"))
    dados = arte_combo.gerar(ARTE_BASE, n.get("nome") or "Nutricionista", l1, l2, foto)
    destino = f"img/og/combo-{slug}.jpg"
    if not os.path.exists(destino) or open(destino, "rb").read() != dados:
        open(destino, "wb").write(dados)
    combos[slug] = {"nome": n.get("nome") or "Nutricionista", "img": destino}
    fotos[slug] = (foto, l1, l2)

for slug, c in combos.items():
    nome = html.escape(c["nome"])
    titulo = f"Consultoria + Nutri com {nome} · Família FR"
    desc = html.escape(desc_base.replace("nutricionista parceira", "a nutricionista " + c["nome"]))
    os.makedirs(f"combo/{slug}", exist_ok=True)
    with open(f"combo/{slug}/index.html", "w", encoding="utf-8") as f:
        f.write(f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Família FR">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{BASE}{c['img']}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="{BASE}combo/{slug}/">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="{desc}">
<script>var p=new URLSearchParams(location.search);p.set("plano","combo");p.set("com","{slug}");location.replace("../../?"+p.toString());</script>
<meta http-equiv="refresh" content="1; url=../../?plano=combo&amp;com={slug}">
<style>body{{background:#0f100d;color:#f3f4ef;font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0}}a{{color:#d4ff3a}}</style>
</head><body><p>Abrindo o plano… <a href="../../?plano=combo&amp;com={slug}">toque aqui se não abrir</a></p></body></html>
""")

# limpa o que não vale mais (só subpastas de combo/ e artes combo-*.jpg)
for d in os.listdir("combo"):
    if os.path.isdir(os.path.join("combo", d)) and d not in combos:
        shutil.rmtree(os.path.join("combo", d))
for f in os.listdir("img/og"):
    if f.startswith("combo-") and f.endswith(".jpg") and f[6:-4] not in combos:
        os.remove(os.path.join("img/og", f))
print("Combos:", sorted(combos))

# ===== Arte de cada plano com a nutri: convite e programas, com o quadro da nutricionista =====
LARANJA = (255, 122, 47)
ESPACO = {"gluteo": (246, 334), "abdomen": (245, 311), "metabolica": (245, 311)}  # trecho livre em cada arte
OUTROS = ["convite", "gluteo", "abdomen", "metabolica"]
artes = {"combo": {s: c["img"] for s, c in combos.items()}}
for plano in OUTROS:
    artes[plano] = {}
    if not os.path.exists(f"img/og/{plano}.jpg"):
        continue
    for slug, (foto, l1, l2) in fotos.items():
        dados = arte_combo.gerar(f"img/og/{plano}.jpg", combos[slug]["nome"], l1, l2, foto, acc=LARANJA, espaco=ESPACO.get(plano))
        destino = f"img/og/{plano}-{slug}.jpg"
        if not os.path.exists(destino) or open(destino, "rb").read() != dados:
            open(destino, "wb").write(dados)
        artes[plano][slug] = destino

def og(pagina, campo):
    m = re.search(rf'og:{campo}" content="([^"]*)"', pagina)
    return m.group(1) if m else ""

def pagina(caminho, titulo, desc, img, url, destino_js, destino):
    os.makedirs(caminho, exist_ok=True)
    with open(f"{caminho}/index.html", "w", encoding="utf-8") as f:
        f.write(f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Família FR">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="{desc}">
<script>var p=new URLSearchParams(location.search);{destino_js}</script>
<meta http-equiv="refresh" content="1; url={html.escape(destino)}">
<style>body{{background:#0f100d;color:#f3f4ef;font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0}}a{{color:#d4ff3a}}</style>
</head><body><p>Abrindo o plano… <a href="{html.escape(destino)}">toque aqui se não abrir</a></p></body></html>
""")

# Links do FR com a nutri escolhida: <plano>/<slug>/ (o combo já tem combo/<slug>/ acima)
for plano in OUTROS:
    if not os.path.exists(f"{plano}/index.html"):
        continue
    pg = open(f"{plano}/index.html", encoding="utf-8").read()
    for slug, img in artes[plano].items():
        nome = combos[slug]["nome"]
        titulo = html.escape(html.unescape(og(pg, "title")).replace(" · Família FR", f" com {nome} · Família FR"))
        pagina(f"{plano}/{slug}", titulo, og(pg, "description"), BASE + img, f"{BASE}{plano}/{slug}/",
               f'p.set("plano","{plano}");p.set("com","{slug}");location.replace("../../?"+p.toString());',
               f"../../?plano={plano}&com={slug}")
    for d in os.listdir(plano):
        if os.path.isdir(os.path.join(plano, d)) and d not in artes[plano]:
            shutil.rmtree(os.path.join(plano, d))
for f in os.listdir("img/og"):
    for plano in OUTROS:
        if f.startswith(plano + "-") and f.endswith(".jpg") and f[len(plano) + 1:-4] not in artes[plano]:
            os.remove(os.path.join("img/og", f))

# ===== Link de cada plano enviado pela nutri: n/<slug>/<plano>/ com a arte do plano (e o quadro dela) =====
PLANOS = ["consultoria", "combo", "convite", "gluteo", "abdomen", "metabolica"]
for n in nutris:
    slug = n.get("slug") or ""
    if slug not in validos:
        continue
    for plano in PLANOS:
        if not os.path.exists(f"{plano}/index.html"):
            continue
        pg = open(f"{plano}/index.html", encoding="utf-8").read()
        titulo, desc, img = og(pg, "title"), og(pg, "description"), og(pg, "image")
        if plano == "combo" and slug in combos:
            titulo = html.escape(f"Consultoria + Nutri com {combos[slug]['nome']} · Família FR")
            desc = html.escape(desc_base.replace("nutricionista parceira", "a nutricionista " + combos[slug]["nome"]))
        if slug in artes.get(plano, {}):
            img = BASE + artes[plano][slug]
            if plano != "combo":
                titulo = html.escape(html.unescape(titulo).replace(" · Família FR", f" com {combos[slug]['nome']} · Família FR"))
        pagina(f"{PASTA}/{slug}/{plano}", titulo, desc, img, f"{BASE}{PASTA}/{slug}/{plano}/",
               f'p.set("plano","{plano}");p.set("nutri","{slug}");location.replace("../../../?"+p.toString());',
               f"../../../?plano={plano}&nutri={slug}")
print("Links por plano das nutris:", sorted(validos))
