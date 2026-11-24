// Grava public/img/justica.svg (a estátua sem WebGL) a partir de src/gl/justica.js.
// Uso: node scripts/justica-svg.mjs
import { writeFileSync } from 'node:fs'
import { FORMA, CORTES, LARGURA, ALTURA } from '../src/gl/justica.js'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARGURA} ${ALTURA}" width="${LARGURA}" height="${ALTURA}">
<defs><mask id="c"><rect width="${LARGURA}" height="${ALTURA}" fill="#fff"/>
<g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">
${CORTES.map((c) => `<path d="${c.d}" stroke-width="${c.w}"/>`).join('\n')}
</g></mask></defs>
<g fill="#eef1f4" stroke="#eef1f4" stroke-linecap="round" stroke-linejoin="round" mask="url(#c)">
${FORMA.map((f) => (typeof f === 'string' ? `<path d="${f}" stroke="none"/>` : `<path d="${f.d}" fill="none" stroke-width="${f.w}"/>`)).join('\n')}
</g>
</svg>
`
writeFileSync(new URL('../public/img/justica.svg', import.meta.url), svg)
console.log('public/img/justica.svg')
