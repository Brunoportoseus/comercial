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
