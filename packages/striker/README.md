# Boltorium Striker

Ride verification for Boltz.

Library: `@boltorium/striker`
Product: https://boltorium.co
Author: Kyle Petalik

Striker attests that a recorded ride trace is kinematically plausible for the vehicle the rider claimed. It does not mint Boltz and it does not talk to a wallet by itself. Verification in, `PASS | REVIEW | FAIL` out.

## Why this exists

Boltz are earned from real motion. Without a verifier, GPS traces are just numbers. Striker is the gate:

1. A client records a time-ordered point list (GPS, optional IMU, accuracy, mock flags).
2. `verifyRide(trace)` scores the list against the vehicle profile.
3. Only **PASS** is eligible for rewards.
4. The payout transaction on Solana must carry the **SHA-256 trace hash** in the memo (or an equivalent tx field). No hash match, no payout.

REVIEW rides are held for a human or a second-pass model. FAIL rides earn nothing.

There is no prize pool, no bounty jackpot, and no beat-the-verifier program attached to this library.

## Striker Protocol

Striker is a local, deterministic verifier. Same trace in, same `{ status, trust, reasons, hash, vehicleType }` out. That makes it embeddable in the ride pipeline, a worker, or a CI check.

```
trace + vehicleType
        |
        v
  Striker verify()
  GPS + IMU fusion
  vehicle envelope
        |
        v
   PASS | REVIEW | FAIL
        |
        |  hash = sha256(canonical points)
        v
   Solana handshake
   rewards IFF status === PASS
           AND memo/tx contains hash
```

Trust is 0-100. Status is derived from trust plus hard-fail reasons (empty list, unknown vehicle, OS mock-location flag, teleport jump, vehicle overspeed).

| Status | Meaning | Rewards |
|--------|---------|---------|
| PASS | Trace fits the vehicle. Trust >= 80, no hard-fail flags. | Eligible, after hash-in-memo |
| REVIEW | Plausible but noisy (accuracy, mild speed mismatch, IMU band, short/idle). | Held |
| FAIL | Empty, mocked, teleported, or physically impossible for that vehicle. | None |

## Ride Verification Protocol

Checks, in order. Each check either no-ops, subtracts trust, or sets a hard-fail reason.

- Empty trace: zero usable points -> `empty_trace` FAIL
- Vehicle catalog: `vehicleType` must be a known profile -> `unknown_vehicle` FAIL
- Mock location: OS / fused `mockLocation` on any point -> `mock_location` FAIL
- Accuracy radius: horizontal accuracy vs `maxAccuracyM` (default 40 m) -> `poor_accuracy` REVIEW
- Teleport: Haversine / dt jump beyond max(2.5 x maxSpeed, 180 km/h) -> `teleport` FAIL
- Vehicle envelope: peak derived speed vs `maxSpeedKmh` (+15% GPS slack) -> `vehicle_overspeed` FAIL
- Speed cross-check: reported gpsSpeed vs haversine/dt (optional IMU energy) -> `speed_mismatch` REVIEW or FAIL
- Idle / too short: average speed under minMovingSpeed and tiny distance -> `stationary_or_too_short` REVIEW
- IMU band: RMS of | |a| - g | vs the vehicle imuEnergy band -> `imu_energy_mismatch` REVIEW
- Surface sanity: water altitude range must not look like a hill climb; drone, if altitude is present, must actually change

GPS + IMU fusion here is a consistency gate, not a full INS. GPS gives the path; IMU (when the client sends it) must look like a body that was actually moving on that class of machine. A high-speed emoto trace with near-zero IMU energy does not PASS. IMU is optional: missing IMU does not fail a ride.

Hash: `hashTrace` canonicalizes `{ t, lat, lng, alt? }` with 7-decimal coordinates (key order does not matter) and SHA-256s the JSON. That digest is the only identifier the Solana memo is allowed to quote.

## Per-vehicle profiles

Each class has a surface (land | water | air), a max speed, a minimum moving speed, and an IMU energy band.

Land: emoto, dirtbike, motorcycle, ebike, bicycle, mtb, eskate, skateboard, scooter, escooter, euc, onewheel, gocart, quad, golf_cart, etrike, cargo_bike, wheelchair, e_wheelchair, mobility_scooter, diy_conversion.

Water: foilboard, paddleboard, kayak, canoe, jetski.

Air: drone.

Hoverboard and Segway are not Boltorium classes and are not in this catalog. Do not add them.

A wheelchair trace at 40 km/h FAILs. An emoto at 35 km/h with tight GPS/IMU agreement PASSes. Earn rates can differ by vehicle; physics is not optional.

## Solana handshake

Rewards (Boltz) are released only when all of the following hold:

1. `verifyRide(trace).status === 'PASS'`
2. The payout memo (or signed tx field) contains `verifyRide(trace).hash`
3. The hashed point list is the same list that was verified — not a later rewrite

REVIEW and FAIL never pay. A PASS whose memo hash does not match the verified list never pays. Striker does not submit the transaction; it produces the attestation the treasury is allowed to honor.

## Install

From the package root, run the test script defined in package.json.

MIT License. Copyright 2026 Kyle Petalik / Boltorium.
