/* O topo. Com a página no alto: solto e transparente. Descendo: some (para não
   escrever por cima dos títulos). Subindo: volta como vidro fosco com um fio
   embaixo. Com o foco do teclado dentro dele, fica à vista (topo.css). */
import { aoRolar } from './rolagem.js'

export function iniciaTopo() {
  const topo = document.querySelector('[data-topo]')
  if (!topo) return
  let antes = window.scrollY
  aoRolar((y) => {
    const d = y - antes
    if (y < 24) {
      topo.classList.remove('is-escondido', 'is-vidro')
    } else if (d > 4) {
      topo.classList.add('is-escondido')
    } else if (d < -4) {
      topo.classList.remove('is-escondido')
      topo.classList.add('is-vidro')
    }
    if (Math.abs(d) > 4 || y < 24) antes = y
  })
}
