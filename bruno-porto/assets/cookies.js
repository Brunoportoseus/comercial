/**
 * Consentimento de cookies (LGPD) — Bruno Porto
 * Banner consistente em todas as páginas. Guarda a escolha em localStorage.
 * Só habilita analytics se o usuário aceitar (chama window.bpEnableAnalytics()).
 *
 * O visitante pode REVER ou ALTERAR a escolha a qualquer momento — direito de
 * revogar o consentimento previsto na LGPD — clicando em qualquer elemento com
 * o atributo [data-bp-cookie-settings] (ex.: link "Gerenciar cookies" no rodapé)
 * ou chamando window.bpOpenCookieSettings().
 */
(function () {
  var KEY = "bp-cookie-consent"; // "accepted" | "rejected"

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function enableAnalytics() {
    if (typeof window.bpEnableAnalytics === "function") {
      try { window.bpEnableAnalytics(); } catch (e) {}
    }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === "accepted") enableAnalytics();
    close();
  }

  function close() {
    var bar = document.getElementById("bp-cookie-bar");
    if (bar) {
      bar.style.opacity = "0";
      bar.style.transform = "translateY(16px)";
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 280);
    }
  }

  function ensureStyle() {
    if (document.getElementById("bp-cookie-style")) return;
    var css =
      "#bp-cookie-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;" +
      "max-width:760px;margin:0 auto;background:#141822;color:rgba(245,247,251,.82);" +
      "border:1px solid rgba(255,255,255,.10);border-radius:16px;padding:18px 20px;" +
      "box-shadow:0 18px 50px rgba(0,0,0,.55);font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;" +
      "font-size:14px;line-height:1.55;display:flex;flex-wrap:wrap;align-items:center;gap:14px;" +
      "transition:opacity .28s ease,transform .28s ease}" +
      "#bp-cookie-bar .bp-cc-txt{flex:1 1 320px;min-width:240px}" +
      "#bp-cookie-bar .bp-cc-status{display:block;margin-top:6px;font-size:12px;color:rgba(245,247,251,.55)}" +
      "#bp-cookie-bar a{color:#7c5cff;text-decoration:underline;text-underline-offset:2px}" +
      "#bp-cookie-bar .bp-cc-actions{display:flex;gap:10px;flex-wrap:wrap}" +
      "#bp-cookie-bar button{font:inherit;font-weight:600;cursor:pointer;border-radius:10px;padding:9px 18px;border:1px solid transparent;transition:background .2s,border-color .2s,color .2s,transform .2s}" +
      "#bp-cc-accept{background:linear-gradient(135deg,#3da5ff 0%,#7c5cff 60%,#a06bff 100%);color:#fff}" +
      "#bp-cc-accept:hover{transform:translateY(-1px)}" +
      "#bp-cc-reject{background:transparent;color:rgba(245,247,251,.75);border-color:rgba(255,255,255,.20)}" +
      "#bp-cc-reject:hover{color:#fff;border-color:rgba(255,255,255,.5)}" +
      "@media(max-width:560px){#bp-cookie-bar{padding:16px;left:12px;right:12px;bottom:12px}#bp-cookie-bar .bp-cc-actions{width:100%}#bp-cookie-bar button{flex:1}}";

    var style = document.createElement("style");
    style.id = "bp-cookie-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function inject() {
    if (document.getElementById("bp-cookie-bar")) return;
    ensureStyle();

    var current = getChoice();
    var status =
      current === "accepted"
        ? '<span class="bp-cc-status">Sua escolha atual: cookies analíticos <strong>aceitos</strong>.</span>'
        : current === "rejected"
        ? '<span class="bp-cc-status">Sua escolha atual: cookies analíticos <strong>recusados</strong>.</span>'
        : "";

    var bar = document.createElement("div");
    bar.id = "bp-cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Aviso de cookies");
    bar.innerHTML =
      '<div class="bp-cc-txt">Usamos cookies para melhorar sua experiência e entender como o site é navegado. ' +
      "Os cookies essenciais são sempre ativos; os analíticos você pode aceitar ou recusar, sem prejuízo ao uso do site. " +
      'Saiba mais na nossa <a href="/privacidade/">Política de Privacidade</a>.' +
      status +
      "</div>" +
      '<div class="bp-cc-actions">' +
      '<button id="bp-cc-reject" type="button">Recusar</button>' +
      '<button id="bp-cc-accept" type="button">Aceitar</button>' +
      "</div>";
    document.body.appendChild(bar);

    document.getElementById("bp-cc-accept").addEventListener("click", function () { save("accepted"); });
    document.getElementById("bp-cc-reject").addEventListener("click", function () { save("rejected"); });
  }

  // Reabre o banner sob demanda (link "Gerenciar cookies"), mesmo já tendo escolhido.
  window.bpOpenCookieSettings = function () {
    inject();
    var bar = document.getElementById("bp-cookie-bar");
    if (bar) { bar.style.opacity = "1"; bar.style.transform = "none"; }
  };

  // Clique em qualquer elemento com [data-bp-cookie-settings] reabre o banner.
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-bp-cookie-settings]") : null;
    if (el) { e.preventDefault(); window.bpOpenCookieSettings(); }
  });

  // Aplica a escolha anterior sem reexibir o banner automaticamente.
  var choice = getChoice();
  if (choice === "accepted") { enableAnalytics(); return; }
  if (choice === "rejected") { return; }

  // Primeira visita (sem escolha): mostra o banner automaticamente.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
