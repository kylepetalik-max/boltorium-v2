import { Link } from 'react-router-dom';
import { asset } from '../../lib/asset.js';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-void">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <img
            src={asset('brand/boltorium-graffiti-v1.png')}
            alt="BOLTORIUM"
            className="h-10 w-auto max-w-[180px] object-contain"
          />
          <p className="tagline mt-3 text-[11px]">Ride the Lightning</p>
          <p className="mt-3 max-w-sm text-sm text-bone/50">
            GPS-verified ride-to-earn on Solana. Demo / devnet until mainnet — no fake claims.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="hud-label mb-2 text-bolt">Product</p>
            <ul className="space-y-1.5 text-bone/60">
              <li><Link to="/how-it-works" className="hover:text-bolt">How it works</Link></li>
              <li><Link to="/ecosystem" className="hover:text-bolt">Ecosystem</Link></li>
              <li><Link to="/roadmap" className="hover:text-bolt">Roadmap / Mainnet</Link></li>
              <li><Link to="/login" className="hover:text-bolt">Enter App</Link></li>
            </ul>
          </div>
          <div>
            <p className="hud-label mb-2 text-cyan">Community</p>
            <ul className="space-y-1.5 text-bone/60">
              <li><a href="https://discord.gg/" className="hover:text-cyan" target="_blank" rel="noreferrer">Discord</a></li>
              <li><a href="https://x.com/" className="hover:text-cyan" target="_blank" rel="noreferrer">X / Twitter</a></li>
            </ul>
          </div>
          <div>
            <p className="hud-label mb-2 text-solana">Trust</p>
            <ul className="space-y-1.5 text-bone/60">
              <li>Striker ride verify</li>
              <li>Demo pubkey only</li>
              <li>No mainnet mint yet</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center font-mono text-[10px] tracking-wider text-bone/35">
        © {new Date().getFullYear()} Boltorium · EST. 2023 · BLTRM · Isolated v2 preview
      </div>
    </footer>
  );
}
