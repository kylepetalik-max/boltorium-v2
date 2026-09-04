import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { formatInt, formatKm } from '../lib/format.js';
import { voltFromXp, crewRank } from '../lib/progress.js';
import { asset } from '../lib/asset.js';
import VaultBg from '../components/VaultBg.jsx';

export default function Home() {
  const nav = useNavigate();
  const { boltz, xp, vehicle, rides, crew } = useStore();
  const volt = voltFromXp(xp);
  const km = rides.reduce((n, r) => n + (r.distanceM || 0), 0);
  const rank = useMemo(() => crewRank(crew), [crew]);
  const recent = rides.slice(0, 3);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VaultBg src="brand/home-3d.png" opacity={0.18} blur={16} />
      <div className="plasma-sparks z-[1]" aria-hidden>
        <span /><span /><span /><span /><span />
      </div>

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col px-4 pb-4 pt-10">
        <div className="flex items-center justify-between gap-2 pr-8">
          <img
            src={asset('brand/boltorium-graffiti-v1.png')}
            alt="BOLTORIUM"
            className="h-11 w-[58%] max-w-[220px] object-contain object-left"
          />
          <button
            type="button"
            onClick={() => nav('/wallet')}
            className="coin-pill shrink-0"
          >
            ⚡ {formatInt(boltz)}
          </button>
        </div>
        <p className="tagline mt-1 text-[9px]">Ride the Lightning</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => nav('/ride')}
            className="cv-card flex flex-col items-start p-4 text-left active:scale-[0.98]"
          >
            <p className="hud-label text-bolt">Ignition</p>
            <p className="headline mt-1 text-xl text-bone">START RIDE</p>
            <p className="mt-1 text-[11px] text-bone/50">Safety gate → GPS HUD</p>
          </button>
          <button
            type="button"
            onClick={() => nav('/missions')}
            className="holo-card flex flex-col items-start rounded-2xl p-4 text-left"
          >
            <p className="hud-label text-cyan">Missions</p>
            <p className="headline mt-1 text-lg text-bone">WEEKLY</p>
            <p className="mt-1 text-[11px] text-bone/50">Teaser · open board</p>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Holo k="SPARK" v={`${volt.name} L${volt.level}`} onClick={() => nav('/rank')} />
          <Holo k="RANK" v={`#${rank.place}`} onClick={() => nav('/rank')} />
          <Holo k={vehicle.label.toUpperCase()} v={`${formatKm(km)} KM`} onClick={() => nav('/garage')} />
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-void/55 p-3">
          <div className="flex items-center justify-between">
            <p className="headline text-sm text-bone">ACTIVITY</p>
            <button type="button" onClick={() => nav('/feed')} className="hud-label text-cyan">
              FEED
            </button>
          </div>
          {recent.length === 0 ? (
            <p className="mt-2 text-sm text-bone/45">No rides yet — hit Start Ride and charge up.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl bg-white/5 px-2.5 py-2 text-sm">
                  <span className="text-bone/80">{formatKm(r.distanceM || 0)} km</span>
                  <span className="font-hud font-bold text-bolt">+{formatInt(r.awarded || 0)} BZ</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => nav('/garage')} className="holo-card rounded-2xl p-3 text-left">
            <p className="hud-label text-cyan">Garage</p>
            <p className="headline mt-1 text-bone">{vehicle.label}</p>
          </button>
          <button type="button" onClick={() => nav('/shop')} className="holo-card rounded-2xl p-3 text-left">
            <p className="hud-label text-solana">Shop</p>
            <p className="headline mt-1 text-bone">Marketplace</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function Holo({ k, v, onClick }) {
  return (
    <button type="button" onClick={onClick} className="holo-card rounded-2xl px-2.5 py-3 text-left">
      <p className="hud-label text-[8px] text-cyan/80">{k}</p>
      <p className="headline mt-1 text-[13px] leading-none text-bolt">{v}</p>
    </button>
  );
}
