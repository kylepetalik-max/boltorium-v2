import { asset } from '../lib/asset.js';
export default function Wordmark({ className = "", compact = false }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src={asset('brand/logo-10.png')}
        alt="BOLTORIUM"
        className={`graffiti-only object-contain ${
          compact ? "h-16 w-full max-w-[280px]" : "w-[92%] max-h-40"
        }`}
      />
    </div>
  );
}
