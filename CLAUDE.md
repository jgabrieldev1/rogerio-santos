# Guia do projeto — Nóbrega

(Salve como `CLAUDE.md` na raiz do projeto se você usa o Claude Code, ou como `AGENTS.md` se usa o Codex, o Cursor ou outro agente. O conteúdo é o mesmo.)

Site pessoal do Dr. Vicente Nóbrega, um advogado criminalista fictício. Vite sem framework, GSAP, Lenis, fontes Sofia Sans Extra Condensed, Sofia Sans e Libre Caslon Text. **Na primeira tela o advogado sai de dentro da estátua da Justiça, uma forma branca desenhada em WebGL que é nítida em cima e cada vez mais fosca para baixo, com grão (a "geada"); tudo o que entra na página sai do fosco.** O código já vem pronto em `arquivos/src/`, a página no `arquivos/index.html` e as imagens em `arquivos/public/`: o trabalho é montar, conferir e, depois, personalizar. A régua é site de premiação: o movimento é o produto, e os tempos, as curvas e a ordem das entradas estão medidos. Se algo parece "ok", ainda não está pronto.

## Arquitetura
- **Uma seção por arquivo.** O `index.html` só tem o `<head>` e a ordem das seções (`<!-- @secao hero -->` etc.); o plugin `secoes` do `vite.config.js` troca cada marca pelo `src/sections/<nome>.html` no dev e no build. Os textos e os dados (título, áreas, passos, números, perguntas, contatos) estão nesses HTML.
- **O CSS é uma folha só**, `src/styles/site.css` (por `@import`, nesta ordem: as fontes, `tokens.css`, `base.css` e uma folha por seção), ligada por `<link>` no `<head>`. Antes dela, inline: o script que escolhe o tema e liga a classe `js`, a cor de fundo e o estilo crítico (o que entra pela abertura e pela rolagem nasce escondido). Nunca importe CSS pelo JS: no dev do Vite ele chega depois dos módulos e a página pinta crua por um instante a cada recarregamento.
- **Módulos** (cada um explica o que faz no cabeçalho):

  | arquivo | o que faz |
  |---|---|
  | `src/main.js` | liga tudo: cria a geada do hero, a rolagem e as seções; espera as fontes e o retrato decodificado e só então toca a abertura; no tempo livre, cria a geada do rodapé; mede tudo de novo quando a tela muda |
  | `src/gl/geada.js` | a geada: `criaGeada(canvas, { dono, caixa, pinta })` desenha uma forma branca que desfoca para baixo, com grão. Lê as medidas das variáveis `--g-*` do elemento `dono` |
  | `src/gl/justica.js` | a estátua em curvas (gerado pelo `imagens.mjs`; não se edita à mão) |
  | `src/gl/letras.js` | pinta um texto como forma da geada (o nome do rodapé), na fonte do título |
  | `src/motion/ease.js` | registra as duas curvas no GSAP; todo o motion importa o `gsap` daqui |
  | `src/motion/abertura.js` | a abertura do hero, por tempo; no fim devolve a posição das peças ao CSS |
  | `src/motion/titulo.js` | mede as duas palavras do título e iguala a largura de tinta pelo espaço entre as letras |
  | `src/motion/ponteiro.js` | o hero acompanha o mouse (camadas e foco da geada), numa mola |
  | `src/motion/rolagem.js` | o Lenis (só na roda do mouse), os links de âncora e `aoRolar(f)`, que roda no quadro em que a página andou |
  | `src/motion/rolando.js` | põe `is-scrolling` no `<html>` enquanto a página rola: o hover descansa |
  | `src/motion/revela.js` | a entrada pela rolagem das peças com `data-revela` |
  | `src/motion/manifesto.js` | parte a frase em palavras e limpa uma a uma, presa à rolagem |
  | `src/motion/topo.js` | o topo: some ao descer, volta como vidro fosco ao subir |
  | `src/motion/duvidas.js` | a sanfona: uma pergunta aberta por vez |
  | `src/motion/contato.js` | a ficha: confere, mostra o erro, mostra a confirmação. O envio de verdade entra na função `envia()` |
  | `src/motion/fecho.js` | o nome gigante do rodapé em geada; sai do fosco quando o rodapé entra na tela |
  | `src/motion/grao.js` | faz o ladrilho de ruído do card do advogado (a variável `--grao`) |
- **Parâmetros de URL**: `?tema=geada|marfim|ouro` troca a paleta; `?pronto` abre sem a abertura (bom para conferir as seções). Chegando por um link de seção (`#contato`), a página também abre sem abertura.

## Design system
- **Cores em papéis**, nunca pelo nome (`tokens.css`): `--fundo` (a página inteira: um fundo só, nenhuma seção tem cor própria), `--forma` e `--forma-fria` (a geada: a estátua e o nome do rodapé), `--titulo`, `--texto`, `--apoio`, `--fio` (linhas finas), `--cta` e `--sobre-cta` (o botão cheio) e `--retrato-filtro` (o filtro das fotos). O tema padrão é preto frio com branco de gelo e fotos em preto e branco; `marfim` aquece o preto e a forma; `ouro` deixa a forma e o botão dourados e as fotos em cor.
- **Tipos**: Sofia Sans Extra Condensed variável, peso 900, caixa alta (`--display`: título do hero, áreas, números, nome do rodapé); Sofia Sans variável (`--sans`: texto e interface); Libre Caslon Text (`--serifa`: títulos de seção, manifesto, nomes; romana com uma palavra em itálico, marcada com `<em>`).
- **Escala**: `--u` é a escala de cena, 1 px num quadro de 1440 × 840 que acompanha a tela nos dois eixos (o hero e o topo usam). `--su` é a escala de site: 1 px de verdade a partir de 1280 de largura, encolhe abaixo, nunca cresce. Seções: título de 60 px (80 no contato), manifesto 46, áreas 58, números 52 a 64, texto 16 a 18, rótulos 13 a 14, 152 px de folga em cima e embaixo de cada seção, conteúdo de até 1200 px. No celular o quadro é de 390, os títulos ficam em 38 (46 no contato) e a folga em 96.
- **Formas**: canto vivo (botões com 2 px de raio, card com 6), linhas finas de 1 px (`--fio`) em vez de caixas cheias. Nada de sombra, a não ser o halo fosco do botão no hover.
- **Fotos** sempre com `filter: var(--retrato-filtro)`, para o tema decidir se são em preto e branco.

## A geada: as medidas
Tudo é variável CSS no elemento dono (`.hero` em `hero.css`, `.rodape` em `rodape.css`), em "unidades da forma", contadas do topo da caixa da forma para baixo.

| variável | o que é | no hero |
|---|---|---|
| `--g-alt` | quantas unidades tem a altura da caixa | 1751 (a altura do quadro da estátua, `--j-alt`) |
| `--g-foco-0` | onde o desfoque começa | 472 (o queixo) |
| `--g-foco-1` | onde chega ao máximo | 832 |
| `--g-sigma` | o desfoque máximo | 88 |
| `--g-curva` | maior que 1: demora a começar | 1,25 |
| `--g-some-0`, `--g-some-1` | onde a forma começa a sumir no fundo e onde some | 944 e 1002 |
| `--g-grao` | quanto do desfoque vira grão solto (0 = liso) | 0,14 |
| `--g-giro` | 1 = a espiral gira em cada ponto (grão fino); 0 = desfoque liso | 1 |
| `--g-cheia` | desfoque em que a figura maciça toma o lugar do desenho com cortes | 5 |

No mesmo bloco do `hero.css` ficam as medidas da cena: `--j-alt` e `--j-topo` (o tamanho da estátua e onde começa o quadro dela), `--f-alt` (a altura da foto do advogado), `--f-foco` (em que fração da foto ela começa a ficar fosca), `--t-tam` e `--t-topo` (o tamanho e a altura do título) e `--miolo` (o vão entre as duas metades, onde ele fica). O celular tem os valores dele no fim do arquivo.

O que as animações mexem está em `geada.estado`: `alfa` (0 a 1; nasce em 0), `base` (desfoque somado em tudo), `foco`, `focoPonteiro` e `focoRola` (quanto a linha do foco sobe ou desce), `x`, `y` e `escala`. Depois de mexer, chame `geada.desenha()`. `geada.mede()` relê a tela e as variáveis; `geada.repinta()` pinta a forma de novo (outro texto, fonte que chegou).

## Regras de movimento
- **Um gesto só: sair do fosco.** Peça nova entra com `data-revela` (e, para entrar em sequência com as vizinhas, dentro de um `data-revela-grupo`). Não invente outra entrada (deslize de lado, giro, letra a letra): é isso que dá ao site uma assinatura só.
- **Nenhuma seção fica presa à tela.** A página rola como um site comum; a única peça ligada à posição da rolagem é a frase do manifesto, e ela não segura nada. Não transforme uma seção em cena presa (`position: sticky` de tela cheia, pin): a página perde o ritmo.
- **Texto entra por tempo, num marco.** Rolar rápido nunca deixa meia palavra: o manifesto mostra palavras inteiras em qualquer ponto, e as outras entradas correm por tempo quando a peça chega.
- **Depois de animar posição com o GSAP, devolva a peça ao CSS.** O GSAP escreve `translate: none` em cada peça que move, e isso anula o `translate` do CSS: o topo deixaria de sumir ao descer e o advogado de andar com o ponteiro. Por isso a abertura termina com `clearProps: 'transform'`. Qualquer animação nova de posição em peça que usa `translate` no CSS precisa do mesmo cuidado.
- **O estado de partida das animações zera `x` e `y`.** O GSAP lê o transform que vem do CSS e soma; o `set` inicial da abertura já zera.
- **Nada tem transição no primeiro quadro.** A regra `html:not(.assentou)` do `<head>` segura tudo até dois quadros depois da carga. Sem isso as peças piscam na primeira pintura.
- **A abertura não é carregamento.** Ela espera só as fontes e o retrato decodificado; qualquer gesto leva ao fim. Nada de tela de carga na frente.
- **A geada só desenha quando algo muda.** Nenhum laço de animação fica rodando com a página parada. A textura é pintada no tamanho da tela e medida de novo quando a tela muda.
- **O título são duas metades iguais.** `titulo.js` iguala a tinta das duas palavras apertando ou abrindo o espaço entre as letras (de −0,045 a +0,075 do tamanho da letra). Não centre o título de outro jeito nem troque por uma palavra só: com a pessoa no centro exato, um lado maior que o outro aparece na hora.
- **O hover descansa enquanto a página rola** (`html:not(.is-scrolling)` nas regras de hover das listas). Sem isso, a rolagem acende a linha que passa embaixo do cursor parado.
- **O topo não tem fundo com a página no alto**, some ao descer e só volta, como vidro, ao subir. Não deixe um topo transparente sempre à vista: os links ficariam escritos por cima dos títulos.
- **Um fundo só.** Nenhuma seção tem cor de fundo, brilho ou vinheta própria: não pode aparecer uma linha reta de cor entre duas seções.
- `prefers-reduced-motion`: sem Lenis, sem abertura (a primeira tela só acende), manifesto inteiro à vista, entradas só com fade.

## Celular: regras que não se quebram
- **Nunca rolar para o lado**, em nenhum momento. Se algo vazar, conserte a origem; `overflow-x: clip` no `body` é só a rede de segurança (`clip`, não `hidden`).
- **No toque, a rolagem é a do aparelho.** O Lenis só conduz a roda do mouse. Nunca cancele o toque nem chame `scrollTo` na página enquanto o dedo rola.
- **Alturas em `svh`**, nunca `100vh` nem `dvh`: a barra do navegador some e volta durante a rolagem, e o que estiver em `dvh` muda de tamanho no meio dela.
- **O hero cabe numa tela, em qualquer altura.** A cena (estátua e advogado) ocupa a sobra da tela acima dos textos: o `main.js` mede a sobra e acerta `--c`, a unidade da cena. Em tela baixa (o iPhone com as barras do Safari abertas tem cerca de 660 px de altura) o título encolhe e a linha do plantão sai. Mexeu no texto do hero? Confira de novo em 393 × 659.
- Composição própria: o título empilha em duas linhas da mesma largura; os três passos e as áreas empilham; o card do advogado fica em pé; os botões principais ocupam a largura.
- Hover só com mouse (`@media (hover: hover)`). Alvos de toque de 44 px. Campo com fonte de 16 px ou mais (menor que isso, o iPhone dá zoom ao focar).
- Conferir em 390 × 844 e 393 × 659.

## Como checar
- `npm run build` sem erro e sem aviso de arquivo faltando.
- `npx vite preview`: o primeiro quadro é a tela escura; a mancha, o foco descendo, o advogado subindo, o título saindo de trás dele; recarregar nunca mostra a página crua; console limpo.
- Página no topo, em 1440 × 900, 1440 × 810 e 1280 × 720: a estátua, o advogado, o título inteiro e o botão na tela, nada cortado no pé.
- **Com a abertura tocada (sem `?pronto`)**: descendo, o topo some; subindo, volta como vidro; no hero, o advogado anda com o mouse.
- Rolando de cima a baixo, devagar e depressa, e de volta: cada peça sai do fosco e fica nítida; o manifesto limpa; a linha da lista fica em foco no hover; as perguntas abrem uma por vez; a ficha avisa o erro e confirma o envio; o nome do rodapé sai do fosco.
- No fim da página: o nome gigante de ponta a ponta do conteúdo, cortado pela base, em 1280, 1440 e 1920 de largura e no celular.
- As três paletas (`?tema=marfim`, `?tema=ouro`): a geada, o botão e as fotos trocam juntos.
- Teclado: Tab em tudo, com o foco visível; "Pular para o conteúdo" no primeiro Tab.
- Celular nos dois tamanhos (nada rola para o lado, o hero cabe na tela) e o `dist/` numa subpasta, com um servidor estático de verdade (o prompt diz como): sem 404.

## Personalizar

Vale para qualquer mudança, agora ou depois.

### As três perguntas
1. É a demo, o site da pessoa, ou peças soltas?
2. Que material ela já tem (o retrato de braços cruzados, uma foto no escritório, o número da OAB, as áreas, números de verdade, as dúvidas, contatos) e o que falta?
3. O que ela quer manter da demo (a estátua, o título em duas metades, o manifesto, os três passos, a lista de áreas, o card, as dúvidas, a ficha, o nome gigante)?

### O que muda e onde

Os caminhos são de `src/sections/` (HTML), `src/styles/` (CSS) e `src/motion/` (JS), salvo quando escrito.

| o quê | onde | precisa de material novo? |
|---|---|---|
| Nome e marca | `topo.html` e `rodape.html` (`.topo__nome`, `.topo__ramo` e o `aria-label` da marca), `hero.html` (`.hero__nome--e` e o `alt` do retrato), `advogado.html` (`.perfil__nome` e o `alt` da foto), `rodape.html` (`.rodape__legal`), o `<title>` e a `description` do `index.html` | não |
| Nome gigante do rodapé | sai sozinho do `.topo__nome` do `rodape.html` (o `fecho.js` lê e põe em caixa alta) | não. Um nome só, de até ~10 letras; mais longo, as letras ficam baixas |
| Registro (OAB) | `hero.html` (`.hero__nome--d`), `rodape.html` (`.rodape__legal`) | o número dela, com a seccional. É obrigatório: não publique sem ele |
| Título do hero | os dois `<span data-palavra>` de `hero.html` | não. **Duas palavras com número de letras parecido** (diferença de até duas letras: "Advogada / criminal" e "Defesa / penal" servem; "Direito / de família" não serve): o `titulo.js` iguala as duas. Palavras com mais de 9 letras: baixe `--t-tam` em `hero.css` (no computador e no bloco do celular) até cada metade caber ao lado dele |
| Retrato do hero | `public/img/advogado.webp`, feito pelo `imagens.mjs` (ver "Material da pessoa") | o retrato dela |
| Estátua | `src/gl/justica.js` e `public/img/justica.svg`, os dois feitos pelo `imagens.mjs` | só se quiser outro desenho; a da demo serve a qualquer advogado |
| Textos do hero | `hero.html`: `.hero__apoio` (até ~130 letras, três linhas), o botão e `.hero__plantao` | não |
| Manifesto | `manifesto.html`: uma frase só (até ~170 letras), com o trecho em itálico dentro de `<em>` | não. As palavras se partem sozinhas |
| Como funciona | `atendimento.html`: cada `<li class="passo">` tem o número, o rótulo (`.passo__quando`), o nome e o texto; a linha do plantão é o `<div class="plantao">` | não. Quatro passos: copie um `<li>` e troque `repeat(3, …)` por `repeat(4, …)` em `atendimento.css` |
| Áreas de atuação | `atuacao.html`: cada `<li class="area">` (nome, frase curta) | não. De quatro a sete; nome de até ~18 letras para caber numa linha |
| O advogado | `advogado.html`: nome, frase, os dois números (`<dl class="perfil__numeros">`) e a foto, que aparece em quatro `<img>` (nítida, duas foscas e a do leitor de tela): troque o `src` das quatro | a foto no escritório e números de verdade |
| Dúvidas | `duvidas.html`: cada `<div class="duvida">`; os `id` do botão e do painel (`duvida-b1`, `duvida-1`) precisam continuar casando com `aria-controls` e `aria-labelledby` | não |
| Contato | `contato.html`: o link do WhatsApp (`https://wa.me/55` + DDD + número), o `tel:`, os textos e a ficha | os contatos dela |
| Envio da ficha | `contato.js`, função `envia()`: hoje só espera e confirma. Mande os dados para um serviço de formulário ou abra o WhatsApp com a mensagem pronta | um serviço de formulário ou o número |
| Rodapé | `rodape.html`: os links, telefone, e-mail, endereço e a linha legal | os contatos |
| Menu | os links de `topo.html` e de `rodape.html` (cada `href="#id"` é o `id` de uma `<section>`) | não |
| Cores | `tokens.css` (os papéis e os três temas); a lista de temas, com a cor de fundo de cada um, no script do `<head>` do `index.html`; o `theme-color` | não |
| Fontes | os `@import` de `site.css` e `--display`, `--sans`, `--serifa` em `tokens.css`. A fonte do título aparece também em dois lugares do JS: `DISPLAY` e `PESO` em `src/gl/letras.js` (o nome do rodapé é pintado num canvas) e a lista `FONTES` de `src/main.js` (o que a abertura espera) | não |

### Material da pessoa

Para cada imagem, do mais simples ao mais trabalhoso: (1) manter a da demo; (2) usar a foto da pessoa no formato certo; (3) gerar com as receitas de `arquivos/receitas/` (o `LEIA.md` dá a ordem, os formatos e o que anexar como referência).

- **Toda imagem nova passa pelo `imagens.mjs`.** Salve em `arquivos/fonte/bruto/` com o nome certo (a lista está em `arquivos/fonte/bruto/LEIA.txt`), rode uma vez `npm install -D -E sharp@0.35.5` e depois `node arquivos/fonte/imagens.mjs`. Ele refaz só o que encontrar e grava em `public/img/` com os nomes que o HTML já usa. Nunca solte um JPG ou PNG grande direto em `public/img/`.
- **O retrato do hero** precisa estar **sem fundo**, num quadro em pé de 2:3 (1024 × 1536), com a pessoa de frente, o nariz no eixo do quadro, da cabeça ao quadril e de braços cruzados. Três caminhos: `advogado-pronto.png` (já recortado em qualquer programa: o script só converte); `advogado.png` (foto de estúdio em fundo preto liso com luz por trás: num Mac o script recorta sozinho); ou, fora do Mac, `advogado.png` mais um `advogado-recorte.png` feito em qualquer removedor de fundo. Roupa escura e luz de recorte no contorno: terno preto em fundo preto, sem essa luz, some.
- **Depois de trocar o retrato**, olhe o hero no computador e no celular: a cabeça dele abaixo da cabeça da estátua, os ombros cobrindo o começo das duas palavras, o pé da foto sumindo no fosco. Pessoa grande ou pequena demais: ajuste `--f-alt` em `hero.css` (um valor no bloco do computador, outro no do celular). O ponto em que a foto começa a ficar fosca é `--f-foco`.
- **A foto do card** (`escritorio.png`): deitada (3:2), a pessoa no terço direito, o terço de baixo escuro e sem nada importante, porque o nome, os números e o botão ficam por cima dele. No celular o card mostra o lado direito da foto (`object-position` de `.perfil__img` em `advogado.css`).
- **Outra forma no lugar da estátua** (uma balança, uma coluna, as iniciais): um desenho alto (2:3), branco puro sobre preto puro, com o que interessa no terço de cima, salvo como `justica.png`. O script precisa do `potrace` (no Mac, `brew install potrace`) e grava `src/gl/justica.js` e `public/img/justica.svg`. Depois acerte em `hero.css` o tamanho (`--j-alt`), a altura (`--j-topo`) e onde o fosco começa e termina (`--g-foco-0`, `--g-foco-1`, `--g-some-0`, `--g-some-1`), olhando a tela.
- Diga à pessoa, sem rodeio: o advogado das fotos é um personagem gerado e não se "edita" por prompt. Ou ela manda as fotos dela, ou gera a série com as receitas (reescrevendo a descrição da pessoa), ou o site fica com as da demo até ter.

### Peças soltas
- **A geada em outro site**: leve `src/gl/geada.js` e `src/gl/justica.js` (ou `src/gl/letras.js`, para um texto). No HTML, um `<canvas>` cobrindo a cena e um elemento que marca onde a forma fica; no CSS do dono, as variáveis `--g-*`, `--forma` e `--forma-fria`. No JS: `const g = criaGeada(canvas, { dono, caixa, pinta: pintaJustica() })`, depois `g.estado.alfa = 1` e `g.desenha()`; chame `g.mede()` e `g.desenha()` quando a tela mudar. O modelo completo é o `fecho.js` (umas 35 linhas).
- **O título em duas metades**: `titulo.js` mais as regras de `.hero__titulo`, `.hero__metade` e `.hero__palavra` em `hero.css`.
- **A entrada pela rolagem**: `revela.js` mais o bloco "A ENTRADA DA CASA" de `base.css` e as duas regras inline do `<head>`.
- **O card de perfil**: `advogado.html`, `advogado.css` e `grao.js`.
- As outras seções (passos, áreas, dúvidas, ficha) são um HTML e uma folha cada; a sanfona e a ficha têm o módulo delas.

### Regras ao trocar
- Nada de dado inventado como se fosse da pessoa: número da OAB, anos de advocacia, júris, telefone, e-mail e endereço que ela não mandou ficam `[preencher]` (nunca no título do hero).
- Publicidade de advogado segue o Provimento 205/2021 da OAB: nome e número de inscrição à vista; nada de promessa de resultado, de porcentagem de êxito, de valor de honorários, de depoimento de cliente, de "o melhor" ou de comparação com colegas. Na dúvida, texto de fato ("plantão 24 horas", "contrato escrito") em vez de adjetivo. Mantenha a linha legal do rodapé.
- Mantenha o que dá o efeito: a pessoa no centro exato, por cima do título; as duas metades do título iguais; a forma nítida em cima e fosca embaixo; `data-revela` nas peças novas; o fundo único; a primeira pessoa nos textos.
- A ficha de contato da demo só mostra a confirmação. Para valer, ligue a função `envia()` do `contato.js` a um serviço de formulário ou ao WhatsApp, e diga isso à pessoa.
- Nada de cidade real na demo; no site da pessoa, use o endereço dela se ela quiser.
- Termine com a lista do que ainda é da demo: o retrato e a foto do escritório, o nome e o número da OAB, "desde 2003", os dois números do card, os textos das seções, as cinco dúvidas, o telefone, o e-mail, o endereço e o link do WhatsApp.
