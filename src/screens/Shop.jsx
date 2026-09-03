import { useMemo, useState } from 'react';
import { useStore } from '../state/store.jsx';
import { formatInt } from '../lib/format.js';
import { asset } from '../lib/asset.js';


function solOf(item) {
  if (item.solPrice != null) return Number(item.solPrice).toFixed(2);
  return (Math.max(0, item.price || 0) / 10000).toFixed(2);
}

function kindOf(item) {
  const n = `${item.name} ${item.cat}`.toUpperCase();
  if (n.includes('HELMET')) return 'HELMET';
  if (n.includes('HOODIE')) return 'HOODIE';
  if (n.includes('GLOVE')) return 'GLOVES';
  if (n.includes('TEE') || n.includes('SHIRT')) return 'TEE';
  if (n.includes('GOGGLE') || n.includes('VISOR')) return 'GOGGLES';
  if (n.includes('CABLE') || n.includes('TUNE')) return 'PARTS';
  if (n.includes('BATTERY')) return 'BATTERY';
  return item.cat || 'GEAR';
}

export default function Shop() {
  const { shop, boltz, buy, crew } = useStore();
  const [tab, setTab] = useState('official');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('newest');

  const sellers = crew.filter((c) => c.id !== 'you');

  const items = useMemo(() => {
    let list = shop.map((item, i) => ({
      ...item,
      kind: kindOf(item),
      seller: sellers[i % Math.max(1, sellers.length)]?.name || 'RIDER',
    }));
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(
        (it) =>
          it.name.toLowerCase().includes(needle) ||
          it.kind.toLowerCase().includes(needle) ||
          (it.note || '').toLowerCase().includes(needle),
      );
    }
    if (sort === 'price') list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [shop, q, sort, sellers]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-11">
      <img src={asset('brand/market-3d.png')} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-void/50" />

      <div className="flex items-center gap-2 pr-10">
        <img
          src={asset('brand/splash-gold.png')}
          alt=""
          className="graffiti-only h-10 w-24 object-contain object-left object-top mix-blend-screen"
        />
        <p className="headline text-2xl text-gold">MARKETPLACE</p>
      </div>

      <div className="mt-4 flex rounded-full border border-bone/15 bg-void/70 p-1">
        <button
          type="button"
          onClick={() => setTab('official')}
          className={`flex-1 rounded-full py-1.5 font-display text-sm font-extrabold italic tracking-wider ${
            tab === 'official' ? 'bg-gold text-void shadow-gold' : 'text-bone/70'
          }`}
        >
          OFFICIAL
        </button>
        <button
          type="button"
          onClick={() => setTab('p2p')}
          className={`flex-1 rounded-full py-1.5 font-display text-sm font-extrabold italic tracking-wider ${
            tab === 'p2p' ? 'bg-bolt text-void shadow-bolt' : 'text-bone/70'
          }`}
        >
          P2P
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-bone/15 bg-void/70 px-3 py-2">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-sm text-bone outline-none placeholder:text-bone/35"
          />
        </label>
        <span className="hud-label text-solana">FILTER</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-bone/15 bg-void/70 px-2 py-2 font-mono text-[10px] text-bone/80 outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price">Price</option>
        </select>
      </div>

      <p className="mt-3 font-mono text-[10px] text-bone/45">BALANCE {formatInt(boltz)} BZ</p>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div key={item.id} className="cv-card overflow-hidden p-2.5">
            <p className="hud-label text-[8px] text-bolt">{item.kind}</p>
            <div className="mt-1 flex h-28 items-center justify-center rounded-xl bg-gradient-to-b from-[#161a17] to-[#080A09]">
              <ProductArt kind={item.kind} />
            </div>
            <p className="headline mt-2 text-sm leading-tight text-bone">{item.name}</p>
            {tab === 'p2p' && (
              <p className="mt-0.5 font-mono text-[9px] text-cyan">@{item.seller}</p>
            )}
            <div className="dual-price mt-1">
              <p className="boltz text-[13px]">{formatInt(item.price)} BOLTZ</p>
              <p className="sol text-[12px]">{solOf(item)} SOL</p>
            </div>
            <button
              type="button"
              disabled={boltz < item.price}
              onClick={() => buy(item.id)}
              className="mt-2 w-full rounded-lg bg-bolt py-1.5 font-display text-xs font-extrabold italic text-void disabled:opacity-30"
            >
              {boltz < item.price ? 'NEED BZ' : 'BUY'}
            </button>
          </div>
        ))}
        {!items.length && (
          <p className="col-span-2 py-8 text-center text-sm text-bone/40">No listings match.</p>
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5F5F0" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16 L21 21" />
    </svg>
  );
}

function ProductArt({ kind }) {
  if (kind === 'HELMET') return <HelmetArt />;
  if (kind === 'HOODIE' || kind === 'TEE') return <HoodieArt />;
  if (kind === 'GLOVES') return <GloveArt />;
  if (kind === 'BATTERY') return <BatteryArt />;
  return <GearArt />;
}

function Mark() {
  return (
    <img
      src={asset('brand/b-mark.png')}
      alt=""
      className="graffiti-only pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 object-contain"
    />
  );
}

function HelmetArt() {
  return (
    <div className="relative">
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-bone/80" fill="currentColor" aria-hidden>
        <path d="M10 36c2-16 44-16 46 0v8c0 6-8 10-14 10H24c-6 0-14-4-14-10z" opacity="0.85" />
        <path d="M12 38h42v6H22z" opacity="0.35" />
      </svg>
      <Mark />
    </div>
  );
}

function HoodieArt() {
  return (
    <div className="relative">
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-bone/80" fill="currentColor" aria-hidden>
        <path d="M20 22c0-10 24-10 24 0v4l8 6v24H12V32l8-6z" opacity="0.85" />
        <path d="M24 22c2-6 14-6 16 0v8H24z" opacity="0.5" />
      </svg>
      <Mark />
    </div>
  );
}

function GloveArt() {
  return (
    <div className="relative">
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-bone/75" fill="currentColor" aria-hidden>
        <path d="M22 28 V14 h6 v14 M30 28 V10 h6 v18 M38 28 V14 h6 v14 M46 30 v-8 h5 v12 c0 10-8 18-18 18 h-8 c-8 0-14-6-14-14 V32 h7 z" />
      </svg>
      <Mark />
    </div>
  );
}

function BatteryArt() {
  return (
    <div className="relative">
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-bolt" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="14" y="18" width="32" height="28" rx="4" />
        <path d="M46 26 h4 v12 h-4" />
        <path d="M28 24 L22 34 h8 l-4 10 12-14 h-8 z" fill="#22E06A" stroke="none" />
      </svg>
      <Mark />
    </div>
  );
}

function GearArt() {
  return (
    <div className="relative">
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-cyan" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="32" cy="32" r="10" />
        <path d="M32 14 v6 M32 44 v6 M14 32 h6 M44 32 h6 M20 20 l4 4 M40 40 l4 4 M44 20 l-4 4 M24 40 l-4 4" />
      </svg>
      <Mark />
    </div>
  );
}
