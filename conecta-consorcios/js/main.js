/*
 * Conecta Consórcios — Interações da landing page
 * - Menu mobile acessível
 * - Link de WhatsApp construído a partir de config.js
 * - Máscara e validação de telefone BR
 * - Envio do formulário (fetch para o Worker) com estados de loading/sucesso/erro
 * - FAQ acessível (accordion)
 * - Banner de cookies (LGPD) + carregamento condicional de analytics
 * - Eventos de analytics via dataLayer (GTM/GA4)
 * - Reveal on scroll respeitando prefers-reduced-motion
 */
(function () {
  "use strict";

  var CFG = window.CONECTA_CONFIG || {};
  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------------- *
   * Analytics — dataLayer (compatível com GTM/GA4).
   * Não injeta scripts de terceiros até haver consentimento + ID.
   * ---------------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function track(eventName, params) {
    try {
      window.dataLayer.push(
        Object.assign({ event: eventName }, params || {})
      );
    } catch (e) {
      /* silencioso */
    }
  }

  var CONSENT_KEY = "conecta_cookie_consent";
  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }
  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* ignore */
    }
  }

  function loadAnalytics() {
    var a = CFG.analytics || {};
    // GTM tem prioridade sobre GA4 direto.
    if (a.gtmId) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l !== "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", a.gtmId);
    } else if (a.ga4Id) {
      var g = document.createElement("script");
      g.async = true;
      g.src = "https://www.googletagmanager.com/gtag/js?id=" + a.ga4Id;
      document.head.appendChild(g);
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", a.ga4Id, { anonymize_ip: true });
    }
  }

  /* ---------------------------------------------------------------- *
   * WhatsApp — monta o link oficial com mensagem codificada.
   * ---------------------------------------------------------------- */
  function buildWhatsAppUrl(customMessage) {
    var wa = CFG.whatsapp || {};
    var msg = customMessage || wa.message || "";
    return (
      "https://wa.me/" +
      (wa.number || "") +
      (msg ? "?text=" + encodeURIComponent(msg) : "")
    );
  }

  function initWhatsApp() {
    var links = document.querySelectorAll("[data-whatsapp]");
    links.forEach(function (el) {
      el.setAttribute("href", buildWhatsAppUrl());
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      el.addEventListener("click", function () {
        track("whatsapp_click", { location: el.getAttribute("data-location") || "" });
      });
    });
  }

  /* ---------------------------------------------------------------- *
   * Menu mobile
   * ---------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("mobile-nav");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("open");
      });
    });
  }

  /* ---------------------------------------------------------------- *
   * Telefone BR — máscara + validação
   * ---------------------------------------------------------------- */
  function maskPhone(value) {
    var d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
    if (d.length <= 6) return d.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
    if (d.length <= 10)
      return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
  function phoneDigits(value) {
    return (value || "").replace(/\D/g, "");
  }
  function isValidBrPhone(value) {
    var d = phoneDigits(value);
    // 10 (fixo com DDD) ou 11 (celular com 9) dígitos
    if (d.length !== 10 && d.length !== 11) return false;
    var ddd = parseInt(d.slice(0, 2), 10);
    if (ddd < 11 || ddd > 99) return false;
    if (d.length === 11 && d.charAt(2) !== "9") return false;
    return true;
  }

  /* ---------------------------------------------------------------- *
   * Formulário de captação
   * ---------------------------------------------------------------- */
  function initForm() {
    var form = document.getElementById("leadForm");
    if (!form) return;

    var phone = form.querySelector("#f-whats");
    var statusEl = form.querySelector("#form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.querySelector(".btn-label") : null;
    var startedTracked = false;
    var formStart = Date.now(); // p/ proteção anti-spam por tempo

    // Máscara de telefone
    if (phone) {
      phone.addEventListener("input", function () {
        phone.value = maskPhone(phone.value);
      });
    }

    // Evento: início de preenchimento
    form.addEventListener(
      "input",
      function () {
        if (!startedTracked) {
          startedTracked = true;
          track("form_start", { form: "lead" });
        }
      },
      { once: false }
    );

    function setFieldError(field, message) {
      var wrap = field.closest(".field") || field.closest(".consent");
      if (!wrap) return;
      wrap.classList.add("has-error");
      field.setAttribute("aria-invalid", "true");
      var msgEl = wrap.querySelector(".error-msg");
      if (msgEl && message) msgEl.textContent = message;
    }
    function clearFieldError(field) {
      var wrap = field.closest(".field") || field.closest(".consent");
      if (!wrap) return;
      wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    }
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("change", function () {
        clearFieldError(el);
      });
    });

    function showStatus(type, text) {
      if (!statusEl) return;
      statusEl.className = "form-status show " + type;
      statusEl.querySelector(".msg").textContent = text;
      statusEl.setAttribute("role", type === "error" ? "alert" : "status");
    }
    function hideStatus() {
      if (statusEl) statusEl.className = "form-status";
    }

    function validate() {
      var ok = true;
      var firstInvalid = null;

      var nome = form.querySelector("#f-nome");
      if (!nome.value.trim() || nome.value.trim().length < 2) {
        setFieldError(nome, "Informe seu nome.");
        firstInvalid = firstInvalid || nome;
        ok = false;
      }
      if (!isValidBrPhone(phone.value)) {
        setFieldError(phone, "Informe um WhatsApp válido com DDD.");
        firstInvalid = firstInvalid || phone;
        ok = false;
      }
      var email = form.querySelector("#f-email");
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setFieldError(email, "E-mail inválido.");
        firstInvalid = firstInvalid || email;
        ok = false;
      }
      var objetivo = form.querySelector("#f-objetivo");
      if (!objetivo.value) {
        setFieldError(objetivo, "Selecione uma opção.");
        firstInvalid = firstInvalid || objetivo;
        ok = false;
      }
      var consent = form.querySelector("#f-consent");
      if (!consent.checked) {
        setFieldError(consent, "É necessário concordar para continuar.");
        firstInvalid = firstInvalid || consent;
        ok = false;
      }
      if (firstInvalid) firstInvalid.focus();
      return ok;
    }

    function setLoading(on) {
      if (!submitBtn) return;
      submitBtn.setAttribute("data-loading", String(on));
      submitBtn.disabled = on;
      if (submitLabel) {
        submitLabel.innerHTML = on
          ? '<span class="spinner" aria-hidden="true"></span> Enviando…'
          : "Receber uma simulação personalizada";
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideStatus();
      if (!validate()) {
        track("form_error", { form: "lead", reason: "validation" });
        return;
      }

      var payload = {
        nome: form.querySelector("#f-nome").value.trim(),
        whatsapp: phoneDigits(phone.value),
        email: form.querySelector("#f-email").value.trim(),
        objetivo: form.querySelector("#f-objetivo").value,
        faixa: form.querySelector("#f-faixa").value,
        prazo: form.querySelector("#f-prazo").value,
        periodo: form.querySelector("#f-periodo").value,
        consent: form.querySelector("#f-consent").checked,
        origem: "landing:conecta-consorcios",
        // proteção anti-spam
        website: form.querySelector("#f-website").value, // honeypot
        elapsed: Date.now() - formStart,
      };

      setLoading(true);
      fetch(CFG.leadEndpoint || "/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (data) {
              return { ok: res.ok, status: res.status, data: data };
            });
        })
        .then(function (r) {
          if (r.ok && r.data && r.data.success) {
            form.reset();
            showStatus(
              "success",
              "Recebemos seus dados! Um consultor vai entrar em contato pelo WhatsApp em breve."
            );
            track("form_submit_success", { form: "lead" });
          } else {
            throw new Error((r.data && r.data.error) || "Falha no envio");
          }
        })
        .catch(function () {
          // Fallback: oferece o WhatsApp como caminho alternativo
          var msg =
            "Olá! Fiz uma solicitação de simulação no site da Conecta Consórcios (nome: " +
            payload.nome +
            "). Podemos conversar?";
          showStatus(
            "error",
            "Não foi possível enviar agora. Tente novamente ou fale direto no WhatsApp."
          );
          var waLink = statusEl && statusEl.querySelector(".wa-fallback");
          if (waLink) {
            waLink.href = buildWhatsAppUrl(msg);
            waLink.hidden = false;
          }
          track("form_error", { form: "lead", reason: "network" });
        })
        .then(function () {
          setLoading(false);
        });
    });
  }

  /* ---------------------------------------------------------------- *
   * FAQ acessível
   * ---------------------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        item.classList.toggle("open", !expanded);
      });
    });
  }

  /* ---------------------------------------------------------------- *
   * Eventos de CTA / contato
   * ---------------------------------------------------------------- */
  function initTracking() {
    document.querySelectorAll("[data-cta]").forEach(function (el) {
      el.addEventListener("click", function () {
        track("cta_click", { label: el.getAttribute("data-cta") });
      });
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener("click", function () {
        track("email_click", {});
      });
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener("click", function () {
        track("phone_click", {});
      });
    });

    // Visualização da seção de formulário
    var formSection = document.getElementById("simulacao");
    if (formSection && "IntersectionObserver" in window) {
      var seen = false;
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting && !seen) {
              seen = true;
              track("form_view", { form: "lead" });
              io.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(formSection);
    }
  }

  /* ---------------------------------------------------------------- *
   * Reveal on scroll
   * ---------------------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------- *
   * Cookie banner (LGPD)
   * ---------------------------------------------------------------- */
  function initCookies() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    var consent = getConsent();

    if (consent === "accepted") {
      loadAnalytics();
    } else if (!consent) {
      // Mostra o banner apenas se não houver decisão registrada
      banner.classList.add("show");
    }

    var accept = banner.querySelector("#cookie-accept");
    var reject = banner.querySelector("#cookie-reject");
    if (accept)
      accept.addEventListener("click", function () {
        setConsent("accepted");
        banner.classList.remove("show");
        loadAnalytics();
        track("cookie_consent", { value: "accepted" });
      });
    if (reject)
      reject.addEventListener("click", function () {
        setConsent("rejected");
        banner.classList.remove("show");
      });

    // Link "Gerenciar cookies" reabre o banner
    document.querySelectorAll("[data-manage-cookies]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        banner.classList.add("show");
      });
    });
  }

  /* ---------------------------------------------------------------- */
  function init() {
    initWhatsApp();
    initNav();
    initForm();
    initFaq();
    initTracking();
    initReveal();
    initCookies();
    // Ano no rodapé
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
