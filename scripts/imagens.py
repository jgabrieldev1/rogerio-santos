"""Prepara as imagens do site a partir de material/rogerio/ e grava em public/img/.

- advogado.webp: o retrato recortado (sem fundo), ampliado para 2x, com a borda
  clara do recorte limpa (o recorte original foi feito em fundo branco).
- escritorio.webp: a foto do card (3:2). Enquanto não houver uma foto dele no
  escritório, é montada com o mesmo retrato no terço direito, sobre um fundo escuro.

Uso: python3 scripts/imagens.py   (precisa do Pillow)
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageChops, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'material' / 'rogerio'
SAIDA = RAIZ / 'public' / 'img'
SAIDA.mkdir(parents=True, exist_ok=True)


def limpa_borda(im):
    """Tira o halo branco do recorte: encolhe o alfa 1 px e escurece a franja."""
    r, g, b, a = im.split()
    a2 = a.filter(ImageFilter.MinFilter(3))
    franja = ImageChops.subtract(a, a2)  # onde a borda foi comida
    escuro = Image.new('RGB', im.size, (20, 22, 26))
    rgb = Image.merge('RGB', (r, g, b))
    rgb = Image.composite(escuro, rgb, franja.point(lambda v: 255 if v > 0 else 0))
    a2 = a2.filter(ImageFilter.GaussianBlur(0.6))
    return Image.merge('RGBA', (*rgb.split(), a2))


ret = Image.open(FONTE / 'recortada-1.png').convert('RGBA')
ret = limpa_borda(ret)
ret2 = ret.resize((ret.width * 2, ret.height * 2), Image.LANCZOS)
ret2.save(SAIDA / 'advogado.webp', 'WEBP', quality=88, method=6)
print('advogado.webp', ret2.size)

# a foto do card: 1800 × 1200, retrato no terço direito, fundo escuro com luz suave
W, H = 1800, 1200
fundo = Image.new('RGB', (W, H), (14, 15, 18))
luz = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(luz)
d.ellipse((900, -200, 1900, 900), fill=120)
luz = luz.filter(ImageFilter.GaussianBlur(220))
fundo = Image.composite(Image.new('RGB', (W, H), (70, 74, 82)), fundo, luz)
alt = 1150
larg = round(ret.width * alt / ret.height * 2) // 2
pessoa = ret.resize((larg, alt), Image.LANCZOS)
x = 1250 - larg // 2
fundo.paste(pessoa, (x, H - alt + 40), pessoa)
fundo.save(SAIDA / 'escritorio.webp', 'WEBP', quality=84, method=6)
print('escritorio.webp', fundo.size)
