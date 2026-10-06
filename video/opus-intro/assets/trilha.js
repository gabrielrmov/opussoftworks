// Trilha original da apresentação (60s, 120 BPM, I–V–vi–IV em Dó maior), sintetizada com Web Audio.
// Estrutura sincronizada com a timeline do vídeo:
//   0–5 intro (filtro abrindo) · 5–9 build · 9 DROP · 9–37.5 groove + melodia
//   37.5–43.5 respiro (cena "Clareza") · 43.5 segundo drop · 53.5–54 pausa · 54–58 final · 58 clique "Seguir"
// Cada corte de cena cai no tempo forte, com "whoosh" e prato.
// Se existir assets/musica.mp3, ela é usada no lugar da trilha sintetizada.
(() => {
  const SR = 44100, LEN = 60;
  const BEAT = 60 / 120, S16 = BEAT / 4, S8 = BEAT / 2;
  const CUTS = [5, 9, 15, 21, 26.5, 32, 37.5, 43.5, 49.5, 54];
  const INTRO = 5, DROP = 9, CALM = [37.5, 43.5], BREAK = [53.5, 54], CLICK = 58;
  const PROG = ["C", "G", "Am", "F"];
  const chordAt = t => (t >= CLICK ? "C" : PROG[Math.floor(t / 2) % 4]);
  const CHORD = { C: [60, 64, 67], G: [59, 62, 67], Am: [57, 60, 64], F: [57, 60, 65] };
  const ROOT = { C: 36, G: 43, Am: 45, F: 41 };
  // duas frases de melodia (colcheias; null = pausa)
  const MEL_A = {
    C:  [76, null, 79, null, 81, 79, null, 76],
    G:  [74, null, 74, 76, null, 79, null, null],
    Am: [76, null, 79, null, 84, 83, null, 79],
    F:  [81, null, 79, 76, null, 74, null, 72],
  };
  const MEL_B = {
    C:  [79, null, 76, 79, null, 84, 83, null],
    G:  [79, null, 74, 76, null, 79, null, null],
    Am: [81, null, 79, 76, null, 72, null, 76],
    F:  [77, null, 76, 72, null, 74, null, null],
  };
  const melodyAt = t => (t >= 15 && t < 26.5) || (t >= 54 && t < CLICK) ? MEL_A
                      : (t >= 26.5 && t < CALM[0]) || (t >= CALM[1] && t < BREAK[0]) ? MEL_B : null;
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  function synth() {
    const ctx = new OfflineAudioContext(2, SR * LEN, SR);

    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
    const noise = ctx.createBuffer(1, SR * 2, SR);
    noise.getChannelData(0).forEach((_, i, a) => { a[i] = rand(); });

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = .003; comp.release.value = .15;
    comp.connect(ctx.destination);
    const master = ctx.createGain(); master.gain.value = .9; master.connect(comp);
    const delay = ctx.createDelay(1); delay.delayTime.value = BEAT * .75;
    const fb = ctx.createGain(); fb.gain.value = .3;
    const wet = ctx.createGain(); wet.gain.value = .2;
    const dlp = ctx.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 3500;
    delay.connect(dlp); dlp.connect(fb); fb.connect(delay); dlp.connect(wet); wet.connect(master);
    const duck = ctx.createGain(); duck.connect(master);
    const send = ctx.createGain(); send.connect(duck); send.connect(delay);
    const pan = (node, p) => { const s = ctx.createStereoPanner(); s.pan.value = p; node.connect(s); return s; };

    const env = (g, t, a, peak, d, end = .0001) => {
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(end, t + a + d);
    };
    const noiseSrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(t, (t * 7.31) % 1, dur + .05); return s; };

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
    const snare = (t, g = .3) => {
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = .7;
      const v = ctx.createGain(); env(v, t, .001, g, .1);
      const n = noiseSrc(t, .12); n.connect(f); f.connect(v); v.connect(master);
      const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(160, t + .06);
      const ov = ctx.createGain(); env(ov, t, .001, g * .6, .08); o.connect(ov); ov.connect(master); o.start(t); o.stop(t + .12);
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
      const v = ctx.createGain(); env(v, t, .004, g, dur); f.connect(v); v.connect(send);
      notes.forEach(m => [-9, 9].forEach(c => {
        const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = c;
        const p = ctx.createStereoPanner(); p.pan.value = c > 0 ? .35 : -.35; o.connect(p); p.connect(f);
        o.start(t); o.stop(t + dur + .05);
      }));
    };
    const pad = (t, notes, dur, g = .035, cutoff = 1400) => {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = cutoff; f.Q.value = .5;
      const v = ctx.createGain();
      v.gain.setValueAtTime(.0001, t); v.gain.exponentialRampToValueAtTime(g, t + .35);
      v.gain.setValueAtTime(g, t + dur - .25); v.gain.exponentialRampToValueAtTime(.0001, t + dur);
      f.connect(v); v.connect(duck);
      notes.forEach(m => [-14, 0, 14].forEach((c, k) => {
        const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = hz(m - 12); o.detune.value = c;
        const p = ctx.createStereoPanner(); p.pan.value = (k - 1) * .7; o.connect(p); p.connect(f);
        o.start(t); o.stop(t + dur + .05);
      }));
    };
    const lead = (t, m, dur, g = .075) => {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 2;
      f.frequency.setValueAtTime(4200, t); f.frequency.exponentialRampToValueAtTime(1600, t + dur);
      const v = ctx.createGain();
      v.gain.setValueAtTime(.0001, t); v.gain.exponentialRampToValueAtTime(g, t + .008);
      v.gain.exponentialRampToValueAtTime(g * .55, t + .08); v.gain.exponentialRampToValueAtTime(.0001, t + dur);
      [-6, 6].forEach(c => {
        const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = hz(m); o.detune.value = c;
        o.connect(f); o.start(t); o.stop(t + dur + .05);
      });
      const tri = ctx.createOscillator(); tri.type = "triangle"; tri.frequency.value = hz(m + 12);
      const tv = ctx.createGain(); tv.gain.value = .5; tri.connect(tv); tv.connect(f); tri.start(t); tri.stop(t + dur + .05);
      f.connect(v); pan(v, .12).connect(send);
    };
    const pluck = (t, m, g = .07, p = -.3) => {
      const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = hz(m);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(4000, t); f.frequency.exponentialRampToValueAtTime(700, t + .14);
      const v = ctx.createGain(); env(v, t, .002, g, .15);
      o.connect(f); f.connect(v); pan(v, p).connect(send); o.start(t); o.stop(t + .2);
    };
    const whoosh = (t, dur = .55, g = .32, from = 300, to = 7000) => {
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.6;
      f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
      const v = ctx.createGain(); v.gain.setValueAtTime(.0001, t);
      v.gain.exponentialRampToValueAtTime(g, t + dur * .8); v.gain.exponentialRampToValueAtTime(.0001, t + dur);
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
      const v = ctx.createGain(); env(v, t, .003, g * k, 1.4); o.connect(v); v.connect(master); v.connect(delay); o.start(t); o.stop(t + 1.6);
    });

    const inR = (t, [a, b]) => t >= a && t < b;
    const full = t => t >= DROP && !inR(t, CALM) && !inR(t, BREAK) && t < CLICK;
    const nearCut = t => CUTS.some(c => t >= c - BEAT && t < c);

    // ---------- Pads (um acorde por compasso) ----------
    for (let t0 = 0; t0 < CLICK; t0 += 2) {
      const name = chordAt(t0);
      if (t0 < INTRO) pad(t0, CHORD[name], 2, .03, 600 + t0 * 180);
      else if (t0 < DROP) pad(t0, CHORD[name], 2, .035, 1500 + (t0 - INTRO) * 300);
      else if (inR(t0, CALM)) pad(t0, CHORD[name], 2, .05, 1800);
      else if (t0 >= BREAK[0] && t0 < BREAK[1]) continue;
      else pad(t0, CHORD[name], 2, .035, 1500);
    }

    // ---------- Grade de 16 avos ----------
    for (let step = 0; step * S16 < CLICK; step++) {
      const t = step * S16, inBar = step % 16, beat = step % 4 === 0;
      const name = chordAt(t), chord = CHORD[name], root = ROOT[name];

      // stabs sincopados
      if ([0, 3, 6, 10, 13].includes(inBar) && !inR(t, CALM) && !inR(t, BREAK)) {
        if (t < DROP) {
          const k = t / DROP;
          stab(t, chord, .26, .1 + .08 * k, 350 + Math.pow(k, 2) * 3200);
        } else stab(t, chord.map(n => n + 12), .26, .1, 3200);
      }

      // intro: hats crescendo
      if (t >= 2.5 && t < INTRO) hat(t, .02 + .05 * (t - 2.5) / 2.5, .03);
      // build (5–9): bumbo em meio-tempo, hats, baixo leve
      if (t >= INTRO && t < DROP) {
        if (step % 8 === 0) kick(t, .8);
        hat(t, step % 4 === 2 ? .12 : .045, step % 4 === 2 ? .09 : .03);
        if (step % 4 === 2) bass(t, root, S8 - .02, .3);
      }
      // groove completo
      if (full(t)) {
        if (beat) kick(t);
        if (step % 8 === 4 && !nearCut(t)) clap(t);
        if (step % 4 === 2) hat(t, .16, .11, .3); else hat(t, .055, .03, -.25);
        if (step % 4 === 2) bass(t, root, S8 - .02);
        if (step % 4 === 3) bass(t, root + 12, S16 * .9, .22);
      }
      // respiro (Clareza): arpejo suave e hats leves
      if (inR(t, CALM)) {
        pluck(t, chord[[0, 1, 2, 1, 2, 0, 2, 1][step % 8]] + 12, .06, (step % 2 ? .3 : -.3));
        if (step % 4 === 2) hat(t, .05, .06, .2);
        if (t >= CALM[1] - 2 && step % 2 === 0) kick(t, .25 + .5 * (t - (CALM[1] - 2)) / 2);
      }
      // melodia + arpejo por baixo
      const mel = melodyAt(t);
      if (mel && step % 2 === 0) {
        const phrase = mel[name], i = (step % 16) / 2, m = phrase[i];
        if (m) { let k = i + 1; while (k < 8 && phrase[k] === null) k++; lead(t, m, (k - i) * S8 * .92); }
      }
      if (full(t)) pluck(t, chord[[0, 1, 2, 1][step % 4]] + 12, mel ? .04 : .065);
    }

    // ---------- Transições ----------
    // build → drop
    for (let t = 7; t < DROP - .01; t += (t < 8 ? S8 : S16)) clap(t, .1 + .3 * (t - 7) / 2);
    whoosh(5.5, DROP - 5.5, .5, 250, 9000);
    boom(DROP); crash(DROP, .32, 1.8); kick(DROP, 1.1);
    // respiro → segundo drop
    for (let t = CALM[1] - 1; t < CALM[1] - .01; t += S16) snare(t, .1 + .25 * (t - (CALM[1] - 1)));
    whoosh(CALM[1] - 2, 2, .45, 300, 9000);
    boom(CALM[1]); crash(CALM[1], .3, 1.6); kick(CALM[1], 1.1);
    // pausa antes do final
    whoosh(BREAK[0], BREAK[1] - BREAK[0], .4, 500, 10000);
    for (let k = 0; k < 8; k++) snare(BREAK[0] + k * S16 / 2 + .25, .1 + k * .03);
    boom(BREAK[1], .8); crash(BREAK[1], .3, 1.6); kick(BREAK[1], 1.1);
    // demais cortes: whoosh no wipe, prato no tempo forte, virada de caixa antes
    CUTS.forEach(c => {
      if (c === DROP || c === CALM[1] || c === BREAK[1]) return;
      whoosh(c - .55, .55, .42, 300, 7500);
      crash(c, .2, 1);
      if (c > DROP && c < CLICK && !inR(c - .1, CALM)) for (let k = 0; k < 4; k++) snare(c - BEAT + k * S16, .12 + k * .05);
    });

    // ---------- Clique no "Seguir" + final ----------
    uiClick(CLICK - .08);
    kick(CLICK, 1); boom(CLICK, .5); crash(CLICK, .26, 1.6);
    stab(CLICK, [60, 64, 67, 72, 76], 1.2, .13, 4200);
    pad(CLICK, [60, 64, 67, 72], 1.9, .05, 2200);
    bass(CLICK, 36, 1.1, .45);
    lead(CLICK, 84, .8, .06);
    ding(CLICK + .02);

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
    const k = peak ? .89 / peak : 1, n = Math.min(buf.length, buf.sampleRate * LEN), fade = Math.floor(.8 * buf.sampleRate);
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
