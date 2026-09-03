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
