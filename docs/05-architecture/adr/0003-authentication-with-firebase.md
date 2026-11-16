# ADR-0003: Firebase for parent accounts and child pairing

- **Status:** accepted
- **Date:** 2026-11-16

## Context

US-15 needs parents to sign up and log in with email and password, and to see only their own child's data. US-16 needs a child's phone to be linked to that parent **without** the child having an email or password. US-24 and the project plan (§5.2) require data minimisation, attention to UK GDPR and COPPA, and fictional data only in the PoC. The mobile app must keep running in Expo Go, so no custom native code. The budget is zero.

The project plan (§9) already names Firebase for authentication, notifications and real-time data. ADR-0002 is reserved for the transport data provider.

## Options considered

1. **Firebase Auth + Firestore.** Free Spark plan, JavaScript SDK works in Expo Go and the browser, `firebase-admin` verifies tokens in the API. Same project can later send notifications (US-19, US-20). Ties the PoC to Google; Firestore security rules need care.
2. **Supabase Auth + Postgres.** Free plan, EU region, relational data. Free projects pause after one week without use and must be restored by hand, which is a risk before demos and assessments. Not in the project plan.
3. **Own auth in Express (bcrypt + JWT + SQLite).** Free and fully under our control, but password storage, token handling and account recovery become our security responsibility and cost time the 18-week plan doesn't have.

## Decision

Use **Firebase Authentication** and **Cloud Firestore**.

- **Parents** sign in with email and password in the portal.
- **Children** sign in **anonymously** on their phone. The parent creates a short-lived pairing code in the portal; the child enters it once and the API links that anonymous user to the child profile. The child never gives an email, name or password to Firebase.
- **All data access goes through the Express API**, which verifies the Firebase ID token with `firebase-admin` and checks ownership (parent owns child, device belongs to child). The apps never read Firestore directly, and Firestore rules deny all client access.
- **Development uses the Firebase Local Emulator Suite** (`demo-journeybuddy` project), so no real accounts or data are created while building and testing.

## Consequences

- One place (the API) decides who can see what, which keeps authorisation testable and easy to explain in the privacy assessment (D9).
- Firestore should be created in an EU region when the real project is used.
- The API needs a service-account key for the real project. It is a secret, kept out of git (`.gitignore` already blocks `serviceAccountKey*.json`).
- Switching away from Firebase later means replacing the token check and the data layer in the API only; the apps talk to the API, not to Firestore.
