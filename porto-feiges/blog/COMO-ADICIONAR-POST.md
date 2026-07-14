# Como adicionar um post ao blog

## Estrutura de um post

1. Crie uma pasta em `blog/posts/nome-do-post/`
2. Crie o arquivo `index.html` dentro dela
3. Use qualquer post existente como template (copie e edite)

## Campos para ajustar em cada post

- `<title>` — título da aba do navegador
- `<meta name="description">` — aparece no Google e no link do WhatsApp
- `<meta property="og:title">` e `og:description` — preview do link
- `<meta property="og:url">` — URL completa do post
- Chips no `data-tags` do card em `blog/index.html` (ex: `data-tags="crm vendas"`)
- Conteúdo do artigo dentro de `.post-content`

## Tags disponíveis

`método` · `crm` · `tráfego` · `vendas` · `automação`

Para adicionar uma nova tag: adicione o botão em `blog/index.html` no bloco `.filter-row`.

## Adicionar o card na listagem

Abra `blog/index.html` e adicione um bloco `.post-card` dentro de `#postsGrid`:

```html
<a href="/blog/posts/nome-do-post/" class="post-card" data-tags="tag1 tag2">
  <div class="post-chips">
    <span class="chip">Tag</span>
  </div>
  <h2>Título do post</h2>
  <p>Resumo em 1-2 frases.</p>
  <span class="post-cta">Ler <svg ...></svg></span>
</a>
```

## Regras de conteúdo (briefing)

- Sem data de publicação — os posts são conteúdo perene
- Tom: sênior, direto, sem jargão de agência
- Cada post termina com CTA para WhatsApp
- Posts relacionados: apontar para 2 outros posts no bloco `.related-posts`
- Nunca prometer resultado que não pode provar

## Número do WhatsApp

Substituir `5541999999999` pelo número real do Bruno em:
- `index.html` (2 ocorrências)
- `blog/index.html` (1 ocorrência)
- Cada post (1 ocorrência cada)
