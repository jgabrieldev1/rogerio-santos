/* A ficha de contato: confere, mostra o erro, mostra a confirmação.
   - no foco o fio acende e o rótulo clareia (contato.css);
   - sem nome ou com telefone curto: o fio fica vermelho e um texto diz como resolver;
   - certa: os campos somem no fosco e entra a confirmação.
   O envio de verdade está em envia(): abre o WhatsApp do escritório com a
   mensagem pronta (o número está no data-whatsapp da ficha). */
const DDD_E_NUMERO = 10

function envia(ficha, dados) {
  const numero = ficha.dataset.whatsapp
  if (!numero) return
  const texto = [
    `Olá, Dr. Rogério. Meu nome é ${dados.nome}.`,
    `Telefone: ${dados.telefone}.`,
    dados.caso ? `O que aconteceu: ${dados.caso}` : '',
  ].filter(Boolean).join('\n')
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
}

export function iniciaContato() {
  const ficha = document.querySelector('[data-ficha]')
  if (!ficha) return
  const campos = {
    nome: ficha.querySelector('[name="nome"]'),
    telefone: ficha.querySelector('[name="telefone"]'),
    caso: ficha.querySelector('[name="caso"]'),
  }

  const erro = (campo, msg) => {
    const linha = campo.closest('.campo')
    const aviso = linha.querySelector('.campo__erro')
    linha.classList.toggle('is-erro', !!msg)
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false')
    aviso.textContent = msg || ''
  }

  // máscara leve do telefone: (65) 99999-9999
  campos.telefone.addEventListener('input', () => {
    const d = campos.telefone.value.replace(/\D/g, '').slice(0, 11)
    let v = d
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`
    campos.telefone.value = v
    if (campos.telefone.closest('.is-erro') && d.length >= DDD_E_NUMERO) erro(campos.telefone)
  })
  campos.nome.addEventListener('input', () => {
    if (campos.nome.value.trim().length >= 2) erro(campos.nome)
  })

  ficha.addEventListener('submit', (ev) => {
    ev.preventDefault()
    const nome = campos.nome.value.trim()
    const tel = campos.telefone.value.replace(/\D/g, '')
    let primeiro = null
    if (nome.length < 2) {
      erro(campos.nome, 'Escreva o seu nome para eu saber com quem falo.')
      primeiro ||= campos.nome
    } else erro(campos.nome)
    if (tel.length < DDD_E_NUMERO) {
      erro(campos.telefone, 'Coloque o telefone com DDD, como (65) 99999-9999.')
      primeiro ||= campos.telefone
    } else erro(campos.telefone)
    if (primeiro) {
      primeiro.focus()
      return
    }
    envia(ficha, { nome, telefone: campos.telefone.value, caso: campos.caso.value.trim() })
    ficha.classList.add('is-enviada')
    const ok = ficha.querySelector('.ficha__ok')
    ok.hidden = false
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ok.classList.add('is-vista')
      ok.focus()
    }))
  })
}
