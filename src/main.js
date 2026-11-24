/* Liga tudo. Cria a geada do hero, a rolagem e as seções; espera as fontes e o
   retrato decodificado e só então toca a abertura; no tempo livre, cria a
   geada do rodapé; mede tudo de novo quando a tela muda.
   CSS nunca entra por aqui: a folha única vem pelo <link> do <head>. */
import { criaGeada } from './gl/geada.js'
import { pintaJustica, justicaPronta } from './gl/justica.js'
import { tocaAbertura, semAbertura } from './motion/abertura.js'
import { igualaTitulo } from './motion/titulo.js'
import { iniciaPonteiro } from './motion/ponteiro.js'
import { iniciaRolagem, aoRolar } from './motion/rolagem.js'
import { iniciaRolando } from './motion/rolando.js'
import { iniciaRevela } from './motion/revela.js'
import { iniciaManifesto } from './motion/manifesto.js'
import { iniciaTopo } from './motion/topo.js'
import { iniciaDuvidas } from './motion/duvidas.js'
import { iniciaContato } from './motion/contato.js'
import { iniciaFecho } from './motion/fecho.js'
import { iniciaGrao } from './motion/grao.js'

/* o que a abertura espera (a fonte do título e as do texto) */
const FONTES = [
  '900 100px "Sofia Sans Extra Condensed Variable"',
  '400 16px "Sofia Sans Variable"',
  'italic 400 22px "Libre Caslon Text"',
  '400 22px "Libre Caslon Text"',
]

const html = document.documentElement
html.classList.add('vivo')
const calmo = html.classList.contains('calmo')
const pulaAbertura = html.classList.contains('sem-abertura')

// nada tem transição no primeiro quadro: a trava sai dois quadros depois
requestAnimationFrame(() => requestAnimationFrame(() => html.classList.add('assentou')))

const hero = document.querySelector('.hero')
const palavras = [...hero.querySelectorAll('[data-palavra]')]
const retrato = hero.querySelector('.hero__foto--nitida')
const celular = () => matchMedia('(max-width: 760px)').matches

iniciaGrao()
iniciaRolagem({ calmo })
iniciaRolando()
iniciaTopo()
iniciaRevela()
iniciaManifesto(calmo)
iniciaDuvidas()
iniciaContato()

/* a geada do hero */
let geada = null
try {
  geada = criaGeada(hero.querySelector('.hero__geada'), {
    dono: hero,
    caixa: hero.querySelector('[data-caixa]'),
    pinta: pintaJustica(),
  })
} catch (err) {
  geada = null
}
if (!geada) hero.classList.add('sem-gl')

/* celular: a cena ocupa a sobra da tela acima dos textos (--c) */
function acertaCena() {
  if (!celular()) {
    hero.style.removeProperty('--c')
    return
  }
  const texto = hero.querySelector('.hero__texto')
  const cs = getComputedStyle(hero)
  const alt = parseFloat(cs.getPropertyValue('--cena-alt')) || 470
  const tam = parseFloat(getComputedStyle(palavras[0]).fontSize)
  const sobra = hero.clientHeight - texto.offsetHeight - parseFloat(cs.paddingBottom) + tam * 1.15
  const c = Math.max(0.5, Math.min(innerWidth / 390, sobra / alt))
  hero.style.setProperty('--c', `${c.toFixed(4)}px`)
}

function mede() {
  acertaCena()
  igualaTitulo(palavras)
  geada?.mede()
}

/* saindo do hero, a geada sobe: a estátua fica fosca de baixo para cima */
if (geada) {
  aoRolar((y) => {
    const h = hero.offsetHeight
    if (y > h * 1.1 && geada.estado.focoRola <= -700) return
    const p = Math.min(1, Math.max(0, y / h))
    geada.estado.focoRola = -720 * p
    geada.desenha()
  })
}

const ponteiro = iniciaPonteiro(hero, geada)

async function espera() {
  const fontes = Promise.all(FONTES.map((f) => document.fonts.load(f))).catch(() => {})
  const foto = retrato.decode ? retrato.decode().catch(() => {}) : Promise.resolve()
  await Promise.race([Promise.all([fontes, foto, justicaPronta]), new Promise((r) => setTimeout(r, 3200))])
}

acertaCena()
await espera()
mede()

if (pulaAbertura || calmo) {
  semAbertura({ geada, calmo })
  ponteiro?.liga()
} else {
  tocaAbertura({ hero, geada, aoFim: () => ponteiro?.liga() })
}

/* o rodapé, no tempo livre */
let fecho = null
const tempoLivre = window.requestIdleCallback || ((f) => setTimeout(f, 300))
tempoLivre(() => { fecho = iniciaFecho(calmo) })

/* a tela mudou: mede tudo de novo */
let espera_ = 0
let larguraAntes = innerWidth
let alturaAntes = innerHeight
addEventListener('resize', () => {
  clearTimeout(espera_)
  espera_ = setTimeout(() => {
    // no celular, a barra do navegador mexe só na altura: o hero usa svh e não precisa
    if (celular() && innerWidth === larguraAntes && Math.abs(innerHeight - alturaAntes) < 140) return
    larguraAntes = innerWidth
    alturaAntes = innerHeight
    mede()
    fecho?.mede()
  }, 120)
})
