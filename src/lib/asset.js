/** Public asset URL that works on GitHub Pages + Capacitor. */
export function asset(path) {
  const clean = String(path || '').replace(/^\/+/, '');
  let base = import.meta.env.BASE_URL || './';

  if (typeof window !== 'undefined' && window.location?.hostname?.endsWith('github.io')) {
    base = '/boltorium-v2/';
  }

  if (base.startsWith('/') || /^https?:/i.test(base)) {
    const root = base.endsWith('/') ? base : `${base}/`;
    return `${root}${clean}`;
  }
  if (typeof document !== 'undefined' && document.baseURI) {
    return new URL(clean, document.baseURI).href;
  }
  return `./${clean}`;
}
