/* O manifesto: a única peça presa à posição da rolagem. Parte a frase em
   palavras (o itálico continua itálico) e limpa uma a uma: cada palavra vai de
   13% de opacidade e 7 px de desfoque a nítida, com sete palavras a meio
   caminho de cada vez. Parada em qualquer ponto, a frase mostra palavras
   inteiras. Com movimento reduzido, a frase fica inteira à vista. */
import { aoRolar } from './rolagem.js'

const JANELA = 7

function parte(no, saida) {
  for (const filho of [...no.childNodes]) {
    if (filho.nodeType === 3) {
      const frag = document.createDocumentFragment()
      for (const pedaco of filho.textContent.split(/(\s+)/)) {
        if (!pedaco) continue
        if (/^\s+$/.test(pedaco)) frag.append(' ')
        else {
          const s = document.createElement('span')
          s.className = 'palavra'
          s.textContent = pedaco
          frag.append(s)
          saida.push(s)
        }
      }
      filho.replaceWith(frag)
    } else if (filho.nodeType === 1) parte(filho, saida)
  }
}

export function iniciaManifesto(calmo) {
  const frase = document.querySelector('[data-manifesto]')
  if (!frase) return
  const palavras = []
  parte(frase, palavras)
  if (calmo) return
  frase.classList.add('is-vivo')

  const n = palavras.length
  const ultimo = new Float32Array(n).fill(-1)

  aoRolar(() => {
    const r = frase.getBoundingClientRect()
    const vh = innerHeight
    // começa quando o topo da frase chega a 88% da tela; termina com o pé em 42%
    const ini = vh * 0.88
    const fim = vh * 0.42
    const p = Math.min(1, Math.max(0, (ini - r.top) / (ini - fim + r.height)))
    const cursor = p * (n + JANELA)
    for (let i = 0; i < n; i++) {
      const s = Math.min(1, Math.max(0, (cursor - i) / JANELA))
      const q = Math.round(s * 20) / 20
      if (q === ultimo[i]) continue
      ultimo[i] = q
      const el = palavras[i]
      el.style.opacity = (0.13 + 0.87 * q).toFixed(3)
      el.style.filter = q >= 1 ? 'none' : `blur(${(7 * (1 - q)).toFixed(2)}px)`
    }
  })
}
