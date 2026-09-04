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
  const rideCount = rides.length;
  const rank = useMemo(() => crewRank(crew), [crew]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-void px-3 pb-4 pt-10">
      {/* Brand lockup — graffiti lightning */}
      <div className="flex items-center gap-2.5 pr-2">
        <GraffitiB className="h-12 w-12 shrink-0 drop-shadow-[0_0_18px_rgba(0,255,138,0.7)]" />
        <img
          src={asset('brand/boltorium-graffiti-v1.png')}
          alt="BOLTORIUM"
          className="h-11 w-[min(62%,240px)] object-contain object-left drop-shadow-[0_0_20px_rgba(0,255,138,0.55)]"
        />
      </div>

      {/* Bento glass dashboard (live-style) */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {/* Boltz balance — spans 2 */}
        <div
          className="glass-card col-span-2 flex min-h-[168px] flex-col justify-between p-4"
          data-testid="boltz-balance-card"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="hud-label text-gold/90">BOLTZ BALANCE</p>
              <p
                className="stat-number mt-1 font-hud text-4xl font-extrabold tracking-tight text-gold text-glow-gold"
                data-testid="boltz-balance-value"
              >
                {formatInt(boltz)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 shadow-[0_0_15px_rgba(255,180,0,0.25)]">
              <span className="font-hud text-sm font-extrabold text-gold">BZ</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={() => nav('/ride')}
              className="btn-primary flex-1"
              data-testid="start-ride-btn"
            >
              <BoltIcon /> Start Ride
            </button>
            <button
              type="button"
              onClick={() => nav('/wallet')}
              className="flex flex-1 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2.5 font-hud text-xs font-bold uppercase tracking-wider text-bone/85 transition active:scale-[0.98]"
              data-testid="view-wallet-btn"
            >
              View Wallet
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => nav('/rank')}
          className="glass-card box-glow p-4 text-left"
          data-testid="level-card"
        >
          <p className="hud-label">VOLT TIER</p>
          <p className="mt-1 font-hud text-2xl font-extrabold text-bolt">{volt.name}</p>
          <p className="font-mono text-[11px] font-bold text-solana">LVL {volt.level}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#00ff8a] to-[#7a00ff]" style={{ width: `${volt.pct}%` }} />
          </div>
          <p className="mt-1 font-mono text-[8px] text-bone/40">
            {volt.into} / {volt.need} XP
          </p>
        </button>

        <button
          type="button"
          onClick={() => nav('/rank')}
          className="glass-card box-glow p-4 text-left"
          data-testid="rank-card"
        >
          <p className="hud-label">RANK</p>
          <p className="mt-1 font-hud text-3xl font-extrabold text-cyan">#{rank.place}</p>
          <p className="font-mono text-[11px] font-bold text-cyan/80">TOP {rank.pct}%</p>
        </button>

        <button
          type="button"
          onClick={() => nav('/map')}
          className="glass-card p-4 text-left"
          data-testid="distance-card"
        >
          <p className="hud-label">TOTAL DISTANCE</p>
          <p className="mt-1 font-hud text-2xl font-extrabold text-bolt">
            {formatKm(km)} <span className="text-sm text-bone/50">KM</span>
          </p>
        </button>

        <button
          type="button"
          onClick={() => nav('/feed')}
          className="glass-card p-4 text-left"
          data-testid="rides-card"
        >
          <p className="hud-label">TOTAL RIDES</p>
          <p className="mt-1 font-hud text-2xl font-extrabold text-bone">{rideCount}</p>
        </button>

        <button
          type="button"
          onClick={() => nav('/garage')}
          className="glass-card col-span-2 flex items-center justify-between gap-3 p-4 text-left"
          data-testid="vehicle-card"
        >
          <div>
            <p className="hud-label">VEHICLE</p>
            <p className="mt-1 font-hud text-xl font-extrabold capitalize text-bolt">
              {vehicle.label}
            </p>
          </div>
          <span className="rounded-full border border-bolt/35 bg-bolt/10 px-3 py-1 font-mono text-[10px] text-bolt">
            GARAGE →
          </span>
        </button>
      </div>

      <p className="hud-label mt-5 px-0.5 text-bone/45">Quick Access</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        <Quick label="Map" color="text-cyan border-cyan/40" onClick={() => nav('/map')} icon={<MapPin />} />
        <Quick label="Rank" color="text-bolt border-bolt/40" onClick={() => nav('/rank')} icon={<Bars />} />
        <Quick label="Airdrops" color="text-cyan border-cyan/40" onClick={() => nav('/airdrops')} icon={<Chute />} />
        <Quick label="Missions" color="text-solana border-solana/40" onClick={() => nav('/missions')} icon={<BoltIcon className="h-5 w-5" />} />
      </div>

      <p className="tagline mt-6 pb-2 text-center text-[9px]">Ride the Lightning</p>
    </div>
  );
}

function Quick({ label, color, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`glass flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border ${color}`}
    >
      {icon}
      <span className="font-hud text-[9px] font-extrabold uppercase tracking-wide">{label}</span>
    </button>
  );
}

function BoltIcon({ className = 'mr-1 inline h-4 w-4' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13 2 4 14h7l-2 8 11-14h-7l2-6z" />
    </svg>
  );
}
function Chute() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 10c0-5 3.2-8 8-8s8 3 8 8" />
      <path d="M4 10h16 M6 10 12 20 18 10" />
    </svg>
  );
}
function MapPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
function Bars() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 19V10 M12 19V5 M16 19v-6" />
    </svg>
  );
}
