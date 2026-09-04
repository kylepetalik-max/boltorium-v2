import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { asset } from '../../lib/asset.js';

const ROUTES = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/ecosystem', label: 'Ecosystem' },
  { to: '/roadmap', label: 'Roadmap' },
];

const SECTIONS = [
  { id: 'riders', label: 'Riders' },
  { id: 'community', label: 'Community' },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function SiteNav() {
  const loc = useLocation();
  const nav = useNavigate();

  const goSection = (id) => {
    if (loc.pathname !== '/') {
      nav('/');
      setTimeout(() => scrollToId(id), 80);
    } else {
      scrollToId(id);
    }
  };

  return (
    <header className="site-nav sticky top-0 z-40 border-b border-white/10 bg-void/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={asset('brand/boltorium-graffiti-v1.png')}
            alt="BOLTORIUM"
            className="h-8 w-auto max-w-[148px] object-contain sm:h-9"
          />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {ROUTES.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider transition ${
                  isActive ? 'bg-bolt/15 text-bolt' : 'text-bone/65 hover:text-bolt'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goSection(s.id)}
              className="rounded-full px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-bone/65 transition hover:text-bolt"
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/how-it-works"
            className="hidden rounded-full border border-cyan/40 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-cyan sm:inline-flex"
          >
            Learn
          </Link>
          <Link
            to="/app"
            className="inline-flex rounded-full bg-bolt px-3.5 py-1.5 font-display text-[11px] font-extrabold uppercase tracking-wider text-void shadow-bolt"
          >
            Enter App
          </Link>
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto border-t border-white/5 px-3 py-2 md:hidden">
        {ROUTES.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider ${
                isActive ? 'bg-bolt/15 text-bolt' : 'text-bone/55'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goSection(s.id)}
            className="shrink-0 rounded-full px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-bone/55"
          >
            {s.label}
          </button>
        ))}
      </div>
    </header>
  );
}
