/**
 * Consentimento de cookies (LGPD) — Bruno Porto Seus
 * Banner consistente em todas as páginas. Guarda a escolha em localStorage.
 * Só habilita analytics se o usuário aceitar (chama window.bpEnableAnalytics()).
 */
(function () {
  var KEY = "bp-cookie-consent"; // "accepted" | "rejected"
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  // Já decidiu antes: aplica e não mostra o banner
  if (choice === "accepted") { enableAnalytics(); return; }
  if (choice === "rejected") { return; }

  function enableAnalytics() {
    if (typeof window.bpEnableAnalytics === "function") {
      try { window.bpEnableAnalytics(); } catch (e) {}
    }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === "accepted") enableAnalytics();
    var bar = document.getElementById("bp-cookie-bar");
    if (bar) {
      bar.style.opacity = "0";
      bar.style.transform = "translateY(16px)";
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 280);
    }
  }

  function inject() {
    if (document.getElementById("bp-cookie-bar")) return;

    var css =
      "#bp-cookie-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;" +
      "max-width:760px;margin:0 auto;background:#141822;color:rgba(245,247,251,.82);" +
      "border:1px solid rgba(255,255,255,.10);border-radius:16px;padding:18px 20px;" +
      "box-shadow:0 18px 50px rgba(0,0,0,.55);font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;" +
      "font-size:14px;line-height:1.55;display:flex;flex-wrap:wrap;align-items:center;gap:14px;" +
      "transition:opacity .28s ease,transform .28s ease}" +
      "#bp-cookie-bar .bp-cc-txt{flex:1 1 320px;min-width:240px}" +
      "#bp-cookie-bar a{color:#7c5cff;text-decoration:underline;text-underline-offset:2px}" +
      "#bp-cookie-bar .bp-cc-actions{display:flex;gap:10px;flex-wrap:wrap}" +
      "#bp-cookie-bar button{font:inherit;font-weight:600;cursor:pointer;border-radius:10px;padding:9px 18px;border:1px solid transparent;transition:background .2s,border-color .2s,color .2s,transform .2s}" +
      "#bp-cc-accept{background:linear-gradient(135deg,#3da5ff 0%,#7c5cff 60%,#a06bff 100%);color:#fff}" +
      "#bp-cc-accept:hover{transform:translateY(-1px)}" +
      "#bp-cc-reject{background:transparent;color:rgba(245,247,251,.75);border-color:rgba(255,255,255,.20)}" +
      "#bp-cc-reject:hover{color:#fff;border-color:rgba(255,255,255,.5)}" +
      "@media(max-width:560px){#bp-cookie-bar{padding:16px;left:12px;right:12px;bottom:12px}#bp-cookie-bar .bp-cc-actions{width:100%}#bp-cookie-bar button{flex:1}}";

    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "bp-cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Aviso de cookies");
    bar.innerHTML =
      '<div class="bp-cc-txt">Usamos cookies para melhorar sua experiência e entender como o site é navegado. ' +
      'Você pode aceitar ou recusar. Saiba mais na nossa <a href="/privacidade/">Política de Privacidade</a>.</div>' +
      '<div class="bp-cc-actions">' +
      '<button id="bp-cc-reject" type="button">Recusar</button>' +
      '<button id="bp-cc-accept" type="button">Aceitar</button>' +
      "</div>";
    document.body.appendChild(bar);

    document.getElementById("bp-cc-accept").addEventListener("click", function () { save("accepted"); });
    document.getElementById("bp-cc-reject").addEventListener("click", function () { save("rejected"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
