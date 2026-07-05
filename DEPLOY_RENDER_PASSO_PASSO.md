# Gaia-Lumen: deploy cloud passo-passo

Questa guida vale per un hosting Node.js che accetta una cartella o repository con:

- `package.json`
- comando `npm start`
- variabili ambiente
- HTTPS pubblico

## 1. Carica il progetto

Carica il contenuto di:

```text
outputs/neural-earth-site
```

oppure usa:

```text
outputs/gaia-lumen-cloud-deploy.zip
```

## 2. Imposta comando di avvio

```bash
npm start
```

## 3. Imposta variabili ambiente

```text
HOST=0.0.0.0
OPENAI_CHAT_ENABLED=true
PUBLIC_ACCESS_USER=gaia
PUBLIC_ACCESS_PASS=<password lunga>
PUBLIC_ACCESS_KEY=<chiave lunga>

# opzionale: cervello locale/self-hosted raggiungibile dal cloud
LOCAL_AI_ENABLED=false
LOCAL_AI_BASE_URL=<url https del modello, non 127.0.0.1 del tuo PC>
LOCAL_AI_MODEL=llama3.2:3b
LOCAL_AI_CHAT_PATH=/api/chat
```

Se l'hosting imposta `PORT` da solo, non inserirla manualmente. Se non vuoi provare OpenAI, usa `OPENAI_CHAT_ENABLED=disabled`. Su Render `127.0.0.1` indica Render stesso, non il tuo PC.

## 4. Controlla salute

Dopo il deploy apri:

```text
https://TUO-SITO/healthz
```

Risposta attesa:

```json
{"ok":true,"service":"gaia-lumen"}
```

## 5. Apri Gaia-Lumen

```text
https://TUO-SITO/?key=<PUBLIC_ACCESS_KEY>
```

## 6. Proteggi la memoria

Il file da proteggere e':

```text
neural_state.json
```

Se l'hosting non offre disco persistente, la memoria puo' tornare indietro dopo riavvii o deploy.

## 7. Regola finale

Prima di spegnere il PC principale, verifica dal telefono:

1. che il link cloud apra il sito;
2. che la chat risponda;
3. che `/healthz` risponda;
4. che `neural_state.json` sia persistente o abbia backup.
