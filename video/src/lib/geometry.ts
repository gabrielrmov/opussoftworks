export type Pt = {x: number; y: number};
export type Cubic = [Pt, Pt, Pt, Pt];

export const pt = (x: number, y: number): Pt => ({x, y});
export const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t});
export const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

export const cubicAt = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y};
};

export const cubicLength = (seg: Cubic, steps = 64) => {
  let len = 0;
  let prev = seg[0];
  for (let i = 1; i <= steps; i++) {
    const p = cubicAt(seg, i / steps);
    len += dist(prev, p);
    prev = p;
  }
  return len;
};

export const segsLength = (segs: Cubic[]) => segs.reduce((acc, s) => acc + cubicLength(s), 0);
export const reverseCubic = (s: Cubic): Cubic => [s[3], s[2], s[1], s[0]];
export const mapSegs = (segs: Cubic[], fn: (p: Pt) => Pt): Cubic[] => segs.map((s) => s.map(fn) as Cubic);
export const straight = (a: Pt, b: Pt): Cubic => [a, lerpPt(a, b, 1 / 3), lerpPt(a, b, 2 / 3), b];

const n = (v: number) => Math.round(v * 100) / 100;
export const segsToD = (segs: Cubic[], close = false) =>
  `M${n(segs[0][0].x)} ${n(segs[0][0].y)} ` +
  segs.map(([, c1, c2, e]) => `C${n(c1.x)} ${n(c1.y)} ${n(c2.x)} ${n(c2.y)} ${n(e.x)} ${n(e.y)}`).join(' ') +
  (close ? ' Z' : '');

export const lineD = (a: Pt, b: Pt) => `M${n(a.x)} ${n(a.y)} L${n(b.x)} ${n(b.y)}`;

/** Arco de círculo (graus, y para baixo) — usado pelo fio condutor coral. */
export const arcD = (c: Pt, r: number, fromDeg: number, toDeg: number) => {
  const rad = (d: number) => (d * Math.PI) / 180;
  const s = {x: c.x + r * Math.cos(rad(fromDeg)), y: c.y + r * Math.sin(rad(fromDeg))};
  const e = {x: c.x + r * Math.cos(rad(toDeg)), y: c.y + r * Math.sin(rad(toDeg))};
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  const sweep = toDeg > fromDeg ? 1 : 0;
  return `M${n(s.x)} ${n(s.y)} A${r} ${r} 0 ${large} ${sweep} ${n(e.x)} ${n(e.y)}`;
};

export const quadAt = (a: Pt, c: Pt, b: Pt, t: number): Pt => {
  const u = 1 - t;
  return {x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y};
};
