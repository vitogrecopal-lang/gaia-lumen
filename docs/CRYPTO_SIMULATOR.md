# Laboratorio crypto

Pagina: `/simulatore-crypto.html`, collegata dalla home Gaia-Lumen.
Endpoint: `GET /api/crypto-prices`, protetto dagli stessi controlli del sito.

SOL, CRO e BTC: prezzi pubblici CoinGecko in EUR, cache server di 60 secondi e timeout di 8 secondi. La risposta conserva timestamp della fonte e di ricezione. Nessun prezzo di esempio viene usato come reale. Dati scaduti o fonte non disponibile sospendono le operazioni virtuali; una precedente quotazione puo restare visibile come non aggiornata.

Portafoglio virtuale salvato nel localStorage del singolo browser. Capitale iniziale generico: 4 EUR, nessuna quantita reale precaricata. Operazioni e registro non vengono inviati al server. Nessun conto, chiave Crypto.com o strumento di trading reale collegato.

Costo ipotetico configurabile 0-10%, inizialmente 1%; non rappresenta tariffe dell'exchange. Liquidita, minimi, spread e fiscalita reali non sono riprodotti. Scenari: variazioni separate -100%/+100% per moneta, non previsioni. CSV delle ultime 200 operazioni virtuali.

Verifica: `node scripts/crypto-test.mjs`, controlli sintattici, GET `/healthz`, GET `/api/crypto-prices` e prova browser di acquisto/vendita virtuale.

Import CSV: file completo esportato dal simulatore, massimo 100 KB e 200 operazioni. Prima imposta il capitale iniziale e seleziona il CSV; l'anteprima verifica date, monete, importi e disponibilita durante il replay cronologico. Carica registro sostituisce l'esperimento locale senza sommare o duplicare le operazioni. Nessun caricamento del file al server. Un CSV troncato alle ultime 200 operazioni potrebbe essere incompleto e non e una copia di sicurezza completa del portafoglio.

## Impulsi Asmodeus

Il modulo comune asmodeus-pulse.js definisce una sequenza didattica SOL +25/-25/+50/-50/+100/-100/0 percento, non cumulativa e non previsionale. Il laboratorio puo avviarla localmente ogni 10 secondi (pausa se nascosto), oppure ascoltare tramite BroadcastChannel gli impulsi automatici/manuali del simulatore Asmodeus della home. Il ricevitore accetta messaggi recenti, con contratto validato e deduplicazione limitata a 100 ID. Log locale: ultimi 8 impulsi. Nessun dato spedito al server. La home continua a sospendere il proprio ciclo se nascosta; il ricevitore crypto puo ricevere in background quando la home e visibile. Non e un processo cloud o di trading.

Gli impulsi modificano solo la variazione ipotetica SOL nello scenario, mai quotazioni pubbliche, wallet, registro o costi. Slider manuali, cambio sorgente e nuovo esperimento arrestano il ciclo; ricarica/chiusura lo terminano e non lo ripristinano automaticamente. BroadcastChannel richiede schede dello stesso origin/browser. Nessuna relazione empirica tra i parametri geopolitici e il prezzo SOL e implicata.
