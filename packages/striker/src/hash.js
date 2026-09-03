import { sha256 } from 'js-sha256';

const COORD_DECIMALS = 7;

function roundCoord(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return n;
  const f = 10 ** COORD_DECIMALS;
  return Math.round(n * f) / f;
}

function slimPoint(p) {
  if (!p || typeof p !== 'object') return null;
  const lat = p.lat;
  const lng = p.lng ?? p.lon;
  const t = p.t ?? p.timestamp ?? p.time;
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(t)) {
    return null;
  }
  const point = { lat: roundCoord(lat), lng: roundCoord(lng), t };
  const alt = p.alt ?? p.altitude;
  if (Number.isFinite(alt)) point.alt = roundCoord(alt);
  return point;
}

function extractPoints(trace) {
  if (Array.isArray(trace)) return trace;
  if (trace && Array.isArray(trace.points)) return trace.points;
  return [];
}

/**
 * Stable SHA-256 of the verified point list (t, lat, lng, optional alt).
 * Key order in the input objects does not affect the digest. The hex string
 * is what a Solana memo / tx must carry before Boltz can be paid.
 * Uses js-sha256 so the package builds in browsers without a node:crypto shim.
 */
export function hashTrace(trace) {
  const slim = extractPoints(trace).map(slimPoint).filter(Boolean);
  const json = JSON.stringify(slim);
  return sha256(json);
}

export { slimPoint, extractPoints };
