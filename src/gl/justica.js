/* A estátua da Justiça: o desenho a nanquim, de perfil, com a balança na mão
   estendida e a espada atrás. Duas imagens do mesmo tamanho (1536 × 1024),
   feitas pelo scripts/justica-imagem.py a partir de material/rogerio/:
   - justica-linhas.webp: o traço em branco ("o desenho com os cortes"),
     que vale onde a geada está nítida;
   - justica-cheia.webp: o traço engrossado ("a figura maciça"), que vira
     o brilho fosco onde a geada desfoca.
   A caixa da estátua no CSS tem a mesma proporção (--j-esc × 1536 × 1024). */
// as imagens ficam em public/img: o caminho é relativo à página, para o site
// abrir em qualquer pasta da hospedagem
const urlLinhas = new URL('img/justica-linhas.webp', document.baseURI).href
const urlCheia = new URL('img/justica-cheia.webp', document.baseURI).href

export const LARGURA = 1536
export const ALTURA = 1024

function carrega(src) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  const pronta = img.decode().catch(() => new Promise((r) => { img.onload = r; img.onerror = r }))
  return { img, pronta }
}

const linhas = carrega(urlLinhas)
const cheia = carrega(urlCheia)

/* a abertura espera as duas imagens decodificadas */
export const justicaPronta = Promise.all([linhas.pronta, cheia.pronta])

/* pinta(ctx, w, h, { cortes }) desenha a estátua no quadro w × h */
export function pintaJustica() {
  return (ctx, w, h, { cortes = true } = {}) => {
    const { img } = cortes ? linhas : cheia
    if (!img.naturalWidth) return
    ctx.save()
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, w, h)
    ctx.restore()
  }
}
