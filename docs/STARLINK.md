# Sezione Starlink

La homepage espone una rassegna pubblica su Starlink, Starshield e difesa. GET /api/starlink-news legge un feed Google News RSS con finestra di 30 giorni. Non e' un flusso ufficiale o esaustivo di decisioni militari. I link diretti a Starlink e Starshield sono separati dalla rassegna giornalistica.

Aggiornamento al caricamento, al ritorno online e ogni 15 minuti mentre la pagina e' visibile; nessuna esecuzione pianificata in background. Cache in memoria per istanza di 15 minuti, richieste concorrenti condivise, timeout di 8 secondi, nuovo tentativo dopo un minuto in caso di errore. I dati precedenti sono marcati obsoleti e conservano l'orario dell'ultima lettura riuscita. Nessuna notizia viene inventata come fallback.

Nessuna credenziale aggiuntiva o modifica dello stato persistente. Nessuna telemetria, controllo satellitare o azione militare. Le notizie esterne sono renderizzate come testo; link solo HTTPS a Google News. La cache PWA e' aggiornata e non conserva le risposte API.
