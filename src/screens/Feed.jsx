import { useMemo, useState } from 'react';
import { useStore } from '../state/store.jsx';
import { formatAgo, formatInt, formatKm } from '../lib/format.js';
import { asset } from '../lib/asset.js';


const TABS = ['ALL', 'RIDES', 'MERCH', 'CREW'];

export default function Feed() {
  const { user, rides, crew, shop } = useStore();
  const [tab, setTab] = useState('ALL');
  const [q, setQ] = useState('');
  const [searchOn, setSearchOn] = useState(false);

  const posts = useMemo(() => {
    const out = [];
    for (const r of rides.slice(0, 8)) {
      out.push({
        id: r.id,
        user: user?.name || 'YOU',
        tag: 'RIDE RECAP',
        kind: 'RIDES',
        text: `${formatKm(r.distanceM)} KM · ${r.verify?.status || '—'} · +${formatInt(r.awarded || 0)} BZ`,
        ago: formatAgo(r.endedAt),
        likes: Math.max(1, Math.round((r.distanceM || 0) / 400)),
        comments: r.verify?.status === 'PASS' ? 2 : 0,
        visual: 'route',
      });
    }
    const merch = shop[0];
    if (merch) {
      out.push({
        id: 'merch-drop',
        user: 'BOLTORIUM',
        tag: 'MERCH DROP',
        kind: 'MERCH',
        text: `${merch.name} is live in the shop · ${formatInt(merch.price)} BZ`,
        ago: 'TODAY',
        likes: 8,
        comments: 1,
        visual: 'merch',
      });
    }
    const peer = crew.find((c) => c.id !== 'you');
    if (peer) {
      out.push({
        id: 'crew-call',
        user: peer.name,
        tag: 'CREW',
        kind: 'CREW',
        text: `${peer.km.toFixed(1)} KM on the board. Pull up.`,
        ago: '3H',
        likes: 4,
        comments: 1,
        visual: 'crew',
      });
    }
    return out;
  }, [rides, user, shop, crew]);

  const shown = posts.filter((p) => {
    if (tab !== 'ALL' && p.kind !== tab) return false;
    if (!q.trim()) return true;
    const n = q.trim().toLowerCase();
    return `${p.user} ${p.text} ${p.tag}`.toLowerCase().includes(n);
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="px-4 pt-11 pr-12">
        <div className="flex items-center gap-2">
          <img src={asset('brand/b-mark.png')} alt="" className="graffiti-only h-9 w-9 object-contain" />
          <p className="headline flex-1 text-center text-2xl text-bolt">FEED</p>
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOn((v) => !v)}
            className="text-bone/70"
          >
            <SearchIcon />
          </button>
        </div>
        {searchOn && (
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search feed"
            className="mt-2 w-full rounded-xl border border-bolt/25 bg-void px-3 py-2 text-sm text-bone outline-none"
          />
        )}
        <div className="mt-3 flex gap-4">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`pb-1 font-display text-[12px] font-extrabold italic tracking-[0.16em] ${
                tab === t ? 'border-b-2 border-bolt text-bolt' : 'text-bone/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-20">
        {shown.map((p) => (
          <article key={p.id} className="rounded-2xl border border-bone/12 bg-void/70 p-3">
            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-bolt/40">
                    <img src={asset('brand/b-mark.png')} alt="" className="h-5 w-5 object-contain" />
                  </span>
                  <p className="headline text-sm">{p.user}</p>
                  <span className="rounded-full border border-bolt/30 px-2 py-0.5 font-mono text-[8px] text-bolt">
                    {p.tag}
                  </span>
                  <span className="font-mono text-[9px] text-bone/40">{p.ago}</span>
                </div>
                <p className="mt-2 text-sm leading-snug text-bone/80">{p.text}</p>
                <div className="mt-3 flex gap-4 text-bone/50">
                  <span className="flex items-center gap-1 text-[11px]">♥ {p.likes}</span>
                  <span className="flex items-center gap-1 text-[11px]">💬 {p.comments}</span>
                  <span className="text-[11px]">↗</span>
                </div>
              </div>
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-bolt/20 bg-[#0c100e]">
                <Thumb kind={p.visual} />
              </div>
            </div>
          </article>
        ))}
        {!shown.length && <p className="py-10 text-center text-sm text-bone/40">Nothing in this lane yet.</p>}
      </div>
    </div>
  );
}

function Thumb({ kind }) {
  if (kind === 'merch') {
    return (
      <div className="relative flex h-full items-center justify-center">
        <svg viewBox="0 0 64 64" className="h-12 w-12 text-bone/70" fill="currentColor" aria-hidden>
          <path d="M20 22c0-10 24-10 24 0v4l8 6v24H12V32l8-6z" opacity="0.85" />
        </svg>
        <img src={asset('brand/b-mark.png')} alt="" className="absolute h-6 w-6 object-contain" />
      </div>
    );
  }
  if (kind === 'crew') {
    return (
      <div className="flex h-full items-center justify-center">
        <img src={asset('brand/b-mark.png')} alt="" className="h-10 w-10 object-contain" />
      </div>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden>
      <rect width="80" height="80" fill="#080A09" />
      <path d="M8 58 C22 40, 30 50, 40 32 S62 22, 74 18" fill="none" stroke="#22E06A" strokeWidth="3" />
      <circle cx="74" cy="18" r="4" fill="#38BDF8" />
      <path d="M62 10 l8 8 -4 10" fill="none" stroke="#22E06A" strokeWidth="1.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16 L21 21" />
    </svg>
  );
}
