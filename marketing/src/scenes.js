// Cenas 3D (three.js) que fazem o papel das fotos de objeto da referência.
// Cada cena devolve { group, view: [x, y, z] } — a direção da câmera.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const CORAL = 0xff6039, INK = 0x171717;
const V = (x, y) => new THREE.Vector2(x, y);

// ---------- materiais ----------
const plastic = (color, r = 0.32) => new THREE.MeshPhysicalMaterial({ color, roughness: r, clearcoat: 0.6, clearcoatRoughness: 0.2 });
const metal = (color = 0xd9d9de, r = 0.22) => new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: r });
const glass = (color = 0xffffff, ior = 1.5) => new THREE.MeshPhysicalMaterial({ color, transmission: 1, thickness: 0.6, roughness: 0.04, ior, clearcoat: 1 });
const matte = (color, r = 0.75) => new THREE.MeshStandardMaterial({ color, roughness: r });

function mesh(geo, mat, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1 } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.scale.setScalar(s);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
const lathe = (pts, seg = 72) => new THREE.LatheGeometry(pts.map(([x, y]) => V(x, y)), seg);

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const font = (px, w = 500, fam = 'Inter Tight') => `${w} ${px}px "${fam}"`;
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }

// ---------- peças ----------
const PAWN = [[0,0],[.42,0],[.43,.05],[.4,.1],[.36,.13],[.36,.17],[.27,.22],[.19,.42],[.15,.6],[.25,.64],[.25,.69],[.13,.73],[.19,.8],[.22,.9],[.2,.99],[.14,1.06],[.06,1.1],[0,1.11]];
const KING = [[0,0],[.52,0],[.53,.06],[.48,.12],[.43,.15],[.43,.2],[.32,.27],[.22,.65],[.18,1.1],[.33,1.14],[.33,1.2],[.2,1.25],[.28,1.42],[.3,1.5],[.22,1.56],[0,1.58]];
function king(mat) {
  const g = new THREE.Group();
  g.add(mesh(lathe(KING), mat));
  g.add(mesh(new RoundedBoxGeometry(.1, .36, .1, 4, .03), mat, { y: 1.72 }));
  g.add(mesh(new RoundedBoxGeometry(.28, .1, .1, 4, .03), mat, { y: 1.76 }));
  return g;
}

export const scenes = {
  // 1 — tabuleiro com peões e o rei coral (referência: xadrez)
  chess() {
    const g = new THREE.Group();
    const dark = plastic(0x2a2a2e, .25), light = plastic(0xe9e9ec, .25);
    for (let i = -3; i < 3; i++) for (let j = -3; j < 3; j++)
      g.add(mesh(new THREE.BoxGeometry(1, .12, 1), (i + j) & 1 ? dark : light, { x: i + .5, y: -.06, z: j + .5 }));
    const pg = glass(0xf4f4f6), pd = metal(0x8a8a90, .18);
    [[-2.5,-.5],[-1.5,.5],[-.5,-1.5],[1.5,-.5],[2.5,.5],[.5,1.5],[-1.5,1.5],[1.5,1.5],[-2.5,1.5],[2.5,-1.5]].forEach(([x,z],k)=>
      g.add(mesh(lathe(PAWN), k % 3 ? pg : pd, { x, z, s: .95 })));
    const k = king(plastic(CORAL, .22)); k.position.set(.5, 0, .5); k.scale.setScalar(1.15); g.add(k);
    return { group: g, view: [0, 3.6, 7.2], fill: .82 };
  },

  // 2 — celular com um site na tela e o cursor (referência: celular + lupa)
  phoneSite() {
    const g = new THREE.Group();
    const screen = canvasTex(600, 1200, (c, w, h) => {
      c.fillStyle = '#fafafa'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#171717'; c.font = font(34, 600); c.fillText('SuaEmpresa', 48, 110);
      c.fillStyle = '#d8d8d8'; [0,1,2].forEach(i => { rr(c, 360 + i * 64, 84, 40, 8, 4); c.fill(); });
      c.fillStyle = '#171717'; c.font = font(68, 500); ['Visitas', 'demais.', 'Vendas?'].forEach((t, i) => c.fillText(t, 48, 300 + i * 82));
      c.fillStyle = '#bdbdbd'; [0,1,2].forEach(i => { rr(c, 48, 560 + i * 36, 470 - i * 90, 16, 8); c.fill(); });
      c.fillStyle = '#ff6039'; rr(c, 48, 700, 300, 84, 42); c.fill();
      c.fillStyle = '#fff'; c.font = font(30, 600); c.fillText('Fale conosco', 92, 752);
      c.fillStyle = '#ededed'; rr(c, 48, 840, 504, 300, 28); c.fill();
    });
    const body = mesh(new RoundedBoxGeometry(1.5, 3, .16, 8, .2), metal(0x1c1c1f, .3));
    const scr = mesh(new THREE.PlaneGeometry(1.36, 2.82), new THREE.MeshStandardMaterial({ map: screen, roughness: .25 }), { z: .081 });
    const phone = new THREE.Group(); phone.add(body, scr);
    phone.rotation.set(-.15, -.35, .08); phone.position.y = 1.6; g.add(phone);
    // cursor 3D
    const cs = new THREE.Shape([V(0,0),V(0,-1),V(.24,-.76),V(.42,-1.12),V(.56,-1.05),V(.38,-.7),V(.7,-.7)]);
    const cur = mesh(new THREE.ExtrudeGeometry(cs, { depth: .12, bevelEnabled: true, bevelSize: .03, bevelThickness: .03 }), plastic(INK, .3), { x: .55, y: 1.05, z: .55, rz: .25, ry: -.3, s: .62 });
    g.add(cur);
    return { group: g, view: [.4, .5, 7], fill: .74 };
  },

  // 3 — quebra-cabeça: peças brancas encaixadas e a coral chegando
  puzzle() {
    const g = new THREE.Group();
    const piece = () => {
      const s = new THREE.Shape(); const k = .17, n = .2;
      s.moveTo(0, 0); s.lineTo(.5 - n, 0); s.absarc(.5, 0, k, Math.PI, 0, true); s.lineTo(1, 0);   // encaixe embaixo
      s.lineTo(1, .5 - n); s.absarc(1, .5, k, -Math.PI / 2, Math.PI / 2, false); s.lineTo(1, 1);   // pino à direita
      s.lineTo(.5 + n, 1); s.absarc(.5, 1, k, 0, Math.PI, false); s.lineTo(0, 1);                   // pino em cima
      s.lineTo(0, .5 + n); s.absarc(0, .5, k, Math.PI / 2, -Math.PI / 2, true); s.lineTo(0, 0);    // encaixe à esquerda
      const geo = new THREE.ExtrudeGeometry(s, { depth: .22, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 4, curveSegments: 24 });
      geo.translate(-.5, -.5, 0); geo.rotateX(-Math.PI / 2); return geo;
    };
    const geo = piece(), w = plastic(0xf2f2f4, .3), w2 = glass(0xf6f6f8);
    [[0,0],[1,0],[2,0],[0,-1],[1,-1],[0,-2],[2,-2]].forEach(([x,z],i) => g.add(mesh(geo, i % 3 === 1 ? w2 : w, { x: x - 1, z: z + 1 })));
    g.add(mesh(geo, plastic(CORAL, .22), { x: 1.3, y: 1.0, z: -.2, rx: .5, rz: -.35, ry: .3 }));
    return { group: g, view: [.4, 5, 5.2], fill: .9 };
  },

  // 4 — dados (sorte) x caixa de entrega coral
  dice() {
    const g = new THREE.Group();
    const die = (val, mat, pip) => {
      const d = new THREE.Group(); d.add(mesh(new RoundedBoxGeometry(1, 1, 1, 6, .14), mat));
      const L = { 1: [[0,0]], 2: [[-1,-1],[1,1]], 3: [[-1,-1],[0,0],[1,1]], 4: [[-1,-1],[1,1],[-1,1],[1,-1]], 5: [[-1,-1],[1,1],[-1,1],[1,-1],[0,0]], 6: [[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1]] };
      const sg = new THREE.SphereGeometry(.085, 24, 16);
      const put = (v, f, sc) => L[v].forEach(([a, b]) => { const p = new THREE.Vector3(); f(p, a * .26, b * .26); const m = mesh(sg, pip); m.position.copy(p); m.scale.set(...sc); d.add(m); });
      put(val[0], (p, a, b) => p.set(a, .5, b), [1, .4, 1]);
      put(val[1], (p, a, b) => p.set(a, b, .5), [1, 1, .4]);
      put(val[2], (p, a, b) => p.set(.5, a, b), [.4, 1, 1]);
      return d;
    };
    const d1 = die([5, 2, 3], plastic(0xf4f4f6, .2), plastic(INK, .3)); d1.position.set(-1.7, .5, .4); d1.rotation.y = .5; g.add(d1);
    const d2 = die([1, 6, 4], plastic(0x232326, .2), plastic(0xf4f4f6, .3)); d2.position.set(-.6, .5, 1.3); d2.rotation.set(0, -.3, 0); g.add(d2);
    // caixa
    const box = new THREE.Group(), cb = matte(CORAL, .55);
    box.add(mesh(new RoundedBoxGeometry(2, 1.6, 1.6, 4, .04), cb, { y: .8 }));
    box.add(mesh(new THREE.BoxGeometry(2.02, .02, .32), matte(0xffb39e, .4), { y: 1.605 }));
    box.add(mesh(new THREE.BoxGeometry(.32, 1.62, 1.62), matte(0xffb39e, .4), { y: .8 }));
    const label = canvasTex(400, 260, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0,0,w,h); c.fillStyle = '#171717'; c.font = font(44, 600); c.fillText('ENTREGUE', 30, 80); c.font = font(26, 400); c.fillText('Prazo: cumprido', 30, 130); c.fillText('Resultado: medido', 30, 172); for (let i = 0; i < 24; i++) c.fillRect(30 + i * 14, 200, i % 3 ? 6 : 10, 40); });
    box.add(mesh(new THREE.PlaneGeometry(.66, .43), new THREE.MeshStandardMaterial({ map: label, roughness: .6 }), { x: .55, y: .6, z: .805 }));
    box.position.set(1.1, 0, -.2); box.rotation.y = -.35; g.add(box);
    return { group: g, view: [.3, 2.4, 6.5], fill: .95 };
  },

  // 5 — pilhas de moedas subindo, a última coral
  coins() {
    const g = new THREE.Group(), geo = new THREE.CylinderGeometry(.5, .5, .1, 64);
    const silver = metal(0xc9c9cf, .25), gold = metal(0xff7a55, .28);
    [3, 6, 5, 9, 13].forEach((n, i) => {
      for (let k = 0; k < n; k++) g.add(mesh(geo, i === 4 ? gold : silver, { x: (i - 2) * 1.15 + Math.sin(k * 7) * .02, y: .05 + k * .105, z: (i - 2) * -.25 + Math.cos(k * 5) * .02, ry: k }));
    });
    g.add(mesh(geo, silver, { x: -2.2, y: .3, z: 1.1, rx: 1.2, rz: .2 }));
    return { group: g, view: [0, 1.6, 7], fill: .92 };
  },

  // 6 — escada de 4 blocos com a esfera coral no topo
  steps() {
    const g = new THREE.Group();
    const num = n => canvasTex(256, 256, (c) => { c.fillStyle = '#f2f2f4'; c.fillRect(0,0,256,256); c.fillStyle = '#171717'; c.font = font(120, 500); c.textAlign = 'center'; c.fillText('0' + n, 128, 170); });
    [1, 2, 3, 4].forEach(n => {
      const h = .6 * n;
      g.add(mesh(new RoundedBoxGeometry(1, h, 1.4, 4, .05), n === 4 ? plastic(CORAL, .3) : plastic(0xf2f2f4, .35), { x: (n - 2.5) * 1.02, y: h / 2 }));
      if (n < 4) g.add(mesh(new THREE.PlaneGeometry(.62, .62), new THREE.MeshStandardMaterial({ map: num(n), roughness: .4 }), { x: (n - 2.5) * 1.02, y: h - .4, z: .705 }));
    });
    g.add(mesh(new THREE.SphereGeometry(.32, 48, 32), metal(0xdedee3, .12), { x: 1.53, y: 2.72 }));
    return { group: g, view: [-.6, 1.4, 7], fill: .8 };
  },

  // 7 — cronômetro
  stopwatch() {
    const g = new THREE.Group(), w = new THREE.Group();
    const face = canvasTex(1024, 1024, (c, W) => {
      c.fillStyle = '#f7f7f7'; c.fillRect(0, 0, W, W); c.translate(512, 512);
      c.strokeStyle = '#ff6039'; c.lineWidth = 46; c.beginPath(); c.arc(0, 0, 400, -Math.PI / 2, -Math.PI / 2 + Math.PI * .55); c.stroke();
      for (let i = 0; i < 60; i++) { c.save(); c.rotate(i * Math.PI / 30); c.fillStyle = '#171717'; c.fillRect(-(i % 5 ? 3 : 7), -470, i % 5 ? 6 : 14, i % 5 ? 30 : 60); c.restore(); }
      c.fillStyle = '#171717'; c.font = font(64, 500); c.textAlign = 'center';
      [60, 15, 30, 45].forEach((t, i) => { const a = i * Math.PI / 2 - Math.PI / 2; c.fillText(String(t), Math.cos(a) * 330, Math.sin(a) * 330 + 22); });
    });
    w.add(mesh(new THREE.CylinderGeometry(1.5, 1.5, .4, 96), metal(0xd2d2d8, .18), { rx: Math.PI / 2 }));
    w.add(mesh(new THREE.TorusGeometry(1.5, .1, 24, 96), metal(0xe6e6ea, .12), { z: .2 }));
    w.add(mesh(new THREE.CircleGeometry(1.42, 96), new THREE.MeshStandardMaterial({ map: face, roughness: .5 }), { z: .205 }));
    w.add(mesh(new THREE.CircleGeometry(1.42, 96), glass(), { z: .26 }));
    w.add(mesh(new RoundedBoxGeometry(.05, 1.25, .03, 2, .01), plastic(CORAL), { x: .58, y: -.1, z: .235, rz: -1.73 }));
    w.add(mesh(new THREE.CylinderGeometry(.09, .09, .06, 32), plastic(CORAL), { z: .25, rx: Math.PI / 2 }));
    w.add(mesh(new THREE.CylinderGeometry(.13, .13, .3, 32), metal(0xd2d2d8), { y: 1.68 }));
    w.add(mesh(new RoundedBoxGeometry(.5, .16, .3, 4, .06), plastic(CORAL, .25), { y: 1.86 }));
    w.add(mesh(new THREE.CylinderGeometry(.09, .09, .25, 32), metal(0xd2d2d8), { x: 1.05, y: 1.18, rz: -.78 }));
    w.position.y = 1.65; w.rotation.set(-.08, -.3, .05); g.add(w);
    return { group: g, view: [0, .4, 7], fill: .8 };
  },

  // 8 — celular de conversa com balões e um cubo de gelo
  chat() {
    const g = new THREE.Group();
    const screen = canvasTex(600, 1200, (c, w, h) => {
      c.fillStyle = '#efeae2'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#171717'; c.fillRect(0, 0, w, 150); c.fillStyle = '#fff'; c.font = font(34, 600); c.fillText('Lead novo', 120, 92);
      c.fillStyle = '#ff6039'; c.beginPath(); c.arc(70, 80, 30, 0, 7); c.fill();
      const msg = (y, t, me) => { c.font = font(40, 500); const tw = c.measureText(t).width + 60; c.fillStyle = me ? '#ffd9cf' : '#fff'; rr(c, me ? w - tw - 30 : 30, y, tw, 90, 22); c.fill(); c.fillStyle = '#171717'; c.fillText(t, (me ? w - tw - 30 : 30) + 30, y + 58); };
      msg(210, 'Oi! Quanto custa?', false); msg(330, 'Ainda estão aí?', false); msg(450, 'Alô?', false);
      c.fillStyle = '#8a8a8a'; c.font = font(32, 500); c.textAlign = 'center'; c.fillText('sem resposta há 2 dias', w / 2, 640);
    });
    const ph = new THREE.Group();
    ph.add(mesh(new RoundedBoxGeometry(1.5, 3, .16, 8, .2), metal(0x1c1c1f, .3)));
    ph.add(mesh(new THREE.PlaneGeometry(1.36, 2.82), new THREE.MeshStandardMaterial({ map: screen, roughness: .25 }), { z: .081 }));
    ph.position.set(-.3, 1.6, 0); ph.rotation.set(-.1, .3, -.06); g.add(ph);
    const bubble = (mat, x, y, z, s) => { const b = new THREE.Group(); b.add(mesh(new RoundedBoxGeometry(1.3, .7, .3, 6, .15), mat)); b.add(mesh(new THREE.ConeGeometry(.14, .3, 24), mat, { x: -.4, y: -.42, rz: .5 })); [-.3, 0, .3].forEach(dx => b.add(mesh(new THREE.SphereGeometry(.08, 24, 16), plastic(mat === bubble.c ? 0xffffff : INK), { x: dx, z: .16 }))); b.position.set(x, y, z); b.scale.setScalar(s); b.rotation.y = -.25; return b; };
    bubble.c = plastic(CORAL, .25);
    g.add(bubble(bubble.c, 1.35, 2.9, .5, .9));
    g.add(bubble(plastic(0xf2f2f4, .3), 1.55, 1.95, .2, .7));
    g.add(mesh(new RoundedBoxGeometry(.85, .85, .85, 6, .12), new THREE.MeshPhysicalMaterial({ color: 0x9fcfff, transmission: .55, roughness: .12, thickness: 1, ior: 1.31, clearcoat: 1, attenuationColor: 0x6fb2ff, attenuationDistance: .8 }), { x: 1.15, y: .43, z: 1, ry: .6 }));
    g.add(mesh(new RoundedBoxGeometry(.6, .6, .6, 6, .1), new THREE.MeshPhysicalMaterial({ color: 0x9fcfff, transmission: .55, roughness: .12, thickness: 1, ior: 1.31, clearcoat: 1, attenuationColor: 0x6fb2ff, attenuationDistance: .8 }), { x: 1.9, y: .3, z: 1.6, ry: .2 }));
    return { group: g, view: [.3, .9, 7], fill: .9 };
  },

  // 9 — calendário de mesa com checks (referência: calendário com X)
  calendar() {
    const g = new THREE.Group();
    const page = canvasTex(1024, 860, (c, w, h) => {
      c.fillStyle = '#fbfbfb'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#171717'; c.font = font(64, 600); c.fillText('OUTUBRO', 70, 130);
      for (let i = 0; i < 20; i++) {
        const x = 70 + (i % 5) * 180, y = 200 + Math.floor(i / 5) * 150;
        c.strokeStyle = '#d5d5d8'; c.lineWidth = 4; rr(c, x, y, 150, 120, 14); c.stroke();
        if (i < 16) { c.strokeStyle = i === 15 ? '#ff6039' : '#171717'; c.lineWidth = 14; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x + 40, y + 62); c.lineTo(x + 66, y + 88); c.lineTo(x + 112, y + 34); c.stroke(); }
      }
    });
    const a = .32;
    const back = mesh(new THREE.BoxGeometry(3.2, 2.7, .04), matte(0xd6d6da, .6), { y: 1.3, z: -.42, rx: -a });
    const front = mesh(new THREE.BoxGeometry(3.2, 2.7, .04), matte(0xffffff, .5), { y: 1.3, z: .42, rx: a });
    const fp = mesh(new THREE.PlaneGeometry(3.1, 2.6), new THREE.MeshStandardMaterial({ map: page, roughness: .55 }), { y: 1.3, z: .45, rx: a });
    fp.position.add(new THREE.Vector3(0, -.01, .03).applyEuler(fp.rotation)); fp.position.z += 0;
    g.add(back, front, fp);
    for (let i = 0; i < 13; i++) g.add(mesh(new THREE.TorusGeometry(.1, .02, 12, 32), metal(0xbfbfc5, .2), { x: -1.44 + i * .24, y: 2.6, z: 0, ry: Math.PI / 2 }));
    // burst coral 3D
    const st = new THREE.Shape(); for (let i = 0; i < 16; i++) { const r = i % 2 ? .28 : .6, t = i * Math.PI / 8; i ? st.lineTo(Math.cos(t) * r, Math.sin(t) * r) : st.moveTo(r, 0); }
    g.add(mesh(new THREE.ExtrudeGeometry(st, { depth: .12, bevelSize: .03, bevelThickness: .03 }), plastic(CORAL, .3), { x: 1.55, y: 2.8, z: .6, rz: .3, ry: -.3 }));
    return { group: g, view: [-.5, 1.6, 7.4], fill: .92 };
  },

  // 10 — três engrenagens que não se encostam
  gears() {
    const g = new THREE.Group();
    const gear = (R, n) => {
      const s = new THREE.Shape(), r0 = R * .82;
      for (let i = 0; i < n; i++) {
        const a = i * 2 * Math.PI / n, d = Math.PI / n;
        const pts = [[r0, a - d * .55], [R, a - d * .3], [R, a + d * .3], [r0, a + d * .55]];
        pts.forEach(([r, t], k) => (i === 0 && k === 0 ? s.moveTo : s.lineTo).call(s, Math.cos(t) * r, Math.sin(t) * r));
      }
      const h = new THREE.Path(); h.absarc(0, 0, R * .25, 0, Math.PI * 2, true); s.holes.push(h);
      return new THREE.ExtrudeGeometry(s, { depth: .3, bevelSize: .03, bevelThickness: .03, bevelSegments: 3, curveSegments: 32 });
    };
    g.add(mesh(gear(1.1, 14), metal(0xcfcfd5, .25), { x: -1.75, y: .9, z: 0, rz: .1 }));
    g.add(mesh(gear(.8, 10), plastic(0x242427, .3), { x: 1.85, y: 1.55, z: -.4, rz: .3 }));
    g.add(mesh(gear(.95, 12), plastic(CORAL, .28), { x: .3, y: -.75, z: .6, rz: .5 }));
    g.rotation.x = -.15;
    return { group: g, view: [0, .6, 7.5], fill: .88 };
  },

  // 11 — diamante (quanto vale) sobre a lupa
  diamond() {
    const g = new THREE.Group();
    const geo = lathe([[0, -1.05], [1.15, .05], [1.1, .18], [.62, .52], [0, .52]], 12);
    geo.computeVertexNormals();
    const gem = mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .15, roughness: .02, flatShading: true, clearcoat: 1, iridescence: .9, iridescenceIOR: 1.8, envMapIntensity: 2.6, specularIntensity: 1 }), { y: 1.9, rx: .2, rz: -.15 });
    g.add(gem);
    const lens = new THREE.Group();
    lens.add(mesh(new THREE.TorusGeometry(.95, .12, 24, 96), plastic(CORAL, .25)));
    lens.add(mesh(new THREE.CylinderGeometry(.92, .92, .05, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: .18, roughness: 0, clearcoat: 1, envMapIntensity: 2 }), { rx: Math.PI / 2 }));
    lens.add(mesh(new RoundedBoxGeometry(.28, 1.4, .28, 4, .1), plastic(INK, .3), { y: -1.68 }));
    lens.position.set(1.3, .9, 1); lens.rotation.set(-.3, -.4, .75); g.add(lens);
    return { group: g, view: [0, 1.3, 7.5], fill: .9 };
  },

  // 12 — o infinito da Opus em 3D
  infinity() {
    const g = new THREE.Group();
    class Lem extends THREE.Curve { getPoint(t) { const u = t * Math.PI * 2, d = 1 + Math.sin(u) ** 2; return new THREE.Vector3(2 * Math.cos(u) / d * (1 + .25 * Math.cos(u)), 2 * Math.sin(u) * Math.cos(u) / d * (1 + .35 * Math.cos(u)), .55 * Math.sin(u)); } }
    g.add(mesh(new THREE.TubeGeometry(new Lem(), 400, .26, 48, true), new THREE.MeshPhysicalMaterial({ color: CORAL, roughness: .28, clearcoat: 1, clearcoatRoughness: .15, sheen: .5, sheenColor: 0xffb6a4 }), { y: 1.6, rx: .35, ry: -.2, rz: .2 }));
    return { group: g, view: [0, .4, 7], fill: .82 };
  },
};

// ---------- renderização ----------
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function render(canvas, name, { dark }) {
  const W = canvas.width, H = canvas.height;
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setSize(W, H, false); r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = dark ? 1.05 : 1.0;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const { group, view, fill = .9 } = scenes[name]();
  scene.add(group);
  const key = new THREE.DirectionalLight(0xffffff, dark ? 2.2 : 1.6); key.position.set(-4, 9, 6); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 }); key.shadow.radius = 6; key.shadow.bias = -.0005;
  scene.add(key);
  if (dark) { const rim = new THREE.DirectionalLight(0xff6039, 1.4); rim.position.set(6, 3, -5); scene.add(rim); }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: dark ? .55 : .18 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.001; floor.receiveShadow = true;
  const box0 = new THREE.Box3().setFromObject(group); floor.position.y = box0.min.y - .001; scene.add(floor);
  // enquadra
  const box = new THREE.Box3().setFromObject(group), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
  const cam = new THREE.PerspectiveCamera(28, W / H, .1, 200);
  const dir = new THREE.Vector3(...view).normalize();
  const rad = sz.length() / 2, dist = rad / Math.sin(THREE.MathUtils.degToRad(28) / 2) * (1 / fill) * Math.max(1, (H / W) * .9) * .62;
  cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c);
  r.render(scene, cam);
}
