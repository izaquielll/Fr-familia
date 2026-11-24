"""Gera a arte de prévia do cupom de aluno (img/og/cupom.jpg, 1200x630).
Foto do FR ao fundo, descontos de todos os planos (valores do painel) e as nutricionistas aprovadas.
Roda no GitHub Actions junto com gerar_nutris.py. Sem internet, usa os valores padrão e a foto local da Fabíola."""
import io
import json
import os
import urllib.request
from datetime import date

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
FONTES = os.path.join(AQUI, "fonts")
URL = "https://akvytzbynpxnslsuijub.supabase.co"
KEY = "sb_publishable_vFOmn0CItTsyYx9tZ-L3Hg_7LikKzje"
SAIDA = os.path.join(RAIZ, "img/og/cupom.jpg")

LIME = (212, 255, 58)
INK = (20, 26, 0)
BRANCO = (243, 244, 239)
CINZA = (164, 169, 156)
FUNDO = (15, 16, 13)
S = 2  # desenha em 2x e reduz no fim
W, H = 1200, 630

PADRAO = {"consultoria": 200, "consultoriaPromo": 150, "consultoriaNovo": 167, "nutri": 250, "comboPromo": 250,
          "avulso": 67, "avulsoGuia": 80, "promoAte": "2026-12-31"}


def api(caminho):
    req = urllib.request.Request(f"{URL}/rest/v1/{caminho}", headers={"apikey": KEY, "Authorization": f"Bearer {KEY}"})
    return json.load(urllib.request.urlopen(req, timeout=30))


def baixar(url):
    try:
        return Image.open(io.BytesIO(urllib.request.urlopen(url, timeout=30).read()))
    except Exception:
        return None


def f(nome, tam):
    return ImageFont.truetype(os.path.join(FONTES, nome), round(tam * S))


def brl(n):
    n = float(n)
    return "R$ " + (f"{n:,.0f}" if n == int(n) else f"{n:,.2f}").replace(",", "X").replace(".", ",").replace("X", ".")


def foto_redonda(foto, d, anel=3):
    d, anel = d * S, anel * S
    c = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    m = Image.new("L", (d, d), 0)
    ImageDraw.Draw(m).ellipse((0, 0, d - 1, d - 1), fill=255)
    c.paste(Image.new("RGBA", (d, d), LIME + (255,)), (0, 0), m)
    if foto is not None:
        foto = ImageOps.exif_transpose(foto).convert("RGB")
        w, h = foto.size
        lado = min(w, h)
        top = max(0, int((h - lado) * 0.2))
        foto = foto.crop(((w - lado) // 2, top, (w - lado) // 2 + lado, top + lado)).resize((d - 2 * anel, d - 2 * anel), Image.LANCZOS)
        mi = Image.new("L", foto.size, 0)
        ImageDraw.Draw(mi).ellipse((0, 0, foto.size[0] - 1, foto.size[1] - 1), fill=255)
        c.paste(foto, (anel, anel), mi)
    return c


def gerar():
    try:
        C = {**PADRAO, **{k: v for k, v in (api("fr_config?select=dados&id=eq.1")[0]["dados"] or {}).items() if v not in (None, "")}}
    except Exception:
        C = dict(PADRAO)
    try:
        nutris = api("fr_nutris?select=nome,foto_url&status=eq.aprovada&order=created_at")
    except Exception:
        nutris = [{"nome": "Fabíola Amorim", "foto_url": None}]

    img = Image.new("RGB", (W * S, H * S), FUNDO)
    # foto do FR ao fundo, à direita, apagando para a esquerda
    fr = Image.open(os.path.join(RAIZ, "img/fr-frente.webp")).convert("RGB")
    alto = H * S
    fr = fr.resize((round(fr.width * alto / fr.height), alto), Image.LANCZOS)
    x_fr = W * S - fr.width + 40 * S
    mask = Image.new("L", fr.size, 0)
    md = ImageDraw.Draw(mask)
    for x in range(fr.width):
        md.line((x, 0, x, fr.height), fill=int(255 * min(1, max(0, (x / fr.width - 0.12) / 0.5)) ** 1.6 * 0.85))
    img.paste(fr, (x_fr, 0), mask)
    # brilho verde e escurecimento atrás do texto
    brilho = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(brilho).ellipse((-300 * S, -260 * S, 520 * S, 420 * S), fill=LIME + (40,))
    brilho = brilho.filter(ImageFilter.GaussianBlur(120 * S))
    img.paste(brilho, (0, 0), brilho)
    sombra = Image.new("L", img.size, 0)
    sd = ImageDraw.Draw(sombra)
    for x in range(W * S):
        sd.line((x, 0, x, H * S), fill=int(200 * max(0, 1 - x / (760 * S))))
    img.paste(Image.new("RGB", img.size, FUNDO), (0, 0), sombra)

    d = ImageDraw.Draw(img)
    X = 56
    # marca
    d.rounded_rectangle((X * S, 40 * S, (X + 46) * S, 86 * S), radius=12 * S, fill=LIME)
    d.text(((X + 23) * S, 63 * S), "FR", font=f("Poppins-Bold.ttf", 19), fill=INK, anchor="mm")
    d.text(((X + 60) * S, 63 * S), "FAMÍLIA FR", font=f("Poppins-Bold.ttf", 19), fill=BRANCO, anchor="lm")
    # selo + título
    pill = "Cupom de aluno"
    fp = f("Poppins-Bold.ttf", 17)
    lp = d.textlength(pill, font=fp) / S
    d.rounded_rectangle((X * S, 108 * S, (X + lp + 34) * S, 142 * S), radius=17 * S, fill=LIME)
    d.text(((X + 17) * S, 125 * S), pill, font=fp, fill=INK, anchor="lm")
    d.text((X * S, 190 * S), "Obrigado pelo", font=f("Poppins-Bold.ttf", 40), fill=BRANCO, anchor="ls")
    d.text((X * S, 236 * S), "companheirismo!", font=f("Poppins-Bold.ttf", 40), fill=LIME, anchor="ls")

    # linhas de desconto
    combo = float(C["consultoria"]) + float(C["nutri"])
    linhas = [
        ("Consultoria Online", "para quem já é aluno", float(C["consultoria"]), float(C["consultoriaPromo"])),
        ("Consultoria Online", "para o amigo indicado", float(C["consultoria"]), float(C["consultoriaNovo"])),
        ("Consultoria + Nutri", "treino + plano alimentar", combo, float(C["comboPromo"])),
    ]
    linhas = [l for l in linhas if l[3] < l[2]]
    y = 262
    LARG = 560
    for nome, sub, de, por in linhas:
        d.rounded_rectangle((X * S, y * S, (X + LARG) * S, (y + 60) * S), radius=14 * S, fill=(23, 25, 20), outline=(44, 48, 38), width=S)
        pct = f"{int((de - por) / de * 100 + 0.5)}% off"  # arredonda igual ao site (Math.round)
        fb = f("Poppins-Bold.ttf", 17)
        lb = d.textlength(pct, font=fb) / S
        d.rounded_rectangle(((X + 14) * S, (y + 16) * S, (X + 14 + lb + 22) * S, (y + 44) * S), radius=14 * S, fill=LIME)
        d.text(((X + 25) * S, (y + 30) * S), pct, font=fb, fill=INK, anchor="lm")
        tx = X + 14 + lb + 22 + 14
        d.text((tx * S, (y + 27) * S), nome, font=f("Poppins-Bold.ttf", 17), fill=BRANCO, anchor="ls")
        d.text((tx * S, (y + 47) * S), sub, font=f("Poppins-Regular.ttf", 13), fill=CINZA, anchor="ls")
        d.text(((X + LARG - 16) * S, (y + 25) * S), brl(de), font=f("Poppins-Regular.ttf", 13), fill=CINZA, anchor="rs")
        lde = d.textlength(brl(de), font=f("Poppins-Regular.ttf", 13))
        d.line(((X + LARG - 16) * S - lde, (y + 20) * S, (X + LARG - 16) * S, (y + 20) * S), fill=CINZA, width=S)
        d.text(((X + LARG - 16) * S, (y + 48) * S), brl(por), font=f("Poppins-Bold.ttf", 21), fill=BRANCO, anchor="rs")
        y += 68
    # programas (preço normal, sem desconto)
    d.text((X * S, (y + 18) * S), f"Programas de 30 dias: {brl(C['avulso'])} · {brl(C['avulsoGuia'])} com guia alimentar",
           font=f("Poppins-Medium.ttf", 15), fill=BRANCO, anchor="ls")
    y += 34

    # nutricionistas
    fotos = []
    for n in nutris[:4]:
        foto = baixar(n["foto_url"]) if n.get("foto_url") else None
        if foto is None and "fab" in (n.get("nome") or "").lower():
            foto = Image.open(os.path.join(RAIZ, "img/fabiola.jpg"))
        fotos.append((n.get("nome") or "", foto))
    if fotos:
        D = 54
        xx = X
        for i, (nome, foto) in enumerate(fotos):
            c = foto_redonda(foto, D)
            img.paste(c, (xx * S, (y + 6) * S), c)
            xx += D - 12
        nomes = " e ".join([", ".join(n for n, _ in fotos[:-1]), fotos[-1][0]]) if len(fotos) > 1 else fotos[0][0]
        tx = xx + 24
        d.text((tx * S, (y + 30) * S), nomes, font=f("Poppins-Bold.ttf", 16), fill=BRANCO, anchor="ls")
        d.text((tx * S, (y + 50) * S), "Nutricionistas parceiras" if len(fotos) > 1 else "Nutricionista parceira", font=f("Poppins-Bold.ttf", 13), fill=LIME, anchor="ls")

    ate = str(C.get("promoAte") or "")
    if ate:
        try:
            ate = date.fromisoformat(ate).strftime("%d/%m")
        except ValueError:
            ate = ""
    rod = "Use o seu cupom no pedido e passe para os amigos" + (f" · até {ate}" if ate else "")
    d.text((X * S, 606 * S), rod, font=f("Poppins-Regular.ttf", 14), fill=CINZA, anchor="ls")

    img = img.resize((W, H), Image.LANCZOS)
    img.save(SAIDA, "JPEG", quality=88, optimize=True, progressive=True)
    print("Arte do cupom:", SAIDA, "| nutris:", [n for n, _ in fotos])


if __name__ == "__main__":
    gerar()
