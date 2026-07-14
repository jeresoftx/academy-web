# GitHub Auth And Progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GitHub identity to Jeresoft Academy so students can save progress, sync across devices, earn badges, and later submit verified work, while keeping course content public.

**Architecture:** Phase 1 keeps the site static and stores anonymous progress in `localStorage`. Phase 2 adds GitHub OAuth and syncs local progress into a minimal backend account. Phase 3 extends the same identity to badges, exercises, and future verification flows without locking free course access.

**Tech Stack:** Astro + Vue, Playwright, localStorage, future Rust GraphQL backend, future MongoDB managed store, GitHub OAuth.

---

## Non-Negotiable Product Decisions

- [x] Course pages remain publicly readable without an account.
- [x] GitHub login is for progress, identity, badges, exercise submission, and verification.
- [x] Anonymous local progress remains available indefinitely.
- [ ] If the project ever decides to block course content behind login, that requires a new RFC because it changes RFC-0001 §6.
- [x] The UI copy must say "Guardar progreso con GitHub" or similar, not "Desbloquear curso".
- [ ] No personal data beyond the minimum GitHub profile and learning progress is stored.

## File Structure

- [x] Create `src/lib/progress/types.ts` for progress/auth domain types.
- [x] Create `src/lib/progress/local-progress.ts` for localStorage read/write.
- [x] Create `src/components/ProgressToggle.vue` for chapter completion controls.
- [x] Create `src/components/GitHubAuthPrompt.vue` for the "Guardar progreso con GitHub" callout.
- [x] Modify `src/pages/courses/[slug]/[chapter].astro` to show progress controls and GitHub prompt.
- [x] Modify `tests/home.spec.ts` or create `tests/progress.spec.ts` for local progress and auth prompt behavior.
- [x] Phase 5 creates `src/pages/account.astro` for profile/progress overview.
- [ ] Phase 3 creates backend crates or packages when Rust GraphQL enters the repo.
- [ ] Phase 3 creates server-side models for users, progress, and badges.

---

## Phase 1: Anonymous Progress In The Static Site

### Task 1: Define Progress Types

**Files:**

- Create: `src/lib/progress/types.ts`
- Test: `tests/progress.spec.ts`

- [x] **Step 1: Write the failing test**

Create `tests/progress.spec.ts` with:

```ts
import { test, expect } from '@playwright/test';

test('un capítulo puede marcarse como completado localmente sin cuenta', async ({
  page,
}) => {
  await page.goto('/courses/algorithms/sliding-window/');

  await page.getByRole('button', { name: 'Marcar como completado' }).click();

  await expect(page.getByRole('button', { name: 'Completado' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('button', { name: 'Completado' })).toBeVisible();
});
```

- [x] **Step 2: Run the test and verify it fails**

Run:

```bash
pnpm test -- --grep "completado localmente"
```

Expected: FAIL because the progress button does not exist yet.

- [x] **Step 3: Create domain types**

Create `src/lib/progress/types.ts`:

```ts
export type CourseSlug = 'algorithms' | 'design-patterns';

export type ProgressState = 'not_started' | 'in_progress' | 'completed';

export type ChapterProgress = {
  courseSlug: CourseSlug;
  chapterSlug: string;
  state: ProgressState;
  completedAt?: string;
};

export type LocalProgressSnapshot = {
  version: 1;
  chapters: ChapterProgress[];
};
```

- [x] **Step 4: Run type check**

Run:

```bash
pnpm check
```

Expected: PASS with no new errors.

- [x] **Step 5: Commit**

```bash
git add src/lib/progress/types.ts tests/progress.spec.ts
git commit -m "feat: define local progress contract"
```

### Task 2: Implement Local Progress Storage

**Files:**

- Create: `src/lib/progress/local-progress.ts`
- Modify: `tests/progress.spec.ts`

- [x] **Step 1: Add storage behavior expectations**

Extend `tests/progress.spec.ts` with:

```ts
test('el progreso local usa una llave estable por versión', async ({
  page,
}) => {
  await page.goto('/courses/algorithms/sliding-window/');
  await page.getByRole('button', { name: 'Marcar como completado' }).click();

  const stored = await page.evaluate(() =>
    window.localStorage.getItem('jeresoft-academy:progress:v1'),
  );

  expect(stored).toContain('"version":1');
  expect(stored).toContain('"courseSlug":"algorithms"');
  expect(stored).toContain('"chapterSlug":"sliding-window"');
  expect(stored).toContain('"state":"completed"');
});
```

- [x] **Step 2: Run the test and verify it fails**

Run:

```bash
pnpm test -- --grep "progreso local"
```

Expected: FAIL because the storage helper and UI do not exist yet.

- [x] **Step 3: Implement storage helper**

Create `src/lib/progress/local-progress.ts`:

```ts
import type {
  ChapterProgress,
  CourseSlug,
  LocalProgressSnapshot,
  ProgressState,
} from './types';

export const LOCAL_PROGRESS_KEY = 'jeresoft-academy:progress:v1';

const emptySnapshot = (): LocalProgressSnapshot => ({
  version: 1,
  chapters: [],
});

export function readLocalProgress(): LocalProgressSnapshot {
  if (typeof window === 'undefined') {
    return emptySnapshot();
  }

  const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
  if (!raw) {
    return emptySnapshot();
  }

  try {
    const parsed = JSON.parse(raw) as LocalProgressSnapshot;
    return parsed.version === 1 && Array.isArray(parsed.chapters)
      ? parsed
      : emptySnapshot();
  } catch {
    return emptySnapshot();
  }
}

export function writeChapterProgress(input: {
  courseSlug: CourseSlug;
  chapterSlug: string;
  state: ProgressState;
}): ChapterProgress {
  const snapshot = readLocalProgress();
  const completedAt =
    input.state === 'completed' ? new Date().toISOString() : undefined;
  const nextChapter: ChapterProgress = {
    courseSlug: input.courseSlug,
    chapterSlug: input.chapterSlug,
    state: input.state,
    completedAt,
  };

  const chapters = snapshot.chapters.filter(
    (chapter) =>
      chapter.courseSlug !== input.courseSlug ||
      chapter.chapterSlug !== input.chapterSlug,
  );

  const nextSnapshot: LocalProgressSnapshot = {
    version: 1,
    chapters: [...chapters, nextChapter],
  };

  window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(nextSnapshot));
  return nextChapter;
}

export function readChapterProgress(input: {
  courseSlug: CourseSlug;
  chapterSlug: string;
}): ChapterProgress | undefined {
  return readLocalProgress().chapters.find(
    (chapter) =>
      chapter.courseSlug === input.courseSlug &&
      chapter.chapterSlug === input.chapterSlug,
  );
}
```

- [x] **Step 4: Run checks**

Run:

```bash
pnpm check
pnpm test -- --grep "progreso local"
```

Expected: `pnpm check` PASS. Test still FAIL until UI is added in Task 3.

- [x] **Step 5: Commit**

```bash
git add src/lib/progress/local-progress.ts tests/progress.spec.ts
git commit -m "feat: add local progress storage"
```

### Task 3: Add Chapter Progress Button

**Files:**

- Create: `src/components/ProgressToggle.vue`
- Modify: `src/pages/courses/[slug]/[chapter].astro`
- Test: `tests/progress.spec.ts`

- [x] **Step 1: Create Vue component**

Create `src/components/ProgressToggle.vue`:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  readChapterProgress,
  writeChapterProgress,
} from '@/lib/progress/local-progress';
import type { CourseSlug } from '@/lib/progress/types';

const props = defineProps<{
  courseSlug: CourseSlug;
  chapterSlug: string;
}>();

const completed = ref(false);

onMounted(() => {
  completed.value =
    readChapterProgress({
      courseSlug: props.courseSlug,
      chapterSlug: props.chapterSlug,
    })?.state === 'completed';
});

function toggleCompletion() {
  completed.value = !completed.value;
  writeChapterProgress({
    courseSlug: props.courseSlug,
    chapterSlug: props.chapterSlug,
    state: completed.value ? 'completed' : 'in_progress',
  });
}
</script>

<template>
  <button class="progress-toggle" type="button" @click="toggleCompletion">
    {{ completed ? 'Completado' : 'Marcar como completado' }}
  </button>
</template>

<style scoped>
.progress-toggle {
  min-height: 42px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--academy-gold) 18%, var(--card));
  color: var(--foreground);
  padding: 0 16px;
  font-weight: 780;
}
</style>
```

- [x] **Step 2: Mount button in the chapter page**

Modify `src/pages/courses/[slug]/[chapter].astro`:

```astro
---
import ProgressToggle from '@/components/ProgressToggle.vue';
---

<ProgressToggle
  client:load
  courseSlug={course.slug}
  chapterSlug={lesson.slug}
/>
```

Place it in the chapter status/meta area, near the current `Estado` card.

- [x] **Step 3: Run focused tests**

Run:

```bash
pnpm test -- --grep "completado localmente|progreso local"
```

Expected: PASS.

- [x] **Step 4: Run full checks**

Run:

```bash
pnpm check
pnpm test
```

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/components/ProgressToggle.vue src/pages/courses/[slug]/[chapter].astro tests/progress.spec.ts
git commit -m "feat: add anonymous chapter progress"
```

---

## Phase 2: GitHub Sign-In UX Without Backend Lock-In

### Task 4: Add GitHub Auth Prompt

**Files:**

- Create: `src/components/GitHubAuthPrompt.vue`
- Modify: `src/pages/courses/[slug]/[chapter].astro`
- Test: `tests/progress.spec.ts`

- [x] **Step 1: Write failing test**

Add:

```ts
test('el capítulo invita a guardar progreso con GitHub sin bloquear lectura', async ({
  page,
}) => {
  await page.goto('/courses/algorithms/sliding-window/');

  await expect(page.getByText('Guardar progreso con GitHub')).toBeVisible();
  await expect(
    page.getByText('Puedes seguir estudiando sin cuenta.'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Sliding Window: pensar en ventanas, no en ciclos',
    }),
  ).toBeVisible();
});
```

- [x] **Step 2: Run and verify failure**

Run:

```bash
pnpm test -- --grep "Guardar progreso con GitHub"
```

Expected: FAIL because the prompt does not exist yet.

- [x] **Step 3: Create prompt component**

Create `src/components/GitHubAuthPrompt.vue`:

```vue
<template>
  <aside class="github-auth-prompt" aria-label="Guardar progreso">
    <p class="eyebrow">Progreso en la nube</p>
    <h2>Guardar progreso con GitHub</h2>
    <p>
      Puedes seguir estudiando sin cuenta. GitHub solo se usa para sincronizar
      progreso, insignias y futuras entregas.
    </p>
    <a class="github-button" href="/auth/github">Continuar con GitHub</a>
  </aside>
</template>

<style scoped>
.github-auth-prompt {
  display: grid;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  padding: 16px;
}

.eyebrow {
  color: var(--academy-gold);
  font-family:
    SFMono-Regular,
    Cascadia Code,
    JetBrains Mono,
    ui-monospace,
    monospace;
  font-size: 11px;
  font-weight: 820;
  text-transform: uppercase;
}

h2,
p {
  margin: 0;
}

h2 {
  font-size: 18px;
  line-height: 1.1;
}

p {
  color: var(--academy-readable-muted);
  line-height: 1.5;
}

.github-button {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--academy-ink);
  color: var(--academy-sun);
  padding: 0 14px;
  font-weight: 780;
  text-decoration: none;
}
</style>
```

- [x] **Step 4: Mount prompt in chapter right rail**

Modify `src/pages/courses/[slug]/[chapter].astro` and place:

```astro
<GitHubAuthPrompt client:load />
```

in the right rail below the `Estado` card.

- [x] **Step 5: Run checks and commit**

```bash
pnpm check
pnpm test -- --grep "Guardar progreso con GitHub"
git add src/components/GitHubAuthPrompt.vue src/pages/courses/[slug]/[chapter].astro tests/progress.spec.ts
git commit -m "feat: add github progress prompt"
```

---

## Phase 3: Backend Boundary For GitHub OAuth

### Task 5: Document Backend Contract Before Implementing It

**Files:**

- Create: `docs/auth-github-contract.md`

- [x] **Step 1: Create contract document**

Create `docs/auth-github-contract.md` with:

```md
# GitHub Auth Contract

## Scope

GitHub OAuth identifies students so Jeresoft Academy can sync progress,
issue badges, and later verify exercises. Course content remains public.

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
```

- [x] **Step 2: Review against RFC-0001 §6**

Confirm the document includes:

- content public
- local progress remains
- GitHub only for sync/identity
- minimal data model

- [x] **Step 3: Commit**

```bash
git add docs/auth-github-contract.md
git commit -m "docs: define github auth contract"
```

### Task 6: Add Backend Route Stubs Only When Backend Exists

**Files:**

- Future backend route: `apps/api` or backend crate path chosen when Fase 2 begins.
- Future frontend integration: auth callback route.

- [x] **Step 1: Confirm backend location**

Before coding, choose one:

- `apps/web` + `apps/api` if the monorepo is split by app.
- `frontend` + `backend` if the repo follows a simpler folder structure.

Record the chosen folder in `docs/auth-github-contract.md`.

- [ ] **Step 2: Implement GitHub OAuth start endpoint**

Endpoint behavior:

```text
GET /auth/github
  -> redirects to GitHub OAuth authorize URL
```

Required environment variables:

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_OAUTH_CALLBACK_URL
SESSION_SECRET
```

- [ ] **Step 3: Implement GitHub OAuth callback endpoint**

Endpoint behavior:

```text
GET /auth/github/callback
  -> exchanges code for access token
  -> fetches GitHub user profile
  -> upserts minimal user
  -> creates session
  -> redirects to previous academy page or /account
```

- [ ] **Step 4: Add tests**

Backend tests must verify:

- missing code returns 400
- invalid state returns 400
- valid GitHub profile upserts user
- callback creates session

- [ ] **Step 5: Commit**

```bash
git add docs/auth-github-contract.md
git commit -m "feat: add github oauth backend boundary"
```

---

## Phase 4: Sync Local Progress To Account

### Task 7: Add Sync Contract

**Files:**

- Modify: `docs/auth-github-contract.md`
- Future frontend file: `src/lib/progress/sync-progress.ts`
- Future backend mutation: `syncProgress`

- [x] **Step 1: Add GraphQL mutation contract**

Add to `docs/auth-github-contract.md`:

```graphql
mutation SyncProgress($input: SyncProgressInput!) {
  syncProgress(input: $input) {
    courseSlug
    chapterSlug
    state
    completedAt
    updatedAt
  }
}
```

Rules:

- local `completed` wins over remote `in_progress`
- newest `updatedAt` wins when states differ
- sync is idempotent
- sync never deletes remote progress

- [ ] **Step 2: Implement frontend sync helper when backend exists**

Create `src/lib/progress/sync-progress.ts`:

```ts
import { readLocalProgress } from './local-progress';

export async function syncLocalProgressWithAccount() {
  const snapshot = readLocalProgress();

  const response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation SyncProgress($input: SyncProgressInput!) {
          syncProgress(input: $input) {
            courseSlug
            chapterSlug
            state
            completedAt
            updatedAt
          }
        }
      `,
      variables: {
        input: snapshot,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('No se pudo sincronizar el progreso.');
  }

  return response.json();
}
```

- [ ] **Step 3: Add UX**

After OAuth callback:

```text
"Tu progreso local está listo para sincronizarse."
Button: "Sincronizar progreso"
Secondary: "Ahora no"
```

- [ ] **Step 4: Commit**

```bash
git add docs/auth-github-contract.md src/lib/progress/sync-progress.ts
git commit -m "feat: add progress sync contract"
```

---

## Phase 5: Account Page And Badges

### Task 8: Add Account Page Skeleton

**Files:**

- Create: `src/pages/account.astro`
- Test: `tests/account.spec.ts`

- [x] **Step 1: Write failing test**

```ts
import { test, expect } from '@playwright/test';

test('la página de cuenta explica el valor de GitHub', async ({ page }) => {
  await page.goto('/account');

  await expect(page.getByRole('heading', { name: 'Tu avance' })).toBeVisible();
  await expect(
    page.getByText('Progreso sincronizado con GitHub'),
  ).toBeVisible();
  await expect(page.getByText('Insignias')).toBeVisible();
});
```

- [x] **Step 2: Create static account page**

Create `src/pages/account.astro`:

```astro
---
import Layout from '@/layouts/Layout.astro';
---

<Layout
  title="Tu avance"
  description="Progreso, insignias y actividad de Jeresoft Academy."
>
  <main class="account-shell">
    <section>
      <p>Jeresoft Academy</p>
      <h1>Tu avance</h1>
      <p>
        Progreso sincronizado con GitHub, insignias y futuras verificaciones de
        ejercicios.
      </p>
    </section>

    <section aria-label="Insignias">
      <h2>Insignias</h2>
      <p>Las insignias aparecerán cuando completes bloques verificables.</p>
    </section>
  </main>
</Layout>
```

- [x] **Step 3: Run and commit**

```bash
pnpm check
pnpm test -- --grep "cuenta"
git add src/pages/account.astro tests/account.spec.ts
git commit -m "feat: add account progress page"
```

### Task 9: Define First Badge Rules

**Files:**

- Create: `docs/badges.md`

- [x] **Step 1: Create badge catalog**

Create `docs/badges.md`:

```md
# Badges

Badges recognize real learning milestones. They do not replace practice,
code review, or project work.

## Initial Badges

### algorithms-patterns-lineales

- Course: `algorithms`
- Chapters:
  - `two-pointers`
  - `sliding-window`
  - `stack-queues`
  - `binary-search`
- Requirement: all chapters completed.

### design-patterns-fundamentos

- Course: `design-patterns`
- Chapters:
  - `por-que-existen-los-patrones`
  - `builder`
  - `typestate`
- Requirement: all chapters completed.
```

- [x] **Step 2: Commit**

```bash
git add docs/badges.md
git commit -m "docs: define initial academy badges"
```

---

## Phase 6: Final Verification Gates

- [x] Run `pnpm check`.
- [x] Run `pnpm test`.
- [x] Run `git diff --check`.
- [x] Verify `/courses/algorithms/sliding-window/` still renders without requiring login.
- [x] Verify local progress persists after reload.
- [x] Verify GitHub prompt never says course access is blocked.
- [x] Verify `/account` explains GitHub identity as progress and badges.
- [x] Confirm no OAuth secret is committed.
- [x] Confirm new environment variables are documented only as names, not values.

## Open Decisions To Revisit Before Backend Work

- [ ] Choose hosted auth/session approach or custom Rust session implementation.
- [ ] Choose exact backend folder layout inside `academy-web`.
- [ ] Choose production database provider.
- [ ] Choose whether badges become public profile artifacts in the first backend release or later.
- [ ] Decide whether GitHub contribution verification reads public repo data or requires a GitHub App.

## Current Recommendation

Start with Phase 1 and Phase 2 only. They improve the student experience now, keep the site static, respect the open-course principle, and create the UI language for GitHub identity without forcing backend decisions too early.
