/* =====================================================================
   site.js — interações do portal
   Nav mobile, modal de lead, validação e envio do formulário,
   captura de UTM/origem, eventos de analytics e consentimento de cookies.
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.SITE_CONFIG || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- Utilidades WhatsApp ---------------- */
  function waLink(text) {
    var t = encodeURIComponent(text || CFG.waDefaultText || "Olá!");
    return "https://wa.me/" + (CFG.whatsapp || "") + "?text=" + t;
  }
  // aplica número/links de whatsapp e telefone marcados com data-attr
  $$("[data-wa]").forEach(function (el) {
    el.setAttribute("href", waLink(el.getAttribute("data-wa") || ""));
    el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener");
  });
  $$("[data-wa-label]").forEach(function (el) { el.textContent = CFG.whatsappLabel || ""; });
  $$("[data-tel]").forEach(function (el) { el.setAttribute("href", "tel:" + (CFG.phone || "")); });
  $$("[data-email]").forEach(function (el) {
    el.setAttribute("href", "mailto:" + (CFG.email || "")); if (!el.textContent.trim()) el.textContent = CFG.email;
  });

  /* ---------------- Ano do rodapé ---------------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------------- Faixas de investimento (fonte única: config.js) ---------------- */
  $$("select[data-faixas]").forEach(function (sel) {
    (CFG.faixas || []).forEach(function (f) {
      var o = document.createElement("option"); o.value = f; o.textContent = f; sel.appendChild(o);
    });
  });

  /* ---------------- Header: sombra + menu mobile ---------------- */
  var topbar = $(".topbar");
  if (topbar) {
    var onScroll = function () { topbar.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }
  var toggle = $(".nav-toggle"), menu = $(".mobile-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------------- Analytics ---------------- */
  var analyticsLoaded = false;
  function loadAnalytics() {
    if (analyticsLoaded) return; analyticsLoaded = true;
    var a = CFG.analytics || {};
    window.dataLayer = window.dataLayer || [];
    if (a.gtm) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
        j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i; f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", a.gtm);
    }
    if (a.ga4) {
      var g = document.createElement("script"); g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + a.ga4; document.head.appendChild(g);
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", a.ga4);
    }
    if (a.metaPixel) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", a.metaPixel); window.fbq("track", "PageView");
    }
  }
  // Evento unificado de conversão -> dataLayer + gtag + fbq
  window.trackEvent = function (name, params) {
    params = params || {};
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params)); } catch (e) {}
    try { if (window.gtag) window.gtag("event", name, params); } catch (e) {}
    try {
      if (window.fbq) {
        var map = { form_submit: "Lead", open_form: "InitiateCheckout", whatsapp_click: "Contact", view_empreendimento: "ViewContent" };
        window.fbq("trackCustom", name, params);
        if (map[name]) window.fbq("track", map[name], params);
      }
    } catch (e) {}
  };

  // clique em WhatsApp / telefone -> evento
  $$("[data-wa], .wa-float").forEach(function (el) {
    el.addEventListener("click", function () { window.trackEvent("whatsapp_click", { location: el.getAttribute("data-loc") || "página" }); });
  });
  $$("[data-tel]").forEach(function (el) {
    el.addEventListener("click", function () { window.trackEvent("phone_click", {}); });
  });

  /* ---------------- Consentimento de cookies ---------------- */
  var CONSENT_KEY = "tat_cookie_consent";
  function getConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }
  function applyConsent(v) {
    if (v === "accepted") loadAnalytics();
  }
  var bar = $(".cookiebar");
  if (CFG.requireCookieConsent) {
    var c = getConsent();
    if (c) { applyConsent(c); }
    else if (bar) { bar.hidden = false; }
    if (bar) {
      var accept = $("[data-cookie-accept]", bar), reject = $("[data-cookie-reject]", bar);
      if (accept) accept.addEventListener("click", function () { setConsent("accepted"); bar.hidden = true; applyConsent("accepted"); });
      if (reject) reject.addEventListener("click", function () { setConsent("rejected"); bar.hidden = true; });
    }
  } else { loadAnalytics(); }

  /* ---------------- UTM / origem ---------------- */
  function captureUTM() {
    var out = {}; var qs = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
      var v = qs.get(k); if (v) out[k] = v;
    });
    try { // persiste para o lead mesmo após navegação interna
      if (Object.keys(out).length) sessionStorage.setItem("tat_utm", JSON.stringify(out));
      else { var saved = sessionStorage.getItem("tat_utm"); if (saved) out = JSON.parse(saved); }
    } catch (e) {}
    return out;
  }

  /* ---------------- Modal de lead + formulário ---------------- */
  var modal = $("#leadModal");
  var lastFocus = null;
  function openModal(emp) {
    if (!modal) return;
    var f = $("form", modal);
    if (f && emp) { var h = $("[name=empreendimento_interesse]", f); if (h) h.value = emp; }
    var t = $("[data-modal-emp]", modal); if (t) t.textContent = emp ? (" — " + emp) : "";
    modal.hidden = false; document.body.classList.add("menu-open");
    lastFocus = document.activeElement;
    var first = $("input,select,textarea,button", modal); if (first) first.focus();
    window.trackEvent("open_form", { empreendimento: emp || "" });
  }
  function closeModal() {
    if (!modal) return; modal.hidden = true; document.body.classList.remove("menu-open");
    if (lastFocus) lastFocus.focus();
  }
  $$("[data-open-form]").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); openModal(btn.getAttribute("data-emp") || ""); });
  });
  if (modal) {
    $$("[data-close-form]", modal).forEach(function (b) { b.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });
  }

  /* Validação */
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function isPhone(v) { return (v.replace(/\D/g, "").length >= 10); }
  function maskPhone(v) {
    v = v.replace(/\D/g, "").slice(0, 11);
    if (v.length <= 10) return v.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, function (_, a, b, c) {
      return (a ? "(" + a + ")" : "") + (b ? " " + b : "") + (c ? "-" + c : "");
    }).trim();
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  // aplica em todos os formulários com class .lead-form
  $$(".lead-form").forEach(function (form) {
    var tel = $("[name=telefone]", form);
    if (tel) tel.addEventListener("input", function () { tel.value = maskPhone(tel.value); });

    var submitting = false, lastSubmit = 0;
    // preservar dados em sessionStorage
    var STORE = "tat_form_" + (form.getAttribute("data-form-id") || "default");
    try {
      var saved = JSON.parse(sessionStorage.getItem(STORE) || "null");
      if (saved) $$("input,select,textarea", form).forEach(function (el) {
        if (el.type === "checkbox" || el.type === "hidden") return;
        if (saved[el.name] != null && !el.value) el.value = saved[el.name];
      });
    } catch (e) {}
    form.addEventListener("input", function () {
      try {
        var d = {}; $$("input,select,textarea", form).forEach(function (el) {
          if (el.type !== "checkbox" && el.type !== "hidden") d[el.name] = el.value;
        });
        sessionStorage.setItem(STORE, JSON.stringify(d));
      } catch (e) {}
    });
    var started = false;
    form.addEventListener("focusin", function () { if (!started) { started = true; window.trackEvent("form_start", {}); } });
    var faixa = $("[name=faixa_investimento]", form);
    if (faixa) faixa.addEventListener("change", function () { window.trackEvent("select_faixa", { faixa: faixa.value }); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // honeypot
      var hp = $("[name=website]", form); if (hp && hp.value) return;
      // anti-duplo-clique / duplicado em sequência (10s)
      var now = Date.now();
      if (submitting || (now - lastSubmit) < 10000 && form.dataset.sent === "1") return;

      var ok = true;
      $$("[required]", form).forEach(function (el) {
        var wrap = el.closest(".field"); var valid = true;
        if (el.type === "checkbox") valid = el.checked;
        else if (el.name === "email" && el.value) valid = isEmail(el.value);
        else if (el.name === "telefone") valid = isPhone(el.value);
        else valid = !!el.value.trim();
        if (el.name === "email" && el.value && !isEmail(el.value)) valid = false;
        if (wrap) wrap.classList.toggle("field--invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { var bad = $(".field--invalid input,.field--invalid select", form); if (bad) bad.focus(); return; }

      submitting = true; lastSubmit = now;
      var btn = $("[type=submit]", form); var btnTxt = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

      var data = {};
      $$("input,select,textarea", form).forEach(function (el) {
        if (el.type === "checkbox") data[el.name] = el.checked;
        else data[el.name] = el.value;
      });
      Object.assign(data, captureUTM());
      data.pagina_origem = location.pathname + location.search;
      data.url_completa = location.href;
      data.referrer = document.referrer || "";
      data.enviado_em = new Date().toISOString();

      var done = function (success) {
        submitting = false; form.dataset.sent = "1";
        if (btn) { btn.disabled = false; btn.textContent = btnTxt; }
        window.trackEvent("form_submit", { empreendimento: data.empreendimento_interesse || "", success: success });
        try { sessionStorage.removeItem(STORE); } catch (e) {}
        // sucesso na tela
        var okBox = $(".form__ok", form.parentNode) || $(".form__ok", form);
        form.hidden = true;
        if (okBox) {
          okBox.hidden = false;
          var nm = $("[data-lead-name]", okBox); if (nm) nm.textContent = (data.nome || "").split(" ")[0] || "";
          var wa = $("[data-lead-wa]", okBox);
          if (wa) {
            var msg = "Olá! Sou " + (data.nome || "") + ". Vim pelo portal e tenho interesse" +
              (data.empreendimento_interesse ? " no empreendimento " + data.empreendimento_interesse : " em terrenos em Almirante Tamandaré") + ".";
            wa.setAttribute("href", waLink(msg));
          }
        }
      };

      if (CFG.leadEndpoint) {
        fetch(CFG.leadEndpoint, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
        }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
      } else { done(false); }
    });
  });

  // permitir abertura do modal via hash #contato-form
  if (location.hash === "#lead") openModal("");
})();
