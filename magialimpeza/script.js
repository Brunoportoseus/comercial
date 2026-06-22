/* =============================================
   MAGINA LIMPEZA E CONSERVAÇÃO — JS
   ============================================= */

(function () {
  'use strict';

  /* ---- HEADER: scroll effect ---- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---- MOBILE NAV ---- */
  const toggle   = document.getElementById('navToggle');
  const navMenu  = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('.nav__link, .nav__cta');

  toggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  /* ---- ACTIVE NAV LINK on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      const link   = navMenu.querySelector(`.nav__link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---- SIMPLE AOS (Animate On Scroll) ---- */
  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('aos-animate'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
  }
  initAOS();

  /* ---- CONTACT FORM → WhatsApp ---- */
  const form = document.getElementById('contatoForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome     = form.nome.value.trim();
      const telefone = form.telefone.value.trim();
      const email    = form.email.value.trim();
      const servico  = form.servico.value;
      const mensagem = form.mensagem.value.trim();

      if (!nome) { showError(form.nome, 'Por favor, informe seu nome.'); return; }
      if (!telefone) { showError(form.telefone, 'Por favor, informe seu telefone/WhatsApp.'); return; }

      const lines = [
        `*Olá, Magina Limpeza!* Gostaria de solicitar um orçamento.`,
        ``,
        `*Nome:* ${nome}`,
        telefone ? `*Telefone:* ${telefone}` : null,
        email    ? `*E-mail:* ${email}`    : null,
        servico  ? `*Serviço:* ${servico}` : null,
        mensagem ? `*Mensagem:* ${mensagem}` : null,
      ].filter(Boolean).join('\n');

      const url = `https://wa.me/554188169249?text=${encodeURIComponent(lines)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  function showError(input, msg) {
    input.focus();
    input.style.borderColor = '#EF4444';
    const tip = document.createElement('span');
    tip.style.cssText = 'color:#EF4444;font-size:.78rem;margin-top:4px;display:block';
    tip.textContent = msg;
    const existing = input.parentElement.querySelector('span.err');
    if (!existing) {
      tip.classList.add('err');
      input.parentElement.appendChild(tip);
    }
    input.addEventListener('input', () => {
      input.style.borderColor = '';
      tip.remove();
    }, { once: true });
  }

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 74;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- GALERIA: lightbox básico ---- */
  const galeriaItems = document.querySelectorAll('.galeria__item img');
  galeriaItems.forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  function openLightbox(src, alt) {
    const lb = document.createElement('div');
    lb.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.9);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
      animation:fadeIn .2s ease;
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(style);

    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,.6)';

    const close = document.createElement('button');
    close.innerHTML = '&times;';
    close.style.cssText = `
      position:absolute;top:20px;right:28px;background:none;border:none;
      color:#fff;font-size:2.5rem;cursor:pointer;line-height:1;
    `;

    lb.appendChild(image);
    lb.appendChild(close);
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    const destroy = () => {
      lb.remove();
      style.remove();
      document.body.style.overflow = '';
    };

    lb.addEventListener('click', destroy);
    close.addEventListener('click', destroy);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { destroy(); document.removeEventListener('keydown', esc); }
    });
  }

})();
