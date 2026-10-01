# CTAs por intenção

O texto genérico "Fale com nosso corretor" (era o texto de ~300 botões, títulos e envios de formulário) foi trocado por textos
que dizem **o que a pessoa recebe**, de acordo com a página e a posição do botão. O texto do botão é medido em `open_form`
e `form_submit` (`cta_text`, junto com `cta_location`), então dá para comparar.

## Mapa

| Onde | Texto |
|---|---|
| Cabeçalho e menu mobile, páginas de empreendimento | Quero as condições |
| Cabeçalho e menu mobile, `/financiamento/` | Simular com corretor |
| Cabeçalho e menu mobile, `/comparar/` | Comparar com corretor |
| Cabeçalho e menu mobile, demais páginas | Receber opções |
| Faixa de CTA da home | Receber opções para o meu orçamento |
| Faixa e hero das cidades (Almirante Tamandaré, SJP, Curitiba, Araucária) | Receber opções em *{cidade}* |
| Faixa das cidades sem estoque (Campo Largo, Fazenda Rio Grande, Pinhais, Piraquara) | Receber opções na região |
| Destaque do Bela Vista na página de Almirante Tamandaré | Receber condições do Bela Vista |
| Simulador das páginas de empreendimento | Receber valores e simular |
| Comparativo de Almirante Tamandaré | Receber comparação do corretor |
| `/conteudos/` | Receber uma seleção de terrenos |
| `/guia-do-comprador/` | Receber análise do meu perfil |
| `/financiamento/` (faixa final) | Pedir simulação para o meu perfil |
| Artigos sobre uma cidade | Receber opções em *{cidade}* (Almirante Tamandaré, Curitiba, Araucária, São José dos Pinhais) |
| Artigo "Financiamento direto…" | Simular a parcela com um corretor |
| Demais artigos | Receber opções de terrenos |
| Formulário da página de empreendimento (`#interesse`) | Receber apresentação e condições |
| Formulário de `/contato/` | Quero receber o retorno |
| Modal (todas as páginas): título e botão | Receba o retorno de um corretor · Quero receber o retorno |
| Páginas `/terrenos/…` (cluster) | Quero receber as opções deste perfil (já era específico) |

Não mudaram: meta descriptions (texto de busca), botões que já eram específicos ("Quero ser avisado…", "Simular com um corretor",
"Quero receber as opções deste perfil", "Receber opções no WhatsApp") e o assistente de orçamento da home.

## Regras para novos CTAs

- Prometer algo concreto (opções, condições, simulação, comparação), na primeira pessoa ou no infinitivo.
- Ser coerente com a promessa da página: o formulário só pede nome e WhatsApp, e o retorno é de um corretor.
- Não prometer aprovação de crédito, valorização nem prazo de resposta.
- Cabeçalho (botão pequeno): até ~20 caracteres.

## Como avaliar

No GA4, em Explorar → formato livre: linhas `cta_text` + `cta_location`, métricas `open_form` e `form_submit`
(taxa = `form_submit` / `open_form`). Compare só botões na mesma posição e no mesmo tipo de página. Mudanças feitas em
1 de out. de 2026: o `cta_text` antigo ("Fale com nosso corretor") serve de linha de base para quem tiver dados anteriores.
Dê pelo menos 2 a 4 semanas e algumas dezenas de aberturas por texto antes de concluir algo.

## Mensagem do WhatsApp com o contexto da página

Os botões de WhatsApp genéricos (flutuante, menu e rodapé, `data-wa` vazio) mandam uma mensagem que diz o que a pessoa estava
vendo, para o corretor já saber do que se trata. Botões com texto próprio (`data-wa="…"`, como o do topo do empreendimento) não mudam.
Quem está na home, em `/contato/` ou em página institucional recebe a mensagem padrão de `assets/js/config.js`.

| Página | Mensagem |
|---|---|
| Empreendimento | "Olá! Vim pelo portal e tenho interesse no *{empreendimento}* (*{cidade}*). Pode me passar as condições atualizadas?" |
| Empreendimento, depois de mexer no simulador | …acrescenta "Simulei entrada de R$ *X* em *N* meses (parcela estimada R$ *Y*/mês)." (valores no momento do clique) |
| Cidade | "Olá! Vim pelo portal e quero ver terrenos em *{cidade}*." |
| Cluster `/terrenos/…` | "Olá! Vim pelo portal pela página "*{título}*" e quero receber opções com esse perfil." |
| Financiamento | "Olá! Vim pelo portal e quero ajuda com a simulação de financiamento de um terreno." |
| Comparar | "Olá! Vim pelo portal e quero ajuda para comparar empreendimentos." |
| Guia do comprador | "Olá! Vim pelo portal pelo guia do comprador e quero ajuda para escolher um terreno." |
| Artigo | "Olá! Vim pelo portal e li "*{título}*". Quero ajuda para escolher um terreno." |

O evento `whatsapp_click` (e a conversão do Google Ads) não muda. A lógica fica em `waContextText()` em `assets/js/site.js`.
