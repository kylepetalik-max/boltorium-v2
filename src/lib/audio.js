let ctx;

function ac() {
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  if (!ctx) ctx = new C();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(c, freq, t0, dur, type, gain, dest) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(dest || c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

/** Start-ride / UI beep. */
export function playBeep() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(c, 880, t, 0.09, 'square', 0.08);
  tone(c, 1320, t + 0.08, 0.12, 'square', 0.06);
}

/** Cha-ching — only on Striker PASS. Tiny Web Audio, not an mp3. */
export function playChaching() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  const master = c.createGain();
  master.gain.value = 0.9;
  master.connect(c.destination);
  tone(c, 987.77, t, 0.12, 'triangle', 0.12, master);
  tone(c, 1318.51, t + 0.07, 0.16, 'triangle', 0.14, master);
  tone(c, 1760, t + 0.14, 0.28, 'sine', 0.16, master);
  tone(c, 2093, t + 0.18, 0.35, 'sine', 0.08, master);
}

export function playFail() {
  const c = ac();
  if (!c) return;
  const t = c.currentTime;
  tone(c, 220, t, 0.22, 'sawtooth', 0.07);
  tone(c, 165, t + 0.12, 0.28, 'sawtooth', 0.05);
}
