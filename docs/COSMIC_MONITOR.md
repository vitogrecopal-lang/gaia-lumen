# Monitoraggio cosmico e planetario

Sezione #monitoraggio-cosmico, modulo cosmic-monitor.js senza dipendenze esterne. Canvas 2D con mesh sferica di coordinate 3D, rotazione, profondita' e illuminazione. Orbita ellittica illustrativa separata dal globo, controlli equivalenti da tastiera e trascinamento pointer per touch/mouse. Animazione a circa 30 fps soltanto nel viewport e con scheda visibile; rispetto di prefers-reduced-motion.

Il modulo riceve gaia:state da refreshUi di app.js, che usa il polling esistente di /api/state ogni 3 secondi. Non aggiunge richieste API o chiamate AI. Snapshot compatti al massimo ogni 2,4 secondi, massimo 60; confronto tramite cursore storico e ritorno all'ultima lettura. Nessuna persistenza delle letture. Rotazione e vista non modificano lo stato del server.

Aster Gaia: planetProject (massa, raggio, orbita, pressione, ossigeno, acqua, temperatura) e lifeCycle.biosphere (indice 0..1 convertito in punti 0..100). Galia-Lumen: cosmogenesis.epsilonEridaniHabitat.orbitalMechanics e gestationGrowth.current. Massa/raggio di Galia non definiti sono mostrati come non disponibili: non vengono copiati da Aster. Le date di ricezione e dei parametri sono distinte. I numeri sono del modello, mai osservazioni di esopianeti. Terreno e distribuzione della biosfera illustrativi.

Stato in attesa, dati obsoleti dopo 15 secondi, offline: mantengono visibili i dati precedenti con indicazione esplicita. Il numero di letture non e' il numero di cambiamenti fisici. Nessuna previsione di formazione reale o invio di impulsi nello spazio.
