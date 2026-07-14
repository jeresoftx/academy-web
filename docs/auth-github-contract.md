# GitHub Auth Contract

## Scope

GitHub OAuth identifies students so Jeresoft Academy can sync progress, issue
badges, and later verify exercises. Course content remains public, following
RFC-0001 §6 and the academy rule that the site is an open learning surface.

## Product Rules

- Course pages remain readable without an account.
- Anonymous local progress remains available indefinitely.
- GitHub sign-in is for progress sync, identity, badges, exercise submission,
  and future verification.
- The UI must say "Guardar progreso con GitHub" or similar; it must not imply
  that GitHub unlocks a course.
- Blocking course content behind login would require a new RFC because it would
  change the public-access decision.

## Minimal User

- `id`: internal ID
- `githubId`: GitHub numeric ID
- `username`: GitHub login
- `avatarUrl`: GitHub avatar URL
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

## Progress

- `userId`
- `courseSlug`
- `chapterSlug`
- `state`: `not_started`, `in_progress`, `completed`
- `completedAt`
- `updatedAt`

## Badges

- `userId`
- `badgeSlug`
- `courseSlug`
- `issuedAt`

## Privacy Rule

Do not store email unless a future feature requires it and the UI explains why.
The default data model stores only the minimum GitHub profile fields needed to
show identity and connect progress to an account.

## Backend Location

The backend is not implemented in this repository yet. When it enters the
monorepo, the preferred structure is:

- `apps/web`: Astro + Vue frontend.
- `apps/api`: Rust GraphQL API.

Until that split exists, `/auth/github` is a product-facing placeholder in the
frontend. It should not be wired to a real OAuth flow without the API boundary,
session strategy, environment variables, and tests described in this contract.
