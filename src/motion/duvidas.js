/* A sanfona das dúvidas: uma aberta por vez. O painel cresce em 0,55 s e a
   resposta sai do fosco (duvidas.css); o sinal de mais deita. */
export function iniciaDuvidas() {
  const botoes = [...document.querySelectorAll('.duvida__botao')]
  const abre = (b, sim) => {
    b.setAttribute('aria-expanded', String(sim))
    b.closest('.duvida').classList.toggle('is-aberta', sim)
    const painel = document.getElementById(b.getAttribute('aria-controls'))
    if (painel) painel.toggleAttribute('inert', !sim)
  }
  botoes.forEach((b) => {
    abre(b, b.getAttribute('aria-expanded') === 'true')
    b.addEventListener('click', () => {
      const vai = b.getAttribute('aria-expanded') !== 'true'
      botoes.forEach((o) => { if (o !== b) abre(o, false) })
      abre(b, vai)
    })
  })
}
