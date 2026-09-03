import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listVehicles } from '../lib/vehicles.js';
import { useStore } from '../state/store.jsx';
import { formatInt } from '../lib/format.js';
import { asset } from '../lib/asset.js';
import VaultBg from '../components/VaultBg.jsx';

const CATALOG = listVehicles();
const CATS = ['EUC', 'E-MOTO', 'SCOOTER', 'AIR'];
const MOTO_IDS = new Set(['emoto', 'dirtbike', 'motorcycle', 'quad', 'gocart', 'diy_conversion']);

const THROTTLE = ['ECO', 'SPORT', 'BEAST'];
const REGEN = ['LOW', 'MED', 'HIGH'];
const LIGHTS = ['OFF', 'NEON', 'PULSE'];
const REGEN_FULL = ['LOW', 'MEDIUM', 'HIGH'];

function catOf(v) {
  if (v.id === 'euc' || v.id === 'onewheel') return 'EUC';
  if (v.surface === 'air') return 'AIR';
  if (MOTO_IDS.has(v.id)) return 'E-MOTO';
  return 'SCOOTER';
}

const GEAR = [
  { id: 's1', name: 'AOP HOODIE', rarity: 'RARE' },
  { id: 's2', name: 'BOLTORIUM HELMET', rarity: 'EPIC' },
];

export default function Garage() {
  const nav = useNavigate();
  const { vehicleId, setVehicle, vehicle, boltz } = useStore();
  const [cat, setCat] = useState('EUC');
  const [throttle, setThrottle] = useState(1);
  const [regen, setRegen] = useState(1);
  const [lights, setLights] = useState(1);

  const fleet = useMemo(() => CATALOG.filter((v) => catOf(v) === cat), [cat]);

  const reset = () => {
    setThrottle(1);
    setRegen(1);
    setLights(1);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-5 pt-11">
      <VaultBg src="brand/garage-3d.png" opacity={0.12} blur={16} />

      <header className="relative flex items-center justify-between gap-2 pr-10">
        <p className="headline text-[1.65rem] leading-none text-gold">GARAGE + TUNE</p>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-full border border-gold/40 bg-void px-2.5 py-1">
            <span className="text-gold">⚡</span>
            <span className="font-hud text-sm text-gold">{formatInt(boltz)}</span>
          </div>
          <button
            type="button"
            onClick={() => nav('/wallet')}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/40 text-gold"
            aria-label="Add Boltz"
          >
            +
          </button>
        </div>
      </header>

      <div className="relative mt-4 flex gap-1.5 overflow-x-auto">
        {CATS.map((c) => {
          const on = c === cat;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 font-display text-[12px] italic font-extrabold tracking-wide ${
                on
                  ? 'border border-gold bg-gold/10 text-gold shadow-gold'
                  : 'border border-transparent bg-graphite text-bone/50'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-gold/25 bg-graphite/80">
        <div className="flex items-start justify-between px-3 pt-3">
          <div>
            <p className="headline text-base text-bone">YOUR RIDE</p>
            <p className="hud-label mt-0.5 text-gold">{vehicle.label.toUpperCase()}</p>
          </div>
          <p className="flex items-center gap-1.5 font-hud text-sm text-bone">
            100%
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] text-void">
              ⚡
            </span>
          </p>
        </div>
        <div className="relative mx-auto h-40 w-full">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(212,175,55,0.14),transparent_58%)]" />
          <RideArt />
          <img
            src={asset('brand/bmark-icon.png')}
            alt=""
            className="pointer-events-none absolute bottom-2 left-1/2 h-16 w-16 -translate-x-1/2 object-contain"
          />
        </div>
      </div>

      <div className="relative mt-3 rounded-2xl border border-gold/20 bg-void/55 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="headline text-sm text-bone">EQUIPPED GEAR</p>
          <button type="button" onClick={() => nav('/tune')} className="hud-label text-gold">
            CUSTOMIZE
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {GEAR.map((g) => (
            <div key={g.id} className="rounded-xl border border-gold/15 bg-void p-2">
              <div className="flex h-20 items-center justify-center">
                <img
                  src={asset('brand/bmark-icon.png')}
                  alt=""
                  className="h-16 w-16 object-contain"
                />
              </div>
              <p className="headline text-[12px] text-bone">{g.name}</p>
              <p className="hud-label mt-0.5 text-gold">{g.rarity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-3 rounded-2xl border border-gold/20 bg-void/55 p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="headline text-sm text-bone">TUNE</p>
          <button type="button" onClick={reset} className="hud-label text-gold">
            RESET
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <TuneSlider
            label="THROTTLE MAP"
            value={throttle}
            onChange={setThrottle}
            marks={THROTTLE}
            active={THROTTLE[throttle]}
          />
          <TuneSlider
            label="REGEN"
            value={regen}
            onChange={setRegen}
            marks={REGEN}
            active={REGEN_FULL[regen]}
          />
          <TuneSlider
            label="LIGHTS"
            value={lights}
            onChange={setLights}
            marks={LIGHTS}
            active={LIGHTS[lights]}
          />
        </div>
      </div>

      <p className="relative hud-label mt-4 text-gold">FLEET · {cat}</p>
      <p className="relative mt-0.5 text-[11px] text-bone/45">Full catalog. Hoverboard and Segway are not classes.</p>
      <div className="relative mt-2 grid grid-cols-2 gap-2">
        {fleet.map((v) => {
          const on = v.id === vehicleId;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setVehicle(v.id)}
              className={`rounded-2xl border p-3 text-left ${
                on ? 'border-gold bg-gold/15 shadow-gold' : 'border-gold/15 bg-void/70'
              }`}
            >
              <p className="text-lg">{v.icon}</p>
              <p className="headline text-base">{v.label}</p>
              <p className="hud-label mt-1">
                {v.surface} · {v.maxSpeedKmh} KM/H
              </p>
              <p className="text-[10px] text-cyan">
                {v.electric ? '1.5× ELECTRIC' : '1.0×'} · IMU {v.imuEnergy.band}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TuneSlider({ label, value, onChange, marks, active }) {
  return (
    <div className="px-1">
      <p className="font-display text-[9px] italic font-bold tracking-wide text-bone">{label}</p>
      <p className="headline mt-0.5 text-[13px] text-gold">{active}</p>
      <input
        className="tune-range mt-2"
        type="range"
        min={0}
        max={2}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <div className="mt-1 flex justify-between">
        {marks.map((m, i) => (
          <span key={m} className={`font-mono text-[8px] ${i === value ? 'text-gold' : 'text-bone/35'}`}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function RideArt() {
  return (
    <svg viewBox="0 0 320 150" className="absolute inset-0 h-full w-full" aria-hidden>
      <ellipse cx="160" cy="128" rx="110" ry="10" fill="rgba(212,175,55,0.1)" />
      <g fill="none" stroke="#D4AF37" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="78" cy="108" r="26" />
        <circle cx="78" cy="108" r="10" />
        <circle cx="232" cy="108" r="28" />
        <circle cx="232" cy="108" r="11" />
        <path d="M78 108 L118 62 H168 L210 108" />
        <path d="M118 62 L138 28 H188 L176 62" />
        <path d="M168 62 L200 40 H236 L248 70" />
        <path d="M210 108 L186 78 H140" />
        <path d="M236 40 L252 28" />
      </g>
      <circle cx="252" cy="28" r="5" fill="#F5F5F0" opacity="0.85" />
    </svg>
  );
}
