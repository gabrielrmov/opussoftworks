# Opus SoftWorks — Site institucional

Site institucional da Opus SoftWorks, construído em Next.js 15 + Tailwind CSS 4 a
partir do template [Open PRO](https://github.com/cruip/open-react-template)
da Cruip, adaptado com a marca, o conteúdo e a proposta de valor da Opus SoftWorks.

## Como rodar localmente

Pré-requisitos: Node.js 18+ e [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Se preferir npm ou yarn, apague o arquivo `pnpm-lock.yaml` e rode
`npm install` / `yarn install` normalmente antes de `npm run dev` /
`yarn dev`.

## Build de produção

```bash
pnpm build
pnpm start
```

## O que ainda falta preencher

Alguns campos foram deixados como placeholder (entre colchetes) porque
dependem de informações reais da empresa:

- E-mail e WhatsApp de contato (`components/cta.tsx`,
  `components/ui/footer.tsx`)
- Cidade/UF no rodapé (`components/ui/footer.tsx`)
- Links reais de Instagram, LinkedIn e WhatsApp (`components/ui/footer.tsx`)

## Estrutura das seções

- `components/hero-home.tsx` — hero com a proposta de valor
- `components/services.tsx` — os três serviços (tráfego pago, sistemas de
  gestão, sites)
- `components/principles.tsx` — os três princípios (entrega,
  responsabilidade, assertividade)
- `components/process.tsx` — o processo de trabalho em 4 etapas
- `components/cta.tsx` — chamada final para contato
- `components/ui/header.tsx` / `components/ui/footer.tsx` — navegação e
  rodapé

## Deploy

O jeito mais simples é publicar na [Vercel](https://vercel.com/new),
conectando este repositório — o build (`next build`) já está configurado.
