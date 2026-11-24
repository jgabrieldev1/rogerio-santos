/* Pinta um texto como forma da geada (o nome gigante do rodapé), na fonte do
   título. O texto ocupa a largura inteira do quadro; a altura do quadro é a das
   maiúsculas, para a palavra encostar no topo e ser cortada pela base. */

export const DISPLAY = 'Sofia Sans Extra Condensed Variable'
export const PESO = 900

/* quanto da altura da letra cabe por unidade de largura (para o CSS dar a altura da caixa) */
export function proporcao(texto) {
  const c = document.createElement('canvas').getContext('2d')
  c.font = `${PESO} 100px "${DISPLAY}"`
  const m = c.measureText(texto)
  const largura = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
  const altura = m.actualBoundingBoxAscent
  return altura / largura
}

export function pintaLetras(texto) {
  return (ctx, w, h) => {
    ctx.save()
    ctx.fillStyle = '#fff'
    ctx.font = `${PESO} 100px "${DISPLAY}"`
    const m = ctx.measureText(texto)
    const larg = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
    const alt = m.actualBoundingBoxAscent
    const ex = w / larg
    const ey = h / alt
    ctx.setTransform(ex, 0, 0, ey, m.actualBoundingBoxLeft * ex, alt * ey)
    ctx.fillText(texto, 0, 0)
    ctx.restore()
  }
}
