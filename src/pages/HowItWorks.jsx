import { Link } from 'react-router-dom';
import MarketingShell from '../components/marketing/MarketingShell.jsx';

const DETAIL = [
  {
    t: '1. Start a ride',
    d: 'Accept the safety gate (helmet, phone stowed, age, risk). The HUD streams live GPS. If the OS has no fix, speed shows UNCERTAIN — we never invent coords.',
  },
  {
    t: '2. Striker verifies',
    d: 'On end-ride, verifyRide runs envelope checks (speed, distance, IMU energy band by vehicle class). PASS is eligible. REVIEW is held. FAIL earns zero Boltz.',
  },
  {
    t: '3. Earn Boltz',
    d: 'Eligible sessions credit Boltz at vehicle multipliers (electric rides earn more). Balance lives in-app as demo credits until mainnet.',
  },
  {
    t: '4. Progress the loop',
    d: 'Garage + tune, shop gear, climb crew rank, clear missions, claim airdrops. Everything denser than a splash-only funnel.',
  },
];

export default function HowItWorks() {
  return (
    <MarketingShell title="How it works — BOLTORIUM">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="hud-label text-cyan">How it works</p>
        <h1 className="headline mt-2 text-4xl sm:text-5xl">Ride → verify → earn</h1>
        <p className="mt-4 text-bone/70">
          Boltorium is ride-to-earn with teeth. Real GPS, Striker anti-cheat, neon green Boltz —
          not a gold vault login dump.
        </p>
        <div className="mt-10 space-y-6">
          {DETAIL.map((s) => (
            <article key={s.t} className="cv-card p-5 sm:p-6">
              <h2 className="headline text-xl text-bolt">{s.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-bone/70">{s.d}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/login" className="btn-bolt !w-auto !px-8 !rounded-full">Enter App</Link>
          <Link to="/ecosystem" className="inline-flex h-14 items-center rounded-full border border-white/20 px-6 font-display font-bold uppercase tracking-wider">
            Ecosystem
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
