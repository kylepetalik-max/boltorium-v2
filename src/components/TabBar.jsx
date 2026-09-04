import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import BMark from './BMark.jsx';

const TABS = [
  { id: 'home', path: '/home', label: 'HOME', icon: HomeIcon },
  { id: 'map', path: '/map', label: 'MAP', icon: MapIcon },
  { id: 'ride', path: '/ride', label: 'RIDE', icon: null, center: true },
  { id: 'rank', path: '/rank', label: 'RANK', icon: RankIcon },
  { id: 'garage', path: '/garage', label: 'GARAGE', icon: GarageIcon },
];

export default function TabBar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { ride } = useStore();

  return (
    <nav className="tab-bar safe-b relative z-30 grid grid-cols-5 items-end px-1 pt-2">
      {TABS.map((t) => {
        const active =
          loc.pathname === t.path ||
          (t.id === 'ride' && loc.pathname.startsWith('/ride')) ||
          (t.id === 'garage' && loc.pathname === '/tune');
        if (t.center) {
          return (
            <button
              key={t.id}
              onClick={() => nav(ride ? '/ride' : '/ride')}
              className="relative -top-4 flex flex-col items-center"
            >
              <span className="tab-ride-btn flex h-14 w-14 items-center justify-center rounded-full">
                <BMark className="h-8 w-8" />
              </span>
              <span className="hud-label mt-1 text-[9px] text-gold">{ride ? 'LIVE' : 'RIDE'}</span>
            </button>
          );
        }
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => nav(t.path)}
            className={`flex flex-col items-center gap-1 pb-1 transition ${
              active ? 'tab-active-glow text-bolt' : 'text-bone/45'
            }`}
          >
            <Icon active={active} />
            <span
              className="hud-label text-[9px]"
              style={{ color: active ? '#22E06A' : undefined }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22E06A' : 'currentColor'} strokeWidth="1.8">
      <path d="M4 11.5 L12 4 l8 7.5 V20 a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function MapIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22E06A' : 'currentColor'} strokeWidth="1.8">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
function RankIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22E06A' : 'currentColor'} strokeWidth="1.8">
      <path d="M8 19V10 M12 19V5 M16 19v-6" />
    </svg>
  );
}
function GarageIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22E06A' : 'currentColor'} strokeWidth="1.8">
      <path d="M3 20 V10 L12 4 l9 6 v10" />
      <path d="M8 20 v-6 h8 v6" />
    </svg>
  );
}
