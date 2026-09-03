import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../state/store.jsx';
import { formatInt } from '../lib/format.js';
import { asset } from '../lib/asset.js';


const MAPS = ['ECO', 'STREET', 'RACE'];
const CURVES = ['LINEAR', 'SMOOTH', 'AGGRESSIVE'];
const PRESETS = ['STOCK', 'STREET', 'RACE', 'CUSTOM'];

export const TUNE_PRESETS = {
  STOCK: { powerMap: 0, regen: 18, peakAmps: 48, throttle: 0, preset: 'STOCK' },
  STREET: { powerMap: 1, regen: 32, peakAmps: 64, throttle: 1, preset: 'STREET' },
  RACE: { powerMap: 2, regen: 42, peakAmps: 80, throttle: 2, preset: 'RACE' },
};

export const TUNE_DEFAULT = { ...TUNE_PRESETS.RACE };

export function normalizeTune(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.powerMap !== 'number') {
    return { ...TUNE_DEFAULT };
  }
  const clamp = (n, a, b) => Math.min(b, Math.max(a, Number(n) || a));
  const next = {
    powerMap: clamp(raw.powerMap, 0, 2),
    regen: clamp(raw.regen, 0, 100),
    peakAmps: clamp(raw.peakAmps, 30, 120),
    throttle: clamp(raw.throttle, 0, 2),
    preset: PRESETS.includes(raw.preset) ? raw.preset : 'CUSTOM',
  };
  const match = Object.values(TUNE_PRESETS).find(
    (p) =>
      p.powerMap === next.powerMap &&
      p.regen === next.regen &&
      p.peakAmps === next.peakAmps &&
      p.throttle === next.throttle,
  );
  next.preset = match ? match.preset : 'CUSTOM';
  return next;
}

function sameTune(a, b) {
  return (
    a.powerMap === b.powerMap &&
    a.regen === b.regen &&
    a.peakAmps === b.peakAmps &&
    a.throttle === b.throttle
  );
}

export default function Tune() {
  const { boltz, tune, setTune } = useStore();
  const saved = useMemo(() => normalizeTune(tune), [tune]);
  const [draft, setDraft] = useState(saved);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const patch = (partial) => {
    setDraft((d) => {
      const next = { ...d, ...partial };
      const match = Object.values(TUNE_PRESETS).find(
        (p) =>
          p.powerMap === next.powerMap &&
          p.regen === next.regen &&
          p.peakAmps === next.peakAmps &&
          p.throttle === next.throttle,
      );
      next.preset = match ? match.preset : 'CUSTOM';
      return next;
    });
  };

  const applyPreset = (name) => {
    if (name === 'CUSTOM') {
      patch({ preset: 'CUSTOM' });
      return;
    }
    setDraft({ ...TUNE_PRESETS[name] });
  };

  const save = () => {
    setTune({ ...draft });
    setFlash('SAVED');
    setTimeout(() => setFlash(''), 1200);
  };

  const reset = () => {
    setDraft({ ...TUNE_PRESETS.STOCK });
    setTune({ ...TUNE_PRESETS.STOCK });
    setFlash('RESET');
    setTimeout(() => setFlash(''), 1200);
  };

  const dirty = !sameTune(draft, saved);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-5 pt-11">
      <header className="flex items-center justify-between gap-2 pr-10">
        <img
          src={asset('brand/bmark-icon.png')}
          alt=""
          className="graffiti-only h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(34,224,106,0.65)]"
        />
        <h1 className="headline text-[1.7rem] leading-none text-white">TUNE</h1>
        <span className="coin-pill">
          ⚡ {formatInt(boltz)} BOLTZ
        </span>
      </header>

      <div className="relative mt-4 overflow-hidden rounded-[20px] border border-stroke bg-surface">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(56,189,248,0.18),transparent_55%)]" />
        <LightningMark />
        <div className="relative px-4 pt-4">
          <p className="headline text-lg leading-none text-white">SUR-RON LIGHT BEE X</p>
          <div className="mt-1.5 flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-plasma">
              <HexIcon />
              E-MOTO
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-plasma">
              <BtIcon />
              CONNECTED
            </span>
          </div>
        </div>
        <div className="relative mx-auto h-36 w-full">
          <BeeX />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <TuneCard>
          <p className="hud-label text-white/55">POWER MAP</p>
          <div className="mt-2 flex items-center justify-between">
            {MAPS.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => patch({ powerMap: i })}
                className={`rounded-full px-3 py-0.5 font-display text-[12px] italic font-extrabold tracking-wide ${
                  draft.powerMap === i ? 'bg-bolt text-void shadow-bolt' : 'text-white/45'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <input
            className="tune-range mt-3"
            type="range"
            min={0}
            max={2}
            step={1}
            value={draft.powerMap}
            onChange={(e) => patch({ powerMap: Number(e.target.value) })}
            style={fillStyle((draft.powerMap / 2) * 100)}
            aria-label="Power map"
          />
        </TuneCard>

        <TuneCard>
          <div className="flex items-center justify-between">
            <p className="hud-label text-white/55">REGEN</p>
            <p className="headline text-lg text-bolt">{draft.regen}%</p>
          </div>
          <input
            className="tune-range mt-3"
            type="range"
            min={0}
            max={100}
            value={draft.regen}
            onChange={(e) => patch({ regen: Number(e.target.value) })}
            style={fillStyle(draft.regen)}
            aria-label="Regen"
          />
        </TuneCard>

        <TuneCard>
          <div className="flex items-center justify-between">
            <p className="hud-label text-white/55">PEAK AMPS</p>
            <p className="headline text-lg text-bolt">{draft.peakAmps}A</p>
          </div>
          <input
            className="tune-range mt-3"
            type="range"
            min={30}
            max={120}
            value={draft.peakAmps}
            onChange={(e) => patch({ peakAmps: Number(e.target.value) })}
            style={fillStyle(((draft.peakAmps - 30) / 90) * 100)}
            aria-label="Peak amps"
          />
        </TuneCard>

        <TuneCard>
          <div className="flex items-center justify-between">
            <p className="hud-label text-white/55">THROTTLE CURVE</p>
            <p className="headline text-[15px] text-bolt">{CURVES[draft.throttle]}</p>
          </div>
          <input
            className="tune-range mt-3"
            type="range"
            min={0}
            max={2}
            step={1}
            value={draft.throttle}
            onChange={(e) => patch({ throttle: Number(e.target.value) })}
            style={fillStyle((draft.throttle / 2) * 100)}
            aria-label="Throttle curve"
          />
        </TuneCard>
      </div>

      <div className="mt-3 flex gap-1.5">
        {PRESETS.map((name) => {
          const on = draft.preset === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => applyPreset(name)}
              className={`chip-tab flex-1 px-0 ${on ? 'chip-tab-on' : ''}`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-bolt flex-1" onClick={save}>
          <BoltMini />
          {flash === 'SAVED' ? 'SAVED' : dirty ? 'SAVE MAP' : 'SAVE MAP'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex h-14 shrink-0 items-center justify-center rounded-[18px] border border-stroke bg-surface px-6 font-display text-lg italic font-extrabold uppercase tracking-wider text-white/55"
        >
          {flash === 'RESET' ? 'OK' : 'RESET'}
        </button>
      </div>
    </div>
  );
}

function fillStyle(pct) {
  const p = Math.min(100, Math.max(0, pct));
  return {
    background: `linear-gradient(to right, #22E06A ${p}%, #1C2420 ${p}%)`,
    boxShadow: '0 0 10px rgba(34, 224, 106, 0.35)',
  };
}

function TuneCard({ children }) {
  return <div className="rounded-[18px] border border-stroke bg-surface px-3.5 py-3">{children}</div>;
}

function BoltMini() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden>
      <path d="M8.2 1 L2 9.4 h5 L4.6 17 L12.2 7.6 H7.4 Z" fill="#080A09" />
    </svg>
  );
}

function HexIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 12 13" fill="none" aria-hidden>
      <path d="M6 1 L11 4 V9 L6 12 L1 9 V4 Z" stroke="#38BDF8" strokeWidth="1.2" />
    </svg>
  );
}

function BtIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden>
      <path d="M2 4 L8 9 L5 12 V2 L8 5 L2 10" stroke="#38BDF8" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function LightningMark() {
  return (
    <svg
      className="pointer-events-none absolute right-2 top-1 h-28 w-24 opacity-70"
      viewBox="0 0 80 120"
      fill="none"
      aria-hidden
    >
      <path
        d="M48 4 L22 58 H46 L18 116 L72 48 H44 Z"
        stroke="#38BDF8"
        strokeWidth="1.6"
        opacity="0.85"
        filter="url(#tl)"
      />
      <defs>
        <filter id="tl" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function BeeX() {
  return (
    <svg viewBox="0 0 360 150" className="absolute inset-0 h-full w-full" aria-hidden>
      <ellipse cx="180" cy="132" rx="118" ry="10" fill="rgba(56,189,248,0.1)" />
      <g fill="none" stroke="#E8E8E8" strokeWidth="2.1" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="86" cy="112" r="28" />
        <circle cx="86" cy="112" r="11" />
        <circle cx="268" cy="112" r="30" />
        <circle cx="268" cy="112" r="12" />
        <path d="M86 112 L118 78 H168 L198 54 H236 L258 112" />
        <path d="M118 78 L132 42 H198 L186 78" />
        <path d="M168 78 L214 78" />
        <path d="M198 54 L248 40" />
        <path d="M236 40 L252 28" />
        <path d="M132 54 H176" />
        <path d="M214 78 L230 96 H250" />
      </g>
      <path d="M140 58 h28 v10 h-28 z" fill="#22E06A" opacity="0.85" />
      <circle cx="252" cy="28" r="4.5" fill="#38BDF8" />
      <path d="M96 112 h-20 M268 112 h22" stroke="#22E06A" strokeWidth="1.4" opacity="0.7" />
    </svg>
  );
}
