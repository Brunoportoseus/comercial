export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Domínio canônico (SEO): www.diagnosticotrafegopago.com.br
    const CANON = "www.diagnosticotrafegopago.com.br";

    // Hosts que devem redirecionar 301 para o canônico:
    // - apex do domínio novo (sem www)
    // - domínio antigo (auditoria*) — apex e www — preservando a autoridade
    const REDIRECT = new Set([
      "diagnosticotrafegopago.com.br",
      "auditoriatrafegopago.com.br",
      "www.auditoriatrafegopago.com.br",
    ]);

    if (REDIRECT.has(url.hostname)) {
      url.hostname = CANON;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
