import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listVehicles } from '../lib/vehicles.js';
import { useStore } from '../state/store.jsx';
import { formatInt } from '../lib/format.js';
import { asset } from '../lib/asset.js';

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
  const { vehicleId, setVehicle, boltz } = useStore();
  const [cat, setCat] = useState('E-MOTO');
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
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-void px-4 pb-5 pt-11">
      <header className="flex items-center justify-between gap-2 pr-10">
        <p className="font-display text-[1.65rem] font-extrabold italic uppercase leading-none tracking-wide text-bone">
          Garage + Tune
        </p>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-full border border-bolt/40 bg-void px-2.5 py-1">
            <span className="text-bolt">⚡</span>
            <span className="font-hud text-sm text-bolt">{formatInt(boltz)}</span>
          </div>
          <button
            type="button"
            onClick={() => nav('/wallet')}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-bolt/40 bg-bolt text-sm font-bold text-void"
            aria-label="Add Boltz"
          >
            +
          </button>
        </div>
      </header>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-display text-sm font-extrabold uppercase tracking-wide text-bone">Equipped Gear</p>
          <button type="button" onClick={() => nav('/tune')} className="font-display text-xs font-extrabold uppercase text-bolt">
            Customize
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {GEAR.map((g) => (
            <div key={g.id} className="rounded-2xl border border-white/10 bg-[#0c100e] p-2">
              <div className="flex h-20 items-center justify-center">
                <img src={asset('brand/bmark-icon.png')} alt="" className="h-16 w-16 object-contain" />
              </div>
              <p className="font-display text-[12px] font-extrabold uppercase text-bone">{g.name}</p>
              <p className="hud-label mt-0.5 text-bone/45">{g.rarity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-sm font-extrabold uppercase tracking-wide text-bone">Tune</p>
          <button type="button" onClick={reset} className="font-display text-xs font-extrabold uppercase text-bolt">
            Reset
          </button>
        </div>
        <div className="space-y-3">
          <TuneSlider label="Throttle Map" value={throttle} onChange={setThrottle} marks={THROTTLE} active={THROTTLE[throttle]} />
          <TuneSlider label="Regen" value={regen} onChange={setRegen} marks={REGEN} active={REGEN_FULL[regen]} />
          <TuneSlider label="Lights" value={lights} onChange={setLights} marks={LIGHTS} active={LIGHTS[lights]} />
        </div>
      </div>

      <div className="mt-5 flex gap-1.5 overflow-x-auto">
        {CATS.map((c) => {
          const on = c === cat;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 font-display text-[12px] font-extrabold tracking-wide ${
                on ? 'chip-tab-on' : 'border border-white/15 bg-void/60 text-bone/50'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <p className="hud-label mt-4 text-bone/45">Catalog</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {fleet.map((v) => {
          const on = v.id === vehicleId;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setVehicle(v.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                on ? 'border-bolt bg-bolt/10 shadow-bolt' : 'border-white/10 bg-[#0c100e]'
              }`}
            >
              <p className="text-lg">{v.icon}</p>
              <p className="font-display text-base font-extrabold uppercase">{v.label}</p>
              <p className="hud-label mt-1 text-bone/45">
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
    <div>
      <div className="flex items-center justify-between">
        <p className="font-display text-[11px] font-bold uppercase tracking-wide text-bone">{label}</p>
        <p className="font-display text-[12px] font-extrabold uppercase text-bolt">{active}</p>
      </div>
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
          <span key={m} className={`font-mono text-[8px] ${i === value ? 'text-bolt' : 'text-bone/35'}`}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
