import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TabBar from './TabBar.jsx';
import MoreSheet from './MoreSheet.jsx';
import { getSkin, skinLabel } from '../lib/skin.js';
import { useStore } from '../state/store.jsx';

const HIDE_TABS = new Set([
  '/',
  '/how-it-works',
  '/ecosystem',
  '/roadmap',
  '/app',
  '/login',
  '/onboarding',
  '/ride',
  '/recap',
  '/safety',
]);

export default function PhoneShell({ children }) {
  const loc = useLocation();
  const { setMore } = useStore();
  const skin = useMemo(() => getSkin(), []);
  const hideTabs = HIDE_TABS.has(loc.pathname) || loc.pathname.startsWith('/ride');
  const showMore = !HIDE_TABS.has(loc.pathname) && !loc.pathname.startsWith('/ride');
  const videoHero = loc.pathname === '/app' || loc.pathname === '/login';

  return (
    <div className="min-h-[100dvh] bg-void">
      <div className="phone-canvas" data-skin={skin}>
        {showMore && (
          <button
            aria-label="More"
            onClick={() => setMore(true)}
            className="safe-t absolute right-3 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-bolt/35 bg-void/80 text-bone shadow-bolt backdrop-blur-md"
          >
            <span className="headline text-lg leading-none">···</span>
          </button>
        )}
        {(loc.pathname === '/app' || loc.pathname === '/login') && (
          <Link
            to="/"
            className="safe-t absolute left-3 top-2 z-30 rounded-full border border-white/15 bg-void/70 px-2.5 py-1 font-mono text-[9px] tracking-wider text-bone/50 backdrop-blur-md"
          >
            ← SITE
          </Link>
        )}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
        {!hideTabs && <TabBar />}
        <MoreSheet />
        {!videoHero && (
          <div className="pointer-events-none absolute left-2 top-[max(6px,env(safe-area-inset-top))] z-20">
            <span className="hud-label text-[8px] text-bolt/40">{skinLabel(skin)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
