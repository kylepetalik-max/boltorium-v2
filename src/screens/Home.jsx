import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { formatInt, formatKm } from '../lib/format.js';
import { voltFromXp, crewRank } from '../lib/progress.js';
import { asset } from '../lib/asset.js';
import { GraffitiB } from '../components/BMark.jsx';

export default function Home() {
  const nav = useNavigate();
  const { boltz, xp, vehicle, rides, crew } = useStore();
  const volt = voltFromXp(xp);
  const km = rides.reduce((n, r) => n + (r.distanceM || 0), 0);
  const rank = useMemo(() => crewRank(crew), [crew]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-void px-4 pb-3 pt-11">
      <div className="flex items-center gap-3 pr-10">
        <GraffitiB className="h-14 w-14 shrink-0 drop-shadow-[0_0_14px_rgba(34,224,106,0.65)]" />
        <img
          src={asset('brand/boltorium-graffiti-v1.png')}
          alt="BOLTORIUM"
          className="h-12 w-[min(58%,220px)] object-contain object-left drop-shadow-[0_0_14px_rgba(34,224,106,0.45)]"
        />
      </div>

      <h1 className="mt-5 font-display text-[1.85rem] font-extrabold italic uppercase leading-none tracking-wide text-bone">
        Welcome back.
      </h1>

      <div className="mt-4 flex items-center gap-2">
        <p className="hud-label text-bone/55">Boltz</p>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-bolt/50 bg-bolt/10 px-2 py-0.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-bolt text-[9px] font-extrabold text-void">
            BZ
          </span>
          <span className="font-hud text-lg font-extrabold italic text-bolt">{formatInt(boltz)}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => nav('/ride')}
        className="btn-bolt mt-4 !h-12 !rounded-full shadow-[0_0_28px_rgba(34,224,106,0.55)]"
      >
        Start Ride <span aria-hidden>⚡</span>
      </button>

      <div className="mt-5 grid grid-cols-3 gap-0 divide-x divide-white/10 border-y border-white/10 py-3">
        <button type="button" onClick={() => nav('/rank')} className="px-2 text-left">
          <p className="hud-label text-[8px] text-bone/50">Volt Tier</p>
          <p className="mt-1 font-display text-base font-extrabold italic text-bolt">{volt.name}</p>
          <p className="text-[11px] font-bold text-solana">LVL {volt.level}</p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan to-solana" style={{ width: `${volt.pct}%` }} />
          </div>
          <p className="mt-1 font-mono text-[8px] text-bone/40">
            {volt.into} / {volt.need} XP
          </p>
        </button>
        <button type="button" onClick={() => nav('/rank')} className="px-2 text-center">
          <p className="hud-label text-[8px] text-bone/50">Rank</p>
          <p className="mt-1 font-display text-2xl font-extrabold italic text-cyan">#{rank.place}</p>
          <p className="text-[10px] font-bold text-cyan/80">TOP {rank.pct}%</p>
        </button>
        <button type="button" onClick={() => nav('/garage')} className="px-2 text-right">
          <p className="hud-label text-[8px] text-bone/50">Vehicle</p>
          <p className="mt-1 font-display text-base font-extrabold italic text-bolt">
            {vehicle.label.toUpperCase()}
          </p>
          <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-bolt">
            <span>⚡</span>
            <span className="font-hud font-bold">{formatKm(km)} KM</span>
          </p>
        </button>
      </div>

      <p className="hud-label mt-5 text-bone/45">Quick Access</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        <Quick
          label="Airdrops"
          color="text-cyan border-cyan/45 shadow-[0_0_14px_rgba(56,189,248,0.2)]"
          onClick={() => nav('/airdrops')}
          icon={<Chute />}
        />
        <Quick
          label="Challenges"
          color="text-solana border-solana/45 shadow-[0_0_14px_rgba(139,92,246,0.2)]"
          onClick={() => nav('/missions')}
          icon={<Bolt />}
        />
        <Quick
          label="Garage"
          color="text-bolt border-bolt/45 shadow-[0_0_14px_rgba(34,224,106,0.2)]"
          onClick={() => nav('/garage')}
          icon={<GarageIcon />}
        />
        <Quick
          label="Shop"
          color="text-solana border-solana/45 shadow-[0_0_14px_rgba(139,92,246,0.2)]"
          onClick={() => nav('/shop')}
          icon={<Cart />}
        />
      </div>

      <p className="tagline mt-auto pt-5 text-center text-[9px]">Ride the Lightning</p>
    </div>
  );
}

function Quick({ label, color, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border bg-void/80 ${color}`}
    >
      {icon}
      <span className="font-display text-[9px] font-extrabold uppercase tracking-wide">{label}</span>
    </button>
  );
}

function Chute() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 10c0-5 3.2-8 8-8s8 3 8 8" />
      <path d="M4 10h16 M6 10 12 20 18 10" />
    </svg>
  );
}
function Bolt() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h7l-2 8 11-14h-7l2-6z" />
    </svg>
  );
}
function GarageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 20 V10 L12 4 l9 6 v10" />
      <path d="M8 20 v-6 h8 v6" />
    </svg>
  );
}
function Cart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.2 11h11.3l1.8-7H7" />
    </svg>
  );
}
