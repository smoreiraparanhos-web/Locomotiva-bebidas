import { THREE, garrafa, copo, ambiente, mesaMadeira } from './cena.js';
import { laranja, ramo, taca, respingo, brilhos, caixa, fumaca, alambique } from './cena2.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
function spot(cor, i, pos, alvo, ang = 0.5, pen = 0.6, sombra = false) {
  const s = new THREE.SpotLight(cor, i / 150, 0, ang, pen, 0);
  s.position.copy(pos); s.target.position.copy(alvo);
  if (sombra) { s.castShadow = true; s.shadow.mapSize.set(2048, 2048); s.shadow.bias = -0.0004; s.shadow.radius = 8; s.shadow.blurSamples = 16; }
  return [s, s.target];
}
const ESTUDIO_QUENTE = [
  { w: 30, h: 40, pos: [-40, 30, 30], cor: '#ffc890', i: 1.6 },
  { w: 3, h: 50, pos: [30, 16, 16], cor: '#fff2e2', i: 6 },
  { w: 10, h: 50, pos: [-6, 16, -40], cor: '#ffa050', i: 3 },
  { w: 40, h: 8, pos: [0, 60, 0], cor: '#ffffff', i: 0.8 },
];

function copoComLaranja() {
  const g = new THREE.Group();
  g.add(copo());
  const l = laranja(2.4, 0.4);
  l.rotation.set(Math.PI / 2 - 0.25, 0, 0.5);
  l.position.set(2.6, 9.2, 1.4);
  g.add(l);
  return g;
}

function cenaMesa(scene, renderer, { tom = [70, 38, 20], escuro = 0.25, neblina = '#080605', env = ESTUDIO_QUENTE } = {}) {
  renderer.toneMappingExposure = 0.95;
  scene.environment = ambiente(renderer, env);
  const mesa = mesaMadeira({ tom, escuro: Math.min(0.7, escuro + 0.3), seed: 31, tam: [220, 120] });
  scene.add(mesa);
  scene.fog = new THREE.Fog(neblina, 70, 120);
}

export const TOMADAS2 = {
  /* ---------- Abertura: três slides ---------- */
  slideCaldeira: {
    w: 2200, h: 1240, fundo: '#080605',
    montar(scene, renderer) {
      cenaMesa(scene, renderer);
      const b = garrafa('caldeira'); b.position.set(8, 0, 0); b.rotation.y = -0.15; scene.add(b);
      const c = copoComLaranja(); c.position.set(19, 0, 7); c.scale.setScalar(1.05); scene.add(c);
      const r1 = ramo({ comp: 26, folhas: 22, seed: 5 }); r1.position.set(15, 0, -12); r1.rotation.z = -0.25; scene.add(r1);
      const r2 = ramo({ comp: 20, folhas: 16, seed: 8, cor: '#284d18' }); r2.position.set(-1, 0, -10); r2.rotation.z = 0.35; scene.add(r2);
      const l2 = laranja(2.4, 0.4); l2.rotation.set(Math.PI / 2 - 0.05, 0, 0); l2.position.set(23.5, 0.25, 11); scene.add(l2);
      scene.add(brilhos({ centro: [12, 1.5, 6], area: [50, 2, 24], n: 160 }));
      scene.add(brilhos({ centro: [12, 16, -6], area: [50, 30, 20], n: 90, seed: 3 }));
      scene.add(...spot('#ffc080', 420, V(-20, 70, 30), V(12, 10, 0), 0.3, 0.9, true));
      scene.add(...spot('#ff9a40', 900, V(12, 16, -50), V(10, 20, 0), 0.16, 0.8));
      scene.add(...spot('#ffe2c0', 380, V(-30, 26, 70), V(12, 13, 0), 0.16, 0.9));
      scene.add(...spot('#fff0e0', 160, V(50, 26, 40), V(16, 8, 0), 0.2, 0.9));
      const cam = new THREE.PerspectiveCamera(26, this.w / this.h, 1, 1000);
      cam.position.set(4.5, 14.5, 72); cam.lookAt(4.5, 13.6, 0);
      return cam;
    },
  },
  slideFornalha: {
    w: 2200, h: 1240, fundo: '#070505',
    montar(scene, renderer) {
      cenaMesa(scene, renderer, { tom: [55, 30, 18], escuro: 0.4, neblina: '#070505', env: [
        { w: 5, h: 60, pos: [-30, 16, 0], cor: '#ff2a1a', i: 12 }, { w: 3, h: 50, pos: [34, 20, 20], cor: '#ffe0c8', i: 5 }, { w: 40, h: 10, pos: [0, 60, 0], cor: '#ffffff', i: 0.6 }] });
      const b = garrafa('fornalha'); b.position.set(9, 0, 0); b.rotation.y = -0.3; scene.add(b);
      const c = copo(); c.position.set(20, 0, 7); scene.add(c);
      scene.add(fumaca({ centro: [12, 22, -14], n: 5, opac: 0.03 }));
      scene.add(brilhos({ centro: [14, 14, -2], area: [44, 30, 20], n: 120, cor: '#ff7a4a' }));
      scene.add(...spot('#ff2a10', 1500, V(-30, 24, 4), V(10, 14, 0), 0.4, 0.7));
      scene.add(...spot('#ffd8b0', 300, V(30, 40, 60), V(12, 12, 0), 0.16, 0.9, true));
      scene.add(...spot('#ff5020', 700, V(12, 16, -50), V(10, 20, 0), 0.16, 0.8));
      const cam = new THREE.PerspectiveCamera(26, this.w / this.h, 1, 1000);
      cam.position.set(4.5, 14.5, 72); cam.lookAt(4.5, 13.6, 0);
      return cam;
    },
  },
  slideNoturno: {
    w: 2200, h: 1240, fundo: '#07080a',
    montar(scene, renderer) {
      cenaMesa(scene, renderer, { tom: [60, 40, 26], escuro: 0.35, neblina: '#07080a', env: [
        { w: 40, h: 60, pos: [0, 30, -50], cor: '#e8eef5', i: 1.4 }, { w: 3, h: 50, pos: [-28, 16, 18], cor: '#ffffff', i: 6 }, { w: 3, h: 50, pos: [30, 16, 18], cor: '#ffd9a0', i: 5 }] });
      const b = garrafa('noturno'); b.position.set(8, 0, 0); b.rotation.y = 0.05; scene.add(b);
      const t = taca({ cor: '#d9a050' }); t.position.set(20, 0, 6); t.scale.setScalar(1.25); scene.add(t);
      const r1 = ramo({ comp: 24, folhas: 20, seed: 11 }); r1.position.set(-2, 0, -10); r1.rotation.z = 0.3; scene.add(r1);
      scene.add(brilhos({ centro: [12, 16, -4], area: [50, 30, 20], n: 140, cor: '#ffe2a8' }));
      scene.add(...spot('#ffe0c0', 140, V(0, 70, 30), V(12, 14, 0), 0.16, 0.8, true));
      scene.add(...spot('#fff0e0', 380, V(-30, 26, 70), V(12, 13, 0), 0.16, 0.9));
      scene.add(...spot('#cfe0f0', 500, V(10, 18, -50), V(10, 22, 0), 0.16, 0.8));
      scene.add(...spot('#ffc070', 300, V(40, 20, 30), V(18, 10, 0), 0.3, 0.9));
      const cam = new THREE.PerspectiveCamera(26, this.w / this.h, 1, 1000);
      cam.position.set(4.5, 14.5, 72); cam.lookAt(4.5, 13.6, 0);
      return cam;
    },
  },

  /* ---------- Cards de produto ---------- */
  cardCaldeira: card('caldeira'),
  cardFornalha: card('fornalha'),
  cardNoturno: card('noturno'),
  cardTrio: {
    w: 900, h: 1150, fundo: '#151313',
    montar(scene, renderer) {
      fundoCard(scene, renderer);
      const tipos = ['fornalha', 'caldeira', 'noturno'];
      tipos.forEach((t, i) => { const b = garrafa(t); b.scale.setScalar(0.56); b.position.set((i - 1) * 6.2, 0, i === 1 ? 2 : 0); b.rotation.y = (i - 1) * -0.25; scene.add(b); });
      const cam = new THREE.PerspectiveCamera(22, this.w / this.h, 1, 1000);
      cam.position.set(0, 9, 62); cam.lookAt(0, 8.6, 0);
      return cam;
    },
  },

  /* ---------- Categorias ---------- */
  catClassicos: {
    w: 1200, h: 820, fundo: '#080605',
    montar(scene, renderer) {
      cenaMesa(scene, renderer);
      const b = garrafa('caldeira'); b.position.set(-4, 0, -2); scene.add(b);
      const c = copoComLaranja(); c.position.set(6, 0, 5); scene.add(c);
      scene.add(...spot('#ffc080', 800, V(-30, 50, 40), V(0, 8, 0), 0.4, 0.8, true));
      scene.add(...spot('#ff9a40', 900, V(2, 16, -50), V(0, 20, 0), 0.16, 0.8));
      scene.add(...spot('#ffe2c0', 380, V(-20, 24, 60), V(1, 12, 0), 0.2, 0.9));
      const cam = new THREE.PerspectiveCamera(26, this.w / this.h, 1, 1000);
      cam.position.set(0, 13, 64); cam.lookAt(1, 11, 0);
      return cam;
    },
  },
  catDefumados: {
    w: 1200, h: 820, fundo: '#070505',
    montar(scene, renderer) {
      cenaMesa(scene, renderer, { tom: [50, 28, 16], escuro: 0.45, neblina: '#070505', env: [{ w: 5, h: 60, pos: [-30, 16, 0], cor: '#ff2a1a', i: 12 }, { w: 3, h: 50, pos: [30, 20, 20], cor: '#ffe0c8', i: 4 }] });
      const b = garrafa('fornalha'); b.position.set(-3, 0, 0); b.rotation.y = -0.4; scene.add(b);
      const c = copo({ gelos: 1 }); c.position.set(7, 0, 5); scene.add(c);
      scene.add(fumaca({ centro: [2, 16, -8], n: 6, opac: 0.1 }));
      scene.add(...spot('#ff2a10', 1500, V(-30, 24, 4), V(0, 14, 0), 0.4, 0.7));
      scene.add(...spot('#ffd8b0', 300, V(30, 40, 60), V(2, 12, 0), 0.2, 0.9, true));
      const cam = new THREE.PerspectiveCamera(26, this.w / this.h, 1, 1000);
      cam.position.set(0, 13, 64); cam.lookAt(1, 11, 0);
      return cam;
    },
  },
  catCoqueteis: {
    w: 1200, h: 820, fundo: '#090605',
    montar(scene, renderer) {
      cenaMesa(scene, renderer, { tom: [80, 46, 24], escuro: 0.2 });
      const t1 = taca({ cor: '#e8a43a' }); t1.position.set(-7, 0, 0); scene.add(t1);
      const t2 = taca({ cor: '#c22a1e' }); t2.position.set(4, 0, -4); t2.scale.setScalar(1.05); scene.add(t2);
      const c = copoComLaranja(); c.position.set(10, 0, 6); c.scale.setScalar(0.85); scene.add(c);
      const l = laranja(2.2, 0.4); l.rotation.set(Math.PI / 2 - 0.4, 0, -0.3); l.position.set(-3.5, 10.5, 1); scene.add(l);
      const r = ramo({ comp: 9, folhas: 10, seed: 13 }); r.position.set(-1, 0.3, 7); r.rotation.set(-1.45, 0, 0.8); scene.add(r);
      scene.add(brilhos({ centro: [0, 10, 0], area: [40, 20, 16], n: 80 }));
      scene.add(...spot('#ffc890', 800, V(-20, 50, 40), V(0, 6, 0), 0.4, 0.8, true));
      scene.add(...spot('#ff9a40', 900, V(0, 24, -50), V(0, 10, 0), 0.4, 0.8));
      const cam = new THREE.PerspectiveCamera(26, this.w / this.h, 1, 1000);
      cam.position.set(1, 13, 46); cam.lookAt(1.5, 7.5, 0);
      return cam;
    },
  },
  catPresente: {
    w: 1200, h: 820, fundo: '#080707',
    montar(scene, renderer) {
      cenaMesa(scene, renderer, { tom: [60, 34, 20], escuro: 0.35 });
      const cx = caixa(); cx.position.set(-8, 0, -4); scene.add(cx);
      const b1 = garrafa('caldeira'); b1.position.set(-15, 1, -5); scene.add(b1);
      const b2 = garrafa('noturno'); b2.position.set(-3, 1, -5); scene.add(b2);
      scene.add(brilhos({ centro: [0, 12, 0], area: [60, 26, 20], n: 90 }));
      scene.add(...spot('#ffd0a0', 900, V(-10, 60, 50), V(0, 10, 0), 0.4, 0.8, true));
      scene.add(...spot('#ff9a40', 700, V(0, 24, -50), V(0, 14, 0), 0.5, 0.8));
      const cam = new THREE.PerspectiveCamera(30, this.w / this.h, 1, 1000);
      cam.position.set(4, 18, 82); cam.lookAt(2, 14, 0);
      return cam;
    },
  },

  alambique: {
    w: 1600, h: 1000, fundo: '#070504',
    montar(scene, renderer) {
      renderer.toneMappingExposure = 1.0;
      scene.environment = ambiente(renderer, [
        { w: 40, h: 30, pos: [-40, 40, 30], cor: '#ffc890', i: 2.2 },
        { w: 4, h: 60, pos: [40, 20, 20], cor: '#fff0e0', i: 6 },
        { w: 30, h: 50, pos: [0, 20, -50], cor: '#ff9040', i: 2.5 },
        { w: 60, h: 10, pos: [0, -20, 40], cor: '#ffb070', i: 1 },
      ]);
      const a1 = alambique(); a1.position.set(-14, 0, 0); scene.add(a1);
      const a2 = alambique(); a2.position.set(20, 0, -16); a2.rotation.y = 0.5; a2.scale.setScalar(0.9); scene.add(a2);
      const piso = mesaMadeira({ tom: [40, 24, 14], escuro: 0.5, seed: 7, tam: [300, 200] }); scene.add(piso);
      scene.add(...spot('#ffb070', 1200, V(-40, 70, 40), V(-6, 14, 0), 0.4, 0.8, true));
      scene.add(...spot('#ff8a30', 1000, V(10, 30, -60), V(0, 22, 0), 0.4, 0.8));
      scene.fog = new THREE.Fog('#070504', 70, 160);
      const cam = new THREE.PerspectiveCamera(34, this.w / this.h, 1, 1000);
      cam.position.set(-2, 15, 84); cam.lookAt(0, 19, 0);
      return cam;
    },
  },

  /* ---------- Faixa de coquetéis: taças brindando com respingos ---------- */
  brinde: {
    w: 2200, h: 900, fundo: '#070505',
    montar(scene, renderer) {
      scene.environment = ambiente(renderer, [
        { w: 3, h: 30, pos: [-20, 12, 10], cor: '#ffffff', i: 9, alvo: 10 },
        { w: 30, h: 30, pos: [0, 10, -40], cor: '#ffb060', i: 2.4, alvo: 10 },
        { w: 3, h: 30, pos: [22, 12, 6], cor: '#ffd9a0', i: 6, alvo: 10 },
      ]);
      const t1 = taca({ cor: '#e0a24a', nivel: 0.7 }); t1.position.set(-6.2, 0, 0); t1.rotation.z = 0.22; scene.add(t1);
      const t2 = taca({ cor: '#e0a24a', nivel: 0.7 }); t2.position.set(6.2, 0, 0); t2.rotation.z = -0.22; scene.add(t2);
      scene.add(respingo({ centro: [0, 11.2, 0], raio: 8, n: 90 }));
      scene.add(brilhos({ centro: [0, 10, -4], area: [60, 26, 16], n: 120 }));
      const chao = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: '#050404', roughness: 0.6, metalness: 0 }));
      chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true;
      scene.add(...spot('#ffb060', 1600, V(0, 22, -40), V(0, 11, 0), 0.3, 0.6));
      scene.add(...spot('#ffffff', 300, V(-30, 30, 30), V(0, 8, 0), 0.4, 0.8));
      const cam = new THREE.PerspectiveCamera(24, this.w / this.h, 1, 1000);
      cam.position.set(16, 12, 62); cam.lookAt(16, 8.5, 0);
      return cam;
    },
  },
};

function fundoCard(scene, renderer) {
  scene.environment = ambiente(renderer, [
    { w: 3, h: 50, pos: [-26, 16, 18], cor: '#ffffff', i: 6 },
    { w: 3, h: 50, pos: [26, 16, 18], cor: '#ffe0b0', i: 5 },
    { w: 20, h: 40, pos: [0, 16, -40], cor: '#ffb070', i: 2 },
    { w: 30, h: 8, pos: [0, 60, 10], cor: '#ffffff', i: 1 },
  ]);
  const parede = new THREE.Mesh(new THREE.PlaneGeometry(300, 200), new THREE.MeshStandardMaterial({ color: '#1a1716', roughness: 1 }));
  parede.position.z = -30; parede.receiveShadow = true; scene.add(parede);
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: '#0f0d0c', roughness: 0.8 }));
  chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; scene.add(chao);
  scene.add(...spot('#fff0dc', 600, V(-10, 70, 30), V(0, 14, 0), 0.16, 0.9, true));
  scene.add(...spot('#ffb070', 500, V(0, 30, -28), V(0, 14, 0), 0.6, 0.9));
  scene.fog = new THREE.Fog('#151313', 70, 140);
}

function card(tipo) {
  return {
    w: 900, h: 1150, fundo: '#151313',
    montar(scene, renderer) {
      fundoCard(scene, renderer);
      const b = garrafa(tipo); b.rotation.y = tipo === 'fornalha' ? -0.25 : 0.1; scene.add(b);
      const cam = new THREE.PerspectiveCamera(22, this.w / this.h, 1, 1000);
      cam.position.set(0, 15, 84); cam.lookAt(0, 13.2, 0);
      return cam;
    },
  };
}
