/* A abertura do hero, por tempo (2,7 s). Do escuro nasce uma mancha fosca
   (0,7 s); o foco desce do alto em 1,7 s e a estátua aparece; o advogado
   aparece aos 0,5 s e sobe 54 px em 1,7 s, saindo do fosco de cima para baixo;
   as duas palavras do título saem de trás dele a partir de 1,05 s, reveladas do
   miolo para fora com a borda fosca; o topo assenta aos 1,3 s; nome, apoio e
   botão a partir de 1,45 s. Roda, toque, tecla ou clique aceleram tudo sete
   vezes. No fim, devolve a posição das peças ao CSS (clearProps).

   A posição do retrato e das palavras anda por variáveis (--sobe, --desliza),
   porque o CSS delas já usa `translate`: o GSAP não escreve por cima. */
import { gsap } from './ease.js'

const html = document.documentElement

export function tocaAbertura({ hero, geada, aoFim }) {
  const retrato = hero.querySelector('[data-retrato]')
  const palavras = [...hero.querySelectorAll('[data-palavra]')]
  const abre = [...hero.querySelectorAll('[data-abre]')]
  const topo = document.querySelector('[data-abre-topo]')
  const u = Math.min(innerWidth / 1440, innerHeight / 840)
  const celular = matchMedia('(max-width: 760px)').matches
  const e = geada?.estado

  // estado de partida: tudo zerado, nada herdado do CSS
  if (e) Object.assign(e, { alfa: 0, base: 46, foco: -760 })
  gsap.set(retrato, { opacity: 0, '--sobe': `${54 * (celular ? 0.8 : u)}px`, '--rev': 0, '--nublado': '14px' })
  palavras.forEach((p, i) => gsap.set(p, {
    opacity: 0, '--rev': 0, filter: 'blur(10px)',
    '--desliza': celular ? '0px' : `${(i === 0 ? 1 : -1) * 90 * u}px`,
    '--desliza-y': celular ? '18px' : '0px',
  }))
  gsap.set(abre, { opacity: 0, y: 18, filter: 'blur(9px)' })
  if (topo) gsap.set(topo, { opacity: 0, y: -12, filter: 'blur(9px)' })
  html.classList.add('aberto')
  geada?.agora()

  const tl = gsap.timeline({
    onUpdate: () => geada?.agora(),
    onComplete: () => {
      gsap.set([retrato, ...palavras], { clearProps: 'opacity,filter,--sobe,--rev,--nublado,--desliza,--desliza-y' })
      gsap.set([...abre, topo].filter(Boolean), { clearProps: 'transform,translate,opacity,filter' })
      if (e) Object.assign(e, { alfa: 1, base: 0, foco: 0 })
      geada?.desenha()
      tira()
      aoFim?.()
    },
  })

  if (e) {
    tl.to(e, { alfa: 1, duration: 0.7, ease: 'out' }, 0)
    tl.to(e, { foco: 0, base: 0, duration: 1.7, ease: 'foco' }, 0.25)
  }
  tl.to(retrato, { opacity: 1, duration: 0.7, ease: 'out' }, 0.5)
  tl.to(retrato, { '--sobe': '0px', duration: 1.7, ease: 'out' }, 0.5)
  tl.to(retrato, { '--rev': 1, '--nublado': '0px', duration: 1.5, ease: 'out' }, 0.5)
  tl.to(palavras, { opacity: 1, duration: 0.5, ease: 'out' }, 1.05)
  tl.to(palavras, { '--rev': 1, '--desliza': '0px', '--desliza-y': '0px', filter: 'blur(0px)', duration: 1.15, ease: 'out' }, 1.05)
  if (topo) tl.to(topo, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'out' }, 1.3)
  tl.to(abre, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, ease: 'out', stagger: 0.06 }, 1.45)

  // qualquer gesto leva ao fim, sete vezes mais rápido
  const acelera = () => { tl.timeScale(7); tira() }
  const gestos = ['wheel', 'touchstart', 'keydown', 'pointerdown']
  gestos.forEach((g) => addEventListener(g, acelera, { passive: true, once: true }))
  function tira() { gestos.forEach((g) => removeEventListener(g, acelera)) }

  return tl
}

/* sem abertura (?pronto, link de seção ou movimento reduzido): a tela só acende */
export function semAbertura({ geada, calmo }) {
  if (geada) {
    Object.assign(geada.estado, { alfa: calmo ? 0 : 1, base: 0, foco: 0 })
    if (calmo) gsap.to(geada.estado, { alfa: 1, duration: 0.6, ease: 'none', onUpdate: geada.desenha })
    geada.desenha()
  }
  if (calmo) {
    const pecas = document.querySelectorAll('[data-abre], [data-abre-topo]')
    gsap.fromTo(pecas, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'none', clearProps: 'opacity' })
  }
  html.classList.add('aberto')
}
