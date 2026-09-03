import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import BMark from '../components/BMark.jsx';

const SLIDES = [
  {
    k: '01',
    t: 'TRACK',
    d: 'GPS-verified rides. Real coords.speed on the HUD — UNCERTAIN if the OS has no fix.',
  },
  {
    k: '02',
    t: 'STRIKER',
    d: 'End ride runs verifyRide. Only PASS is eligible for Boltz. REVIEW is held. FAIL earns nothing.',
  },
  {
    k: '03',
    t: 'SAFETY',
    d: 'Helmet on. Phone stowed while moving. 16+. You assume the risk. The gate will not open otherwise.',
  },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const { onboard } = useStore();
  const nav = useNavigate();
  const s = SLIDES[i];

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-10 pt-16">
      <BMark className="mb-8 h-14 w-14" />
      <p className="hud-label text-plasma">{s.k} / 03</p>
      <h1 className="headline mt-2 text-5xl text-bolt">{s.t}</h1>
      <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-bone/75">{s.d}</p>
      <div className="mt-auto space-y-3">
        <div className="flex gap-2">
          {SLIDES.map((_, n) => (
            <span key={n} className={`h-1 flex-1 rounded ${n <= i ? 'bg-bolt' : 'bg-bone/15'}`} />
          ))}
        </div>
        <button
          className="btn-bolt"
          onClick={() => {
            if (i < SLIDES.length - 1) setI(i + 1);
            else {
              onboard();
              nav('/home', { replace: true });
            }
          }}
        >
          {i < SLIDES.length - 1 ? 'NEXT' : 'ENTER THE GRID'}
        </button>
      </div>
    </div>
  );
}
