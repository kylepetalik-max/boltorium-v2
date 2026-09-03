import { useMemo, useState } from 'react';
import { useStore } from '../state/store.jsx';
import { formatInt } from '../lib/format.js';
import { asset } from '../lib/asset.js';


const UNIT = {
  rides: '',
  km: 'KM',
  safety: '',
  drops: '',
  rank: '',
  speed: 'KM/H',
};

export default function Missions() {
  const { missions, missionDone, rides, claimedDrops, safetyEver } = useStore();
  const [tab, setTab] = useState('daily');
  const km = rides.reduce((n, r) => n + (r.distanceM || 0), 0) / 1000;
  const top = rides.reduce((n, r) => Math.max(n, r.topSpeedKmh || 0), 0);
  const progress = {
    rides: rides.filter((r) => r.verify?.status === 'PASS').length,
    km,
    safety: safetyEver ? 1 : 0,
    drops: claimedDrops.length,
    rank: missionDone.includes('m5') ? 1 : 0,
    speed: top,
  };

  const tagged = useMemo(
    () =>
      missions.map((m, i) => ({
        ...m,
        period: m.period || (i % 2 === 0 ? 'daily' : 'weekly'),
      })),
    [missions],
  );

  const list = tagged.filter((m) => m.period === tab);
  const dailies = tagged.filter((m) => m.period === 'daily');
  const dailyDone = dailies.filter((m) => missionDone.includes(m.id)).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-12">
      <p className="headline text-3xl text-bolt">CHALLENGES</p>
      <p className="hud-label mt-1">VERIFIED GOALS</p>

      <div className="mt-4 flex gap-6">
        {['daily', 'weekly'].map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`pb-1 font-display text-sm font-extrabold italic tracking-[0.2em] ${
              tab === id ? 'border-b-2 border-bolt text-bolt' : 'text-bone/40'
            }`}
          >
            {id.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {list.map((m) => {
          const done = missionDone.includes(m.id);
          const have = progress[m.kind] || 0;
          const pct = Math.min(100, Math.round((have / m.target) * 100));
          const unit = UNIT[m.kind] || '';
          const haveLabel = m.kind === 'km' ? have.toFixed(1) : formatInt(have);
          return (
            <div key={m.id} className="rounded-2xl border border-bolt/35 bg-void/80 p-3 shadow-[0_0_12px_rgba(34,224,106,0.12)]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bolt/50 bg-bolt/10 text-bolt">
                  <KindIcon kind={m.kind} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="headline text-base text-bone">{m.title}</p>
                  <p className="text-[12px] text-bone/55">{m.detail}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[11px] text-bone/80">XP {m.xp}</p>
                  <p className="flex items-center justify-end gap-1 font-hud text-[11px] text-bolt">
                    <BTiny /> {m.boltz}
                  </p>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-bone/10">
                <div className="h-full rounded-full bg-bolt" style={{ width: `${done ? 100 : pct}%` }} />
              </div>
              <p className="mt-1 text-center font-mono text-[10px] text-bone/50">
                {done ? 'DONE' : `${haveLabel} / ${m.target}${unit ? ` ${unit}` : ''}`}
              </p>
            </div>
          );
        })}

        {tab === 'daily' && (
          <div className="rounded-2xl border border-bolt/35 bg-void/80 p-3">
            <span className="inline-block rounded bg-bolt px-2 py-0.5 font-display text-[10px] font-extrabold italic text-void">
              DAILY BONUS
            </span>
            <div className="mt-2 flex items-start justify-between gap-3">
              <p className="headline text-sm text-bone">Complete all Daily Challenges</p>
              <div className="text-right">
                <p className="font-mono text-[11px] text-bone/80">XP 40</p>
                <p className="flex items-center justify-end gap-1 font-hud text-[11px] text-bolt">
                  <BTiny /> 30
                </p>
              </div>
            </div>
            <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-bone/10">
              <div
                className="h-full rounded-full bg-bolt"
                style={{
                  width: `${dailies.length ? Math.round((dailyDone / dailies.length) * 100) : 0}%`,
                }}
              />
            </div>
            <p className="mt-1 text-center font-mono text-[10px] text-bone/50">
              {dailyDone} / {dailies.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function KindIcon({ kind }) {
  if (kind === 'drops') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10c0-5 3.2-8 8-8s8 3 8 8" />
        <path d="M4 10h16 M6 10 12 20 18 10" />
      </svg>
    );
  }
  if (kind === 'speed') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 16 a10 10 0 0 1 16 0" />
        <path d="M12 16 L17 10" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h7l-2 8 11-14h-7l2-6z" />
    </svg>
  );
}

function BTiny() {
  return (
    <img src={asset('brand/bmark-icon.png')} alt="" className="graffiti-only h-3.5 w-3.5 object-contain" />
  );
}
