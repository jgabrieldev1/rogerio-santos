/* O hero acompanha o mouse (só com mouse). O advogado anda um pouco contra o
   cursor, o título menos e a estátua para o outro lado, numa mola pouco
   amortecida; descendo o mouse, a estátua fica nítida mais para baixo.
   O laço só roda enquanto a mola não assentou. */
export function iniciaPonteiro(hero, geada) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const alvo = { x: 0, y: 0 }
  const pos = { x: 0, y: 0 }
  const vel = { x: 0, y: 0 }
  const K = 70
  const AMORTECE = 9
  let laco = 0
  let antes = 0
  let ligado = false

  const passo = (t) => {
    const dt = Math.min(0.033, (t - antes) / 1000 || 0.016)
    antes = t
    for (const k of ['x', 'y']) {
      const a = K * (alvo[k] - pos[k]) - AMORTECE * vel[k]
      vel[k] += a * dt
      pos[k] += vel[k] * dt
    }
    const u = Math.min(innerWidth / 1440, innerHeight / 840)
    hero.style.setProperty('--px-retrato', `${(-pos.x * 16 * u).toFixed(2)}px`)
    hero.style.setProperty('--px-titulo', `${(-pos.x * 7 * u).toFixed(2)}px`)
    if (geada) {
      geada.estado.x = pos.x * 12 * u
      geada.estado.focoPonteiro = pos.y * 110
      geada.desenha()
    }
    const parado = Math.abs(alvo.x - pos.x) + Math.abs(alvo.y - pos.y) < 0.001 && Math.abs(vel.x) + Math.abs(vel.y) < 0.001
    laco = parado ? 0 : requestAnimationFrame(passo)
  }

  const acorda = () => {
    if (!laco) {
      antes = performance.now()
      laco = requestAnimationFrame(passo)
    }
  }

  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !ligado) return
    const r = hero.getBoundingClientRect()
    alvo.x = (e.clientX - r.left) / r.width * 2 - 1
    alvo.y = (e.clientY - r.top) / r.height * 2 - 1
    acorda()
  })
  hero.addEventListener('pointerleave', () => {
    alvo.x = 0
    alvo.y = 0
    acorda()
  })

  return { liga: () => { ligado = true } }
}
