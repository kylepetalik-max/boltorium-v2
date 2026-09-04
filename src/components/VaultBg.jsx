import { asset } from '../lib/asset.js';

/**
 * Plasma / neon atmosphere (cyan→violet + bolt). Gold vault haze removed.
 */
export default function VaultBg({ src, opacity = 0.14, blur = 14 }) {
  return (
    <>
      <div className="vault-bg pointer-events-none absolute inset-0" />
      {src ? (
        <img
          src={src.startsWith('http') || src.startsWith('/') || src.startsWith('.') ? src : asset(src)}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ opacity, filter: `blur(${blur}px) saturate(0.85) brightness(0.65)` }}
        />
      ) : null}
      <div className="vault-grid pointer-events-none absolute inset-0" />
      <div className="vault-hex pointer-events-none absolute inset-0" />
      <div className="vault-vignette pointer-events-none absolute inset-0" />
      <div className="vault-plasma-haze pointer-events-none absolute inset-0" />
    </>
  );
}
