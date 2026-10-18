# AI Gateway dedicato a Gaia-Lumen

Progetto Vercel: gaia-lumen-originale, prj_roqcej6EBO4F9wqkvtP4N27EalkG. Autenticazione OIDC richiesta al runtime via @vercel/oidc, nessuna chiave copiata da Hub energetico. Configurazione solo production: GAIA_AI_GATEWAY_ENABLED=true e GAIA_AI_GATEWAY_MODEL=openai/gpt-4.1-mini. Catalogo live verificato il 18 ottobre 2026: input 0.40 USD/milione token, output 1.60 USD/milione token.

POST /api/chat preferisce Gateway quando abilitato; nessun fallback diretto OpenAI in quel caso. Richieste da 600 token output, messaggio massimo 4000 caratteri, contesto pubblico massimo 6000 caratteri, timeout 25 secondi, cooldown errori 60 secondi. Conservati i rate limit API esistenti. Nessuna chiamata dal ciclo autonomo. Nessuna memoria di Hub energetico, credenziale Replika o conversazione precedente inviata al modello; soltanto il messaggio corrente e un riepilogo pubblico del progetto.

Stato pubblico aiGateway: modello, esito, orari e ID generazione, mai token o corpo errori del provider. Il client indica lo stato effettivo. Le configurazioni e le attribuzioni OIDC sono separate per progetto; crediti e fatturazione appartengono comunque al team Vercel. Nessun acquisto, ricarica automatica o budget del team modificato. Non e' imposto da questa integrazione un tetto monetario mensile per progetto.

Fonti: https://vercel.com/docs/ai-gateway/authentication-and-byok/oidc e https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions .
