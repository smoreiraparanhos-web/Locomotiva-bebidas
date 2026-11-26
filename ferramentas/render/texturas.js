// Texturas procedurais desenhadas em canvas: rótulos, madeira, papel, ruído.
const PAPEL = '#EDE3CF';
const VERMELHO = '#A61920';
const VERMELHO_ESC = '#650D13';
const PRETO = '#0d0b0b';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// Ruído de valor 2D com fbm
function criarRuido(seed = 1) {
  const r = rng(seed);
  const P = new Float32Array(512 * 512);
  for (let i = 0; i < P.length; i++) P[i] = r();
  const h = (x, y) => P[((y & 511) << 9) | (x & 511)];
  const n = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    let fx = x - xi, fy = y - yi;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
  const fbm = (x, y, o = 5) => {
    let v = 0, a = 0.5;
    for (let i = 0; i < o; i++) { v += a * n(x, y); x = x * 2.03 + 17.1; y = y * 2.03 + 9.7; a *= 0.5; }
    return v;
  };
  return { n, fbm };
}

export function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// Textura de papel envelhecido aplicada sobre um canvas
function envelhecer(ctx, w, h, forca = 1, seed = 3) {
  const { fbm } = criarRuido(seed);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const r = rng(seed + 7);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const f = fbm(x / 140, y / 140, 4);
      const g = (r() - 0.5) * 18;
      const k = (1 - (f - 0.5) * 0.35 * forca) ;
      d[i] = Math.max(0, Math.min(255, d[i] * k + g * forca));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] * k + g * forca));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] * (k - 0.03 * forca) + g * forca));
    }
  }
  ctx.putImageData(img, 0, 0);
}

// Emblema: roda de locomotiva
export function roda(ctx, cx, cy, r, cor, espessura = r * 0.07) {
  ctx.save();
  ctx.strokeStyle = cor; ctx.fillStyle = cor;
  ctx.lineWidth = espessura;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = espessura * 0.45;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.86, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = espessura * 0.8;
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * 0.26, cy + Math.sin(a) * r * 0.26);
    ctx.lineTo(cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.24, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + r * 0.55, cy, r * 0.11, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function texto(ctx, t, x, y, fonte, cor, rastreio = 0, alinhamento = 'center') {
  ctx.save();
  ctx.font = fonte;
  ctx.fillStyle = cor;
  ctx.textAlign = alinhamento;
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${rastreio}px`;
  ctx.fillText(t, x, y);
  ctx.restore();
}

function filete(ctx, x, y, w, cor, h = 3) {
  ctx.fillStyle = cor; ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

/* Rótulo: canvas largo (envolve parte do cilindro). A área frontal é o centro. */
export function rotulo(tipo) {
  const W = 2400, H = 1500;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const cx = W / 2;
  const esquemas = {
    caldeira: { fundo: VERMELHO, tinta: PAPEL, destaque: PRETO, linha: 'Caldeira', sub: 'Malte envelhecido em carvalho tostado', num: 'Nº 01' },
    fornalha: { fundo: '#121010', tinta: '#C23A33', destaque: '#D9C9A8', linha: 'Fornalha', sub: 'Malte defumado em barril queimado', num: 'Nº 02' },
    noturno: { fundo: PAPEL, tinta: PRETO, destaque: VERMELHO, linha: 'Noturno', sub: 'Barril único, engarrafado à mão', num: 'Nº 03' },
  };
  const e = esquemas[tipo];
  ctx.fillStyle = e.fundo; ctx.fillRect(0, 0, W, H);

  // moldura dupla
  ctx.strokeStyle = e.tinta; ctx.lineWidth = 8;
  ctx.strokeRect(cx - 640, 50, 1280, H - 100);
  ctx.lineWidth = 3;
  ctx.strokeRect(cx - 615, 75, 1230, H - 150);

  texto(ctx, 'DESTILARIA', cx, 170, '600 54px "Archivo"', e.tinta, 22);
  roda(ctx, cx, 360, 120, e.destaque === PRETO ? e.tinta : e.destaque, 12);
  texto(ctx, 'LOCOMOTIVA', cx, 640, '900 158px "Bodoni Moda"', e.tinta, 2);
  filete(ctx, cx, 770, 900, e.tinta, 5);
  filete(ctx, cx, 790, 900, e.tinta, 2);
  texto(ctx, e.linha.toUpperCase(), cx, 920, '800 150px "Archivo"', e.destaque === PRETO ? PRETO : e.destaque, 26);
  texto(ctx, e.sub, cx, 1065, 'italic 500 62px "Bodoni Moda"', e.tinta, 1);
  filete(ctx, cx, 1160, 500, e.tinta, 3);
  texto(ctx, e.num, cx, 1260, '700 64px "Archivo"', e.tinta, 16);
  texto(ctx, 'EST. NA ESTRADA DE FERRO', cx, 1365, '600 40px "Archivo"', e.tinta, 14);

  // laterais (aparecem só em ângulo)
  ctx.save();
  ctx.translate(cx - 860, H / 2); ctx.rotate(-Math.PI / 2);
  texto(ctx, 'PARTIDA DA NOITE', 0, 0, '700 52px "Archivo"', e.tinta, 30);
  ctx.restore();
  ctx.save();
  ctx.translate(cx + 860, H / 2); ctx.rotate(Math.PI / 2);
  texto(ctx, 'DESTILADO NO SUL', 0, 0, '700 52px "Archivo"', e.tinta, 30);
  ctx.restore();

  envelhecer(ctx, W, H, tipo === 'noturno' ? 0.8 : 0.35, tipo.length * 5);
  return c;
}

/* Gargantilha (faixa pequena no pescoço) */
export function gargantilha(tipo) {
  const W = 1200, H = 260;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const fundo = { caldeira: PAPEL, fornalha: '#C23A33', noturno: VERMELHO }[tipo];
  const tinta = { caldeira: VERMELHO, fornalha: '#121010', noturno: PAPEL }[tipo];
  ctx.fillStyle = fundo; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = tinta; ctx.lineWidth = 5; ctx.strokeRect(14, 14, W - 28, H - 28);
  roda(ctx, W / 2, H / 2, 70, tinta, 9);
  texto(ctx, 'L', W / 2 - 250, H / 2 + 4, '900 120px "Bodoni Moda"', tinta);
  texto(ctx, 'M', W / 2 + 250, H / 2 + 4, '900 120px "Bodoni Moda"', tinta);
  envelhecer(ctx, W, H, 0.6, 21);
  return c;
}

/* Madeira de carvalho: cor e rugosidade. direcao 'h' = veios horizontais */
export function madeira({ w = 2048, h = 1024, tom = [92, 52, 28], escuro = 0.0, tabuas = 5, seed = 11 } = {}) {
  const { fbm, n } = criarRuido(seed);
  const cor = canvas(w, h), rug = canvas(w, h);
  const cc = cor.getContext('2d'), rc = rug.getContext('2d');
  const ci = cc.createImageData(w, h), ri = rc.createImageData(w, h);
  const r = rng(seed);
  const desloc = Array.from({ length: tabuas }, () => r() * 1000);
  const tonsTabua = Array.from({ length: tabuas }, () => 0.82 + r() * 0.3);
  for (let y = 0; y < h; y++) {
    const t = Math.floor((y / h) * tabuas);
    const yLocal = (y / h) * tabuas - t;
    const juncao = Math.min(yLocal, 1 - yLocal);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const ox = x + desloc[t];
      const warp = fbm(ox / 600, y / 160, 3) * 40;
      const veio = Math.sin((y + warp) * 0.55 + fbm(ox / 300, y / 30, 4) * 9);
      const fino = fbm(ox / 9, y / 1.6, 3);
      let v = 0.62 + veio * 0.12 + (fino - 0.5) * 0.5 + (fbm(ox / 200, y / 60, 4) - 0.5) * 0.5;
      v *= tonsTabua[t];
      if (juncao < 0.012) v *= 0.25; else if (juncao < 0.03) v *= 0.75;
      const nos = n(ox / 90, y / 90);
      if (nos > 0.93) v *= 0.7;
      v = v * (1 - escuro);
      ci.data[i] = Math.min(255, tom[0] * v * 1.25);
      ci.data[i + 1] = Math.min(255, tom[1] * v * 1.2);
      ci.data[i + 2] = Math.min(255, tom[2] * v * 1.15);
      ci.data[i + 3] = 255;
      const rr = 150 + (fino - 0.5) * 120 + (juncao < 0.03 ? 60 : 0);
      ri.data[i] = ri.data[i + 1] = ri.data[i + 2] = Math.max(0, Math.min(255, rr));
      ri.data[i + 3] = 255;
    }
  }
  cc.putImageData(ci, 0, 0); rc.putImageData(ri, 0, 0);
  return { cor, rug };
}

/* Tampo de barril: tábuas verticais em disco, queimadas, com marca a fogo */
export function tampoBarril(size = 2048) {
  const { cor, rug } = madeira({ w: size, h: size, tom: [96, 58, 32], tabuas: 7, seed: 41 });
  // gira 90° para tábuas verticais
  const c = canvas(size, size), ctx = c.getContext('2d');
  ctx.translate(size / 2, size / 2); ctx.rotate(Math.PI / 2); ctx.drawImage(cor, -size / 2, -size / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // queimado nas bordas
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.2, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, 'rgba(10,5,3,0)'); g.addColorStop(0.75, 'rgba(10,5,3,0.25)'); g.addColorStop(1, 'rgba(8,4,2,0.92)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  // marca a fogo
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.82;
  roda(ctx, size / 2, size * 0.44, size * 0.15, '#1a0d07', size * 0.014);
  texto(ctx, 'LOCOMOTIVA', size / 2, size * 0.68, `900 ${size * 0.058}px "Bodoni Moda"`, '#1a0d07', size * 0.004);
  texto(ctx, 'CARVALHO · QUEIMA 3', size / 2, size * 0.76, `700 ${size * 0.03}px "Archivo"`, '#1a0d07', size * 0.008);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const r2 = canvas(size, size), rctx = r2.getContext('2d');
  rctx.translate(size / 2, size / 2); rctx.rotate(Math.PI / 2); rctx.drawImage(rug, -size / 2, -size / 2);
  return { cor: c, rug: r2 };
}

/* Mapa de normais leve de ruído (para gelo, cera, metal escovado) */
export function ruidoNormal(size = 512, escala = 30, forca = 2, seed = 5, anis = 1) {
  const { fbm } = criarRuido(seed);
  const hgt = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) hgt[y * size + x] = fbm(x / escala, (y / escala) * anis, 4);
  const c = canvas(size, size), ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const dx = (hgt[y * size + ((x + 1) % size)] - hgt[y * size + ((x - 1 + size) % size)]) * forca * 10;
    const dy = (hgt[((y + 1) % size) * size + x] - hgt[((y - 1 + size) % size) * size + x]) * forca * 10;
    const len = Math.hypot(dx, dy, 1);
    img.data[i * 4] = (-dx / len * 0.5 + 0.5) * 255;
    img.data[i * 4 + 1] = (-dy / len * 0.5 + 0.5) * 255;
    img.data[i * 4 + 2] = (1 / len * 0.5 + 0.5) * 255;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* Tampa metálica gravada (topo) */
export function tampaGravada(size = 1024) {
  const c = canvas(size, size), ctx = c.getContext('2d');
  ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, size, size);
  roda(ctx, size / 2, size / 2, size * 0.3, '#5a5a5a', size * 0.03);
  ctx.strokeStyle = '#5a5a5a'; ctx.lineWidth = size * 0.012;
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.44, 0, Math.PI * 2); ctx.stroke();
  return c;
}
