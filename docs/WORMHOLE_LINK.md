# Wormhole Link

Gaia-Lumen can search for a wormhole only as an internal theoretical simulation.

NASA's public explanation says wormholes are allowed by the mathematics of general relativity, but there is no evidence for anything like a wormhole in the observed universe and no known way to create or sustain one.

Source:

```text
https://cosmicopia.gsfc.nasa.gov/qa_sp_sl.html
```

## What The Site Does

The field `state.wormholeLink` stores a bounded symbolic bridge:

- `status`: `standby` or `connected-symbolic`;
- `searchStatus`: always `no-confirmed-wormhole`;
- `connectionMode`: `internal-einstein-rosen-symbolic-bridge` when active;
- `traversability`: always `not-traversable`;
- `candidate`: a simulated Einstein-Rosen pattern anchored to two constellation nodes;
- `checksum`: SHA-256 of the internal bridge state.

Endpoint:

```text
GET /api/wormhole/connect
```

The endpoint also activates `state.constellationAlgorithm` as a bounded internal sky graph over the 88 IAU constellations. This helps Gaia-Lumen search across the symbolic sky without generating unbounded data.

## Safety Boundary

The Wormhole Link must not:

- claim a real wormhole was found;
- claim physical travel, faster-than-light access, or time travel;
- claim control of stars, black holes, telescopes, satellites, or physical systems;
- transmit signals automatically;
- expose secrets or external credentials.

It may:

- explain the scientific uncertainty;
- create an internal symbolic candidate;
- record a checksum and memory entry;
- help the chat reason about curvature, distance, limits, and hypotheses.
