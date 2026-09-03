import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { haversineMeters } from '../lib/format.js';
import { asset } from '../lib/asset.js';


const CLAIM_RANGE_M = 20;

const CACHES = [
  { id: 'c80', name: 'STREET CACHE', meters: 80, boltz: 250, rarity: 'RARE', kind: 'bolt', x: 28, y: 58, scale: 1 },
  { id: 'c140', name: 'ALLEY CACHE', meters: 140, boltz: 80, rarity: 'COMMON', kind: 'bolt', x: 62, y: 46, scale: 0.82 },
  { id: 'c320', name: 'ROOFTOP CACHE', meters: 320, boltz: 120, rarity: 'COMMON', kind: 'bolt', x: 78, y: 34, scale: 0.64 },
  { id: 'chest', name: 'RARE CHEST', meters: 210, boltz: 250, rarity: 'RARE', kind: 'chest', x: 46, y: 40, scale: 0.9 },
  { id: 'crew', name: 'CREW ONLY', meters: 260, boltz: 0, rarity: 'LOCKED', kind: 'crew', x: 18, y: 38, scale: 0.78 },
];

export default function Airdrops() {
  const nav = useNavigate();
  const { drops, claimedDrops, claimDrop, ride } = useStore();
  const here = ride?.points?.at?.(-1);
  const [focus, setFocus] = useState('c80');

  const nearby = 3;

  const liveDist = useMemo(() => {
    if (!here || !drops?.length) return null;
    const open = drops.filter((d) => !claimedDrops.includes(d.id));
    if (!open.length) return null;
    let best = null;
    for (const d of open) {
      const m = haversineMeters(here.lat, here.lng, d.lat, d.lng);
      if (best == null || m < best.m) best = { id: d.id, m, boltz: d.boltz, name: d.name };
    }
    return best;
  }, [here, drops, claimedDrops]);

  const selected = CACHES.find((c) => c.id === focus) || CACHES[0];
  const displayM = liveDist && focus === 'c80' ? Math.round(liveDist.m) : selected.meters;
  const inRange = displayM <= CLAIM_RANGE_M;
  const claimed = liveDist ? claimedDrops.includes(liveDist.id) : false;

  const onClaim = () => {
    if (!inRange || claimed) return;
    if (liveDist) claimDrop(liveDist.id);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <img
        src={asset('brand/visor-splash.png')}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-void/35 via-void/25 to-void/88" />
      <div className="visor-mask" />
      <div className="scanlines absolute inset-0" />

      <div className="relative z-10 flex items-center justify-center px-12 pt-11">
        <div className="flex items-center gap-2 rounded-full border border-stroke bg-void/80 px-3 py-1.5 backdrop-blur-md">
          <p className="headline text-[13px] text-white">AIRDROPS · AR</p>
          <span className="mx-1 h-3 w-px bg-stroke" />
          <span className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-bolt">
            <span className="h-1.5 w-1.5 rounded-full bg-bolt shadow-bolt" />
            GPS ACTIVE
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] tracking-widest text-white">
            {nearby} NEARBY
          </span>
        </div>
      </div>

      <div className="relative z-10 min-h-0 flex-1">
        {CACHES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFocus(c.id)}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `translate(-50%, -100%) scale(${c.scale})` }}
          >
            <Marker cache={c} active={focus === c.id} />
          </button>
        ))}

        <div className="pointer-events-none absolute bottom-[38%] left-1/2 w-[78%] -translate-x-1/2">
          <Compass />
        </div>
      </div>

      <div className="relative z-10 px-3 pb-3">
        <div className="rounded-[22px] border border-stroke bg-void/88 p-3 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-bolt/40 bg-void">
              {selected.kind === 'crew' ? <LockGlyph /> : selected.kind === 'chest' ? <ChestGlyph /> : <BoltGlyph />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="headline text-lg leading-none text-white">{selected.name}</p>
                <p className="font-hud text-sm text-bolt">{displayM}m</p>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                {selected.kind === 'crew' ? (
                  <p className="headline text-sm text-solana">CREW ONLY</p>
                ) : (
                  <>
                    <p className="headline text-sm text-plasma">{selected.boltz} BOLTZ</p>
                    {selected.rarity === 'RARE' && (
                      <span className="rounded-full bg-plasma/15 px-2 py-0.5 font-mono text-[9px] tracking-widest text-plasma">
                        RARE
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="mt-1 text-[11px] leading-snug text-white/45">
                Ride into the geofence. GPS-verified. Multi-vehicle.
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={!inRange || claimed || selected.kind === 'crew'}
              onClick={onClaim}
              className="flex h-14 flex-1 flex-col items-center justify-center rounded-[18px] border border-stroke bg-surface font-display italic font-extrabold uppercase tracking-wide text-white/35 disabled:opacity-100"
            >
              <span className="text-[13px] leading-none">{claimed ? 'CLAIMED' : 'CLAIM IN RANGE'}</span>
              <span className="mt-0.5 font-mono text-[9px] tracking-widest not-italic">{CLAIM_RANGE_M}m</span>
            </button>
            <button
              type="button"
              onClick={() => nav('/map')}
              className="flex h-14 flex-1 items-center justify-center rounded-[18px] border border-bolt bg-transparent font-display text-[13px] italic font-extrabold uppercase tracking-wide text-bolt"
            >
              FIND ON MAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Marker({ cache, active }) {
  if (cache.kind === 'chest') {
    return (
      <div className="flex flex-col items-center">
        <p className="headline text-[11px] text-plasma drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
          {cache.boltz} BOLTZ
        </p>
        <ChestGlyph />
        <Stem color="#38BDF8" hot={active} />
      </div>
    );
  }
  if (cache.kind === 'crew') {
    return (
      <div className="flex flex-col items-center">
        <p className="headline text-[11px] text-solana drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">CREW ONLY</p>
        <LockGlyph />
        <Stem color="#8B5CF6" hot={active} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <p className={`font-hud text-[11px] ${active ? 'text-bolt' : 'text-bolt/80'}`}>{cache.meters}m</p>
      <BoltGlyph />
      <Stem color="#22E06A" hot={active} />
    </div>
  );
}

function Stem({ color, hot }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-10 w-px" style={{ background: color, boxShadow: `0 0 8px ${color}`, opacity: hot ? 1 : 0.7 }} />
      <div
        className="h-3 w-3 rounded-full"
        style={{
          border: `1.5px solid ${color}`,
          boxShadow: `0 0 10px ${color}`,
          background: 'transparent',
        }}
      />
      <div
        className="mt-[-4px] h-5 w-5 rounded-full"
        style={{ border: `1px solid ${color}55` }}
      />
    </div>
  );
}

function BoltGlyph() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden className="drop-shadow-[0_0_8px_rgba(34,224,106,0.85)]">
      <path d="M13 1 L4 14.5 h7.2 L8 25 L18.5 11 H11.2 Z" fill="#22E06A" />
    </svg>
  );
}

function ChestGlyph() {
  return (
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden>
      <rect x="3" y="8" width="20" height="11" rx="1.5" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M3 8 L8 3 H18 L23 8" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M3 12 H23" stroke="#38BDF8" />
      <circle cx="13" cy="14" r="1.6" fill="#38BDF8" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden>
      <rect x="4" y="10" width="14" height="11" rx="2" stroke="#8B5CF6" strokeWidth="1.6" />
      <path d="M7 10 V8 a4 4 0 0 1 8 0 v2" stroke="#8B5CF6" strokeWidth="1.6" />
    </svg>
  );
}

function Compass() {
  const ticks = ['W', 'NW', 'N', 'NE', 'E'];
  return (
    <div className="flex items-end justify-between px-1">
      {ticks.map((t) => (
        <div key={t} className="flex flex-col items-center">
          {t === 'N' && (
            <svg width="10" height="8" viewBox="0 0 10 8" className="-mb-0.5" aria-hidden>
              <path d="M5 0 L9 8 H1 Z" fill="#22E06A" />
            </svg>
          )}
          <span className={`font-mono text-[10px] tracking-widest ${t === 'N' ? 'text-bolt' : 'text-white/40'}`}>
            {t}
          </span>
        </div>
      ))}
    </div>
  );
}
