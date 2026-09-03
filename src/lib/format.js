export function pad2(n) {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0');
}

export function formatDuration(ms) {
  const s = Math.max(0, Math.floor((ms || 0) / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
}

export function formatKm(m) {
  const km = (m || 0) / 1000;
  if (km < 10) return km.toFixed(2);
  return km.toFixed(1);
}

export function formatInt(n) {
  return Math.round(n || 0).toLocaleString('en-US');
}

export function shortHash(h, n = 8) {
  if (!h) return '—';
  return `${h.slice(0, n)}…${h.slice(-n)}`;
}

export function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function formatAgo(ts) {
  if (!ts) return '';
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 45) return 'NOW';
  if (s < 3600) return `${Math.floor(s / 60)} MIN AGO`;
  const h = Math.floor(s / 3600);
  if (h < 24) return `${h} HOUR${h === 1 ? '' : 'S'} AGO`;
  if (h < 48) return 'YESTERDAY';
  return `${Math.floor(h / 24)} D AGO`;
}
