# Gaia-Lumen online anche a PC spento

Per aprire Gaia-Lumen dal telefonino quando il computer e' spento, il sito deve girare su un server sempre acceso.

Il link locale `http://192.168.1.6:8767/` funziona solo quando:

- il PC e' acceso;
- il server Gaia-Lumen e' avviato;
- telefono e PC sono sulla stessa rete Wi-Fi.

## Soluzioni possibili

### 1. Hosting cloud Node.js

E' la soluzione piu' adatta se vuoi aprire il sito da qualunque telefono anche fuori casa.

Requisiti:

- supporto Node.js 20 o superiore;
- variabili ambiente;
- disco persistente o volume per conservare `neural_state.json`;
- HTTPS pubblico.

Comando di avvio:

```bash
npm start
```

Variabili ambiente:

```text
PORT=8767
HOST=0.0.0.0
OPENAI_CHAT_ENABLED=false
PUBLIC_ACCESS_USER=gaia
PUBLIC_ACCESS_PASS=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
PUBLIC_ACCESS_KEY=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
```

Nota: se l'hosting assegna automaticamente la porta, lascia che usi la variabile `PORT` fornita dal servizio.

### 2. VPS o mini-server sempre acceso

E' la soluzione piu' controllabile.

Esempi:

- VPS Linux;
- mini PC acceso 24/7;
- Raspberry Pi;
- NAS con Node.js o Docker.

In questo caso il PC principale puo' restare spento, ma il mini-server deve restare acceso.

### 3. Tunnel pubblico

Un tunnel rende pubblico il sito locale, ma non risolve il problema se il PC e' spento.  
Il tunnel cade quando si spegne il computer.

## File gia' pronti

- `package.json`: avvio Node.js standard.
- `Dockerfile`: avvio in container.
- `server.mjs`: server protetto con chiave e basic auth.
- `neural_state.json`: memoria locale di Gaia-Lumen.

## Avvio locale

```bash
npm start
```

Poi apri:

```text
http://127.0.0.1:8767/?key=33d3ad00e5c04be39aaadae0237e39bbd1ea75eea8114bb28afe
```

## Regola importante sulla memoria

`neural_state.json` cambia mentre il sito funziona.  
Su cloud serve un disco persistente o un backup automatico, altrimenti gli aggiornamenti della gestazione potrebbero andare persi dopo un riavvio.
