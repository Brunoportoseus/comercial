# Clube de Assinatura — Studio Denise de Paula

App Site completo de um **clube de assinatura de micropigmentação e beleza** para o
**Studio Denise de Paula** (Curitiba/PR). Não é uma landing page estática: tem
autenticação, pagamento recorrente, carteira de créditos, histórico, agendamento e
painel administrativo.

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · SQLite (dev) / PostgreSQL (produção)

> ⚠️ **Todos os preços, créditos, carências, benefícios e textos são dados de
> DEMONSTRAÇÃO**, marcados como “Exemplo”. Tudo é configurável no painel admin —
> nada comercial está fixo no código.

---

## Como rodar

```bash
cd studio-denise
cp .env.example .env          # ajuste AUTH_SECRET (e MP_ACCESS_TOKEN se for usar MP real)
npm install
npm run db:reset              # cria o schema e popula dados de exemplo
npm run dev                   # http://localhost:3000
```

Build de produção: `npm run build && npm start`.

### Acessos de demonstração

| Perfil  | E-mail                  | Senha       |
| ------- | ----------------------- | ----------- |
| Admin   | `denise@studio.exemplo` | `admin123`  |
| Cliente | `cliente@exemplo.com`   | `cliente123`|

---

## Pagamento (o sistema permite pagar de verdade)

O gateway é abstraído em `src/lib/payments/` e escolhido por variável de ambiente:

- **Sem `MP_ACCESS_TOKEN`** → **modo simulação**: o checkout aprova o pagamento na
  hora, ativa a assinatura e libera os créditos. Ideal para demonstrar o fluxo
  ponta a ponta sem cobrar ninguém.
- **Com `MP_ACCESS_TOKEN`** → **Mercado Pago real** (sandbox ou produção):
  cria a assinatura recorrente (`/preapproval`), redireciona a cliente ao checkout
  e confirma via **webhook** (`/api/webhooks/mercadopago`). Cartão e Pix.

As credenciais vivem **apenas** em variáveis de ambiente no servidor — nunca no
frontend. Trocar de gateway = implementar a interface `PaymentGateway`.

Teste do pipeline: `npx tsx prisma/smoketest.ts` (cria assinatura → aprova → credita).

---

## Arquitetura (entregas do briefing, seção 17)

### Mapa de páginas

```
Público            /  /planos  /como-funciona  /procedimentos  /faq  /legal/[slug]
Autenticação       /login  /cadastro  /checkout
Área da cliente    /dashboard  ·/creditos ·/agendamentos ·/pagamentos ·/perfil
Admin              /admin ·/clientes[/id] ·/planos ·/procedimentos
                          ·/agendamentos ·/pagamentos ·/configuracoes
API                /api/webhooks/mercadopago
```

### Jornada da cliente
Escolhe plano → cria conta (aceite LGPD) → paga (recorrente) → recebe créditos →
solicita avaliação/agendamento → acompanha saldo, histórico e pagamentos.

### Fluxo administrativo
Configura planos/procedimentos/regras → acompanha KPIs → gerencia clientes,
créditos (com justificativa), agendamentos (aprova/sugere/realiza) e pagamentos →
tudo registrado em auditoria.

### Banco de dados (Prisma — `prisma/schema.prisma`)
`User` · `Plan` · `Procedure` · `PlanProcedure` · `Subscription` · `Payment` ·
`CreditTransaction` (ledger) · `Appointment` · `Notification` · `Faq` ·
`Testimonial` · `LegalDocument` · `Coupon` · `Setting` · `AuditLog`.

Convenções: dinheiro em **centavos (Int)**, créditos em **unidades (Int)**,
sem `enum` (portável SQLite↔Postgres — uniões de string em `src/lib/domain.ts`).

### Regras de negócio principais
- Mensalidade paga → gera créditos do ciclo (validade + teto por plano).
- **Crédito não autoriza procedimento**: débito só ao marcar como *realizado*,
  após avaliação profissional.
- Carência, permanência mínima, validade, teto de acúmulo, uso parcial,
  destino ao cancelar e transferência — **configuráveis** (plano + `Setting`).
- Idempotência de webhook por `gatewayPaymentId`.

### MVP entregue × futuro
- **Entregue:** páginas públicas, auth, contratação + pagamento recorrente,
  área da cliente, créditos/histórico, solicitação de agendamento, painel admin
  (planos, procedimentos, clientes, créditos, agenda, pagamentos, configurações),
  KPIs, páginas legais, PWA, SEO (sitemap/robots/JSON-LD), responsivo, auditoria.
- **Futuro:** disparo real de e-mail/WhatsApp, integração Google Calendar,
  indicação de amigas, gamificação, app nativo, relatórios exportáveis avançados.

### Riscos (resumo)
- Recorrência com Pix tem limitações por gateway (validar no provedor final).
- Textos jurídicos são rascunhos — exigem revisão profissional antes do go-live.
- Regras de crédito/cancelamento precisam de validação comercial/contábil.
- Migrar SQLite→Postgres antes de produção (trocar `provider` + `DATABASE_URL`).

---

## Identidade visual
Paleta provisória neutra/sofisticada em CSS variables (`src/app/globals.css`),
mapeada no Tailwind. Trocar pelas cores/fontes/logo oficiais = editar `:root` e
`src/components/Logo.tsx`. Fontes: Playfair Display (títulos) + Inter (texto).

## Deploy (Vercel)
1. Provisione PostgreSQL (Neon/Supabase/Vercel Postgres) e ajuste
   `provider = "postgresql"` no schema.
2. Configure env: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`,
   `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`.
3. `prisma migrate deploy` + seed opcional. Aponte o webhook do Mercado Pago para
   `/api/webhooks/mercadopago`.
