/* O título são duas metades iguais. Mede a tinta das duas palavras e iguala a
   largura apertando ou abrindo o espaço entre as letras (de −0,045 a +0,075 do
   tamanho da letra). Também acerta o lado de cada palavra pela tinta, não pela
   caixa, para as duas encostarem no miolo à mesma distância do advogado.
   Escreve --ls e --ink-x em cada palavra. Chame de novo quando a tela mudar. */

const MIN = -0.045
const MAX = 0.075

export function igualaTitulo(palavras) {
  if (palavras.length !== 2) return
  const ctx = document.createElement('canvas').getContext('2d')
  const celular = matchMedia('(max-width: 760px)').matches

  const med = palavras.map((el) => {
    const cs = getComputedStyle(el)
    const tam = parseFloat(cs.fontSize)
    ctx.font = `${cs.fontWeight} ${tam}px ${cs.fontFamily}`
    const texto = el.textContent.trim().toUpperCase()
    const m = ctx.measureText(texto)
    return {
      el, tam, n: [...texto].length,
      tinta: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
      esq: m.actualBoundingBoxLeft,      // da origem até a tinta, para a esquerda
      dir: m.actualBoundingBoxRight,
      avanco: m.width,
    }
  })

  // o alvo: a média, puxada para dentro do que cada palavra consegue alcançar
  const alcance = med.map((p) => [p.tinta + (p.n - 1) * MIN * p.tam, p.tinta + (p.n - 1) * MAX * p.tam])
  const lo = Math.max(alcance[0][0], alcance[1][0])
  const hi = Math.min(alcance[0][1], alcance[1][1])
  let alvo = (med[0].tinta + med[1].tinta) / 2
  if (lo <= hi) alvo = Math.min(hi, Math.max(lo, alvo))

  med.forEach((p, i) => {
    let ls = p.n > 1 ? (alvo - p.tinta) / (p.n - 1) : 0
    ls = Math.min(MAX * p.tam, Math.max(MIN * p.tam, ls))
    let inkX
    if (celular) {
      // centrada: o meio da tinta no meio da caixa
      inkX = ((p.avanco + (p.n - 1) * ls) / 2) - ((-p.esq + p.dir + (p.n - 1) * ls) / 2)
    } else if (i === 0) {
      // a da esquerda encosta no miolo pela tinta da direita
      inkX = p.avanco - p.dir
    } else {
      // a da direita encosta no miolo pela tinta da esquerda
      inkX = p.esq
    }
    p.el.style.setProperty('--ls', `${ls.toFixed(2)}px`)
    p.el.style.setProperty('--ink-x', `${inkX.toFixed(2)}px`)
  })
}
