/**
 * PLACEHOLDER — o snippet original do black-hole.tsx importa este módulo
 * (`./black-hole-utils/renderer`), mas o trecho colado só trazia
 * black-hole.tsx e demo.tsx, sem o arquivo que realmente desenha o efeito
 * (provavelmente WebGL/shader, já que o resto do componente é só um
 * <canvas> cru). Sem ele o import quebra o build.
 *
 * Este arquivo implementa a MESMA interface (createRenderer({ canvas }) =>
 * { ready, dispose() }) com um canvas 2D simples — um "buraco negro"
 * estilizado (anel girando + horizonte de eventos + estrelas), só pra o
 * projeto compilar e rodar enquanto o renderer de verdade não chega. Troque
 * o conteúdo deste arquivo pelo código original assim que você tiver.
 */

export type CreateRendererOptions = {
  canvas: HTMLCanvasElement;
};

export type Renderer = {
  ready: Promise<void>;
  dispose: () => void;
};

export function createRenderer({ canvas }: CreateRendererOptions): Renderer {
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  let raf = 0;
  let disposed = false;
  let width = 0;
  let height = 0;
  let dpr = 1;

  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    tw: Math.random() * Math.PI * 2,
  }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  function draw(t: number) {
    if (!ctx || disposed) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // fundo
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    // estrelas
    for (const s of stars) {
      const alpha = 0.35 + 0.45 * Math.sin(t / 900 + s.tw);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    const cx = width / 2;
    const cy = height / 2;
    const base = Math.min(width, height);

    // disco de acreção (anel girando)
    const rings = 3;
    for (let i = 0; i < rings; i++) {
      const rr = base * (0.16 + i * 0.045);
      const spin = t / (2200 + i * 500) + i;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(spin);
      ctx.scale(1, 0.32);
      const grad = ctx.createRadialGradient(0, 0, rr * 0.7, 0, 0, rr);
      grad.addColorStop(0, "rgba(124,58,237,0)");
      grad.addColorStop(0.75, `rgba(79,216,255,${0.5 - i * 0.12})`);
      grad.addColorStop(1, "rgba(124,58,237,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = base * 0.012;
      ctx.beginPath();
      ctx.arc(0, 0, rr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // horizonte de eventos
    const horizon = base * 0.14;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, horizon * 1.8);
    glow.addColorStop(0, "rgba(0,0,0,1)");
    glow.addColorStop(0.55, "rgba(0,0,0,1)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, horizon * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(cx, cy, horizon, 0, Math.PI * 2);
    ctx.fill();

    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(draw);
    }
  }

  function start() {
    resize();
    draw(0);
    if (!prefersReducedMotion) {
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
  }

  const ready = new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    start();
    resolve();
  });

  function dispose() {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", resize);
    }
  }

  return { ready, dispose };
}
