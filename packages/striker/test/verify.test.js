import assert from 'node:assert/strict';
import { test } from 'node:test';
import { verifyRide, hashTrace, vehicleProfiles } from '../src/index.js';

const M_PER_DEG_LAT = 111_320;

function makeTrace({
  vehicleType = 'emoto',
  n = 24,
  speedMps = 8.3,
  dtMs = 1000,
  start = { lat: 43.6532, lng: -79.3832 },
  mockLocation = false,
  gpsSpeedScale = 1,
  jumpDeg = 0,
  accuracy = 6,
  imu = true,
} = {}) {
  const points = [];
  let lat = start.lat;
  const lng = start.lng;
  let t = 1_720_000_000_000;
  for (let i = 0; i < n; i++) {
    if (jumpDeg && i === Math.floor(n / 2)) lat += jumpDeg;
    else lat += (speedMps * (dtMs / 1000)) / M_PER_DEG_LAT;
    const p = {
      t,
      lat,
      lng,
      accuracy,
      speed: speedMps * gpsSpeedScale,
    };
    if (mockLocation) p.mockLocation = true;
    if (imu) {
      p.imu = {
        ax: 2.1 + (i % 4) * 0.15,
        ay: -1.6,
        az: 11.3,
      };
    }
    points.push(p);
    t += dtMs;
  }
  return { vehicleType, points };
}

test('catalog has required vehicles and omits hoverboard/segway', () => {
  const required = [
    'emoto', 'dirtbike', 'motorcycle', 'ebike', 'bicycle', 'eskate',
    'skateboard', 'scooter', 'escooter', 'euc', 'onewheel', 'gocart',
    'quad', 'golf_cart', 'etrike', 'cargo_bike', 'wheelchair', 'e_wheelchair',
    'mobility_scooter', 'foilboard', 'paddleboard', 'kayak', 'canoe',
    'jetski', 'drone', 'diy_conversion', 'mtb',
  ];
  for (const id of required) {
    assert.ok(vehicleProfiles[id], `missing profile ${id}`);
    assert.ok(['land', 'water', 'air'].includes(vehicleProfiles[id].surface));
    assert.ok(vehicleProfiles[id].maxSpeedKmh > 0);
    assert.ok(vehicleProfiles[id].minMovingSpeed >= 0);
    assert.ok(vehicleProfiles[id].imuEnergy.band);
  }
  assert.equal(vehicleProfiles.hoverboard, undefined);
  assert.equal(vehicleProfiles.segway, undefined);
});

test('good emoto PASSes with hash and high trust', () => {
  const trace = makeTrace({ vehicleType: 'emoto' });
  const result = verifyRide(trace);
  assert.equal(result.status, 'PASS');
  assert.equal(result.vehicleType, 'emoto');
  assert.ok(result.trust >= 80);
  assert.equal(result.reasons.length, 0);
  assert.equal(result.hash, hashTrace(trace));
  assert.match(result.hash, /^[0-9a-f]{64}$/);
});

test('teleport jump FAILs', () => {
  const trace = makeTrace({ vehicleType: 'emoto', jumpDeg: 2 });
  const result = verifyRide(trace);
  assert.equal(result.status, 'FAIL');
  assert.ok(result.reasons.includes('teleport'));
});

test('speed mismatch is REVIEW or FAIL', () => {
  const trace = makeTrace({ vehicleType: 'emoto', gpsSpeedScale: 0.12 });
  const result = verifyRide(trace);
  assert.ok(['REVIEW', 'FAIL'].includes(result.status), result.status);
  assert.ok(result.reasons.includes('speed_mismatch'));
});

test('wheelchair overspeed FAILs', () => {
  const trace = makeTrace({
    vehicleType: 'wheelchair',
    speedMps: 12,
    imu: false,
  });
  const result = verifyRide(trace);
  assert.equal(result.status, 'FAIL');
  assert.ok(result.reasons.includes('vehicle_overspeed'));
});

test('mockLocation FAILs', () => {
  const trace = makeTrace({ vehicleType: 'emoto', mockLocation: true });
  const result = verifyRide(trace);
  assert.equal(result.status, 'FAIL');
  assert.ok(result.reasons.includes('mock_location'));
  assert.equal(result.trust, 0);
});

test('hashTrace is stable across key order', () => {
  const a = hashTrace({
    points: [
      { t: 1, lat: 43.65, lng: -79.38 },
      { t: 2, lat: 43.651, lng: -79.381 },
    ],
  });
  const b = hashTrace({
    points: [
      { lng: -79.38, lat: 43.65, t: 1 },
      { lng: -79.381, t: 2, lat: 43.651 },
    ],
  });
  assert.equal(a, b);
  assert.equal(a.length, 64);
  const c = hashTrace({
    points: [
      { t: 1, lat: 43.65, lng: -79.38 },
      { t: 2, lat: 43.651, lng: -79.381 },
    ],
  });
  assert.equal(a, c);
});
