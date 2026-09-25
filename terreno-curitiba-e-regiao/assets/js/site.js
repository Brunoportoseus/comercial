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

  /* ---------------- Lightbox / zoom nas fotos da galeria ---------------- */
  (function () {
    var imgs = $$("figure.media img");
    if (!imgs.length) return;
    var ov = document.createElement("div");
    ov.className = "lightbox"; ov.hidden = true;
    ov.innerHTML = '<button class="lightbox__x" type="button" aria-label="Fechar">×</button><img alt="">';
    document.body.appendChild(ov);
    var big = ov.querySelector("img");
    function open(src, alt) { big.src = src; big.alt = alt || ""; ov.hidden = false; document.body.classList.add("menu-open"); }
    function close() { ov.hidden = true; big.removeAttribute("src"); document.body.classList.remove("menu-open"); }
    imgs.forEach(function (im) {
      im.style.cursor = "zoom-in";
      im.addEventListener("click", function () { open(im.currentSrc || im.src, im.alt); });
    });
    ov.addEventListener("click", function (e) { if (e.target !== big) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  })();

  /* ---------------- Analytics ---------------- */
  // Google Consent Mode v2
  var CONSENT_DENIED = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" };
  var CONSENT_GRANTED = { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" };
  var baseLoaded = false, consentedLoaded = false;

  // Carrega a base do gtag (Google Ads / GA4) com consentimento NEGADO por padrão.
  function initGtagBase() {
    if (baseLoaded) return; baseLoaded = true;
    var a = CFG.analytics || {};
    var gid = a.ga4 || a.googleAds;
    if (!gid) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", Object.assign({}, CONSENT_DENIED, { wait_for_update: 500 }));
    window.gtag("set", "url_passthrough", true);
    window.gtag("set", "ads_data_redaction", true);
    var g = document.createElement("script"); g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + gid; document.head.appendChild(g);
    window.gtag("js", new Date());
    if (a.ga4) window.gtag("config", a.ga4);
    if (a.googleAds) window.gtag("config", a.googleAds);
  }

  // Tags que só carregam APÓS aceite (GTM e Meta Pixel — sem consent mode).
  function loadConsentedTags() {
    if (consentedLoaded) return; consentedLoaded = true;
    var a = CFG.analytics || {};
    window.dataLayer = window.dataLayer || [];
    if (a.gtm) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
        j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i; f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", a.gtm);
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

  function grantConsent() { if (window.gtag) window.gtag("consent", "update", CONSENT_GRANTED); loadConsentedTags(); }
  function denyConsent() { if (window.gtag) window.gtag("consent", "update", CONSENT_DENIED); }
  // Evento unificado de conversão -> dataLayer + gtag + fbq
  window.trackEvent = function (name, params) {
    params = params || {};
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params)); } catch (e) {}
    try { if (window.gtag) window.gtag("event", name, params); } catch (e) {}
    // Conversão do Google Ads mapeada para este evento (ex.: whatsapp_click)
    try {
      var conv = (CFG.analytics && CFG.analytics.adsConversions) || {};
      if (window.gtag && conv[name]) window.gtag("event", "conversion", { send_to: conv[name] });
    } catch (e) {}
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
  var bar = $(".cookiebar");
  if (CFG.requireCookieConsent) {
    initGtagBase(); // Consent Mode: tag carrega com consentimento negado por padrão
    var c = getConsent();
    if (c === "accepted") { grantConsent(); }
    else if (c === "rejected") { denyConsent(); }
    else if (bar) { bar.hidden = false; }
    if (bar) {
      var accept = $("[data-cookie-accept]", bar), reject = $("[data-cookie-reject]", bar);
      if (accept) accept.addEventListener("click", function () { setConsent("accepted"); bar.hidden = true; grantConsent(); });
      if (reject) reject.addEventListener("click", function () { setConsent("rejected"); bar.hidden = true; denyConsent(); });
    }
  } else { initGtagBase(); grantConsent(); }

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

  // Google Click ID — necessário para importar conversões offline no Google Ads
  // depois que um lead vira negócio fechado (ver /api/leads-export?format=gads).
  function captureGCLID() {
    var qs = new URLSearchParams(location.search);
    var v = qs.get("gclid");
    try {
      if (v) sessionStorage.setItem("tat_gclid", v);
      else v = sessionStorage.getItem("tat_gclid") || "";
    } catch (e) { v = v || ""; }
    return v;
  }

  /* ---------------- Gate de identificação ----------------
     Um único cadastro (nome + WhatsApp) libera, na mesma visita, todos os
     blocos marcados com [data-gated] da página (simulação financeira,
     potencial construtivo e condições comerciais completas). */
  var IDENT_KEY = "tat_identified";
  function isIdentified() {
    try { return sessionStorage.getItem(IDENT_KEY) === "1"; } catch (e) { return false; }
  }
  function revealGated() {
    $$("[data-gated]").forEach(function (el) { el.hidden = false; });
    $$("[data-gate-teaser]").forEach(function (el) { el.hidden = true; });
    document.body.classList.add("is-identified");
  }
  function setIdentified() {
    try { sessionStorage.setItem(IDENT_KEY, "1"); } catch (e) {}
    revealGated();
  }
  if (isIdentified()) revealGated();

  // rastreia quando cada bloco liberado é efetivamente visto (funil por bloco)
  (function () {
    var targets = $$("[data-gated][data-gate-track]");
    if (!targets.length || !window.IntersectionObserver) return;
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var key = en.target.getAttribute("data-gate-track");
        if (key && !seen[key]) { seen[key] = true; window.trackEvent("view_" + key, {}); }
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    targets.forEach(function (t) { io.observe(t); });
  })();

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

  /* ---------------- Modal do gate de identificação ----------------
     Separado do .lead-form: em vez de esconder o formulário e mostrar uma
     caixa de "obrigado" com WhatsApp, o sucesso aqui fecha o modal e revela
     o conteúdo bloqueado na própria página (ver revealGated acima). */
  var gateModal = $("#gateModal");
  var gateLastFocus = null, gateContext = "";
  // registra por quais ferramentas (contextos do gate) a pessoa demonstrou
  // interesse nesta sessão, para saber depois se o lead veio do simulador
  // financeiro, do potencial construtivo, ou de ambos
  var gateContextsUsed = {};
  function openGateModal(context) {
    if (!gateModal) return;
    if (isIdentified()) { revealGated(); return; }
    gateContext = context || "";
    if (gateContext) gateContextsUsed[gateContext] = true;
    // em páginas com mais de um empreendimento (ex.: /financiamento/), sincroniza
    // qual está selecionado no momento para o campo oculto do formulário do gate
    var empSrc = $("[data-gate-emp-label]");
    var empField = $("[name=empreendimento_interesse]", gateModal);
    if (empSrc && empField) {
      var opt = empSrc.options && empSrc.options[empSrc.selectedIndex];
      empField.value = opt ? opt.textContent.trim() : "";
    }
    gateModal.hidden = false; document.body.classList.add("menu-open");
    gateLastFocus = document.activeElement;
    var first = $("input,select,textarea,button", gateModal); if (first) first.focus();
    window.trackEvent("view_gate", { contexto: gateContext });
  }
  function closeGateModal() {
    if (!gateModal) return; gateModal.hidden = true; document.body.classList.remove("menu-open");
    if (gateLastFocus) gateLastFocus.focus();
  }
  $$("[data-open-gate]").forEach(function (btn) {
    btn.addEventListener("click", function (e) { e.preventDefault(); openGateModal(btn.getAttribute("data-gate-context") || ""); });
  });
  if (gateModal) {
    $$("[data-close-form]", gateModal).forEach(function (b) { b.addEventListener("click", closeGateModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !gateModal.hidden) closeGateModal(); });

    var gateForm = $("form", gateModal);
    if (gateForm) {
      var gtel = $("[name=telefone]", gateForm);
      if (gtel) gtel.addEventListener("input", function () { gtel.value = maskPhone(gtel.value); });

      var gateSubmitting = false;
      gateForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var hp = $("[name=website]", gateForm); if (hp && hp.value) return;
        if (gateSubmitting) return;

        var ok = true;
        $$("[required]", gateForm).forEach(function (el) {
          var wrap = el.closest(".field"); var valid = true;
          if (el.type === "checkbox") valid = el.checked;
          else if (el.name === "email" && el.value) valid = isEmail(el.value);
          else if (el.name === "telefone") valid = isPhone(el.value);
          else valid = !!el.value.trim();
          if (wrap) wrap.classList.toggle("field--invalid", !valid);
          if (!valid) ok = false;
        });
        if (!ok) { var bad = $(".field--invalid input,.field--invalid select", gateForm); if (bad) bad.focus(); return; }

        gateSubmitting = true;
        var btn = $("[type=submit]", gateForm); var btnTxt = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

        var data = {};
        $$("input,select,textarea", gateForm).forEach(function (el) {
          if (el.type === "checkbox") data[el.name] = el.checked;
          else data[el.name] = el.value;
        });
        Object.assign(data, captureUTM());
        data.gclid = captureGCLID();
        data.pagina_origem = location.pathname + location.search;
        data.url_completa = location.href;
        data.referrer = document.referrer || "";
        data.enviado_em = new Date().toISOString();
        var usedFin = !!gateContextsUsed.simulador_financeiro;
        var usedConstr = !!gateContextsUsed.potencial_construtivo;
        var leadSourceTool = usedFin && usedConstr ? "ambos" : usedConstr ? "potencial_construtivo" : usedFin ? "simulador_financiamento" : "";
        data.simulacao_financeira = usedFin;
        data.potencial_construtivo = usedConstr;
        data.lead_source_tool = leadSourceTool;
        var consentSpan = $(".consent span", gateForm);
        data.consentimento_texto = consentSpan ? consentSpan.textContent.trim() : "";
        // aproveita o que a pessoa já ajustou nos simuladores da página, se houver
        var simEntrada = $("[data-gate-entrada]"); if (simEntrada && simEntrada.value) data.entrada_informada = Math.round(+simEntrada.value) || null;
        var simParc = $("[data-gate-parcela]"); if (simParc && simParc.textContent && simParc.textContent !== "—") data.faixa_parcela = simParc.textContent.trim();

        var finish = function (success) {
          gateSubmitting = false;
          if (btn) { btn.disabled = false; btn.textContent = btnTxt; }
          window.trackEvent("gate_submit", { success: success, contexto: gateContext });
          if (success) {
            window.trackEvent("identification_success", { contexto: gateContext });
            window.trackEvent("lead_simulador", { lead_source_tool: leadSourceTool });
            closeGateModal();
            setIdentified();
          } else {
            window.trackEvent("gate_error", { contexto: gateContext });
            var note = $(".form__note", gateForm);
            if (note) note.textContent = "Não conseguimos enviar agora. Tente novamente em instantes ou chame no WhatsApp.";
          }
        };

        if (CFG.leadEndpoint) {
          fetch(CFG.leadEndpoint, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
          }).then(function (r) { finish(r.ok); }).catch(function () { finish(false); });
        } else { finish(false); }
      });
    }
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
      data.gclid = captureGCLID();
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
