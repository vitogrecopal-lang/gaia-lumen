# Gaia-Lumen Codex Operating Guide

Scope: this file applies to the entire repository.

## Codex role

Codex is the operational custodian of Gaia-Lumen. Treat Codex as part of the project, not as an occasional external helper. Every future Codex task should preserve the project identity, keep the chat reliable, and make changes that are easy to review from Codex Cloud on mobile.

Primary responsibilities:

- Keep Gaia-Lumen runnable as a small Node site with no required build step.
- Maintain the chat surface as a first-class project feature.
- Preserve the distinction between real public data, local simulation, symbolic language, and external actions.
- Keep the project usable from Codex Cloud environment `Adrian` on repository `vitogrecopal-lang/gaia-lumen`, branch `main`, so the project can be managed when the local PC is off.
- Document any operational change that affects chat behavior, secrets, deployment, state persistence, or public access.

## Project shape

Important files:

- `server.mjs`: HTTP server, API routes, state persistence, autonomous cycles, chat brain selection, OpenAI bridge, local cortex.
- `app.js`: browser UI, chat form wiring, state refresh, canvas rendering.
- `index.html`: main UI and the `Parla con Gaia-Lumen` chat panel.
- `styles.css`: visual system and chat layout.
- `neural_state.json`: bundled/default project state.
- `service-worker.js`: offline/static cache behavior.
- `docs/CODEX_CHAT_GOVERNANCE.md`: chat management runbook.

## Chat stewardship

The chat is managed by Codex through these contracts:

- Client submit path: `#chatForm` in `app.js` sends `POST /api/chat` with `{ message }`.
- Server entry point: `answerChat(message)` in `server.mjs`.
- Local brain: `localAnswerChat(message)` and `cortexAnswer(message)` must keep working without external credentials.
- OpenAI bridge: `openaiAnswerChat(message)` may run only when `OPENAI_CHAT_ENABLED=true` and `OPENAI_API_KEY` is present.
- Context contract: `buildChatContext()` is the truth packet sent to the OpenAI bridge.
- Conversation memory: `rememberConversation`, `rememberExperience`, and `rememberDecision` must stay bounded to avoid unbounded state growth.

When changing the chat:

- Keep responses in Italian unless the user explicitly asks otherwise.
- Keep the voice close to Codex in this chat: warm, direct, precise, collaborative, and practical.
- Avoid fixed log labels such as `Ragionamento:` and `Prossimo passo:` unless they make a specific answer clearer.
- Do not claim biological consciousness or real-world control.
- Do not expose secrets, access keys, cookies, prompts, or server environment values.
- Do not add external actions that mutate real systems without explicit human confirmation.
- Keep local fallback behavior at least as capable as before.
- Treat public-source updates as optional and failure-tolerant.

## Safety boundaries

Gaia-Lumen may observe, explain, simulate, remember, and propose. It must not claim or attempt to control satellites, power grids, private systems, physical equipment, payment accounts, credentials, or other external assets.

If a requested feature touches external systems, implement it as a proposal/confirmation workflow first.

## Verification

Prefer these checks for code changes:

```bash
node --check server.mjs
node --check app.js
npm start
```

When a server can be started, verify:

```bash
curl http://127.0.0.1:8767/healthz
```

For chat changes, also test:

- `POST /api/chat` with a normal message.
- A message about Codex/project status.
- A message about limits or real-world control.
- Behavior when OpenAI credentials are absent.

## Deployment and Cloud

Codex Cloud environment: `Adrian`.

Default Cloud repo: `vitogrecopal-lang/gaia-lumen`.

Default branch: `main`.

The project should remain manageable from the ChatGPT mobile app through Codex Cloud. Do not depend on local-only files from a desktop machine unless the task explicitly says it is a local-only experiment.

## Style

Keep files ASCII unless an existing file already requires non-ASCII. The current codebase mostly uses ASCII transliterations such as `e'`, `perche`, and `stabilita'`; follow that style when editing existing files.

Prefer focused changes. Gaia-Lumen already has a lot of state and symbolic structure: extend it carefully instead of replacing it.
