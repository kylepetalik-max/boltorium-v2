/**
 * Real geolocation. Speed is coords.speed (m/s).
 * If speed is null, the HUD must show UNCERTAIN — never invent km/h.
 */

export function watchRide({ onPoint, onError }) {
  if (!navigator.geolocation) {
    onError?.({ code: 0, message: 'Geolocation unavailable' });
    return () => {};
  }

  const id = navigator.geolocation.watchPosition(
    (pos) => {
      const c = pos.coords;
      const speed =
        c.speed == null || Number.isNaN(c.speed) ? null : Number(c.speed);
      onPoint?.({
        t: pos.timestamp || Date.now(),
        lat: c.latitude,
        lng: c.longitude,
        alt: Number.isFinite(c.altitude) ? c.altitude : undefined,
        accuracy: Number.isFinite(c.accuracy) ? c.accuracy : undefined,
        speed,
        heading: Number.isFinite(c.heading) ? c.heading : undefined,
      });
    },
    (err) => onError?.(err),
    { enableHighAccuracy: true, maximumAge: 800, timeout: 12000 },
  );

  return () => {
    try {
      navigator.geolocation.clearWatch(id);
    } catch {
      /* ignore */
    }
  };
}

export function speedKmh(speedMps) {
  if (speedMps == null || Number.isNaN(speedMps)) return null;
  return Math.max(0, speedMps * 3.6);
}

export function attachImu(onSample) {
  const handler = (e) => {
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a) return;
    onSample?.({
      ax: a.x || 0,
      ay: a.y || 0,
      az: a.z || 0,
    });
  };
  try {
    window.addEventListener('devicemotion', handler, { passive: true });
  } catch {
    return () => {};
  }
  return () => window.removeEventListener('devicemotion', handler);
}
