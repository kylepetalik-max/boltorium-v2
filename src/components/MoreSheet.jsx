import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';

const LINKS = [
  { path: '/map', label: 'MAP', sub: 'Airdrops · GPS radar' },
  { path: '/rank', label: 'RANK', sub: 'Crew leaderboard' },
  { path: '/wallet', label: 'WALLET', sub: 'Boltz · demo Solana' },
  { path: '/missions', label: 'MISSIONS', sub: 'XP · verified goals' },
  { path: '/profile', label: 'PROFILE', sub: 'Rider card' },
  { path: '/airdrops', label: 'AIRDROPS', sub: 'Geo caches' },
  { path: '/feed', label: 'FEED', sub: 'Rides · merch · crew' },
];

export default function MoreSheet() {
  const { moreOpen, setMore } = useStore();
  const nav = useNavigate();
  if (!moreOpen) return null;
  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end bg-black/60"
      onClick={() => setMore(false)}
      data-testid="bottom-nav-more-overlay"
    >
      <div
        className="sheet-enter safe-b rounded-t-3xl border-t border-bolt/30 bg-graphite px-4 pt-3 pb-4"
        onClick={(e) => e.stopPropagation()}
        data-testid="bottom-nav-more-sheet"
      >
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-bolt/40" />
        <p className="hud-label mb-3 px-1">MORE</p>
        <div className="grid grid-cols-2 gap-2">
          {LINKS.map((l) => (
            <button
              key={l.path}
              type="button"
              onClick={() => {
                setMore(false);
                nav(l.path);
              }}
              className="glass rounded-2xl border border-bolt/20 bg-void/80 p-3 text-left"
            >
              <div className="headline text-base text-bolt">{l.label}</div>
              <div className="mt-0.5 text-[11px] text-bone/55">{l.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
