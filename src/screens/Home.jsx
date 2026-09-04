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

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <VaultBg src="brand/home-3d.png" opacity={0.16} blur={20} />
      <div className="vault-hex pointer-events-none absolute inset-0 z-[1]" />
      <div className="plasma-sparks z-[1]" aria-hidden>
        <span /><span /><span /><span /><span />
      </div>

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col items-center px-5 pb-5 pt-11">
        <img
          src={asset('brand/logo-10.png')}
          alt="BOLTORIUM"
          className="logo-float-soft h-[4.5rem] w-[78%] max-w-[300px] object-contain"
        />
        <p className="mt-1.5 font-display text-[10px] font-bold tracking-[0.4em] text-gold/80">
          EST. 2023 · BLTRM
        </p>

        <button
          type="button"
          onClick={() => nav('/wallet')}
          className="boltz-pill mt-9 flex w-[86%] max-w-sm flex-col items-center justify-center rounded-[999px] px-6 py-5 active:scale-[0.98]"
        >
          <span className="hud-label relative z-[1] text-[10px] text-void/65">BOLTZ</span>
          <span className="relative z-[1] font-hud text-4xl font-extrabold leading-none text-void">
            {formatInt(boltz)} <span className="text-xl">BZ</span>
          </span>
        </button>

        <div className="mt-8 flex flex-1 flex-col items-center justify-center">
          <button
            type="button"
            aria-label="Start ride"
            onClick={() => nav('/ride')}
            className="ignition-orb relative flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-full bg-[radial-gradient(circle_at_45%_35%,#9AFF5A_0%,#22E06A_28%,#146b22_58%,#041108_100%)] active:scale-[0.96]"
          >
            <span className="ignition-core-rim" />
            <span className="ignition-ring ignition-ring-1" />
            <span className="ignition-ring ignition-ring-2" />
            <span className="ignition-ring ignition-ring-3" />
            <span className="relative z-[1] font-display text-center text-[14px] font-extrabold uppercase leading-tight tracking-[0.12em] text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
              START
              <br />
              RIDE
            </span>
          </button>
        </div>

        <div className="mb-1 grid w-full grid-cols-3 gap-2.5">
          <Holo k="SPARK" v={`${volt.name} LVL ${volt.level}`} onClick={() => nav('/rank')} />
          <Holo k="RANK" v={`#${rank.place}`} onClick={() => nav('/rank')} />
          <Holo k={vehicle.label.toUpperCase()} v={`${formatKm(km)} KM`} onClick={() => nav('/garage')} />
        </div>
      </div>
    </div>
  );
}

function Holo({ k, v, onClick }) {
  return (
    <button type="button" onClick={onClick} className="holo-card rounded-2xl px-2.5 py-3 text-left">
      <p className="hud-label text-[8px] text-gold/80">{k}</p>
      <p className="headline mt-1 text-[13px] leading-none text-gold">{v}</p>
    </button>
  );
}
