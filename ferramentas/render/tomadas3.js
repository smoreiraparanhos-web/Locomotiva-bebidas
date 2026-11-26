import { THREE, garrafa, copo, ambiente } from './cena.js';
import { laranja, ramo, taca, brilhos } from './cena2.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const suave = (t) => t * t * (3 - 2 * t);

function spot(cor, i, pos, alvo, ang = 0.5, pen = 0.6) {
  const s = new THREE.SpotLight(cor, i / 150, 0, ang, pen, 0);
  s.position.copy(pos); s.target.position.copy(alvo);
  return [s, s.target];
}

function luzEstudio(scene, renderer, alvo = V(0, 12, 0)) {
  renderer.toneMappingExposure = 1.05;
  scene.environment = ambiente(renderer, [
    { w: 3, h: 50, pos: [-28, 16, 20], cor: '#ffffff', i: 7, alvo: alvo.y },
    { w: 3, h: 50, pos: [30, 16, 18], cor: '#ffd6b0', i: 6, alvo: alvo.y },
    { w: 30, h: 40, pos: [0, 20, -40], cor: '#ffb070', i: 2.4, alvo: alvo.y },
    { w: 40, h: 10, pos: [0, 60, 10], cor: '#ffffff', i: 1.2, alvo: alvo.y },
  ]);
  scene.add(...spot('#fff0e0', 700, V(-30, 40, 60), alvo, 0.3, 0.9));
  scene.add(...spot('#ffa050', 900, V(10, 20, -50), alvo, 0.35, 0.8));
  scene.add(...spot('#ff3a2a', 500, V(40, 20, 10), alvo, 0.35, 0.8));
}

const matLiquido = () => {
  const m = new THREE.MeshPhysicalMaterial({ color: '#7a3a0e', roughness: 0.04, clearcoat: 1, emissive: '#c26a1c', emissiveIntensity: 0.55 });
  return m;
};

function copoComLaranja() {
  const g = new THREE.Group();
  g.add(copo());
  const l = laranja(2.4, 0.4);
  l.rotation.set(Math.PI / 2 - 0.25, 0, 0.5);
  l.position.set(2.6, 9.2, 1.4);
  g.add(l);
  return g;
}

function alfaUnico(w, h, montarObjeto, cam) {
  return {
    w, h, fundo: '#000000',
    montar(scene, renderer) {
      luzEstudio(scene, renderer, V(0, cam.alvo[1], 0));
      scene.add(montarObjeto());
      const c = new THREE.PerspectiveCamera(cam.fov ?? 24, w / h, 0.5, 1000);
      c.position.set(...cam.pos); c.lookAt(...cam.alvo);
      return c;
    },
  };
}

export const TOMADAS3 = {
  /* Garrafa despejando no copo: quadro f de 0 a 47 */
  servir: {
    w: 1100, h: 1100, fundo: '#000000',
    montar(scene, renderer, alfa, f) {
      const F = 47, t = f / F;
      luzEstudio(scene, renderer, V(-2, 14, 0));

      // inclinação e subida da garrafa
      const tInc = suave(limitar(t / 0.42));
      const ang = tInc * 2.12 + limitar((t - 0.42) / 0.58) * 0.12;
      const pivo = new THREE.Group();
      pivo.position.set(-8.5 + tInc * 1.2, 13 + tInc * 9.5, 0);
      pivo.rotation.z = -ang;
      const b = garrafa('caldeira');
      b.position.y = -13;
      b.rotation.y = -0.2;
      pivo.add(b);
      scene.add(pivo);
      scene.updateMatrixWorld(true);

      // copo e nível
      const xCopo = 6;
      const inicioJato = 0.4;
      const tJato = limitar((t - inicioJato) / (1 - inicioJato));
      const nivel = 1.5 + suave(tJato) * 4.4;
      const c = copo({ nivel, deslocGelo: -1.6 + suave(tJato) * 2.0, gelos: 2 });
      c.position.x = xCopo;
      scene.add(c);

      // jato de whisky
      if (t >= inicioJato) {
        const boca = b.localToWorld(V(0, 27.4, 0));
        const eixo = V(0, 1, 0).applyQuaternion(b.getWorldQuaternion(new THREE.Quaternion())).normalize();
        const alvo = V(xCopo + 0.6, nivel, 0.2);
        const cresce = limitar((t - inicioJato) / 0.08);
        const pts = [];
        const p0 = boca.clone().add(eixo.clone().multiplyScalar(0.3));
        const v0 = eixo.clone().multiplyScalar(2.2);
        // parábola até o alvo
        for (let i = 0; i <= 24; i++) {
          const s = i / 24;
          const x = p0.x + (alvo.x - p0.x) * s;
          const y = p0.y + v0.y * s - (p0.y + v0.y - alvo.y) * s * s;
          const z = p0.z + (alvo.z - p0.z) * s;
          pts.push(V(x + v0.x * s * (1 - s) * 0.8, y, z));
        }
        const n = Math.max(2, Math.round(pts.length * cresce));
        const curva = new THREE.CatmullRomCurve3(pts.slice(0, n));
        const jato = new THREE.Mesh(new THREE.TubeGeometry(curva, 80, 0.26, 20), matLiquido());
        scene.add(jato);
        // respingos no impacto
        if (cresce >= 1) {
          let sd = f * 97 + 13; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
          const mat = matLiquido();
          for (let i = 0; i < 14; i++) {
            const gota = new THREE.Mesh(new THREE.SphereGeometry(0.12 + r() * 0.18, 12, 8), mat);
            const a = r() * Math.PI * 2, d = 0.6 + r() * 1.6;
            gota.position.set(alvo.x + Math.cos(a) * d, alvo.y + r() * 1.4, alvo.z + Math.sin(a) * d * 0.6);
            scene.add(gota);
          }
        }
      }
      const cam = new THREE.PerspectiveCamera(24, 1, 1, 1000);
      cam.position.set(-2, 19.5, 116); cam.lookAt(-2, 18.5, 0);
      return cam;
    },
  },

  /* Garrafas com fundo transparente */
  garCaldeira: alfaUnico(900, 1200, () => { const b = garrafa('caldeira'); b.rotation.y = -0.15; return b; }, { pos: [0, 15, 82], alvo: [0, 13.6, 0] }),
  garFornalha: alfaUnico(900, 1200, () => { const b = garrafa('fornalha'); b.rotation.y = -0.3; return b; }, { pos: [0, 15, 82], alvo: [0, 13.6, 0] }),
  garNoturno: alfaUnico(900, 1200, () => { const b = garrafa('noturno'); b.rotation.y = 0.1; return b; }, { pos: [0, 15, 82], alvo: [0, 13.6, 0] }),

  /* Drinks com fundo transparente */
  drinkOld: alfaUnico(1000, 1000, () => copoComLaranja(), { pos: [0, 9, 30], alvo: [0, 5.6, 0], fov: 28 }),
  drinkBrasa: alfaUnico(1000, 1000, () => {
    const g = new THREE.Group();
    g.add(taca({ cor: '#7a1a10', nivel: 0.8 }));
    const casca = laranja(1.8, 0.3); casca.rotation.set(Math.PI / 2 - 0.6, 0, 0.9); casca.position.set(3.6, 10.6, 1); g.add(casca);
    return g;
  }, { pos: [0, 10, 34], alvo: [0, 6.4, 0], fov: 28 }),
  drinkEstacao: alfaUnico(1000, 1000, () => {
    const g = new THREE.Group();
    g.add(taca({ cor: '#e8b44a', nivel: 0.85 }));
    g.add(brilhos({ centro: [0, 9.4, 0], area: [6, 1.8, 3], n: 70, cor: '#ffffff', seed: 21 }));
    const f = ramo({ comp: 4, folhas: 6, seed: 4 }); f.position.set(-2.6, 10.1, 0.8); f.rotation.set(0, 0, -1.2); f.scale.setScalar(0.8); g.add(f);
    return g;
  }, { pos: [0, 10, 34], alvo: [0, 6.4, 0], fov: 28 }),

  /* Decorações soltas */
  decGelo: alfaUnico(600, 600, () => {
    const m = new THREE.MeshPhysicalMaterial({ color: '#dfeef5', roughness: 0.08, transparent: true, clearcoat: 1, envMapIntensity: 2.5, depthWrite: false });
    m.onBeforeCompile = (s) => { s.fragmentShader = s.fragmentShader.replace('#include <opaque_fragment>', `
      float fr = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition)));
      diffuseColor.a = clamp(0.62 + pow(fr, 1.2) * 0.38, 0.0, 1.0);
      outgoingLight += vec3(0.85, 0.93, 1.0) * (0.18 + pow(fr, 2.0) * 0.5);
      #include <opaque_fragment>`); };
    const g = new THREE.Group();
    const c = new THREE.Mesh(new RoundedBoxGeometry(3, 3, 3, 6, 0.5), m); c.rotation.set(0.5, 0.7, 0.2); c.position.y = 6; g.add(c);
    return g;
  }, { pos: [0, 6, 14], alvo: [0, 6, 0], fov: 28 }),
  decLaranja: alfaUnico(600, 600, () => { const l = laranja(2.6, 0.45); l.rotation.set(Math.PI / 2 - 0.5, 0.3, 0.4); l.position.y = 6; return l; }, { pos: [0, 6, 14], alvo: [0, 6, 0], fov: 30 }),
  decFolha: alfaUnico(600, 600, () => { const r = ramo({ comp: 8, folhas: 9, seed: 6 }); r.position.set(0, 2, 0); r.rotation.z = -0.5; return r; }, { pos: [1, 6, 16], alvo: [1, 6, 0], fov: 32 }),
};
