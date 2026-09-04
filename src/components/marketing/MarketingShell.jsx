import { useEffect } from 'react';
import SiteNav from './SiteNav.jsx';
import SiteFooter from './SiteFooter.jsx';

export default function MarketingShell({ children, title }) {
  useEffect(() => {
    if (title) document.title = title;
    document.body.classList.add('marketing-mode');
    return () => {
      document.body.classList.remove('marketing-mode');
      document.title = 'BOLTORIUM — Ride the Lightning';
    };
  }, [title]);

  return (
    <div className="marketing-shell min-h-[100dvh] bg-void text-bone">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
