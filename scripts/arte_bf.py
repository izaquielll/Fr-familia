"""Gera as artes da Black Friday:
- img/og/bf.jpg (1200x630): prévia que aparece quando o link bf/ é colado no WhatsApp
- img/bf-status.jpg (1080x1920): arte para o status/story, enviada pelo botão "Postar no status"
Uso: python3 scripts/arte_bf.py"""
import os

from PIL import ImageEnhance

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
FONTES = os.path.join(AQUI, "fonts")
LIME = (212, 255, 58)
FUNDO = (12, 13, 10)
BRANCO = (243, 244, 239)
CINZA = (170, 174, 162)
ESCURO = (20, 26, 0)

PRECOS = [
    ("Consultoria online", "Treino individual no app", "R$ 200", "150"),
    ("Consultoria + Nutri", "Treino + plano alimentar", "R$ 450", "250"),
]
VALIDADE = "ATÉ 31/12"
LINK = "izaquielll.github.io/Fr-familia"


def f(nome, tam):
    return ImageFont.truetype(os.path.join(FONTES, nome), tam)


def fundo(w, h, cx, cy, raio):
    img = Image.new("RGB", (w, h), FUNDO)
    brilho = Image.new("L", (w, h), 0)
    ImageDraw.Draw(brilho).ellipse((cx - raio, cy - raio, cx + raio, cy + raio), fill=120)
    brilho = brilho.filter(ImageFilter.GaussianBlur(raio // 2))
    img.paste(Image.new("RGB", (w, h), (70, 95, 0)), (0, 0), brilho)
    # listras diagonais discretas
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(-h, w, 46):
        d.line((x, h, x + h, 0), fill=(255, 255, 255, 6), width=10)
    return img


def foto(img, larg, x, y, cx, cy, raio, corte=0.62):
    d = ImageDraw.Draw(img)
    d.ellipse((cx - raio, cy - raio, cx + raio, cy + raio), fill=LIME)
    # foto do palco, sem camisa, cortada um pouco abaixo da cintura
    fr = Image.open(os.path.join(RAIZ, "img", "fr-palco.webp")).convert("RGBA")
    fr = fr.crop((0, 0, fr.width, int(fr.height * corte)))
    fr = fr.resize((larg, int(fr.height * larg / fr.width)), Image.LANCZOS)
    # esfuma a base da foto (as pernas somem no fundo)
    a = fr.getchannel("A")
    fade = Image.new("L", fr.size, 255)
    n = fr.height // 5
    for i in range(n):
        ImageDraw.Draw(fade).line((0, fr.height - n + i, fr.width, fr.height - n + i), fill=int(255 * (1 - i / n) ** 1.4))
    from PIL import ImageChops
    fr.putalpha(ImageChops.multiply(a, fade))
    sombra = Image.new("RGBA", fr.size, (0, 0, 0, 0))
    sombra.putalpha(fr.getchannel("A").filter(ImageFilter.GaussianBlur(18)).point(lambda v: v * 0.6))
    img.paste(sombra, (x + 10, y + 14), sombra)
    img.paste(fr, (x, y), fr)
    # esfuma a base da foto no fundo
    h = img.height
    grad = Image.new("L", (img.width, 220), 0)
    for i in range(220):
        ImageDraw.Draw(grad).line((0, i, img.width, i), fill=int(255 * (i / 219) ** 1.6))
    img.paste(Image.new("RGB", (img.width, 220), FUNDO), (0, h - 220), grad)


def fundo_foto(W, H, caixa, sombras):
    """Foto da academia (img/fr-academia.jpg) cobrindo a caixa (x0, y0, x1, y1) e escurecida pelas faixas em `sombras`
    (lista de (y_ini, y_fim, opac_ini, opac_fim) na vertical ou ("x", x_ini, x_fim, opac_ini, opac_fim) na horizontal)."""
    img = Image.new("RGB", (W, H), FUNDO)
    ft = Image.open(os.path.join(RAIZ, "img", "fr-academia.jpg")).convert("RGB")
    ft = ImageEnhance.Contrast(ft).enhance(1.08)
    x0, y0, x1, y1 = caixa
    ft = ImageOps.fit(ft, (x1 - x0, y1 - y0), Image.LANCZOS, centering=(0.5, 0.2))
    img.paste(ft, (x0, y0))
    preto = Image.new("RGB", (W, H), FUNDO)
    for sb in sombras:
        m = Image.new("L", (W, H), 0)
        dm = ImageDraw.Draw(m)
        if sb[0] == "x":
            _, a, b, oa, ob = sb
            for x in range(a, b):
                t = (x - a) / max(1, b - a - 1)
                dm.line((x, 0, x, H), fill=int(255 * (oa + (ob - oa) * t)))
            if b < W: dm.rectangle((b, 0, W, H), fill=int(255 * ob))
        else:
            a, b, oa, ob = sb
            for y in range(a, b):
                t = (y - a) / max(1, b - a - 1)
                dm.line((0, y, W, y), fill=int(255 * (oa + (ob - oa) * t)))
            if b < H and ob >= 1: dm.rectangle((0, b, W, H), fill=255)
        img = Image.composite(preto, img, m)
    # leve tom verde por cima, para casar com a marca
    tom = Image.new("RGB", (W, H), (40, 60, 0))
    return Image.blend(img, tom, 0.10)


def selo(d, x, y, txt, fonte, pad=(26, 12), fill=LIME, cor=ESCURO, raio=999):
    w = d.textlength(txt, font=fonte)
    a = fonte.getbbox("Ag")
    hh = a[3] - a[1]
    d.rounded_rectangle((x, y, x + w + 2 * pad[0], y + hh + 2 * pad[1]), radius=min(raio, (hh + 2 * pad[1]) // 2), fill=fill)
    d.text((x + pad[0], y + pad[1] - a[1]), txt, font=fonte, fill=cor)
    return x + w + 2 * pad[0], y + hh + 2 * pad[1]


def marca(d, x, y, esc=1.0):
    s = int(64 * esc)
    d.rounded_rectangle((x, y, x + s, y + s), radius=int(16 * esc), fill=LIME)
    ft = f("Poppins-Bold.ttf", int(26 * esc))
    w = d.textlength("FR", font=ft)
    b = ft.getbbox("FR")
    d.text((x + (s - w) / 2, y + (s - (b[3] - b[1])) / 2 - b[1]), "FR", font=ft, fill=ESCURO)
    d.text((x + s + int(18 * esc), y + s / 2), "FAMÍLIA FR", font=f("Poppins-Bold.ttf", int(26 * esc)), fill=BRANCO, anchor="lm")


def cartao(d, x, y, w, h, nome, sub, de, por, destaque):
    if destaque:
        d.rounded_rectangle((x, y, x + w, y + h), radius=28, fill=LIME)
        c1, c2, c3 = ESCURO, (51, 64, 10), (74, 90, 16)
    else:
        d.rounded_rectangle((x, y, x + w, y + h), radius=28, fill=(24, 26, 20), outline=(70, 74, 62), width=2)
        c1, c2, c3 = BRANCO, CINZA, (120, 124, 112)
    k = w / 440
    px = x + int(30 * k)
    d.text((px, y + int(30 * k)), nome, font=f("Poppins-Bold.ttf", int(28 * k)), fill=c1)
    d.text((px, y + int(70 * k)), sub, font=f("Poppins-Regular.ttf", int(20 * k)), fill=c2)
    fde = f("Poppins-Medium.ttf", int(26 * k))
    yd = y + int(118 * k)
    d.text((px, yd), "de ", font=fde, fill=c3)
    xs = px + d.textlength("de ", font=fde)
    d.text((xs, yd), de, font=fde, fill=c3)
    wde = d.textlength(de, font=fde)
    d.line((xs - 2, yd + int(19 * k), xs + wde + 2, yd + int(19 * k)), fill=c3, width=max(2, int(3 * k)))
    d.text((xs + wde, yd), " por", font=fde, fill=c3)
    fr_ = f("Poppins-Bold.ttf", int(30 * k))
    fp = f("Poppins-Bold.ttf", int(84 * k))
    yp = y + int(160 * k)
    d.text((px, yp + int(14 * k)), "R$", font=fr_, fill=c1)
    d.text((px + int(52 * k), yp - int(16 * k)), por, font=fp, fill=c1)


def story():
    W, H = 1080, 1920
    img = fundo_foto(W, H, (0, 500, W, 500 + 1470), [(500, 640, 1.0, 0.0), (1150, 1440, 0.0, 0.92), (1440, 1760, 0.92, 1.0)])
    d = ImageDraw.Draw(img)
    marca(d, 80, 120)
    selo(d, W - 80 - 236, 122, VALIDADE, f("Poppins-Bold.ttf", 30), pad=(28, 14))
    fb = f("Poppins-Bold.ttf", 132)
    d.text((74, 210), "BLACK", font=fb, fill=BRANCO)
    d.text((74, 345), "FRIDAY", font=fb, fill=LIME)
    x, _ = selo(d, 80, 525, "DEZEMBRO INTEIRO", f("Poppins-Bold.ttf", 30), pad=(24, 12), fill=BRANCO, cor=FUNDO)
    d.text((x + 24, 551), "Treino e nutrição do seu jeito", font=f("Poppins-Bold.ttf", 31), fill=BRANCO, anchor="lm")
    # cartões de preço
    y = 1270
    cw, gap = 444, 32
    for i, (n, s, de, por) in enumerate(PRECOS):
        cartao(d, 80 + i * (cw + gap), y, cw, 280, n, s, de, por, destaque=i == 1)
    d.text((W / 2, y + 315), "Preço para todos: alunos novos e renovação", font=f("Poppins-Medium.ttf", 28), fill=CINZA, anchor="mm")
    # chamada
    fc = f("Poppins-Bold.ttf", 40)
    txt = "Toque no link e garanta o seu"
    w = d.textlength(txt, font=fc)
    d.rounded_rectangle(((W - w) / 2 - 50, 1640, (W + w) / 2 + 50, 1736), radius=50, fill=LIME)
    d.text((W / 2, 1688), txt, font=fc, fill=ESCURO, anchor="mm")
    d.text((W / 2, 1778), LINK, font=f("Poppins-Medium.ttf", 30), fill=BRANCO, anchor="mm")
    img.save(os.path.join(RAIZ, "img", "bf-status.jpg"), quality=88, optimize=True, progressive=True)


def og():
    W, H = 1200, 630
    img = fundo_foto(W, H, (440, -40, 1200, -40 + 1040), [("x", 440, 780, 1.0, 0.0), (480, 630, 0.0, 0.5)])
    d = ImageDraw.Draw(img)
    marca(d, 64, 52, 0.85)
    selo(d, 64, 140, "DEZEMBRO INTEIRO · " + VALIDADE, f("Poppins-Bold.ttf", 22), pad=(20, 10))
    fb = f("Poppins-Bold.ttf", 108)
    d.text((58, 186), "BLACK", font=fb, fill=BRANCO)
    d.text((58, 296), "FRIDAY", font=fb, fill=LIME)
    fm = f("Poppins-Medium.ttf", 26)
    d.text((64, 450), "Consultoria online de", font=fm, fill=CINZA)
    x = 64 + d.textlength("Consultoria online de ", font=fm)
    d.text((x, 450), "R$ 200", font=fm, fill=CINZA)
    wd = d.textlength("R$ 200", font=fm)
    d.line((x - 2, 468, x + wd + 2, 468), fill=CINZA, width=3)
    d.text((x + wd, 450), " por", font=fm, fill=CINZA)
    d.text((64, 500), "R$", font=f("Poppins-Bold.ttf", 34), fill=LIME)
    d.text((118, 466), "150", font=f("Poppins-Bold.ttf", 84), fill=LIME)
    d.text((300, 500), "Consultoria + Nutri", font=f("Poppins-Bold.ttf", 26), fill=BRANCO)
    d.text((300, 536), "por R$ 250", font=f("Poppins-Medium.ttf", 26), fill=BRANCO)
    # selo de preço no canto da foto
    img.save(os.path.join(RAIZ, "img", "og", "bf.jpg"), quality=88, optimize=True, progressive=True)


if __name__ == "__main__":
    story()
    og()
    print("ok")
