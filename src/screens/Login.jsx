import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, DEMO_PUBKEY } from '../state/store.jsx';
import HeroVideo from '../components/HeroVideo.jsx';
import { asset } from '../lib/asset.js';

export default function Login() {
  const { login, onboarded } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('pick');

  const go = (user) => {
    login(user);
    nav(onboarded ? '/home' : '/onboarding', { replace: true });
  };

  const skipDemo = () =>
    go({ name: 'PHANTOM DEMO', method: 'solana', email: null, pubkey: DEMO_PUBKEY });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-void">
      <HeroVideo />
      <img
        src={asset('brand/splash-3d.png')}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.16, filter: 'blur(16px) saturate(0.65) brightness(0.55)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/70 via-void/45 to-void/92" />
      <div className="vault-vignette pointer-events-none absolute inset-0" />

      <button type="button" className="absolute right-3 top-10 z-20 h-10 w-16" onClick={skipDemo} aria-label="Skip">
        <img src={asset('brand/skip-gold.png')} alt="Skip" className="h-full w-full object-contain" />
      </button>

      <div className="relative z-10 mt-16 flex flex-col items-center px-6">
        <img
          src={asset('brand/logo-10.png')}
          alt="BOLTORIUM"
          className="w-[90%] max-h-36 object-contain drop-shadow-[0_0_24px_rgba(212,175,55,0.4)]"
        />
        <p className="mt-2 font-display text-[10px] font-bold tracking-[0.42em] text-gold/90">EST. 2023 · BLTRM</p>
      </div>

      {mode === 'pick' && (
        <div className="relative z-10 mt-auto space-y-3 px-6 pb-10">
          <button
            className="btn-gold"
            onClick={() =>
              go({ name: 'PHANTOM DEMO', method: 'solana', email: null, pubkey: DEMO_PUBKEY })
            }
          >
            Continue with Wallet
          </button>
          <button
            className="btn-gold-outline"
            onClick={() =>
              go({ name: 'RIDER', method: 'google', email: 'rider@boltorium.demo', pubkey: DEMO_PUBKEY })
            }
          >
            Continue with Google
          </button>
          <button className="btn-gold-outline" onClick={() => setMode('email')}>
            Continue with Email
          </button>
        </div>
      )}

      {mode === 'email' && (
        <form
          className="relative z-10 mt-auto space-y-3 px-6 pb-10"
          onSubmit={(e) => {
            e.preventDefault();
            go({
              name: email.split('@')[0] || 'RIDER',
              method: 'email',
              email: email || 'rider@boltorium.demo',
              pubkey: DEMO_PUBKEY,
            });
          }}
        >
          <input
            className="w-full rounded-full border border-gold/40 bg-void/80 px-4 py-3 text-bone outline-none"
            placeholder="you@ride.local"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-gold" type="submit">
            Continue with Email
          </button>
          <button type="button" className="btn-gold-outline" onClick={() => setMode('pick')}>
            BACK
          </button>
        </form>
      )}
    </div>
  );
}
