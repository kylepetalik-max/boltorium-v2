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
      <VaultBg src="brand/home-3d.png" opacity={0.14} blur={18} />

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-center px-4 pb-4 pt-12">
        <img
          src={asset('brand/logo-10.png')}
          alt="BOLTORIUM"
          className="h-16 w-[72%] max-w-[280px] object-contain drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]"
        />
        <p className="mt-1 font-display text-[10px] font-bold tracking-[0.35em] text-gold/80">EST. 2023 · BLTRM</p>

        <button
          type="button"
          onClick={() => nav('/wallet')}
          className="boltz-pill mt-8 flex w-[82%] max-w-sm flex-col items-center justify-center rounded-[999px] border border-gold/55 bg-gradient-to-b from-[#f2d37a] to-[#9a7318] px-6 py-4 shadow-gold active:scale-[0.98]"
        >
          <span className="hud-label text-[10px] text-void/70">BOLTZ</span>
          <span className="font-hud text-4xl font-extrabold leading-none text-void">
            {formatInt(boltz)} <span className="text-xl">BZ</span>
          </span>
        </button>

        <div className="mt-auto mb-2 grid w-full grid-cols-3 gap-2">
          <Holo k="SPARK" v={`${volt.name} LVL ${volt.level}`} onClick={() => nav('/rank')} />
          <Holo k="RANK" v={`#${rank.place}`} onClick={() => nav('/rank')} />
          <Holo k={vehicle.label.toUpperCase()} v={`${formatKm(km)} KM`} onClick={() => nav('/garage')} />
        </div>

        <button
          type="button"
          aria-label="Start ride"
          onClick={() => nav('/ride')}
          className="ignition-orb relative mt-3 mb-2 flex h-28 w-28 items-center justify-center rounded-full border-4 border-gold bg-[radial-gradient(circle_at_50%_40%,#7CFF3A_0%,#146b22_55%,#041108_100%)] shadow-[0_0_40px_rgba(34,224,106,0.75),0_0_18px_rgba(212,175,55,0.8)] active:scale-[0.96]"
        >
          <span className="font-display text-center text-[13px] font-extrabold uppercase leading-tight tracking-wide text-gold">
            START
            <br />
            RIDE
          </span>
        </button>
      </div>
    </div>
  );
}

function Holo({ k, v, onClick }) {
  return (
    <button type="button" onClick={onClick} className="holo-card rounded-xl px-2 py-2 text-left">
      <p className="hud-label text-[8px] text-gold/80">{k}</p>
      <p className="headline mt-0.5 text-[13px] leading-none text-gold">{v}</p>
    </button>
  );
}
