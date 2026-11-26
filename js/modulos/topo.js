/* Topo: fundo ao rolar, menu de celular e link da seção visível. */
export function iniciarTopo() {
  const topo = document.querySelector('.topo');
  const nav = document.getElementById('nav');
  const botao = document.querySelector('.topo__menu');
  const links = Array.from(nav.querySelectorAll('a'));

  const aoRolar = () => topo.classList.toggle('rolou', scrollY > 40);
  addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  const fechar = () => { nav.classList.remove('aberto'); botao.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  botao.addEventListener('click', () => {
    const abrir = !nav.classList.contains('aberto');
    nav.classList.toggle('aberto', abrir);
    botao.setAttribute('aria-expanded', String(abrir));
    document.body.style.overflow = abrir ? 'hidden' : '';
  });
  links.forEach((a) => a.addEventListener('click', fechar));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('aberto')) { fechar(); botao.focus(); } });

  if (!('IntersectionObserver' in window)) return;
  const secoes = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver((entradas) => entradas.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === `#${e.target.id}`));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach((s) => io.observe(s));
}
