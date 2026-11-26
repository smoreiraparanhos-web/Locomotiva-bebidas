/* Elementos com .revela entram suavemente ao aparecer na tela, em sequência dentro do mesmo grupo. */
export function iniciarRevelacoes() {
  const alvos = Array.from(document.querySelectorAll('.revela'));
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    alvos.forEach((el) => el.classList.add('visto'));
    return;
  }
  alvos.forEach((el) => {
    const irmaos = Array.from(el.parentElement.children).filter((c) => c.classList.contains('revela'));
    el.style.setProperty('--d', String(Math.max(0, irmaos.indexOf(el))));
  });
  const io = new IntersectionObserver((entradas) => entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    io.unobserve(e.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  alvos.forEach((el) => io.observe(el));
}
