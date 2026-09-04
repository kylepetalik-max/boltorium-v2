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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/80 via-void/70 to-void" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(56,189,248,0.16),transparent_45%),radial-gradient(ellipse_at_80%_70%,rgba(139,92,246,0.14),transparent_40%)]" />

      <button type="button" className="skip-chip absolute right-3 top-10 z-20" onClick={skipDemo} aria-label="Skip">
        Skip
      </button>

      <div className="relative z-10 mt-12 flex flex-1 flex-col items-center px-6 pb-8">
        <img
          src={asset('brand/boltorium-graffiti-v1.png')}
          alt="BOLTORIUM"
          className="w-[88%] max-h-36 object-contain drop-shadow-[0_0_28px_rgba(255,255,255,0.18)]"
        />
        <img
          src={asset('brand/kyle-rtl-mark.png')}
          alt="Ride the Lightning"
          className="mt-3 w-[72%] max-h-14 object-contain"
        />
        <p className="tagline mt-3 text-[11px]">Ride the Lightning</p>

        <p className="mt-5 max-w-[34ch] text-center text-[13px] leading-relaxed text-bone/65">
          The future of electrified riding is here. Track rides, collect airdrops, and earn{' '}
          <span className="font-semibold text-bolt">Boltz</span> coins on Solana (devnet demo —
          token minting is not live).
        </p>

        {mode === 'pick' && (
          <div className="mt-auto w-full max-w-sm space-y-3" data-testid="auth-options">
            <button
              type="button"
              className="btn-google !rounded-full"
              onClick={() =>
                go({ name: 'RIDER', method: 'google', email: 'rider@boltorium.demo', pubkey: DEMO_PUBKEY })
              }
            >
              <GoogleMark />
              Continue with Google
            </button>
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-bolt/40 bg-bolt/10 font-display text-lg font-extrabold uppercase tracking-wider text-bolt transition active:scale-[0.98]"
              onClick={() => setMode('email')}
            >
              Continue with Email
            </button>
            <button
              type="button"
              className="btn-wallet !rounded-full !bg-solana/15 !text-solana"
              onClick={() =>
                go({ name: 'PHANTOM DEMO', method: 'solana', email: null, pubkey: DEMO_PUBKEY })
              }
            >
              Connect Solana Wallet
            </button>
            <Link to="/" className="block text-center font-mono text-[9px] tracking-wider text-bone/40">
              ← Back to site
            </Link>
          </div>
        )}

        {mode === 'email' && (
          <form
            className="mt-auto w-full max-w-sm space-y-3"
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
              className="w-full rounded-full border border-bolt/35 bg-void/80 px-4 py-3 text-bone outline-none focus:border-bolt"
              placeholder="you@ride.local"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn-bolt !rounded-full" type="submit">
              Continue with Email
            </button>
            <button type="button" className="btn-ghost !rounded-full" onClick={() => setMode('pick')}>
              Back
            </button>
          </form>
        )}

        <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-2 text-center">
          {[
            { k: 'GPS', v: 'Verified rides' },
            { k: 'BOLTZ', v: 'Earn as you ride' },
            { k: 'DEVNET', v: 'Solana demo' },
          ].map((x) => (
            <div key={x.k}>
              <p className="font-display text-sm font-extrabold tracking-wider text-bolt drop-shadow-[0_0_10px_rgba(34,224,106,0.55)]">
                {x.k}
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-bone/40">{x.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
