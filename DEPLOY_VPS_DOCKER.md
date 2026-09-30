# Gaia-Lumen: deploy su VPS/NAS con Docker

Questa strada tiene Gaia-Lumen online anche quando il PC principale e' spento.

## Requisiti

- Server Linux, VPS, NAS o mini-PC sempre acceso.
- Docker e Docker Compose installati.
- Porta pubblica o reverse proxy HTTPS.

## File da caricare

Usa il repository `vitogrecopal-lang/gaia-lumen` sul nuovo server.

## Variabili private

Crea un file `.env` sul server, partendo da `.env.example`:

```text
OPENAI_CHAT_ENABLED=true
OPENAI_API_KEY=<chiave privata OpenAI>
OPENAI_MODEL=gpt-5.4
PUBLIC_ACCESS_USER=gaia
PUBLIC_ACCESS_PASS=<password lunga>
PUBLIC_ACCESS_KEY=<chiave lunga>
```

Non pubblicare `.env`.

## Avvio

Dentro la cartella:

```bash
docker compose up -d --build
```

## Controllo salute

```bash
curl http://127.0.0.1:8767/healthz
```

Deve rispondere:

```json
{"ok":true,"service":"gaia-lumen"}
```

## Apertura

```text
http://IP-DEL-SERVER:8767/?key=<PUBLIC_ACCESS_KEY>
```

Per uso stabile fuori casa e' meglio mettere HTTPS con un dominio o reverse proxy.

## Memoria

`neural_state.json` e' montato come volume.  
Fai backup regolari di:

```text
neural_state.json
backups/
```

## Chat OpenAI e trasferimento da Render

Il container passa la chiave OpenAI al backend, mai al browser. Il modello
rimane quello gia' usato dal progetto; deve essere disponibile nel progetto API.
In assenza di chiave la chat usa il fallback locale dichiarato.
La verifica `/healthz` deve mostrare `openaiBridge.status=configured` prima
della prima richiesta. Dopo una risposta OpenAI riuscita deve mostrare `ready`
e `chatBrain=openai`. Un errore API o di fatturazione non e' una connessione riuscita.

Prima del trasferimento copia lo stato piu' recente e i backup dal vecchio
hosting nei due percorsi montati. Il file incluso nel repository e' solo uno
snapshot: non prova di contenere le conversazioni recenti. Usa una sola istanza
con questi volumi, per evitare scritture concorrenti su file.

Il deployment Docker richiede un processo Node sempre acceso e disco persistente.
Non pubblicare questo Compose come funzione serverless Vercel: la memoria su
file e i cicli automatici richiedono prima un adattamento a storage e job esterni.

La pubblicazione e la prova reale con OpenAI restano da completare sul nuovo
hosting con una chiave API privata valida. Non inserire la chiave nel repository.
