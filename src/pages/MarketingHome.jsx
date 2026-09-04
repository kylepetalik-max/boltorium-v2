import { Link } from 'react-router-dom';
import MarketingShell from '../components/marketing/MarketingShell.jsx';
import HeroVideo from '../components/HeroVideo.jsx';
import { asset } from '../lib/asset.js';

const STEPS = [
  { n: '01', t: 'Ride', d: 'Hop on your EUC, e-moto, board, or scooter. GPS tracks the real path.' },
  { n: '02', t: 'Verify', d: 'Striker checks speed, distance, and IMU envelopes. PASS earns. FAIL earns nothing.' },
  { n: '03', t: 'Earn Boltz', d: 'Verified rides mint Boltz on demo / devnet today — mainnet when we ship it.' },
  { n: '04', t: 'Spend & Rank', d: 'Tune your garage, shop gear, climb crew rank, and chase missions.' },
];

const BENEFITS = [
  { t: 'Built for riders', d: 'Phone-first HUD, safety gate, and vehicle classes that match how you actually ride.' },
  { t: 'Anti-cheat first', d: 'Striker verification before Boltz — no ghost GPS farming.' },
  { t: 'Solana-ready', d: 'Demo pubkey + trace hash today. Honest about mainnet timing.' },
  { t: 'Crew energy', d: 'Rank, missions, airdrops, and a marketplace for official + P2P gear.' },
];

export default function MarketingHome() {
  return (
    <MarketingShell title="BOLTORIUM — Ride the Lightning | Ride-to-Earn">
      {/* HERO */}
      <section className="relative min-h-[88dvh] overflow-hidden">
        <HeroVideo />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/70 via-void/45 to-void" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(ellipse_at_70%_60%,rgba(139,92,246,0.16),transparent_40%)]" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <img
            src={asset('brand/boltorium-graffiti-v1.png')}
            alt="BOLTORIUM"
            className="w-[min(92vw,520px)] object-contain drop-shadow-[0_0_40px_rgba(56,189,248,0.35)]"
          />
          <img
            src={asset('brand/kyle-rtl-mark.png')}
            alt="Ride the Lightning"
            className="mt-4 w-[min(78vw,360px)] object-contain opacity-95"
          />
          <p className="tagline mt-4 text-xs sm:text-sm">Ride the Lightning</p>
          <p className="mt-5 max-w-xl text-base text-bone/75 sm:text-lg">
            GPS-verified ride-to-earn for electric riders. Charge up Boltz, build your garage,
            and join the crew — demo on Solana until mainnet.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login" className="btn-bolt !w-auto !px-8 !rounded-full">
              Join waitlist / Enter App
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex h-14 items-center justify-center rounded-full border border-cyan/50 px-8 font-display text-lg font-extrabold uppercase tracking-wider text-cyan transition hover:bg-cyan/10"
            >
              Learn how it works
            </Link>
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-bone/40">
            DEVNET / DEMO · MAINNET ON THE ROADMAP
          </p>
        </div>
      </section>

      {/* WHAT */}
      <section id="what" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="hud-label text-cyan">What is Boltorium?</p>
        <h2 className="headline mt-2 text-3xl text-bone sm:text-4xl">
          Ride real. Earn verified. <span className="text-bolt">No gold vault fluff.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-bone/70">
          Boltorium is a ride-to-earn app for EUCs, e-motos, boards, and scooters. You ride,
          Striker verifies the session, and eligible rides earn Boltz. Garage, shop, rank, and
          missions wrap the loop — denser chrome, graffiti energy, neon green charge.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { k: 'GPS + IMU', v: 'Real coords on the HUD' },
            { k: 'Striker', v: 'PASS / REVIEW / FAIL gate' },
            { k: 'Boltz', v: 'Neon green charge currency' },
          ].map((c) => (
            <div key={c.k} className="cv-card p-4">
              <p className="headline text-bolt">{c.k}</p>
              <p className="mt-1 text-sm text-bone/65">{c.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-y border-white/5 bg-surface/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="hud-label text-solana">How ride-to-earn works</p>
              <h2 className="headline mt-2 text-3xl sm:text-4xl">Four steps. No shortcuts.</h2>
            </div>
            <Link to="/how-it-works" className="font-display text-sm font-bold uppercase tracking-wider text-cyan hover:text-bolt">
              Full walkthrough →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-void/70 p-5">
                <p className="font-mono text-xs text-cyan">{s.n}</p>
                <p className="headline mt-2 text-xl text-bolt">{s.t}</p>
                <p className="mt-2 text-sm text-bone/65">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIDERS */}
      <section id="riders" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="hud-label text-bolt">Benefits for riders</p>
        <h2 className="headline mt-2 text-3xl sm:text-4xl">Why join the crew</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.t} className="holo-card rounded-2xl p-5">
              <p className="headline text-lg text-bone">{b.t}</p>
              <p className="mt-2 text-sm text-bone/65">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLANA HONESTY */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-solana/40 bg-gradient-to-br from-solana/15 via-void to-cyan/10 p-6 sm:p-8">
          <p className="hud-label text-solana">Solana / Boltz honesty</p>
          <h2 className="headline mt-2 text-2xl sm:text-3xl">Demo &amp; devnet until mainnet.</h2>
          <p className="mt-3 max-w-2xl text-bone/70">
            This preview uses a demo Solana pubkey and trace hashes. Boltz here are demo credits —
            not mainnet minting. We will not claim fake rider counts. Mainnet launch is on the
            roadmap; watch that page for status.
          </p>
          <Link to="/roadmap" className="mt-5 inline-flex font-display text-sm font-bold uppercase tracking-wider text-solana hover:text-bolt">
            Mainnet roadmap →
          </Link>
        </div>
      </section>

      {/* MAINNET CTA */}
      <section id="mainnet" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-bolt/30 bg-void p-8 sm:p-10">
          <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-bolt/20 blur-3xl" />
          <p className="hud-label text-bolt">Mainnet launch</p>
          <h2 className="headline mt-2 text-3xl">Ready when the chain is.</h2>
          <p className="mt-3 max-w-xl text-bone/65">
            Enter the app to join the waitlist loop, explore the garage, and stress-test rides on
            demo rails. We ship mainnet when Striker + tokenomics are locked.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login" className="btn-bolt !w-auto !px-8 !rounded-full">
              Enter App
            </Link>
            <Link to="/roadmap" className="inline-flex h-14 items-center rounded-full border border-white/20 px-6 font-display font-bold uppercase tracking-wider text-bone/80">
              View roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="border-y border-white/5 bg-surface/40 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="hud-label text-cyan">Community</p>
          <h2 className="headline mt-2 text-3xl">Ride with the crew</h2>
          <p className="mx-auto mt-3 max-w-lg text-bone/65">
            Discord and X links are placeholders until channels go live. Drop in via the app
            meanwhile.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="https://discord.gg/" target="_blank" rel="noreferrer" className="rounded-full border border-cyan/40 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-cyan">
              Discord
            </a>
            <a href="https://x.com/" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-bone">
              X / Twitter
            </a>
            <Link to="/login" className="rounded-full bg-bolt px-6 py-3 font-display text-sm font-extrabold uppercase tracking-wider text-void shadow-bolt">
              Enter App
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="hud-label mb-4 text-center text-bone/40">Trust strip</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            'Striker verifyRide',
            'No fake 1M riders',
            'Demo Solana only',
            'Isolated from boltorium.co',
          ].map((t) => (
            <div key={t} className="rounded-xl border border-white/10 px-3 py-4 text-center font-mono text-[10px] tracking-wider text-bone/55">
              {t}
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
