/* A rolagem. No computador, o Lenis conduz só a roda do mouse (cada gesto vira
   uma corrida de 1,1 s); no toque, a rolagem é a nativa do aparelho, sem mexer.
   Os links de âncora rolam até a seção. aoRolar(f) roda f(y) no quadro em que
   a página andou (um só por quadro). */
import Lenis from 'lenis'

const ouvintes = new Set()
let lenis = null
let pedido = 0
let ultimoY = -1

function avisa() {
  pedido = 0
  const y = window.scrollY
  if (y === ultimoY) return
  ultimoY = y
  for (const f of ouvintes) f(y)
}

export function aoRolar(f) {
  ouvintes.add(f)
  f(window.scrollY)
  return () => ouvintes.delete(f)
}

export function iniciaRolagem({ calmo }) {
  addEventListener('scroll', () => { if (!pedido) pedido = requestAnimationFrame(avisa) }, { passive: true })

  if (!calmo) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
    })
  }

  // links de âncora: rolam até a seção e passam o foco para ela
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href').slice(1)
    const alvo = id ? document.getElementById(id) : null
    if (!alvo) return
    ev.preventDefault()
    const foco = () => {
      if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1')
      alvo.focus({ preventScroll: true })
    }
    history.replaceState(null, '', `#${id}`)
    if (lenis) lenis.scrollTo(alvo, { offset: 0, duration: 1.4, onComplete: foco })
    else {
      alvo.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth' })
      foco()
    }
  })

  return lenis
}
