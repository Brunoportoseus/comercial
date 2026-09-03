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
