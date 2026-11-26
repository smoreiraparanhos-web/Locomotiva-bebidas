/* Abertura: a garrafa serve o copo conforme a rolagem. 48 quadros desenhados em canvas.
   O primeiro quadro já vem como <img>; os demais carregam em segundo plano. */
const TOTAL = 48;
const caminho = (i) => `img/servir/${String(i).padStart(2, '0')}.webp`;

export function iniciarServir() {
  const secao = document.querySelector('.servir');
  if (!secao) return;
  const cena = secao.querySelector('.servir__cena');
  const canvas = cena.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const passos = Array.from(secao.querySelectorAll('[data-passo]'));
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const quadros = new Array(TOTAL);
  let atual = -1;
  let agendado = false;

  const desenhar = (i) => {
    // usa o quadro carregado mais próximo enquanto o pedido ainda chega
    let k = i;
    while (k > 0 && !(quadros[k] && quadros[k].complete && quadros[k].naturalWidth)) k -= 1;
    const img = quadros[k];
    if (!img || !img.naturalWidth || k === atual) return;
    atual = k;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    cena.classList.add('pronto');
  };

  const marcarPassos = (p) => {
    const ativo = p < 0.36 ? 0 : p < 0.82 ? 1 : 2;
    passos.forEach((li, k) => li.classList.toggle('ativo', k === ativo));
  };

  const progresso = () => {
    const r = secao.getBoundingClientRect();
    const curso = r.height - innerHeight;
    return curso > 0 ? Math.min(1, Math.max(0, -r.top / curso)) : 0;
  };

  const atualizar = () => {
    agendado = false;
    const p = progresso();
    secao.style.setProperty('--p', p.toFixed(3));
    marcarPassos(p);
    desenhar(Math.round(p * (TOTAL - 1)));
  };
  const pedir = () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizar); } };

  if (reduz) {
    // sem animação: mostra o copo servido
    const fim = new Image();
    fim.onload = () => { quadros[TOTAL - 1] = fim; atual = -1; desenhar(TOTAL - 1); };
    fim.src = caminho(TOTAL - 1);
    marcarPassos(1);
    return;
  }

  const carregar = (i) => new Promise((ok) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = img.onerror = () => ok();
    img.src = caminho(i);
    quadros[i] = img;
  });

  // primeiro o quadro 0, depois os demais em ordem, sem travar a página
  carregar(0).then(async () => {
    atualizar();
    for (let i = 1; i < TOTAL; i += 1) {
      await carregar(i);
      if (i % 6 === 0) pedir();
    }
    atual = -1;
    pedir();
  });

  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
}
