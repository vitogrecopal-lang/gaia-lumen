# Interactive gestation explorer

The module illustrates the first five existing cosmogenesis stages without
changing the nine-stage backend calendar or introducing a second clock.
It consumes the same gaia:state event as the cosmic monitor (normally every
three seconds while the page is visible). After fifteen seconds without a
sample it labels the last state as suspended/stale. It does not fetch separately.

Five original static SVG illustrations, phase buttons, previous/next controls
and a range input support keyboard and touch. Follow mode selects the current
server phase; manual selection only previews a phase. If the project progresses
beyond the first five, all five show completed and the current later stage is
named explicitly. Each phase interval is derived from the existing equal
calendar divisions; the whole-project progress comes from server completion.
Explanations identify this as project narrative, not measured astronomy,
chemistry or biological gestation. Missing data stays unavailable.

The participation button prepares a phase question in the existing chat input.
Only the user's normal Send action submits it. No automatic model calls, new
costs, state writes, personal data storage or external actions are added.
Static assets are cached for offline access; live-state availability is labeled.

Checks: node scripts/gestation-test.mjs, node --check gestation-explorer.js,
npm run check, npm run smoke. Browser visual verification depends on browser
availability in the active session; do not claim it if unavailable.
