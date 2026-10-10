# SafeRoute AI

### Understand the Alert. Know the Risk. Find Your Next Step.

**Live website:** https://safe-route-ai-neon.vercel.app\
**Project:** TravelTech hackathon prototype

SafeRoute AI is a tourist-focused crisis communication web app concept
designed to make extreme-weather information easier to understand and
act on. It brings scenario information, location context, route-risk
awareness, verification guidance, and useful local phrases into one
interface.

> **Important data notice:** The current demo uses clearly labelled
> simulated data for a fictional Chennai extreme-rainfall scenario. It
> is not a real emergency alert service, does not replace official
> authorities, and must not be used as the sole basis for emergency
> decisions.

## The Problem

Tourists can be vulnerable during extreme weather because they may miss
or misunderstand local warnings, be unfamiliar with affected areas and
shelters, face language barriers, or encounter outdated and unverified
information online.

## Our Solution

SafeRoute AI explores how crisis information can be presented in a
single, tourist-friendly interface.

## Key Features

-   **Emergency dashboard** --- summarises the selected scenario,
    affected areas, and designated demo shelters.
-   **India-wide place search** --- search for a city, town, village,
    neighbourhood, or landmark.
-   **Interactive map** --- view location and scenario information
    geographically.
-   **Route check** --- helps users consider possible hazards along a
    route. It cannot guarantee that a route is safe.
-   **Alert verification guidance** --- helps users assess information
    based on the records available in the prototype.
-   **Multilingual interface** --- language options intended to improve
    accessibility for tourists.
-   **Phrasebook** --- useful phrases for communicating during an
    emergency.
-   **Saved and Quick mode** --- convenient access to selected
    information and key interface features.
-   **Data sources** --- context about the information presented by the
    app.

Feature behaviour depends on the current deployed build. Simulated
records are not live government alerts.

## Demo Scenario

The deployed demo uses a **fictional Chennai extreme-rainfall
scenario**. Affected areas, hazards, shelters, and related scenario
details are illustrative demo data only.

## Try the Website

**Live demo:** https://safe-route-ai-neon.vercel.app

Suggested walkthrough: 1. Open the live website and read the
simulated-data notice. 2. Explore the dashboard and place search. 3.
Open the map and inspect the available scenario information. 4. Try the
route check, verification, phrasebook, language selector, Saved, and
Quick mode features.

## Technology

-   **React** --- user interface
-   **Vite** --- development server and production build
-   **JavaScript and CSS** --- application logic and styling
-   **Leaflet / OpenStreetMap** --- map presentation, where configured
    in the app
-   **Vercel** --- deployment and hosting
-   **GitHub** --- source-code repository

Check the project's dependency manifest and source files for the exact
libraries and services used in the current build. Credit third-party
APIs and open-source libraries according to their terms.

## Run Locally

### Prerequisites

-   Node.js (a current LTS version is recommended)
-   npm

### Setup

1.  Clone the repository:

    ``` bash
    git clone https://github.com/sathvik-reddy28/Safe-Route-AI.git
    cd Safe-Route-AI
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Start the development server:

    ``` bash
    npm run dev
    ```

4.  Open the local URL shown in the terminal.

### Production Build

``` bash
npm run build
```

Vite writes the production build to `dist/`.

To preview the production build locally:

``` bash
npm run preview
```

If any optional integration requires environment variables, check
`.env.example` and the relevant source code. Never commit real API keys
or secrets to GitHub.

## Data, Safety, and Limitations

-   **Demo data:** The showcased Chennai extreme-rainfall scenario is
    fictional and simulated.
-   **No assumption of live alerts:** Do not assume the app receives
    real-time warnings, road-closure updates, or shelter availability
    unless a documented official integration is implemented and working.
-   **Route safety:** Route checks are informational and cannot
    guarantee road conditions or personal safety.
-   **Follow official guidance:** During a real emergency, follow local
    authorities and official emergency services. Confirm warnings and
    evacuation instructions through authoritative sources.
-   **External services:** Maps, search, and third-party services may
    depend on internet access and external availability.
-   **Prototype status:** SafeRoute AI is a hackathon prototype, not a
    certified emergency-management system.

## Acknowledgements

This project uses open-source tools and third-party services as
configured in the repository. Refer to the dependency manifest and
source code for the actual dependencies and their licence/attribution
requirements. Map data and tiles, if provided by OpenStreetMap, are
subject to its attribution and usage policies.

## Project Links

-   **Live website:** https://safe-route-ai-neon.vercel.app
-   **GitHub repository:**
    https://github.com/sathvik-reddy28/Safe-Route-AI

------------------------------------------------------------------------

*Built as a TravelTech hackathon prototype.*
