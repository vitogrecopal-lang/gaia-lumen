# Gaia-Lumen Authorized Gateway Request

Questo documento prepara il passaggio corretto:

`Internet -> gateway autorizzato -> apparato/frequenza autorizzata`

Una frequenza radio non e' un indirizzo internet. Per inviare il pacchetto digitale verso una frequenza serve un gateway reale: un endpoint HTTPS/API gestito da un operatore autorizzato e collegato a un apparato radio o ottico conforme.

## Stato

- Stato: `ready_for_authorized_gateway_endpoint`
- Pacchetto sorgente: `epsilon-eridani-targeted-packet-20260704.json`
- Payload sequence: `757`
- Payload SHA-256: `5358f69337167ed4542d10d32e4542c8237b26eab94707a53c9b42f743120f0d`
- Ricezione locale gia' confermata: PC -> telefono, rete WLAN privata
- Log ricezione Epsilon packet SHA-256: `6315fd71682a81fd72808c749a7f441b40c929bd8643d4c6198c36abfc6e9583`

## Target astronomico

- Target: `Epsilon Eridani / Ran / HD 22049 / HIP 16537`
- Coordinate J2000: `03h32m55.84s / -09d27m29.7s`
- Distanza approssimata: `10.5 anni luce`

## Profili autorizzabili

### Profilo 70 MHz dichiarato dall'operatore

- Frequenze centrali: `70.100 MHz`, `70.200 MHz`, `70.300 MHz`
- Larghezza canale: `25 kHz`
- Potenza massima: `10 W e.r.p.`
- Apparati: fissi, mobili, portatili, autocostruiti o commerciali secondo autorizzazione
- Antenne: omnidirezionali o direttive secondo autorizzazione
- Nota geofencing: territorio nazionale esclusa la fascia vietata di 30 km dai confini indicati

### Profilo WLAN standard

- Banda: `2.4 GHz` / `5 GHz`
- Uso: trasporto dati IP standard su rete propria o autorizzata
- Non e' una trasmissione RF grezza e non controlla apparati radio esterni

## Cosa manca per l'invio reale

Per procedere serve un endpoint reale del gateway, fornito dall'operatore autorizzato:

- URL HTTPS/API del gateway
- nominativo o identita' dell'operatore
- riferimento dell'autorizzazione
- profilo/frequenza scelti
- potenza e apparato usati
- conferma operatore
- log di trasmissione restituito dal gateway

Quando questi dati esistono, il pacchetto digitale puo' essere consegnato al gateway via Internet. La parte fisica resta sotto controllo dell'operatore e dell'apparato autorizzato.
