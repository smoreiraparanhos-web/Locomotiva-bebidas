// Objetos de apoio: laranja, folhas, taça, caixa de presente, brilhos, fumaça.
import * as THREE from 'three';
import { canvas, roda } from './texturas.js';

const tex = (c, srgb = true) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

/* Rodela de laranja: disco com gomos desenhados */
function texLaranja() {
  const S = 1024, c = canvas(S, S), x = c.getContext('2d');
  const cx = S / 2;
  x.fillStyle = '#e8740f'; x.beginPath(); x.arc(cx, cx, S * 0.5, 0, 7); x.fill();
  x.fillStyle = '#f6e7c8'; x.beginPath(); x.arc(cx, cx, S * 0.455, 0, 7); x.fill();
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 + 0.03, a1 = ((i + 1) / n) * Math.PI * 2 - 0.03;
    const g = x.createRadialGradient(cx, cx, S * 0.05, cx, cx, S * 0.44);
    g.addColorStop(0, '#ffb347'); g.addColorStop(1, '#f07a10');
    x.fillStyle = g;
    x.beginPath(); x.moveTo(cx + Math.cos((a0 + a1) / 2) * S * 0.05, cx + Math.sin((a0 + a1) / 2) * S * 0.05);
    x.arc(cx, cx, S * 0.43, a0, a1); x.closePath(); x.fill();
    // vesículas
    x.strokeStyle = 'rgba(255,220,150,.35)'; x.lineWidth = 2;
    for (let k = 0; k < 14; k++) {
      const a = a0 + (a1 - a0) * Math.random(), r = S * (0.1 + Math.random() * 0.3);
      x.beginPath(); x.moveTo(cx + Math.cos(a) * r, cx + Math.sin(a) * r);
      x.lineTo(cx + Math.cos(a) * (r + 30), cx + Math.sin(a) * (r + 30)); x.stroke();
    }
  }
  x.fillStyle = '#f6e7c8'; x.beginPath(); x.arc(cx, cx, S * 0.04, 0, 7); x.fill();
  return c;
}

export function laranja(raio = 2.2, esp = 0.35) {
  const g = new THREE.Group();
  const face = new THREE.MeshPhysicalMaterial({ map: tex(texLaranja()), roughness: 0.35, transmission: 0, clearcoat: 0.8, clearcoatRoughness: 0.2, sheen: 0.5, sheenColor: '#ffb050' });
  const casca = new THREE.MeshStandardMaterial({ color: '#d9620a', roughness: 0.55 });
  const corpo = new THREE.CylinderGeometry(raio, raio, esp, 96, 1, false);
  const m = new THREE.Mesh(corpo, [casca, face, face]);
  g.add(m);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* Raminho de folhas (alecrim / louro estilizado) */
export function ramo({ folhas = 14, comp = 12, cor = '#2f5a1e', seed = 2 } = {}) {
  const g = new THREE.Group();
  let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const caule = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.4, comp * 0.35, 0.2), new THREE.Vector3(-0.3, comp * 0.7, -0.1), new THREE.Vector3(0.6, comp, 0.3)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(caule, 60, 0.08, 8), new THREE.MeshStandardMaterial({ color: '#4a3a1e', roughness: 0.8 })));
  const forma = new THREE.Shape();
  forma.moveTo(0, 0); forma.quadraticCurveTo(0.9, 1.2, 0, 3.0); forma.quadraticCurveTo(-0.9, 1.2, 0, 0);
  const geo = new THREE.ShapeGeometry(forma, 16);
  // curva a folha
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, x * x * 0.35 - y * y * 0.03); }
  geo.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.45, side: THREE.DoubleSide, sheen: 0.6, sheenColor: '#9fd070', clearcoat: 0.4 });
  for (let i = 0; i < folhas; i++) {
    const t = 0.12 + (i / folhas) * 0.86;
    const pt = caule.getPoint(t);
    const f = new THREE.Mesh(geo, mat);
    const lado = i % 2 ? 1 : -1;
    f.position.copy(pt);
    f.rotation.set(-0.3 + r() * 0.3, r() * Math.PI * 2, lado * (0.7 + r() * 0.5));
    const sc = 0.7 + (1 - t) * 0.5 + r() * 0.2;
    f.scale.setScalar(sc);
    f.castShadow = true;
    g.add(f);
  }
  return g;
}

/* Taça coupe com líquido */
export function taca({ cor = '#c98a3a', nivel = 0.75 } = {}) {
  const g = new THREE.Group();
  const base = [[0, 0], [3.2, 0], [3.3, 0.12], [0.5, 0.35], [0.28, 0.8], [0.25, 7.2], [0.5, 7.6], [2.6, 8.1], [4.4, 9.2], [5.0, 10.4], [4.92, 10.45], [4.3, 9.4], [2.5, 8.3], [0, 8.1]];
  let perfil = base;
  for (let k = 0; k < 2; k++) { const n = [perfil[0]]; for (let i = 0; i < perfil.length - 1; i++) { const a = perfil[i], b = perfil[i + 1]; n.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } n.push(perfil[perfil.length - 1]); perfil = n; }
  const geo = new THREE.LatheGeometry(perfil.map(([a, b]) => new THREE.Vector2(a, b)), 160);
  const m = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.02, transparent: true, envMapIntensity: 1.8, side: THREE.DoubleSide, depthWrite: false });
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace('#include <opaque_fragment>', `
      float frv = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
      diffuseColor.a = clamp(0.05 + pow(frv, 2.2) * 0.95, 0.0, 1.0);
      #include <opaque_fragment>`);
  };
  const vid = new THREE.Mesh(geo, m); vid.renderOrder = 5;
  g.add(vid);
  const y = 8.15 + nivel * 1.9;
  const rr = 2.5 + nivel * 1.8;
  const liq = new THREE.Mesh(new THREE.LatheGeometry([[0, 8.18], [2.45, 8.32], [rr, y], [0, y]].map(([a, b]) => new THREE.Vector2(a, b)), 120),
    new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.05, clearcoat: 1, emissive: cor, emissiveIntensity: 0.6, transparent: true, opacity: 0.9 }));
  g.add(liq);
  return g;
}

/* Gotas espirrando (esferas achatadas) */
export function respingo({ n = 60, cor = '#e0a050', centro = [0, 11, 0], raio = 9, seed = 4 } = {}) {
  const g = new THREE.Group();
  let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const mat = new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.05, clearcoat: 1, emissive: cor, emissiveIntensity: 0.25, transparent: true, opacity: 0.9 });
  const geo = new THREE.SphereGeometry(1, 20, 14);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, el = r() * 1.2 - 0.2, d = raio * (0.4 + r() * 0.8);
    const m = new THREE.Mesh(geo, mat);
    const sz = 0.08 + Math.pow(r(), 3) * 0.45;
    m.scale.set(sz, sz * (1 + r() * 1.8), sz);
    m.position.set(centro[0] + Math.cos(a) * d, centro[1] + el * d * 0.6, centro[2] + Math.sin(a) * d * 0.5);
    m.rotation.z = -Math.cos(a) * 0.8;
    g.add(m);
  }
  return g;
}

/* Brilhos dourados (partículas) */
export function brilhos({ n = 220, area = [60, 30, 30], centro = [0, 12, 0], cor = '#ffcf7a', seed = 9 } = {}) {
  let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const pos = new Float32Array(n * 3), tam = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = centro[0] + (r() - 0.5) * area[0];
    pos[i * 3 + 1] = centro[1] + (r() - 0.5) * area[1];
    pos[i * 3 + 2] = centro[2] + (r() - 0.5) * area[2];
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const c = canvas(64, 64), x = c.getContext('2d');
  const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,220,150,.6)'); gr.addColorStop(1, 'rgba(255,200,100,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({ size: 0.5, map: tex(c), color: cor, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  return new THREE.Points(geo, mat);
}

/* Caixa de presente preta com tampa, borda dourada e emblema */
export function caixa({ w = 30, h = 34, d = 12 } = {}) {
  const g = new THREE.Group();
  const cBase = canvas(1024, 1024), x = cBase.getContext('2d');
  x.fillStyle = '#121010'; x.fillRect(0, 0, 1024, 1024);
  x.strokeStyle = '#c9a45c'; x.lineWidth = 10; x.strokeRect(40, 40, 944, 944); x.lineWidth = 3; x.strokeRect(64, 64, 896, 896);
  roda(x, 512, 400, 150, '#c9a45c', 16);
  x.fillStyle = '#c9a45c'; x.textAlign = 'center'; x.font = '900 104px "Bodoni Moda"'; x.fillText('LOCOMOTIVA', 512, 700);
  x.font = '600 38px "Archivo"'; if ('letterSpacing' in x) x.letterSpacing = '12px'; x.fillText('COLEÇÃO DE PRESENTE', 512, 790);
  const frente = new THREE.MeshPhysicalMaterial({ map: tex(cBase), roughness: 0.5, clearcoat: 0.3 });
  const preto = new THREE.MeshPhysicalMaterial({ color: '#141212', roughness: 0.55, clearcoat: 0.3 });
  const interno = new THREE.MeshStandardMaterial({ color: '#5a0d12', roughness: 0.9 });
  // caixa aberta: fundo + laterais + frente baixa com veludo vermelho
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(w, 1, d), preto); fundo.position.y = 0.5; g.add(fundo);
  const tras = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1), preto); tras.position.set(0, h / 2, -d / 2 + 0.5); g.add(tras);
  const velTras = new THREE.Mesh(new THREE.PlaneGeometry(w - 2, h - 2), interno); velTras.position.set(0, h / 2, -d / 2 + 1.01); g.add(velTras);
  for (const sx of [-1, 1]) { const l = new THREE.Mesh(new THREE.BoxGeometry(1, h, d), preto); l.position.set(sx * (w / 2 - 0.5), h / 2, 0); g.add(l); }
  const frenteBaixa = new THREE.Mesh(new THREE.BoxGeometry(w, 6, 1), preto); frenteBaixa.position.set(0, 3, d / 2 - 0.5); g.add(frenteBaixa);
  const friso = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, 0.3, 1.05), new THREE.MeshPhysicalMaterial({ color: '#c9a45c', metalness: 1, roughness: 0.3 }));
  friso.position.set(0, 5.6, d / 2 - 0.5); g.add(friso);
  // tampa encostada ao lado
  const tampa = new THREE.Mesh(new THREE.BoxGeometry(w + 1, h + 1, 1.6), [preto, preto, preto, preto, frente, preto]);
  tampa.position.set(w * 0.95, (h + 1) / 2 + 0.1, d * 0.2); tampa.rotation.set(-0.12, -0.35, 0);
  g.add(tampa);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

/* Fumaça: planos com textura de ruído suave */
export function fumaca({ n = 6, cor = '#ffffff', opac = 0.06, centro = [0, 14, -6], seed = 3 } = {}) {
  const g = new THREE.Group();
  const c = canvas(512, 512), x = c.getContext('2d');
  for (let i = 0; i < 40; i++) {
    const gx = 256 + (Math.random() - 0.5) * 260, gy = 256 + (Math.random() - 0.5) * 300, r = 60 + Math.random() * 120;
    const gr = x.createRadialGradient(gx, gy, 0, gx, gy, r); gr.addColorStop(0, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 512, 512);
  }
  const t = tex(c);
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 34), new THREE.MeshBasicMaterial({ map: t, color: cor, transparent: true, opacity: opac, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.position.set(centro[0] + (i - n / 2) * 4, centro[1] + Math.sin(i * 1.7) * 4, centro[2] - i * 2);
    m.rotation.z = i * 0.8;
    g.add(m);
  }
  return g;
}

/* Alambique de cobre: caldeira em cebola, pescoço de cisne e braço inclinado */
export function alambique() {
  const g = new THREE.Group();
  const cobre = new THREE.MeshPhysicalMaterial({ color: '#c06a38', metalness: 1, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.3 });
  const martelado = (() => { const S = 512, c = canvas(S, S), x = c.getContext('2d'); x.fillStyle = 'rgb(128,128,255)'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 900; i++) { const px = Math.random() * S, py = Math.random() * S, r = 6 + Math.random() * 10; const gr = x.createRadialGradient(px - r * .3, py - r * .3, 0, px, py, r); gr.addColorStop(0, 'rgba(160,160,255,.5)'); gr.addColorStop(1, 'rgba(100,100,255,0)'); x.fillStyle = gr; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 4); return t; })();
  cobre.normalMap = martelado; cobre.normalScale = new THREE.Vector2(0.5, 0.5);
  const pts = [[0, 6], [9, 6], [10.5, 7], [11, 10], [10.6, 14], [9, 17.5], [6.5, 20], [4.2, 22], [3.2, 23.5], [3.0, 25], [2.4, 30], [1.9, 34], [1.6, 36], [0, 36.2]];
  let p = pts; for (let k = 0; k < 3; k++) { const n = [p[0]]; for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1]; n.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } n.push(p[p.length - 1]); p = n; }
  g.add(new THREE.Mesh(new THREE.LatheGeometry(p.map(([a, b]) => new THREE.Vector2(a, b)), 160), cobre));
  // anel e visor
  const anel = new THREE.Mesh(new THREE.TorusGeometry(10.95, 0.35, 16, 160), cobre); anel.rotation.x = Math.PI / 2; anel.position.y = 11; g.add(anel);
  const visor = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.6, 48), new THREE.MeshPhysicalMaterial({ color: '#ffd9a0', roughness: 0.05, transmission: 0.6, emissive: '#ff9a40', emissiveIntensity: 0.15 }));
  visor.rotation.x = Math.PI / 2; visor.position.set(0, 13.5, 10.6); g.add(visor);
  // braço
  const braco = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 35.6, 0), new THREE.Vector3(1.5, 37.5, 0), new THREE.Vector3(5, 37.2, 0), new THREE.Vector3(18, 33, 0), new THREE.Vector3(26, 30.5, 0)]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(braco, 120, 1.0, 32), cobre));
  // base de tijolos escuros
  const base = new THREE.Mesh(new THREE.CylinderGeometry(11.5, 12, 6, 96), new THREE.MeshStandardMaterial({ color: '#2a1a14', roughness: 0.9 }));
  base.position.y = 3; g.add(base);
  const brasa = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 0.5), new THREE.MeshBasicMaterial({ color: '#7a2a0a' }));
  brasa.position.set(0, 2.2, 11.8); g.add(brasa);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
