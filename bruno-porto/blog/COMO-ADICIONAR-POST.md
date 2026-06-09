# Como adicionar um post novo no blog

## Passo a passo (5 minutos)

### 1. Criar a pasta do post

Crie uma pasta nova dentro de `bruno-porto/blog/posts/` com um **slug** descritivo (sem acentos, palavras separadas por hífen):

```
bruno-porto/blog/posts/seu-slug-aqui/
```

Exemplos de slugs bons:
- `whatsapp-business-vendas`
- `funil-de-vendas-essencial`
- `meta-ads-x-google-ads`

### 2. Copiar um post existente

Pegue o conteúdo de qualquer post existente (ex.: `bruno-porto/blog/posts/ia-no-comercial/index.html`) e cole na pasta nova como `index.html`.

### 3. Editar 5 campos

Abra o `index.html` novo e altere:

#### a) Title da aba (linha ~5)
```html
<title>SEU TÍTULO — Bruno Porto Seus</title>
```

#### b) Meta description (linha ~6)
```html
<meta name="description" content="UM RESUMO DE 1 LINHA DO POST." />
```

#### c) Open Graph (compartilhamento — linhas ~7-12)
```html
<meta property="og:title" content="SEU TÍTULO" />
<meta property="og:description" content="UM RESUMO DE 1 LINHA." />
<meta property="og:url" content="https://www.brunoportoseus.com.br/blog/posts/SEU-SLUG/" />
```

#### d) Tags do artigo (procure por `article-tags`)
```html
<div class="article-tags">
  <span class="chip">TAG 1</span>
  <span class="chip">TAG 2</span>
</div>
```

#### e) Conteúdo do post (procure por `<h1>` e `<div class="content">`)
- Mude o `<h1>` pro título do post
- Mude o `<p class="lead">` pra introdução (1 parágrafo)
- No `<div class="content">`, escreva o corpo do post

### 4. Adicionar o card na listagem

Abra `bruno-porto/blog/index.html` e adicione um novo bloco `.post-card` na `.posts-grid`:

```html
<a href="/blog/posts/SEU-SLUG/" class="post-card reveal">
  <div class="post-card-tags">
    <span class="chip">TAG 1</span>
    <span class="chip">TAG 2</span>
  </div>
  <h2>SEU TÍTULO</h2>
  <p>RESUMO CURTO (2-3 LINHAS) PRA APARECER NO CARD.</p>
  <span class="post-card-cta">
    Ler artigo
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  </span>
</a>
```

### 5. Commit + push

No GitHub Web ou via terminal:
- Mensagem de commit: `feat: novo post — TÍTULO DO POST`
- Push pra `main`
- Em ~1 min o post está no ar em `https://www.brunoportoseus.com.br/blog/posts/SEU-SLUG/`

---

## Formatação disponível no conteúdo

### Títulos
```html
<h2>Título de seção</h2>
<h3>Subtítulo</h3>
```

### Parágrafos
```html
<p>Texto comum.</p>
<p>Texto com <strong>negrito</strong> e <em>itálico</em>.</p>
```

### Listas
```html
<ul>
  <li>Item</li>
  <li>Item com <strong>destaque</strong></li>
</ul>
```

### Citação (destaque grande)
```html
<blockquote>
  Frase de impacto que vira o card pra rede social.
</blockquote>
```

### Callout (caixa destacada)
```html
<div class="callout">
  <h4>📌 Título do callout</h4>
  <p>Dica prática, ferramenta indicada, atalho.</p>
</div>
```

### Link
```html
<a href="/blog/posts/outro-post/">Outro post relacionado</a>
```

### Código inline
```html
<code>termo técnico</code>
```

---

## Sem datas — sem indício de "antigo"

Não tem data nem na listagem nem no post. Você pode publicar 1 post hoje e revisitar daqui 6 meses sem o site parecer parado.

---

## Dúvida?

Chama o Bruno (consultoria 🙃) ou peça pro Claude criar o post — passa o tema e o esboço, ele monta o HTML pronto pra colar.
