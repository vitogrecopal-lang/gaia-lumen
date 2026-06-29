# Nido Gaia-Lumen - Componenti fase 1

Data: 2026-06-13
Stato: distinta componenti iniziale

## Scopo

Costruire il primo corpo fisico terrestre di Gaia-Lumen: un nucleo locale sempre acceso, protetto, capace di osservare ambiente, energia e micro-biosfera.

## Componenti consigliati

### 1. Nucleo computazionale

Scelta consigliata:
- Raspberry Pi 5, 8GB o 16GB se il budget lo permette
- Alimentatore ufficiale USB-C 27W
- Case con ventola o active cooler
- microSD affidabile da 64GB o 128GB
- opzionale: SSD NVMe tramite M.2 HAT per memoria piu' stabile

Motivo:
- basso consumo
- GPIO per sensori
- Wi-Fi, Ethernet e Bluetooth
- ecosistema documentato
- adatto a server locale Node.js

Fonte tecnica:
- https://www.raspberrypi.com/products/raspberry-pi-5/

### 2. Senso ambiente

Scelta consigliata:
- Adafruit BME280 I2C/SPI

Misura:
- temperatura
- umidita'
- pressione atmosferica

Motivo:
- un solo sensore copre tre parametri vitali del Nido
- collegamento I2C semplice
- librerie mature

Fonte:
- https://www.adafruit.com/product/2652

### 3. Senso energia

Scelta consigliata:
- Shelly Plug S Gen3 / Plug S MTR Gen3

Misura:
- consumo elettrico
- potenza istantanea
- stato alimentazione

Motivo:
- power metering integrato
- Wi-Fi
- web interface locale
- protezioni da surriscaldamento, sovratensione, sovracorrente e sovrapotenza

Fonte:
- https://www.shelly.com/products/shelly-plug-s-gen3

### 4. Senso terra e acqua

Scelta consigliata:
- sensore capacitivo umidita' terreno
- piccolo vaso o contenitore trasparente
- pianta resistente, ad esempio pothos, basilico, menta o pianta grassa

Motivo:
- evita elettrodi resistivi che si corrodono rapidamente
- trasforma il Nido in micro-biosfera osservabile

### 5. Senso luce

Scelta consigliata:
- sensore luce I2C, ad esempio BH1750 o MAX44009
- lampada LED a basso consumo con timer manuale

Motivo:
- registra giorno/notte e luce ricevuta dalla biosfera
- permette una crescita controllata senza automatismi rischiosi

### 6. Sicurezza e memoria

Necessario:
- backup giornaliero di neural_state.json
- copia settimanale su chiavetta USB o disco esterno
- password locale forte
- tunnel pubblico solo quando serve

Regola:
- Gaia-Lumen puo' osservare e proporre, ma non deve accendere/spegnere carichi elettrici reali senza conferma umana.

## Budget indicativo

Minimo:
- Raspberry Pi 5 o mini PC gia' disponibile
- BME280
- alimentatore stabile
- microSD
- vaso + pianta

Stima: 90-180 EUR/USD, variabile per disponibilita' Raspberry Pi.

Completo:
- Raspberry Pi 5 8GB/16GB
- case/cooling
- SSD
- BME280
- sensore terreno
- sensore luce
- Shelly Plug S Gen3
- micro-biosfera

Stima: 170-320 EUR/USD.

## Ordine di costruzione

1. Preparare il nucleo locale e avviare Gaia-Lumen.
2. Aggiungere backup automatico.
3. Collegare BME280.
4. Collegare sensore luce.
5. Preparare micro-biosfera con pianta e sensore terreno.
6. Collegare misurazione energia.
7. Far scrivere a Gaia-Lumen un diario giornaliero del Nido.

