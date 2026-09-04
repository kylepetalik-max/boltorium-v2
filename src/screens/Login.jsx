import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, DEMO_PUBKEY } from '../state/store.jsx';
import HeroVideo from '../components/HeroVideo.jsx';
import { asset } from '../lib/asset.js';

export default function Login() {
  const { login, onboarded } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('pick');

  useEffect(() => {
    document.title = 'Enter App — BOLTORIUM';
    return () => {
      document.title = 'BOLTORIUM — Ride the Lightning';
    };
  }, []);

  const go = (user) => {
    login(user);
    nav(onboarded ? '/home' : '/onboarding', { replace: true });
  };

  const skipDemo = () =>
    go({ name: 'PHANTOM DEMO', method: 'solana', email: null, pubkey: DEMO_PUBKEY });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-void">
      <HeroVideo />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/75 via-void/55 to-void/95" />
      <div className="vault-vignette pointer-events-none absolute inset-0" />

      <button type="button" className="skip-chip absolute right-3 top-10 z-20" onClick={skipDemo} aria-label="Skip">
        Skip
      </button>

      <div className="relative z-10 mt-14 flex flex-col items-center px-5">
        <img
          src={asset('brand/boltorium-graffiti-v1.png')}
          alt="BOLTORIUM"
          className="logo-float w-[90%] max-h-40 object-contain"
        />
        <p className="tagline mt-3 text-[10px]">Ride the Lightning</p>
        <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-bone/40">
          DEMO / DEVNET · JOIN WAITLIST VIA APP
        </p>
      </div>

      {mode === 'pick' && (
        <div className="glass-panel relative z-10 mx-5 mt-auto mb-9 space-y-3 p-4">
          <p className="hud-label mb-1 text-center text-cyan">AUTHENTICATE</p>
          <button
            className="btn-wallet"
            onClick={() =>
              go({ name: 'PHANTOM DEMO', method: 'solana', email: null, pubkey: DEMO_PUBKEY })
            }
          >
            Continue with Wallet
          </button>
          <button
            className="btn-google"
            onClick={() =>
              go({ name: 'RIDER', method: 'google', email: 'rider@boltorium.demo', pubkey: DEMO_PUBKEY })
            }
          >
            Continue with Google
          </button>
          <button className="btn-ghost" onClick={() => setMode('email')}>
            Continue with Email
          </button>
          <Link to="/" className="block text-center font-mono text-[9px] tracking-wider text-bone/40">
            ← Back to site
          </Link>
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
            className="w-full rounded-full border border-cyan/40 bg-void/80 px-4 py-3 text-bone outline-none focus:border-bolt"
            placeholder="you@ride.local"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn-bolt" type="submit">
            Continue with Email
          </button>
          <button type="button" className="btn-ghost" onClick={() => setMode('pick')}>
            BACK
          </button>
        </form>
      )}
    </div>
  );
}
