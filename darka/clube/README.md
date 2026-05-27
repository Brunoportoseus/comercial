# Clube do Pintor Darka

Portal de relacionamento para pintores profissionais — programa de fidelidade
da **Tintas Darka**. Construído como demonstração de interface (mock data),
pronto para integração futura com loja virtual, CRM, sistema de pontos,
WhatsApp e push notifications.

> **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS

## Como rodar localmente

```bash
cd clube-do-pintor
npm install        # ou pnpm install / yarn
npm run dev        # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

## Estrutura

```
src/
  app/                 # rotas (Next.js App Router)
    page.tsx              → /            Home pública
    login/                → /login
    cadastro/             → /cadastro
    dashboard/            → /dashboard   Painel principal (autenticado)
    pontos/               → /pontos
    vouchers/             → /vouchers
    premios/              → /premios
    treinamentos/         → /treinamentos
    treinamentos/[id]/    → detalhe do curso
    indicacoes/           → /indicacoes
    notificacoes/         → /notificacoes
    perfil/               → /perfil
    loja-beneficios/      → /loja-beneficios
    regras/               → /regras
  components/          # Header, Sidebar, MobileBottomNav, cards etc.
  data/mock.ts         # Dados mockados (substituir por API)
  types/index.ts       # Contratos de domínio (Painter, Voucher...)
public/
  manifest.json        # PWA
  icons/icon.svg       # Ícone do app
```

## Identidade visual

Paleta da Darka aplicada via **variáveis CSS** em `src/app/globals.css`
e mapeada para tokens Tailwind (`primary`, `accent`, `surface`, etc.).
Para trocar a paleta basta editar os valores em `:root`.

```css
--color-primary:   138 18 32;   /* vermelho vinho institucional */
--color-secondary: 24 22 28;    /* grafite */
--color-accent:    245 184 28;  /* dourado de destaque */
--color-background:247 246 244; /* areia neutra */
--color-surface:   255 255 255;
--color-text:      24 22 28;
--color-muted:     110 105 118;
--color-success:   34 160 102;
--color-warning:   220 130 30;
```

A faixa multicolor (`spectrum-strip`) reaproveita o espectro da marca
(vermelho · laranja · amarelo · verde · azul · roxo) já presente na
identidade Darka — "Seu mundo em cores".

## PWA

`public/manifest.json` está configurado com ícone, nome, splash, theme
color e `display: standalone`. Após integração com um Service Worker
(ex.: `next-pwa`) o portal pode ser instalado no celular como app.

## Pontos de integração futura

Marcados no código com `// TODO: integração` — incluem:

- `POST /api/auth/login` (Identity Provider)
- `POST /api/painters` (cadastro → CRM + sistema de pontos)
- `GET /api/painter/me`, `/points`, `/vouchers`, `/notifications`
- `POST /api/rewards/{id}/redeem`
- `POST /api/referrals` (CRM)
- Loja virtual: `https://tintasdarka.wscommerce.com.br/`
- Push Notifications (Web Push API / FCM)
- Login por WhatsApp (WABA)
- Google Analytics / GTM (a inserir em `layout.tsx`)

## Mock data

Todos os dados em `src/data/mock.ts`. Personagem padrão:

- **João Carlos** · Curitiba/PR · Nível **Prata** · **1.280 pts**
  · próximo nível **Ouro** (faltam 720 pts).
