"""Faz as duas versões da estátua a partir do desenho a nanquim de material/rogerio/.

- public/img/justica-linhas.webp: o traço, em branco, com o fundo transparente
  (o "desenho com cortes": vale onde a geada está nítida).
- public/img/justica-cheia.webp: a figura maciça, em branco (vale onde a
  geada desfoca: vira o brilho fosco).

Uso: python3 scripts/justica-imagem.py   (precisa do Pillow)
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageChops

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / 'material' / 'rogerio' / 'justica-referencia.webp'
SAIDA = RAIZ / 'public' / 'img'

im = Image.open(FONTE).convert('RGBA')
papel = Image.new('RGBA', im.size, (255, 255, 255, 255))
papel.alpha_composite(im)
lum = papel.convert('L')

# o traço: quanto mais escuro, mais opaco; o papel some
tinta = lum.point(lambda v: max(0, min(255, round((236 - v) * 255 / 170))))
branco = Image.new('L', im.size, 255)
linhas = Image.merge('RGBA', (branco, branco, branco, tinta))
linhas.save(SAIDA / 'justica-linhas.webp', 'WEBP', quality=92, method=6)

# a figura maciça: o mesmo traço engrossado (as hachuras do corpo fecham numa
# massa; a balança e as correntes continuam vazadas) e amaciado
binario = lum.point(lambda v: 255 if v < 190 else 0)
cheia = binario.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.MinFilter(5))
cheia = cheia.filter(ImageFilter.GaussianBlur(2.5))
cheia = cheia.point(lambda v: round(v * 0.72))   # a massa brilha menos que o traço
cheia = ImageChops.lighter(cheia, tinta)
Image.merge('RGBA', (branco, branco, branco, cheia)).save(SAIDA / 'justica-cheia.webp', 'WEBP', quality=90, method=6)
print('public/img/justica-linhas.webp, public/img/justica-cheia.webp', im.size)
