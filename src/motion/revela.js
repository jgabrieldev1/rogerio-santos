/* A entrada pela rolagem: tudo sai do fosco. A peça com data-revela nasce
   apagada, desfocada e um pouco abaixo (base.css); quando aponta no pé da tela
   ganha .revelou e assenta. Dentro de um data-revela-grupo as peças entram uma
   atrás da outra, a cada 50 ms. Uma vez só. Depois de assentar, a peça ganha
   .assentado e larga o filtro. */
export function iniciaRevela() {
  const pecas = [...document.querySelectorAll('[data-revela]')]
  for (const g of document.querySelectorAll('[data-revela-grupo]')) {
    g.querySelectorAll('[data-revela]').forEach((el, i) => el.style.setProperty('--ordem', i))
  }

  const assenta = (el) => {
    el.classList.add('revelou')
    const fim = () => el.classList.add('assentado')
    el.addEventListener('transitionend', (e) => { if (e.propertyName === 'translate' || e.propertyName === 'opacity') fim() }, { once: true })
    setTimeout(fim, 1400 + (parseFloat(el.style.getPropertyValue('--ordem')) || 0) * 50)
  }

  if (!('IntersectionObserver' in window)) {
    pecas.forEach(assenta)
    return
  }

  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (e.isIntersecting) {
        io.unobserve(e.target)
        assenta(e.target)
      }
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 })

  pecas.forEach((el) => io.observe(el))
}
