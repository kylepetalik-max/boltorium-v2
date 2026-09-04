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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-transparent" />
      <div className="splash-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-[42%]" />
      <div className="vault-vignette pointer-events-none absolute inset-0 opacity-80" />

      <img
        src={asset('brand/logo-10.png')}
        alt="BOLTORIUM"
        className="logo-float pointer-events-none absolute inset-x-0 top-[14%] z-10 mx-auto w-[96%] max-h-[52%] object-contain"
      />

      <button
        type="button"
        className="skip-chip absolute right-3 top-10 z-20"
        onClick={go}
        aria-label="Skip"
      >
        Skip
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center px-6">
        <p className="font-display text-[10px] font-bold tracking-[0.48em] text-gold/85">
          EST. 2023 · BLTRM
        </p>
        <p className="mt-2 font-mono text-[9px] tracking-[0.28em] text-bone/35">TAP TO ENTER</p>
      </div>
    </div>
  );
}
