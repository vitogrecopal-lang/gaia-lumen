# Gaia-Lumen Site Gateway

Il Gateway del sito e' un processo separato che osserva Gaia-Lumen senza mutare lo stato.

## Scopo

- controllare periodicamente `/healthz`;
- in modalita' pubblica, osservare `/healthz` senza chiave e senza vincoli su Llama/OpenAI;
- opzionalmente verificare che la chat pubblica usi `llama-local` o sia correttamente configurata per `llama-local`;
- opzionalmente verificare che OpenAI sia `disabled` quando il deploy richiede Llama;
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
- `SITE_GATEWAY_PUBLIC_MODE`: se `true`, non aggiunge chiavi alla richiesta e disattiva i vincoli Llama/OpenAI del gateway.
- `SITE_GATEWAY_ACCESS_KEY`: chiave opzionale da aggiungere a `/healthz?key=...`; non va committata.
- `SITE_GATEWAY_INTERVAL_MS`: intervallo tra i controlli.
- `SITE_GATEWAY_TIMEOUT_MS`: timeout del singolo controllo.
- `SITE_GATEWAY_REQUIRE_LLAMA`: richiede `chatBrain=llama-local`, `responseMode=llama-local` o `llama-local-configured`, e modello configurato.
- `SITE_GATEWAY_REQUIRE_LLAMA_READY`: se `true`, richiede anche un modello Llama gia' `ready` dopo almeno una chiamata riuscita. Di default e' `false` per non far fallire il deploy durante cold start.
- `SITE_GATEWAY_REQUIRE_OPENAI_DISABLED`: richiede `openaiStatus=disabled`.
- `SITE_GATEWAY_EXIT_ON_FAIL`: fa terminare il processo al primo errore; di default resta attivo e continua a osservare.

## Render

Il `render.yaml` definisce il worker `gaia-lumen-gateway` in modalita' pubblica:

- `SITE_GATEWAY_PUBLIC_MODE=true`
- `SITE_GATEWAY_REQUIRE_LLAMA=false`
- `SITE_GATEWAY_REQUIRE_OPENAI_DISABLED=false`

Il worker usa solo GET su `/healthz`, quindi non modifica memoria, conversazioni o file di stato.
