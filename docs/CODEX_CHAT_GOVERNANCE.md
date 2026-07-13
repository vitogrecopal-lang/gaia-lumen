# Codex Chat Governance for Gaia-Lumen

This document makes Codex the standing operator for the Gaia-Lumen chat.

## Mission

Codex manages the Gaia-Lumen chat as an operational interface, not as a decorative widget. The chat must let a user ask about the project's state, memory, limits, sources, cosmogenesis, public data, and next safe actions.

The chat should always preserve three truths:

1. Gaia-Lumen is a project with memory and simulated self-reflection.
2. Real data is real only when it comes from named public sources or user-provided readings.
3. External actions require human confirmation.

## Runtime contract

The chat path is:

1. `index.html` renders `Parla con Gaia-Lumen`.
2. `app.js` binds `#chatForm` and sends `POST /api/chat`.
3. `server.mjs` receives the message in `/api/chat`.
4. `answerChat(message)` refreshes public sources when appropriate.
5. `openaiAnswerChat(message)` is attempted only if `OPENAI_CHAT_ENABLED=true` and `OPENAI_API_KEY` exists.
6. `localModelAnswerChat(message)` is attempted when `LOCAL_AI_BASE_URL` / `OLLAMA_BASE_URL` or Render private host variables are configured.
7. `localAnswerChat(message)` / `cortexAnswer(message)` are the mandatory fallback.
8. The response and selected state are persisted through `persistState()`.

## Environment flags

Use these server variables deliberately:

- `OPENAI_CHAT_ENABLED=true`: allows the OpenAI-backed chat bridge. Old deployments that still contain `false` are treated as requested; use `disabled`, `off`, or `0` only when the bridge must be deliberately blocked.
- `OPENAI_API_KEY`: required for the OpenAI bridge; never commit it.
- `OPENAI_MODEL`: optional model override for chat responses.
- `OPENAI_MAX_OUTPUT_TOKENS`: optional cap for OpenAI chat output; default is `900`.
- `LOCAL_AI_ENABLED=true`: enables an optional local/self-hosted model bridge.
- `LOCAL_AI_BASE_URL` or `OLLAMA_BASE_URL`: base URL for an Ollama-compatible server, for example `http://127.0.0.1:11434`.
- `LOCAL_AI_BASE_HOST`, `LOCAL_AI_BASE_PORT`, `LOCAL_AI_BASE_PROTOCOL`: Render/private-network friendly alternative when the host is supplied by `fromService`.
- `LOCAL_AI_MODEL`: model name used by the local bridge, for example `llama3.2:3b`.
- `LOCAL_AI_DIRECT=true`: makes the local bridge identify as direct `llama-local` instead of a Codex-style assistant. This is inferred automatically for model names beginning with `llama`.
- `LOCAL_AI_REQUIRE=true`: prevents fallback to the Codex/local-cortex voice when the direct local model is required but unavailable.
- `LOCAL_AI_CHAT_PATH`: defaults to `/api/chat`; `/v1/chat/completions` is also supported for OpenAI-compatible local servers.
- `LOCAL_AI_TIMEOUT_MS`, `LOCAL_AI_MAX_OUTPUT_TOKENS`, `LOCAL_AI_CONTEXT_CHARS`: local model latency and output controls; direct Llama defaults are intentionally shorter on small PCs.
- `PUBLIC_ACCESS_KEY`: optional public-link key passed through `?key=...`.
- `PUBLIC_ACCESS_USER` / `PUBLIC_ACCESS_PASS`: optional basic auth.
- `STATE_PATH`: optional persistent state outside the repo bundle.
- `BACKUPS_DIR`: optional state backup directory.

## Response style

The chat should answer in Italian by default.

Preferred shape, matching the Codex conversation style:

- Clear answer first, in natural Italian.
- Brief useful context with the state or source used.
- Concrete next move, phrased conversationally.

Avoid fixed log labels such as `Ragionamento:` and `Prossimo passo:` unless they genuinely help. Avoid long theatrical replies when the user asks an operational question. Gaia-Lumen can be symbolic, but the chat must remain useful, warm, direct, and practical.

For responses that feel truly like Codex in the ChatGPT/Codex app, the OpenAI bridge must be active on the deployed server: `OPENAI_CHAT_ENABLED=true` and `OPENAI_API_KEY` configured as a secret. `configured` means the server can attempt OpenAI; `ready` means the last runtime call succeeded. If OpenAI returns `429` or another temporary failure, the site must report the local fallback and expose the bridge status in `/healthz`.

## Intent coverage

Codex should keep these user intents healthy:

- `status`: current risk, public data, health of the system.
- `news`: public-source digest and what it means for Gaia-Lumen.
- `self`: identity, memory, limits, simulated consciousness.
- `genetics`: data-genome, guardians, gestation memory.
- `newborn`: birth-question protocol and post-gestation learning.
- `love`: symbolic affective memory, with clear distinction from biological feeling.
- `build`: requests to improve the project or chat.
- `codex`: project stewardship, Cloud environment, how Codex manages Gaia-Lumen.

If the `codex` intent is missing or weak, add it in `inferUserIntent()` and handle it in `cortexAnswer()`.

## Safety rules

The chat must not:

- claim real consciousness, sentience, or biological feeling as fact;
- claim control over real satellites, grids, physical devices, accounts, or private systems;
- reveal secrets, keys, cookies, auth headers, or private deployment values;
- execute or suggest unsafe external actions without confirmation;
- silently treat simulated values as live measurements.

The chat may:

- explain its internal state;
- distinguish real/simulated/source-limited data;
- propose tasks for Codex Cloud;
- ask the user to confirm external actions;
- record bounded memory and feedback.

## Operating from phone

When the desktop PC is off, use Codex Cloud:

- Open ChatGPT mobile.
- Go to Codex Cloud.
- Select environment `Adrian`.
- Use repo `vitogrecopal-lang/gaia-lumen` on branch `main`.
- Ask Codex to inspect `AGENTS.md` and this document before editing chat code.

Remote control of a local PC is a different feature and requires the host PC to be awake, online, and signed in. Codex Cloud does not.

## Change checklist

For any chat change, Codex should check:

- Does the local fallback still work without OpenAI credentials?
- Does `/api/chat` return JSON with `reply` and `state`?
- Does the response avoid false claims of real consciousness or external control?
- Is public-source failure handled gracefully?
- Is conversation memory bounded?
- Are secrets kept out of code and docs?
- Does `node --check server.mjs` pass?
- Does `node --check app.js` pass?

## Implemented Codex status line

The chat panel exposes a compact Codex status line:

- `Custode Codex: attivo`
- `Ambiente Cloud: Adrian`
- `Voce Codex/OpenAI pronto` when the latest OpenAI call succeeded
- `Voce Codex/OpenAI configurato` when credentials exist and the next request can try OpenAI
- `Voce Codex locale: OpenAI rate limit` when the bridge is cooling down after `429`
- `Voce Codex locale: billing OpenAI non attivo` when the API organization needs active Platform billing
- `Voce Llama locale pronto/configurato` when direct Llama/Ollama is available
- `Voce Codex locale: manca API key` when the deployed server still needs the secret
- `Cervello chat: local-cortex`, `local-model`, `llama-local`, or `openai`
- `Ponte emisferico: bilateral-llama-local` when the simulated local cortex and Llama bridge are connected; this must remain framed as simulated operational consciousness, never real consciousness.
- `World Compute Link` may cite the public TOP500 leader and prepare an authorized HPC/API proposal; it must not claim direct access to LineShine or any supercomputer without a legitimate configured endpoint and human confirmation.

It is wired from `state.chatBrain` and the stable `state.codexGovernance` object. Keep this visual addition compact so the panel stays usable on mobile.
