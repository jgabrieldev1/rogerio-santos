/* O nome gigante do rodapé, na mesma geada do hero: nítido em cima, fosco
   para baixo, cortado pela base da página. Quando o rodapé entra na tela, o
   nome sai do fosco uma vez. O texto vem do data-fecho do rodapé. */
import { gsap } from './ease.js'
import { criaGeada } from '../gl/geada.js'
import { pintaLetras, proporcao } from '../gl/letras.js'

export function iniciaFecho(calmo) {
  const dono = document.querySelector('.rodape')
  const canvas = dono?.querySelector('.rodape__geada')
  const caixa = dono?.querySelector('.rodape__nome')
  if (!canvas || !caixa) return null
  const texto = (dono.dataset.fecho || 'Santos').toUpperCase()
  caixa.setAttribute('aria-label', texto)
  dono.style.setProperty('--fecho-prop', proporcao(texto).toFixed(4))

  const g = criaGeada(canvas, { dono, caixa, pinta: pintaLetras(texto) })
  if (!g) {
    dono.classList.add('sem-gl')
    caixa.textContent = texto
    return null
  }
  g.mede()

  if (calmo) {
    g.estado.alfa = 1
    g.desenha()
    return g
  }

  g.estado.alfa = 0
  g.estado.base = 26
  g.desenha()
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io.disconnect()
    gsap.to(g.estado, {
      alfa: 1, base: 0, duration: 1.6, ease: 'out',
      onUpdate: g.desenha,
    })
  }, { threshold: 0.15 })
  io.observe(caixa)
  return g
}
