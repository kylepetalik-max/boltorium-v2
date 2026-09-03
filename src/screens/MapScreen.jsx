import { useMemo, useRef, useState } from 'react';
import NeonMap from '../components/NeonMap.jsx';
import { useStore } from '../state/store.jsx';

export default function MapScreen() {
  const { ride, ghost, rides, drops, claimedDrops } = useStore();
  const [ar, setAr] = useState(false);
  const videoRef = useRef(null);

  const live = useMemo(() => (ride?.points || []).map((p) => [p.lat, p.lng]), [ride?.points]);
  const ghostLine = ghost?.length
    ? ghost
    : (rides[0]?.points || []).map((p) => [p.lat, p.lng]);

  const startAr = async () => {
    if (ar) {
      setAr(false);
      const s = videoRef.current?.srcObject;
      s?.getTracks?.().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      setAr(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setAr(false);
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {ar && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          playsInline
          muted
        />
      )}
      <div className={`absolute inset-0 ${ar ? 'opacity-70 mix-blend-screen' : ''}`}>
        <NeonMap live={live} ghost={ghostLine} drops={drops.filter((d) => !claimedDrops.includes(d.id))} />
      </div>
      <div className="relative z-10 flex items-start justify-between px-4 pt-12">
        <div>
          <p className="headline text-2xl text-bolt">MAP</p>
          <p className="hud-label">NEON TRACE · GHOST OVERLAY</p>
        </div>
        <button onClick={startAr} className="rounded-full border border-plasma/50 bg-void/70 px-3 py-1 font-mono text-[10px] text-plasma">
          {ar ? 'AR ON' : 'AR GHOST'}
        </button>
      </div>
      <div className="relative z-10 mt-auto p-4">
        <div className="glass rounded-2xl p-3">
          <p className="text-xs text-bone/70">
            Violet dashed = prior ghost polyline. Green = live. Camera is optional and fails soft.
          </p>
        </div>
      </div>
    </div>
  );
}
