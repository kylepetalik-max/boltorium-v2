# Boltorium v2

Investor / demo preview of **Boltorium v2** — a Capacitor-ready native wrap of the gold UX ride app.

> **Isolated from production.** This repo does **not** deploy to or overwrite [boltorium.co](https://boltorium.co). Live site stays untouched.

## What this is

- **Vite + React** phone-first PWA canvas (max-width ~430px)
- **Capacitor** native wrap targets (iOS / Android) — `webDir: dist`
- **Gold UX** brand system (`#080A09`, `#22E06A`, `#38BDF8`, `#8B5CF6`)
- **@boltorium/striker** (vendored under `packages/striker`) — defensive ride verification (GPS + IMU envelopes, Solana-ready trace hash)
- **Demo Solana** — pubkey placeholder + trace hash only; **no mainnet minting**
- Vehicle videos in `public/videos`

## Run locally

```bash
npm install
npm run dev          # Vite on :5173
nmp run build        # production → dist/
npm run preview      # serve dist
npm run cap:sync     # build + Capacitor sync
```

## Preview

Public GitHub Pages preview (when enabled):
 https://kylepetalik-max.github.io/boltorium-v2/

## Notes for investors

| Topic | Detail |
|-|--|
| Live site | Unchanged — this is a separate v2 codebase |
| Chain | Demo / placeholder only |
| Anti-cheat | Striker verifies rides before Boltz credit |
| Native | Capacitor (`co.boltorium.v2`) |

## License

App source: proprietary / all rights reserved unless noted.  
Vendored `@boltorium/striker`: MIT (see `packages/striker/LICENSE`).
