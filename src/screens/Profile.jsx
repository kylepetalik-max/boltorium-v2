import { useNavigate } from 'react-router-dom';
import { GraffitiB } from '../components/BMark.jsx';
import { useStore } from '../state/store.jsx';
import { formatInt, formatKm } from '../lib/format.js';

export default function Profile() {
  const { user, boltz, xp, rides, vehicle, logout, demoPubkey } = useStore();
  const nav = useNavigate();
  const km = rides.reduce((n, r) => n + (r.distanceM || 0), 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-12">
      <div className="flex items-center gap-3">
        <GraffitiB className="h-16" />
        <div>
          <p className="headline text-3xl">{user?.name || 'RIDER'}</p>
          <p className="hud-label">{user?.method} · {vehicle.label}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Mini k="BOLTZ" v={formatInt(boltz)} />
        <Mini k="XP" v={formatInt(xp)} />
        <Mini k="KM" v={formatKm(km)} />
      </div>
      <div className="glass mt-4 rounded-2xl p-3">
        <p className="hud-label">PUBKEY</p>
        <p className="break-all font-mono text-[11px] text-bone/50">{user?.pubkey || demoPubkey}</p>
      </div>
      <button
        className="btn-ghost mt-auto"
        onClick={() => {
          logout();
          nav('/', { replace: true });
        }}
      >
        SIGN OUT
      </button>
    </div>
  );
}

function Mini({ k, v }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <p className="hud-label">{k}</p>
      <p className="headline text-xl text-bolt">{v}</p>
    </div>
  );
}
