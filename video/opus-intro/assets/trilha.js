// Trilha original da apresentação (15s, 120 BPM, I–V–vi–IV em Dó maior), sintetizada com Web Audio.
// Sincronizada com a timeline: drop em 3.0s (cena 2), "whoosh" em cada transição, clique + acorde final em 14.1s.
// Se existir assets/musica.mp3, ela é usada no lugar da trilha sintetizada.
(() => {
  const SR = 44100, LEN = 15;
  const BEAT = 60 / 120, S16 = BEAT / 4;
  const DROP = 3.0, CLICK = 14.02, FINAL = 14.12;
  const SWEEPS = [5.85, 8.3, 10.6, 12.3];
  // um acorde por compasso (2s): C G Am F C G F C
  const CHORDS = [[60, 64, 67], [59, 62, 67], [57, 60, 64], [57, 60, 65], [60, 64, 67], [59, 62, 67], [57, 60, 65], [60, 64, 67]];
  const ROOTS = [36, 43, 45, 41, 36, 43, 41, 36];
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  function synth() {
    const ctx = new OfflineAudioContext(2, SR * LEN, SR);

    // ruído determinístico
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    const noise = ctx.createBuffer(1, SR * 2, SR);
    noise.getChannelData(0).forEach((_, i, a) => { a[i] = rand(); });

    // mixagem: master → compressor → saída; envio de delay (colcheia pontuada) para stabs/lead
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = .003; comp.release.value = .15;
    comp.connect(ctx.destination);
    const master = ctx.createGain(); master.gain.value = .9; master.connect(comp);
    const delay = ctx.createDelay(1); delay.delayTime.value = BEAT * .75;
    const fb = ctx.createGain(); fb.gain.value = .32;
    const wet = ctx.createGain(); wet.gain.value = .22;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    // "sidechain": instrumentos melódicos abaixam a cada bumbo
    const duck = ctx.createGain(); duck.connect(master); duck.connect(delay);
    const pan = (node, p) => { const s = ctx.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };

    const env = (g, t, a, peak, d, end = .0001) => {
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(end, t + a + d);
    };
    const noiseSrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.start(t, (t * 7.31) % 1, dur + .05); return s; };

    const kick = (t, g = 1) => {
      const o = ctx.createOscillator(), v = ctx.createGain();
      o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(46, t + .11);
      env(v, t, .002, g, .42); o.connect(v); v.connect(master); o.start(t); o.stop(t + .5);
      duck.gain.setValueAtTime(.35, t); duck.gain.linearRampToValueAtTime(1, t + .22);
    };
    const clap = (t, g = .55) => {
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1700; f.Q.value = .9;
      const v = ctx.createGain(); v.gain.setValueAtTime(.0001, t);
      [0, .011, .022].forEach(o => { v.gain.setValueAtTime(g, t + o); v.gain.exponentialRampToValueAtTime(g * .3, t + o + .01); });
      v.gain.exponentialRampToValueAtTime(.0001, t + .22);
      const n = noiseSrc(t, .25); n.connect(f); f.connect(v); pan(v, .05).connect(master);
    };
    const hat = (t, g = .12, len = .04, p = .25) => {
      const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 7500;
      const v = ctx.createGain(); env(v, t, .001, g, len);
      const n = noiseSrc(t, len + .02); n.connect(f); f.connect(v); pan(v, p).connect(master);
    };
    const bass = (t, m, dur, g = .42) => {
      const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m);
      const s = ctx.createOscillator(); s.type = "sine"; s.frequency.value = hz(m);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 6;
      f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(180, t + dur);
      const v = ctx.createGain(); env(v, t, .004, g, dur);
      o.connect(f); s.connect(f); f.connect(v); v.connect(duck);
      o.start(t); s.start(t); o.stop(t + dur + .05); s.stop(t + dur + .05);
    };
    const stab = (t, notes, dur, g, cutoff) => {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 3;
      f.frequency.setValueAtTime(cutoff, t); f.frequency.exponentialRampToValueAtTime(Math.max(200, cutoff * .25), t + dur);
      const v = ctx.createGain(); env(v, t, .004, g, dur); f.connect(v); v.connect(duck);
      notes.forEach((m, i) => [-9, 9].forEach(c => {
        const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = c;
        const p = ctx.createStereoPanner(); p.pan.value = c > 0 ? .35 : -.35; o.connect(p); p.connect(f);
        o.start(t); o.stop(t + dur + .05);
      }));
    };
    const pluck = (t, m, g = .11) => {
      const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = hz(m);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(700, t + .16);
      const v = ctx.createGain(); env(v, t, .002, g, .17);
      o.connect(f); f.connect(v); pan(v, -.2).connect(duck); o.start(t); o.stop(t + .22);
    };
    const whoosh = (t, dur = .55, g = .32, from = 300, to = 7000) => {
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.6;
      f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
      const v = ctx.createGain(); v.gain.setValueAtTime(.0001, t);
      v.gain.exponentialRampToValueAtTime(g, t + dur * .75); v.gain.exponentialRampToValueAtTime(.0001, t + dur);
      const n = noiseSrc(t, dur); n.connect(f); f.connect(v); v.connect(master);
    };
    const crash = (t, g = .3, len = 1.4) => {
      const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 3500;
      const v = ctx.createGain(); env(v, t, .002, g, len);
      const n = noiseSrc(t, len); n.connect(f); f.connect(v); v.connect(master);
    };
    const boom = (t, g = .9) => {
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(32, t + .8);
      const v = ctx.createGain(); env(v, t, .005, g, 1.1); o.connect(v); v.connect(master); o.start(t); o.stop(t + 1.2);
    };
    const uiClick = t => {
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(1800, t); o.frequency.exponentialRampToValueAtTime(600, t + .04);
      const v = ctx.createGain(); env(v, t, .001, .35, .06); o.connect(v); v.connect(master); o.start(t); o.stop(t + .1);
      hat(t, .25, .02, 0);
    };
    const ding = (t, g = .22) => [[84, 1], [91, .5], [96, .35]].forEach(([m, k]) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = hz(m);
      const v = ctx.createGain(); env(v, t, .003, g * k, 1.1); o.connect(v); v.connect(master); v.connect(delay); o.start(t); o.stop(t + 1.3);
    });

    // ---------- Arranjo ----------
    for (let step = 0; step * S16 < LEN; step++) {
      const t = step * S16, bar = Math.floor(t / 2), inBar = step % 16, beat = step % 4 === 0;
      const chord = CHORDS[Math.min(bar, 7)], root = ROOTS[Math.min(bar, 7)];
      const intro = t < DROP, outro = t >= FINAL;
      if (outro) continue;

      // stabs sincopados (no intro: filtro abrindo)
      if ([0, 3, 6, 10, 13].includes(inBar)) {
        const cut = intro ? 350 + Math.pow(t / DROP, 2) * 3200 : 3200;
        stab(t, intro ? chord : chord.map(n => n + 12), .26, intro ? .12 + .08 * t / DROP : .12, cut);
      }
      // hats: entram no 1s do intro e crescem
      if (t >= 1 && intro) hat(t, .02 + .07 * (t - 1) / 2, .03);
      if (!intro) {
        if (beat) kick(t);
        if (step % 8 === 4) clap(t);
        if (step % 4 === 2) hat(t, .16, .11, .3);          // hat aberto no contratempo
        else hat(t, .055, .03, -.25);
        if (step % 4 === 2) bass(t, root, BEAT / 2 - .02);       // baixo no contratempo
        if (step % 4 === 3) bass(t, root + 12, S16 * .9, .22);
      }
      // arpejo a partir da cena 3a
      if (t >= 6 && !intro) {
        const arp = [0, 1, 2, 1, 2, 0, 2, 1][step % 8];
        pluck(t, chord[arp] + (step % 16 >= 8 ? 24 : 12));
      }
    }
    // rufar de caixa + riser preparando o drop
    for (let t = 1.5; t < DROP - .01; t += (t < 2.5 ? S16 * 2 : S16)) clap(t, .08 + .3 * (t - 1.5) / 1.5);
    whoosh(1.2, DROP - 1.2, .5, 250, 9000);
    boom(DROP); crash(DROP, .32, 1.8); kick(DROP, 1.1);

    // transições
    SWEEPS.forEach(t => { whoosh(t - .1, .55, .5); });
    crash(SWEEPS[3] + .5, .18, 1);

    // clique no "Seguir" + final
    uiClick(CLICK);
    kick(FINAL, 1); boom(FINAL, .5); crash(FINAL, .26, 1.2);
    stab(FINAL, [60, 64, 67, 72, 76], .85, .12, 4200);
    bass(FINAL, 36, .8, .45);
    ding(FINAL + .02);

    return ctx.startRendering();
  }

  // Saturação suave (mais "punch"), normaliza e aplica fade de saída
  function finish(buf) {
    const DRIVE = 2.4, norm = Math.tanh(DRIVE);
    let peak = 0;
    for (let c = 0; c < buf.numberOfChannels; c++) buf.getChannelData(c).forEach(v => { peak = Math.max(peak, Math.abs(v)); });
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < d.length; i++) d[i] = Math.tanh(DRIVE * d[i] / (peak || 1)) / norm;
    }
    peak = 0;
    for (let c = 0; c < buf.numberOfChannels; c++) buf.getChannelData(c).forEach(v => { peak = Math.max(peak, Math.abs(v)); });
    const k = peak ? .89 / peak : 1, n = Math.min(buf.length, buf.sampleRate * LEN), fade = Math.floor(.4 * buf.sampleRate);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < d.length; i++) d[i] *= i >= n ? 0 : k * (i > n - fade ? (n - i) / fade : 1);
    }
    return buf;
  }

  async function load() {
    try {
      const r = await fetch("assets/musica.mp3");
      if (r.ok) {
        const ctx = new OfflineAudioContext(2, SR * LEN, SR);
        return finish(await ctx.decodeAudioData(await r.arrayBuffer()));
      }
    } catch (e) { /* sem arquivo: usa a trilha sintetizada */ }
    return finish(await synth());
  }

  function toWav(buf) {
    const ch = buf.numberOfChannels, n = Math.min(buf.length, SR * LEN), out = new DataView(new ArrayBuffer(44 + n * ch * 2));
    const str = (o, s) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
    str(0, "RIFF"); out.setUint32(4, 36 + n * ch * 2, true); str(8, "WAVEfmt "); out.setUint32(16, 16, true);
    out.setUint16(20, 1, true); out.setUint16(22, ch, true); out.setUint32(24, buf.sampleRate, true);
    out.setUint32(28, buf.sampleRate * ch * 2, true); out.setUint16(32, ch * 2, true); out.setUint16(34, 16, true);
    str(36, "data"); out.setUint32(40, n * ch * 2, true);
    const data = [...Array(ch)].map((_, c) => buf.getChannelData(c));
    for (let i = 0, o = 44; i < n; i++) for (let c = 0; c < ch; c++, o += 2) out.setInt16(o, Math.max(-1, Math.min(1, data[c][i])) * 32767, true);
    return out.buffer;
  }

  window.OpusTrilha = { load, toWav };
})();
