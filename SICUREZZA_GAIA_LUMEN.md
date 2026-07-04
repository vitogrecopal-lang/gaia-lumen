# Sicurezza Gaia-Lumen

Obiettivo: ridurre il rischio di accessi non autorizzati a PC, sito e telefono. Nessuna protezione puo' promettere sicurezza assoluta; la difesa funziona a strati.

## Sito

- Tenere `PUBLIC_ACCESS_USER`, `PUBLIC_ACCESS_PASS`, `PUBLIC_ACCESS_KEY` solo nei segreti di Render.
- Usare password e chiave diverse tra loro, lunghe almeno 32 caratteri.
- Non pubblicare screenshot dove compaiono chiavi, URL con `?key=...`, token o dashboard.
- Controllare `/healthz` dopo ogni deploy: deve mostrare `securityProfile`.
- Se compaiono molti `429`, non abbassare subito le protezioni: prima cambia password/chiave e controlla gli accessi.
- Dopo una condivisione pubblica del link, ruotare `PUBLIC_ACCESS_KEY`.

## Render

- Abilitare 2FA sull'account.
- Collegare solo il repository necessario.
- Non salvare `OPENAI_API_KEY` nel codice: deve stare solo in Environment Variables.
- Ruotare `OPENAI_API_KEY` se e' stata mostrata in chat, screenshot o email.
- Lasciare attivi i limiti:
  - `AUTH_MAX_FAILURES=8`
  - `AUTH_WINDOW_MS=1800000`
  - `RATE_MAX_REQUESTS=30`
  - `API_RATE_MAX_REQUESTS=18`
  - `MAX_BODY_BYTES=16384`

## PC Windows

- Aggiornare Windows e browser.
- Attivare Windows Security: protezione in tempo reale, firewall, reputazione app e browser.
- Usare account Windows con password forte e PIN.
- Attivare BitLocker o crittografia dispositivo se disponibile.
- Non aprire allegati eseguibili o archivi sospetti.
- Non lasciare tunnel temporanei attivi se non servono.
- Chiudere i processi locali non necessari dopo i test.

## Telefono

- Aggiornare sistema operativo e Chrome.
- Usare blocco schermo forte e biometria.
- Non installare APK esterni non verificati.
- Tenere disattivato hotspot quando non serve.
- Revocare permessi non necessari alle app.
- Non condividere link con chiave su chat pubbliche.

## Procedura di emergenza

1. Cambiare subito `PUBLIC_ACCESS_PASS` e `PUBLIC_ACCESS_KEY` su Render.
2. Ruotare `OPENAI_API_KEY` dalla dashboard OpenAI.
3. Fare redeploy.
4. Chiudere tunnel locali e riavviare il PC.
5. Controllare `/healthz` e verificare che il sito risponda solo con chiave/password nuove.
