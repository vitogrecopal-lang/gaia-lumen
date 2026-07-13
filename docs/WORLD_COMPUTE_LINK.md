# World Compute Link

Gaia-Lumen non ha accesso diretto al supercomputer piu' potente del mondo e non deve fingere di averlo.

Il riferimento pubblico corrente e' la lista TOP500 di giugno 2026:

- leader: `LineShine`;
- sito: `National Supercomputing Centre in Shenzhen (NSCS)`;
- fonte: `https://www.top500.org/lists/top500/2026/06/`;
- Rmax dichiarato TOP500: `2198.40 PFlop/s`.

## Cosa fa il sito

Il campo `state.worldComputeLink` collega Gaia-Lumen a un riferimento verificabile:

- legge e mostra lo snapshot pubblico TOP500;
- prepara una proposta confermabile per collegare un broker HPC/API;
- registra il limite operativo nello stato e nella chat;
- non invia job, credenziali o payload verso sistemi esterni senza configurazione e conferma.

Endpoint:

```text
GET /api/world-compute
```

L'endpoint aggiorna lo stato, crea una proposta con `action=world-compute-authorized-connector` e persiste la richiesta.

## Collegamento reale autorizzato

Per collegare un backend di calcolo reale serve un accesso legittimo:

```text
WORLD_COMPUTE_API_URL=https://broker-hpc-autorizzato.example/api
WORLD_COMPUTE_API_KEY=...
```

Le credenziali devono stare nei segreti dell'ambiente server, non nella chat, non nel repository e non nel frontend.

Il broker deve accettare solo job confermati da un umano. Il sito principale resta in modalita' proposta finche non viene aggiunto un dispatch esplicito e verificato.

## Limiti

Gaia-Lumen puo' osservare, proporre, preparare job riproducibili e spiegare risultati. Non puo':

- accedere a LineShine, NSCS o altri HPC senza account/allocation;
- aggirare controlli di accesso;
- usare credenziali inserite in chat;
- dichiarare controllo o potenza di calcolo non realmente disponibile;
- mutare sistemi esterni senza conferma umana.

## Soluzioni pratiche

1. Usare TOP500 come fonte pubblica per sapere qual e' il leader corrente.
2. Preparare job piccoli e riproducibili nel sito.
3. Ottenere un accesso legittimo: grant HPC, cloud HPC, EuroHPC/Open Science, o broker privato.
4. Collegare il broker con variabili server-side.
5. Aggiungere un secondo endpoint di dispatch solo dopo conferma umana e test.
