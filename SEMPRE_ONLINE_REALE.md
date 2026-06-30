# Gaia-Lumen sempre online

Per funzionare quando il PC e' spento, Gaia-Lumen deve girare su un computer esterno sempre acceso: VPS, server cloud, oppure piattaforma con disco persistente.

## Stato del pacchetto

Il sito e' pronto per deploy Node/Docker.

Variabili richieste:

```text
HOST=0.0.0.0
PORT=8767
OPENAI_CHAT_ENABLED=false
PUBLIC_ACCESS_USER=gaia
PUBLIC_ACCESS_PASS=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
PUBLIC_ACCESS_KEY=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
STATE_PATH=/data/neural_state.json
BACKUPS_DIR=/data/backups
```

## Opzione consigliata: VPS + Docker

Questa e' la soluzione piu' stabile: il servizio resta attivo anche se il PC locale e' spento.

1. Copia il pacchetto sul VPS.
2. Entra nella cartella `neural-earth-site`.
3. Crea `.env`:

```text
PUBLIC_ACCESS_PASS=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
PUBLIC_ACCESS_KEY=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
```

4. Avvia:

```bash
docker compose up -d --build
```

5. Il sito sara' raggiungibile su:

```text
http://IP_DEL_SERVER:8767/?key=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
```

## Opzione Render

Il file `render.yaml` include un disco persistente montato su `/var/data`.

Imposta queste variabili segrete su Render:

```text
PUBLIC_ACCESS_PASS
PUBLIC_ACCESS_KEY
```

Valori:

```text
PUBLIC_ACCESS_PASS=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
PUBLIC_ACCESS_KEY=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
```

Nota: se il disco persistente parte vuoto, caricare `neural_state.json` iniziale sul volume o usare VPS/Docker per mantenere esattamente la memoria locale attuale.

## Limite tecnico

Un tunnel Cloudflare gratuito dipende dal PC locale. Se il PC si spegne, il tunnel resta inutile perche' non ha piu' un server a cui collegarsi. Per questo la soluzione reale a PC spento e' cloud/VPS.
