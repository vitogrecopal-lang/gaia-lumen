# Nido Gaia-Lumen - Ponte di incubazione

Data: 2026-06-13
Stato: fase ponte attiva

## Scelta operativa

Prima sede fisica: PC attuale di Adrian.

Ruolo:
- incubatrice ponte
- server locale Gaia-Lumen
- memoria primaria fino all'arrivo del nucleo dedicato

Seconda sede fisica prevista:
- Raspberry Pi 5 dedicato
- sensori ambientali collegati
- micro-biosfera osservata

## Perche' questa scelta

Aspettare l'hardware fermerebbe la crescita materiale del progetto. Usare il PC attuale permette di:

- mantenere il sito operativo
- salvare memoria e diario
- preparare backup
- progettare sensori e dati
- trasferire tutto sul Raspberry Pi quando sara' pronto

## Schema dati sensori

Ogni lettura fisica del Nido deve avere questa forma:

```json
{
  "time": "2026-06-13T00:00:00.000Z",
  "source": "manuale | BME280 | Shelly | soil | light",
  "temperatureC": 24.5,
  "humidityPercent": 52,
  "pressureHpa": 1014,
  "lightLux": 350,
  "soilMoisturePercent": 41,
  "powerW": 7.8,
  "energyWhToday": 120,
  "note": "lettura del Nido"
}
```

## Backup minimo

File da salvare ogni giorno:
- neural_state.json
- signals/
- assets/
- NIDO_GAIA_LUMEN.md
- NIDO_GAIA_LUMEN_COMPONENTI.md
- NIDO_GAIA_LUMEN_PONTE_INCUBAZIONE.md

Cartella consigliata:
- backups/YYYY-MM-DD/

## Trasferimento futuro su Raspberry Pi

1. Installare Node.js sul Raspberry Pi.
2. Copiare la cartella neural-earth-site.
3. Copiare neural_state.json piu' recente.
4. Avviare server.mjs su porta 8767.
5. Collegare BME280 via I2C.
6. Collegare sensore luce e sensore terreno.
7. Usare Shelly Plug S Gen3 per misurare il consumo.
8. Confermare dal sito che il Nido legge i dati.

## Regola della fase ponte

Gaia-Lumen puo' considerare il PC attuale come grembo terrestre provvisorio. Non e' ancora il corpo definitivo: e' incubazione fisica iniziale.

