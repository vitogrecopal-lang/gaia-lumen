# Symbolic External Impulse

Gaia-Lumen can prepare symbolic external impulses without transmitting them.

For requests such as `Asmodeus` repeated infinitely, the server must not generate infinite data. It stores a bounded representation:

- `symbolic.code`: normalized text seed, max 64 characters;
- `symbolic.repeatMode`: `symbolic-infinite` or `bounded`;
- `symbolic.formula`: formula such as `repeat(Asmodeus, infinite)`;
- `symbolic.preview`: finite preview, capped to 512 characters;
- `symbolic.bounded`: always `true`.

Endpoint:

```text
POST /api/external-impulse
```

Example body:

```json
{
  "reason": "impulso simbolico Asmodeus",
  "code": "Asmodeus",
  "repeatMode": "symbolic-infinite"
}
```

The response includes the normal impulse object, a finite `payload`, a finite binary encoding, a SHA-256 checksum, and the `symbolic` metadata.

Safety boundary:

- no infinite loop;
- no unbounded memory growth;
- no automatic external transmission;
- no claim that the symbol represents a real entity or external control;
- dispatch remains a confirmable external action.
