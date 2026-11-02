# User stories: Trello backlog

Each story is one Trello card. Put the **ID + title** in the card title, the story and acceptance criteria in the description (criteria as a Trello checklist), and use labels for **epic**, **app** and **priority**.

**Priority (MoSCoW):** Must = needed for the PoC demo · Should = important, not blocking · Could = only if time allows (otherwise goes into the roadmap, D11).
**Size:** S ≈ ½ day · M ≈ 1–2 days · L ≈ 3–5 days.
**Sprint:** follows the week-by-week planning in the project plan.

Suggested Trello lists: `Backlog` → `Sprint (this week)` → `In progress` → `Review` → `Done`.

---

## Epic 0: Foundations (technical setup)

| ID | Story | App | Prio | Size | Sprint |
|----|-------|-----|------|------|--------|
| US-01 | As a **developer**, I want a monorepo with mobile, portal, API and shared types, so that all parts of the PoC build from one place. | all | Must | S | wk 9 |
| US-02 | As a **developer**, I want CI to typecheck and build every push, so that broken code doesn't reach `main`. | all | Should | S | wk 9 |
| US-03 | As a **developer**, I want navigation set up in the mobile app (Expo Router), so that screens can be added consistently. | mobile | Must | S | wk 9 |
| US-04 | As a **developer**, I want a transport-data spike comparing TfL API and OpenTripPlanner (recorded as ADR-0002), so that the integration is chosen on evidence. | api | Must | M | wk 9–10 |

**US-01 acceptance criteria**
- [ ] `npm install` at the root installs all workspaces
- [ ] `npm run api`, `npm run portal`, `npm run mobile` each start
- [ ] `@journeybuddy/shared` types can be imported in all three apps

**US-04 acceptance criteria**
- [ ] Both APIs called with a sample A→B journey
- [ ] Compared on: coverage, real-time data, rate limits, cost, licence, response shape
- [ ] ADR-0002 written; a `MockTransportProvider` exists as a fallback

---

## Epic 1: Child: plan a journey (mobile)

| ID | Story | App | Prio | Size | Sprint |
|----|-------|-----|------|------|--------|
| US-05 | As a **child**, I want to see a simple home screen with big buttons for my saved places, so that I can start a trip without typing. | mobile | Must | M | wk 9 |
| US-06 | As a **child**, I want to pick a destination my parent has approved (e.g. "School", "Grandma's"), so that I only go to places I'm allowed to. | mobile | Must | M | wk 9 |
| US-07 | As a **child**, I want to see when I need to leave and how long the trip takes, so that I know if I'm on time. | mobile | Must | S | wk 10 |
| US-08 | As a **child**, I want to see a short overview of my trip (walk → bus 25 → walk) with icons, so that I understand it before I start. | mobile | Should | M | wk 10 |

**US-06 acceptance criteria**
- [ ] Only destinations from the parent's list are shown
- [ ] Each destination has a label and an icon; no free-text address entry
- [ ] Tapping a destination plans a journey from the current location

---

## Epic 2: Child: follow the journey (mobile)

| ID | Story | App | Prio | Size | Sprint |
|----|-------|-----|------|------|--------|
| US-09 | As a **child**, I want step-by-step instructions in simple words ("Walk to the bus stop on Oak Street"), so that I always know what to do next. | mobile | Must | L | wk 10 |
| US-10 | As a **child**, I want to see which bus/train to take and its real-time departure, so that I get on the right one. | mobile | Must | M | wk 11 |
| US-11 | As a **child**, I want to be told when to get off ("2 more stops", "Get off at the next stop"), so that I don't miss my stop. | mobile | Must | M | wk 11 |
| US-12 | As a **child**, I want to see my position on a simple map, so that I can check I'm going the right way. | mobile | Should | M | wk 11 |
| US-13 | As a **child**, I want to tap "I've arrived" (or be detected arriving), so that my parent knows I'm safe. | mobile | Must | S | wk 11 |
| US-14 | As a **child**, I want a warning when my bus is delayed or cancelled, with what to do instead, so that I don't panic. | mobile | Could | M | wk 14 |

**US-09 acceptance criteria**
- [ ] One instruction per screen/card, with large text and an icon per transport mode
- [ ] Wording reviewed against the age-appropriate guidelines from research (D1)
- [ ] "Next" / auto-advance moves to the next leg
- [ ] Works with mock journey data when the API is unavailable

---

## Epic 3: Child: safety & help (mobile)

| ID | Story | App | Prio | Size | Sprint |
|----|-------|-----|------|------|--------|
| US-15 | As a **child**, I want a big, always-visible Help button, so that I can get help quickly when I'm lost or scared. | mobile | Must | M | wk 11 |
| US-16 | As a **child**, I want Help to call my parent or emergency contact with one tap, so that I can talk to someone I trust. | mobile | Must | S | wk 11 |
| US-17 | As a **child**, I want Help to show calm tips ("Find a staff member in uniform"), so that I know what to do while I wait. | mobile | Should | S | wk 11 |
| US-18 | As a **parent**, I want to be alerted if my child goes noticeably off route, so that I can check on them. | api / portal | Could | L | wk 14 |

**US-15 acceptance criteria**
- [ ] Help button visible on every journey screen and reachable with one thumb
- [ ] Pressing it asks for one confirmation, so it isn't triggered by accident
- [ ] Sends an `sos` journey event with the last known (mock) location to the API
- [ ] Parent sees the alert within 10 seconds (see US-24)

---

## Epic 4: Parent: account & setup (portal)

| ID | Story | App | Prio | Size | Sprint |
|----|-------|-----|------|------|--------|
| US-19 | As a **parent**, I want to create an account and log in, so that my child's settings are private to me. | portal / api | Must | M | wk 12 |
| US-20 | As a **parent**, I want to add a child profile and link it to my child's phone (e.g. pairing code), so that the app knows who the child belongs to. | portal / mobile | Must | M | wk 12 |
| US-21 | As a **parent**, I want to add, edit and remove approved destinations, so that my child can only plan trips to places I trust. | portal | Must | M | wk 12 |
| US-22 | As a **parent**, I want to manage emergency contacts and set a primary one, so that Help reaches the right person. | portal | Must | S | wk 12 |

**US-20 acceptance criteria**
- [ ] Portal shows a short-lived pairing code / QR code
- [ ] Child enters or scans it once in the app; no account or email needed for the child
- [ ] Parent can unlink a device

---

## Epic 5: Parent: monitoring & notifications (portal)

| ID | Story | App | Prio | Size | Sprint |
|----|-------|-----|------|------|--------|
| US-23 | As a **parent**, I want a notification when my child starts and finishes a journey, so that I know they're on their way and arrived safely. | portal / api | Must | M | wk 13 |
| US-24 | As a **parent**, I want an urgent notification when my child presses Help, including their location, so that I can act immediately. | portal / api | Must | M | wk 13 |
| US-25 | As a **parent**, I want to see the current journey status (not started / on bus 25 / arrived), so that I can check without calling. | portal | Should | M | wk 13 |
| US-26 | As a **parent**, I want a history of recent journeys, so that I can spot patterns or problems. | portal | Could | S | wk 14 |

---

## Epic 6: Privacy, quality & evaluation

| ID | Story | App | Prio | Size | Sprint |
|----|-------|-----|------|------|--------|
| US-27 | As **Unicard**, I want location data kept only for the active journey and deleted afterwards, so that the PoC follows data minimisation (UK GDPR / COPPA). | api | Must | S | wk 13 |
| US-28 | As **Unicard**, I want a seeded demo with mock children, destinations and journeys, so that the PoC can be shown without any real personal data. | all | Must | S | wk 14 |
| US-29 | As a **tester**, I want the mobile app to meet basic accessibility (large tap targets, readable contrast, screen reader labels), so that more children can use it. | mobile | Should | M | wk 14 |
| US-30 | As **Unicard**, I want the app connected end-to-end (child starts trip → parent notified → arrival), so that the full flow can be usability tested. | all | Must | M | wk 14 |

**US-30 acceptance criteria**
- [ ] Demo script in `docs/06-testing/` covering the usability criteria from the project plan (§11.2)
- [ ] Runs on one physical phone plus the portal in a browser

---

## Out of scope → roadmap only (D11)

Don't make these into cards. List them in the pilot proposal instead: ticket purchase or Unicard smartcard integration, multi-city / all UK networks, offline maps, multiple languages, smartwatch support, school/operator dashboards.
