/* ============================================================
   Cananéia & Ilha Comprida — bilingual content model
   All prices are ESTIMATES in Brazilian reais (R$ / BRL).
   Group = 6 travelers. Shared costs shown per person (÷6).
   ============================================================ */
window.CONTENT = {

  /* ---------- UI chrome / nav ---------- */
  nav: {
    why:{en:"Why visit",pt:"Por que ir"},
    history:{en:"History",pt:"História"},
    itinerary:{en:"Itinerary",pt:"Roteiro"},
    tours:{en:"Tours",pt:"Passeios"},
    stay:{en:"Stay",pt:"Hospedagem"},
    food:{en:"Food",pt:"Gastronomia"},
    budget:{en:"Budget",pt:"Orçamento"},
    videos:{en:"Videos",pt:"Vídeos"},
    tips:{en:"Tips",pt:"Dicas"},
    links:{en:"Links",pt:"Links"}
  },

  hero:{
    eyebrow:{en:"Southern coast of São Paulo · Brazil",pt:"Litoral sul de São Paulo · Brasil"},
    title:{en:"Cananéia & Ilha Comprida Travel Itinerary",pt:"Roteiro de Viagem Cananéia & Ilha Comprida"},
    dates:{en:"December 30, 2026 → January 2, 2027",pt:"30 de dezembro de 2026 → 2 de janeiro de 2027"},
    subtitle:{en:"Nature, history, local food, and Caiçara culture for a group of 6 travelers.",
      pt:"Natureza, história, gastronomia local e cultura caiçara para um grupo de 6 viajantes."},
    travelersLabel:{en:"Travelers:",pt:"Viajantes:"},
    badge:{
      boat:{en:"Estuary boat tours",pt:"Passeios de barco"},
      dolphin:{en:"Dolphin watching",pt:"Observação de golfinhos"},
      ferry:{en:"Ferry to Ilha Comprida",pt:"Balsa para Ilha Comprida"},
      nye:{en:"New Year's Eve",pt:"Réveillon"}
    }
  },

  /* ---------- 02 Why visit ---------- */
  why:{
    kicker:{en:"02 · Overview",pt:"02 · Visão geral"},
    title:{en:"Why visit Cananéia?",pt:"Por que visitar Cananéia?"},
    lead:{en:"Cananéia is a small, authentic town on the southern coast of São Paulo, wrapped in Atlantic Forest, mangroves and calm estuary waters. It rewards travelers who love nature, history, culture and fresh seafood over resort-style luxury.",
      pt:"Cananéia é uma cidade pequena e autêntica no litoral sul de São Paulo, cercada por Mata Atlântica, manguezais e as águas calmas do estuário. Encanta quem gosta de natureza, história, cultura e frutos do mar frescos — mais do que luxo de resort."},
    features:[
      {ico:"🏛️",en:{t:"Colonial Historic Center",d:"Cobbled streets, colonial houses and a historic church."},pt:{t:"Centro Histórico colonial",d:"Ruas de pedra, casarões coloniais e a igreja histórica."}},
      {ico:"🎣",en:{t:"Caiçara culture",d:"Traditional fishing communities, crafts and cuisine."},pt:{t:"Cultura caiçara",d:"Comunidades tradicionais de pesca, artesanato e culinária."}},
      {ico:"🚤",en:{t:"Mangrove & estuary tours",d:"Boat trips through channels and preserved mangroves."},pt:{t:"Passeios pelo estuário",d:"Barcos pelos canais e manguezais preservados."}},
      {ico:"🐬",en:{t:"Dolphin watching",d:"Chances to spot dolphins and Guiana dolphins (botos)."},pt:{t:"Golfinhos e botos",d:"Chance de avistar golfinhos e botos-cinza."}},
      {ico:"🏝️",en:{t:"Ilha do Cardoso",d:"A protected state park island with wild beaches."},pt:{t:"Ilha do Cardoso",d:"Ilha-parque estadual protegida, com praias selvagens."}},
      {ico:"⛴️",en:{t:"Ilha Comprida nearby",d:"A quick ferry ride to long, quiet ocean beaches."},pt:{t:"Ilha Comprida ao lado",d:"Uma balsa rápida até praias oceânicas longas e tranquilas."}}
    ],
    positioning:{en:"Cananéia is an authentic nature and heritage destination, rather than a luxury resort town.",
      pt:"Cananéia é um destino autêntico de natureza e patrimônio — não uma cidade de resort de luxo."}
  },

  /* ---------- 03 History ---------- */
  history:{
    kicker:{en:"03 · Heritage",pt:"03 · Patrimônio"},
    title:{en:"History of Cananéia",pt:"História de Cananéia"},
    body:{
      en:[
        "Cananéia is often described as one of Brazil's oldest colonial settlements, with roots reaching back to the earliest years of Portuguese colonization in the 1500s.",
        "The town has preserved much of its character over the centuries: colonial houses, historic churches and living Caiçara traditions still shape daily life along the waterfront.",
        "Cananéia sits within the Lagamar — one of Brazil's most important preserved areas of Atlantic Forest, estuaries and mangroves, and a UNESCO-recognized biosphere region."
      ],
      pt:[
        "Cananéia é frequentemente descrita como um dos assentamentos coloniais mais antigos do Brasil, com raízes nos primeiros anos da colonização portuguesa, no século XVI.",
        "A cidade preservou boa parte de sua identidade ao longo dos séculos: casarões coloniais, igrejas históricas e tradições caiçaras vivas ainda moldam o dia a dia à beira-mar.",
        "Cananéia fica dentro do Lagamar — uma das áreas mais importantes de Mata Atlântica, estuários e manguezais preservados do Brasil, reconhecida como Reserva da Biosfera."
      ]
    },
    facts:{
      title:{en:"Quick facts",pt:"Em resumo"},
      items:[
        {ico:"📅",en:{t:"Colonial origins",s:"Founded in the 1500s — among Brazil's oldest towns."},pt:{t:"Origem colonial",s:"Fundada no século XVI — entre as mais antigas do Brasil."}},
        {ico:"🌳",en:{t:"Lagamar region",s:"Atlantic Forest, estuaries & mangroves; UNESCO biosphere."},pt:{t:"Região do Lagamar",s:"Mata Atlântica, estuário e mangue; Reserva da Biosfera."}},
        {ico:"⛪",en:{t:"Historic church",s:"Igreja Matriz de São João Batista — Church of St. John the Baptist."},pt:{t:"Igreja histórica",s:"Igreja Matriz de São João Batista, no Centro Histórico."}},
        {ico:"🎣",en:{t:"Caiçara heritage",s:"Traditional coastal fishing culture, crafts and food."},pt:{t:"Herança caiçara",s:"Cultura tradicional de pesca, artesanato e comida."}}
      ]
    }
  },

  /* ---------- 04 Itinerary ---------- */
  itinerary:{
    kicker:{en:"04 · Day by day",pt:"04 · Dia a dia"},
    title:{en:"Day-by-day itinerary",pt:"Roteiro dia a dia"},
    lead:{en:"Four days built for a relaxed pace — light on transport, heavy on nature, food and New Year's celebration.",
      pt:"Quatro dias em ritmo tranquilo — pouco deslocamento e muita natureza, comida e Réveillon."},
    days:[
      {
        num:"30",
        date:{en:"Tuesday · December 30, 2026",pt:"Terça · 30 de dezembro de 2026"},
        title:{en:"Arrival & Historic Center",pt:"Chegada & Centro Histórico"},
        tag:{en:"Easy first day",pt:"Primeiro dia leve"},
        meta:[
          {ico:"🕛",en:"Arrival 12:00 PM",pt:"Chegada às 12h"},
          {ico:"🚶",en:"Walkable · minimal transport",pt:"A pé · pouco transporte"}
        ],
        acts:{
          en:["Hotel or guesthouse check-in","Lunch","Walking tour of the Historic Center","Igreja Matriz de São João Batista (historic church)","Colonial houses & historic streets","Waterfront and harbor","Local market and handicrafts","Cananéia Municipal Museum, if open","Sunset by the waterfront","Seafood dinner"],
          pt:["Check-in no hotel ou pousada","Almoço","Caminhada pelo Centro Histórico","Igreja Matriz de São João Batista","Casarões coloniais e ruas históricas","Orla e porto","Mercado local e artesanato","Museu Municipal de Cananéia, se aberto","Pôr do sol na orla","Jantar de frutos do mar"]
        },
        callout:{type:"tip",en:"<b>Pace:</b> a relaxed first day with minimal transportation.",pt:"<b>Ritmo:</b> um primeiro dia tranquilo, com pouco deslocamento."}
      },
      {
        num:"31",
        date:{en:"Wednesday · December 31, 2026",pt:"Quarta · 31 de dezembro de 2026"},
        title:{en:"Boat Tour & New Year's Eve",pt:"Passeio de Barco & Réveillon"},
        tag:{en:"Book ahead 🎆",pt:"Reserve antes 🎆"},
        meta:[
          {ico:"🚤",en:"Morning boat tour",pt:"Passeio de barco pela manhã"},
          {ico:"🎇",en:"NYE dinner & celebration",pt:"Jantar e festa de Réveillon"}
        ],
        acts:{
          en:["Breakfast","Morning boat tour through the estuary channels","Mangroves","Dolphin or Guiana dolphin watching","Possible stop at a beach or Caiçara community","Lunch","Afternoon rest","New Year's Eve dinner or celebration (reserve in advance)","Local New Year's Eve event"],
          pt:["Café da manhã","Passeio de barco pelos canais do estuário","Manguezais","Observação de golfinhos ou botos-cinza","Possível parada em praia ou comunidade caiçara","Almoço","Descanso à tarde","Jantar ou festa de Réveillon (reserve com antecedência)","Evento local de Réveillon"]
        },
        callout:{type:"warn",en:"<b>Heads-up:</b> wildlife sightings are never guaranteed. New Year's Eve restaurants, dinners and tours should be booked well in advance.",pt:"<b>Atenção:</b> avistar animais nunca é garantido. Restaurantes, jantares e passeios de Réveillon devem ser reservados com bastante antecedência."}
      },
      {
        num:"01",
        date:{en:"Thursday · January 1, 2027",pt:"Quinta · 1 de janeiro de 2027"},
        title:{en:"Ilha Comprida",pt:"Ilha Comprida"},
        tag:{en:"Beach day 🏖️",pt:"Dia de praia 🏖️"},
        meta:[
          {ico:"⛴️",en:"Ferry from Cananéia",pt:"Balsa saindo de Cananéia"},
          {ico:"🌅",en:"Return late afternoon",pt:"Retorno no fim da tarde"}
        ],
        acts:{
          en:["Relaxed morning","Ferry crossing to Ilha Comprida","Visit the southern part of the island","Beach walk","Coastal scenery","Photography","Simple lunch or snack","Return to Cananéia in the late afternoon","Farewell dinner"],
          pt:["Manhã tranquila","Travessia de balsa para a Ilha Comprida","Visita à porção sul da ilha","Caminhada na praia","Paisagem litorânea","Fotografia","Almoço ou lanche simples","Retorno a Cananéia no fim da tarde","Jantar de despedida"]
        },
        callout:{type:"tip",en:"<b>Important:</b> don't try to explore the entire length of Ilha Comprida in one day. Focus on the southern area closest to Cananéia.",pt:"<b>Importante:</b> não tente percorrer toda a extensão da Ilha Comprida em um dia. Concentre-se na porção sul, mais próxima de Cananéia."}
      },
      {
        num:"02",
        date:{en:"Friday · January 2, 2027",pt:"Sexta · 2 de janeiro de 2027"},
        title:{en:"Final Morning & Departure",pt:"Última Manhã & Partida"},
        tag:{en:"Checkout 12:00 PM",pt:"Saída às 12h"},
        meta:[
          {ico:"🕛",en:"Departure 12:00 PM",pt:"Partida às 12h"},
          {ico:"🛍️",en:"Souvenirs & handicrafts",pt:"Lembranças e artesanato"}
        ],
        acts:{
          en:["Breakfast","Final walk through the Historic Center or waterfront","Souvenir and handicraft shopping","Check-out","Departure from Cananéia at 12:00 PM"],
          pt:["Café da manhã","Última caminhada pelo Centro Histórico ou orla","Compra de lembranças e artesanato","Check-out","Saída de Cananéia às 12h"]
        },
        callout:null
      }
    ]
  },

  /* ---------- 05 Tours & attractions ---------- */
  tours:{
    kicker:{en:"05 · What to do",pt:"05 · O que fazer"},
    title:{en:"Main tours & attractions",pt:"Principais passeios & atrações"},
    cards:[
      {ico:"🏛️",title:{en:"Cananéia town",pt:"Cidade de Cananéia"},
        items:{en:["Historic Center","Igreja Matriz de São João Batista (historic church)","Waterfront and harbor","Cananéia Municipal Museum","Colonial architecture","Caiçara food and culture"],
          pt:["Centro Histórico","Igreja Matriz de São João Batista","Orla e porto","Museu Municipal de Cananéia","Arquitetura colonial","Comida e cultura caiçara"]}},
      {ico:"🚤",title:{en:"Nature tours",pt:"Passeios de natureza"},
        items:{en:["Boat tour through the estuary channels","Mangroves","Dolphin & Guiana dolphin watching","Caiçara communities","Ilha do Cardoso State Park"],
          pt:["Passeio de barco pelos canais do estuário","Manguezais","Golfinhos e botos-cinza","Comunidades caiçaras","Parque Estadual da Ilha do Cardoso"]}},
      {ico:"🏝️",title:{en:"Ilha Comprida",pt:"Ilha Comprida"},
        items:{en:["Ferry crossing from Cananéia","Southern beaches","Beach walks","Coastal scenery","A quieter, more natural atmosphere"],
          pt:["Travessia de balsa desde Cananéia","Praias do sul","Caminhadas na praia","Paisagem litorânea","Clima mais tranquilo e natural"]}}
    ]
  },

  /* ---------- 06 Stay ---------- */
  stay:{
    kicker:{en:"06 · Sleep",pt:"06 · Onde dormir"},
    title:{en:"Where to stay",pt:"Onde se hospedar"},
    lead:{en:"The most practical plan is to stay in Cananéia for all 3 nights — no hotel changes, and easy access to the Historic Center, boat tours, restaurants and the ferry. The group needs 3 double rooms for 3 nights (6 travelers). Prices below are estimated per person for the full 3-night stay.",
      pt:"O mais prático é ficar em Cananéia nas 3 noites — sem trocas de hotel e com acesso fácil ao Centro Histórico, passeios de barco, restaurantes e à balsa. O grupo precisa de 3 quartos de casal por 3 noites (6 viajantes). Os preços abaixo são estimativas por pessoa para as 3 noites."},
    tiers:[
      {badge:{en:"Budget",pt:"Econômico"},featured:false,
        title:{en:"Budget guesthouse",pt:"Pousada econômica"},
        orig:{en:"R$350–600 per double room, per night",pt:"R$350–600 por quarto de casal, por noite"},
        calc:{en:"3 rooms × 3 nights = R$3,150–5,400 total",pt:"3 quartos × 3 noites = R$3.150–5.400 no total"},
        pp:{en:"R$525–900",pt:"R$525–900"},
        sub:{en:"per person · full 3-night stay",pt:"por pessoa · nas 3 noites"}},
      {badge:{en:"Mid-range",pt:"Intermediário"},featured:true,
        title:{en:"Mid-range guesthouse or hotel",pt:"Pousada ou hotel intermediário"},
        orig:{en:"R$600–1,000 per double room, per night",pt:"R$600–1.000 por quarto de casal, por noite"},
        calc:{en:"3 rooms × 3 nights = R$5,400–9,000 total",pt:"3 quartos × 3 noites = R$5.400–9.000 no total"},
        pp:{en:"R$900–1,500",pt:"R$900–1.500"},
        sub:{en:"per person · full 3-night stay",pt:"por pessoa · nas 3 noites"}},
      {badge:{en:"Higher-end / NYE",pt:"Superior / Réveillon"},featured:false,
        title:{en:"Higher-end or special NYE package",pt:"Superior ou pacote de Réveillon"},
        orig:{en:"R$1,000–1,600+ per double room, per night",pt:"R$1.000–1.600+ por quarto de casal, por noite"},
        calc:{en:"3 rooms × 3 nights = R$9,000–14,400+ total",pt:"3 quartos × 3 noites = R$9.000–14.400+ no total"},
        pp:{en:"R$1,500–2,400+",pt:"R$1.500–2.400+"},
        sub:{en:"per person · full 3-night stay",pt:"por pessoa · nas 3 noites"}}
    ],
    maps:[
      {ico:"🏨",name:"Pousada Retiro das Caravelas",
        desc:{en:"Guesthouse in Cananéia · view on Google Maps",pt:"Pousada em Cananéia · ver no Google Maps"},
        url:"https://www.google.com/maps/place/Pousada+Retiro+das+Caravelas+em+Canan%C3%A9ia/@-25.0083682,-47.9417268,15z/data=!4m9!3m8!1s0x94dae57080e1139f:0x3538acad35550963!5m2!4m1!1i2!8m2!3d-25.0017661!4d-47.9316095!16s%2Fg%2F11g_07qkf",
        go:{en:"Open map",pt:"Abrir mapa"}},
      {ico:"🏨",name:"Hotel Pousada da Néia",
        desc:{en:"Guesthouse in Cananéia · view on Google Maps",pt:"Pousada em Cananéia · ver no Google Maps"},
        url:"https://www.google.com/maps/place/Hotel+Pousada+da+N%C3%A9ia/@-25.0123141,-47.9291205,17z/data=!3m1!4b1!4m9!3m8!1s0x94dae5679ed6ab6f:0xf177d11fdfd38900!5m2!4m1!1i2!8m2!3d-25.0123141!4d-47.9291205!16s%2Fg%2F11h1qppgs",
        go:{en:"Open map",pt:"Abrir mapa"}}
    ],
    notes:{
      en:["The group may also rent an entire house — divide the total by 6 travelers.","Check whether breakfast, taxes, cleaning fees and parking are included.","New Year's Eve accommodation should be booked well in advance.","Some properties may require a minimum stay over the holiday."],
      pt:["O grupo também pode alugar uma casa inteira — divida o total por 6 viajantes.","Confirme se café da manhã, taxas, taxa de limpeza e estacionamento estão inclusos.","A hospedagem de Réveillon deve ser reservada com bastante antecedência.","Algumas propriedades podem exigir estadia mínima no feriado."]
    }
  },

  /* ---------- 07 Food ---------- */
  food:{
    kicker:{en:"07 · Eat",pt:"07 · Comer"},
    title:{en:"What to eat & where to go",pt:"O que comer & onde ir"},
    lead:{en:"Cananéia is seafood country. Expect fresh fish, shrimp and Caiçara home cooking. Prices below are estimates per person.",
      pt:"Cananéia é terra de frutos do mar. Espere peixe fresco, camarão e a cozinha caiçara. Os preços abaixo são estimativas por pessoa."},
    dishesTitle:{en:"Typical dishes",pt:"Pratos típicos"},
    dishes:[
      {en:{t:"Fresh fish",s:"Peixe fresco"},pt:{t:"Peixe fresco",s:"Grelhado ou frito"}},
      {en:{t:"Shrimp",s:"Camarão"},pt:{t:"Camarão",s:"Vários preparos"}},
      {en:{t:"Moqueca",s:"Seafood stew"},pt:{t:"Moqueca",s:"Ensopado de frutos do mar"}},
      {en:{t:"Casquinha de siri",s:"Crab shell appetizer"},pt:{t:"Casquinha de siri",s:"Entrada típica"}},
      {en:{t:"Arroz de frutos do mar",s:"Seafood rice"},pt:{t:"Arroz de frutos do mar",s:"Prato caiçara"}},
      {en:{t:"Caiçara cuisine",s:"Local home cooking"},pt:{t:"Cozinha caiçara",s:"Comida da região"}}
    ],
    prices:[
      {en:{t:"Individual main dish"},pt:{t:"Prato individual"},pp:{en:"R$45–80",pt:"R$45–80"},sub:{en:"per person",pt:"por pessoa"}},
      {en:{t:"Fish or shrimp dish"},pt:{t:"Prato de peixe ou camarão"},pp:{en:"R$70–130",pt:"R$70–130"},sub:{en:"per person",pt:"por pessoa"}},
      {en:{t:"Dish for two people"},pt:{t:"Prato para duas pessoas"},pp:{en:"R$75–140",pt:"R$75–140"},sub:{en:"per person · total R$150–280 ÷ 2",pt:"por pessoa · total R$150–280 ÷ 2"}},
      {en:{t:"Full meal with drinks"},pt:{t:"Refeição completa com bebidas"},pp:{en:"R$80–160",pt:"R$80–160"},sub:{en:"per person",pt:"por pessoa"}}
    ],
    notes:{
      en:["Reserve restaurants for December 31 and January 1.","Prioritize traditional restaurants with recent positive reviews.","Confirm whether restaurants offer non-seafood options.","New Year's Eve menus may cost more than regular meals."],
      pt:["Reserve os restaurantes para 31 de dezembro e 1 de janeiro.","Priorize restaurantes tradicionais com boas avaliações recentes.","Confirme se há opções sem frutos do mar.","Os menus de Réveillon podem custar mais que as refeições normais."]
    }
  },

  /* ---------- 08 Budget ---------- */
  budget:{
    kicker:{en:"08 · Money",pt:"08 · Dinheiro"},
    title:{en:"Estimated cost per person",pt:"Custo estimado por pessoa"},
    lead:{en:"For the full trip (Dec 30 → Jan 2). Transport from your home city to Cananéia is not included. Every shared group cost is divided by 6 travelers.",
      pt:"Para a viagem completa (30/12 → 2/1). O transporte da sua cidade até Cananéia não está incluído. Todo custo de grupo é dividido por 6 viajantes."},
    table:{
      head:{en:["Category","Group estimate","Per person"],pt:["Categoria","Estimativa do grupo","Por pessoa"]},
      rows:[
        {c:{en:"Accommodation (3 nights)",pt:"Hospedagem (3 noites)"},g:{en:"R$3,200–9,000",pt:"R$3.200–9.000"},i:{en:"R$533–1,500",pt:"R$533–1.500"}},
        {c:{en:"Food & drinks",pt:"Comida e bebidas"},g:{en:"R$2,500–5,000",pt:"R$2.500–5.000"},i:{en:"R$417–833",pt:"R$417–833"}},
        {c:{en:"Boat tour",pt:"Passeio de barco"},g:{en:"R$700–1,800",pt:"R$700–1.800"},i:{en:"R$117–300",pt:"R$117–300"}},
        {c:{en:"New Year's Eve dinner",pt:"Jantar de Réveillon"},g:{en:"R$1,100–3,000",pt:"R$1.100–3.000"},i:{en:"R$183–500",pt:"R$183–500"}},
        {c:{en:"Ferry, parking & shared extras",pt:"Balsa, estacionamento e extras"},g:{en:"R$400–1,000",pt:"R$400–1.000"},i:{en:"R$67–167",pt:"R$67–167"}}
      ],
      foot:{en:["Estimated total","R$7,900–19,800","R$1,317–3,300"],pt:["Total estimado","R$7.900–19.800","R$1.317–3.300"]}
    },
    scenarios:[
      {cls:"budget",tag:{en:"Budget",pt:"Econômico"},title:{en:"Simple & shared",pt:"Simples e compartilhado"},
        pp:{en:"≈ R$1,317",pt:"≈ R$1.317"},grp:{en:"Group total R$7,900 ÷ 6",pt:"Total do grupo R$7.900 ÷ 6"},
        desc:{en:"Simple accommodation, affordable meals and a shared boat tour.",pt:"Hospedagem simples, refeições acessíveis e passeio de barco compartilhado."}},
      {cls:"balanced",tag:{en:"Recommended · Balanced",pt:"Recomendado · Equilibrado"},title:{en:"Comfortable, not luxurious",pt:"Confortável, sem luxo"},
        pp:{en:"≈ R$1,833–2,500",pt:"≈ R$1.833–2.500"},grp:{en:"Group total ≈ R$11,000–15,000",pt:"Total do grupo ≈ R$11.000–15.000"},
        desc:{en:"Well-rated stay, better restaurants and a good-quality boat tour.",pt:"Hospedagem bem avaliada, restaurantes melhores e passeio de barco de qualidade."}},
      {cls:"comfort",tag:{en:"Comfortable",pt:"Confortável"},title:{en:"Higher comfort",pt:"Mais conforto"},
        pp:{en:"≈ R$3,300",pt:"≈ R$3.300"},grp:{en:"Group total R$19,800 ÷ 6",pt:"Total do grupo R$19.800 ÷ 6"},
        desc:{en:"Higher-end stay, top restaurants and a private boat charter.",pt:"Hospedagem superior, melhores restaurantes e barco privativo."}}
    ],
    note:{en:"All prices are preliminary estimates and may increase during New Year's Eve. Confirm prices and availability before booking.",
      pt:"Todos os preços são estimativas preliminares e podem subir no Réveillon. Confirme preços e disponibilidade antes de reservar."}
  },

  /* ---------- 09 Videos ---------- */
  videos:{
    kicker:{en:"09 · Watch first",pt:"09 · Assista antes"},
    title:{en:"Video previews",pt:"Prévias em vídeo"},
    lead:{en:"Tap a thumbnail to play. Videos open from YouTube — the full title, channel and date load there. Some clips are vertical Shorts.",
      pt:"Toque na miniatura para reproduzir. Os vídeos abrem do YouTube — título, canal e data completos carregam lá. Alguns clipes são Shorts verticais."},
    items:[
      {id:"tSNsqJ6f-8A",short:false,
        topic:{en:"Cananéia · destination video",pt:"Cananéia · vídeo do destino"},
        title:{en:"Cananéia region overview",pt:"Panorama da região de Cananéia"},
        desc:{en:"A look at the town, waterfront and surrounding nature.",pt:"Uma visão da cidade, da orla e da natureza ao redor."}},
      {id:"668yPNbjUH4",short:false,
        topic:{en:"Cananéia · destination video",pt:"Cananéia · vídeo do destino"},
        title:{en:"Cananéia & the estuary",pt:"Cananéia & o estuário"},
        desc:{en:"Scenery from the region — boats, water and landscape.",pt:"Paisagens da região — barcos, água e cenário."}},
      {id:"iAhn7CPDp9g",short:true,
        topic:{en:"Quick clip · Short",pt:"Clipe rápido · Short"},
        title:{en:"Cananéia in a Short",pt:"Cananéia em um Short"},
        desc:{en:"A fast vertical clip of the destination.",pt:"Um clipe vertical rápido do destino."}},
      {id:"jWSqIUKFFS0",short:true,
        topic:{en:"Quick clip · Short",pt:"Clipe rápido · Short"},
        title:{en:"Cananéia in a Short",pt:"Cananéia em um Short"},
        desc:{en:"A fast vertical clip of the destination.",pt:"Um clipe vertical rápido do destino."}},
      {id:"jFOH-hHqe-A",short:false,
        topic:{en:"Cananéia · destination video",pt:"Cananéia · vídeo do destino"},
        title:{en:"More of Cananéia & the region",pt:"Mais de Cananéia e da região"},
        desc:{en:"Another look at the destination — scenery and atmosphere.",pt:"Mais uma visão do destino — paisagem e clima."}},
      {id:"U3YBqyeQxzA",short:true,
        topic:{en:"Quick clip · Short",pt:"Clipe rápido · Short"},
        title:{en:"Cananéia in a Short",pt:"Cananéia em um Short"},
        desc:{en:"A fast vertical clip of the destination.",pt:"Um clipe vertical rápido do destino."}},
      {id:"VZxyYOjwf28",short:false,
        topic:{en:"Cananéia · destination video",pt:"Cananéia · vídeo do destino"},
        title:{en:"Cananéia & Ilha Comprida",pt:"Cananéia e Ilha Comprida"},
        desc:{en:"Views of the coast, islands and waters of the region.",pt:"Imagens do litoral, das ilhas e das águas da região."}},
      {id:"68RdYNaAQvI",short:false,
        topic:{en:"Cananéia · destination video",pt:"Cananéia · vídeo do destino"},
        title:{en:"Exploring the region",pt:"Explorando a região"},
        desc:{en:"More scenery and highlights around Cananéia.",pt:"Mais paisagens e destaques pela região de Cananéia."}}
    ]
  },

  /* ---------- 10 Tips ---------- */
  tips:{
    kicker:{en:"10 · Good to know",pt:"10 · Bom saber"},
    title:{en:"Practical tips",pt:"Dicas práticas"},
    items:[
      {ico:"📅",en:"Book accommodation and tours well in advance.",pt:"Reserve hospedagem e passeios com bastante antecedência."},
      {ico:"🕒",en:"Confirm restaurant and museum hours during the holiday.",pt:"Confirme horários de restaurantes e museus no feriado."},
      {ico:"🧴",en:"Bring sunscreen, insect repellent, a hat and water.",pt:"Leve protetor solar, repelente, chapéu e água."},
      {ico:"👕",en:"Wear light, comfortable clothing.",pt:"Use roupas leves e confortáveis."},
      {ico:"⛴️",en:"Confirm ferry schedules before traveling.",pt:"Confirme os horários da balsa antes de viajar."},
      {ico:"💵",en:"Carry some cash — not everywhere takes cards.",pt:"Leve algum dinheiro — nem tudo aceita cartão."},
      {ico:"📱",en:"Use waterproof protection for phones on boat tours.",pt:"Use proteção à prova d'água para o celular nos passeios de barco."},
      {ico:"🚤",en:"Consider a private boat for greater group comfort.",pt:"Considere um barco privativo para mais conforto do grupo."},
      {ico:"📝",en:"Verify cancellation policies before paying.",pt:"Verifique as políticas de cancelamento antes de pagar."},
      {ico:"🌿",en:"Cananéia is authentic and nature-focused, not luxurious.",pt:"Cananéia é autêntica e voltada à natureza, não luxuosa."},
      {ico:"🌊",en:"Check weather and sea conditions before boat trips.",pt:"Verifique o clima e o mar antes dos passeios de barco."},
      {ico:"⏰",en:"Arrive early for ferry crossings during the holiday.",pt:"Chegue cedo às travessias de balsa no feriado."}
    ]
  },

  /* ---------- 11 Links ---------- */
  links:{
    kicker:{en:"11 · Plan & book",pt:"11 · Planejar & reservar"},
    title:{en:"Essential links & maps",pt:"Links essenciais & mapas"},
    lead:{en:"Open maps and searches to plan, compare and book. Prices and availability change over the holiday — always confirm.",
      pt:"Abra mapas e buscas para planejar, comparar e reservar. Preços e disponibilidade mudam no feriado — sempre confirme."},
    mapTitle:{en:"Map of the region",pt:"Mapa da região"},
    mapNote:{en:"Cananéia and, just across the water, Ilha Comprida and Ilha do Cardoso. Drag and zoom to explore; open in Google Maps for directions.",
      pt:"Cananéia e, logo do outro lado da água, a Ilha Comprida e a Ilha do Cardoso. Arraste e dê zoom para explorar; abra no Google Maps para rotas."},
    items:[
      {cat:{en:"Discover",pt:"Descubra"},title:{en:"Cananéia on Google Maps",pt:"Cananéia no Google Maps"},
        desc:{en:"See the town, Historic Center, waterfront and surroundings.",pt:"Veja a cidade, o Centro Histórico, a orla e os arredores."},
        url:"https://www.google.com/maps/place/Cananéia,+SP",btn:{en:"Open map",pt:"Abrir mapa"}},
      {cat:{en:"Stay",pt:"Hospedagem"},title:{en:"Pousada Retiro das Caravelas",pt:"Pousada Retiro das Caravelas"},
        desc:{en:"Guesthouse option in Cananéia — location on the map.",pt:"Opção de pousada em Cananéia — localização no mapa."},
        url:"https://www.google.com/maps/place/Pousada+Retiro+das+Caravelas+em+Canan%C3%A9ia/@-25.0083682,-47.9417268,15z/data=!4m9!3m8!1s0x94dae57080e1139f:0x3538acad35550963!5m2!4m1!1i2!8m2!3d-25.0017661!4d-47.9316095!16s%2Fg%2F11g_07qkf",btn:{en:"Open map",pt:"Abrir mapa"}},
      {cat:{en:"Stay",pt:"Hospedagem"},title:{en:"Hotel Pousada da Néia",pt:"Hotel Pousada da Néia"},
        desc:{en:"Guesthouse option in Cananéia — location on the map.",pt:"Opção de pousada em Cananéia — localização no mapa."},
        url:"https://www.google.com/maps/place/Hotel+Pousada+da+N%C3%A9ia/@-25.0123141,-47.9291205,17z/data=!3m1!4b1!4m9!3m8!1s0x94dae5679ed6ab6f:0xf177d11fdfd38900!5m2!4m1!1i2!8m2!3d-25.0123141!4d-47.9291205!16s%2Fg%2F11h1qppgs",btn:{en:"Open map",pt:"Abrir mapa"}},
      {cat:{en:"Stay",pt:"Hospedagem"},title:{en:"Compare stays on Booking.com",pt:"Comparar hospedagens no Booking.com"},
        desc:{en:"Search availability and prices for your NYE dates.",pt:"Busque disponibilidade e preços para as datas do Réveillon."},
        url:"https://www.booking.com/searchresults.html?ss=Cananéia",btn:{en:"Search stays",pt:"Buscar"}},
      {cat:{en:"Eat",pt:"Comer"},title:{en:"Restaurants in Cananéia",pt:"Restaurantes em Cananéia"},
        desc:{en:"Find seafood and Caiçara restaurants with recent reviews.",pt:"Encontre restaurantes de frutos do mar e caiçaras com avaliações recentes."},
        url:"https://www.google.com/maps/search/restaurantes+em+Cananéia",btn:{en:"Find food",pt:"Ver mapa"}},
      {cat:{en:"Nature",pt:"Natureza"},title:{en:"Ilha do Cardoso State Park",pt:"Parque Estadual da Ilha do Cardoso"},
        desc:{en:"Protected island park near Cananéia — location & access.",pt:"Ilha-parque protegida perto de Cananéia — localização e acesso."},
        url:"https://www.google.com/maps/search/Parque+Estadual+da+Ilha+do+Cardoso",btn:{en:"Open map",pt:"Abrir mapa"}},
      {cat:{en:"Beach",pt:"Praia"},title:{en:"Ilha Comprida (southern area)",pt:"Ilha Comprida (porção sul)"},
        desc:{en:"The long ocean-beach island reached by ferry from Cananéia.",pt:"A ilha de praia oceânica alcançada pela balsa de Cananéia."},
        url:"https://www.google.com/maps/place/Ilha+Comprida,+SP",btn:{en:"Open map",pt:"Abrir mapa"}},
      {cat:{en:"Get there",pt:"Como chegar"},title:{en:"Ferry / balsa Cananéia ↔ Ilha Comprida",pt:"Balsa Cananéia ↔ Ilha Comprida"},
        desc:{en:"Search the ferry crossing point and current info.",pt:"Busque o ponto da travessia e informações atuais."},
        url:"https://www.google.com/maps/search/balsa+Cananéia+Ilha+Comprida",btn:{en:"Open map",pt:"Abrir mapa"}}
    ]
  },

  closing:{
    text:{en:"Cananéia is ideal for travelers looking for nature, history, the sea, local culture, and an authentic New Year's experience in one of Brazil's most distinctive coastal regions.",
      pt:"Cananéia é ideal para quem busca natureza, história, mar, cultura local e um Réveillon autêntico em uma das regiões costeiras mais singulares do Brasil."}
  },

  foot:{
    line1:{en:"Cananéia & Ilha Comprida · Travel itinerary for 6 · Dec 30, 2026 – Jan 2, 2027",
      pt:"Cananéia & Ilha Comprida · Roteiro para 6 · 30/12/2026 – 2/1/2027"},
    line2:{en:"All prices are estimates in Brazilian reais (R$). Confirm availability and prices before booking. Wildlife sightings are never guaranteed.",
      pt:"Todos os preços são estimativas em reais (R$). Confirme disponibilidade e preços antes de reservar. Avistar animais nunca é garantido."}
  }
};
