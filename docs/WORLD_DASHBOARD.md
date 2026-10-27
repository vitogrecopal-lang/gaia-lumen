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
country centroids. The map now uses bundled Natural Earth 1:50 million country
geometry (242 features), WGS84 equirectangular projection, 30-degree graticule,
country labels at zoom, pan and zoom 1-12x. This is a geographic overview, not
street navigation. Boundary depiction does not endorse territorial claims.
See assets/world-natural-earth-source.json for pinned revision, SHA256, source
and public-domain license. Rebuild via node scripts/build-world-map.mjs.
The map loads its static geometry only with the dashboard data; no tile API,
tracking, geolocation permission, token, recurring map fees or new dependency.
The service worker caches it for offline use. Markers retain actual coordinates
across the dateline; fit computes the shortest longitude extent. Marker size and
color encode USGS magnitude, not damage extent. Invalid coordinates are rejected
and unknown magnitude/depth remain unavailable. A dropdown exposes overlapping
events, timeline links center the map and selection shows source, date, depth
and coordinates. Touch drag is opt-in so normal page scrolling stays usable.

The local exercise illustrates resource cooperation: demand = min(100, 2N),
residual = max(0, round(demand - (cooperation + resilience)/4)). N is the filtered
sample count, not an event severity measure. Sliders are hypothetical and
cannot predict health outcomes, conflict or policy success. No real external
actions occur. Incomplete feeds and editorial frequency affect the sample.

Verification: node scripts/world-feed-test.mjs, node scripts/world-map-test.mjs,
npm run check, npm run smoke,
live endpoint checks and browser interaction after deployment.
