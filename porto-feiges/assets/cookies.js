/**
 * Consentimento de cookies (LGPD) — Porto & Feiges
 * Banner consistente em todas as páginas. Guarda a escolha em localStorage.
 * Só habilita analytics se o usuário aceitar (chama window.pfEnableAnalytics()).
 */
(function () {
  var KEY = "pf-cookie-consent"; // "accepted" | "rejected"
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  // Já decidiu antes: aplica e não mostra o banner
  if (choice === "accepted") { enableAnalytics(); return; }
  if (choice === "rejected") { return; }

  function enableAnalytics() {
    if (typeof window.pfEnableAnalytics === "function") {
      try { window.pfEnableAnalytics(); } catch (e) {}
    }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === "accepted") enableAnalytics();
    var bar = document.getElementById("pf-cookie-bar");
    if (bar) {
      bar.style.opacity = "0";
      bar.style.transform = "translateY(16px)";
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 280);
    }
  }

  function inject() {
    if (document.getElementById("pf-cookie-bar")) return;

    var css =
      "#pf-cookie-bar{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;" +
      "max-width:760px;margin:0 auto;background:#0B1829;color:rgba(255,255,255,.82);" +
      "border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:18px 20px;" +
      "box-shadow:0 12px 40px rgba(0,0,0,.45);font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;" +
      "font-size:14px;line-height:1.55;display:flex;flex-wrap:wrap;align-items:center;gap:14px;" +
      "transition:opacity .28s ease,transform .28s ease}" +
      "#pf-cookie-bar .pf-cc-txt{flex:1 1 320px;min-width:260px}" +
      "#pf-cookie-bar a{color:#13BDA8;text-decoration:underline;text-underline-offset:2px}" +
      "#pf-cookie-bar .pf-cc-actions{display:flex;gap:10px;flex-wrap:wrap}" +
      "#pf-cookie-bar button{font:inherit;font-weight:600;cursor:pointer;border-radius:7px;padding:9px 18px;border:1px solid transparent;transition:background .2s,border-color .2s,color .2s}" +
      "#pf-cc-accept{background:#0A9B87;color:#fff}#pf-cc-accept:hover{background:#13BDA8}" +
      "#pf-cc-reject{background:transparent;color:rgba(255,255,255,.75);border-color:rgba(255,255,255,.22)}" +
      "#pf-cc-reject:hover{color:#fff;border-color:rgba(255,255,255,.5)}" +
      "@media(max-width:560px){#pf-cookie-bar{padding:16px}#pf-cookie-bar .pf-cc-actions{width:100%}#pf-cookie-bar button{flex:1}}";

    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement("div");
    bar.id = "pf-cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Aviso de cookies");
    bar.innerHTML =
      '<div class="pf-cc-txt">Usamos cookies para melhorar sua experiência e entender como o site é navegado. ' +
      'Você pode aceitar ou recusar. Saiba mais na nossa <a href="/privacidade/">Política de Privacidade</a>.</div>' +
      '<div class="pf-cc-actions">' +
      '<button id="pf-cc-reject" type="button">Recusar</button>' +
      '<button id="pf-cc-accept" type="button">Aceitar</button>' +
      "</div>";
    document.body.appendChild(bar);

    document.getElementById("pf-cc-accept").addEventListener("click", function () { save("accepted"); });
    document.getElementById("pf-cc-reject").addEventListener("click", function () { save("rejected"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
