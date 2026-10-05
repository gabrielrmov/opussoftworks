// Cenas 3D (three.js) no papel das fotos de objeto da referência.
// Cada cena devolve { group, hero, view, fill, y, stars }:
//   hero  = parte que a câmera enquadra (o resto pode sangrar pra fora)
//   view  = direção da câmera; fill = diâmetro do herói / altura do quadro
//   y     = altura do centro do herói na tela (0 topo, 1 base)
//   stars = estrelas coral chapadas atrás do herói [dx, dy, dz, tamanho, giro] em unidades do herói
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const CORAL = 0xff6039;
const V = (x, y) => new THREE.Vector2(x, y);

// ---------- materiais ----------
const M = {
  coral:   () => new THREE.MeshPhysicalMaterial({ color: CORAL, roughness: .32, clearcoat: 1, clearcoatRoughness: .08 }),
  coralMetal: () => new THREE.MeshStandardMaterial({ color: CORAL, metalness: .85, roughness: .28 }),
  chrome:  () => new THREE.MeshStandardMaterial({ color: 0xf0f0f3, metalness: 1, roughness: .07 }),
  steel:   () => new THREE.MeshStandardMaterial({ color: 0xbdbdc2, metalness: 1, roughness: .22 }),
  black:   () => new THREE.MeshPhysicalMaterial({ color: 0x111113, roughness: .2, clearcoat: 1, clearcoatRoughness: .05 }),
  ceramic: () => new THREE.MeshPhysicalMaterial({ color: 0xf4f3f0, roughness: .38, clearcoat: .6, clearcoatRoughness: .2 }),
  glass:   (c = 0xffffff) => new THREE.MeshPhysicalMaterial({ color: c, transmission: 1, thickness: 1.2, roughness: 0, ior: 1.5, clearcoat: 1 }),
  matte:   (c, r = .7) => new THREE.MeshStandardMaterial({ color: c, roughness: r }),
  tex:     (map, r = .45) => new THREE.MeshStandardMaterial({ map, roughness: r }),
};

function mesh(geo, mat, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1 } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  typeof s === 'number' ? m.scale.setScalar(s) : m.scale.set(...s);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
const grp = (...c) => { const g = new THREE.Group(); c.forEach(o => g.add(o)); return g; };
const place = (o, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1 } = {}) => { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.scale.setScalar(s); return o; };
const lathe = (pts, seg = 96) => new THREE.LatheGeometry(pts.map(([x, y]) => V(x, y)), seg);
const rbox = (w, h, d, r, seg = 8) => new RoundedBoxGeometry(w, h, d, seg, r);
const extrude = (shape, depth, bevel = .04, curve = 32) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 6, curveSegments: curve });

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  return t;
}
const font = (px, w = 500, fam = 'Inter Tight') => `${w} ${px}px "${fam}"`;
const serif = px => `italic 400 ${px}px "Instrument Serif"`;

// ---------- peças reaproveitadas ----------
const PAWN = [[0,0],[.42,0],[.43,.05],[.4,.1],[.36,.13],[.36,.17],[.27,.22],[.19,.42],[.15,.6],[.25,.64],[.25,.69],[.13,.73],[.19,.8],[.22,.9],[.2,.99],[.14,1.06],[.06,1.1],[0,1.11]];
const KING = [[0,0],[.52,0],[.53,.06],[.48,.12],[.43,.15],[.43,.2],[.32,.27],[.22,.65],[.18,1.1],[.33,1.14],[.33,1.2],[.2,1.25],[.28,1.42],[.3,1.5],[.22,1.56],[0,1.58]];

function puzzleGeo(depth = .3) {
  const s = new THREE.Shape(), k = .17, n = .19;
  s.moveTo(0, 0); s.lineTo(.5 - n, 0); s.absarc(.5, 0, k, Math.PI, 0, true); s.lineTo(1, 0);
  s.lineTo(1, .5 - n); s.absarc(1, .5, k, -Math.PI / 2, Math.PI / 2, false); s.lineTo(1, 1);
  s.lineTo(.5 + n, 1); s.absarc(.5, 1, k, 0, Math.PI, false); s.lineTo(0, 1);
  s.lineTo(0, .5 + n); s.absarc(0, .5, k, Math.PI / 2, -Math.PI / 2, true); s.lineTo(0, 0);
  const g = extrude(s, depth, .045, 48); g.translate(-.5, -.5, 0); g.rotateX(-Math.PI / 2); return g;
}

function gearGeo(R, n, depth = .4) {
  const s = new THREE.Shape(), r0 = R * .84;
  for (let i = 0; i < n; i++) {
    const a = i * 2 * Math.PI / n, d = Math.PI / n;
    [[r0, a - d * .62], [R, a - d * .34], [R, a + d * .34], [r0, a + d * .62]].forEach(([r, t], k) =>
      (i === 0 && k === 0 ? s.moveTo : s.lineTo).call(s, Math.cos(t) * r, Math.sin(t) * r));
  }
  const h = new THREE.Path(); h.absarc(0, 0, R * .22, 0, Math.PI * 2, true); s.holes.push(h);
  for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5, p = new THREE.Path(); p.absarc(Math.cos(a) * R * .52, Math.sin(a) * R * .52, R * .13, 0, Math.PI * 2, true); s.holes.push(p); }
  const g = extrude(s, depth, .035, 24); g.translate(0, 0, -depth / 2); return g;
}

// ---------- cenas ----------
export const scenes = {
  // 1 — tabuleiro em close: o rei coral na frente, peões desfocados atrás
  chess() {
    const g = new THREE.Group();
    const dk = M.black(), lt = M.ceramic();
    for (let i = -5; i < 5; i++) for (let j = -7; j < 3; j++)
      g.add(mesh(new THREE.BoxGeometry(1, .14, 1), (i + j) & 1 ? dk : lt, { x: i + .5, y: -.07, z: j + .5 }));
    const king = grp(mesh(lathe(KING), M.coral()), mesh(rbox(.11, .4, .11, .03), M.coral(), { y: 1.74 }), mesh(rbox(.32, .11, .11, .03), M.coral(), { y: 1.8 }));
    place(king, { x: .5, z: .5, s: 1.2 }); g.add(king);
    const pc = M.chrome(), pg = M.glass(0xf8f8fa), pb = M.black();
    [[-1.5,-.5,pc],[1.5,-1.5,pg],[-.5,-2.5,pb],[2.5,-.5,pc],[-2.5,-2.5,pg],[.5,-3.5,pc],[-1.5,-4.5,pb],[2.5,-3.5,pg],[-3.5,-.5,pc],[1.5,1.5,pg]]
      .forEach(([x, z, m]) => g.add(mesh(lathe(PAWN), m, { x, z })));
    return { group: g, hero: king, view: [.15, .5, 1], fill: .5, y: .7, focus: king, stars: [[-1.15, .55, -1.5, .32, 10]] };
  },

  // 2 — o botão que vende: pílula coral "Quero comprar" e o cursor clicando
  button() {
    const g = new THREE.Group();
    const base = mesh(rbox(4.2, .5, 2, .25), M.ceramic(), { y: .25 });
    const btn = mesh(rbox(3.2, .55, 1.1, .27, 10), M.coral(), { y: .72 });
    const label = canvasTex(1600, 550, (c, w, h) => { c.fillStyle = '#fff'; c.font = font(190, 600); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Quero comprar', w / 2, h / 2 + 8); });
    const lab = mesh(new THREE.PlaneGeometry(3.0, 1.03), new THREE.MeshBasicMaterial({ map: label, transparent: true, toneMapped: false }), { y: 1.002, rx: -Math.PI / 2 });
    lab.castShadow = false;
    const cs = new THREE.Shape([V(0,0),V(0,-1.25),V(.3,-.95),V(.52,-1.42),V(.72,-1.33),V(.5,-.87),V(.9,-.87)]);
    const cursor = mesh(extrude(cs, .16, .05), M.chrome(), { x: 1.25, y: 1.5, z: .45, rx: -.95, ry: .1, rz: .45, s: .7 });
    const btnG = grp(base, btn, lab, cursor);
    g.add(btnG);
    return { group: g, hero: btnG, view: [-.08, .8, 1], fill: .8, y: .64, stars: [[.78, .55, -.6, .3, 15], [-.85, .3, -.4, .14, 0]] };
  },

  // 3 — quebra-cabeça: a última peça (coral) chegando no encaixe
  puzzle() {
    const g = new THREE.Group(), geo = puzzleGeo();
    const cer = M.ceramic(), blk = M.black();
    for (let x = -2; x <= 2; x++) for (let z = -3; z <= 1; z++) {
      if (x === 0 && z === 0) continue;
      g.add(mesh(geo, (x + z) % 3 === 0 ? blk : cer, { x, z }));
    }
    const piece = mesh(geo, M.coral(), { x: .12, y: .95, z: .25, rx: .42, ry: .28, rz: -.18 });
    g.add(piece);
    return { group: g, hero: g, heroBox: new THREE.Box3(new THREE.Vector3(-1.2, 0, -1.2), new THREE.Vector3(1.2, 1.4, 1.2)), view: [.3, 1.05, 1], fill: .74, y: .66, focus: piece, stars: [[1.05, .5, -.8, .3, 0]] };
  },

  // 4 — dados (sorte) x caixa de entrega coral
  dice() {
    const g = new THREE.Group();
    const die = (val, mat, pipMat) => {
      const d = grp(mesh(rbox(1, 1, 1, .15), mat));
      const L = { 1: [[0,0]], 2: [[-1,-1],[1,1]], 3: [[-1,-1],[0,0],[1,1]], 4: [[-1,-1],[1,1],[-1,1],[1,-1]], 5: [[-1,-1],[1,1],[-1,1],[1,-1],[0,0]], 6: [[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1]] };
      const sg = new THREE.SphereGeometry(.09, 32, 16);
      const put = (v, f, sc) => L[v].forEach(([a, b]) => { const m = mesh(sg, pipMat, { s: sc }); f(m.position, a * .26, b * .26); d.add(m); });
      put(val[0], (p, a, b) => p.set(a, .5, b), [1, .35, 1]);
      put(val[1], (p, a, b) => p.set(a, b, .5), [1, 1, .35]);
      put(val[2], (p, a, b) => p.set(.5, a, b), [.35, 1, 1]);
      return d;
    };
    g.add(place(die([5, 2, 3], M.ceramic(), M.black()), { x: -1.75, y: .5, z: .9, ry: .55 }));
    g.add(place(die([1, 6, 4], M.black(), M.ceramic()), { x: -2.3, y: .5, z: -.5, ry: -.35 }));
    const box = new THREE.Group(), kraft = M.matte(CORAL, .62), tape = M.matte(0xffc2b0, .35);
    box.add(mesh(rbox(2.3, 1.8, 1.8, .035, 3), kraft, { y: .9 }));
    box.add(mesh(new THREE.BoxGeometry(2.33, .012, .36), tape, { y: 1.806 }));
    box.add(mesh(new THREE.BoxGeometry(.36, 1.83, 1.83), tape, { y: .9 }));
    const label = canvasTex(640, 400, (c, w, h) => {
      c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#171717';
      c.font = font(34, 600); c.fillText('OPUS SOFTWORKS', 40, 70);
      c.font = serif(92); c.fillText('Entregue.', 40, 180);
      c.font = font(28, 400); c.fillText('Prazo: cumprido   Resultado: medido', 40, 240);
      for (let i = 0; i < 46; i++) c.fillRect(40 + i * 12, 280, i % 4 ? 5 : 9, 90);
    });
    box.add(mesh(new THREE.PlaneGeometry(.9, .56), M.tex(label, .6), { x: .62, y: .62, z: .906 }));
    place(box, { x: .55, z: .1, ry: -.42 }); g.add(box);
    return { group: g, hero: g, view: [.2, .5, 1], fill: .74, y: .68, stars: [[.75, .62, -.6, .26, 12]] };
  },

  // 5 — pilhas de moedas crescendo; a maior é coral
  coins() {
    const g = new THREE.Group(), geo = new THREE.CylinderGeometry(.5, .5, .09, 96);
    const st = M.chrome(), co = M.coralMetal();
    [4, 7, 10, 14, 19].forEach((n, i) => {
      for (let k = 0; k < n; k++) g.add(mesh(geo, i === 4 ? co : st, { x: (i - 2) * 1.08 + Math.sin(k * 7.1 + i) * .025, y: .045 + k * .093, z: -(i - 2) * .32 + Math.cos(k * 5.3) * .025, ry: k }));
    });
    g.add(mesh(geo, st, { x: -2.1, y: .045, z: 1.35, ry: .2 }));
    g.add(mesh(geo, st, { x: -1.4, y: .2, z: 1.6, rx: 1.15, rz: .3 }));
    return { group: g, hero: g, view: [.05, .5, 1], fill: 1.0, y: .66, stars: [[.55, .62, -.8, .22, 0]] };
  },

  // 6 — escada de 4 degraus com a esfera coral chegando no topo
  steps() {
    const g = new THREE.Group();
    const num = n => canvasTex(512, 512, c => { c.fillStyle = '#f4f3f0'; c.fillRect(0, 0, 512, 512); c.fillStyle = '#171717'; c.font = serif(300); c.textAlign = 'center'; c.fillText('0' + n, 256, 350); });
    [1, 2, 3, 4].forEach(n => {
      const h = .62 * n, x = (n - 2.5) * 1.05;
      g.add(mesh(rbox(1.04, h, 1.6, .06, 4), n === 4 ? M.black() : M.ceramic(), { x, y: h / 2 }));
      if (n < 4) g.add(mesh(new THREE.PlaneGeometry(.7, .7), M.tex(num(n), .4), { x, y: h - .45, z: .801 }));
    });
    g.add(mesh(new THREE.SphereGeometry(.36, 64, 48), M.coral(), { x: 1.55, y: 2.84 }));
    return { group: g, hero: g, view: [-.22, .42, 1], fill: .74, y: .62, stars: [[.55, .75, -.6, .2, 0]] };
  },

  // 7 — cronômetro em close, inclinado
  stopwatch() {
    const w = new THREE.Group();
    const face = canvasTex(1400, 1400, (c, W) => {
      c.fillStyle = '#f6f5f2'; c.fillRect(0, 0, W, W); c.translate(W / 2, W / 2);
      c.strokeStyle = '#ff6039'; c.lineWidth = 60; c.beginPath(); c.arc(0, 0, 545, -Math.PI / 2, -Math.PI / 2 + Math.PI * .5); c.stroke();
      for (let i = 0; i < 60; i++) { c.save(); c.rotate(i * Math.PI / 30); c.fillStyle = '#171717'; c.fillRect(-(i % 5 ? 4 : 9), -650, i % 5 ? 8 : 18, i % 5 ? 40 : 80); c.restore(); }
      c.fillStyle = '#171717'; c.font = font(92, 400); c.textAlign = 'center';
      [60, 15, 30, 45].forEach((t, i) => { const a = i * Math.PI / 2 - Math.PI / 2; c.fillText(String(t), Math.cos(a) * 440, Math.sin(a) * 440 + 32); });
      c.font = serif(70); c.fillText('segundos', 0, 250);
    });
    w.add(mesh(new THREE.CylinderGeometry(1.5, 1.5, .45, 128), M.steel(), { rx: Math.PI / 2 }));
    w.add(mesh(new THREE.TorusGeometry(1.5, .12, 32, 128), M.chrome(), { z: .22 }));
    w.add(mesh(new THREE.CircleGeometry(1.42, 128), M.tex(face, .5), { z: .236 }));
    w.add(mesh(rbox(.05, 1.3, .03, .015, 2), M.coral(), { x: .62, y: 0, z: .27, rz: -Math.PI / 2 }));
    w.add(mesh(new THREE.CylinderGeometry(.09, .09, .07, 32), M.coral(), { z: .285, rx: Math.PI / 2 }));
    w.add(mesh(new THREE.CylinderGeometry(.13, .13, .32, 32), M.chrome(), { y: 1.7 }));
    w.add(mesh(rbox(.55, .2, .34, .08), M.coral(), { y: 1.92 }));
    w.add(mesh(new THREE.CylinderGeometry(.09, .09, .28, 32), M.chrome(), { x: 1.1, y: 1.2, rz: -.78 }));
    w.add(mesh(new THREE.TorusGeometry(.22, .05, 16, 48), M.chrome(), { y: 2.12 }));
    place(w, { y: 1.62, rx: -.12, ry: -.42, rz: .06 });
    const g = grp(w);
    return { group: g, hero: g, view: [.1, .18, 1], fill: .74, y: .66, stars: [[-.68, .5, -.6, .2, 15]] };
  },

  // 8 — lead que esfria: balão de conversa coral congelado num bloco de gelo
  frozen() {
    const g = new THREE.Group();
    const bubble = grp(mesh(rbox(1.5, .95, .45, .3), M.coral()), mesh(new THREE.ConeGeometry(.2, .45, 32), M.coral(), { x: -.42, y: -.55, rz: .55 }));
    [-.38, 0, .38].forEach(dx => bubble.add(mesh(new THREE.SphereGeometry(.1, 32, 16), M.ceramic(), { x: dx, z: .2 })));
    place(bubble, { y: 1.1, ry: -.35, rz: .06 });
    const ice = new THREE.MeshPhysicalMaterial({ color: 0xeaf5ff, transmission: 1, thickness: .5, roughness: .14, ior: 1.08, clearcoat: 1, clearcoatRoughness: .05, attenuationColor: 0xb9dcff, attenuationDistance: 3.5 });
    const block = mesh(rbox(2.3, 2.1, 1.9, .16), ice, { y: 1.05, ry: -.35 });
    block.castShadow = false;
    const cubes = [[1.75, .32, .9, .62, .5], [-1.6, .25, 1.0, .5, .9], [2.2, .22, -.3, .44, .2]].map(([x, y, z, s, r]) => { const m = mesh(rbox(s, s, s, .07), ice, { x, y, z, ry: r }); m.castShadow = false; return m; });
    g.add(bubble, block, ...cubes);
    return { group: g, hero: g, heroBox: new THREE.Box3(new THREE.Vector3(-1.6, 0, -1.2), new THREE.Vector3(1.8, 2.2, 1.2)), view: [.15, .42, 1], fill: .8, y: .67, stars: [[.8, .55, -.6, .22, 0]] };
  },

  // 9 — calendário de mesa com dias marcados
  calendar() {
    const g = new THREE.Group();
    const page = canvasTex(1400, 1180, (c, w, h) => {
      c.fillStyle = '#fbfaf8'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#171717'; c.font = serif(150); c.fillText('Outubro', 90, 200);
      c.font = font(40, 500); c.fillStyle = '#8a8a8a'; ['S','T','Q','Q','S','S','D'].forEach((d, i) => c.fillText(d, 120 + i * 172, 300));
      for (let i = 0; i < 28; i++) {
        const x = 90 + (i % 7) * 172, y = 340 + Math.floor(i / 7) * 200;
        c.fillStyle = '#171717'; c.font = font(44, 500); c.fillText(String(i + 1), x + 20, y + 54);
        if (i < 22) { c.strokeStyle = i === 21 ? '#ff6039' : '#171717'; c.lineWidth = i === 21 ? 20 : 12; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x + 50, y + 110); c.lineTo(x + 80, y + 142); c.lineTo(x + 135, y + 78); c.stroke(); }
      }
    });
    const a = .3;
    const front = grp(mesh(new THREE.BoxGeometry(3.4, 2.86, .05), M.ceramic()), mesh(new THREE.PlaneGeometry(3.3, 2.78), M.tex(page, .55), { z: .027 }));
    place(front, { y: 1.36, z: .43, rx: a });
    const back = mesh(new THREE.BoxGeometry(3.4, 2.86, .05), M.black(), { y: 1.36, z: -.43, rx: -a });
    g.add(front, back);
    for (let i = 0; i < 14; i++) g.add(mesh(new THREE.TorusGeometry(.11, .022, 16, 48), M.chrome(), { x: -1.56 + i * .24, y: 2.74, ry: Math.PI / 2 }));
    return { group: g, hero: g, view: [-.28, .3, 1], fill: .78, y: .67, stars: [[.62, .6, -.5, .22, 12]] };
  },

  // 10 — três engrenagens que não se tocam
  gears() {
    const g = new THREE.Group();
    g.add(mesh(gearGeo(1.15, 16), M.steel(), { x: -1.55, y: 1.15, z: -.4, ry: .35 }));
    g.add(mesh(gearGeo(.85, 12), M.black(), { x: 1.75, y: .85, z: -.9, ry: -.3 }));
    g.add(mesh(gearGeo(1.0, 14), M.coral(), { x: .25, y: 1.0, z: .7, ry: .1 }));
    return { group: g, hero: g, view: [.1, .3, 1], fill: .8, y: .67, stars: [[.0, .7, -1.2, .2, 0]] };
  },

  // 11 — diamante (quanto vale?) num pedestal
  diamond() {
    const g = new THREE.Group();
    const pts = [[0, -1.25], [1.25, .02], [1.2, .14], [.95, .42], [.6, .56], [0, .56]];
    const geo = lathe(pts, 16).toNonIndexed(); geo.computeVertexNormals();
    const gem = mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: .02, flatShading: true, iridescence: 1, iridescenceIOR: 2.0, iridescenceThicknessRange: [200, 600], envMapIntensity: 2.2 }), { y: 1.5, rx: .32, rz: -.22 });
    const ped = mesh(new THREE.CylinderGeometry(.9, 1, .22, 96), M.black(), { y: .11 });
    g.add(gem, ped);
    return { group: g, hero: g, view: [0, .3, 1], fill: .74, y: .66, stars: [[.62, .55, -.5, .2, 0], [-.7, .15, -.4, .11, 20]] };
  },

  // 12 — o infinito da Opus em 3D
  infinity() {
    class Lem extends THREE.Curve { getPoint(t) { const u = t * Math.PI * 2, d = 1 + Math.sin(u) ** 2; return new THREE.Vector3(2 * Math.cos(u) / d * (1 + .25 * Math.cos(u)), 2 * Math.sin(u) * Math.cos(u) / d * (1 + .35 * Math.cos(u)), .55 * Math.sin(u)); } }
    const inf = mesh(new THREE.TubeGeometry(new Lem(), 600, .3, 64, true), M.coral(), { y: 1.7, rx: .3, ry: -.25, rz: .18 });
    const g = grp(inf);
    return { group: g, hero: g, view: [0, .22, 1], fill: .95, y: .64, stars: [[.62, .45, -.4, .16, 0]] };
  },
};

// ---------- estúdio ----------
export function render(canvas, name, { dark }) {
  const W = canvas.width, H = canvas.height;
  const bg = new THREE.Color(dark ? 0x121212 : 0xefeeeb);
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setSize(W, H, false); r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = dark ? 1.0 : .95;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.VSMShadowMap;
  const scene = new THREE.Scene(); scene.background = bg;
  const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = dark ? .75 : .8;

  const S = scenes[name]();
  scene.add(S.group);
  S.group.updateMatrixWorld(true);
  const all = new THREE.Box3().setFromObject(S.group);
  const hb = S.heroBox || new THREE.Box3().setFromObject(S.hero);
  const sph = hb.getBoundingSphere(new THREE.Sphere()), c = sph.center, R = sph.radius;

  // chão contínuo (ciclorama) que some no fundo com a névoa
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: dark ? 0x161616 : 0xf3f2ef, roughness: dark ? .55 : .9, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = all.min.y; floor.receiveShadow = true; scene.add(floor);

  // câmera
  const fov = 26, cam = new THREE.PerspectiveCamera(fov, W / H, .05, 500);
  const dist = R / Math.tan(THREE.MathUtils.degToRad(fov) / 2) / S.fill;
  const dir = new THREE.Vector3(...S.view).normalize();
  cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c);
  cam.setViewOffset(W, H, 0, -(S.y - .5) * H, W, H);
  cam.updateMatrixWorld(true);
  scene.fog = new THREE.Fog(bg, dist * 1.3, dist * 3.2);

  // luz: spot principal (poça de luz no chão), recorte e preenchimento
  const key = new THREE.SpotLight(0xffffff, dark ? 260 : 200, 0, .55, 1, 2);
  key.position.copy(c).add(new THREE.Vector3(-1.2 * R, 4.5 * R, 2.2 * R)); key.target.position.copy(c);
  key.castShadow = true; key.shadow.mapSize.set(4096, 4096); key.shadow.radius = 14; key.shadow.blurSamples = 25; key.shadow.bias = -.0004;
  key.intensity *= (R / 2) ** 2;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(dark ? 0xff8a6a : 0xffffff, dark ? .9 : 1.0); rim.position.copy(c).add(new THREE.Vector3(3 * R, 1.5 * R, -4 * R)); scene.add(rim);
  const fillL = new THREE.DirectionalLight(0xffffff, dark ? .35 : .6); fillL.position.copy(c).add(new THREE.Vector3(4 * R, 1 * R, 3 * R)); scene.add(fillL);

  // estrelas coral chapadas (adesivos da referência)
  const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  (S.stars || []).forEach(([dx, dy, dz, s, rot]) => {
    const sh = new THREE.Shape(); for (let i = 0; i < 24; i++) { const rr = i % 2 ? .6 : 1, t = i * Math.PI / 12; i ? sh.lineTo(Math.cos(t) * rr, Math.sin(t) * rr) : sh.moveTo(rr, 0); }
    const star = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: CORAL, toneMapped: false, fog: false }));
    star.position.copy(c).addScaledVector(right, dx * R).addScaledVector(up, dy * R).addScaledVector(dir, dz * R);
    star.scale.setScalar(s * R * .55); star.quaternion.copy(cam.quaternion); star.rotateZ(rot * Math.PI / 180);
    scene.add(star);
  });

  // profundidade de campo
  const comp = new EffectComposer(r); comp.setSize(W, H);
  comp.addPass(new RenderPass(scene, cam));
  const focusP = S.focus ? new THREE.Box3().setFromObject(S.focus).getCenter(new THREE.Vector3()) : c;
  comp.addPass(new BokehPass(scene, cam, { focus: cam.position.distanceTo(focusP), aperture: .006 / R, maxblur: .012 }));
  comp.addPass(new OutputPass());
  comp.render();
}
