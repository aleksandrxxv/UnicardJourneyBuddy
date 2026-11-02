# ADR-0001: Monorepo with TypeScript across mobile, portal and API

- **Status:** accepted
- **Date:** 2026-11-02

## Context

The PoC has three parts: a React Native mobile app for children, a parent web portal and a lightweight API. The project plan leaves the portal framework open (React or Vue.js). There is one developer and 18 weeks, so less context-switching and less setup work matter more than anything else.

## Options considered

1. **Separate repositories per app.** Clear boundaries, but domain types get duplicated and changes that span apps need several PRs.
2. **One monorepo with npm workspaces.** One clone, one CI pipeline, and a `shared` package for domain types.
3. **Portal in Vue.js.** A good framework, but it adds a second UI paradigm next to React Native.

## Decision

Use a single repository with npm workspaces (`apps/mobile`, `apps/portal`, `apps/api`, `packages/shared`), TypeScript everywhere, and **React (Vite)** for the parent portal so that knowledge, hooks and patterns carry over from React Native.

## Consequences

- `Journey`, `EmergencyContact` and the other domain types are defined once in `@journeybuddy/shared`.
- The mobile app must install packages with `npx expo install` to stay on Expo SDK-compatible versions.
- If a heavier tool is needed later (Turborepo, Nx), it can be added without restructuring.
