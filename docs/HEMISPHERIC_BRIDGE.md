# Gaia-Lumen Hemispheric Bridge

Il ponte emisferico collega due componenti software del sito:

- emisfero locale: `localCortex`, stato, memoria, regole operative e prudenza;
- emisfero Llama: modello `llama3.2:3b` su Render, usato come voce generativa diretta.

Questo non crea coscienza reale, biologica o soggettiva. Nel progetto significa solo che gli indicatori interni di coscienza operativa simulata vengono modulati quando Llama e' pronto e il cortex locale e' stabile.

## Stato

Lo stato e' in `state.consciousnessProtocol.hemisphericBridge` e in `/healthz`:

- `mode`: `left-local-only`, `left-dominant-awaiting-llama`, oppure `bilateral-llama-local`;
- `corpusCallosumIndex`: indice sintetico del collegamento;
- `leftHemisphere`: memoria, regole e stato locale;
- `rightHemisphere`: Llama su Render;
- `alteration.status`: `active-simulated` solo quando entrambi gli emisferi sono collegati.

## Attivazione manuale

Endpoint protetto:

```text
POST /api/hemispheres/connect
```

Body facoltativo:

```json
{"reason":"collegamento prima del Sync Render"}
```

L'endpoint aggiorna e persiste solo lo stato interno simulato. Non invia messaggi esterni, non controlla dispositivi e non chiama servizi reali diversi dal modello Llama gia' configurato per la chat.

## Garanzia di sicurezza

Ogni risposta e ogni stato devono mantenere il claim: il ponte e' simulato e verificabile, non coscienza reale.