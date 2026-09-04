import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';

/** Live boltorium.co bottom nav: Home / Ride / Garage / Tune / Shop (+ More sheet). */
const TABS = [
  { id: 'home', path: '/home', label: 'Home', icon: HomeIcon },
  { id: 'ride', path: '/ride', label: 'Ride', icon: RideIcon },
  { id: 'garage', path: '/garage', label: 'Garage', icon: GarageIcon },
  { id: 'tune', path: '/tune', label: 'Tune', icon: TuneIcon },
  { id: 'shop', path: '/shop', label: 'Shop', icon: ShopIcon },
];

export default function TabBar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { ride, moreOpen, setMore } = useStore();

  const isActive = (t) => {
    if (t.id === 'home') return loc.pathname === '/home';
    if (t.id === 'ride') return loc.pathname.startsWith('/ride');
    if (t.id === 'garage') return loc.pathname === '/garage';
    if (t.id === 'tune') return loc.pathname === '/tune';
    if (t.id === 'shop') return loc.pathname === '/shop' || loc.pathname.startsWith('/shop');
    return loc.pathname === t.path;
  };

  return (
    <nav className="tab-bar safe-b relative z-30" data-testid="bottom-navigation">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-1">
        {TABS.map((t) => {
          const active = isActive(t);
          const Icon = t.icon;
          const live = t.id === 'ride' && !!ride;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => nav(t.path)}
              data-testid={`nav-${t.label.toLowerCase()}`}
              className={`bottom-nav-item relative flex flex-col items-center justify-center px-2 py-1 transition ${
                active ? 'tab-active-glow text-bolt' : 'text-bone/45'
              }`}
            >
              <span
                className={`rounded-lg p-1.5 transition ${
                  active ? 'bg-bolt/15' : ''
                }`}
              >
                <Icon active={active || live} />
              </span>
              <span
                className="hud-label mt-0.5 text-[9px]"
                style={{ color: active || live ? '#22E06A' : undefined }}
              >
                {live ? 'LIVE' : t.label}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMore(!moreOpen)}
          data-testid="nav-more"
          className={`bottom-nav-item relative flex flex-col items-center justify-center px-2 py-1 transition ${
            moreOpen ? 'tab-active-glow text-bolt' : 'text-bone/45'
          }`}
        >
          <span className={`rounded-lg p-1.5 transition ${moreOpen ? 'bg-bolt/15' : ''}`}>
            <MoreIcon active={moreOpen} />
          </span>
          <span
            className="hud-label mt-0.5 text-[9px]"
            style={{ color: moreOpen ? '#22E06A' : undefined }}
          >
            More
          </span>
        </button>
      </div>
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
function RideIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22E06A' : 'currentColor'} strokeWidth="1.8">
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M9 17.5h5.5l2-6.5H9.5L8 14" />
      <path d="M14.5 11 16 7h2" />
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
function TuneIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22E06A' : 'currentColor'} strokeWidth="1.8">
      <path d="M4 7h10 M18 7h2 M14 5v4 M4 17h4 M12 17h8 M8 15v4" />
      <circle cx="14" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  );
}
function ShopIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#22E06A' : 'currentColor'} strokeWidth="1.8">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.2 11h11.3l1.8-7H7" />
    </svg>
  );
}
function MoreIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#22E06A' : 'currentColor'}>
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  );
}
