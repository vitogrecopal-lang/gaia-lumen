# Dashboard Terra e spazio

Public GET /api/world-dashboard fetches five fixed official endpoints in parallel:
NASA RSS, ESA Space Science RSS, WHO Disease Outbreak News API, UN News RSS,
USGS M2.5+ past-day GeoJSON. No key, Gateway call, account, new subscription or
Hub energetico dependency. Original-language headlines and source links only.

Five-minute per-instance memory cache; concurrent requests share each source
fetch. Ten-second timeout, two-megabyte response limit, one-minute failure
backoff. A failed source keeps its last good cached data and explicit stale
flag, reception date, publication date and attempt date. Cold starts have no
previous cache. Coverage is bounded, not exhaustive, and is never a risk score.
No assertion of streaming or instantaneous publication by these institutions.

The lazy-loaded browser panel refreshes every five minutes while visible,
pauses in hidden tabs and offers manual refresh/automatic update toggle.
Filters by source, topic, period and title; source/topic/period preferences
are stored in this browser only. No search text is persisted. Timeline shows
the latest 80 filtered records. Selecting a news item contextualizes the
exercise; map points have only publisher coordinates (USGS), no guessed
country centroids. Map is a schematic equirectangular overview, not navigation.

The local exercise illustrates resource cooperation: demand = min(100, 2N),
residual = max(0, round(demand - (cooperation + resilience)/4)). N is the filtered
sample count, not an event severity measure. Sliders are hypothetical and
cannot predict health outcomes, conflict or policy success. No real external
actions occur. Incomplete feeds and editorial frequency affect the sample.

Verification: node scripts/world-feed-test.mjs, npm run check, npm run smoke,
live endpoint checks and browser interaction after deployment.
