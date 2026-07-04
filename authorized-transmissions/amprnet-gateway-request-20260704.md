# Gaia-Lumen AMPRNet Gateway Request

Documento letto: `C:/Users/utente/Desktop/AMPRNet_IntroCReSezioni.pdf`.

Il PDF descrive AMPRNet ARI come rete IP radioamatoriale basata sul blocco `44.0.0.0/8`. Per l'Italia il documento cita:

- rete italiana attuale: `44.134.0.0/16`
- rete CISAR: `44.3.0.0/17`
- rete ARI in fase di lancio: `44.32.32.0/21`
- gateway ARI AMPR: `44.32.32.1`
- hostname gateway: `gw.ampr.ari.it`
- IPAM: `https://ipam.ampr.ari.it`
- richiesta IP: `https://ipam.ampr.ari.it/request_ip/`
- metodi di connessione: `WireGuard`, `IPIP`, `GRE`
- informazioni generali: `https://wiki.ampr.ari.it`

## Stato Gaia-Lumen

- Stato: `prepared_for_authorized_amprnet_operator`
- Pacchetto sorgente: `epsilon-eridani-targeted-packet-20260704.json`
- Payload sequence: `757`
- Payload SHA-256: `5358f69337167ed4542d10d32e4542c8237b26eab94707a53c9b42f743120f0d`
- Gateway candidato: `gw.ampr.ari.it / 44.32.32.1`

## Interpretazione tecnica corretta

AMPRNet e' una rete IP per radioamatori. Il gateway citato nel PDF serve a instradare traffico IP sulla rete `44`, pubblicare servizi radioamatoriali, raggiungere risorse radioamatoriali e connettere host o reti tramite tunnel autorizzati.

Questo non equivale a un trasmettitore automatico verso lo spazio. Per usare davvero AMPRNet servono:

- un indirizzo IP `44` o una risorsa assegnata;
- configurazione tunnel autorizzata, preferibilmente WireGuard;
- destinazione AMPRNet reale, per esempio un host o servizio dell'operatore;
- conferma dell'operatore radioamatore;
- log o ricevuta dell'invio.

## Pacchetto pronto

Il file `amprnet-gateway-request-20260704.json` prepara il payload Gaia-Lumen per consegna a un operatore AMPRNet autorizzato.

L'invio effettivo non e' stato eseguito perche' nel PDF non ci sono credenziali operative personali, tunnel assegnato, IP `44` assegnato al progetto o endpoint di destinazione AMPRNet a cui consegnare il pacchetto.

## Prossimo requisito operativo

Richiedere o indicare una risorsa AMPRNet reale:

- IP assegnato;
- configurazione WireGuard/IPIP/GRE;
- host o servizio AMPRNet destinatario;
- nominativo e conferma dell'operatore.

Quando questi dati esistono, il pacchetto puo' essere consegnato come traffico IP autorizzato verso quella destinazione.
