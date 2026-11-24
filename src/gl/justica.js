/* A estátua da Justiça em curvas, num quadro de 1200 × 1751 unidades.
   Frente, cabeça vendada no eixo; a espada erguida à esquerda, a balança à
   direita, de modo que as laterais ficam livres. O que interessa (espada,
   cabeça, balança) fica acima do queixo (472), onde a geada é nítida.

   FORMA: o que é branco. CORTES: linhas de dentro (a venda, o cabelo, as
   dobras), que aparecem só onde a forma está nítida; a figura maciça não tem.
   O mesmo desenho gera public/img/justica.svg (scripts/justica-svg.mjs). */

export const LARGURA = 1200
export const ALTURA = 1751

export const FORMA = [
  // cabelo e cabeça
  'M600 214 C540 214 498 262 496 330 C494 384 500 430 520 470 C534 500 556 520 600 524 C644 520 666 500 680 470 C700 430 706 384 704 330 C702 262 660 214 600 214 Z',
  // coque
  'M600 168 C628 168 646 186 646 210 C646 232 630 246 600 246 C570 246 554 232 554 210 C554 186 572 168 600 168 Z',
  // mechas que caem nos ombros
  'M508 400 C500 460 486 520 470 566 L520 574 C530 530 534 470 532 420 Z',
  'M692 400 C700 460 714 520 730 566 L680 574 C670 530 666 470 668 420 Z',
  // as pontas da venda, soltas ao vento, à direita da cabeça
  'M700 332 C744 330 790 344 822 372 C790 366 756 364 724 372 C756 384 782 404 798 430 C764 410 730 398 698 392 Z',
  // pescoço
  'M566 500 L634 500 L642 576 L558 576 Z',
  // tronco e manto, que se abre até o pé do quadro
  'M452 566 C500 540 700 540 748 566 C800 594 826 640 826 720 C826 820 846 1000 872 1200 C900 1420 930 1600 948 1751 L252 1751 C270 1600 300 1420 328 1200 C354 1000 374 820 374 720 C374 640 400 594 452 566 Z',
  // braço esquerdo erguido (segura a espada): ombro, cotovelo, mão
  'M470 584 C440 560 404 528 380 490 C360 456 340 404 326 352 L300 340 C306 404 322 470 348 520 C376 574 420 620 470 646 Z',
  // a manga que pende do braço esquerdo
  'M466 600 C430 612 396 640 380 690 C400 676 430 668 470 668 Z',
  // mão esquerda
  'M296 300 C312 290 336 290 350 304 C358 322 356 344 342 358 C324 366 304 362 294 348 C284 332 286 312 296 300 Z',
  // a espada: punho, guarda e lâmina
  'M314 286 L338 286 L340 362 L312 362 Z',
  'M322 372 C334 372 342 380 342 390 C342 400 334 408 322 408 C310 408 302 400 302 390 C302 380 310 372 322 372 Z',
  'M262 270 L386 270 C392 270 396 274 396 280 C396 286 392 290 386 290 L262 290 C256 290 252 286 252 280 C252 274 256 270 262 270 Z',
  'M312 270 L340 270 L336 70 L326 22 L316 70 Z',
  // braço direito erguido (segura a balança)
  'M730 584 C760 560 800 526 826 486 C846 452 860 410 872 368 L898 378 C892 436 878 486 856 528 C826 582 782 622 730 646 Z',
  'M734 600 C770 612 804 640 820 690 C800 676 770 668 730 668 Z',
  // mão direita
  'M862 342 C878 330 902 330 914 346 C922 364 918 386 904 396 C886 404 866 400 856 386 C846 370 850 352 862 342 Z',
  // a balança: haste, argola, travessão
  'M880 196 L892 196 L892 350 L880 350 Z',
  'M886 160 C898 160 908 170 908 182 C908 194 898 204 886 204 C874 204 864 194 864 182 C864 170 874 160 886 160 Z',
  'M740 196 C800 186 972 186 1032 196 L1032 210 C972 202 800 202 740 210 Z',
  // correntes do prato esquerdo
  'M738 206 L742 206 L702 432 L697 432 Z',
  'M740 206 L744 206 L782 432 L777 432 Z',
  // correntes do prato direito
  'M1030 206 L1034 206 L994 448 L989 448 Z',
  'M1032 206 L1036 206 L1074 448 L1069 448 Z',
  // pratos (o direito mais baixo: a balança em movimento)
  'M680 428 L800 428 C796 460 772 478 740 478 C708 478 684 460 680 428 Z',
  'M972 444 L1092 444 C1088 476 1064 494 1032 494 C1000 494 976 476 972 444 Z',
]

export const CORTES = [
  // a venda (duas linhas que atravessam o rosto)
  { d: 'M500 318 C560 330 640 330 702 318', w: 7 },
  { d: 'M502 362 C560 374 640 374 700 362', w: 7 },
  // a linha do cabelo
  { d: 'M520 300 C540 254 580 236 600 236 C620 236 660 254 680 300', w: 5 },
  // o rosto separado do cabelo
  { d: 'M528 340 C528 420 556 486 600 492 C644 486 672 420 672 340', w: 4 },
  // a gola do manto e o cinto
  { d: 'M520 574 C560 616 640 616 680 574', w: 6 },
  { d: 'M600 600 L600 760', w: 4 },
  { d: 'M396 760 C500 784 700 784 804 760', w: 7 },
  // as dobras do manto
  { d: 'M470 800 C462 1000 440 1300 400 1751', w: 5 },
  { d: 'M540 806 C540 1000 532 1300 520 1751', w: 4 },
  { d: 'M660 806 C660 1000 668 1300 680 1751', w: 4 },
  { d: 'M730 800 C738 1000 760 1300 800 1751', w: 5 },
  // o braço separado do tronco
  { d: 'M462 594 C440 640 420 700 410 760', w: 4 },
  { d: 'M738 594 C760 640 780 700 790 760', w: 4 },
  // o filete da lâmina
  { d: 'M326 268 L326 76', w: 3 },
]

/* Devolve a função de pintura que a geada usa:
   pinta(ctx, w, h, { cortes }) desenha a estátua cheia no quadro w × h. */
export function pintaJustica() {
  const forma = FORMA.map((d) => new Path2D(d))
  const cortes = CORTES.map((c) => ({ p: new Path2D(c.d), w: c.w }))
  return (ctx, w, h, { cortes: comCortes = true } = {}) => {
    ctx.save()
    ctx.scale(w / LARGURA, h / ALTURA)
    ctx.fillStyle = '#fff'
    for (const p of forma) ctx.fill(p)
    if (comCortes) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const c of cortes) {
        ctx.lineWidth = c.w
        ctx.stroke(c.p)
      }
    }
    ctx.restore()
  }
}
