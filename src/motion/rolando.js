/* Põe `is-scrolling` no <html> enquanto a página rola e tira 160 ms depois
   que ela para. As regras de hover das listas só valem sem essa classe: com o
   cursor parado, a rolagem não acende linha nenhuma. */
export function iniciaRolando() {
  const html = document.documentElement
  let t = 0
  addEventListener('scroll', () => {
    if (!t) html.classList.add('is-scrolling')
    clearTimeout(t)
    t = setTimeout(() => {
      html.classList.remove('is-scrolling')
      t = 0
    }, 160)
  }, { passive: true })
}
