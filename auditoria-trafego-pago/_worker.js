export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redireciona o apex -> www, mantendo caminho e query.
    // O www (www.auditoriatrafegopago.com.br) é o canônico para SEO.
    if (url.hostname === "auditoriatrafegopago.com.br") {
      url.hostname = "www.auditoriatrafegopago.com.br";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
