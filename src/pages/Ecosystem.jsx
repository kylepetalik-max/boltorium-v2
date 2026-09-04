import { Link } from 'react-router-dom';
import MarketingShell from '../components/marketing/MarketingShell.jsx';
import { asset } from '../lib/asset.js';

const PIECES = [
  { t: 'Ride HUD', d: 'Live speed, distance, drops on a neon map. Safety gate before ignition.' },
  { t: 'Garage + Tune', d: 'Fleet classes (EUC, e-moto, scooter, air). Throttle, regen, lights.' },
  { t: 'Shop', d: 'Official + P2P marketplace with dual Boltz / SOL price display.' },
  { t: 'Rank & Missions', d: 'Crew leaderboard, weekly missions, airdrop pings.' },
  { t: 'Wallet', d: 'Boltz balance, demo pubkey, ride activity, send/receive stubs.' },
  { t: 'Striker', d: 'Vendored @boltorium/striker — verify before credit.' },
];

export default function Ecosystem() {
  return (
    <MarketingShell title="Ecosystem — BOLTORIUM">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="hud-label text-solana">Ecosystem</p>
            <h1 className="headline mt-2 text-4xl sm:text-5xl">The loop riders live in</h1>
            <p className="mt-4 max-w-xl text-bone/70">
              App surface after Enter App: home charge pill, ignition, missions teaser, garage cards,
              shop listings — graffiti mark + cyan→violet RTL energy.
            </p>
          </div>
          <img src={asset('brand/b-mark.png')} alt="" className="h-24 w-24 object-contain opacity-90 md:h-28 md:w-28" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PIECES.map((p) => (
            <div key={p.t} className="holo-card rounded-2xl p-5">
              <p className="headline text-lg text-bolt">{p.t}</p>
              <p className="mt-2 text-sm text-bone/65">{p.d}</p>
            </div>
          ))}
        </div>
        <Link to="/app" className="btn-bolt mt-10 !w-auto !px-8 !rounded-full">Enter the app</Link>
      </div>
    </MarketingShell>
  );
}
