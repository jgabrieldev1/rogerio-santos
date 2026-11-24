/* A geada: uma forma branca, nítida em cima e cada vez mais fosca para baixo,
   com um grão fino de vidro jateado, até sumir no fundo.

   criaGeada(canvas, { dono, caixa, pinta })
   - canvas: onde desenhar (cobre a cena);
   - dono: o elemento que guarda as medidas (--g-*) e as cores (--forma, --forma-fria);
   - caixa: o elemento que marca onde a forma fica (a altura dele = --g-alt unidades);
   - pinta(ctx, w, h, { cortes }): pinta a forma em branco num quadro w × h.

   A forma é pintada num canvas 2D no tamanho em que aparece na tela e vira uma
   textura com mipmaps, com duas versões: o desenho com os cortes (canal R) e a
   figura maciça (canal G). Para cada ponto, o desfoque cresce com a altura; o
   ponto lê a textura em 20 lugares, numa espiral com peso de sino que gira um
   ângulo sorteado em cada ponto: é isso que dá o grão. Onde está nítido vale o
   desenho; onde desfoca, a figura maciça.

   Só desenha quando algo muda: mexa em `estado` e chame `desenha()`.
   Devolve null sem WebGL2 (quem chama mostra a imagem no lugar). */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D tex;
uniform vec2 tela;        // tamanho do canvas, em px de dispositivo
uniform vec4 caixa;       // x, y, w, h da caixa da forma, em px de dispositivo (y para baixo)
uniform vec2 texTam;      // tamanho da textura
uniform float alt;        // unidades na altura da caixa
uniform vec2 foco;        // começo e máximo do desfoque, em unidades
uniform float sigma;      // desfoque máximo, em unidades
uniform float curva;
uniform vec2 some;        // começo e fim do sumiço, em unidades
uniform float grao;
uniform float giro;
uniform float cheia;
uniform float alfa;
uniform float base;       // desfoque somado em tudo, em unidades
uniform vec3 corForma;
uniform vec3 corFria;
out vec4 cor;

float sorteia(vec2 q) {
  q = fract(q * vec2(443.897, 441.423));
  q += dot(q, q.yx + 19.19);
  return fract((q.x + q.y) * q.x);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, tela.y - gl_FragCoord.y);
  vec2 uv = (px - caixa.xy) / caixa.zw;
  float pxPorUn = caixa.w / alt;
  float uy = uv.y * alt;

  float t = clamp((uy - foco.x) / max(foco.y - foco.x, 1.0), 0.0, 1.0);
  float sUn = base + sigma * pow(t, curva);
  float sPx = sUn * pxPorUn;                       // desfoque em px de tela
  float escTex = texTam.y / caixa.w;               // px de textura por px de tela
  float sTex = sPx * escTex;

  float giroP = sorteia(px) * 6.2831853 * giro;
  float lod = log2(max(1.0, sTex * 0.62));
  float somaR = 0.0, somaG = 0.0, somaP = 0.0;

  if (sPx < 0.35) {
    vec4 s = texture(tex, uv);
    float dentro = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    somaR = s.r * dentro; somaG = s.g * dentro; somaP = 1.0;
  } else {
    for (int i = 0; i < 20; i++) {
      float fi = float(i) + 0.5;
      float rn = sqrt(fi / 20.0);                  // espiral de área igual
      float solto = mix(1.0, 0.25 + 1.5 * sorteia(px + fi * 7.13), grao);
      float r = rn * 2.2 * sPx * solto;
      float a = fi * 2.3999632 + giroP;
      vec2 q = (px + vec2(cos(a), sin(a)) * r - caixa.xy) / caixa.zw;
      float peso = exp(-2.4 * rn * rn);            // sino
      float dentro = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
      vec4 s = textureLod(tex, q, lod);
      somaR += s.r * peso * dentro;
      somaG += s.g * peso * dentro;
      somaP += peso;
    }
  }
  float desenho = somaR / somaP;
  float macica = somaG / somaP;
  float k = smoothstep(0.0, cheia, sUn);
  float a = mix(desenho, macica, k);

  a *= 1.0 - smoothstep(some.x, some.y, uy);
  a *= alfa;
  vec3 c = mix(corForma, corFria, smoothstep(0.0, 1.0, t) * 0.85);
  cor = vec4(c * a, a);
}`

function leCor(str) {
  const c = document.createElement('canvas').getContext('2d')
  c.fillStyle = '#000'
  c.fillStyle = str.trim() || '#fff'
  const hex = c.fillStyle
  if (hex.startsWith('#')) {
    const n = parseInt(hex.slice(1), 16)
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
  }
  const m = hex.match(/[\d.]+/g) || [255, 255, 255]
  return [m[0] / 255, m[1] / 255, m[2] / 255]
}

export function criaGeada(canvas, { dono, caixa, pinta }) {
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true })
  if (!gl) return null

  const sh = (tipo, src) => {
    const s = gl.createShader(tipo)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
    return s
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const U = {}
  for (const n of ['tex', 'tela', 'caixa', 'texTam', 'alt', 'foco', 'sigma', 'curva', 'some', 'grao', 'giro', 'cheia', 'alfa', 'base', 'corForma', 'corFria']) {
    U[n] = gl.getUniformLocation(prog, n)
  }

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const estado = { alfa: 0, base: 0, foco: 0, focoPonteiro: 0, focoRola: 0, x: 0, y: 0, escala: 1 }
  const m = { dpr: 1, cw: 0, ch: 0, bx: 0, by: 0, bw: 0, bh: 0, tw: 0, th: 0, g: {}, corForma: [1, 1, 1], corFria: [1, 1, 1] }
  let pedido = 0

  function repinta() {
    const maxLado = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), 2560)
    let tw = Math.max(2, Math.round(m.bw))
    let th = Math.max(2, Math.round(m.bh))
    const r = Math.min(1, maxLado / Math.max(tw, th))
    tw = Math.round(tw * r)
    th = Math.round(th * r)
    m.tw = tw
    m.th = th
    const cv = document.createElement('canvas')
    cv.width = tw
    cv.height = th
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    pinta(ctx, tw, th, { cortes: true })
    const desenho = ctx.getImageData(0, 0, tw, th).data
    ctx.clearRect(0, 0, tw, th)
    pinta(ctx, tw, th, { cortes: false })
    const macica = ctx.getImageData(0, 0, tw, th).data
    const px = new Uint8Array(tw * th * 4)
    for (let i = 0; i < px.length; i += 4) {
      px[i] = desenho[i + 3]
      px[i + 1] = macica[i + 3]
      px[i + 3] = 255
    }
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, px)
    gl.generateMipmap(gl.TEXTURE_2D)
    desenha()
  }

  function mede() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rc = canvas.getBoundingClientRect()
    const rb = caixa.getBoundingClientRect()
    const cw = Math.max(1, Math.round(rc.width * dpr))
    const ch = Math.max(1, Math.round(rc.height * dpr))
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw
      canvas.height = ch
    }
    const bwAntes = m.bw
    const bhAntes = m.bh
    Object.assign(m, {
      dpr, cw, ch,
      bx: (rb.left - rc.left) * dpr,
      by: (rb.top - rc.top) * dpr,
      bw: rb.width * dpr,
      bh: rb.height * dpr,
    })
    const cs = getComputedStyle(dono)
    const n = (v, padrao) => {
      const x = parseFloat(cs.getPropertyValue(v))
      return Number.isFinite(x) ? x : padrao
    }
    m.g = {
      alt: n('--g-alt', 100), foco0: n('--g-foco-0', 30), foco1: n('--g-foco-1', 80),
      sigma: n('--g-sigma', 8), curva: n('--g-curva', 1), some0: n('--g-some-0', 90),
      some1: n('--g-some-1', 100), grao: n('--g-grao', 0.1), giro: n('--g-giro', 1), cheia: n('--g-cheia', 5),
    }
    m.corForma = leCor(cs.getPropertyValue('--forma'))
    m.corFria = leCor(cs.getPropertyValue('--forma-fria'))
    if (Math.abs(bwAntes - m.bw) > 1 || Math.abs(bhAntes - m.bh) > 1 || !m.tw) repinta()
    else desenha()
  }

  function quadro() {
    pedido = 0
    const g = m.g
    const e = estado
    gl.viewport(0, 0, m.cw, m.ch)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (e.alfa <= 0.001) return
    const bw = m.bw * e.escala
    const bh = m.bh * e.escala
    const bx = m.bx + (m.bw - bw) / 2 + e.x * m.dpr
    const by = m.by + (m.bh - bh) / 2 + e.y * m.dpr
    const desloca = e.foco + e.focoPonteiro + e.focoRola
    gl.uniform1i(U.tex, 0)
    gl.uniform2f(U.tela, m.cw, m.ch)
    gl.uniform4f(U.caixa, bx, by, bw, bh)
    gl.uniform2f(U.texTam, m.tw, m.th)
    gl.uniform1f(U.alt, g.alt)
    gl.uniform2f(U.foco, g.foco0 + desloca, g.foco1 + desloca)
    gl.uniform1f(U.sigma, g.sigma)
    gl.uniform1f(U.curva, g.curva)
    gl.uniform2f(U.some, g.some0, g.some1)
    gl.uniform1f(U.grao, g.grao)
    gl.uniform1f(U.giro, g.giro)
    gl.uniform1f(U.cheia, g.cheia)
    gl.uniform1f(U.alfa, Math.min(1, e.alfa))
    gl.uniform1f(U.base, Math.max(0, e.base))
    gl.uniform3fv(U.corForma, m.corForma)
    gl.uniform3fv(U.corFria, m.corFria)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function desenha() {
    if (!pedido) pedido = requestAnimationFrame(quadro)
  }

  /* desenha já, no mesmo quadro (para quem anima pelo ticker do GSAP) */
  function agora() {
    if (pedido) cancelAnimationFrame(pedido)
    quadro()
  }

  return { estado, mede, desenha, agora, repinta }
}
