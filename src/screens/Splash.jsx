import { Link, useNavigate } from 'react-router-dom';
import HeroVideo from '../components/HeroVideo.jsx';
import { useStore } from '../state/store.jsx';
import { asset } from '../lib/asset.js';

export default function Splash() {
  const nav = useNavigate();
  const { user, onboarded } = useStore();

  const go = (e) => {
    e?.stopPropagation?.();
    if (user && onboarded) nav('/home', { replace: true });
    else if (user) nav('/onboarding', { replace: true });
    else nav('/login', { replace: true });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-void">
      <HeroVideo />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/55 via-transparent to-void/90" />
      <div className="splash-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-[42%]" />
      <div className="vault-vignette pointer-events-none absolute inset-0 opacity-70" />

      <img
        src={asset('brand/boltorium-graffiti-v1.png')}
        alt="BOLTORIUM"
        className="logo-float pointer-events-none absolute inset-x-0 top-[12%] z-10 mx-auto w-[88%] max-h-[38%] object-contain"
      />
      <img
        src={asset('brand/kyle-rtl-mark.png')}
        alt=""
        className="pointer-events-none absolute inset-x-0 top-[48%] z-10 mx-auto w-[70%] max-h-[16%] object-contain opacity-90"
      />

      <button
        type="button"
        className="skip-chip absolute right-3 top-10 z-20"
        onClick={go}
        aria-label="Skip"
      >
        Skip
      </button>

      <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 px-6">
        <p className="tagline text-[10px]">Ride the Lightning</p>
        <button type="button" className="btn-bolt !rounded-full" onClick={go}>
          Enter
        </button>
        <Link to="/" className="font-mono text-[9px] tracking-[0.28em] text-bone/40">
          ← MARKETING SITE
        </Link>
      </div>
    </div>
  );
}
