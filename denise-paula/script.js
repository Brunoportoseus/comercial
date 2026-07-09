/* ============================================================
   DENISE DE PAULA — Main Script
   ============================================================ */

// ── Header scroll effect ────────────────────────────────────
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) {
    header.style.borderBottomColor = y > 60
      ? 'rgba(184,150,90,.35)'
      : 'rgba(184,150,90,.2)';
  }
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', y > 400);
  }
});

// ── Mobile nav ──────────────────────────────────────────────
function openMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Intersection observer — fade-up ────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// ── Gallery tabs ────────────────────────────────────────────
function switchTab(btn, panelId) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.gallery-panel').forEach(p => p.style.display = 'none');
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.style.display = 'block';
    panel.querySelectorAll('.fade-up').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => io.observe(el), 20);
    });
  }
}

// ── Testimonials carousel ───────────────────────────────────
let testimonialIdx = 0;
const VISIBLE = window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;

function getVisible() {
  return window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;
}

function updateCarousel() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const vis = getVisible();
  const maxIdx = Math.max(0, cards.length - vis);
  testimonialIdx = Math.min(testimonialIdx, maxIdx);
  const pct = (100 / vis) * testimonialIdx;
  track.style.transform = `translateX(-${pct}%)`;
  cards.forEach((c, i) => {
    c.style.minWidth = `calc(${100 / vis}% - 2px)`;
  });
}

function nextTestimonial() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const vis = getVisible();
  const maxIdx = cards.length - vis;
  testimonialIdx = testimonialIdx >= maxIdx ? 0 : testimonialIdx + 1;
  updateCarousel();
}

function prevTestimonial() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  const vis = getVisible();
  const maxIdx = cards.length - vis;
  testimonialIdx = testimonialIdx <= 0 ? maxIdx : testimonialIdx - 1;
  updateCarousel();
}

// Auto-advance
let autoPlay = setInterval(nextTestimonial, 5500);
document.getElementById('testimonialsTrack')?.addEventListener('mouseenter', () => clearInterval(autoPlay));
document.getElementById('testimonialsTrack')?.addEventListener('mouseleave', () => {
  autoPlay = setInterval(nextTestimonial, 5500);
});

window.addEventListener('resize', updateCarousel);
updateCarousel();

// ── Form submissions ────────────────────────────────────────
function submitHeroForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]')?.value || '';
  const phone = form.querySelector('input[type="tel"]')?.value || '';
  const service = form.querySelector('select')?.value || '';
  const msg = encodeURIComponent(
    `Olá Denise! Me chamo ${name}.\nTenho interesse em: ${service}.\nMeu WhatsApp: ${phone}\n\nGostaria de agendar uma avaliação gratuita.`
  );
  window.open(`https://wa.me/5541974016961?text=${msg}`, '_blank');
}

function submitMainForm(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input, select, textarea');
  let name = '', phone = '', service = '', message = '';
  inputs.forEach(inp => {
    if (inp.type === 'text' && !name) name = inp.value;
    if (inp.type === 'tel') phone = inp.value;
    if (inp.tagName === 'SELECT') service = inp.value;
    if (inp.tagName === 'TEXTAREA') message = inp.value;
  });
  const msg = encodeURIComponent(
    `Olá Denise!\n\nSou ${name}.\nInteresse: ${service || 'Geral'}\nTelefone: ${phone}\n\n${message}`
  );
  window.open(`https://wa.me/5541974016961?text=${msg}`, '_blank');
}

// ── Smooth scroll for anchor links ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
