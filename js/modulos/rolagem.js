/* Movimentos ligados à rolagem: decorações flutuantes, faixa de palavras e trem.
   Nada se move sozinho; tudo depende da posição da página. */
export function iniciarRolagem() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const flutuantes = Array.from(document.querySelectorAll('[data-flutua]'));
  const imagensBrinde = Array.from(document.querySelectorAll('[data-flutua-img] img'));
  const faixas = Array.from(document.querySelectorAll('[data-faixa]'));
  const trens = Array.from(document.querySelectorAll('[data-trem]'));
  let agendado = false;

  const visivel = (r) => r.bottom > -200 && r.top < innerHeight + 200;

  const atualizar = () => {
    agendado = false;
    const vh = innerHeight;
    flutuantes.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (!visivel(r)) return;
      const centro = r.top + r.height / 2 - vh / 2;
      el.style.setProperty('--y', (centro * parseFloat(el.dataset.flutua)).toFixed(1));
    });
    imagensBrinde.forEach((img) => {
      const r = img.parentElement.parentElement.getBoundingClientRect();
      if (!visivel(r)) return;
      img.style.setProperty('--y', ((r.top + r.height / 2 - vh / 2) * -0.12).toFixed(1));
    });
    faixas.forEach((f) => {
      const r = f.getBoundingClientRect();
      if (!visivel(r)) return;
      f.style.setProperty('--x', ((r.top - vh) * 0.45).toFixed(1));
    });
    trens.forEach((t) => {
      const pai = t.parentElement.getBoundingClientRect();
      if (!visivel(pai)) return;
      const p = 1 - (pai.top + pai.height) / (vh + pai.height);
      t.style.setProperty('--x', (p * (pai.width - t.getBoundingClientRect().width)).toFixed(1));
    });
  };
  const pedir = () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizar); } };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  atualizar();
}
