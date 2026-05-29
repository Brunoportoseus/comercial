/* ============================================
   ALGORITMO.AI ADMIN — admin.js
   ============================================ */

// ── AUTH CHECK ────────────────────────────────
(function() {
  if (sessionStorage.getItem('algoritmo_auth') !== 'true') {
    window.location.replace('../login.html');
  }
})();

// ── INITIAL DATA ──────────────────────────────
function initializeData() {
  if (!localStorage.getItem('algoritmo_categorias')) {
    const cats = [
      {id:1,nome:'E-commerce',slug:'ecommerce',descricao:'Lojas virtuais e estratégias de venda online',status:'ativo'},
      {id:2,nome:'Inteligência Artificial',slug:'inteligencia-artificial',descricao:'IA aplicada para negócios',status:'ativo'},
      {id:3,nome:'Marketing Digital',slug:'marketing-digital',descricao:'Tráfego pago, campanhas e performance',status:'ativo'},
      {id:4,nome:'Sites Institucionais',slug:'sites-institucionais',descricao:'Presença digital profissional',status:'ativo'},
      {id:5,nome:'Ferramentas Digitais',slug:'ferramentas-digitais',descricao:'Analytics, automação e ferramentas',status:'ativo'}
    ];
    localStorage.setItem('algoritmo_categorias', JSON.stringify(cats));
  }

  if (!localStorage.getItem('algoritmo_posts')) {
    const posts = [
      {
        id:1,
        titulo:'Como saber se sua loja virtual precisa de uma auditoria de performance',
        slug:'auditoria-de-performance-loja-virtual',
        resumo:'Muitas lojas virtuais perdem vendas todos os dias por problemas que poderiam ser identificados e corrigidos com uma auditoria. Saiba quando é hora de avaliar sua loja a fundo e o que observar.',
        conteudo:`<h2>A sua loja está performando bem?</h2><p>Uma loja virtual pode parecer estar funcionando normalmente, mas perder dezenas ou centenas de vendas por dia por problemas que nem sempre são óbvios. Taxa de conversão baixa, carrinho abandonado, velocidade de carregamento ruim ou campanhas mal configuradas são fatores que drenam o potencial do seu e-commerce silenciosamente.</p><h2>Sinais de que você precisa de uma auditoria</h2><ul><li>Sua taxa de conversão está abaixo de 1%</li><li>O custo por aquisição (CPA) está aumentando sem justificativa</li><li>O carrinho abandono está acima de 70%</li><li>Você não sabe quais produtos mais contribuem para a receita</li><li>Suas campanhas no Google Ads e Meta Ads não têm o ROAS esperado</li><li>O site demora mais de 3 segundos para carregar no celular</li></ul><h2>O que uma auditoria analisa</h2><p>Uma auditoria completa cobre estrutura da loja, jornada de compra, dados de analytics, campanhas pagas, SEO técnico, experiência do usuário, ficha de produtos e categorias, checkout e ferramentas de rastreamento.</p><h3>Analytics e rastreamento</h3><p>Muitas lojas não têm o Google Analytics 4 configurado corretamente. Isso significa que dados de conversão, funil de vendas e origem de tráfego estão imprecisos, impossibilitando decisões baseadas em dados reais.</p><h2>Com que frequência auditar</h2><p>O ideal é realizar uma auditoria completa a cada 6 meses, e revisões mensais de indicadores-chave. Lojas com alta rotatividade de campanhas ou mudanças recentes devem fazer isso com mais frequência.</p><h2>Conclusão</h2><p>Uma auditoria bem feita transforma dados soltos em ações claras. O objetivo não é apenas encontrar problemas, mas mapear oportunidades concretas para melhorar o resultado do e-commerce.</p>`,
        imagemCapa:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0QzZGRkYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMEMyRkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjI1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn5OSPC90ZXh0Pjwvc3ZnPg==',
        categoria_id:1,
        autor:'Algoritmo.AI',
        status:'publicado',
        publicado_em:'2025-05-01',
        tempo_leitura:'7 min',
        meta_title:'Auditoria de E-commerce: quando fazer e o que avaliar | Algoritmo.AI',
        meta_description:'Descubra os sinais de que sua loja virtual precisa de uma auditoria de performance e o que é analisado em cada etapa.',
        palavra_chave:'auditoria de e-commerce',
        tags:['e-commerce','auditoria','performance','conversão']
      },
      {
        id:2,
        titulo:'O que uma empresa precisa para colocar um site profissional no ar em 48 horas',
        slug:'site-profissional-48-horas',
        resumo:'Colocar um site no ar em 48 horas é possível — desde que o processo esteja bem organizado. Entenda o que é necessário, o que precisa ser preparado e como funciona o projeto.',
        conteudo:`<h2>48 horas é tempo suficiente?</h2><p>Sim, desde que todos os materiais estejam disponíveis antes do início da implantação. O prazo de 48 horas considera o recebimento completo das informações necessárias: logo, textos, imagens, contatos, plataforma e acessos técnicos.</p><h2>O que você precisa ter pronto</h2><ul><li>Logo em formato SVG ou PNG com fundo transparente</li><li>Textos das páginas principais (sobre, serviços, contato)</li><li>Fotos ou imagens da empresa ou produtos</li><li>Número de WhatsApp e e-mail de contato</li><li>Acesso ao domínio ou autorização para configurar DNS</li><li>Conta no provedor de hospedagem (se aplicável)</li></ul><h2>O que é entregue em 48 horas</h2><p>Em até 48 horas de trabalho efetivo, é possível entregar um site com estrutura completa: homepage, páginas de serviços, sobre, contato, formulário funcionando, WhatsApp integrado, layout responsivo, ferramentas de análise instaladas e SEO básico configurado.</p><h3>Ferramentas essenciais incluídas</h3><p>Google Analytics, Google Tag Manager, Search Console e integração com WhatsApp são configurados como parte do projeto para que você já comece a monitorar e atender desde o primeiro dia.</p><h2>Qual plataforma usar</h2><p>Para sites institucionais, WordPress com Elementor é a escolha mais comum por oferecer flexibilidade, facilidade de edição e grande ecossistema de temas e plugins. Para lojas virtuais, Shopify, Tray, Nuvemshop ou WooCommerce são avaliados conforme o perfil do negócio.</p><h2>Conclusão</h2><p>Um site profissional no ar em 48 horas é uma realidade para empresas que se preparam com antecedência. Com os materiais em mãos e o processo organizado, sua empresa pode ter presença digital estruturada rapidamente.</p>`,
        imagemCapa:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2QTVDRkYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0QzZGRkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjI1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn4+oPC90ZXh0Pjwvc3ZnPg==',
        categoria_id:4,
        autor:'Algoritmo.AI',
        status:'publicado',
        publicado_em:'2025-05-08',
        tempo_leitura:'6 min',
        meta_title:'Como colocar um site profissional no ar em 48 horas | Algoritmo.AI',
        meta_description:'Entenda o que é necessário para lançar um site institucional ou loja virtual em até 48 horas com a Algoritmo.AI.',
        palavra_chave:'site em 48 horas',
        tags:['site','48 horas','lançamento','digital']
      },
      {
        id:3,
        titulo:'Como a inteligência artificial pode ajudar pequenas empresas a vender melhor',
        slug:'inteligencia-artificial-para-pequenas-empresas',
        resumo:'A inteligência artificial não é mais exclusiva de grandes corporações. Pequenas e médias empresas podem usar IA para melhorar atendimento, criar conteúdo, analisar dados e otimizar processos.',
        conteudo:`<h2>IA ao alcance de todos</h2><p>Ferramentas de inteligência artificial como ChatGPT, Gemini, Claude e dezenas de soluções especializadas tornaram o acesso à IA possível para qualquer tipo de empresa, independente do tamanho. O que diferencia os negócios que crescem com IA dos que não aproveitam é a forma de aplicar as ferramentas à operação real.</p><h2>Onde a IA pode ajudar seu negócio</h2><h3>1. Atendimento e suporte</h3><p>Agentes de IA podem responder dúvidas frequentes, qualificar leads, registrar contatos e encaminhar atendimentos no WhatsApp e outros canais. Isso reduz o tempo de resposta e libera a equipe para atividades de maior valor.</p><h3>2. Criação de conteúdo</h3><p>Textos para produtos, descrições de serviços, posts para redes sociais, e-mails de campanha e materiais de comunicação podem ser criados com apoio de IA em uma fração do tempo normal.</p><h3>3. Análise de dados</h3><p>Ferramentas com IA conseguem interpretar relatórios de vendas, identificar padrões de comportamento do cliente e sugerir ações com base nos dados históricos da empresa.</p><h3>4. Automação de processos</h3><p>Desde envio de mensagens automáticas após uma compra até lembretes de reposição de estoque, a IA pode automatizar fluxos que hoje consomem tempo manual desnecessário.</p><h2>Como começar</h2><p>O primeiro passo é mapear os processos que mais consomem tempo ou que geram mais erros na operação. Em seguida, avaliar quais ferramentas de IA são mais adequadas para cada contexto. A Algoritmo.AI ajuda empresas nessa jornada de forma prática e objetiva.</p><h2>Conclusão</h2><p>Inteligência artificial aplicada de forma estratégica pode gerar impacto real no atendimento, nas vendas, na produtividade e na qualidade das decisões de uma pequena empresa.</p>`,
        imagemCapa:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwQjExMjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0QzZGRkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjI1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn6SBPC90ZXh0Pjwvc3ZnPg==',
        categoria_id:2,
        autor:'Algoritmo.AI',
        status:'publicado',
        publicado_em:'2025-05-15',
        tempo_leitura:'8 min',
        meta_title:'Inteligência Artificial para pequenas empresas: como vender melhor | Algoritmo.AI',
        meta_description:'Descubra como pequenas e médias empresas podem usar IA para melhorar atendimento, criar conteúdo e analisar dados.',
        palavra_chave:'inteligência artificial para pequenas empresas',
        tags:['ia','inteligência artificial','automação','pequenas empresas']
      },
      {
        id:4,
        titulo:'Shopify, Tray, Nuvemshop ou WooCommerce: qual plataforma escolher?',
        slug:'shopify-tray-nuvemshop-woocommerce-qual-escolher',
        resumo:'Escolher a plataforma certa para sua loja virtual é uma das decisões mais importantes do seu negócio digital. Compare as principais opções do mercado e entenda qual se encaixa melhor no seu contexto.',
        conteudo:`<h2>A escolha da plataforma importa</h2><p>Muitos empreendedores escolhem uma plataforma de e-commerce por indicação ou hábito, sem considerar fatores críticos como volume de produtos, integrações necessárias, custo total e facilidade de gestão. Essa decisão impacta diretamente a operação, os custos e a capacidade de crescimento da loja.</p><h2>Comparativo das principais plataformas</h2><h3>Shopify</h3><p>Plataforma global líder em e-commerce. Excelente para quem quer vender internacionalmente ou precisa de grande variedade de apps. Tem custo mensal em dólar e taxas por transação. É a melhor opção para quem quer escalar e tem volume financeiro para isso.</p><h3>Tray</h3><p>Plataforma brasileira robusta, ideal para lojas com alto volume de produtos e necessidade de integrações avançadas com marketplaces, ERPs e sistemas de estoque. Tem planos competitivos e suporte nacional.</p><h3>Nuvemshop</h3><p>Líder na América Latina para PMEs. Fácil de configurar, com bom ecossistema de apps e ótimo custo-benefício para lojas iniciantes e em crescimento. Interface intuitiva e suporte em português.</p><h3>WooCommerce</h3><p>Plugin de e-commerce para WordPress. Extremamente flexível e gratuito (o core), mas exige hospedagem, manutenção e conhecimento técnico maior. Ideal para projetos customizados com equipe técnica.</p><h2>Como decidir</h2><ul><li>Volume baixo de produtos e orçamento limitado: Nuvemshop</li><li>Volume alto de produtos com integrações avançadas: Tray</li><li>Operação internacional ou muito escalável: Shopify</li><li>Projeto customizado com equipe técnica: WooCommerce</li></ul><h2>Conclusão</h2><p>Não existe a melhor plataforma de forma absoluta. A melhor plataforma é aquela que atende às necessidades específicas do seu negócio, perfil de operação e orçamento disponível.</p>`,
        imagemCapa:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMEMyRkYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM0QzZGRkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjI1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn5OoPC90ZXh0Pjwvc3ZnPg==',
        categoria_id:1,
        autor:'Algoritmo.AI',
        status:'publicado',
        publicado_em:'2025-05-20',
        tempo_leitura:'9 min',
        meta_title:'Shopify, Tray, Nuvemshop ou WooCommerce: qual plataforma de e-commerce escolher?',
        meta_description:'Compare as principais plataformas de e-commerce e descubra qual é a ideal para o seu negócio.',
        palavra_chave:'melhor plataforma de e-commerce',
        tags:['shopify','tray','nuvemshop','woocommerce','plataforma e-commerce']
      },
      {
        id:5,
        titulo:'Por que instalar Google Analytics, Tag Manager e Pixel da Meta desde o início',
        slug:'google-analytics-tag-manager-pixel-meta-desde-inicio',
        resumo:'Muitos negócios digitais adiam a configuração de ferramentas de análise e perdem dados valiosos desde o começo. Entenda por que instalar essas ferramentas no dia zero é fundamental.',
        conteudo:`<h2>Dados desde o primeiro dia</h2><p>Toda visita ao seu site, toda interação com um anúncio e todo acesso a uma página de produto gera dados. Se as ferramentas de análise não estiverem instaladas e configuradas corretamente desde o início, esses dados se perdem para sempre. E dados históricos são insubstituíveis.</p><h2>Google Analytics 4</h2><p>O GA4 é a ferramenta principal para entender o comportamento dos usuários no seu site. Ele registra sessões, eventos, conversões, origem de tráfego, tempo de permanência e muito mais. Sem ele, você opera no escuro.</p><h3>O que o GA4 permite</h3><ul><li>Entender de onde vem o tráfego (orgânico, pago, direto, social)</li><li>Analisar quais páginas têm maior taxa de saída</li><li>Monitorar conversões e metas do site</li><li>Criar audiências para remarketing</li></ul><h2>Google Tag Manager</h2><p>O GTM é um gerenciador de tags que permite instalar e configurar scripts no site sem precisar mexer no código diretamente. Facilita a instalação do Pixel da Meta, rastreamentos de eventos, scripts de chat e qualquer outra ferramenta terceira.</p><h2>Pixel da Meta (Facebook/Instagram)</h2><p>O Pixel da Meta rastreia o comportamento dos usuários que vieram de anúncios no Facebook e Instagram, ou que podem ser impactados futuramente. Ele alimenta os algoritmos de otimização de campanhas com dados reais de comportamento.</p><h3>Por que o Pixel é urgente</h3><p>O Pixel precisa de tempo para acumular dados antes de as campanhas funcionarem com máxima eficiência. Quanto mais cedo instalado, melhor a qualidade das audiências e mais precisa a otimização automática.</p><h2>Conclusão</h2><p>Instalar Google Analytics, Tag Manager e Pixel da Meta desde o primeiro dia não é opcional para quem quer crescer com estratégia. É a base de qualquer operação digital orientada a dados.</p>`,
        imagemCapa:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxRjI5MzciLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2QTVDRkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjQwMCIgeT0iMjI1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn5OSPC90ZXh0Pjwvc3ZnPg==',
        categoria_id:5,
        autor:'Algoritmo.AI',
        status:'publicado',
        publicado_em:'2025-05-26',
        tempo_leitura:'7 min',
        meta_title:'Google Analytics, Tag Manager e Pixel da Meta: instale desde o início | Algoritmo.AI',
        meta_description:'Saiba por que configurar ferramentas de análise e rastreamento desde o primeiro dia é essencial para qualquer negócio digital.',
        palavra_chave:'google analytics tag manager pixel meta',
        tags:['analytics','tag manager','pixel meta','ferramentas digitais']
      }
    ];
    localStorage.setItem('algoritmo_posts', JSON.stringify(posts));
  }

  if (!localStorage.getItem('algoritmo_servicos')) {
    const servicos = [
      {id:1,nome:'Lojas Virtuais',icone:'🏪',descCurta:'Implementação completa de lojas virtuais',descCompleta:'Implementação completa com configuração de plataforma, pagamentos, frete, produtos e ferramentas. Tray, Shopify, Nuvemshop e WooCommerce.',ordem:1,status:'ativo'},
      {id:2,nome:'Sites Institucionais',icone:'🏢',descCurta:'Sites modernos e profissionais',descCompleta:'Sites modernos para apresentar sua empresa, serviços e captar contatos com estrutura profissional, layout responsivo e SEO básico.',ordem:2,status:'ativo'},
      {id:3,nome:'Auditoria de E-commerce',icone:'🔍',descCurta:'Análise criteriosa da loja e campanhas',descCompleta:'Análise criteriosa da loja, campanhas, dados e conversão para identificar oportunidades reais de melhoria e crescimento.',ordem:3,status:'ativo'},
      {id:4,nome:'Inteligência Artificial',icone:'🤖',descCurta:'Aplicação prática de IA para o negócio',descCompleta:'Aplicação prática de IA para conteúdo, atendimento, automação e análise. Criação de agentes e treinamento para equipe.',ordem:4,status:'ativo'},
      {id:5,nome:'Tráfego Pago',icone:'📣',descCurta:'Campanhas em Google Ads e Meta Ads',descCompleta:'Estruturação e análise de campanhas em Google Ads e Meta Ads orientadas a resultado e retorno sobre investimento.',ordem:5,status:'ativo'},
      {id:6,nome:'Projeto em 48 Horas',icone:'⚡',descCurta:'Loja virtual ou site no ar em até 48h',descCompleta:'Loja virtual ou site institucional no ar em até 48 horas, com ferramentas essenciais configuradas e integradas.',ordem:6,status:'ativo'},
      {id:7,nome:'Landing Pages',icone:'🎯',descCurta:'Páginas de alta conversão para campanhas',descCompleta:'Landing pages focadas em conversão para campanhas de tráfego pago, captação de leads e validação de produtos.',ordem:7,status:'ativo'}
    ];
    localStorage.setItem('algoritmo_servicos', JSON.stringify(servicos));
  }

  if (!localStorage.getItem('algoritmo_config')) {
    const config = {whatsapp:'5511999999999',email:'contato@algoritmo.ai',instagram:'',linkedin:''};
    localStorage.setItem('algoritmo_config', JSON.stringify(config));
  }

  if (!localStorage.getItem('algoritmo_home')) {
    const home = {
      headline:'Projetos digitais, e-commerce e inteligência artificial para empresas que querem crescer com estratégia.',
      subheadline:'A Algoritmo.AI implementa lojas virtuais, sites institucionais, ferramentas digitais, auditorias de performance, campanhas e soluções com IA.',
      cta1_texto:'Solicitar diagnóstico',
      cta1_link:'#contato',
      cta2_texto:'Projeto em 48 Horas',
      cta2_link:'pages/projeto-digital-48-horas.html',
      sobre_titulo:'Uma parceira estratégica para o seu negócio digital',
      sobre_texto1:'A Algoritmo.AI é uma empresa especializada em projetos digitais, comércio eletrônico, marketing digital, automação e inteligência artificial aplicada aos negócios.',
      sobre_texto2:'Nosso trabalho une tecnologia, estratégia e acompanhamento próximo para que pequenas e médias empresas tenham uma presença digital mais profissional e preparada para crescer.'
    };
    localStorage.setItem('algoritmo_home', JSON.stringify(home));
  }

  if (!localStorage.getItem('algoritmo_midia')) {
    localStorage.setItem('algoritmo_midia', JSON.stringify([]));
  }
}

// ── STORAGE HELPERS ──────────────────────────
const DB = {
  get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  getObj: (key) => JSON.parse(localStorage.getItem(key) || '{}'),
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
};

// ── QUILL INSTANCE ────────────────────────────
let quill = null;

// ── TOAST ─────────────────────────────────────
function toast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span><span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── CONFIRM DELETE ────────────────────────────
function confirmDelete(msg, cb) {
  if (confirm(msg)) cb();
}

// ── SIDEBAR ───────────────────────────────────
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ── NAVIGATION ────────────────────────────────
const SECTION_TITLES = {
  dashboard: 'Dashboard',
  home: 'Página Home',
  posts: 'Blog › Posts',
  categorias: 'Blog › Categorias',
  servicos: 'Serviços',
  projeto48h: 'Projeto 48h',
  midia: 'Mídia',
  config: 'Configurações'
};

function navigate(section) {
  // Update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.sidebar-link[data-section="${section}"]`);
  if (link) link.classList.add('active');

  document.getElementById('topbarTitle').textContent = SECTION_TITLES[section] || section;
  document.getElementById('topbarActions').innerHTML = '';
  closeSidebar();

  const content = document.getElementById('adminContent');
  const renders = {
    dashboard: renderDashboard,
    home: renderHome,
    posts: renderPosts,
    categorias: renderCategorias,
    servicos: renderServicos,
    projeto48h: renderProjeto48h,
    midia: renderMidia,
    config: renderConfig
  };
  if (renders[section]) renders[section](content);
}

// ── LOGOUT ────────────────────────────────────
function logout() {
  sessionStorage.removeItem('algoritmo_auth');
  sessionStorage.removeItem('algoritmo_user');
  window.location.replace('../login.html');
}

// ── HELPERS ───────────────────────────────────
function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');
}

function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString('pt-BR');
}

function getCatName(id) {
  const cats = DB.get('algoritmo_categorias');
  const c = cats.find(c => c.id == id);
  return c ? c.nome : '—';
}

// ── DASHBOARD ────────────────────────────────
function renderDashboard(el) {
  const posts = DB.get('algoritmo_posts');
  const publicados = posts.filter(p => p.status === 'publicado').length;
  const rascunhos = posts.filter(p => p.status === 'rascunho').length;
  const servicos = DB.get('algoritmo_servicos').filter(s => s.status === 'ativo').length;
  const midia = DB.get('algoritmo_midia').length;

  const recentes = [...posts].sort((a,b) => new Date(b.publicado_em) - new Date(a.publicado_em)).slice(0,5);

  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Posts Publicados</div>
        <div class="stat-value">${publicados}</div>
        <div class="stat-sub">no blog</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Rascunhos</div>
        <div class="stat-value">${rascunhos}</div>
        <div class="stat-sub">aguardando publicação</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Serviços Ativos</div>
        <div class="stat-value">${servicos}</div>
        <div class="stat-sub">configurados</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Imagens</div>
        <div class="stat-value">${midia}</div>
        <div class="stat-sub">na galeria de mídia</div>
      </div>
    </div>

    <div style="margin-bottom:16px;font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Atalhos rápidos</div>
    <div class="quick-actions" style="margin-bottom:28px;">
      <a class="quick-action" onclick="navigate('posts')"><span class="quick-action-icon">✏️</span>Novo Post</a>
      <a class="quick-action" onclick="navigate('servicos')"><span class="quick-action-icon">⚙️</span>Serviços</a>
      <a class="quick-action" onclick="navigate('home')"><span class="quick-action-icon">🏠</span>Editar Home</a>
      <a class="quick-action" onclick="navigate('midia')"><span class="quick-action-icon">🖼️</span>Upload Mídia</a>
      <a class="quick-action" onclick="navigate('config')"><span class="quick-action-icon">🔧</span>Configurações</a>
      <a class="quick-action" href="../blog/index.html" target="_blank"><span class="quick-action-icon">🌐</span>Ver Blog</a>
    </div>

    <div style="margin-bottom:16px;font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Posts recentes</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Título</th><th>Categoria</th><th>Status</th><th>Data</th></tr></thead>
        <tbody>
          ${recentes.length === 0 ? `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">Nenhum post ainda</td></tr>` :
            recentes.map(p => `
              <tr>
                <td><strong>${p.titulo}</strong></td>
                <td>${getCatName(p.categoria_id)}</td>
                <td><span class="badge ${p.status === 'publicado' ? 'badge-success' : 'badge-warning'}">${p.status}</span></td>
                <td>${fmtDate(p.publicado_em)}</td>
              </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

// ── HOME ─────────────────────────────────────
function renderHome(el) {
  const home = DB.getObj('algoritmo_home');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Página Home</h2><p>Edite os textos e conteúdos da página principal</p></div>
      <button class="btn btn-primary" onclick="saveHome()">💾 Salvar alterações</button>
    </div>
    <div class="card">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px;">Hero Principal</div>
      <div class="form-group">
        <label class="form-label">Headline principal</label>
        <textarea id="homeHeadline" class="form-control" rows="3">${home.headline || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Subheadline</label>
        <textarea id="homeSubheadline" class="form-control" rows="2">${home.subheadline || ''}</textarea>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">CTA 1 — Texto</label>
          <input type="text" id="homeCta1Texto" class="form-control" value="${home.cta1_texto || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">CTA 1 — Link</label>
          <input type="text" id="homeCta1Link" class="form-control" value="${home.cta1_link || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">CTA 2 — Texto</label>
          <input type="text" id="homeCta2Texto" class="form-control" value="${home.cta2_texto || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">CTA 2 — Link</label>
          <input type="text" id="homeCta2Link" class="form-control" value="${home.cta2_link || ''}" />
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:16px;">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px;">Seção Sobre</div>
      <div class="form-group">
        <label class="form-label">Título Sobre</label>
        <input type="text" id="homeSobreTitulo" class="form-control" value="${home.sobre_titulo || ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">Texto Sobre (parágrafo 1)</label>
        <textarea id="homeSobreTexto1" class="form-control" rows="3">${home.sobre_texto1 || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Texto Sobre (parágrafo 2)</label>
        <textarea id="homeSobreTexto2" class="form-control" rows="3">${home.sobre_texto2 || ''}</textarea>
      </div>
      <button class="btn btn-primary" onclick="saveHome()">💾 Salvar alterações</button>
    </div>`;
}

function saveHome() {
  const home = {
    headline: document.getElementById('homeHeadline').value,
    subheadline: document.getElementById('homeSubheadline').value,
    cta1_texto: document.getElementById('homeCta1Texto').value,
    cta1_link: document.getElementById('homeCta1Link').value,
    cta2_texto: document.getElementById('homeCta2Texto').value,
    cta2_link: document.getElementById('homeCta2Link').value,
    sobre_titulo: document.getElementById('homeSobreTitulo').value,
    sobre_texto1: document.getElementById('homeSobreTexto1').value,
    sobre_texto2: document.getElementById('homeSobreTexto2').value
  };
  DB.set('algoritmo_home', home);
  toast('Página Home salva com sucesso!');
}

// ── POSTS ─────────────────────────────────────
function renderPosts(el) {
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openPostModal()">+ Novo Post</button>`;
  const posts = DB.get('algoritmo_posts');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Posts do Blog</h2><p>${posts.length} post(s) cadastrado(s)</p></div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
      <input type="text" id="postSearch" class="form-control" placeholder="Buscar posts..." style="max-width:280px;" oninput="filterPosts()" />
      <select id="postFilterStatus" class="form-control" style="max-width:160px;" onchange="filterPosts()">
        <option value="">Todos os status</option>
        <option value="publicado">Publicado</option>
        <option value="rascunho">Rascunho</option>
      </select>
    </div>
    <div class="table-wrap" id="postsTable">
      ${renderPostsTable(posts)}
    </div>`;
}

function renderPostsTable(posts) {
  if (posts.length === 0) return `<div class="empty-state"><div class="empty-state-icon">📝</div><h3>Nenhum post</h3><p>Clique em "+ Novo Post" para criar o primeiro.</p></div>`;
  return `<table>
    <thead><tr><th style="width:40%;">Título</th><th>Categoria</th><th>Status</th><th>Data</th><th>Leitura</th><th>Ações</th></tr></thead>
    <tbody>
      ${posts.map(p => `
        <tr>
          <td><strong>${p.titulo}</strong><div style="font-size:11px;color:var(--text-muted);">/blog/post.html?slug=${p.slug}</div></td>
          <td>${getCatName(p.categoria_id)}</td>
          <td><span class="badge ${p.status === 'publicado' ? 'badge-success' : 'badge-warning'}">${p.status}</span></td>
          <td>${fmtDate(p.publicado_em)}</td>
          <td>${p.tempo_leitura || '—'}</td>
          <td class="td-actions">
            <button class="btn btn-secondary btn-sm" onclick="editPost(${p.id})">✏️ Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deletePost(${p.id})">🗑️</button>
          </td>
        </tr>`).join('')}
    </tbody></table>`;
}

function filterPosts() {
  const q = (document.getElementById('postSearch')?.value || '').toLowerCase();
  const s = document.getElementById('postFilterStatus')?.value || '';
  let posts = DB.get('algoritmo_posts');
  if (q) posts = posts.filter(p => p.titulo.toLowerCase().includes(q) || (p.resumo||'').toLowerCase().includes(q));
  if (s) posts = posts.filter(p => p.status === s);
  document.getElementById('postsTable').innerHTML = renderPostsTable(posts);
}

// POST MODAL
let quillReady = false;
function openPostModal(post = null) {
  const modal = document.getElementById('postModal');
  modal.classList.add('open');
  document.getElementById('postModalTitle').textContent = post ? 'Editar Post' : 'Novo Post';
  document.getElementById('postEditId').value = post ? post.id : '';
  document.getElementById('postTitulo').value = post ? post.titulo : '';
  document.getElementById('postSlug').value = post ? post.slug : '';
  document.getElementById('postAutor').value = post ? post.autor : 'Algoritmo.AI';
  document.getElementById('postTempoLeitura').value = post ? (post.tempo_leitura || '') : '';
  document.getElementById('postResumo').value = post ? (post.resumo || '') : '';
  document.getElementById('postTags').value = post ? (Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags||'')) : '';
  document.getElementById('postStatus').value = post ? (post.status || 'publicado') : 'publicado';
  document.getElementById('postMetaTitle').value = post ? (post.meta_title || '') : '';
  document.getElementById('postMetaDesc').value = post ? (post.meta_description || '') : '';
  document.getElementById('postPalavraChave').value = post ? (post.palavra_chave || '') : '';
  document.getElementById('postImagemCapa').value = post ? (post.imagemCapa || '') : '';

  // Cover preview
  const img = document.getElementById('coverImg');
  const ph = document.getElementById('coverPlaceholder');
  if (post && post.imagemCapa) {
    img.src = post.imagemCapa; img.style.display = 'block'; ph.style.display = 'none';
  } else {
    img.src = ''; img.style.display = 'none'; ph.style.display = 'block';
  }

  // Populate categories
  const cats = DB.get('algoritmo_categorias').filter(c => c.status === 'ativo');
  const sel = document.getElementById('postCategoria');
  sel.innerHTML = cats.map(c => `<option value="${c.id}" ${post && post.categoria_id == c.id ? 'selected' : ''}>${c.nome}</option>`).join('');

  // Init Quill
  if (!quill) {
    quill = new Quill('#quillEditor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'blockquote'],
          ['clean']
        ]
      }
    });
    quillReady = true;
  }
  quill.root.innerHTML = post ? (post.conteudo || '') : '';
}

function closePostModal() {
  document.getElementById('postModal').classList.remove('open');
}

function autoSlug() {
  const t = document.getElementById('postTitulo').value;
  if (!document.getElementById('postEditId').value) {
    document.getElementById('postSlug').value = slugify(t);
  }
}

function handleCoverUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const data = ev.target.result;
    document.getElementById('postImagemCapa').value = data;
    document.getElementById('coverImg').src = data;
    document.getElementById('coverImg').style.display = 'block';
    document.getElementById('coverPlaceholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function clearCover() {
  document.getElementById('postImagemCapa').value = '';
  document.getElementById('coverImg').src = '';
  document.getElementById('coverImg').style.display = 'none';
  document.getElementById('coverPlaceholder').style.display = 'block';
}

function savePost() {
  const titulo = document.getElementById('postTitulo').value.trim();
  if (!titulo) { toast('Título é obrigatório', 'error'); return; }
  const conteudo = quill ? quill.root.innerHTML : '';
  const editId = document.getElementById('postEditId').value;
  const tagsRaw = document.getElementById('postTags').value;

  const post = {
    titulo,
    slug: document.getElementById('postSlug').value.trim() || slugify(titulo),
    resumo: document.getElementById('postResumo').value.trim(),
    conteudo,
    imagemCapa: document.getElementById('postImagemCapa').value,
    categoria_id: parseInt(document.getElementById('postCategoria').value),
    autor: document.getElementById('postAutor').value.trim(),
    tempo_leitura: document.getElementById('postTempoLeitura').value.trim(),
    status: document.getElementById('postStatus').value,
    publicado_em: new Date().toISOString().split('T')[0],
    meta_title: document.getElementById('postMetaTitle').value.trim(),
    meta_description: document.getElementById('postMetaDesc').value.trim(),
    palavra_chave: document.getElementById('postPalavraChave').value.trim(),
    tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
  };

  const posts = DB.get('algoritmo_posts');
  if (editId) {
    const idx = posts.findIndex(p => p.id == editId);
    if (idx > -1) {
      post.id = parseInt(editId);
      post.publicado_em = posts[idx].publicado_em;
      posts[idx] = post;
      toast('Post atualizado com sucesso!');
    }
  } else {
    post.id = Date.now();
    posts.push(post);
    toast('Post criado com sucesso!');
  }
  DB.set('algoritmo_posts', posts);
  closePostModal();
  navigate('posts');
}

function editPost(id) {
  const post = DB.get('algoritmo_posts').find(p => p.id == id);
  if (post) openPostModal(post);
}

function deletePost(id) {
  confirmDelete('Tem certeza que deseja excluir este post?', () => {
    const posts = DB.get('algoritmo_posts').filter(p => p.id != id);
    DB.set('algoritmo_posts', posts);
    toast('Post excluído!');
    navigate('posts');
  });
}

// ── CATEGORIAS ────────────────────────────────
function renderCategorias(el) {
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openCategoriaModal()">+ Nova Categoria</button>`;
  const cats = DB.get('algoritmo_categorias');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Categorias do Blog</h2><p>${cats.length} categoria(s)</p></div>
    </div>
    <div class="table-wrap">
      ${cats.length === 0
        ? `<div class="empty-state"><div class="empty-state-icon">🏷️</div><h3>Nenhuma categoria</h3></div>`
        : `<table>
            <thead><tr><th>Nome</th><th>Slug</th><th>Descrição</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              ${cats.map(c => `
                <tr>
                  <td><strong>${c.nome}</strong></td>
                  <td><code style="font-size:11px;">${c.slug}</code></td>
                  <td>${c.descricao || '—'}</td>
                  <td><span class="badge ${c.status === 'ativo' ? 'badge-success' : 'badge-gray'}">${c.status}</span></td>
                  <td class="td-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editCategoria(${c.id})">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategoria(${c.id})">🗑️</button>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>`}
    </div>`;
}

function openCategoriaModal(cat = null) {
  document.getElementById('categoriaModal').classList.add('open');
  document.getElementById('categoriaModalTitle').textContent = cat ? 'Editar Categoria' : 'Nova Categoria';
  document.getElementById('categoriaEditId').value = cat ? cat.id : '';
  document.getElementById('categoriaNome').value = cat ? cat.nome : '';
  document.getElementById('categoriaSlug').value = cat ? cat.slug : '';
  document.getElementById('categoriaDescricao').value = cat ? (cat.descricao || '') : '';
  document.getElementById('categoriaStatus').value = cat ? (cat.status || 'ativo') : 'ativo';
}

function closeCategoriaModal() {
  document.getElementById('categoriaModal').classList.remove('open');
}

function autoCatSlug() {
  const n = document.getElementById('categoriaNome').value;
  if (!document.getElementById('categoriaEditId').value) {
    document.getElementById('categoriaSlug').value = slugify(n);
  }
}

function saveCategoria() {
  const nome = document.getElementById('categoriaNome').value.trim();
  if (!nome) { toast('Nome é obrigatório', 'error'); return; }
  const editId = document.getElementById('categoriaEditId').value;
  const cat = {
    nome,
    slug: document.getElementById('categoriaSlug').value.trim() || slugify(nome),
    descricao: document.getElementById('categoriaDescricao').value.trim(),
    status: document.getElementById('categoriaStatus').value
  };
  const cats = DB.get('algoritmo_categorias');
  if (editId) {
    const idx = cats.findIndex(c => c.id == editId);
    if (idx > -1) { cat.id = parseInt(editId); cats[idx] = cat; toast('Categoria atualizada!'); }
  } else {
    cat.id = Date.now();
    cats.push(cat);
    toast('Categoria criada!');
  }
  DB.set('algoritmo_categorias', cats);
  closeCategoriaModal();
  navigate('categorias');
}

function editCategoria(id) {
  const cat = DB.get('algoritmo_categorias').find(c => c.id == id);
  if (cat) openCategoriaModal(cat);
}

function deleteCategoria(id) {
  confirmDelete('Excluir esta categoria?', () => {
    const cats = DB.get('algoritmo_categorias').filter(c => c.id != id);
    DB.set('algoritmo_categorias', cats);
    toast('Categoria excluída!');
    navigate('categorias');
  });
}

// ── SERVIÇOS ──────────────────────────────────
function renderServicos(el) {
  document.getElementById('topbarActions').innerHTML = `<button class="btn btn-primary" onclick="openServicoModal()">+ Novo Serviço</button>`;
  const servicos = DB.get('algoritmo_servicos').sort((a,b) => a.ordem - b.ordem);
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Serviços</h2><p>${servicos.length} serviço(s)</p></div>
    </div>
    <div class="table-wrap">
      ${servicos.length === 0
        ? `<div class="empty-state"><div class="empty-state-icon">⚙️</div><h3>Nenhum serviço</h3></div>`
        : `<table>
            <thead><tr><th>Ordem</th><th>Ícone</th><th>Nome</th><th>Descrição Curta</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              ${servicos.map(s => `
                <tr>
                  <td>${s.ordem}</td>
                  <td style="font-size:20px;">${s.icone || '⚙️'}</td>
                  <td><strong>${s.nome}</strong></td>
                  <td style="max-width:280px;">${s.descCurta || '—'}</td>
                  <td><span class="badge ${s.status === 'ativo' ? 'badge-success' : 'badge-gray'}">${s.status}</span></td>
                  <td class="td-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editServico(${s.id})">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteServico(${s.id})">🗑️</button>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>`}
    </div>`;
}

function openServicoModal(serv = null) {
  document.getElementById('servicoModal').classList.add('open');
  document.getElementById('servicoModalTitle').textContent = serv ? 'Editar Serviço' : 'Novo Serviço';
  document.getElementById('servicoEditId').value = serv ? serv.id : '';
  document.getElementById('servicoNome').value = serv ? serv.nome : '';
  document.getElementById('servicoIcone').value = serv ? (serv.icone || '') : '';
  document.getElementById('servicoDescCurta').value = serv ? (serv.descCurta || '') : '';
  document.getElementById('servicoDescCompleta').value = serv ? (serv.descCompleta || '') : '';
  document.getElementById('servicoOrdem').value = serv ? (serv.ordem || 1) : 1;
  document.getElementById('servicoStatus').value = serv ? (serv.status || 'ativo') : 'ativo';
}

function closeServicoModal() {
  document.getElementById('servicoModal').classList.remove('open');
}

function saveServico() {
  const nome = document.getElementById('servicoNome').value.trim();
  if (!nome) { toast('Nome é obrigatório', 'error'); return; }
  const editId = document.getElementById('servicoEditId').value;
  const s = {
    nome,
    icone: document.getElementById('servicoIcone').value.trim(),
    descCurta: document.getElementById('servicoDescCurta').value.trim(),
    descCompleta: document.getElementById('servicoDescCompleta').value.trim(),
    ordem: parseInt(document.getElementById('servicoOrdem').value) || 1,
    status: document.getElementById('servicoStatus').value
  };
  const servicos = DB.get('algoritmo_servicos');
  if (editId) {
    const idx = servicos.findIndex(sv => sv.id == editId);
    if (idx > -1) { s.id = parseInt(editId); servicos[idx] = s; toast('Serviço atualizado!'); }
  } else {
    s.id = Date.now();
    servicos.push(s);
    toast('Serviço criado!');
  }
  DB.set('algoritmo_servicos', servicos);
  closeServicoModal();
  navigate('servicos');
}

function editServico(id) {
  const s = DB.get('algoritmo_servicos').find(s => s.id == id);
  if (s) openServicoModal(s);
}

function deleteServico(id) {
  confirmDelete('Excluir este serviço?', () => {
    const servicos = DB.get('algoritmo_servicos').filter(s => s.id != id);
    DB.set('algoritmo_servicos', servicos);
    toast('Serviço excluído!');
    navigate('servicos');
  });
}

// ── PROJETO 48H ───────────────────────────────
function renderProjeto48h(el) {
  const key = 'algoritmo_projeto48h';
  const d = JSON.parse(localStorage.getItem(key) || '{}');
  const beneficios = d.beneficios || ['Estruturação completa','Ferramentas essenciais','IA aplicada','Base para campanhas','Validação e entrega'];
  const etapas = d.etapas || ['Diagnóstico rápido','Coleta de materiais','Implementação em 48h','Validação e entrega'];
  const checklist = d.checklist || ['Site ou loja virtual configurada','Páginas principais criadas','Layout inicial ajustado','Ferramentas de análise instaladas'];
  const faq = d.faq || [{p:'O projeto realmente fica pronto em 48 horas?',r:'Sim, desde que os materiais necessários sejam enviados antes do início.'}];

  el.innerHTML = `
    <div class="section-header">
      <div><h2>Projeto 48h</h2><p>Editar conteúdo da página do Projeto Digital em 48 Horas</p></div>
      <button class="btn btn-primary" onclick="saveProjeto48h()">💾 Salvar</button>
    </div>
    <div class="card" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px;">Textos Principais</div>
      <div class="form-group">
        <label class="form-label">Headline</label>
        <input type="text" id="p48headline" class="form-control" value="${d.headline||'Seu projeto no ar em 48h'}" />
      </div>
      <div class="form-group">
        <label class="form-label">Subheadline</label>
        <textarea id="p48subheadline" class="form-control" rows="2">${d.subheadline||'Estrutura digital profissional com ferramentas essenciais configuradas.'}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">CTA Texto</label>
        <input type="text" id="p48cta" class="form-control" value="${d.cta||'Quero meu projeto em 48h'}" />
      </div>
      <div class="form-group">
        <label class="form-label">Nota de prazo</label>
        <textarea id="p48nota" class="form-control" rows="2">${d.nota||'O prazo de 48 horas considera o recebimento completo das informações necessárias.'}</textarea>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px;">Benefícios</div>
      <div class="list-editor" id="beneficiosList">
        ${beneficios.map((b,i) => `<div class="list-editor-item"><input type="text" value="${b}" /><button class="remove-item" onclick="removeListItem(this)">×</button></div>`).join('')}
      </div>
      <button class="add-list-item" onclick="addListItem('beneficiosList')">+ Adicionar benefício</button>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px;">Etapas</div>
      <div class="list-editor" id="etapasList">
        ${etapas.map((e,i) => `<div class="list-editor-item"><input type="text" value="${e}" /><button class="remove-item" onclick="removeListItem(this)">×</button></div>`).join('')}
      </div>
      <button class="add-list-item" onclick="addListItem('etapasList')">+ Adicionar etapa</button>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px;">Checklist</div>
      <div class="list-editor" id="checklistList">
        ${checklist.map((c,i) => `<div class="list-editor-item"><input type="text" value="${c}" /><button class="remove-item" onclick="removeListItem(this)">×</button></div>`).join('')}
      </div>
      <button class="add-list-item" onclick="addListItem('checklistList')">+ Adicionar item</button>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:12px;">FAQ</div>
      <div id="faqList">
        ${faq.map((f,i) => `
          <div class="card" style="margin-bottom:10px;padding:14px;">
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label">Pergunta</label>
              <input type="text" class="form-control faq-pergunta" value="${f.p}" />
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label">Resposta</label>
              <textarea class="form-control faq-resposta" rows="2">${f.r}</textarea>
            </div>
            <button class="btn btn-danger btn-sm" onclick="this.closest('.card').remove()">🗑️ Remover</button>
          </div>`).join('')}
      </div>
      <button class="add-list-item" onclick="addFaqItem()">+ Adicionar pergunta</button>
    </div>
    <button class="btn btn-primary" onclick="saveProjeto48h()">💾 Salvar tudo</button>`;
}

function addListItem(listId) {
  const list = document.getElementById(listId);
  const div = document.createElement('div');
  div.className = 'list-editor-item';
  div.innerHTML = `<input type="text" placeholder="Novo item..." /><button class="remove-item" onclick="removeListItem(this)">×</button>`;
  list.appendChild(div);
}

function removeListItem(btn) {
  btn.closest('.list-editor-item').remove();
}

function addFaqItem() {
  const faqList = document.getElementById('faqList');
  const div = document.createElement('div');
  div.className = 'card';
  div.style.cssText = 'margin-bottom:10px;padding:14px;';
  div.innerHTML = `
    <div class="form-group" style="margin-bottom:8px;">
      <label class="form-label">Pergunta</label>
      <input type="text" class="form-control faq-pergunta" />
    </div>
    <div class="form-group" style="margin-bottom:8px;">
      <label class="form-label">Resposta</label>
      <textarea class="form-control faq-resposta" rows="2"></textarea>
    </div>
    <button class="btn btn-danger btn-sm" onclick="this.closest('.card').remove()">🗑️ Remover</button>`;
  faqList.appendChild(div);
}

function saveProjeto48h() {
  const beneficios = [...document.querySelectorAll('#beneficiosList input')].map(i => i.value.trim()).filter(Boolean);
  const etapas = [...document.querySelectorAll('#etapasList input')].map(i => i.value.trim()).filter(Boolean);
  const checklist = [...document.querySelectorAll('#checklistList input')].map(i => i.value.trim()).filter(Boolean);
  const faqPergs = document.querySelectorAll('.faq-pergunta');
  const faqResps = document.querySelectorAll('.faq-resposta');
  const faq = [...faqPergs].map((p,i) => ({p: p.value.trim(), r: faqResps[i]?.value.trim() || ''})).filter(f => f.p);
  const data = {
    headline: document.getElementById('p48headline').value,
    subheadline: document.getElementById('p48subheadline').value,
    cta: document.getElementById('p48cta').value,
    nota: document.getElementById('p48nota').value,
    beneficios, etapas, checklist, faq
  };
  localStorage.setItem('algoritmo_projeto48h', JSON.stringify(data));
  toast('Projeto 48h salvo!');
}

// ── MÍDIA ─────────────────────────────────────
function renderMidia(el) {
  const midia = DB.get('algoritmo_midia');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Galeria de Mídia</h2><p>${midia.length} imagem(ns)</p></div>
    </div>
    <div class="upload-zone" id="uploadZone" onclick="document.getElementById('uploadInput').click()">
      <div class="upload-zone-icon">📤</div>
      <p><strong>Clique para selecionar imagens</strong> ou arraste e solte aqui</p>
      <p style="font-size:11px;margin-top:4px;">JPG, PNG, GIF, WebP — max 5MB por arquivo</p>
    </div>
    <input type="file" id="uploadInput" accept="image/*" multiple style="display:none;" onchange="handleMediaUpload(event)" />
    <div class="media-grid" id="mediaGrid">
      ${midia.map((m,i) => `
        <div class="media-item" data-idx="${i}">
          <img src="${m.data}" alt="${m.alt||m.name}" loading="lazy" />
          <div class="media-item-actions">
            <button class="media-item-btn del" onclick="deleteMedia(${i})" title="Excluir">🗑️</button>
          </div>
          <div class="media-item-info">
            <div class="media-item-name">${m.name}</div>
          </div>
        </div>`).join('')}
    </div>`;

  // Drag & drop
  const zone = document.getElementById('uploadZone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleMediaFiles(e.dataTransfer.files);
  });
}

function handleMediaUpload(e) {
  handleMediaFiles(e.target.files);
}

function handleMediaFiles(files) {
  const midia = DB.get('algoritmo_midia');
  let count = 0;
  [...files].forEach(file => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { toast(`"${file.name}" é muito grande (max 5MB)`, 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      midia.push({ id: Date.now() + Math.random(), name: file.name, data: ev.target.result, alt: '' });
      count++;
      if (count === files.length) {
        DB.set('algoritmo_midia', midia);
        toast(`${count} imagem(ns) adicionada(s)!`);
        navigate('midia');
      }
    };
    reader.readAsDataURL(file);
  });
}

function deleteMedia(idx) {
  confirmDelete('Excluir esta imagem?', () => {
    const midia = DB.get('algoritmo_midia');
    midia.splice(idx, 1);
    DB.set('algoritmo_midia', midia);
    toast('Imagem excluída!');
    navigate('midia');
  });
}

// ── CONFIG ────────────────────────────────────
function renderConfig(el) {
  const cfg = DB.getObj('algoritmo_config');
  el.innerHTML = `
    <div class="section-header">
      <div><h2>Configurações</h2><p>Dados de contato e redes sociais</p></div>
      <button class="btn btn-primary" onclick="saveConfig()">💾 Salvar</button>
    </div>
    <div class="card">
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:16px;">Contato</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">WhatsApp (com DDD e código do país)</label>
          <input type="text" id="cfgWhatsapp" class="form-control" value="${cfg.whatsapp||''}" placeholder="5511999999999" />
        </div>
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input type="email" id="cfgEmail" class="form-control" value="${cfg.email||''}" />
        </div>
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.07em;margin:16px 0 12px;">Redes Sociais</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Instagram (URL)</label>
          <input type="url" id="cfgInstagram" class="form-control" value="${cfg.instagram||''}" placeholder="https://instagram.com/..." />
        </div>
        <div class="form-group">
          <label class="form-label">LinkedIn (URL)</label>
          <input type="url" id="cfgLinkedin" class="form-control" value="${cfg.linkedin||''}" placeholder="https://linkedin.com/..." />
        </div>
        <div class="form-group">
          <label class="form-label">Facebook (URL)</label>
          <input type="url" id="cfgFacebook" class="form-control" value="${cfg.facebook||''}" placeholder="https://facebook.com/..." />
        </div>
        <div class="form-group">
          <label class="form-label">YouTube (URL)</label>
          <input type="url" id="cfgYoutube" class="form-control" value="${cfg.youtube||''}" placeholder="https://youtube.com/..." />
        </div>
      </div>
      <button class="btn btn-primary" onclick="saveConfig()">💾 Salvar configurações</button>
    </div>`;
}

function saveConfig() {
  const cfg = {
    whatsapp: document.getElementById('cfgWhatsapp').value.trim(),
    email: document.getElementById('cfgEmail').value.trim(),
    instagram: document.getElementById('cfgInstagram').value.trim(),
    linkedin: document.getElementById('cfgLinkedin').value.trim(),
    facebook: document.getElementById('cfgFacebook').value.trim(),
    youtube: document.getElementById('cfgYoutube').value.trim()
  };
  DB.set('algoritmo_config', cfg);
  toast('Configurações salvas!');
}

// ── INIT ─────────────────────────────────────
(function init() {
  initializeData();
  const user = sessionStorage.getItem('algoritmo_user') || 'admin';
  document.getElementById('userName').textContent = user;
  document.getElementById('userAvatar').textContent = user.charAt(0).toUpperCase();
  navigate('dashboard');
})();
