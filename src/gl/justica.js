/* A estátua da Justiça em curvas, num quadro de 1200 × 1751 unidades.
   De frente, cabeça vendada no eixo, o cabelo preso num coque, os ombros nus
   e um manto clássico; à esquerda, a espada erguida no punho ao lado do rosto;
   à direita, o braço estendido para o alto segura a balança pela argola, com
   os pratos na altura dos ombros. As laterais ficam livres. O que interessa (espada, cabeça, balança)
   fica acima do queixo (472), onde a geada é nítida.

   FORMA: o que é branco. Uma string é preenchida; { d, w } é um traço de
   largura w (braços e correntes).
   CORTES: linhas de dentro (a venda, o rosto, o cabelo, as dobras), que
   aparecem só onde a forma está nítida; a figura maciça não tem.
   O mesmo desenho gera public/img/justica.svg (scripts/justica-svg.mjs). */

export const LARGURA = 1200
export const ALTURA = 1751

export const FORMA = [
  // ——— cabeça: o cabelo preso para trás e o coque no alto
  'M600 236 C552 236 518 276 516 332 C514 396 540 452 576 470 C584 474 592 476 600 476 C608 476 616 474 624 470 C660 452 686 396 684 332 C682 276 648 236 600 236 Z',
  'M600 160 C630 160 652 180 652 206 C652 230 632 248 600 248 C568 248 548 230 548 206 C548 180 570 160 600 160 Z',
  'M572 236 L628 236 L624 252 L576 252 Z',
  // as pontas da venda, soltas ao vento, à direita da cabeça
  'M680 334 C716 330 748 336 776 352 C750 352 724 356 704 364 C726 372 744 388 756 410 C730 396 706 388 682 384 Z',
  // pescoço e ombros nus
  'M570 462 L630 462 L640 548 L560 548 Z',
  // tronco, decote reto e a saia que se abre até o pé do quadro
  'M452 590 C486 566 532 552 568 544 L632 544 C668 552 714 566 748 590 C784 614 798 664 792 724 C786 792 764 842 758 900 C784 1100 844 1400 904 1751 L296 1751 C356 1400 416 1100 442 900 C436 842 414 792 408 724 C402 664 416 614 452 590 Z',
  // braço esquerdo: o cotovelo baixo, o antebraço sobe até o punho ao lado do rosto
  { d: 'M470 606 C420 590 376 566 352 528', w: 50 },
  { d: 'M352 528 C334 500 324 470 324 446', w: 42 },
  // mão esquerda, fechada no punho da espada
  'M296 420 C300 400 318 392 334 396 C352 402 358 422 354 442 C350 460 334 468 318 464 C302 458 292 440 296 420 Z',
  // a espada: pomo, punho, guarda e lâmina, erguida acima da cabeça
  'M324 466 C333 466 340 473 340 482 C340 491 333 498 324 498 C315 498 308 491 308 482 C308 473 315 466 324 466 Z',
  'M316 384 L332 384 L332 468 L316 468 Z',
  'M262 378 C290 370 358 370 386 378 L386 392 C358 386 290 386 262 392 Z',
  'M262 376 C268 376 272 381 272 386 C272 392 268 396 262 396 C256 396 252 392 252 386 C252 381 256 376 262 376 Z',
  'M386 376 C392 376 396 381 396 386 C396 392 392 396 386 396 C380 396 376 392 376 386 C376 381 380 376 386 376 Z',
  'M309 378 L339 378 L334 64 L324 18 L314 64 Z',
  // braço direito: estendido para o alto, à direita
  { d: 'M730 606 C790 586 846 548 884 492', w: 48 },
  { d: 'M884 492 C914 444 940 390 950 320', w: 40 },
  // mão direita, que segura a argola da balança
  'M928 296 C932 278 950 270 966 276 C980 284 984 302 978 318 C970 334 952 338 938 330 C926 322 924 310 928 296 Z',
  // a balança: argola na mão, haste, travessão com remates
  'M954 236 C967 236 978 247 978 260 C978 273 967 284 954 284 C941 284 930 273 930 260 C930 247 941 236 954 236 Z',
  'M946 330 L958 330 L958 362 L946 362 Z',
  'M832 356 C892 348 1012 348 1072 356 L1072 368 C1012 362 892 362 832 368 Z',
  'M832 350 C840 350 846 356 846 362 C846 369 840 374 832 374 C824 374 818 369 818 362 C818 356 824 350 832 350 Z',
  'M1072 350 C1080 350 1086 356 1086 362 C1086 369 1080 374 1072 374 C1064 374 1058 369 1058 362 C1058 356 1064 350 1072 350 Z',
  'M952 346 L962 362 L952 378 L942 362 Z',
  // correntes
  { d: 'M832 370 L782 470', w: 4 },
  { d: 'M832 370 L882 470', w: 4 },
  { d: 'M1072 370 L1022 470', w: 4 },
  { d: 'M1072 370 L1122 470', w: 4 },
  // pratos
  'M776 470 L888 470 C884 500 862 516 832 516 C802 516 780 500 776 470 Z',
  'M1016 470 L1128 470 C1124 500 1102 516 1072 516 C1042 516 1020 500 1016 470 Z',
]

export const CORTES = [
  // a venda: a faixa sobre os olhos
  { d: 'M518 332 C566 344 634 344 682 332', w: 6 },
  { d: 'M520 368 C568 380 632 380 680 368', w: 6 },
  { d: 'M684 340 C716 344 742 350 770 352', w: 3 },
  // a linha do cabelo, puxado para trás, e as mechas até o coque
  { d: 'M526 318 C540 276 572 258 600 258 C628 258 660 276 674 318', w: 5 },
  { d: 'M572 182 C588 200 612 200 628 182', w: 3 },
  { d: 'M574 238 C590 244 610 244 626 238', w: 4 },
  // nariz e boca, de leve
  { d: 'M602 392 C598 410 596 420 606 428', w: 3 },
  { d: 'M586 448 C596 452 604 452 614 448', w: 4 },
  // o queixo e o pescoço
  { d: 'M572 470 C580 490 584 512 582 540', w: 3 },
  { d: 'M628 470 C620 490 616 512 618 540', w: 3 },
  // as clavículas e o decote reto dos ombros nus
  { d: 'M520 586 C548 580 572 586 592 596', w: 4 },
  { d: 'M680 586 C652 580 628 586 608 596', w: 4 },
  { d: 'M430 652 C520 672 680 672 770 652', w: 6 },
  { d: 'M470 700 C540 760 640 790 760 800', w: 4 },
  // o cinto
  { d: 'M444 892 C540 914 660 914 756 892', w: 7 },
  // as dobras do manto
  { d: 'M476 930 C462 1150 430 1420 392 1751', w: 5 },
  { d: 'M540 930 C536 1150 524 1420 510 1751', w: 4 },
  { d: 'M600 930 C600 1150 600 1420 600 1751', w: 3 },
  { d: 'M660 930 C664 1150 676 1420 690 1751', w: 4 },
  { d: 'M724 930 C738 1150 770 1420 808 1751', w: 5 },
  // o filete da lâmina e o furo da argola
  { d: 'M324 370 L324 74', w: 3 },
  { d: 'M954 250 C960 250 964 255 964 260 C964 265 960 270 954 270 C948 270 944 265 944 260 C944 255 948 250 954 250 Z', w: 5 },
]

/* Devolve a função de pintura que a geada usa:
   pinta(ctx, w, h, { cortes }) desenha a estátua cheia no quadro w × h. */
export function pintaJustica() {
  const forma = FORMA.map((f) => (typeof f === 'string' ? { p: new Path2D(f) } : { p: new Path2D(f.d), w: f.w }))
  const cortes = CORTES.map((c) => ({ p: new Path2D(c.d), w: c.w }))
  return (ctx, w, h, { cortes: comCortes = true } = {}) => {
    ctx.save()
    ctx.scale(w / LARGURA, h / ALTURA)
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const f of forma) {
      if (f.w) {
        ctx.lineWidth = f.w
        ctx.stroke(f.p)
      } else ctx.fill(f.p)
    }
    if (comCortes) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = '#000'
      for (const c of cortes) {
        ctx.lineWidth = c.w
        ctx.stroke(c.p)
      }
    }
    ctx.restore()
  }
}
