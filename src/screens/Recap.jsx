import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import NeonMap from '../components/NeonMap.jsx';
import { formatDuration, formatKm, formatInt } from '../lib/format.js';

export default function Recap() {
  const { rides, lastVerify, lastTraceHash, demoPubkey } = useStore();
  const nav = useNavigate();
  const ride = rides[0];
  const v = ride?.verify || lastVerify;
  const status = v?.status || '—';
  const pass = status === 'PASS';
  const live = (ride?.points || []).map((p) => [p.lat, p.lng]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-12">
      <p className="hud-label">RIDE RECAP</p>
      <h1 className={`headline mt-1 text-5xl ${pass ? 'text-bolt' : status === 'REVIEW' ? 'text-cyan' : 'text-danger'}`}>
        {status}
      </h1>
      <p className="mt-1 text-sm text-bone/55">
        {pass
          ? 'Cha-ching. Trace verified. Boltz eligible.'
          : status === 'REVIEW'
            ? 'Held for review. No payout.'
            : 'Not eligible. Striker rejected the trace.'}
      </p>

      <div className="mt-4 h-40 overflow-hidden rounded-2xl border border-bolt/20">
        <NeonMap live={live} ghost={[]} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Tile k="DISTANCE" v={`${formatKm(ride?.distanceM)} KM`} />
        <Tile k="DURATION" v={formatDuration((ride?.endedAt || 0) - (ride?.startedAt || 0))} />
        <Tile k="TOP SPEED" v={ride?.topSpeedKmh ? `${Math.round(ride.topSpeedKmh)} KM/H` : 'UNCERTAIN'} />
        <Tile k="BOLTZ" v={pass ? `+${formatInt(ride?.awarded)}` : '0'} />
      </div>

      <div className="glass mt-4 rounded-2xl p-3">
        <p className="hud-label">STRIKER HASH</p>
        <p className="break-all font-mono text-[11px] text-plasma">{lastTraceHash || v?.hash || '—'}</p>
        <p className="hud-label mt-3">DEMO SOLANA PUBKEY</p>
        <p className="break-all font-mono text-[11px] text-bone/50">{demoPubkey}</p>
        <p className="mt-2 text-[11px] text-cyan">Demo mode — no mainnet minting.</p>
        {v?.reasons?.length > 0 && (
          <p className="mt-2 font-mono text-[10px] text-danger">{v.reasons.join(' · ')}</p>
        )}
      </div>

      <button className="btn-bolt mt-6" onClick={() => nav('/home')}>
        BACK TO GRID
      </button>
    </div>
  );
}

function Tile({ k, v }) {
  return (
    <div className="glass rounded-2xl p-3">
      <p className="hud-label">{k}</p>
      <p className="headline text-xl text-bolt">{v}</p>
    </div>
  );
}
