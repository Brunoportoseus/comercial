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

  /* ---------------- Compartilhar empreendimento (<ShareProperty />) ----------------
     Componente reutilizável: as páginas de empreendimento são HTML estático, então o
     bloco é montado aqui, automaticamente, em toda página que tenha o selo
     "Empreendimento · Cidade" (eyebrow) e o formulário #interesse — empreendimentos
     atuais e futuros ganham o recurso sem editar HTML.
     Dados lidos da própria página: nome (breadcrumb), cidade/bairro (ficha "Resumo") e URL.
     Opcional — controle manual em um template:
       <div data-share-property data-share-name="…" data-share-loc="…"></div>  (monta ali)
       <body data-share="off">                                                (desliga)
     Não usa data-wa nem "whatsapp_click": compartilhar NÃO conta como conversão. */
  (function shareProperty() {
    if (document.body.getAttribute("data-share") === "off") return;
    var isEmp = $$(".eyebrow").some(function (e) { return /^Empreendimento\b/.test(e.textContent.trim()); });
    var manual = $("[data-share-property]");
    var interesse = $("#interesse");
    if (!manual && !(isEmp && interesse)) return;

    var clean = function (t) { return (t || "").replace(/\s+/g, " ").trim(); };
    var crumb = $(".crumbs [aria-current=\"page\"]");
    var h1 = $("h1");
    var name = clean(manual && manual.getAttribute("data-share-name")) ||
      clean(crumb && crumb.textContent) ||
      clean(h1 && h1.textContent).split(" — ")[0] || clean(document.title);
    var loc = clean(manual && manual.getAttribute("data-share-loc"));
    if (!loc) {
      $$(".specs li").some(function (li) {
        var k = $(".k", li), v = $(".v", li);
        if (k && v && /^Cidade/i.test(clean(k.textContent))) { loc = clean(v.textContent); return true; }
        return false;
      });
    }
    if (!loc) { var eb = $(".eyebrow--gold"); loc = clean(eb && eb.textContent.split("·")[1]); }
    loc = loc.replace(/\s+[—–-]\s+/g, ", ") || "Curitiba e região";
    // URL sem query/hash: quem recebe não herda UTM/fbclid de quem enviou
    var pageUrl = location.origin + location.pathname;
    var text = "Olha este terreno que encontrei em " + loc + ":\n" + name;
    var msg = text + "\n" + pageUrl + "\nAchei interessante e resolvi te enviar.";
    var waHref = "https://wa.me/?text=" + encodeURIComponent(msg); // sem telefone: a pessoa escolhe o contato

    var ICON_COPY = '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.7-1.7"/></svg>';
    var ICON_SHARE = '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
    var waIcon = $(".ico-wa"); // reaproveita o ícone do WhatsApp já presente na página
    var canNative = !!navigator.share && !!window.matchMedia && matchMedia("(pointer: coarse)").matches;

    function track(method, position) {
      var p = { share_method: method, empreendimento: name, page_url: window.location.href, share_position: position };
      if (typeof window.trackEvent === "function") window.trackEvent("share_empreendimento", p);
      else (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: "share_empreendimento" }, p));
    }

    function legacyCopy(t) {
      return new Promise(function (ok, fail) {
        var ta = document.createElement("textarea"), done = false;
        ta.value = t; ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0";
        document.body.appendChild(ta); ta.select();
        try { ta.setSelectionRange(0, t.length); done = document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        if (done) ok(); else fail();
      });
    }
    function copyText(t) {
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        return navigator.clipboard.writeText(t).catch(function () { return legacyCopy(t); });
      }
      return legacyCopy(t);
    }

    var seq = 0;
    function build(position) {
      var compact = position === "compacto";
      var id = "share-" + (++seq);
      var box = document.createElement("div");
      var native = canNative && !compact; // compartilhamento nativo só no bloco principal
      box.className = "share" + (compact ? " share--compact" : "") + (native ? " share--native" : "");
      box.setAttribute("role", "group");
      box.setAttribute("aria-labelledby", id);
      box.innerHTML =
        '<div class="share__text"><p class="share__title" id="' + id + '">' +
        (compact ? "Compartilhe este empreendimento" : "Gostou deste empreendimento?") + "</p>" +
        (compact ? "" : '<p class="share__lead">Compartilhe com alguém que também pode se interessar.</p>') + "</div>" +
        '<div class="share__actions">' +
        '<a class="btn btn--wa share__btn" target="_blank" rel="noopener"><span class="share__ico" data-slot="wa"></span><span>WhatsApp</span></a>' +
        '<button type="button" class="btn btn--outline share__btn share__copy">' + ICON_COPY + '<span class="share__label">Copiar link</span></button>' +
        "</div>" +
        (native ? '<button type="button" class="share__more" aria-label="Compartilhar em outros aplicativos" title="Outros aplicativos">' + ICON_SHARE + "</button>" : "") +
        '<span class="share__sr" role="status" aria-live="polite"></span>';

      var wa = $(".share__btn.btn--wa", box);
      wa.setAttribute("href", waHref);
      wa.setAttribute("aria-label", "Compartilhar " + name + " no WhatsApp");
      var slot = $("[data-slot=wa]", box);
      if (waIcon) slot.parentNode.replaceChild(waIcon.cloneNode(true), slot); else slot.parentNode.removeChild(slot);
      wa.addEventListener("click", function () { track("whatsapp", position); });

      var copyBtn = $(".share__copy", box), label = $(".share__label", copyBtn), sr = $(".share__sr", box), timer;
      copyBtn.addEventListener("click", function () {
        copyText(pageUrl).then(function () {
          track("copy_link", position);
          label.textContent = "✓ Link copiado!"; sr.textContent = "Link copiado";
          copyBtn.classList.add("is-copied");
          clearTimeout(timer);
          timer = setTimeout(function () {
            label.textContent = "Copiar link"; sr.textContent = ""; copyBtn.classList.remove("is-copied");
          }, 2000);
        }).catch(function () { window.prompt("Copie o link:", pageUrl); });
      });

      var more = $(".share__more", box);
      if (more) more.addEventListener("click", function () {
        navigator.share({ title: name, text: text + "\nAchei interessante e resolvi te enviar.", url: pageUrl })
          .then(function () { track("native_share", position); })
          .catch(function () { /* cancelado pelo usuário */ });
      });
      return box;
    }

    function prevSection(el) {
      var n = el.previousElementSibling;
      while (n && /^(SCRIPT|STYLE)$/.test(n.tagName)) n = n.previousElementSibling;
      return n;
    }

    if (manual) { manual.appendChild(build("bloco")); return; }

    // 1) bloco completo: depois das informações principais e do CTA/simulador (#empsim);
    //    sem simulador, logo depois da seção com a ficha "Resumo".
    var specs = $(".specs");
    var anchor = $("#empsim") || (specs && specs.closest("section"));
    if (!anchor) return;
    var section = document.createElement("section");
    section.className = "section section--tight share-section";
    var wrap = document.createElement("div"); wrap.className = "wrap";
    wrap.appendChild(build("bloco")); section.appendChild(wrap);
    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    // 2) segunda aparição, discreta, antes do formulário — só se não ficar colada na primeira
    if (prevSection(interesse) !== section) {
      var slot = document.createElement("div"); slot.className = "wrap share-slot";
      slot.appendChild(build("compacto"));
      interesse.parentNode.insertBefore(slot, interesse);
    }
  })();
})();
