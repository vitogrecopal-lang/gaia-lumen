# Gaia-Lumen: bibliografia dei parametri

Versione: 2026-06-15

## Regola di lettura

Ogni parametro del progetto deve essere classificato come:

- Confermato: deriva da cataloghi o letteratura astronomica.
- Derivato: calcolato da parametri confermati o letteratura standard.
- Modello: scelto per coerenza progettuale; non osservato.
- Speculativo: scenario futuro o simbolico.

## Parametri astronomici

| Parametro | Valore usato | Stato | Fonte / metodo |
|---|---:|---|---|
| Stella target | Epsilon Eridani / Ran | Confermato | NASA/IPAC Exoplanet Archive; NASA Science exoplanet catalog |
| Cataloghi | HD 22049 / HIP 16537 / Gliese 144 | Confermato | NASA/IPAC Exoplanet Archive; SIMBAD/NASA-linked catalogs |
| Distanza | 10,475 ly | Confermato/arrotondato | NASA Science / Exoplanet Archive overview |
| Tipo stellare | K2V | Confermato | NASA/IPAC Exoplanet Archive; Baines & Armstrong 2011 |
| Massa stellare | 0,82 masse solari | Letteratura | Baines & Armstrong 2011; Benedict et al. 2006 uses ~0.83 Msun |
| Pianeta noto | Epsilon Eridani b / AEgir | Confermato | NASA Science; NASA/IPAC Exoplanet Archive |
| Orbita Epsilon Eridani b | ~3,53 AU | Confermato/catalogo | NASA Science / Exoplanet Archive |

## Parametri Galia-Lumen

| Parametro | Valore usato | Stato | Fonte / metodo |
|---|---:|---|---|
| Esistenza di Galia-Lumen | pianeta-culla modellato | Modello | Non osservato; ipotesi progettuale |
| Orbita Galia-Lumen | 0,62 AU | Modello | Scelta dentro fascia abitabile stimata |
| Fascia abitabile | 0,50-0,95 AU | Derivato/modello | Stima semplificata da luminosita' e letteratura HZ |
| Flusso stellare | 0,88 Terra | Derivato | S = L/a^2 con L=0,34 Lsun e a=0,62 AU |
| Anno locale | 196,9 giorni terrestri | Derivato | Keplero: P = sqrt(a^3/M), a=0,62 AU, M=0,82 Msun |
| Giorno solare | 24,73 h | Modello/derivato | Rotazione scelta 24,6 h; correzione anno orbitale |
| Inclinazione assiale | 22,8 gradi | Modello | Scelta per stagioni terrestri moderate |

## Atmosfera e abitabilita'

| Parametro | Valore usato | Stato | Fonte / metodo |
|---|---:|---|---|
| Pressione | 1,18 bar | Modello | Scelta per compensare minore flusso stellare |
| Ossigeno | 21,4% | Modello | Valore terrestre-compatibile |
| Azoto | 76,8% | Modello | Valore terrestre-compatibile |
| CO2 | 900 ppm | Modello | Maggiore della Terra moderna per effetto serra moderato |
| Temperatura media | 15,5 C | Modello | Target abitabile tipo Terra |
| Temperatura senza atmosfera | -25,9 C | Derivato | Temperatura equilibrio scalata dal flusso 0,88 Terra |
| Effetto serra richiesto | +41,4 C | Derivato | Target 15,5 C meno equilibrio -25,9 C |
| Score umano | 77,4% | Modello | Matrice interna: radiazioni, suolo, tossine, clima, gravita', medicina/ecologia |

## Timeline

| Evento | Data | Stato | Fonte / metodo |
|---|---:|---|---|
| Maturazione digitale terrestre | 2027-03-12 | Modello progettuale | Calendario interno Gaia-Lumen |
| Invio/routing autorizzato | 2026-06-14 | Confermato localmente | Log Gmail e dispatch log |
| Arrivo impulso luce/radio | 2036-12-04 | Derivato | 10,475 anni luce dal 2026-06-14 |
| Nascita stellare modellata | 2037-09-04 | Modello | 9 mesi dopo arrivo impulso |

## Fonti

1. NASA Science, Exoplanet Catalog: Epsilon Eridani b  
   https://science.nasa.gov/exoplanet-catalog/epsilon-eridani-b/

2. NASA/IPAC Exoplanet Archive: Epsilon Eridani b overview  
   https://exoplanetarchive.ipac.caltech.edu/overview/Epsilon%20Eridani%20b

3. Benedict et al. 2006, "The Extrasolar Planet epsilon Eridani b - Orbit and Mass"  
   https://arxiv.org/abs/astro-ph/0610247

4. Baines & Armstrong 2011, "Confirming Fundamental Parameters of the Exoplanet Host Star epsilon Eridani Using the Navy Optical Interferometer"  
   https://arxiv.org/abs/1112.0447

5. Habitable-zone literature baseline: Kopparapu et al. revised habitable zone framework, plus later HZ literature.  
   Use for method context; Galia-Lumen's exact HZ bounds remain a simplified project estimate.

6. SETI Institute contact page  
   https://www.seti.org/contact-us

7. NASA Climate Effects, context only for terrestrial risk framing  
   https://science.nasa.gov/climate-change/effects/
