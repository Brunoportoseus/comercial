export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redireciona www -> domínio raiz (apex), mantendo caminho e query.
    // O apex (auditoriatrafegopago.com.br) é o canônico para SEO.
    if (url.hostname === "www.auditoriatrafegopago.com.br") {
      url.hostname = "auditoriatrafegopago.com.br";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
