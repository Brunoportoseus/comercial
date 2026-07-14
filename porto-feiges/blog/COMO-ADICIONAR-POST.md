# Como publicar matérias

As matérias agora são gerenciadas pelo **painel Admin** — não é mais preciso editar arquivos nem fazer commit.

## Acesso

1. Acesse `https://portoefeiges.com.br/admin/`
2. Digite a senha de acesso (definida em `ADMIN_PASSWORD` — ver `SETUP-ADMIN.md`)

## Publicar uma matéria

1. Clique em **+ Nova matéria**
2. Preencha:
   - **Título** — obrigatório
   - **URL (slug)** — deixe em branco para gerar automaticamente do título
   - **Tags** — separadas por vírgula (ex: `método, vendas`). Viram os filtros do blog.
   - **Resumo** — 1-2 frases; aparece no card e no preview do WhatsApp
   - **Imagem de capa** — opcional
   - **Conteúdo** — use os botões da barra (H2, H3, parágrafo, citação, lista, imagem)
3. Deixe **Publicado** marcado (ou desmarque para salvar como rascunho)
4. Clique em **Salvar**

A matéria fica no ar na hora, em `/blog/posts/<slug>/`.

## Imagens

- **Capa:** botão "Enviar capa" no editor
- **No meio do texto:** botão "Inserir imagem" na barra do conteúdo — a imagem é enviada e inserida onde está o cursor

As imagens ficam armazenadas no bucket R2 e são servidas por `/api/images/...`.

## Importante

- **Sem data de publicação** — conforme o briefing, as matérias não exibem data (são conteúdo perene). A ordem na listagem segue a data de criação, mas ela não aparece no site.
- **Editar/Excluir:** na lista do admin, clique em **Editar**; o botão de excluir fica dentro do editor.
