// Ano atual no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Fecha no topo ao carregar (evita restaurar scroll no mobile)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Realce sutil da topbar ao rolar
const topbar = document.querySelector('.topbar');
const onScroll = () => {
  if (window.scrollY > 12) topbar.style.boxShadow = '0 6px 20px -12px rgba(22,32,46,.4)';
  else topbar.style.boxShadow = 'none';
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Vídeos: clica na capa -> carrega o player do YouTube e dá play (roda dentro da página)
document.querySelectorAll('.video-box[data-yt]').forEach((box) => {
  const facade = box.querySelector('.video-box__facade');
  if (!facade) return;
  facade.addEventListener('click', () => {
    const id = box.dataset.yt;
    const iframe = document.createElement('iframe');
    iframe.className = 'video-box__player';
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1';
    iframe.title = 'Vídeo do empreendimento';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', '0');
    facade.replaceWith(iframe);
  });
});

// Modal de download com captura de nome + telefone
(function () {
  const modal = document.getElementById('downloadModal');
  if (!modal) return;
  const form = document.getElementById('downloadForm');
  const stepForm = modal.querySelector('[data-step="form"]');
  const stepDone = modal.querySelector('[data-step="done"]');
  const errEl = modal.querySelector('[data-err]');
  const nameOut = modal.querySelector('[data-name]');
  const leadWhats = document.getElementById('leadWhats');
  let lastFocus = null;

  const open = () => {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('input');
    if (first) setTimeout(() => first.focus(), 50);
  };
  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll('[data-open-download]').forEach((b) =>
    b.addEventListener('click', open)
  );
  modal.querySelectorAll('[data-close-download]').forEach((b) =>
    b.addEventListener('click', close)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  const digits = (s) => (s || '').replace(/\D/g, '');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const tel = form.telefone.value.trim();
    if (nome.length < 2 || digits(tel).length < 10) {
      errEl.hidden = false;
      return;
    }
    errEl.hidden = true;

    // Guarda o lead localmente
    try {
      localStorage.setItem(
        'bv_lead',
        JSON.stringify({ nome, tel, data: new Date().toISOString() })
      );
    } catch (_) {}

    // Monta a mensagem do lead para o corretor (nome + telefone)
    const msg =
      'Olá! Sou ' + nome + ' (' + tel + ').%0A' +
      'Quero a apresentação e a planta do Condomínio Bela Vista (Almirante) e mais informações.';
    const waUrl = 'https://wa.me/5541998448989?text=' + msg;
    leadWhats.href = waUrl;

    // Abre o WhatsApp já com os dados (o cliente conclui o envio) — o lead
    // chega ao corretor. Roda dentro do gesto de clique (evita bloqueio de pop-up).
    window.open(waUrl, '_blank');

    nameOut.textContent = nome.split(' ')[0];
    stepForm.hidden = true;
    stepDone.hidden = false;
  });
})();
