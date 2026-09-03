import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { verifyRide } from '@boltorium/striker';
import { earnMultiplier, getVehicle } from '../lib/vehicles.js';
import { haversineMeters } from '../lib/format.js';
import { playBeep, playChaching, playFail } from '../lib/audio.js';
import { watchRide, attachImu } from '../lib/geo.js';

const KEY = 'boltorium-v2-state';
export const DEMO_PUBKEY = 'Demo111111111111111111111111111111111111111';

const CREW = [
  { id: 'you', name: 'YOU', km: 0, boltz: 0, vehicle: 'emoto' },
  { id: 'nova', name: 'NOVA.K', km: 184.2, boltz: 2410, vehicle: 'euc' },
  { id: 'jax', name: 'JAX.RIDE', km: 156.8, boltz: 1988, vehicle: 'emoto' },
  { id: 'mira', name: 'MIRA.VOLT', km: 142.1, boltz: 1760, vehicle: 'ebike' },
  { id: 'zed', name: 'ZED.TRACE', km: 118.4, boltz: 1512, vehicle: 'eskate' },
  { id: 'rio', name: 'RIO.FOIL', km: 96.0, boltz: 1188, vehicle: 'onewheel' },
  { id: 'ash', name: 'ASH.MTB', km: 88.7, boltz: 940, vehicle: 'mtb' },
  { id: 'kenji', name: 'KENJI', km: 74.3, boltz: 810, vehicle: 'dirtbike' },
];

const DROPS = [
  { id: 'd1', name: 'NEON DISTRICT', lat: 43.6532, lng: -79.3832, boltz: 80, xp: 40 },
  { id: 'd2', name: 'THUNDER FLATS', lat: 43.6629, lng: -79.3957, boltz: 120, xp: 60 },
  { id: 'd3', name: 'SURGE COAST', lat: 43.639, lng: -79.387, boltz: 95, xp: 50 },
  { id: 'd4', name: 'VOLT CACHE', lat: 43.648, lng: -79.377, boltz: 150, xp: 80 },
];

const MISSIONS = [
  { id: 'm1', title: 'FIRST SPARK', detail: 'Complete 1 verified ride', kind: 'rides', target: 1, xp: 50, boltz: 40, period: 'daily' },
  { id: 'm2', title: 'FIVE KLICKS', detail: 'Ride 5 km total', kind: 'km', target: 5, xp: 80, boltz: 60, period: 'weekly' },
  { id: 'm3', title: 'HELMET ON', detail: 'Accept the safety gate', kind: 'safety', target: 1, xp: 20, boltz: 10, period: 'daily' },
  { id: 'm4', title: 'AIRDROP HUNTER', detail: 'Claim 1 geo-airdrop', kind: 'drops', target: 1, xp: 70, boltz: 50, period: 'daily' },
  { id: 'm5', title: 'CREW UP', detail: 'Open crew rank', kind: 'rank', target: 1, xp: 15, boltz: 10, period: 'weekly' },
  { id: 'm6', title: 'WEEKLY HAUL', detail: 'Ride 20 km total', kind: 'km', target: 20, xp: 200, boltz: 120, period: 'weekly' },
  { id: 'm7', title: 'HIT 40 KM/H', detail: 'Reach 40 km/h on a ride', kind: 'speed', target: 40, xp: 90, boltz: 70, period: 'daily' },
];

const SHOP = [
  { id: 's1', name: 'AOP HOODIE', cat: 'MERCH', price: 4200, solPrice: 0.38, note: 'RIDE THE LIGHTNING' },
  { id: 's2', name: 'BOLTORIUM HELMET', cat: 'HELMET', price: 8900, solPrice: 0.82, note: 'MIPS trail lid' },
  { id: 's3', name: 'RIDE GLOVES', cat: 'GLOVES', price: 1650, solPrice: 0.15, note: 'Grip in the storm' },
  { id: 's4', name: 'VOLT TEE', cat: 'MERCH', price: 980, solPrice: 0.09, note: 'Graffiti B-mark' },
  { id: 's5', name: 'CONTROLLER CABLE', cat: 'TUNE', price: 420, solPrice: 0.04, note: 'UART / BLE' },
  { id: 's6', name: 'STORM GOGGLES', cat: 'GEAR', price: 2380, solPrice: 0.21, note: 'Night ops visor' },
  { id: 's7', name: 'BOLTZ PACK', cat: 'BATTERY', price: 12500, solPrice: 1.14, note: 'Swap pack' },
  { id: 's8', name: 'NEON VISOR', cat: 'GEAR', price: 3120, solPrice: 0.28, note: 'HUD visor' },
];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

const initial = {
  hydrated: false,
  user: null,
  onboarded: false,
  vehicleId: 'emoto',
  boltz: 0,
  xp: 0,
  rides: [],
  ghost: [],
  claimedDrops: [],
  missionDone: [],
  rankOpened: false,
  safetyEver: false,
  lastVerify: null,
  lastTraceHash: null,
  ride: null,
  gpsError: null,
  voice: { ok: false, reason: 'idle' },
  moreOpen: false,
  tune: { powerMap: 2, regen: 42, peakAmps: 80, throttle: 2, preset: 'RACE' },
};

function persistable(s) {
  return {
    user: s.user,
    onboarded: s.onboarded,
    vehicleId: s.vehicleId,
    boltz: s.boltz,
    xp: s.xp,
    rides: s.rides,
    ghost: s.ghost,
    claimedDrops: s.claimedDrops,
    missionDone: s.missionDone,
    rankOpened: s.rankOpened,
    safetyEver: s.safetyEver,
    lastVerify: s.lastVerify,
    lastTraceHash: s.lastTraceHash,
    tune: s.tune,
  };
}

function comboFrom(points, speedKmh) {
  if (!points?.length) return 1;
  const moving = points.filter((p) => p.speed != null && p.speed > 1).length;
  const ratio = moving / Math.max(1, points.length);
  const boost = Math.min(4, (speedKmh || 0) / 40);
  return Math.round((1 + ratio * 2 + boost) * 10) / 10;
}

function estimatedBoltz(distanceM, vehicleId, combo) {
  const km = (distanceM || 0) / 1000;
  return Math.max(0, Math.round(km * 12 * earnMultiplier(vehicleId) * (combo || 1)));
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      const p = action.payload || {};
      return {
        ...state,
        ...p,
        hydrated: true,
        tune: (() => {
          const t = p.tune || {};
          if (typeof t.powerMap !== 'number') {
            return { powerMap: 2, regen: 42, peakAmps: 80, throttle: 2, preset: 'RACE' };
          }
          return {
            powerMap: t.powerMap,
            regen: t.regen,
            peakAmps: t.peakAmps,
            throttle: t.throttle,
            preset: t.preset || 'CUSTOM',
          };
        })(),
      };
    }
    case 'LOGIN':
      return { ...state, user: action.user };
    case 'LOGOUT':
      return { ...initial, hydrated: true };
    case 'ONBOARDED':
      return { ...state, onboarded: true };
    case 'VEHICLE':
      return { ...state, vehicleId: action.id };
    case 'MORE':
      return { ...state, moreOpen: action.open };
    case 'VOICE':
      return { ...state, voice: action.voice };
    case 'GPS_ERROR':
      return { ...state, gpsError: action.error };
    case 'BEGIN_RIDE': {
      const ride = {
        id: `r_${Date.now()}`,
        vehicleId: state.vehicleId,
        startedAt: Date.now(),
        points: [],
        distanceM: 0,
        topSpeedKmh: 0,
        lastSpeedKmh: null,
        speedUncertain: true,
        glance: false,
        lastImu: null,
      };
      return { ...state, ride, gpsError: null, safetyEver: true };
    }
    case 'TOGGLE_GLANCE':
      if (!state.ride) return state;
      return { ...state, ride: { ...state.ride, glance: !state.ride.glance } };
    case 'SET_GLANCE':
      if (!state.ride) return state;
      return { ...state, ride: { ...state.ride, glance: action.glance } };
    case 'POINT': {
      if (!state.ride) return state;
      const p = { ...action.point };
      if (state.ride.lastImu) p.imu = state.ride.lastImu;
      const points = [...state.ride.points, p];
      let distanceM = state.ride.distanceM;
      if (points.length >= 2) {
        const a = points[points.length - 2];
        distanceM += haversineMeters(a.lat, a.lng, p.lat, p.lng);
      }
      const kmh = p.speed == null ? null : Math.max(0, p.speed * 3.6);
      const topSpeedKmh =
        kmh != null ? Math.max(state.ride.topSpeedKmh, kmh) : state.ride.topSpeedKmh;
      return {
        ...state,
        ride: {
          ...state.ride,
          points,
          distanceM,
          topSpeedKmh,
          lastSpeedKmh: kmh,
          speedUncertain: kmh == null,
        },
        gpsError: null,
      };
    }
    case 'IMU':
      if (!state.ride) return state;
      return { ...state, ride: { ...state.ride, lastImu: action.imu } };
    case 'END_RIDE': {
      if (!state.ride) return state;
      const ride = state.ride;
      const combo = comboFrom(ride.points, ride.lastSpeedKmh);
      const preview = estimatedBoltz(ride.distanceM, ride.vehicleId, combo);
      let result;
      try {
        result = verifyRide({
          vehicleType: ride.vehicleId,
          points: ride.points.map((p) => ({
            t: p.t,
            lat: p.lat,
            lng: p.lng,
            alt: p.alt,
            accuracy: p.accuracy,
            speed: p.speed,
            imu: p.imu,
          })),
        });
      } catch (e) {
        result = {
          status: 'FAIL',
          trust: 0,
          reasons: ['verify_error'],
          hash: '',
          vehicleType: ride.vehicleId,
        };
      }
      const pass = result.status === 'PASS';
      const awarded = pass ? preview : 0;
      if (pass) playChaching();
      else playFail();
      const recap = {
        ...ride,
        endedAt: Date.now(),
        combo,
        preview,
        awarded,
        verify: result,
      };
      const rides = [recap, ...state.rides].slice(0, 40);
      const ghost = ride.points.map((p) => [p.lat, p.lng]);
      let missionDone = state.missionDone;
      if (pass && !missionDone.includes('m1')) missionDone = [...missionDone, 'm1'];
      const totalKm =
        rides.reduce((n, r) => n + (r.distanceM || 0), 0) / 1000 +
        (pass ? 0 : 0);
      if (totalKm >= 5 && !missionDone.includes('m2')) missionDone = [...missionDone, 'm2'];
      if (totalKm >= 20 && !missionDone.includes('m6')) missionDone = [...missionDone, 'm6'];
      if (pass && (ride.topSpeedKmh || 0) >= 40 && !missionDone.includes('m7')) {
        missionDone = [...missionDone, 'm7'];
      }
      return {
        ...state,
        ride: null,
        rides,
        ghost,
        boltz: state.boltz + awarded,
        xp: state.xp + (pass ? 25 : 5),
        lastVerify: result,
        lastTraceHash: result.hash,
        missionDone,
      };
    }
    case 'CLAIM_DROP': {
      if (state.claimedDrops.includes(action.id)) return state;
      const drop = DROPS.find((d) => d.id === action.id);
      if (!drop) return state;
      const missionDone = state.missionDone.includes('m4')
        ? state.missionDone
        : [...state.missionDone, 'm4'];
      return {
        ...state,
        claimedDrops: [...state.claimedDrops, action.id],
        boltz: state.boltz + drop.boltz,
        xp: state.xp + drop.xp,
        missionDone,
      };
    }
    case 'MISSION': {
      if (state.missionDone.includes(action.id)) return state;
      const m = MISSIONS.find((x) => x.id === action.id);
      if (!m) return state;
      return {
        ...state,
        missionDone: [...state.missionDone, action.id],
        boltz: state.boltz + m.boltz,
        xp: state.xp + m.xp,
      };
    }
    case 'FLAG_RANK': {
      const done = state.missionDone.includes('m5')
        ? state.missionDone
        : [...state.missionDone, 'm5'];
      if (state.rankOpened && done === state.missionDone) return state;
      return { ...state, rankOpened: true, missionDone: done };
    }
    case 'BUY': {
      const item = SHOP.find((s) => s.id === action.id);
      if (!item || state.boltz < item.price) return state;
      return { ...state, boltz: state.boltz - item.price };
    }
    case 'TUNE':
      return { ...state, tune: { ...state.tune, ...action.patch } };
    default:
      return state;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const watchRef = useRef(null);
  const imuRef = useRef(null);

  useEffect(() => {
    const saved = load();
    dispatch({ type: 'HYDRATE', payload: saved || {} });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(persistable(state)));
    } catch {
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    if (!state.ride) {
      watchRef.current?.();
      watchRef.current = null;
      imuRef.current?.();
      imuRef.current = null;
      return;
    }
    watchRef.current = watchRide({
      onPoint: (point) => dispatch({ type: 'POINT', point }),
      onError: (error) => dispatch({ type: 'GPS_ERROR', error: error?.message || 'gps' }),
    });
    imuRef.current = attachImu((imu) => dispatch({ type: 'IMU', imu }));
    return () => {
      watchRef.current?.();
      imuRef.current?.();
    };
  }, [state.ride?.id]);

  const api = useMemo(() => {
    const login = (user) => dispatch({ type: 'LOGIN', user });
    const logout = () => {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      dispatch({ type: 'LOGOUT' });
    };
    const beginRide = () => {
      playBeep();
      if (!state.missionDone.includes('m3')) {
        dispatch({ type: 'MISSION', id: 'm3' });
      }
      dispatch({ type: 'BEGIN_RIDE' });
    };
    const endRide = () => dispatch({ type: 'END_RIDE' });
    return {
      ...state,
      drops: DROPS,
      missions: MISSIONS,
      shop: SHOP,
      crew: CREW.map((c) =>
        c.id === 'you'
          ? {
              ...c,
              name: state.user?.name || 'YOU',
              km: state.rides.reduce((n, r) => n + (r.distanceM || 0), 0) / 1000,
              boltz: state.boltz,
              vehicle: state.vehicleId,
            }
          : c,
      ),
      vehicle: getVehicle(state.vehicleId),
      demoPubkey: DEMO_PUBKEY,
      login,
      logout,
      onboard: () => dispatch({ type: 'ONBOARDED' }),
      setVehicle: (id) => dispatch({ type: 'VEHICLE', id }),
      setMore: (open) => dispatch({ type: 'MORE', open }),
      setVoice: (voice) => dispatch({ type: 'VOICE', voice }),
      beginRide,
      endRide,
      toggleGlance: () => dispatch({ type: 'TOGGLE_GLANCE' }),
      setGlance: (glance) => dispatch({ type: 'SET_GLANCE', glance }),
      claimDrop: (id) => dispatch({ type: 'CLAIM_DROP', id }),
      buy: (id) => dispatch({ type: 'BUY', id }),
      flagRank: () => dispatch({ type: 'FLAG_RANK' }),
      setTune: (patch) => dispatch({ type: 'TUNE', patch }),
    };
  }, [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore');
  return v;
}

export { DROPS, MISSIONS, SHOP, CREW };
