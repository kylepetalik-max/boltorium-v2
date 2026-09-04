import { useMemo, useState } from 'react';
import { useStore } from '../state/store.jsx';
import { formatAgo, formatInt, shortHash } from '../lib/format.js';
import { asset } from '../lib/asset.js';


export default function Wallet() {
  const { boltz, demoPubkey, lastTraceHash, lastVerify, rides, drops, claimedDrops } = useStore();
  const [sheet, setSheet] = useState(null);
  const [copied, setCopied] = useState(false);

  const activity = useMemo(() => {
    const rows = [];
    for (const r of rides) {
      rows.push({
        id: r.id,
        title: 'Ride Complete',
        sub: formatAgo(r.endedAt),
        amount: r.awarded || 0,
        kind: 'ride',
        t: r.endedAt || 0,
      });
    }
    for (const id of claimedDrops) {
      const d = drops.find((x) => x.id === id);
      if (!d) continue;
      rows.push({
        id: `drop-${id}`,
        title: 'Airdrop',
        sub: d.name,
        amount: d.boltz,
        kind: 'airdrop',
        t: 0,
      });
    }
    rows.sort((a, b) => (b.t || 0) - (a.t || 0));
    return rows.slice(0, 12);
  }, [rides, claimedDrops, drops]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(demoPubkey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-11">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,224,106,0.14),transparent_70%)]" />

      <div className="relative flex flex-col items-center pr-8">
        <img
          src={asset('brand/boltorium-graffiti-v1.png')}
          alt="BOLTORIUM"
          className="graffiti-only h-12 w-[78%] object-contain drop-shadow-[0_0_16px_rgba(34,224,106,0.55)]"
        />
        <p className="headline mt-2 text-xl text-bone">WALLET</p>
      </div>

      <div className="relative mt-6 text-center">
        <p className="hud-label">TOTAL BALANCE</p>
        <p className="graffiti-balance mt-1 text-[52px] leading-none">{formatInt(boltz)} BZ</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-solana/50 bg-void/70 px-3 py-1">
          <SolanaMini />
          <span className="font-display text-xs font-bold italic tracking-wider text-bone">SOLANA</span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-2">
        <button className="btn-ghost py-3 text-sm" onClick={() => setSheet('send')}>
          → SEND
        </button>
        <button className="btn-ghost py-3 text-sm" onClick={() => setSheet('recv')}>
          ↓ RECEIVE
        </button>
      </div>

      <div className="relative mt-5">
        <p className="hud-label mb-2">ACTIVITY</p>
        {activity.map((a) => (
          <div key={a.id} className="flex items-center gap-3 border-b border-bone/10 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-bolt/30 bg-void text-bolt">
              {a.kind === 'airdrop' ? <Chute /> : <Bolt />}
            </span>
            <div className="flex-1">
              <p className="text-sm text-bone">{a.title}</p>
              <p className="font-mono text-[10px] text-bone/40">{a.sub}</p>
            </div>
            <p className={`font-hud text-sm ${a.amount < 0 ? 'text-danger' : 'text-bolt'}`}>
              {a.amount < 0 ? '' : '+'}
              {formatInt(a.amount)} BZ
            </p>
          </div>
        ))}
        {!activity.length && <p className="text-sm text-bone/40">No traces yet.</p>}
      </div>

      {lastVerify && (
        <p className="relative mt-4 font-mono text-[10px] text-bone/40">
          last {lastVerify.status} · trust {lastVerify.trust} · {shortHash(lastVerify.hash || lastTraceHash)}
        </p>
      )}

      {sheet && (
        <div
          className="absolute inset-0 z-20 flex flex-col justify-end bg-black/65"
          onClick={() => setSheet(null)}
        >
          <div
            className="sheet-enter safe-b rounded-t-3xl border-t border-bolt/30 bg-graphite px-4 pt-3 pb-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-bolt/40" />
            <p className="headline text-xl text-bolt">{sheet === 'send' ? 'SEND' : 'RECEIVE'}</p>
            <p className="mt-1 text-sm text-bone/55">
              Demo ledger only. No mainnet minting.
            </p>
            <p className="hud-label mt-3">DEMO SOLANA PUBKEY</p>
            <p className="mt-1 break-all font-mono text-[11px] text-plasma">{demoPubkey}</p>
            {sheet === 'recv' && (
              <button className="btn-bolt mt-4" onClick={copy}>
                {copied ? 'COPIED' : 'COPY ADDRESS'}
              </button>
            )}
            {sheet === 'send' && (
              <p className="mt-4 text-sm text-cyan">Sending is disabled in this demo build.</p>
            )}
            <button className="btn-ghost mt-3" onClick={() => setSheet(null)}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SolanaMini() {
  return (
    <svg width="12" height="10" viewBox="0 0 20 16" fill="none" aria-hidden>
      <path d="M4.2 1.2 h13.2 L15 4.2 H1.8 Z" fill="#8B5CF6" />
      <path d="M4.2 6.5 h13.2 L15 9.5 H1.8 Z" fill="#38BDF8" />
      <path d="M4.2 11.8 h13.2 L15 14.8 H1.8 Z" fill="#22E06A" />
    </svg>
  );
}

function Bolt() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h7l-2 8 11-14h-7l2-6z" />
    </svg>
  );
}

function Chute() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 10c0-5 3.2-8 8-8s8 3 8 8" />
      <path d="M4 10h16 M6 10 12 20 18 10" />
    </svg>
  );
}
