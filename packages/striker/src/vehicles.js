/**
 * Per-vehicle kinematic envelopes used by Striker verification.
 *
 * surface: land | water | air
 * maxSpeedKmh: hard envelope (GPS error margin applied in verify.js)
 * minMovingSpeed: km/h below which a trace is treated as idle / too short
 * imuEnergy: RMS of | |a| − g | in m/s² while moving (optional IMU band)
 *
 * Hoverboard and Segway are intentionally absent — they are not Boltorium
 * vehicle classes and must not be admitted by this catalog.
 */

export const vehicleProfiles = {
  emoto: {
    surface: 'land',
    maxSpeedKmh: 130,
    minMovingSpeed: 3,
    imuEnergy: { band: 'high', min: 0.8, max: 16 },
  },
  dirtbike: {
    surface: 'land',
    maxSpeedKmh: 160,
    minMovingSpeed: 3,
    imuEnergy: { band: 'high', min: 0.9, max: 16 },
  },
  motorcycle: {
    surface: 'land',
    maxSpeedKmh: 250,
    minMovingSpeed: 5,
    imuEnergy: { band: 'high', min: 0.8, max: 16 },
  },
  ebike: {
    surface: 'land',
    maxSpeedKmh: 50,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.3, max: 6 },
  },
  bicycle: {
    surface: 'land',
    maxSpeedKmh: 65,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.3, max: 6 },
  },
  mtb: {
    surface: 'land',
    maxSpeedKmh: 75,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.4, max: 8 },
  },
  eskate: {
    surface: 'land',
    maxSpeedKmh: 55,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.3, max: 7 },
  },
  skateboard: {
    surface: 'land',
    maxSpeedKmh: 45,
    minMovingSpeed: 1.5,
    imuEnergy: { band: 'medium', min: 0.3, max: 7 },
  },
  scooter: {
    surface: 'land',
    maxSpeedKmh: 25,
    minMovingSpeed: 2,
    imuEnergy: { band: 'low', min: 0.1, max: 3.5 },
  },
  escooter: {
    surface: 'land',
    maxSpeedKmh: 50,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.25, max: 6 },
  },
  euc: {
    surface: 'land',
    maxSpeedKmh: 90,
    minMovingSpeed: 3,
    imuEnergy: { band: 'high', min: 0.7, max: 14 },
  },
  onewheel: {
    surface: 'land',
    maxSpeedKmh: 32,
    minMovingSpeed: 2,
    imuEnergy: { band: 'high', min: 0.6, max: 12 },
  },
  gocart: {
    surface: 'land',
    maxSpeedKmh: 80,
    minMovingSpeed: 3,
    imuEnergy: { band: 'medium', min: 0.4, max: 8 },
  },
  quad: {
    surface: 'land',
    maxSpeedKmh: 110,
    minMovingSpeed: 3,
    imuEnergy: { band: 'high', min: 0.7, max: 14 },
  },
  golf_cart: {
    surface: 'land',
    maxSpeedKmh: 32,
    minMovingSpeed: 2,
    imuEnergy: { band: 'low', min: 0.08, max: 3 },
  },
  etrike: {
    surface: 'land',
    maxSpeedKmh: 50,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.25, max: 6 },
  },
  cargo_bike: {
    surface: 'land',
    maxSpeedKmh: 40,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.2, max: 5 },
  },
  wheelchair: {
    surface: 'land',
    maxSpeedKmh: 12,
    minMovingSpeed: 0.6,
    imuEnergy: { band: 'low', min: 0.05, max: 2.5 },
  },
  e_wheelchair: {
    surface: 'land',
    maxSpeedKmh: 18,
    minMovingSpeed: 0.6,
    imuEnergy: { band: 'low', min: 0.05, max: 3 },
  },
  mobility_scooter: {
    surface: 'land',
    maxSpeedKmh: 16,
    minMovingSpeed: 0.6,
    imuEnergy: { band: 'low', min: 0.05, max: 2.8 },
  },
  foilboard: {
    surface: 'water',
    maxSpeedKmh: 55,
    minMovingSpeed: 3,
    imuEnergy: { band: 'high', min: 0.5, max: 12 },
  },
  paddleboard: {
    surface: 'water',
    maxSpeedKmh: 12,
    minMovingSpeed: 0.8,
    imuEnergy: { band: 'low', min: 0.1, max: 4 },
  },
  kayak: {
    surface: 'water',
    maxSpeedKmh: 16,
    minMovingSpeed: 0.8,
    imuEnergy: { band: 'medium', min: 0.15, max: 5 },
  },
  canoe: {
    surface: 'water',
    maxSpeedKmh: 12,
    minMovingSpeed: 0.8,
    imuEnergy: { band: 'low', min: 0.1, max: 4 },
  },
  jetski: {
    surface: 'water',
    maxSpeedKmh: 120,
    minMovingSpeed: 5,
    imuEnergy: { band: 'high', min: 0.8, max: 16 },
  },
  drone: {
    surface: 'air',
    maxSpeedKmh: 100,
    minMovingSpeed: 1,
    imuEnergy: { band: 'medium', min: 0.2, max: 8 },
  },
  diy_conversion: {
    surface: 'land',
    maxSpeedKmh: 140,
    minMovingSpeed: 2,
    imuEnergy: { band: 'medium', min: 0.4, max: 14 },
  },
};

Object.freeze(vehicleProfiles);
for (const profile of Object.values(vehicleProfiles)) {
  Object.freeze(profile);
  Object.freeze(profile.imuEnergy);
}
