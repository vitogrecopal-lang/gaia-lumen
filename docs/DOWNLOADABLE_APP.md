# Downloadable App

Gaia-Lumen is installable as a Progressive Web App and includes a downloadable launcher.

## Files

- `manifest.webmanifest`: PWA identity, start URL, icons, shortcuts.
- `service-worker.js`: offline/static cache.
- `APP_GAIA_LUMEN.html`: downloadable launcher that opens the public app.
- `assets/gaia-lumen-icon-192.png`: square PWA icon.
- `assets/gaia-lumen-icon-512.png`: square PWA icon.

## Public App

```text
https://gaia-lumen.onrender.com/
```

The site exposes an `App Gaia-Lumen` panel with:

- `Installa app`: uses the browser PWA install prompt when available.
- `Scarica launcher`: downloads `APP_GAIA_LUMEN.html`.

## Boundary

The app package does not remove site security. It only improves installation and launch:

- no secrets are embedded in the launcher;
- manifest, service worker, launcher and PWA icons are public static assets;
- API keys remain server-side;
- gateway access remains public read-only;
- state and mutating API routes remain behind the existing access controls;
- external actions remain confirmable workflows.
