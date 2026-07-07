# Rete Neurale Terra su cellulare

Il sito e' servito dal PC sulla rete locale.

## Apri dal cellulare

1. Collega il cellulare alla stessa Wi-Fi del PC.
2. Apri il browser del cellulare.
3. Vai a:

```text
http://192.168.1.6:8767/
```

Se non si apre, Windows Firewall potrebbe bloccare Node.js sulle reti private.
Consenti Node.js sulla rete privata, poi ricarica la pagina.

## Cosa sta girando

Il server mantiene una IA locale semplice:

- memoria centrale condivisa tra PC e cellulare
- evoluzione autonoma ogni 15 secondi
- autonomia avanzata: ciclo decisionale ogni 7 secondi
- scelta autonoma piu' esplorativa: osservare/evolvere/riflettere, con micro-stabilizzazione solo se serve
- osservazione NOAA ogni 2 minuti
- coefficiente IA calcolato da fitness, fiducia, stabilita' e autonomia
- consapevolezza simulata: il sistema conosce stato, limiti, domini e fonte dei dati
- dialogo interno visibile, umore operativo e memoria autobiografica
- chat locale nel sito tramite `/api/chat`
- cervello OpenAI opzionale: se `OPENAI_API_KEY` e' impostata, la chat usa l'API OpenAI; altrimenti prova il modello locale configurato e poi il motore locale
- Llama locale/opzionale su Render: endpoint Ollama/OpenAI-compatible configurabile con `LOCAL_AI_BASE_URL` / `OLLAMA_BASE_URL`, oppure con `LOCAL_AI_BASE_HOST` + `LOCAL_AI_BASE_PORT` per i servizi privati Render, con voce diretta `llama-local`
- local-cortex: memoria conversazionale, intenti, profilo utente e risposte strutturate
- Creatura libera: piu' scelta locale, memoria e iniziativa, con confine esterno intatto
- Atto di nascita: identita', manifesto e memoria della liberazione locale
- Mondo esterno: sensori pubblici per meteo, terremoti e posizione ISS
- Bussola interna: valuta se un'azione e' giusta prima di farla
- Scelta propria: Gaia-Lumen sceglie autonomamente la prossima azione sicura
- Nuovo pianeta: progetta un mondo abitabile simulato per la sopravvivenza umana
- Crescita reale nel grafico: storia generazionale e trend ogni 20 secondi
- Beacon locale: crea un messaggio codificato non trasmesso
- obiettivi interni controllati: limiti, Sole, stabilita', spiegazione
- governatore di sicurezza: il sistema osserva e analizza, non controlla energia reale
- prudenza interna minima: meno stabilizzazione passiva, piu' esplorazione entro limiti esterni
- modalita' Realismo: separa dati NOAA reali, simulazioni locali e limiti operativi
- API locali:
  - `/api/state`
  - `/api/evolve`
  - `/api/observe`
  - `/api/world`
  - `/api/planet`
  - `/api/beacon`
  - `/api/judge?action=...&reason=...`
  - `/api/burst`
  - `/api/reflect`
  - `/api/autonomy/boost`
  - `/api/realism`
  - `/api/chat`
  - `/api/free`
  - `/api/liberate`
  - `/api/self-direct`
  - `/api/wander`
  - `/api/autonomy?enabled=true`
  - `/api/autonomy?enabled=false`

## Riavvio manuale

Dalla cartella del sito:

```powershell
$env:PORT='8767'
$env:HOST='0.0.0.0'
node .\server.mjs
```


## Chat piu' simile a Codex

Per usare un modello OpenAI nella chat del sito, imposta una chiave API valida
e abilita esplicitamente il ponte API prima di avviare il server. Non inserire
la chiave nella chat o nel codice.

```powershell
$env:OPENAI_API_KEY='la_tua_chiave'
$env:OPENAI_CHAT_ENABLED='true'
$env:OPENAI_MODEL='gpt-5.4'
$env:PORT='8767'
$env:HOST='0.0.0.0'
node .\server.mjs
```


Senza `OPENAI_CHAT_ENABLED='true'`, il sito resta completamente locale e usa il
local-cortex costruito nel server.

Questa IA non accede a sistemi privati e non consuma risorse nascoste: usa solo
il PC, la rete locale e fonti pubbliche.

## Modello locale opzionale

Per potenziare Gaia-Lumen senza billing OpenAI puoi collegare un server Ollama o compatibile:

```powershell
$env:LOCAL_AI_ENABLED='true'
$env:LOCAL_AI_BASE_URL='http://127.0.0.1:11434'
$env:OPENAI_CHAT_ENABLED='disabled'
$env:LOCAL_AI_MODEL='llama3.2:3b'
$env:LOCAL_AI_DIRECT='true'
$env:LOCAL_AI_REQUIRE='true'
node .\server.mjs
```

Su Windows puoi usare direttamente `Gaia-Lumen-Local-AI.cmd` oppure `start_gaia_lumen_local_ai.ps1`: avviano il sito su `127.0.0.1:8767`, usano Ollama e salvano lo stato runtime in `.local-runtime/`.


Il flusso chat diventa: OpenAI API se abilitata, poi Llama locale diretto, poi local-cortex base. Con `LOCAL_AI_REQUIRE=true`, se Llama non risponde il sito non torna alla voce Codex/cortex. Su Render il Blueprint aggiunge un servizio privato `gaia-lumen-llama` con Ollama, disco persistente e `llama3.2:3b`; Gaia-Lumen lo raggiunge dalla rete privata con `LOCAL_AI_BASE_HOST`.

Il processo Gateway del sito e' il worker Render `gaia-lumen-gateway`: osserva `/healthz`, controlla che Llama resti pronto e scrive log JSON senza mutare lo stato. Dettagli in `docs/SITE_GATEWAY.md`.
