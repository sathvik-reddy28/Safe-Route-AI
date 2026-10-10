# SafeRoute AI
**Understand the Alert. Know the Risk. Find Your Next Step.**

Real-Time Crisis Communication for Tourists During Extreme Weather Events.

> **Important:** the only emergency data in this project is a fictional Chennai extreme-rainfall scenario. All of its alerts, hazard zones, road closures, shelters and help points are **SIMULATED DEMO DATA**. SafeRoute AI is not an official alert service and is not connected to any live warning feed. Never rely on it in a real emergency.

## Overview
Tourists in unfamiliar places can struggle to understand extreme-weather warnings, find reliable information, see which areas are affected and locate shelters. SafeRoute AI puts alerts, multilingual explanations, a hazard map, route checking, claim checking and emergency phrases into one responsive website.

## Features
- **Search any place in India** – cities, towns, villages, districts, neighbourhoods and landmarks via OpenStreetMap Nominatim (restricted to India). Debounced suggestions with name, district, state and type; keyboard navigation (↑ ↓ Enter Esc); loading, empty, error and Retry states; cached results; ambiguous names list every match. Ten popular destinations are optional shortcuts only.
- **Honest data separation** – simulated Chennai data appears only when the selected coordinates are inside the demo coverage area (20 km around Chennai Central). Everywhere else the app says *"No verified emergency alerts are configured for this location. The map displays geographical information only."*
- **Dashboard** – alerts with severity, hazard, area, source, timestamps and precautions; filters; selected-location details (name, area, coordinates, data status).
- **Multilingual alerts** – English, Tamil, Telugu, Hindi; original alert text is kept separate from translations; language is remembered.
- **Interactive map** – Leaflet + OpenStreetMap, hazard zones, road closures, shelters, help points, popups, layer filters, legend, jump-to list, full-screen, re-centre, my-location. Tile-failure detection with automatic fallback and a Retry button.
- **Hazard-aware route checker** – start and destination can be any Indian place; draws a clearly labelled straight-line approximation (not roads), reports intersections with known (simulated) hazards, and says plainly when no hazard data exists. It never claims a route is safe.
- **Alert verification** – compares a pasted claim with local simulated reference records (matching, partial, contradictory, unverified, potentially outdated). It does not check live or government sources.
- **Phrasebook** – English/Tamil/Telugu/Hindi emergency phrases with search, categories, large text, copy and optional text-to-speech.
- **Quick mode** – high-contrast, large-text page: alerts (if any), precautions, shelters, map access, phrases and India's national emergency number 112 (the app does not dial or contact anyone itself).
- **Saved alerts and offline** – save/remove alerts, stale warning after 3 hours, offline banner, service worker for the app shell. Map tiles and place search are **not** available offline.
- **Data sources page** – states what is simulated, unavailable or live, and links to the real official sites (IMD, NDMA SACHET, CWC, INCOIS).

## Technology
React 18, Vite 5, React Router 6 (HashRouter, so it works on any static host), Leaflet 1.9 + React-Leaflet 4, Lucide icons, localStorage. No backend, no API keys.

## Directory structure
```
saferoute-ai/
├─ index.html, vite.config.js, package.json, package-lock.json
├─ .env.example, .gitignore, README.md
├─ public/                 favicon.svg, sw.js (service worker)
└─ src/
   ├─ main.jsx, App.jsx    entry point and routes
   ├─ routes/              Dashboard, Map, RouteChecker, AlertVerification, Phrasebook, SavedAlerts, EmergencyMode, DataSources
   ├─ components/          AppLayout, LocationSelector, PlaceSearch, LocationDetails, MapView, MapLegend, NoDataNotice, OfficialLinks, AlertCard
   ├─ context/             AppContext (language, saved alerts, selected location, data gating, online status)
   ├─ hooks/               usePersistentState, usePlaceSearch
   ├─ services/            geocodeService (Nominatim), routeService, verificationService
   ├─ data/                cities (shortcuts), datasets (coverage areas), alerts, hazards, shelters, locations, verificationRecords, phrases, officialLinks
   ├─ i18n/                translations
   ├─ utils/               distance
   └─ styles/              global.css
```

## Prerequisites
Node.js 18 or newer (https://nodejs.org – choose the LTS version) and npm (included with Node).

## Run it locally (VS Code)
1. Unzip `saferoute-ai-final.zip` and open the `saferoute-ai` folder in VS Code (File → Open Folder).
2. Open the terminal (Terminal → New Terminal) and run:
```
npm install
npm run dev
```
3. Open http://localhost:5173 in your browser.

Other commands:
```
npm run build      # production build into dist/
npm run preview    # serve the production build at http://localhost:4173 (the service worker only runs here)
```
Do not open `dist/index.html` by double-clicking; serve it with `npm run preview` or a static host.

## Deployment
- **Netlify:** Add new site → Import from GitHub. Build command `npm run build`, publish directory `dist`.
- **Vercel:** Import the repository; the Vite preset is detected automatically.
- **GitHub Pages / any static host:** run `npm run build` and upload the contents of `dist/`. The app uses relative asset paths and hash routes, so sub-folders work.
Use HTTPS in production (required for the service worker, geolocation and clipboard).

## GitHub setup
Create an empty repository named `saferoute-ai` on github.com, then in the project folder:
```
git init
git add .
git commit -m "SafeRoute AI"
git branch -M main
git remote add origin https://github.com/<your-username>/saferoute-ai.git
git push -u origin main
```

## Geocoding provider and attribution
Place search uses **OpenStreetMap Nominatim** (`https://nominatim.openstreetmap.org/search`) with `countrycodes=in`. Data © OpenStreetMap contributors (ODbL). Attribution is shown on the map and in the location card.

To respect the [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/) the app: waits until you pause typing (800 ms), never searches fewer than 3 characters, sends at most one request per second, aborts outdated requests, caches results (memory and session storage for 24 h) and sends the browser's normal Referer.
The public server officially does not support autocomplete. This pause-then-search behaviour is fine for a demo or hackathon; for real traffic, run your own Nominatim or use a commercial provider and set `VITE_GEOCODER_URL` (see `.env.example`).

Base-map tiles come from OpenStreetMap's tile server (usage policy: https://operations.osmfoundation.org/policies/tiles/). If those tiles repeatedly fail, the map switches to CARTO Voyager (OpenStreetMap data, attribution shown; check CARTO's terms for your use).

## What was wrong with the map
Leaflet measures its container once when it starts. If the container later changes size (fonts load, layout wraps, window resize, tab shown, full-screen) the map keeps the old size and shows grey, unloaded areas. The map now watches its container with a `ResizeObserver` plus window/orientation/visibility events and calls `invalidateSize()`. The map container also has a guaranteed height (`clamp()` of viewport height), the view code no longer re-fits on every render, and tile failures are detected and reported instead of silently leaving grey tiles.

## Data-source limitations
- No live emergency feed is connected. Alerts, shelters, closures, help points and verification records are simulated, static and only for the Chennai demo area.
- Other locations show the base map and place details only; "no data" never means "safe".
- The route check is a straight line and ignores roads, traffic and live conditions.
- Verification compares against 4 local simulated records only.
- Translations are hand-written; have native speakers review them before real use. New interface text added in this version (search, map, route messages) is English only.
- Place search and map tiles need the internet; they cannot work offline.

## Troubleshooting
- **Grey map / "Map tiles could not be loaded"** – your network, a firewall, an ad blocker or a VPN may block `tile.openstreetmap.org`. Use Retry map; the app also tries a fallback provider.
- **Place search shows "could not be reached"** – check your connection or firewall; press Retry. "Slow down" means the public service rate-limited you; wait a few seconds.
- **`npm install` fails** – check `node -v` is 18+; delete `node_modules` and run `npm install` again.
- **Old version shows after deploying** – the service worker caches the app shell; hard-refresh (Ctrl+Shift+R) or clear site data.
- **Blank page when opening `dist/index.html` directly** – use `npm run preview` or a static host.

## Credits
React, Vite, React Router, Leaflet, React-Leaflet, Lucide (open-source licences). Map data © OpenStreetMap contributors.
