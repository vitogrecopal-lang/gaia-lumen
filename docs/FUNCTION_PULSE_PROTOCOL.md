# Function Pulse Protocol

Gaia-Lumen maintains constant internal pulses for the main site functions. This is an operational heartbeat: it measures module status, computes a checksum, and keeps a bounded archive.

It does not transmit real signals, call sensitive external systems, control devices, or grow memory without limit.

## State

The protocol lives in:

- `state.functionPulseProtocol`
- `state.functionPulseArchive`

`state.functionPulseProtocol` stores mode, interval, function count, latest pulse metadata, and the safety boundary.

`state.functionPulseArchive` stores a compact recent history. It is capped at 24 pulses.

## Covered Functions

The pulse catalog covers the main operational functions:

- chat, OpenAI bridge, Llama local, local cortex
- security, hemispheric bridge, memory, proposals
- external impulse outbox and symbolic impulses
- world data, NOAA/Sole, public sources
- World Compute, constellations, wormhole
- cosmogenesis, Aster Gaia, life cycle, gateway

Each pulse records one item per function with:

- `key`
- `label`
- `scope`
- `status`
- `signal`

The whole pulse receives a SHA-256 checksum.

## API

Manual pulse:

```text
GET /api/function-pulses
```

The route returns the full state after recording a forced internal pulse.

Health:

```text
GET /healthz
```

Relevant health fields:

- `functionPulseProtocol`
- `functionPulseLastPulseAt`
- `functionPulseTotalCount`
- `functionPulseLastChecksum`

## Timing

Default interval:

```text
FUNCTION_PULSE_INTERVAL_MS=60000
```

The value is bounded between 15 seconds and 15 minutes.

The server checks every 15 seconds and records a new pulse only when the configured interval has elapsed. A boot pulse is recorded at startup so deploys expose an immediate heartbeat.

## Safety Boundary

Function pulses are internal diagnostics. They may synchronize local state and compute checksums. They must not:

- send radio/WLAN/space signals;
- scan ports or computers;
- access private systems;
- mutate external services;
- claim consciousness or physical control.

Any real external action remains a proposal/confirmation workflow.
