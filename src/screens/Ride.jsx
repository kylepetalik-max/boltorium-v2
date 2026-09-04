import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NeonMap from '../components/NeonMap.jsx';
import { useStore } from '../state/store.jsx';
import { formatDuration, formatKm, formatInt, haversineMeters } from '../lib/format.js';
import { earnMultiplier } from '../lib/vehicles.js';
import { asset } from '../lib/asset.js';

const CHECKS = [
  { id: 'helmet', t: 'I will wear a helmet' },
  { id: 'phone', t: 'I will not use my phone while riding' },
  { id: 'risk', t: 'I assume all risk of injury' },
  { id: 'age', t: 'I am 16 years of age or older' },
];

function HudFrame() {
  return (
    <div className="pointer-events-none absolute inset-3 z-20" aria-hidden>
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
      <span className="hud-tick absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-bolt/70 shadow-bolt" />
      <span className="hud-tick absolute bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-bolt/70 shadow-bolt" />
    </div>
  );
}

function SafetyGate({ onGo }) {
  const [ok, setOk] = useState({});
  const all = CHECKS.every((c) => ok[c.id]);
  const toggle = (id) => setOk((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-8 pt-14">
      <p className="relative hud-label text-bone/55">PRE-RIDE · SAFETY GATE</p>
      <h1 className="relative mt-2 font-display text-4xl font-extrabold italic uppercase text-bone">HOLD.</h1>
      <p className="relative mt-2 text-sm text-bone/60">
        The ride will not start until every line is accepted. This is not optional.
      </p>
      <div className="relative mt-6 space-y-2">
        {CHECKS.map((c) => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
              ok[c.id] ? 'border-bolt/70 bg-bolt/12 shadow-bolt' : 'holo-card border-transparent'
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${
                ok[c.id] ? 'border-bolt bg-bolt text-void' : 'border-bolt/30'
              }`}
            >
              {ok[c.id] ? '✓' : ''}
            </span>
            <span className="text-sm">{c.t}</span>
          </button>
        ))}
      </div>
      <button className="btn-bolt relative mt-auto" disabled={!all} style={{ opacity: all ? 1 : 0.35 }} onClick={onGo}>
        {all ? 'START RIDE' : 'ACCEPT ALL TO START'}
      </button>
    </div>
  );
}

export default function Ride() {
  const store = useStore();
  const nav = useNavigate();
  const { ride, ghost, vehicle, gpsError, endRide, beginRide, toggleGlance, drops, claimedDrops } = store;

  const live = useMemo(() => (ride?.points || []).map((p) => [p.lat, p.lng]), [ride?.points]);
  const openDrops = useMemo(
    () => (drops || []).filter((d) => !claimedDrops.includes(d.id)),
    [drops, claimedDrops],
  );
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!ride) {
    return (
      <SafetyGate
        onGo={() => {
          beginRide();
        }}
      />
    );
  }

  const uncertain = ride.speedUncertain || ride.lastSpeedKmh == null;
  const speedText = uncertain ? '—' : String(Math.round(ride.lastSpeedKmh));
  const combo = uncertain
    ? 1
    : Math.max(1, Number((1 + (ride.lastSpeedKmh || 0) / 80).toFixed(1)));
  const preview = Math.round(((ride.distanceM || 0) / 1000) * 12 * earnMultiplier(vehicle.id) * combo);
  const dur = formatDuration(Date.now() - ride.startedAt);

  const here = ride.points?.at?.(-1);
  let nearest = null;
  if (here && openDrops.length) {
    for (const d of openDrops) {
      const m = haversineMeters(here.lat, here.lng, d.lat, d.lng);
      if (!nearest || m < nearest.m) nearest = { ...d, m };
    }
  }

  const finish = () => {
    endRide();
    nav('/recap');
  };

  const pingLabel = !nearest
    ? 'RADAR'
    : nearest.m < 1000
      ? `${Math.round(nearest.m)} M`
      : `${(nearest.m / 1000).toFixed(1)} KM`;

  if (ride.glance) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col px-4 pb-6 pt-12" onClick={toggleGlance}>
          <HudFrame />
        <header className="relative z-10 flex items-center justify-between">
          <img src={asset('brand/boltorium-graffiti-v1.png')} alt="" className="h-9 w-auto max-w-[7rem] object-contain" />
          <p className="headline text-lg text-bolt">LIVE RIDE</p>
          <p className="hud-label text-danger pulse-live">● LIVE</p>
        </header>
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          <p className="hud-label mb-2">{uncertain ? 'GPS SPEED' : 'SPEED'}</p>
          {uncertain ? (
            <p className="headline text-5xl text-cyan">UNCERTAIN</p>
          ) : (
            <p className="hud-num speed-blur text-8xl text-bolt" data-speed={speedText}>
              {speedText}
            </p>
          )}
          <p className="headline mt-1 text-xl text-bone/70">KM/H</p>
          <p className="mt-6 font-mono text-[11px] text-bone/40">
            {gpsError ? `GPS: ${gpsError}` : 'TAP FOR FULL HUD'}
          </p>
        </div>
        <div className="relative z-10 mb-4 grid grid-cols-3 gap-2 text-center">
          <Stat k="DISTANCE" v={`${formatKm(ride.distanceM)} KM`} />
          <Stat k="TIME" v={dur} />
          <Stat k="TOP" v={ride.topSpeedKmh ? `${Math.round(ride.topSpeedKmh)}` : '—'} />
        </div>
        <button
          className="btn-danger relative z-10"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
        >
          END RIDE
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute inset-0">
        <NeonMap live={live} ghost={ghost} drops={openDrops} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/55 via-transparent to-void/88" />
      <HudFrame />

      <header className="pointer-events-auto relative z-10 flex items-center justify-between px-4 pt-12">
        <img
          src={asset('brand/boltorium-graffiti-v1.png')}
          alt=""
          className="h-10 w-auto max-w-[7.5rem] object-contain drop-shadow-[0_0_12px_rgba(34,224,106,0.55)]"
        />
        <p className="headline text-xl text-bolt">LIVE RIDE</p>
        <p className="hud-label text-danger pulse-live">● LIVE</p>
      </header>

      <div className="relative z-10 mt-1 px-5" onClick={toggleGlance}>
        <div className="flex items-end gap-2">
          {uncertain ? (
            <p className="headline text-[42px] leading-none text-cyan">UNCERTAIN</p>
          ) : (
            <p className="hud-num speed-blur text-[86px] leading-none text-bolt" data-speed={speedText}>
              {speedText}
            </p>
          )}
          <p className="headline mb-3 text-lg text-bone/70">KM/H</p>
        </div>
        {gpsError && <p className="mt-1 font-mono text-[10px] text-plasma">{gpsError}</p>}
      </div>

      <div className="relative z-10 mt-2 flex items-start justify-between px-5">
        <div>
          <p className="hud-label text-bone">COMBO</p>
          <p className="headline text-[44px] leading-none text-bolt drop-shadow-[0_0_18px_rgba(34,224,106,0.85)]">
            x{combo.toFixed(1)}
          </p>
        </div>
        <div className="text-right">
          <p className="hud-label text-bone">BOLTZ</p>
          <p className="headline text-[36px] leading-none text-bolt">+{formatInt(preview)}</p>
          <div className="mt-3 flex flex-col items-end">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <span className="radar-ring" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-bolt bg-void shadow-bolt">
                <Chute />
              </span>
            </div>
            <p className="hud-label mt-1 text-[9px] text-bolt">AIRDROP {pingLabel}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto px-4 pb-5">
        <button className="btn-danger mb-3" onClick={finish}>
          END RIDE
        </button>
        <div className="glass grid grid-cols-4 gap-1 rounded-2xl px-2 py-3">
          <Stat icon={<RoadIcon />} k="DISTANCE" v={`${formatKm(ride.distanceM)} KM`} />
          <Stat icon={<ClockIcon />} k="DURATION" v={dur} />
          <Stat
            icon={<BoltMini />}
            k="TOP SPEED"
            v={ride.topSpeedKmh ? `${Math.round(ride.topSpeedKmh)}` : '—'}
          />
          <Stat icon={<BoltMini />} k="BOLTZ" v={formatInt(preview)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v, icon }) {
  return (
    <div className="text-center">
      {icon ? <div className="mb-0.5 flex justify-center text-bolt">{icon}</div> : null}
      <p className="hud-label text-[8px]">{k}</p>
      <p className="font-hud text-[11px] text-bolt">{v}</p>
    </div>
  );
}

function Chute() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22E06A" strokeWidth="1.8" aria-hidden>
      <path d="M4 10c0-5 3.2-8 8-8s8 3 8 8" />
      <path d="M4 10h16 M6 10 12 20 18 10" />
    </svg>
  );
}

function RoadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M9 3 L6 21 M15 3 L18 21 M12 6 v3 M12 13 v3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8 v5 l3 2" />
    </svg>
  );
}

function BoltMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h7l-2 8 11-14h-7l2-6z" />
    </svg>
  );
}
