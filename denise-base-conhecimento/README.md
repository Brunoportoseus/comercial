# Base de conhecimento — Studio Denise de Paula (IA Kommo)

PDF em formato **Perguntas e Respostas** para alimentar a IA de atendimento
automático do Kommo, para que ela responda às dúvidas das clientes.

## Arquivos
- `base-conhecimento-denise-de-paula-kommo.pdf` — documento final (~15 páginas).
- `conteudo.json` — conteúdo estruturado (FAQ oficial + artigos do blog).
- `gerar_pdf.py` — gera/atualiza o PDF a partir do JSON (`python3 gerar_pdf.py`,
  requer `reportlab`).

## Fonte do conteúdo
Extraído do **repositório oficial do site** `Brunoportoseus/studio`
(`index.html` e `blog.html`), que publica `micropigmentacaodenisedp.com.br`:
- **FAQ oficial com 51 perguntas e respostas** (sobrancelhas, labial, segurança/saúde);
- **7 artigos completos do blog** (técnica, cuidados, durabilidade, dor, tendências);
- dados do studio: Rua Buenos Aires, 457 — Batel, Curitiba/PR (CEP 80250-070),
  WhatsApp (41) 97401-6961, e-mail contato@micropigmentacaodenisedp.com.br.

## Dados informados pela Denise (não constavam no site)
- **Horário:** seg a sex 9h–19h · sáb 9h–12h.
- **Valores:** a IA nunca informa preço — direciona para o atendimento (WhatsApp).

## Estrutura do PDF
1. Sobre a Denise e o Studio · 2. Localização, Contato e Horários ·
3. Serviços · 4. Avaliação, Agendamento e Valores ·
5. Sobrancelhas (dúvidas) · 6. Labial (dúvidas) ·
7. Segurança, Saúde e Contraindicações · 8. Artigos do Blog.

## Como atualizar
Editar as respostas em `conteudo.json` (FAQ/artigos) ou os blocos fixos em
`gerar_pdf.py` (seções 1–4) e rodar `python3 gerar_pdf.py`.
