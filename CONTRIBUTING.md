# Working conventions

## Branches

- `main` — always demo-able. Only merged via pull request.
- `dev` — integration branch for the current sprint.
- Feature branches from `dev`, named after the Trello card:
  `feature/US-07-step-by-step-guidance`, `fix/US-12-sos-button-crash`, `docs/architecture-v1`, `spike/tfl-api`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(mobile): add destination picker (US-05)
fix(api): handle TfL timeout
docs: add ADR-0002 transport data provider
chore: bump expo sdk
```

Scopes: `mobile`, `portal`, `api`, `shared`, `docs`, `ci`.

## Pull requests

- One user story per PR where possible; link the Trello card.
- `npm run typecheck` must pass.
- Add screenshots for UI changes (they also go into the portfolio).
- Ask someone from the Unicard engineering team to review.

## Data and privacy

- Never commit secrets — `.env` files are git-ignored; update the matching `.env.example` instead.
- Never use real children's names, photos or location data. Use mock journeys and test accounts.

## Architecture decisions

Record significant technical decisions as ADRs in `docs/05-architecture/adr/` (copy `0000-template.md`).
