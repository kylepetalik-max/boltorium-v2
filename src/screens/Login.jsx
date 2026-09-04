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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/75 via-void/50 to-void/95" />
      <div className="vault-vignette pointer-events-none absolute inset-0" />
      <div className="vault-hex pointer-events-none absolute inset-0 opacity-[0.09]" />

      <button type="button" className="skip-chip absolute right-3 top-10 z-20" onClick={skipDemo} aria-label="Skip">
        Skip
      </button>

      <div className="relative z-10 mt-14 flex flex-col items-center px-5">
        <img
          src={asset('brand/logo-10.png')}
          alt="BOLTORIUM"
          className="logo-float w-[94%] max-h-44 object-contain"
        />
        <p className="mt-3 font-display text-[10px] font-bold tracking-[0.48em] text-gold/90">
          EST. 2023 · BLTRM
        </p>
        <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-bone/40">RIDE THE LIGHTNING</p>
      </div>

      {mode === 'pick' && (
        <div className="glass-panel relative z-10 mx-5 mt-auto mb-9 space-y-3 p-4">
          <p className="hud-label mb-1 text-center text-gold/70">AUTHENTICATE</p>
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
          className="glass-panel relative z-10 mx-5 mt-auto mb-9 space-y-3 p-4"
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
            className="w-full rounded-full border border-gold/40 bg-void/80 px-4 py-3 text-bone outline-none focus:border-gold/70"
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
