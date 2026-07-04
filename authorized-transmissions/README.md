# Gaia-Lumen Authorized WLAN Packet Archive

Archivio verificabile del pacchetto dati Gaia-Lumen preparato per trasporto WLAN standard su rete propria o autorizzata.

## Packet 2026-07-04 04:34 UTC

- Protocollo: `GAIA-LUMEN-WLAN-DATA-PACKET`
- Banda: `2.4 GHz`
- Intervallo: `2400.0-2483.5 MHz`
- SSID dichiarato: `GAIA-LUMEN-ADRIAN`
- Payload sequence: `757`
- Payload checksum: `c35225a0c564f668c131d9d7c5f5350b68f7210ec7274b9eb87fccb5b8b3ebf0`
- JSON file: `gaia-lumen-wlan-1783139683391.json`
- JSON file SHA-256: `368abcccf8e33b878d5d3196adb3b365d4bab9adfb19a1123d75984527ae6de2`
- TXT file: `gaia-lumen-wlan-1783139683392.txt`
- TXT file SHA-256: `4b4e36d4edde6ef8e443d630b88052217e3dc7deda130114eab4ebf4cfc7eea2`

## Scope

Questo archivio pubblica il pacchetto come dato digitale verificabile. Non rappresenta una trasmissione RF grezza, non controlla apparati radio e non attiva dispositivi esterni.

## Local Reception Certificate

- Certificato: `local-reception-certificate-20260704.md`
- Evento: prima ricezione locale confermata PC -> telefono
- Ora pagina telefono: `2026-07-04T04:47:12.764Z`
- Ora conferma telefono: `2026-07-04T04:47:17.403Z`
- Telefono: `192.168.1.4`
- User agent: `Android 10 / Chrome Mobile`
- Bridge PC: `http://192.168.1.8:9089/`
- Checksum confermato: `368abcccf8e33b878d5d3196adb3b365d4bab9adfb19a1123d75984527ae6de2`

## Epsilon Eridani Targeted Packet

- Dossier: `epsilon-eridani-targeted-dossier-20260704.md`
- JSON: `epsilon-eridani-targeted-packet-20260704.json`
- Target: `Epsilon Eridani / Ran / HD 22049 / HIP 16537`
- Coordinate J2000: `03h32m55.84s / -09d27m29.7s`
- Distanza approssimata: `10.5 anni luce`
- Payload sequence: `757`
- Payload SHA-256: `5358f69337167ed4542d10d32e4542c8237b26eab94707a53c9b42f743120f0d`
- Stato: `prepared_for_authorized_directional_transmission`

## Authorized Gateway Request

- Dossier: `authorized-gateway-request-20260704.md`
- JSON: `authorized-gateway-request-20260704.json`
- Modello corretto: `Internet -> gateway autorizzato -> apparato/frequenza autorizzata`
- Stato: `ready_for_authorized_gateway_endpoint`
- Profili preparati: `70 MHz autorizzato dall'operatore`, `WLAN standard data transport`
- Requisito mancante: endpoint HTTPS/API reale del gateway e conferma dell'operatore autorizzato

## AMPRNet Gateway Request

- Dossier: `amprnet-gateway-request-20260704.md`
- JSON: `amprnet-gateway-request-20260704.json`
- Fonte locale letta: `AMPRNet_IntroCReSezioni.pdf`
- Gateway candidato dal PDF: `gw.ampr.ari.it / 44.32.32.1`
- Rete candidata: `44.32.32.0/21`
- Metodi indicati dal PDF: `WireGuard`, `IPIP`, `GRE`
- Stato: `prepared_for_authorized_amprnet_operator`
- Requisito mancante: IP/tunnel AMPRNet assegnato e destinazione AMPRNet autorizzata
