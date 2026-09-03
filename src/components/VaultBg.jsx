import { asset } from '../lib/asset.js';

/**
 * Dark gold vault atmosphere. Optional mock PNG is heavily faded/blurred
 * so baked fake UI never doubles real chrome.
 */
export default function VaultBg({ src, opacity = 0.12, blur = 14 }) {
  return (
    <>
      <div className="vault-bg pointer-events-none absolute inset-0" />
      {src ? (
        <img
          src={src.startsWith('http') || src.startsWith('/') || src.startsWith('.') ? src : asset(src)}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ opacity, filter: `blur(${blur}px) saturate(0.7) brightness(0.7)` }}
        />
      ) : null}
      <div className="vault-grid pointer-events-none absolute inset-0" />
      <div className="vault-vignette pointer-events-none absolute inset-0" />
      <div className="vault-gold-haze pointer-events-none absolute inset-0" />
    </>
  );
}
