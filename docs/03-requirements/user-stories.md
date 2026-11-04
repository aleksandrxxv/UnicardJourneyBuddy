# User stories: Trello backlog

Every card is a real user story, written from the point of view of someone who uses or owns the product: a **child**, a **parent** or the **Unicard product owner**. Technical work (setup, CI, API spikes) is not a user story and is listed separately at the bottom.

Each story follows **As a … I want … so that …** and has acceptance criteria that can be checked in a demo.

**Priority (MoSCoW):** Must = needed for the PoC demo · Should = important, not blocking · Could = only if time allows (otherwise roadmap, D11).
**Size:** S ≈ ½ day · M ≈ 1–2 days · L ≈ 3–5 days.

---

## Epic: Plan a journey (child, mobile)

### US-01 Start a trip from my saved places
**As a** child, **I want** a home screen with big buttons for my saved places, **so that** I can start a trip without typing.
- [ ] Home screen shows the saved places as large buttons with an icon and a name
- [ ] Starting a trip takes at most two taps
- [ ] No keyboard is needed anywhere on this screen

Must · M · mobile

### US-02 Choose only places my parent approved
**As a** child, **I want** to pick from places my parent has approved (e.g. "School", "Grandma's"), **so that** I only travel to places I'm allowed to go.
- [ ] Only destinations from the parent's list are shown
- [ ] There is no free-text address search
- [ ] Choosing a destination plans a route from where I am now

Must · M · mobile

### US-03 Know when to leave
**As a** child, **I want** to see when I need to leave and how long the trip takes, **so that** I know if I'll be on time.
- [ ] Shows "Leave in X minutes" and the arrival time
- [ ] Shows the total trip time in minutes
- [ ] Updates when the departure time changes

Must · S · mobile

### US-04 See my whole trip before I go
**As a** child, **I want** a short picture of my trip (walk → bus 25 → walk), **so that** I understand it before I start.
- [ ] Each part of the trip is shown with an icon for walk/bus/train
- [ ] Bus/train line numbers are shown
- [ ] Fits on one screen without scrolling for a typical trip

Should · M · mobile

---

## Epic: Follow the journey (child, mobile)

### US-05 Follow simple step-by-step instructions
**As a** child, **I want** one simple instruction at a time ("Walk to the bus stop on Oak Street"), **so that** I always know what to do next.
- [ ] One step per screen, large text, an icon for the transport type
- [ ] Wording checked against the age-appropriate guidelines from the research (D1)
- [ ] Moves to the next step when I tap "Next" or when the step is done

Must · L · mobile

### US-06 Get on the right bus or train
**As a** child, **I want** to see which bus or train to take and when it really leaves, **so that** I get on the right one.
- [ ] Shows line number, direction and stop name
- [ ] Shows a live departure time from the transport data
- [ ] Says clearly when the bus is due ("Your bus arrives in 2 minutes")

Must · M · mobile

### US-07 Know when to get off
**As a** child, **I want** to be told when to get off ("2 more stops", "Get off at the next stop"), **so that** I don't miss my stop.
- [ ] Shows how many stops are left
- [ ] Gives a clear alert (vibration and sound) one stop before mine
- [ ] Names the stop I need to get off at

Must · M · mobile

### US-08 See where I am on a map
**As a** child, **I want** to see myself on a simple map, **so that** I can check I'm going the right way.
- [ ] My position and the route are shown on the map
- [ ] Map hides unneeded detail (no shops, no points of interest)
- [ ] Map can be opened from any step and closed again

Should · M · mobile

### US-09 Let my parent know I arrived
**As a** child, **I want** to tell my parent I've arrived with one tap, **so that** they know I'm safe.
- [ ] "I've arrived" button on the final step
- [ ] Shows a confirmation that my parent was told
- [ ] Ends the journey in the app

Must · S · mobile

### US-10 Know what to do if my bus is late
**As a** child, **I want** a warning when my bus is delayed or cancelled, with what to do instead, **so that** I don't panic.
- [ ] Shows a calm message when the departure is delayed or cancelled
- [ ] Suggests the next departure or a new route
- [ ] Offers to contact my parent

Could · M · mobile

---

## Epic: Help & safety (child, mobile)

### US-11 Get help quickly
**As a** child, **I want** a big Help button that is always visible, **so that** I can get help fast when I'm lost or scared.
- [ ] Help button visible on every journey screen and reachable with one thumb
- [ ] Asks for one confirmation so it isn't pressed by accident
- [ ] Sends a help alert with my last known location to my parent (see US-19)

Must · M · mobile

### US-12 Call someone I trust
**As a** child, **I want** Help to let me call my parent or emergency contact with one tap, **so that** I can talk to someone I trust.
- [ ] Shows my primary contact first, with name and photo/initials
- [ ] One tap starts a phone call
- [ ] Other emergency contacts are listed below

Must · S · mobile

### US-13 Know what to do while I wait
**As a** child, **I want** Help to show calm tips ("Find a staff member in uniform"), **so that** I know what to do while I wait for my parent.
- [ ] Shows 3–4 short tips with pictures
- [ ] Tips are written for ages 8–14
- [ ] Tips are shown after the help alert is sent

Should · S · mobile

### US-14 Use the app even if reading is hard for me
**As a** child who finds reading or seeing small things hard, **I want** large text, big buttons and screen reader support, **so that** I can use the app on my own.
- [ ] All tap targets at least 48×48 dp
- [ ] Text and buttons meet WCAG AA contrast
- [ ] All buttons and icons have screen reader labels

Should · M · mobile

---

## Epic: Account & setup (parent, portal)

### US-15 Create a parent account
**As a** parent, **I want** to create an account and log in, **so that** my child's settings are private to me.
- [ ] Sign up and log in with email and password
- [ ] Only the logged-in parent can see their child's data
- [ ] Can log out

Must · M · portal

### US-16 Connect my child's phone
**As a** parent, **I want** to add my child and connect their phone with a code, **so that** the app knows which child belongs to me.
- [ ] Portal shows a short-lived pairing code or QR code
- [ ] Child enters or scans it once; the child doesn't need an email or password
- [ ] I can disconnect the phone again

Must · M · portal + mobile

### US-17 Choose where my child may travel
**As a** parent, **I want** to add, edit and remove approved destinations, **so that** my child can only plan trips to places I trust.
- [ ] Add a destination with a name, icon and address
- [ ] Edit and delete destinations
- [ ] Changes appear in the child's app without reinstalling

Must · M · portal

### US-18 Set emergency contacts
**As a** parent, **I want** to manage emergency contacts and choose a main one, **so that** Help reaches the right person.
- [ ] Add, edit and remove contacts (name, relationship, phone)
- [ ] Mark one contact as primary
- [ ] At least one contact is required before the child can start a trip

Must · S · portal

---

## Epic: Monitoring & notifications (parent, portal)

### US-19 Get an urgent alert when my child needs help
**As a** parent, **I want** an urgent notification when my child presses Help, with their location, **so that** I can act straight away.
- [ ] Alert arrives within 10 seconds of the child confirming Help
- [ ] Shows the child's last known location on a map
- [ ] Has a button to call the child

Must · M · portal

### US-20 Know when my child leaves and arrives
**As a** parent, **I want** a notification when my child starts and finishes a trip, **so that** I know they're on their way and arrived safely.
- [ ] Notification when the trip starts, with destination and expected arrival time
- [ ] Notification when the child arrives
- [ ] Notification if the child hasn't arrived 15 minutes after the expected time

Must · M · portal

### US-21 Check how the trip is going
**As a** parent, **I want** to see the current trip status ("On bus 25, 3 stops to go"), **so that** I can check without calling.
- [ ] Shows the current step of the trip
- [ ] Shows the expected arrival time
- [ ] Updates without reloading the page

Should · M · portal

### US-22 Know if my child goes the wrong way
**As a** parent, **I want** to be alerted if my child goes noticeably off route, **so that** I can check on them.
- [ ] Alert when the child is more than a set distance from the route for a while
- [ ] Shows where the child is compared with the route
- [ ] Doesn't fire for small GPS jumps

Could · L · portal

### US-23 See past trips
**As a** parent, **I want** a list of recent trips, **so that** I can spot patterns or problems.
- [ ] Lists the trips from the last 7 days with destination, times and status
- [ ] Shows trips where Help was pressed
- [ ] Contains no detailed location trail (see US-24)

Could · S · portal

---

## Epic: Privacy & trust (parent / Unicard)

### US-24 Keep my child's location private
**As a** parent, **I want** my child's location to be stored only during a trip and deleted afterwards, **so that** I can trust the app with my child's data.
- [ ] Location is only collected while a trip is active
- [ ] Detailed location data is deleted when the trip ends
- [ ] The portal explains in plain words what data is kept and for how long

Must · S · api + portal

### US-25 Demo the product without real children's data
**As the** Unicard product owner, **I want** to run the full flow with fictional children, places and trips, **so that** I can evaluate the concept with stakeholders without using real personal data.
- [ ] A demo parent account with a fictional child, destinations and contacts exists
- [ ] The full flow works: start trip → parent notified → Help → arrival
- [ ] A demo script is in `docs/06-testing/`

Must · M · all

---

## Technical tasks (not user stories)

Track these separately, for example in a **Tech tasks** list on the board, or as checklist items inside the story they support:

- Monorepo, shared types and CI (done)
- Set up Expo Router navigation in the mobile app (supports US-01)
- Transport data test: compare TfL API and OpenTripPlanner, write ADR-0002, add a mock provider (supports US-03, US-06, US-07)
- Firebase project: auth and push notifications (supports US-15, US-19, US-20)

## Out of scope → roadmap only (D11)

Ticket purchase or Unicard smartcard integration, all UK networks, offline maps, multiple languages, smartwatch support, school/operator dashboards.
