import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import { formatInt } from '../lib/format.js';
import { asset } from '../lib/asset.js';


export default function Rank() {
  const { crew, flagRank } = useStore();
  const nav = useNavigate();
  useEffect(() => {
    flagRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(
    () => [...crew].sort((a, b) => b.km - a.km || b.boltz - a.boltz),
    [crew],
  );
  const you = sorted.find((r) => r.id === 'you');
  const youPlace = you ? sorted.findIndex((r) => r.id === 'you') + 1 : sorted.length;
  const above = youPlace > 1 ? sorted[youPlace - 2] : null;
  const toward = above && you ? Math.max(0, Math.min(100, (you.km / Math.max(0.01, above.km)) * 100)) : 100;

  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];
  const rest = sorted.slice(3, 8);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-11">
      <div className="flex items-center justify-between pr-10">
        <button type="button" aria-label="Profile" onClick={() => nav('/profile')} className="text-bone/70">
          <ProfileIcon />
        </button>
        <div className="flex flex-col items-center">
          <img
            src={asset('brand/logo-10.png')}
            alt="BOLTORIUM"
            className="graffiti-only h-8 object-contain"
          />
          <p className="hud-label mt-0.5 text-[8px] text-bone/60">★ BOLTZ ★</p>
        </div>
        <img src={asset('brand/bmark-icon.png')} alt="" className="graffiti-only h-9 w-9 object-contain" />
      </div>

      <p className="headline mt-4 text-center text-3xl text-bolt">CREW RANK</p>
      <p className="hud-label mt-1 text-center">THIS WEEK</p>

      <div className="mt-5 flex items-end justify-center gap-3 px-1">
        <PodiumSlot rider={second} place={2} size="md" color="#38BDF8" />
        <PodiumSlot rider={first} place={1} size="lg" color="#22E06A" />
        <PodiumSlot rider={third} place={3} size="sm" color="#8B5CF6" />
      </div>

      <div className="mt-5 space-y-1.5">
        {rest.map((r, i) => (
          <div
            key={r.id}
            className={`flex items-center gap-3 rounded-xl px-2 py-2 ${
              r.id === 'you' ? 'border border-bolt/40 bg-bolt/10' : ''
            }`}
          >
            <span className="headline w-6 text-sm text-bone/50">#{i + 4}</span>
            <img src={asset('brand/bmark-icon.png')} alt="" className="graffiti-only h-6 w-6 object-contain" />
            <p className="headline flex-1 text-sm">{r.name}</p>
            <p className="font-hud text-xs text-bolt">{r.km.toFixed(1)} KM</p>
          </div>
        ))}
      </div>

      {you && (
        <div className="mt-4 rounded-2xl border-2 border-bolt bg-void/90 p-3 shadow-bolt">
          <span className="inline-block rounded bg-bolt px-2 py-0.5 font-display text-[10px] font-extrabold italic text-void">
            YOUR CREW
          </span>
          <div className="mt-2 flex items-center gap-3">
            <p className="headline text-2xl text-cyan">#{youPlace}</p>
            <img src={asset('brand/bmark-icon.png')} alt="" className="graffiti-only h-10 w-10 object-contain" />
            <div className="min-w-0 flex-1">
              <p className="headline text-base">{you.name}</p>
              <p className="font-hud text-xs text-bolt">
                {you.km.toFixed(1)} KM · {formatInt(you.boltz)} BZ
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-bone/10">
                <div className="h-full rounded-full bg-bolt" style={{ width: `${toward}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PodiumSlot({ rider, place, size, color }) {
  if (!rider) return <div className="w-24" />;
  const dim = size === 'lg' ? 'h-24 w-24' : size === 'md' ? 'h-20 w-20' : 'h-[4.25rem] w-[4.25rem]';
  const you = rider.id === 'you';
  return (
    <div className="flex w-[30%] flex-col items-center">
      <div
        className={`flex ${dim} items-center justify-center rounded-full border-2 podium-glow`}
        style={{ borderColor: color, boxShadow: `0 0 22px ${color}88` }}
      >
        <img src={asset('brand/bmark-icon.png')} alt="" className="graffiti-only h-[70%] w-[70%] object-contain" />
      </div>
      <p className="headline mt-2 text-center text-[11px] leading-tight text-bone">
        {rider.name}
        {you ? ' · YOU' : ''}
      </p>
      <p className="font-hud text-[10px]" style={{ color }}>
        {rider.km.toFixed(1)} KM
      </p>
      <p className="hud-label mt-0.5 text-[8px]" style={{ color }}>
        #{place}
      </p>
    </div>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
      <circle cx="18" cy="7" r="4" />
      <path d="M16.5 7 h3 M18 5.5 v3" />
    </svg>
  );
}
