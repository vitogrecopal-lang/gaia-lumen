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
OPENAI_CHAT_ENABLED=disabled
PUBLIC_ACCESS_USER=gaia
PUBLIC_ACCESS_PASS=<password lunga>
PUBLIC_ACCESS_KEY=<chiave lunga>

# cervello Llama su Render/private network
LOCAL_AI_ENABLED=true
LOCAL_AI_BASE_HOST=<host interno Render del servizio gaia-lumen-llama>
LOCAL_AI_BASE_PORT=11434
LOCAL_AI_BASE_PROTOCOL=http
LOCAL_AI_MODEL=llama3.2:3b
LOCAL_AI_CHAT_PATH=/api/chat
LOCAL_AI_DIRECT=true
LOCAL_AI_REQUIRE=true
```

Se l'hosting imposta `PORT` da solo, non inserirla manualmente. Su Render `127.0.0.1` indica Render stesso, non il tuo PC.

Il `render.yaml` del repository definisce anche un servizio privato `gaia-lumen-llama` basato su Docker/Ollama. Richiede un piano Render con RAM adeguata; `starter` non basta per caricare Llama.

Lo stesso Blueprint definisce il worker `gaia-lumen-gateway`, un processo osservatore che controlla `/healthz` e registra nei log se Llama non e' pronto.

## 4. Controlla salute

Dopo il deploy apri:

```text
https://TUO-SITO/healthz
```

Risposta attesa:

```json
{"ok":true,"service":"gaia-lumen"}
```

Per confermare Llama, in `/healthz` devono comparire:

```text
chatBrain=llama-local
localModelBridge.requested=true
localModelBridge.status=ready
localModelBridge.model=llama3.2:3b
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

Se l'hosting non offre disco persistente, la memoria puo' tornare indietro dopo riavvii o deploy. Il modello Llama usa un secondo disco persistente montato su `/var/data` nel servizio privato Ollama.

## 7. Regola finale

Prima di spegnere il PC principale, verifica dal telefono:

1. che il link cloud apra il sito;
2. che la chat risponda;
3. che `/healthz` risponda;
4. che `neural_state.json` sia persistente o abbia backup;
5. che `localModelBridge.status` sia `ready` dopo il primo pull del modello.
