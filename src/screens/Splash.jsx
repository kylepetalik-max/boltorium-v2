import { useNavigate } from 'react-router-dom';
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
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-void"
      onClick={go}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') go(e);
      }}
    >
      <HeroVideo />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/35 via-transparent to-void/70" />
      <img
        src={asset('brand/logo-10.png')}
        alt="BOLTORIUM"
        className="pointer-events-none absolute inset-x-0 top-[16%] z-10 mx-auto w-[92%] max-h-[46%] object-contain drop-shadow-[0_0_28px_rgba(212,175,55,0.35)]"
      />
      <button
        type="button"
        className="absolute right-3 top-10 z-20 h-10 w-16"
        onClick={go}
        aria-label="Skip"
      >
        <img src={asset('brand/skip-gold.png')} alt="Skip" className="h-full w-full object-contain" />
      </button>
    </div>
  );
}
