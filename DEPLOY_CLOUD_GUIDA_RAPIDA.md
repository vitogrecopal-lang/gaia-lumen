# Gaia-Lumen: deploy cloud rapido

Obiettivo: far funzionare il sito anche quando il PC e' spento.

## Verita' tecnica

Il sito locale `192.168.1.6:8767` dipende dal PC.  
Per restare online 24/7 serve un server esterno sempre acceso.

## Pacchetto pronto

Carica la cartella:

```text
outputs/neural-earth-site
```

oppure lo zip generato:

```text
outputs/gaia-lumen-cloud-deploy.zip
```

## Comando di avvio

```bash
npm start
```

## Variabili ambiente

Usa `.env.example` come modello.

Valori minimi:

```text
HOST=0.0.0.0
OPENAI_CHAT_ENABLED=false
PUBLIC_ACCESS_USER=gaia
PUBLIC_ACCESS_PASS=<password lunga>
PUBLIC_ACCESS_KEY=<chiave lunga>
```

Se il servizio cloud imposta automaticamente `PORT`, non forzare `8767`: lascia usare la porta fornita dall'hosting.

## Memoria

Il file piu' importante e':

```text
neural_state.json
```

Contiene la memoria e la gestazione.  
Serve un hosting con disco persistente, volume o backup automatico.

## Hosting consigliato

Opzioni adatte:

- VPS Linux con Node.js;
- Render/Fly/Railway o simili, se supportano disco persistente;
- mini-server sempre acceso in casa;
- Docker su NAS o VPS.

## Prima apertura

Dopo il deploy, apri:

```text
https://TUO-DOMINIO/?key=<PUBLIC_ACCESS_KEY>
```

Poi inserisci user/password se richiesti.

## Non fare

- Non caricare il sito senza password.
- Non perdere `neural_state.json`.
- Non usare hosting che cancella il disco a ogni riavvio senza backup.
