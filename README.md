# Rogério Santos · Advocacia

Site pessoal de Rogério Antunes dos Santos, advogado em Cuiabá (OAB/MT 16.405).
Na primeira tela, ele sai de dentro da estátua da Justiça, uma forma desenhada em WebGL,
nítida em cima e cada vez mais fosca para baixo. Tudo o que entra na página sai do fosco.

Vite sem framework, com GSAP, Lenis e as fontes Sofia Sans Extra Condensed, Sofia Sans e Libre Caslon Text.
O guia de arquitetura, movimento e personalização está no `CLAUDE.md`. Ele foi escrito para a demo "Nóbrega",
e este projeto segue a mesma estrutura. O código daqui foi escrito do zero a partir do guia.

## Rodar

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

- `?pronto`: abre sem a abertura.
- `?tema=marfim` e `?tema=ouro`: trocam a paleta.

## Imagens

O material da pessoa fica em `material/rogerio/`, junto com os dados em `dados.md`.
Para refazer as imagens de `public/img/`:

```bash
python3 scripts/imagens.py
```

```bash
node scripts/justica-svg.mjs
```

## Publicação

Cada push na `main` publica o site no GitHub Pages (`.github/workflows/pages.yml`).

## O que ainda falta

- Uma **foto dele no escritório** para o card "Quem cuida do seu caso". Hoje o card monta o retrato sobre um fundo escuro.
- O **retrato em resolução maior**. O original tem 536 × 676; o ideal é 1024 × 1536, sem fundo, de braços cruzados.
- **Confirmar os números** do card (686 clientes atendidos, 275 ações em andamento). Eles vêm do site antigo.
- **Revisar os textos**: atendimento, áreas e as cinco dúvidas. Foram escritos a partir do site antigo.
