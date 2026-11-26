import { THREE, garrafa, copo, ambiente, pisoEspelho, refletir, mesaMadeira, barril } from './cena.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

function spot(cor, i, pos, alvo, ang = 0.5, pen = 0.6, sombra = false) {
  const s = new THREE.SpotLight(cor, i / 150, 0, ang, pen, 0);
  s.position.copy(pos); s.target.position.copy(alvo);
  if (sombra) { s.castShadow = true; s.shadow.mapSize.set(2048, 2048); s.shadow.bias = -0.0004; s.shadow.radius = 6; s.shadow.blurSamples = 16; }
  return [s, s.target];
}

// Iluminação de estúdio padrão: faixa vermelha à esquerda, faixa clara à direita, caixa alta
const LUZ_HERO = [
  { w: 6, h: 60, pos: [-34, 16, 8], cor: '#ff2a2a', i: 9 },
  { w: 3.2, h: 54, pos: [30, 16, 18], cor: '#fff1e2', i: 6 },
  { w: 40, h: 20, pos: [0, 70, 10], cor: '#ffffff', i: 1.2 },
  { w: 10, h: 40, pos: [12, 16, -40], cor: '#ff5a3a', i: 3 },
];

export const TOMADAS = {
  hero: {
    w: 1500, h: 2000, fundo: '#090909',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, LUZ_HERO);
      const b = garrafa('caldeira');
      b.rotation.y = -0.18;
      scene.add(b);
      if (!alfa) scene.add(refletir(b), pisoEspelho('#090909', 0.84));
      scene.add(...spot('#ff2d2d', 500, V(-40, 26, 6), V(0, 12, 0), 0.35, 0.8));
      scene.add(...spot('#ffe7cf', 160, V(26, 30, 34), V(0, 10, 0), 0.28, 0.9));
      scene.add(...spot('#ff4030', 500, V(6, 20, -40), V(0, 14, 0), 0.4, 0.7));
      const cam = new THREE.PerspectiveCamera(22, this.w / this.h, 1, 1000);
      cam.position.set(0, 16, 88); cam.lookAt(0, 12.6, 0);
      return cam;
    },
  },

  silhueta: {
    w: 1600, h: 2000, fundo: '#090909',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, [
        { w: 4, h: 70, pos: [-26, 16, -14], cor: '#ff1f1f', i: 14 },
        { w: 4, h: 70, pos: [26, 16, -14], cor: '#ff1f1f', i: 14 },
        { w: 30, h: 60, pos: [0, 16, -60], cor: '#a61920', i: 2.5 },
      ]);
      const b = garrafa('fornalha');
      scene.add(b);
      if (!alfa) scene.add(refletir(b), pisoEspelho('#090909', 0.9));
      scene.add(...spot('#ff2020', 1200, V(-30, 20, -30), V(0, 15, 0), 0.4, 0.8));
      scene.add(...spot('#ff2020', 1200, V(30, 20, -30), V(0, 15, 0), 0.4, 0.8));
      const cam = new THREE.PerspectiveCamera(20, this.w / this.h, 1, 1000);
      cam.position.set(0, 13.5, 104); cam.lookAt(0, 13.8, 0);
      return cam;
    },
  },

  vermelho: {
    w: 1800, h: 2200, fundo: '#8f1219',
    montar(scene, renderer, alfa) {
      renderer.toneMappingExposure = 0.8;
      scene.environment = ambiente(renderer, [
        { w: 50, h: 30, pos: [10, 80, 20], cor: '#ffffff', i: 2.2 },
        { w: 4, h: 50, pos: [34, 16, 16], cor: '#ffffff', i: 6 },
        { w: 80, h: 80, pos: [0, 10, -60], cor: '#c0141c', i: 0.9, alvo: 10 },
        { w: 80, h: 30, pos: [0, -30, 30], cor: '#a61920', i: 0.6 },
      ]);
      const b = garrafa('noturno');
      b.rotation.y = 0.35;
      scene.add(b);
      const chao = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: '#b01a22', roughness: 0.9 }));
      chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true;
      const parede = new THREE.Mesh(new THREE.PlaneGeometry(600, 400), new THREE.MeshStandardMaterial({ color: '#b01a22', roughness: 0.95 }));
      parede.position.z = -40; parede.receiveShadow = true;
      scene.add(chao, parede);
      const sol = new THREE.DirectionalLight('#fff3e6', 4.2);
      sol.position.set(-40, 60, 34); sol.castShadow = true;
      sol.shadow.mapSize.set(4096, 4096);
      Object.assign(sol.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 1, far: 300 });
      sol.shadow.bias = -0.0003; sol.shadow.radius = 3;
      scene.add(sol, new THREE.HemisphereLight('#ffd0c8', '#5a0a10', 1.4));
      const cam = new THREE.PerspectiveCamera(26, this.w / this.h, 1, 1000);
      cam.position.set(6, 20, 86); cam.lookAt(3, 11.5, 0);
      return cam;
    },
  },

  caldeira: {
    w: 1600, h: 2000, fundo: '#0b0807',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, [
        { w: 30, h: 50, pos: [-40, 30, 30], cor: '#ffb26a', i: 2.4 },
        { w: 3, h: 50, pos: [28, 16, 14], cor: '#fff0e0', i: 7 },
        { w: 8, h: 50, pos: [-10, 16, -40], cor: '#ff7a2a', i: 4 },
      ]);
      const b = garrafa('caldeira');
      b.rotation.y = 0.12;
      scene.add(b);
      const mesa = mesaMadeira({ tom: [70, 38, 20], seed: 12, tam: [160, 80], escuro: 0.1 });
      scene.add(mesa);
      scene.add(...spot('#ffcf9e', 420, V(-36, 50, 30), V(0, 12, 0), 0.3, 1.0, true));
      scene.add(...spot('#ff7a30', 900, V(14, 26, -44), V(0, 16, 0), 0.4, 0.8));
      scene.add(...spot('#fff0e0', 300, V(40, 20, 40), V(0, 14, 0), 0.3, 0.9));
      scene.fog = new THREE.Fog('#0b0807', 86, 130);
      const cam = new THREE.PerspectiveCamera(24, this.w / this.h, 1, 1000);
      cam.position.set(-8, 9, 86); cam.lookAt(0, 12.8, 0);
      return cam;
    },
  },

  fornalha: {
    w: 1600, h: 2000, fundo: '#070606',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, [
        { w: 5, h: 60, pos: [-30, 16, 0], cor: '#ff2a1a', i: 12 },
        { w: 3, h: 50, pos: [30, 20, 20], cor: '#ffe0c8', i: 5 },
        { w: 40, h: 10, pos: [0, 60, 0], cor: '#ffffff', i: 0.8 },
      ]);
      const b = garrafa('fornalha');
      b.rotation.y = -0.3;
      scene.add(b, refletir(b), pisoEspelho('#070606', 0.9));
      scene.add(...spot('#ff2a10', 1500, V(-40, 24, 0), V(0, 15, 0), 0.4, 0.7));
      scene.add(...spot('#ffe8d4', 600, V(20, 40, 50), V(0, 10, 0), 0.25, 0.9));
      const cam = new THREE.PerspectiveCamera(24, this.w / this.h, 1, 1000);
      cam.position.set(10, 11, 82); cam.lookAt(0, 13, 0);
      return cam;
    },
  },

  noturno: {
    w: 1600, h: 2000, fundo: '#0c0c0d',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, [
        { w: 40, h: 60, pos: [0, 30, -50], cor: '#e8eef5', i: 1.6 },
        { w: 3, h: 50, pos: [-28, 16, 18], cor: '#ffffff', i: 6 },
        { w: 3, h: 50, pos: [28, 16, 18], cor: '#ffffff', i: 5 },
        { w: 30, h: 10, pos: [0, 60, 20], cor: '#ffffff', i: 1 },
      ]);
      const b = garrafa('noturno');
      b.rotation.y = 0.05;
      scene.add(b);
      if (!alfa) scene.add(refletir(b), pisoEspelho('#0c0c0d', 0.86));
      scene.add(...spot('#fff4e8', 900, V(0, 70, 30), V(0, 10, 0), 0.22, 0.6, true));
      scene.add(...spot('#d8e4f0', 700, V(0, 30, -50), V(0, 16, 0), 0.5, 0.8));
      const cam = new THREE.PerspectiveCamera(24, this.w / this.h, 1, 1000);
      cam.position.set(0, 19, 84); cam.lookAt(0, 12, 0);
      return cam;
    },
  },

  rotulo: {
    w: 2000, h: 1300, fundo: '#090909',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, LUZ_HERO);
      const b = garrafa('caldeira');
      b.rotation.y = 0.32;
      scene.add(b);
      scene.add(...spot('#ffe4cc', 900, V(-30, 30, 40), V(0, 19, 0), 0.3, 0.8));
      scene.add(...spot('#ff2d2d', 900, V(30, 30, -10), V(0, 21, 0), 0.4, 0.8));
      const cam = new THREE.PerspectiveCamera(18, this.w / this.h, 1, 1000);
      cam.position.set(-3, 27.4, 30); cam.lookAt(0, 22, 0);
      return cam;
    },
  },

  copo: {
    w: 1800, h: 1400, fundo: '#070505',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, [
        { w: 2.5, h: 30, pos: [-18, 10, 8], cor: '#ffffff', i: 8, alvo: 5 },
        { w: 24, h: 24, pos: [0, 8, -30], cor: '#ff8a3a', i: 2.6, alvo: 5 },
        { w: 2.5, h: 30, pos: [18, 10, 4], cor: '#ff2a1a', i: 7, alvo: 5 },
        { w: 16, h: 4, pos: [0, 34, 6], cor: '#ffffff', i: 1, alvo: 5 },
      ]);
      const c = copo();
      scene.add(c);
      const mesa = mesaMadeira({ tom: [70, 38, 20], seed: 21, tam: [120, 80], escuro: 0.35 });
      scene.add(mesa);
      scene.add(...spot('#ffa050', 900, V(0, 16, -30), V(0, 4, 0), 0.32, 0.8, true));
      scene.add(...spot('#ff2a1a', 260, V(26, 8, 4), V(0, 5, 0), 0.4, 0.8));
      scene.add(...spot('#fff0e0', 90, V(-20, 20, 24), V(0, 5, 0), 0.35, 0.9));
      scene.fog = new THREE.Fog('#070505', 26, 60);
      const cam = new THREE.PerspectiveCamera(28, this.w / this.h, 0.5, 400);
      cam.position.set(0, 6.4, 23); cam.lookAt(0, 4.6, 0);
      return cam;
    },
  },

  luz: {
    w: 1800, h: 1400, fundo: '#070404',
    montar(scene, renderer) {
      scene.environment = ambiente(renderer, [
        { w: 30, h: 60, pos: [0, 14, -50], cor: '#ffb060', i: 3, alvo: 12 },
        { w: 2, h: 50, pos: [-26, 14, 10], cor: '#ffffff', i: 9, alvo: 12 },
        { w: 2, h: 50, pos: [24, 14, -4], cor: '#ff2a1a', i: 9, alvo: 12 },
      ]);
      const b = garrafa('caldeira');
      b.rotation.y = 2.2;
      scene.add(b);
      scene.add(...spot('#ffa040', 2400, V(0, 18, -50), V(0, 14, 0), 0.25, 0.6));
      scene.add(...spot('#ff2a1a', 500, V(30, 20, 0), V(0, 16, 0), 0.4, 0.8));
      const cam = new THREE.PerspectiveCamera(16, this.w / this.h, 1, 1000);
      cam.position.set(-14, 20, 46); cam.lookAt(0, 17.5, 0);
      return cam;
    },
  },

  madeira: {
    w: 1800, h: 1800, fundo: '#070505',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, [{ w: 30, h: 30, pos: [-40, 30, 30], cor: '#ffb070', i: 1 }]);
      const b = barril();
      b.rotation.set(-0.12, 0.25, 0.05);
      scene.add(b);
      scene.add(...spot('#ffb070', 2600, V(-90, 20, 18), V(0, 0, 0), 0.5, 0.9));
      scene.add(...spot('#ff2a1a', 800, V(60, -20, 20), V(0, 0, 0), 0.5, 0.9));
      const cam = new THREE.PerspectiveCamera(30, 1, 1, 1000);
      cam.position.set(4, 2, 70); cam.lookAt(-2, 4, 0);
      return cam;
    },
  },

  metal: {
    w: 1800, h: 1400, fundo: '#0a0a0b',
    montar(scene, renderer, alfa) {
      scene.environment = ambiente(renderer, [
        { w: 2.5, h: 30, pos: [-12, 27, 8], cor: '#ffffff', i: 10, alvo: 26 },
        { w: 2.5, h: 30, pos: [12, 27, 4], cor: '#ff3a2a', i: 8, alvo: 26 },
        { w: 30, h: 30, pos: [0, 60, -10], cor: '#ffffff', i: 2.2, alvo: 26 },
        { w: 20, h: 6, pos: [0, 30, 30], cor: '#ffffff', i: 1.2, alvo: 26 },
        { w: 40, h: 8, pos: [0, 25, 40], cor: '#ffe6d0', i: 0.7, alvo: 26 },
        { w: 30, h: 14, pos: [0, -6, 40], cor: '#fff0e4', i: 1.6, alvo: 26 },
        { w: 4, h: 12, pos: [-30, 25, -10], cor: '#ff2a1a', i: 6, alvo: 26 },
      ]);
      const b = garrafa('noturno');
      b.rotation.y = 0.4;
      scene.add(b);
      scene.add(...spot('#ffffff', 600, V(-10, 46, 20), V(0, 26, 0), 0.25, 0.8));
      const cam = new THREE.PerspectiveCamera(20, this.w / this.h, 1, 1000);
      cam.position.set(0, 38, 13); cam.lookAt(0, 25.6, 0);
      return cam;
    },
  },
};
