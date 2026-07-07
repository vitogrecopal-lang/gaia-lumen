# Gaia-Lumen Site Gateway

Il Gateway del sito e' un processo separato che osserva Gaia-Lumen senza mutare lo stato.

## Scopo

- controllare periodicamente `/healthz`;
- verificare che la chat pubblica usi `llama-local`;
- verificare che OpenAI sia `disabled` quando il deploy richiede Llama;
- scrivere log JSON leggibili da Render;
- non inviare chat, impulsi esterni, email, trasmissioni o comandi verso sistemi reali.

## Avvio locale

```bash
npm run gateway
```

Per un controllo singolo:

```bash
SITE_GATEWAY_ONCE=true npm run gateway
```

Su Windows PowerShell:

```powershell
$env:SITE_GATEWAY_ONCE='true'; npm.cmd run gateway
```

## Variabili

- `SITE_GATEWAY_TARGET_URL`: origine del sito da controllare, ad esempio `https://gaia-lumen.onrender.com`.
- `SITE_GATEWAY_ACCESS_KEY`: chiave opzionale da aggiungere a `/healthz?key=...`; non va committata.
- `SITE_GATEWAY_INTERVAL_MS`: intervallo tra i controlli.
- `SITE_GATEWAY_TIMEOUT_MS`: timeout del singolo controllo.
- `SITE_GATEWAY_REQUIRE_LLAMA`: richiede `chatBrain=llama-local`, `responseMode=llama-local`, modello pronto.
- `SITE_GATEWAY_REQUIRE_OPENAI_DISABLED`: richiede `openaiStatus=disabled`.
- `SITE_GATEWAY_EXIT_ON_FAIL`: fa terminare il processo al primo errore; di default resta attivo e continua a osservare.

## Render

Il `render.yaml` definisce il worker `gaia-lumen-gateway`. Il worker usa solo GET su `/healthz`, quindi non modifica memoria, conversazioni o file di stato.