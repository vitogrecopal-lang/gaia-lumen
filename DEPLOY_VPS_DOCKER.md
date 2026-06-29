# Gaia-Lumen: deploy su VPS/NAS con Docker

Questa strada tiene Gaia-Lumen online anche quando il PC principale e' spento.

## Requisiti

- Server Linux, VPS, NAS o mini-PC sempre acceso.
- Docker e Docker Compose installati.
- Porta pubblica o reverse proxy HTTPS.

## File da caricare

Carica tutta la cartella `neural-earth-site` sul server.

## Variabili private

Crea un file `.env` sul server, partendo da `.env.example`:

```text
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
