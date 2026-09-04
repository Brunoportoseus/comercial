/* =====================================================================
   CONFIGURAÇÃO DO PORTAL — edite este arquivo para ajustar contatos,
   faixas de investimento, IDs de analytics e o destino dos leads.
   Nenhuma credencial secreta deve ser colocada aqui (arquivo público).
   ===================================================================== */
window.SITE_CONFIG = {
  /* ---- Contato ---- */
  brand: "Terreno Almirante Tamandaré",
  whatsapp: "5541998448989",           // número no formato internacional (só dígitos)
  whatsappLabel: "(41) 99844-8989",
  phone: "+5541998448989",
  email: "contato@terrenoalmirantetamandare.com.br", // [CONFIRMAR e-mail oficial]
  waDefaultText: "Olá! Vim pelo portal terrenoalmirantetamandare.com.br e quero informações sobre terrenos em Almirante Tamandaré.",

  /* ---- Faixas de investimento (edite livremente) ---- */
  faixas: [
    "Até R$ 80 mil",
    "De R$ 80 mil a R$ 120 mil",
    "De R$ 120 mil a R$ 180 mil",
    "Acima de R$ 180 mil"
  ],

  /* ---- Endpoint que recebe o lead (Cloudflare Function) ---- */
  leadEndpoint: "/api/lead",

  /* ---- Analytics (deixe vazio para desativar) ---- */
  analytics: {
    ga4: "",        // ex.: "G-XXXXXXXXXX"
    gtm: "",        // ex.: "GTM-XXXXXXX"
    metaPixel: ""   // ex.: "123456789012345"
  },

  /* Exige consentimento de cookies antes de carregar analytics */
  requireCookieConsent: true
};
