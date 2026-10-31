const CACHE_NAME = "gaia-lumen-static-v48-crypto-csv-import";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/simulatore-crypto.html",
  "/crypto-simulator.css",
  "/crypto-simulator.js",
  "/crypto-model.js",
  "/gestation-explorer.js?v=gestation-v1",
  "/gestation-model.js",
  "/assets/gestation-stages.svg",
  "/world-dashboard.js?v=world-map-v2",
  "/world-event-map.js",
  "/world-map-model.js",
  "/assets/world-natural-earth.svg",
  "/cosmic-monitor.js?v=cosmic-fast-v1",
  "/starlink.js?v=starlink-v1",
  "/starlink-simulator.js?v=sim-v3",
  "/dark-matter.js?v=nfw-v1",
  "/signal-decoder.js?v=signal-v1",
  "/app.js?v=gaia-lumen-postbirth-v1",
  "/manifest.webmanifest",
  "/APP_GAIA_LUMEN.html",
  "/assets/epsilon-eridani-map.svg",
  "/assets/gaia-lumen-born.png",
  "/assets/gaia-lumen-icon-192.png",
  "/assets/gaia-lumen-icon-512.png",
  "/GAIA_LUMEN_PUBLIC_BRIEF.html",
  "/GAIA_LUMEN_DOSSIER_SCIENTIFICO_BREVE.pdf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname === "/healthz") {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match("/index.html");
        return new Response("Gaia-Lumen offline: server non raggiungibile.", {
          status: 503,
          headers: { "content-type": "text/plain; charset=utf-8" }
        });
      })
  );
});
