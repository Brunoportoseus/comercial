export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redireciona www -> domínio raiz (apex), mantendo caminho e query.
    if (url.hostname === "www.soubrunoporto.com.br") {
      url.hostname = "soubrunoporto.com.br";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
