/*
 * Conecta Consórcios — Configuração central
 * -------------------------------------------------------------
 * Ponto ÚNICO de edição para dados de contato, integração e analytics.
 * Nenhum token/senha deve ser colocado aqui (arquivo público do site).
 * As chaves secretas ficam no Worker (variáveis de ambiente / secrets).
 */
window.CONECTA_CONFIG = {
  /* ---- WhatsApp ---------------------------------------------------------
   * Número no formato internacional, só dígitos: 55 (Brasil) + DDD + número.
   * Fonte: apresentação comercial — CONFIRMAR antes de publicar. */
  whatsapp: {
    number: "5541988520906", // (41) 98852-0906
    message:
      "Olá! Visitei o site da Conecta Consórcios e gostaria de entender as opções de consórcio para imóveis.",
  },

  /* ---- Endpoint do formulário de captação -------------------------------
   * O envio é feito para o Worker (mesma origem) em /api/lead.
   * O Worker encaminha para o destino real (webhook/CRM/e-mail/DB),
   * configurado por variáveis de ambiente. Ver _worker.js. */
  leadEndpoint: "/api/lead",

  /* ---- Analytics (GA4 / Google Tag Manager) -----------------------------
   * Deixe vazio até ter os IDs oficiais. Enquanto vazio, nada é carregado
   * e nenhum cookie de terceiros é criado (compatível com LGPD).
   * Preencha com o ID do GTM (ex.: "GTM-XXXXXXX") OU o do GA4 ("G-XXXXXXX").
   * Se ambos existirem, prefira o GTM. */
  analytics: {
    gtmId: "", // ex.: "GTM-XXXXXXX"
    ga4Id: "", // ex.: "G-XXXXXXXXXX"
  },

  /* ---- Metadados de contato exibidos no site ----------------------------
   * CONFIRMAR todos antes de publicar. */
  contato: {
    email: "conectaconsorciosbrasil@gmail.com",
    site: "https://www.conectaconsorciosbrasil.com.br",
    instagram: "conectaconsorcioservopa",
    instagramUrl: "https://www.instagram.com/conectaconsorcioservopa",
    telefoneExibicao: "(41) 98852-0906",
  },
};
