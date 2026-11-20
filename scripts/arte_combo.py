"""Gera a arte de prévia do Consultoria + Nutri (img/og/combo.jpg) trocando o quadro da nutricionista.
Usa a arte original e repinta só o quadro: foto redonda, nome, "Nutricionista parceira" e duas linhas."""
import io
import os

from PIL import Image, ImageDraw, ImageFont, ImageOps

AQUI = os.path.dirname(os.path.abspath(__file__))
FONTES = os.path.join(AQUI, "fonts")

# geometria medida na arte original (1200x630)
BOX_IN = (741, 240, 1098, 312)       # interior do quadro, longe das bordas e cantos arredondados
CIRC_C, CIRC_R = (772, 276), 30      # foto com o anel verde
TX = 815                              # início do texto
TX_MAX = 1094                         # limite à direita
LIME = (212, 255, 58)
BRANCO = (236, 238, 232)
CINZA = (165, 168, 158)


def fonte(nome, tam):
    return ImageFont.truetype(os.path.join(FONTES, nome), tam)


def _fundo(img):
    """Reconstrói o fundo do quadro interpolando a linha de cima e a de baixo (é um degradê suave)."""
    x0, y0, x1, y1 = BOX_IN
    topo = img.crop((x0, y0 + 1, x1, y0 + 3)).resize((x1 - x0, 1), Image.BOX)
    base = img.crop((x0, y1 - 3, x1, y1 - 1)).resize((x1 - x0, 1), Image.BOX)
    # suaviza na horizontal para não carregar ruído do JPEG
    topo = topo.resize((max(1, (x1 - x0) // 10), 1), Image.BOX).resize((x1 - x0, 1), Image.BILINEAR)
    base = base.resize((max(1, (x1 - x0) // 10), 1), Image.BOX).resize((x1 - x0, 1), Image.BILINEAR)
    h = y1 - y0
    camada = Image.new("RGB", (x1 - x0, h))
    for i in range(h):
        camada.paste(Image.blend(topo, base, i / (h - 1)), (0, i))
    img.paste(camada, (x0, y0))


def _cabe(draw, txt, f, largura):
    if draw.textlength(txt, font=f) <= largura:
        return txt
    while txt and draw.textlength(txt + "…", font=f) > largura:
        txt = txt[:-1]
    return txt.rstrip(" ·,") + "…"


def _foto(img, foto, acc=LIME, dy=0):
    S = 4  # supersampling para a borda ficar lisa
    R = CIRC_R * S
    anel = 2 * S
    d = 2 * R
    camada = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    m = Image.new("L", (d, d), 0)
    ImageDraw.Draw(m).ellipse((0, 0, d - 1, d - 1), fill=255)
    camada.paste(Image.new("RGBA", (d, d), acc + (255,)), (0, 0), m)
    if foto is not None:
        foto = ImageOps.exif_transpose(foto).convert("RGB")  # fotos de celular vêm com a rotação no EXIF
        w, h = foto.size
        lado = min(w, h)
        # recorte quadrado, puxando um pouco para cima (rosto)
        top = max(0, int((h - lado) * 0.25))
        foto = foto.crop(((w - lado) // 2, top, (w - lado) // 2 + lado, top + lado))
        di = d - 2 * anel
        foto = foto.resize((di, di), Image.LANCZOS)
        mi = Image.new("L", (di, di), 0)
        ImageDraw.Draw(mi).ellipse((0, 0, di - 1, di - 1), fill=255)
        camada.paste(foto, (anel, anel), mi)
    camada = camada.resize((2 * CIRC_R, 2 * CIRC_R), Image.LANCZOS)
    img.paste(camada, (CIRC_C[0] - CIRC_R, CIRC_C[1] - CIRC_R + dy), camada)


def _apaga(img, x0, y0, x1, y1):
    """Apaga um trecho interpolando a linha de cima e a de baixo (o fundo é um degradê)."""
    topo = img.crop((x0, y0 - 2, x1, y0)).resize((x1 - x0, 1), Image.BOX)
    base = img.crop((x0, y1, x1, y1 + 2)).resize((x1 - x0, 1), Image.BOX)
    camada = Image.new("RGB", (x1 - x0, y1 - y0))
    for i in range(y1 - y0):
        camada.paste(Image.blend(topo, base, i / (y1 - y0 - 1)), (0, i))
    img.paste(camada, (x0, y0))


def _quadro(img, acc):
    """Desenha o quadro (fundo escuro + borda) na posição do quadro do combo."""
    S = 4
    bx0, by0, bx1, by1 = 733, 234, 1105, 317
    W, H = (bx1 - bx0 + 4) * S, (by1 - by0 + 4) * S
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(c).rounded_rectangle((2 * S, 2 * S, W - 2 * S, H - 2 * S), radius=12 * S,
        fill=tuple(int(v * 0.10) for v in acc) + (225,), outline=acc + (200,), width=round(1.6 * S))
    c = c.resize((W // S, H // S), Image.LANCZOS)
    img.paste(c, (bx0 - 2, by0 - 2), c)


def _programa(img, nome, linha1, linha2, foto, acc, espaco):
    """Arte sem quadro (programas): apaga o trecho livre e desenha o quadro nele, do tamanho que couber."""
    global CIRC_C, CIRC_R
    y0, y1 = espaco
    _apaga(img, 726, y0, 1112, y1)
    hb = min(83, y1 - y0 - 4)
    top = y0 + (y1 - y0 - hb) // 2
    S = 4
    bx0, bx1 = 733, 1105
    W, H = (bx1 - bx0 + 4) * S, (hb + 4) * S
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(c).rounded_rectangle((2 * S, 2 * S, W - 2 * S, H - 2 * S), radius=12 * S,
        fill=tuple(int(v * 0.10) for v in acc) + (225,), outline=acc + (200,), width=round(1.6 * S))
    c = c.resize((W // S, H // S), Image.LANCZOS)
    img.paste(c, (bx0 - 2, top - 2), c)
    cc, cr = CIRC_C, CIRC_R
    CIRC_R = min(30, hb // 2 - 7)
    CIRC_C = (bx0 + 9 + CIRC_R, top + hb // 2)
    _foto(img, foto, acc)
    CIRC_C, CIRC_R = cc, cr
    tx = bx0 + 18 + 2 * min(30, hb // 2 - 7)
    linhas = [(nome, "Poppins-Bold.ttf", 16.5, BRANCO, 16.5), ("Nutricionista parceira", "Poppins-Bold.ttf", 11, acc, 15)]
    if linha1: linhas.append((linha1, "Poppins-Regular.ttf", 9.7, CINZA, 14))
    if linha2 and hb >= 78: linhas.append((linha2, "Poppins-Regular.ttf", 9.7, CINZA, 13))
    alto = sum(l[4] for l in linhas)
    camada = Image.new("RGBA", ((bx1 - tx) * S, hb * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    y = (hb - alto) / 2 - 1
    for s, fn, tam, cor, passo in linhas:
        y += passo
        f = fonte(fn, round(tam * S))
        d.text((0, y * S), _cabe(d, s, f, (bx1 - tx - 6) * S), font=f, fill=cor + (255,), anchor="ls")
    camada = camada.resize((bx1 - tx, hb), Image.LANCZOS)
    img.paste(camada, (tx, top), camada)
    out = io.BytesIO()
    img.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    return out.getvalue()


def gerar(base_path, nome, linha1, linha2, foto_bytes=None, acc=LIME, espaco=None):
    """espaco=(y_topo, y_base): arte sem quadro (programas). Apaga esse trecho e põe o quadro nele,
    reduzido se não couber."""
    img = Image.open(base_path).convert("RGB")
    foto = None
    if foto_bytes:
        try:
            foto = Image.open(io.BytesIO(foto_bytes))
            foto.load()
        except Exception:
            foto = None
    if espaco:
        return _programa(img, nome, linha1, linha2, foto, acc, espaco)
    _fundo(img)
    _foto(img, foto, acc)
    # texto desenhado em 4x e reduzido, para ficar com o mesmo acabamento da arte
    S = 4
    x0, y0 = TX - 4, 240
    W, H = TX_MAX - x0 + 4, 72
    camada = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(camada)
    larg = (TX_MAX - TX) * S
    def txt(y, s, fnome, tam, cor):
        f = fonte(fnome, round(tam * S))
        d.text(((TX - x0) * S, (y - y0) * S), _cabe(d, s, f, larg), font=f, fill=cor + (255,), anchor="ls")
    txt(258.5, nome, "Poppins-Bold.ttf", 16.5, BRANCO)
    txt(274.5, "Nutricionista parceira", "Poppins-Bold.ttf", 11, acc)
    if linha1:
        txt(291.5, linha1, "Poppins-Regular.ttf", 9.7, CINZA)
    if linha2:
        txt(304.5, linha2, "Poppins-Regular.ttf", 9.7, CINZA)
    camada = camada.resize((W, H), Image.LANCZOS)
    img.paste(camada, (x0, y0), camada)
    out = io.BytesIO()
    img.save(out, "JPEG", quality=88, optimize=True, progressive=True)
    return out.getvalue()


def linhas(especialidades, formacao):
    """Linha 1: especialidades. Linha 2: formação (sem a graduação, que é óbvia), separada por ·"""
    l1 = " · ".join(s.strip() for s in (especialidades or "").replace(",", "·").split("·") if s.strip())
    forms = [s.strip().rstrip(".") for s in (formacao or "").splitlines() if s.strip()]
    sem_grad = [s for s in forms if not s.lower().startswith("graduad")] or forms
    return l1, " · ".join(sem_grad)
