import { hashTrace, extractPoints } from './hash.js';
import { vehicleProfiles } from './vehicles.js';

const EARTH_RADIUS_M = 6_371_000;
const G = 9.80665;

const FAIL_REASONS = new Set([
  'empty_trace',
  'unknown_vehicle',
  'mock_location',
  'teleport',
  'vehicle_overspeed',
]);

export function haversineMeters(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

function normalizePoint(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const lat = Number(raw.lat);
  const lng = Number(raw.lng ?? raw.lon);
  const t = Number(raw.t ?? raw.timestamp ?? raw.time);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(t)) {
    return null;
  }
  const point = { lat, lng, t };
  const alt = raw.alt ?? raw.altitude;
  if (Number.isFinite(Number(alt))) point.alt = Number(alt);
  const accuracy = raw.accuracy ?? raw.acc ?? raw.horizontalAccuracy;
  if (Number.isFinite(Number(accuracy))) point.accuracy = Number(accuracy);
  const speed = raw.speed ?? raw.gpsSpeed ?? raw.speedMps;
  if (Number.isFinite(Number(speed))) point.speed = Number(speed);
  if (raw.mockLocation === true || raw.isMock === true || raw.mocked === true) {
    point.mockLocation = true;
  }
  if (raw.imu && typeof raw.imu === 'object') {
    point.imu = {
      ax: Number(raw.imu.ax) || 0,
      ay: Number(raw.imu.ay) || 0,
      az: Number(raw.imu.az) || 0,
    };
  }
  return point;
}

function imuRmsEnergy(points) {
  const samples = points.filter((p) => p.imu);
  if (!samples.length) return null;
  let sumSq = 0;
  for (const p of samples) {
    const { ax, ay, az } = p.imu;
    const mag = Math.sqrt(ax * ax + ay * ay + az * az);
    const dynamic = Math.abs(mag - G);
    sumSq += dynamic * dynamic;
  }
  return Math.sqrt(sumSq / samples.length);
}

function decideStatus(trust, reasons) {
  if (reasons.some((r) => FAIL_REASONS.has(r)) || trust < 40) return 'FAIL';
  if (reasons.length > 0 || trust < 80) return 'REVIEW';
  return 'PASS';
}

function clampTrust(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Defensive ride verification. Flags spoofed / incoherent traces.
 * Does not describe how to produce those traces.
 *
 * @param {object} trace { vehicleType?, points: Point[] }
 * @param {object} [opts]
 * @returns {{ status: 'PASS'|'REVIEW'|'FAIL', trust: number, reasons: string[], hash: string, vehicleType: string }}
 */
export function verifyRide(trace, opts = {}) {
  const reasons = [];
  let trust = 100;

  const vehicleType = opts.vehicleType || trace?.vehicleType || 'unknown';
  const profile = vehicleProfiles[vehicleType];

  const rawPoints = extractPoints(trace);
  const points = rawPoints.map(normalizePoint).filter(Boolean);
  const hash = hashTrace(points);

  if (!profile) {
    return {
      status: 'FAIL',
      trust: 0,
      reasons: ['unknown_vehicle'],
      hash,
      vehicleType,
    };
  }

  if (!points.length) {
    return {
      status: 'FAIL',
      trust: 0,
      reasons: ['empty_trace'],
      hash,
      vehicleType,
    };
  }

  if (points.some((p) => p.mockLocation === true)) {
    reasons.push('mock_location');
    trust = 0;
  }

  const maxAccuracyM = opts.maxAccuracyM ?? 40;
  const withAcc = points.filter((p) => p.accuracy != null);
  if (withAcc.length) {
    const poor = withAcc.filter((p) => p.accuracy > maxAccuracyM).length;
    if (poor / withAcc.length >= 0.5) {
      reasons.push('poor_accuracy');
      trust -= 25;
    }
  }

  if (points.length < 2) {
    reasons.push('insufficient_points');
    trust -= 40;
    return {
      status: decideStatus(trust, reasons),
      trust: clampTrust(trust),
      reasons,
      hash,
      vehicleType,
    };
  }

  const teleportKmh = opts.teleportKmh ?? Math.max(profile.maxSpeedKmh * 2.5, 180);
  const overspeedMargin = opts.overspeedMargin ?? 1.15;
  const mismatchRatio = opts.speedMismatchRatio ?? 0.4;

  const derivedSpeeds = [];
  let teleport = false;
  let peakKmh = 0;
  let totalM = 0;

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dt = (b.t - a.t) / 1000;
    if (!(dt > 0)) continue;
    const dist = haversineMeters(a.lat, a.lng, b.lat, b.lng);
    totalM += dist;
    const mps = dist / dt;
    const kmh = mps * 3.6;
    derivedSpeeds.push({ mps, kmh, dt, dist, gps: b.speed ?? a.speed });
    if (kmh > peakKmh) peakKmh = kmh;
    if (kmh > teleportKmh) teleport = true;
  }

  if (teleport) {
    reasons.push('teleport');
    trust = Math.min(trust, 5);
  }

  if (peakKmh > profile.maxSpeedKmh * overspeedMargin) {
    reasons.push('vehicle_overspeed');
    trust = Math.min(trust, 20);
  }

  const comparable = derivedSpeeds.filter(
    (s) => Number.isFinite(s.gps) && s.dt >= 0.2 && s.dist >= 1,
  );
  if (comparable.length >= 3) {
    let mismatchN = 0;
    let absSum = 0;
    let ratioSum = 0;
    for (const s of comparable) {
      const delta = Math.abs(s.gps - s.mps);
      const denom = Math.max(s.mps, Math.abs(s.gps), 1);
      const ratio = delta / denom;
      absSum += delta;
      ratioSum += ratio;
      if (ratio > mismatchRatio && delta > 2.5) mismatchN += 1;
    }
    const frac = mismatchN / comparable.length;
    const meanAbs = absSum / comparable.length;
    const meanRatio = ratioSum / comparable.length;
    if (frac >= 0.35 && (meanAbs > 2.5 || meanRatio > mismatchRatio)) {
      reasons.push('speed_mismatch');
      if (meanAbs > 8 || meanRatio > 0.7) trust = Math.min(trust, 25);
      else trust -= 30;
    }
  }

  const durationS =
    (points[points.length - 1].t - points[0].t) / 1000;
  if (durationS > 0) {
    const avgKmh = (totalM / durationS) * 3.6;
    if (avgKmh < profile.minMovingSpeed && totalM < 80) {
      reasons.push('stationary_or_too_short');
      trust -= 20;
    }
  }

  const energy = imuRmsEnergy(points);
  if (energy != null && Number.isFinite(energy)) {
    const band = profile.imuEnergy;
    const moving = derivedSpeeds.some((s) => s.kmh >= profile.minMovingSpeed);
    if (moving && (energy < band.min * 0.25 || energy > band.max * 1.8)) {
      reasons.push('imu_energy_mismatch');
      trust -= 20;
    }
  }

  const alts = points.filter((p) => p.alt != null).map((p) => p.alt);
  if (alts.length >= 2) {
    const range = Math.max(...alts) - Math.min(...alts);
    if (profile.surface === 'air') {
      if (range < 2 && durationS >= 15) {
        reasons.push('drone_altitude_static');
        trust -= 30;
      }
    }
    if (profile.surface === 'water' && range > 80) {
      reasons.push('water_altitude_inconsistent');
      trust -= 35;
    }
  }

  trust = clampTrust(trust);
  return {
    status: decideStatus(trust, reasons),
    trust,
    reasons,
    hash,
    vehicleType,
  };
}
