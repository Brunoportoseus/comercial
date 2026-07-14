# Setup do Admin — Porto & Feiges

O site roda como **Cloudflare Worker com assets estáticos** + **D1** (banco das matérias) + **R2** (imagens).
Este guia mostra como colocar o admin no ar. Feito uma vez.

## Pré-requisitos

- Conta Cloudflare
- `wrangler` instalado: `npm i -g wrangler`
- `wrangler login`

## 1. Criar o banco D1

```bash
cd porto-feiges
wrangler d1 create porto-feiges
```

Copie o `database_id` retornado e cole em `wrangler.jsonc`, no campo
`d1_databases[0].database_id` (substitui `SUBSTITUIR_PELO_ID_DO_D1`).

Crie as tabelas:

```bash
wrangler d1 execute porto-feiges --file=./schema.sql --remote
```

## 2. Criar o bucket R2 (imagens)

```bash
wrangler r2 bucket create porto-feiges-images
```

(O nome já está referenciado em `wrangler.jsonc` → `r2_buckets`.)

## 3. Definir os secrets

```bash
wrangler secret put ADMIN_PASSWORD
#  → digite a senha que você vai usar no /admin

wrangler secret put AUTH_SECRET
#  → cole uma string aleatória longa (ex: gere com: openssl rand -hex 32)
```

## 4. Publicar

```bash
wrangler deploy
```

> Se você usa deploy automático pelo GitHub (Cloudflare Pages/Workers Builds),
> configure `ADMIN_PASSWORD` e `AUTH_SECRET` como variáveis de ambiente
> secretas no painel do projeto, e os bindings D1/R2 na aba **Settings → Bindings**.

## 5. Carregar as 3 matérias iniciais (opcional)

Depois de logar no admin uma vez, rode no console do navegador (ou via curl com o cookie),
ou simplesmente chame o endpoint de seed autenticado:

```bash
# estando logado no /admin, no console do navegador:
fetch('/api/seed', { method:'POST', credentials:'same-origin' }).then(r=>r.json()).then(console.log)
```

Isso insere os 3 posts de exemplo (método, CRM, tráfego). Só funciona se o banco estiver vazio.

## Pronto

- Site: `https://portoefeiges.com.br/`
- Blog: `https://portoefeiges.com.br/blog/`
- Admin: `https://portoefeiges.com.br/admin/`

---

## Trocar a logomarca

A logo é um único arquivo: **`assets/logo.svg`** (usada no header de todas as páginas)
e **`assets/favicon.svg`** (ícone da aba).

Para trocar pela sua marca definitiva:
1. Substitua `assets/logo.svg` pelo seu arquivo (mantenha o nome, ou ajuste o `src` nos HTML).
   - Formato horizontal, versão **clara** (o fundo do header é navy).
   - Altura de referência: ~28px. SVG é o ideal; PNG também funciona.
2. (Opcional) Substitua `assets/favicon.svg` pelo símbolo isolado.

Nenhuma outra mudança é necessária — o site inteiro aponta para esses dois arquivos.

## Variáveis a substituir antes de divulgar

- Número de WhatsApp `5541999999999` → número real (aparece na landing, no blog e nos posts)
- `CNPJ 00.000.000/0001-00` no rodapé da landing
- ID do GA4 (`G-XXXXXXXXXX`) no bloco comentado no fim de `index.html`
