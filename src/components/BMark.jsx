import { asset } from '../lib/asset.js';
export default function BMark({ className = 'w-10 h-10', glow = true }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-label="Boltorium B-mark"
      role="img"
    >
      {glow && (
        <defs>
          <filter id="bglow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <path
        filter={glow ? 'url(#bglow)' : undefined}
        fill="#22E06A"
        d="M14 8 L42 8 L50 16 L50 28 L44 32 L50 36 L50 50 L42 58 L14 58 Z M22 16 L22 28 L36 28 L40 24 L40 20 L36 16 Z M22 36 L22 50 L36 50 L41 45 L41 41 L36 36 Z"
      />
      <path
        fill="#080A09"
        d="M31 12 L27 28 L33 28 L29 40 L38 26 L32 26 L36 12 Z"
      />
    </svg>
  );
}

export function GraffitiB({ className = 'h-9' }) {
  return (
    <img
      src={asset('brand/bmark-icon.png')}
      alt="B"
      className={`${className} graffiti-only object-contain`}
    />
  );
}
