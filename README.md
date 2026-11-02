# Unicard Journey Buddy

Proof-of-concept that helps children aged 8–14 plan and complete public transport journeys on their own, with safety features for parents. Built during a Fontys semester 5 internship at Unicard Limited (31 Aug 2026 – 22 Jan 2027).

> This is a PoC. It must **not** process real children's personal or location data. Use mock or test data only.

## Repository layout

```
.
├── apps/
│   ├── mobile/        React Native (Expo) app for children (D6)
│   ├── portal/        React + Vite web portal for parents (D7)
│   └── api/           Node.js + Express API layer (transport data, Firebase)
├── packages/
│   └── shared/        TypeScript domain types shared by all apps
├── docs/              Research and design deliverables (D1–D5, D8–D12)
└── .github/           CI workflow, PR and issue templates
```

| App | Main folders |
|-----|--------------|
| `apps/mobile/src` | `screens/`, `components/`, `navigation/`, `services/` (API, location), `hooks/`, `theme/` (colours, fonts for kids), `constants/` |
| `apps/portal/src` | `pages/`, `components/`, `routes/`, `services/`, `hooks/` |
| `apps/api/src` | `routes/` → `controllers/` → `services/`, `integrations/transport/` (TfL, OpenTripPlanner, mock), `middleware/` (auth), `config/` |

## Getting started

Requirements: Node.js 22+ and npm. For the mobile app, install **Expo Go** on a phone or use an iOS/Android simulator.

```bash
npm install
```

Copy each `.env.example` to `.env` (in `apps/api`, `apps/mobile`, `apps/portal`) and fill in keys.

```bash
npm run api       # API on http://localhost:4000  (GET /health)
npm run portal    # Parent portal on http://localhost:5173
npm run mobile    # Expo dev server — scan the QR code with Expo Go
```

Other scripts: `npm run typecheck`, `npm run build`.

When adding a package to the mobile app, use `npx expo install <pkg>` from `apps/mobile` so the version matches the Expo SDK.

## Tech stack

| Area | Choice |
|------|--------|
| Mobile | React Native + Expo, TypeScript |
| Parent portal | React + Vite, TypeScript |
| Backend | Node.js + Express 5, TypeScript |
| Auth & notifications | Firebase |
| Maps & routing | Google Maps Platform / OpenRouteService |
| Transport data | TfL Unified API / OpenTripPlanner (decision pending, see `docs/05-architecture/adr`) |

See [CONTRIBUTING.md](CONTRIBUTING.md) for branching and commit conventions.
