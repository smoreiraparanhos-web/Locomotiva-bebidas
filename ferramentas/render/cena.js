import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as T from './texturas.js';

const tex = (c, srgb = true, rep = null) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
};

/* ---------- Materiais ---------- */
function vidro({ cor = '#ffffff', atenua = '#ffffff', dist = 6, rug = 0.03, esp = 1.2 } = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: cor, transmission: 1, roughness: rug, ior: 1.52, thickness: 0.8,
    attenuationColor: new THREE.Color(atenua), attenuationDistance: dist,
    specularIntensity: 1, envMapIntensity: esp, side: THREE.DoubleSide,
  });
}

// Líquido opaco com brilho de contraluz nas bordas (o vidro transmissivo mostra o que está atrás)
function liquido({ cor = '#5a2408', borda = '#e08a2c', forca = 1.6, centro = 0.25 } = {}) {
  const m = new THREE.MeshPhysicalMaterial({ color: cor, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.6 });
  m.onBeforeCompile = (s) => {
    s.uniforms.uBorda = { value: new THREE.Color(borda) };
    s.uniforms.uForca = { value: forca };
    s.uniforms.uCentro = { value: centro };
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uBorda; uniform float uForca; uniform float uCentro;')
      .replace('#include <opaque_fragment>', `
        float fr = 1.0 - clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0);
        outgoingLight += uBorda * (uCentro + pow(fr, 1.6) * uForca);
        #include <opaque_fragment>`);
  };
  return m;
}

/* ---------- Garrafa ---------- */
const PERFIL = [
  [0, 0], [3.9, 0], [4.3, 0.1], [4.48, 0.45], [4.5, 1.0],
  [4.5, 16.4], [4.46, 17.3], [4.25, 18.0], [3.6, 18.7], [2.6, 19.4], [1.9, 20.1],
  [1.55, 20.9], [1.42, 21.8], [1.4, 22.6], [1.4, 26.0], [1.56, 26.2], [1.6, 26.6], [1.46, 26.85], [1.2, 26.9],
];

function lathe(pts, seg = 160) {
  return new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
}

function suavizar(pts, passos = 3) {
  // Chaikin para curvas suaves
  let p = pts;
  for (let k = 0; k < passos; k++) {
    const n = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const [a, b] = [p[i], p[i + 1]];
      n.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      n.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    n.push(p[p.length - 1]);
    p = n;
  }
  return p;
}

function cera(cor = '#8a0f17', seed = 3) {
  const g = new THREE.CylinderGeometry(1.62, 1.62, 1, 220, 60, true);
  const pos = g.attributes.position;
  let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const gotas = Array.from({ length: 6 }, () => ({ a: r() * Math.PI * 2, l: 0.25 + r() * 0.9, w: 0.22 + r() * 0.22 }));
  const topo = 27.45, base = 24.9;
  const drip = (th) => {
    let d = Math.sin(th * 7 + 1) * 0.12 + Math.sin(th * 13) * 0.06;
    for (const gt of gotas) {
      const da = Math.atan2(Math.sin(th - gt.a), Math.cos(th - gt.a));
      const u = Math.abs(da) / gt.w;
      if (u < 1) d += gt.l * Math.pow(1 - u * u, 0.7);
    }
    return d;
  };
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const th = Math.atan2(v.x, v.z);
    const t = v.y + 0.5; // 0 base, 1 topo
    const b = base - drip(th);
    const y = b + (topo - b) * t;
    const nearTip = 1 - t;
    const rad = 1.5 + 0.07 * Math.pow(nearTip, 4) + (y > 25.9 ? 0.16 * Math.min(1, (y - 25.9) / 0.4) : 0);
    pos.setXYZ(i, Math.sin(th) * rad, y, Math.cos(th) * rad);
  }
  g.computeVertexNormals();
  const tampa = lathe(suavizar([[0, 27.78], [1.1, 27.73], [1.52, 27.6], [1.66, 27.4]], 2), 160);
  const mat = new THREE.MeshPhysicalMaterial({
    color: cor, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.4, sheenColor: '#ff4a4a',
    normalMap: tex(T.ruidoNormal(512, 22, 1.1, 9), false, [3, 2]), normalScale: new THREE.Vector2(0.35, 0.35),
  });
  const grupo = new THREE.Group();
  grupo.add(new THREE.Mesh(g, mat), new THREE.Mesh(tampa, mat));
  return grupo;
}

function tampaMetal() {
  const grupo = new THREE.Group();
  const lado = new THREE.CylinderGeometry(1.66, 1.66, 2.9, 200, 1, true);
  lado.translate(0, 26.05, 0);
  const escovado = tex(T.ruidoNormal(512, 6, 0.5, 12, 40), false, [4, 1]);
  const mat = new THREE.MeshPhysicalMaterial({ color: '#e4ddd2', metalness: 1, roughness: 0.22, envMapIntensity: 2.2, normalMap: escovado, normalScale: new THREE.Vector2(0.15, 0.15) });
  grupo.add(new THREE.Mesh(lado, mat));
  // frisos
  for (let i = 0; i < 2; i++) {
    const f = new THREE.TorusGeometry(1.6, 0.05, 12, 200);
    f.rotateX(Math.PI / 2); f.translate(0, 24.9 + i * 0.25, 0);
    grupo.add(new THREE.Mesh(f, mat));
  }
  const topo = new THREE.CircleGeometry(1.6, 200);
  topo.rotateX(-Math.PI / 2); topo.translate(0, 27.5, 0);
  const gravado = tex(T.tampaGravada(1024), false);
  const matTopo = new THREE.MeshPhysicalMaterial({ color: '#e4ddd2', metalness: 1, roughness: 0.2, envMapIntensity: 2.2, bumpMap: gravado, bumpScale: 2.5 });
  grupo.add(new THREE.Mesh(topo, matTopo));
  const borda = new THREE.TorusGeometry(1.56, 0.06, 12, 200);
  borda.rotateX(Math.PI / 2); borda.translate(0, 27.48, 0);
  grupo.add(new THREE.Mesh(borda, mat));
  return grupo;
}

export function garrafa(tipo = 'caldeira') {
  const cfg = {
    caldeira: { vidro: { cor: '#fff6ee', atenua: '#ffe2c8', dist: 14 }, liq: { cor: '#2a0e03', borda: '#c8661c', forca: 0.55, centro: 0.015 }, cera: '#8f0f18', fecho: 'cera' },
    fornalha: { vidro: { cor: '#5a4a46', atenua: '#2a1d1a', dist: 2.5, esp: 1.5 }, liq: { cor: '#120502', borda: '#7a240a', forca: 0.4, centro: 0.0 }, cera: '#6d0b12', fecho: 'cera' },
    noturno: { vidro: { cor: '#ffffff', atenua: '#fff7ec', dist: 30 }, liq: { cor: '#4a2206', borda: '#e0902e', forca: 0.7, centro: 0.03 }, fecho: 'metal' },
  }[tipo];
  const g = new THREE.Group();
  const perfil = suavizar(PERFIL, 3);
  const vid = new THREE.Mesh(lathe(perfil), vidro(cfg.vidro));
  vid.renderOrder = 2;
  g.add(vid);

  // líquido
  const enchimento = 19.9;
  const interno = perfil
    .filter(([, y]) => y > 0.9 && y < enchimento)
    .map(([r, y]) => [Math.max(0, r - 0.2), y]);
  const rTopo = interno[interno.length - 1][0];
  const liqPts = [[0, 0.95], [interno[0][0] - 0.3, 0.95], ...interno, [rTopo - 0.02, enchimento], [0, enchimento]];
  g.add(new THREE.Mesh(lathe(liqPts, 128), liquido(cfg.liq)));

  // rótulo principal
  const raio = 4.52, alt = 8.8, arco = 2.6;
  const rot = new THREE.CylinderGeometry(raio, raio, alt, 220, 1, true, -arco / 2, arco);
  rot.translate(0, 9.6, 0);
  const matRot = new THREE.MeshStandardMaterial({ map: tex(T.rotulo(tipo)), roughness: 0.62, side: THREE.FrontSide });
  matRot.map.anisotropy = 16;
  g.add(new THREE.Mesh(rot, matRot));

  // gargantilha
  const rG = 1.425, arcG = 3.0;
  const gar = new THREE.CylinderGeometry(rG, rG, 1.3, 160, 1, true, -arcG / 2, arcG);
  gar.translate(0, 23.6, 0);
  g.add(new THREE.Mesh(gar, new THREE.MeshStandardMaterial({ map: tex(T.gargantilha(tipo)), roughness: 0.55 })));

  g.add(cfg.fecho === 'cera' ? cera(cfg.cera, tipo.length * 7 + 1) : tampaMetal());
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });
  return g;
}

/* ---------- Copo baixo com gelo ---------- */
export function copo({ liq = true, gelos = 3 } = {}) {
  const g = new THREE.Group();
  const ext = suavizar([[0, 0], [3.9, 0], [4.15, 0.25], [4.2, 0.8], [4.35, 9.0], [4.3, 9.15], [4.12, 9.1], [4.0, 8.9], [3.86, 1.6], [3.4, 1.4], [0, 1.45]], 2);
  const m = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.02, metalness: 0, transparent: true, opacity: 1, envMapIntensity: 1.6, specularIntensity: 1, ior: 1.5 });
  // vidro "fino": transparente com fresnel no alfa
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace('#include <opaque_fragment>', `
      float frv = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
      diffuseColor.a = clamp(0.06 + pow(frv, 2.5) * 0.9, 0.0, 1.0);
      #include <opaque_fragment>`);
  };
  m.side = THREE.DoubleSide; m.depthWrite = false;
  const vid = new THREE.Mesh(lathe(ext, 180), m);
  vid.renderOrder = 5;
  g.add(vid);
  const fundo = new THREE.Mesh(lathe([[0, 0.02], [3.85, 0.02], [3.85, 1.35], [0, 1.4]], 120), vidro({ cor: '#ffffff', atenua: '#fff1df', dist: 20 }));
  g.add(fundo);
  if (liq) {
    const nivel = 4.6;
    const l = new THREE.Mesh(lathe([[0, 1.5], [3.84, 1.5], [3.9, nivel], [0, nivel]], 160), liquido({ cor: '#3a1404', borda: '#e0852c', forca: 0.9, centro: 0.06 }));
    g.add(l);
  }
  const matGelo = new THREE.MeshPhysicalMaterial({
    color: '#2a1a12', roughness: 0.06, metalness: 0, transparent: true, envMapIntensity: 3, clearcoat: 1, clearcoatRoughness: 0.05,
    normalMap: tex(T.ruidoNormal(512, 40, 1.6, 77), false), normalScale: new THREE.Vector2(0.25, 0.25), depthWrite: false,
  });
  matGelo.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
      float frg = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
      diffuseColor.a = clamp(0.1 + pow(frg, 1.2) * 0.9, 0.0, 1.0);
      outgoingLight += vec3(1.0, 0.62, 0.3) * pow(frg, 2.5) * 0.9;
      #include <opaque_fragment>`);
  };
  const posicoes = [[-1.2, 4.3, 0.7, 0.3, 0.6, 0.2], [1.4, 4.5, -0.4, -0.4, 1.1, 0.5], [0.1, 6.0, 0.2, 0.9, 0.2, -0.6]];
  for (let i = 0; i < gelos; i++) {
    const [x, y, z, a, b, c] = posicoes[i];
    const cubo = new THREE.Mesh(new RoundedBoxGeometry(2.7, 2.6, 2.6, 6, 0.42), matGelo);
    cubo.renderOrder = 4;
    cubo.position.set(x, y, z); cubo.rotation.set(a, b, c);
    g.add(cubo);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ---------- Ambiente de estúdio (para reflexos) ---------- */
export function ambiente(renderer, luzes) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x000000);
  for (const l of luzes) {
    const geo = new THREE.PlaneGeometry(l.w, l.h);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(l.cor).multiplyScalar(l.i), side: THREE.DoubleSide });
    const p = new THREE.Mesh(geo, mat);
    p.position.set(...l.pos);
    p.lookAt(0, l.alvo ?? 15, 0);
    s.add(p);
  }
  const pm = new THREE.PMREMGenerator(renderer);
  const env = pm.fromScene(s, 0.02).texture;
  pm.dispose();
  return env;
}

/* ---------- Superfícies ---------- */
export function pisoEspelho(cor = '#090909', opac = 0.86, tam = 400) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(tam, tam), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: opac, depthWrite: true, toneMapped: false }));
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 10;
  return m;
}

export function refletir(obj) {
  const r = obj.clone(true);
  r.scale.y = -1;
  return r;
}

export function mesaMadeira({ tam = [120, 60], tom, escuro = 0, seed = 11, rep = [1, 1] } = {}) {
  const { cor, rug } = T.madeira({ tom, escuro, seed, tabuas: 6 });
  const m = new THREE.MeshStandardMaterial({ map: tex(cor, true, rep), roughnessMap: tex(rug, false, rep), roughness: 1, envMapIntensity: 0.5 });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(tam[0], tam[1]), m);
  p.rotation.x = -Math.PI / 2;
  p.receiveShadow = true;
  return p;
}

export function barril() {
  const g = new THREE.Group();
  const { cor, rug } = T.tampoBarril(2048);
  const tampo = new THREE.Mesh(new THREE.CircleGeometry(30, 200), new THREE.MeshStandardMaterial({ map: tex(cor), roughnessMap: tex(rug, false), roughness: 1, bumpMap: tex(rug, false), bumpScale: 4 }));
  g.add(tampo);
  // aro de ferro com rebites
  const ferro = new THREE.MeshPhysicalMaterial({ color: '#2a2422', metalness: 1, roughness: 0.42, normalMap: tex(T.ruidoNormal(512, 8, 3, 31), false, [8, 1]), normalScale: new THREE.Vector2(0.8, 0.8) });
  const aro = new THREE.Mesh(new THREE.TorusGeometry(31.2, 1.6, 32, 240), ferro);
  aro.scale.z = 0.5;
  g.add(aro);
  const anel = new THREE.Mesh(new THREE.CylinderGeometry(32.4, 32.4, 6, 240, 1, true), ferro);
  anel.rotation.x = Math.PI / 2; anel.position.z = -2.6;
  g.add(anel);
  const rebite = new THREE.SphereGeometry(0.75, 24, 16);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r = new THREE.Mesh(rebite, new THREE.MeshPhysicalMaterial({ color: '#6a5a50', metalness: 1, roughness: 0.3 }));
    r.position.set(Math.cos(a) * 32.4, Math.sin(a) * 32.4, 0.6);
    r.scale.z = 0.6;
    g.add(r);
  }
  return g;
}

export { THREE };
