# Sezione Starlink

La homepage espone una rassegna pubblica su Starlink, Starshield e difesa. GET /api/starlink-news legge un feed Google News RSS con finestra di 30 giorni. Non e' un flusso ufficiale o esaustivo di decisioni militari. I link diretti a Starlink e Starshield sono separati dalla rassegna giornalistica.

Aggiornamento al caricamento, al ritorno online e ogni 15 minuti mentre la pagina e' visibile; nessuna esecuzione pianificata in background. Cache in memoria per istanza di 15 minuti, richieste concorrenti condivise, timeout di 8 secondi, nuovo tentativo dopo un minuto in caso di errore. I dati precedenti sono marcati obsoleti e conservano l'orario dell'ultima lettura riuscita. Nessuna notizia viene inventata come fallback.

Nessuna credenziale aggiuntiva o modifica dello stato persistente. Nessuna telemetria, controllo satellitare o azione militare. Le notizie esterne sono renderizzate come testo; link solo HTTPS a Google News. La cache PWA e' aggiornata e non conserva le risposte API.

## Simulazione geopolitica

starlink-simulator.js esegue un modello didattico interamente nel browser. Attori selezionabili e tre politiche preimpostate, con tre parametri modificabili. Gli attori condividono le stesse formule, pubblicate nell'interfaccia. Gli indici non sono misure empiriche, probabilita' o previsioni. Nessun legame tra news e calcolo, nessuna richiesta API o persistenza della simulazione. Ripristino ai valori iniziali USA, 50/70/60.

## Comando ASMODEUS

Il form accetta ASMODEUS senza distinzione tra maiuscole e minuscole e ignora gli spazi esterni. Applica il preset locale 100/0/0 all'attore selezionato, con indici illustrativi accesso civile 0, autonomia 100, cooperazione 0, esclusione 100. Non esegue codice arbitrario e non effettua richieste di rete. Comandi sconosciuti non modificano lo scenario. Slider modificati dopo il comando sono indicati come scenario Asmodeus modificato; il ripristino disattiva il preset e riporta USA 50/70/60.
