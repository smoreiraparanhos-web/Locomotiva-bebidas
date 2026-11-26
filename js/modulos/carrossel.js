/* Carrossel da abertura: troca automática a cada 7 s, pausa ao passar o mouse ou focar,
   e respeita a preferência de redução de movimento. */
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function iniciarCarrossel() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.slide'));
  const abas = Array.from(hero.querySelectorAll('[role="tab"]'));
  let atual = 0;
  let timer = null;

  const mostrar = (i) => {
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const ativo = k === atual;
      s.classList.toggle('ativo', ativo);
      s.setAttribute('aria-hidden', String(!ativo));
      s.inert = !ativo;
    });
    abas.forEach((a, k) => { a.setAttribute('aria-selected', String(k === atual)); a.tabIndex = k === atual ? 0 : -1; });
  };
  const iniciar = () => { if (!reduz) { parar(); timer = setInterval(() => mostrar(atual + 1), 7000); } };
  const parar = () => { clearInterval(timer); timer = null; };

  abas.forEach((a, k) => {
    a.addEventListener('click', () => { mostrar(k); iniciar(); });
    a.addEventListener('keydown', (e) => {
      const passo = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!passo) return;
      e.preventDefault(); mostrar(atual + passo); abas[atual].focus(); iniciar();
    });
  });
  hero.addEventListener('mouseenter', parar);
  hero.addEventListener('mouseleave', iniciar);
  hero.addEventListener('focusin', parar);
  hero.addEventListener('focusout', iniciar);
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : iniciar()));

  mostrar(0);
  iniciar();
}
