# Sliding Window Model Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `Algorithms / Sliding Window` into the first complete Jeresoft Academy model chapter: clear narrative, interactive lab, Rust code walkthrough, practice loop, and reusable structure for future chapters.

**Architecture:** Keep the existing Astro route as the chapter shell, but move Sliding Window-specific richness into focused data and components. The page remains publicly readable, keeps the left course path / middle content / right chapter rail pattern, and uses Vue only where interaction is necessary.

**Tech Stack:** Astro, Vue, TypeScript, Playwright, existing academy CSS variables, `rust-algorithms` as source material.

---

## Product Direction

The model chapter should teach a student how to think, not just how to copy a pattern.

Sliding Window becomes the canonical format for future chapters:

1. Why this pattern exists.
2. What problem shape it solves.
3. Which invariant makes it work.
4. How the window moves.
5. How the Rust implementation encodes the idea.
6. Which mistakes break correctness.
7. How to practice with increasing difficulty.

The page must not imply the course is complete. It should feel like a finished chapter inside a living academy.

## Source Material

Use these existing sources:

- `repos/rust-algorithms/src/patterns/sliding_window.rs`
- `repos/rust-algorithms/tests/sliding_window_test.rs`
- `repos/rust-algorithms/notes/week-04-05.md`
- `repos/rust-algorithms/notes/repetitions/minimum-window-substring-2026-07-12.md`
- `repos/academy-web/src/data/lessons.ts`
- `repos/academy-web/src/pages/courses/[slug]/[chapter].astro`

## File Structure

- Create: `src/data/lessons/sliding-window.ts`
  - Owns the complete model chapter content for Sliding Window.
  - Exports one `slidingWindowLesson` object.
- Modify: `src/data/lessons.ts`
  - Re-exports `slidingWindowLesson` through the existing `lessons` map.
  - Keeps the existing `lessons` export shape stable for the Astro route.
- Create: `src/components/lesson/WindowSimulator.vue`
  - Interactive window movement for `length_of_longest_substring`.
  - Shows `left`, `right`, current character, active window, and best length.
- Create: `src/components/lesson/CodeWalkthrough.astro`
  - Renders explanation rows for important Rust code lines.
- Create: `src/components/lesson/PracticeLadder.astro`
  - Renders practice problems grouped by recognition goal.
- Modify: `src/pages/courses/[slug]/[chapter].astro`
  - Adds sections for objective, worked example, simulator, invariants, code walkthrough, variants, and practice ladder.
  - Keeps existing progress/GitHub controls.
- Create: `tests/sliding-window-chapter.spec.ts`
  - Covers the model chapter structure and simulator behavior.
- Modify: `tests/home.spec.ts`
  - Keep existing broad smoke tests; avoid duplicating model chapter assertions there.

## Phase 1: Establish The Model Chapter Contract

### Task 1: Add Focused Tests For The Model Chapter

**Files:**

- Create: `tests/sliding-window-chapter.spec.ts`

- [ ] **Step 1: Write the failing structure test**

Create `tests/sliding-window-chapter.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('Sliding Window muestra la estructura de capítulo modelo', async ({
  page,
}) => {
  await page.goto('/courses/algorithms/sliding-window/');

  const lesson = page.getByRole('main', { name: 'Contenido del capítulo' });

  await expect(
    lesson.getByRole('heading', {
      name: 'Sliding Window: pensar en ventanas, no en ciclos',
    }),
  ).toBeVisible();
  await expect(lesson.getByText('Pregunta guía')).toBeVisible();
  await expect(lesson.getByText('Ejemplo trabajado')).toBeVisible();
  await expect(lesson.getByText('Invariantes')).toBeVisible();
  await expect(lesson.getByText('Simulador de ventana')).toBeVisible();
  await expect(lesson.getByText('Lectura del código Rust')).toBeVisible();
  await expect(lesson.getByText('Escalera de práctica')).toBeVisible();
});
```

- [ ] **Step 2: Write the failing simulator test**

Extend `tests/sliding-window-chapter.spec.ts`:

```ts
test('el simulador avanza la ventana y permite reiniciar', async ({ page }) => {
  await page.goto('/courses/algorithms/sliding-window/');

  const simulator = page.getByRole('region', {
    name: 'Simulador de ventana',
  });

  await expect(simulator.getByText('right = 0')).toBeVisible();
  await expect(simulator.getByText('best = 1')).toBeVisible();

  await simulator.getByRole('button', { name: 'Siguiente' }).click();
  await expect(simulator.getByText('right = 1')).toBeVisible();
  await expect(simulator.getByText('ventana = ab')).toBeVisible();

  await simulator.getByRole('button', { name: 'Reiniciar' }).click();
  await expect(simulator.getByText('right = 0')).toBeVisible();
});
```

- [ ] **Step 3: Run focused test and verify failure**

Run:

```bash
pnpm exec playwright test tests/sliding-window-chapter.spec.ts
```

Expected: FAIL because the model sections and simulator do not exist yet.

- [ ] **Step 4: Commit the failing-test intent after implementation, not now**

Do not commit a failing test to `main`. Keep it local until Tasks 2-5 make it pass.

## Phase 2: Move Sliding Window Content Into A Focused Module

### Task 2: Extract Sliding Window Lesson Data

**Files:**

- Create: `src/data/lessons/sliding-window.ts`
- Modify: `src/data/lessons.ts`

- [ ] **Step 1: Create the lesson module**

Create `src/data/lessons/sliding-window.ts`:

```ts
export const slidingWindowLesson = {
  courseSlug: 'algorithms',
  slug: 'sliding-window',
  number: '05',
  status: 'Capítulo modelo · código disponible',
  title: 'Sliding Window: pensar en ventanas, no en ciclos',
  subtitle:
    'De fuerza bruta a recorrido lineal usando estado, límites e invariantes.',
  repoUrl:
    'https://github.com/jeresoftx/rust-algorithms/blob/main/src/patterns/sliding_window.rs',
  repoLabel: 'Ver código en rust-algorithms',
  framing: {
    label: 'La idea en una frase',
    text: 'Una ventana es un rango contiguo que aprende a crecer, contraerse y conservar solo el estado necesario para decidir.',
  },
  guidingQuestion:
    '¿Puedo actualizar la respuesta moviendo los límites de un rango contiguo, sin recalcular todos los rangos posibles?',
  concept:
    'Sliding Window sirve cuando el problema pregunta por la mejor subcadena o subarreglo contiguo bajo una condición que puede actualizarse de forma incremental.',
  problem:
    'La fuerza bruta recalcula cada rango desde cero. El patrón evita ese desperdicio manteniendo estado vivo mientras los límites avanzan.',
  mantra: 'expandir → validar → contraer',
  workedExample: {
    title: 'Longest Substring Without Repeating Characters',
    input: 'abcabcbb',
    goal: 'Encontrar la longitud de la subcadena contigua más larga sin caracteres repetidos.',
    insight:
      'Cuando aparece un carácter repetido dentro de la ventana, `left` salta después de su aparición anterior. La ventana nunca retrocede.',
    result: 'La mejor ventana mide 3: `abc`, `bca` o `cab`.',
  },
  invariants: [
    '`left` nunca se mueve hacia atrás.',
    '`right` avanza una sola vez por carácter.',
    '`last_seen` recuerda la última posición conocida de cada carácter.',
    '`best` solo se actualiza después de restaurar una ventana válida.',
  ],
  visual: {
    heading: 'Simulador de ventana',
    description:
      'Avanza carácter por carácter para ver cómo `left`, `right`, la ventana activa y `best` cambian sin volver a probar todos los rangos.',
    sample: 'abcabcbb',
    left: 0,
    right: 0,
    answer: 'best = 1',
  },
  patternSteps: [
    'Expandir `right` para incluir nueva señal.',
    'Actualizar el estado mínimo: conteos, suma, conjunto o deque.',
    'Contraer `left` mientras la ventana viole la condición.',
    'Registrar la mejor respuesta solo cuando la ventana representa una solución válida.',
  ],
  codeSnippet: `pub fn length_of_longest_substring(text: &str) -> usize {
    let mut last_seen = HashMap::new();
    let mut left = 0;
    let mut best = 0;

    for (right, character) in text.chars().enumerate() {
        if let Some(&previous_index) = last_seen.get(&character) {
            left = left.max(previous_index + 1);
        }

        last_seen.insert(character, right);
        best = best.max(right - left + 1);
    }

    best
}`,
  codeWalkthrough: [
    {
      code: 'let mut last_seen = HashMap::new();',
      explanation:
        'El mapa guarda la última posición vista para decidir si un carácter repetido todavía pertenece a la ventana actual.',
    },
    {
      code: 'left = left.max(previous_index + 1);',
      explanation:
        '`max` impide que `left` retroceda cuando el repetido pertenece a una ventana anterior.',
    },
    {
      code: 'best = best.max(right - left + 1);',
      explanation:
        'La respuesta se actualiza después de que la ventana vuelve a ser válida.',
    },
  ],
  variants: [
    {
      name: 'Ventana de decisión',
      functionName: 'max_profit',
      idea: 'Mantener el mejor punto de compra visto hasta hoy.',
    },
    {
      name: 'Ventana variable sin repetidos',
      functionName: 'length_of_longest_substring',
      idea: 'Mover `left` cuando el nuevo carácter rompe unicidad.',
    },
    {
      name: 'Ventana mínima con conteos',
      functionName: 'min_window',
      idea: 'Expandir hasta cubrir y contraer mientras la ventana siga siendo válida.',
    },
  ],
  mistakes: [
    'Contraer la ventana antes de que sea inválida.',
    'Actualizar `left` hacia atrás al encontrar un carácter repetido fuera de la ventana actual.',
    'Olvidar que una ventana mínima con conteos necesita multiplicidad, no solo presencia.',
    'Confundir ventana fija, ventana variable y deque monotónica como si fueran el mismo patrón.',
  ],
  practice: [
    {
      title: 'Reconocer ventana variable',
      problems: ['Longest Substring Without Repeating Characters'],
      checkpoint:
        'Explica por qué `left` debe usar `max` antes de mirar la solución.',
    },
    {
      title: 'Trabajar con conteos',
      problems: ['Minimum Window Substring', 'Permutation in String'],
      checkpoint:
        'Describe qué significa que `missing == 0` y cuándo vuelve a faltar un carácter.',
    },
    {
      title: 'Separar familias cercanas',
      problems: ['Sliding Window Maximum'],
      checkpoint:
        'Identifica por qué este caso necesita deque monotónica, no solo dos índices.',
    },
  ],
  closing:
    'El criterio clave no es memorizar dos índices: es reconocer si la condición de validez puede mantenerse al mover límites sin recomputar todo.',
} as const;
```

- [ ] **Step 2: Re-export the lesson from the existing map**

Replace `src/data/lessons.ts` with:

```ts
import { slidingWindowLesson } from './lessons/sliding-window';

export const lessons = {
  'algorithms/sliding-window': slidingWindowLesson,
} as const;
```

- [ ] **Step 3: Run type check**

Run:

```bash
pnpm check
```

Expected: PASS or type errors only where the page assumes old field shapes. Fix those in Task 5, not by weakening the lesson data.

## Phase 3: Build The Interactive Window Simulator

### Task 3: Add `WindowSimulator.vue`

**Files:**

- Create: `src/components/lesson/WindowSimulator.vue`

- [ ] **Step 1: Create the simulator component**

Create `src/components/lesson/WindowSimulator.vue`:

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';

const sample = 'abcabcbb';

const steps = [
  { left: 0, right: 0, best: 1, note: 'La ventana inicia con a.' },
  { left: 0, right: 1, best: 2, note: 'b no repite; la ventana crece.' },
  { left: 0, right: 2, best: 3, note: 'abc es válida y best llega a 3.' },
  {
    left: 1,
    right: 3,
    best: 3,
    note: 'a repite; left salta después de la a anterior.',
  },
  {
    left: 2,
    right: 4,
    best: 3,
    note: 'b repite dentro de la ventana; se conserva best.',
  },
  {
    left: 3,
    right: 5,
    best: 3,
    note: 'c repite; la ventana válida vuelve a medir 3.',
  },
  { left: 5, right: 6, best: 3, note: 'b obliga a saltar left a 5.' },
  { left: 7, right: 7, best: 3, note: 'El último b deja una ventana de 1.' },
];

const stepIndex = ref(0);
const current = computed(() => steps[stepIndex.value]);
const characters = computed(() => Array.from(sample));
const activeWindow = computed(() =>
  sample.slice(current.value.left, current.value.right + 1),
);

function nextStep() {
  stepIndex.value = Math.min(stepIndex.value + 1, steps.length - 1);
}

function reset() {
  stepIndex.value = 0;
}
</script>

<template>
  <section class="window-simulator" aria-label="Simulador de ventana">
    <div class="simulator-copy">
      <p class="eyebrow">Simulador de ventana</p>
      <h2>Una ventana que aprende a moverse.</h2>
      <p>
        El rango activo siempre es contiguo. Cuando aparece un repetido dentro
        de la ventana, el límite izquierdo salta lo justo para recuperar
        validez.
      </p>
    </div>

    <div class="simulator-board">
      <div class="cells" aria-label="Caracteres del ejemplo">
        <span
          v-for="(character, index) in characters"
          :key="`${character}-${index}`"
          class="cell"
          :class="{
            'is-active': index >= current.left && index <= current.right,
            'is-left': index === current.left,
            'is-right': index === current.right,
          }"
        >
          {{ character }}
        </span>
      </div>

      <dl class="state-grid">
        <div>
          <dt>left</dt>
          <dd>left = {{ current.left }}</dd>
        </div>
        <div>
          <dt>right</dt>
          <dd>right = {{ current.right }}</dd>
        </div>
        <div>
          <dt>ventana</dt>
          <dd>ventana = {{ activeWindow }}</dd>
        </div>
        <div>
          <dt>best</dt>
          <dd>best = {{ current.best }}</dd>
        </div>
      </dl>

      <p class="note">{{ current.note }}</p>

      <div class="actions">
        <button type="button" @click="nextStep">Siguiente</button>
        <button type="button" @click="reset">Reiniciar</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.window-simulator {
  display: grid;
  grid-template-columns: minmax(240px, 0.75fr) minmax(0, 1.25fr);
  gap: 18px;
  margin-top: 22px;
}

.simulator-copy,
.simulator-board {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  padding: 24px;
}

.eyebrow,
.state-grid {
  font-family:
    SFMono-Regular,
    Cascadia Code,
    JetBrains Mono,
    ui-monospace,
    monospace;
  letter-spacing: 0;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--academy-gold);
  font-size: 12px;
  font-weight: 820;
  text-transform: uppercase;
}

h2,
p,
dl {
  margin: 0;
}

h2 {
  margin-bottom: 14px;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1;
}

p,
dd {
  color: var(--academy-readable-muted);
  line-height: 1.58;
}

.cells {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 8px;
}

.cell {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--background);
  color: var(--academy-readable-muted);
  font-size: clamp(22px, 4vw, 38px);
  font-weight: 860;
}

.cell.is-active {
  border-color: color-mix(in srgb, var(--academy-gold) 76%, transparent);
  background: color-mix(in srgb, var(--academy-gold) 22%, var(--card));
  color: var(--foreground);
}

.cell.is-left,
.cell.is-right {
  box-shadow: 0 0 0 2px var(--academy-gold);
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.state-grid div {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
}

dt {
  color: var(--academy-gold);
  font-size: 11px;
  font-weight: 820;
  text-transform: uppercase;
}

dd {
  margin: 6px 0 0;
  font-size: 12px;
  font-weight: 760;
}

.note {
  margin-top: 18px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

button {
  min-height: 40px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--academy-gold) 18%, var(--card));
  color: var(--foreground);
  padding: 0 14px;
  font-weight: 780;
  cursor: pointer;
}

button:hover {
  border-color: color-mix(in srgb, var(--academy-gold) 64%, transparent);
}

@media (max-width: 860px) {
  .window-simulator,
  .state-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

- [ ] **Step 2: Run Vue type check through Astro**

Run:

```bash
pnpm check
```

Expected: PASS once Task 5 mounts the component, or no component-local errors if Task 5 has not been applied yet.

## Phase 4: Add Reusable Chapter Blocks

### Task 4: Add Code Walkthrough And Practice Ladder Components

**Files:**

- Create: `src/components/lesson/CodeWalkthrough.astro`
- Create: `src/components/lesson/PracticeLadder.astro`

- [ ] **Step 1: Create `CodeWalkthrough.astro`**

Create `src/components/lesson/CodeWalkthrough.astro`:

```astro
---
type WalkthroughItem = {
  code: string;
  explanation: string;
};

interface Props {
  items: readonly WalkthroughItem[];
}

const { items } = Astro.props;
---

<section
  id="lectura-codigo"
  class="code-walkthrough"
  aria-label="Lectura del código Rust"
>
  <div>
    <p class="system-line">Lectura del código Rust</p>
    <h2>Las líneas donde vive el criterio.</h2>
  </div>

  <ol>
    {
      items.map((item, index) => (
        <li>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <code>{item.code}</code>
          <p>{item.explanation}</p>
        </li>
      ))
    }
  </ol>
</section>

<style>
  .code-walkthrough {
    display: grid;
    gap: 18px;
    margin-top: 22px;
  }

  .code-walkthrough ol {
    display: grid;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .code-walkthrough li {
    display: grid;
    grid-template-columns: 42px minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 14px;
    align-items: start;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    padding: 16px;
  }

  .code-walkthrough span,
  .code-walkthrough code,
  .system-line {
    font-family:
      SFMono-Regular,
      Cascadia Code,
      JetBrains Mono,
      ui-monospace,
      monospace;
    letter-spacing: 0;
  }

  .code-walkthrough span,
  .system-line {
    color: var(--academy-gold);
    font-size: 12px;
    font-weight: 820;
    text-transform: uppercase;
  }

  .code-walkthrough code {
    color: var(--foreground);
    overflow-wrap: anywhere;
  }

  .code-walkthrough p {
    margin: 0;
    color: var(--academy-readable-muted);
    line-height: 1.58;
  }

  .code-walkthrough h2 {
    margin: 10px 0 0;
    font-size: clamp(30px, 4vw, 48px);
    line-height: 1;
  }

  @media (max-width: 860px) {
    .code-walkthrough li {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create `PracticeLadder.astro`**

Create `src/components/lesson/PracticeLadder.astro`:

```astro
---
type PracticeGroup = {
  title: string;
  problems: readonly string[];
  checkpoint: string;
};

interface Props {
  groups: readonly PracticeGroup[];
}

const { groups } = Astro.props;
---

<section
  id="practica"
  class="practice-ladder"
  aria-label="Escalera de práctica"
>
  <div>
    <p class="system-line">Escalera de práctica</p>
    <h2>Practicar por intención, no por lista.</h2>
  </div>

  <div class="practice-groups">
    {
      groups.map((group) => (
        <article>
          <h3>{group.title}</h3>
          <ul>
            {group.problems.map((problem) => (
              <li>{problem}</li>
            ))}
          </ul>
          <p>{group.checkpoint}</p>
        </article>
      ))
    }
  </div>
</section>

<style>
  .practice-ladder {
    margin-top: 22px;
  }

  .practice-groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 18px;
  }

  .practice-groups article {
    display: grid;
    gap: 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    padding: 20px;
  }

  .system-line {
    margin: 0;
    color: var(--academy-gold);
    font-family:
      SFMono-Regular,
      Cascadia Code,
      JetBrains Mono,
      ui-monospace,
      monospace;
    font-size: 12px;
    font-weight: 820;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  h2,
  h3,
  p,
  ul {
    margin: 0;
  }

  h2 {
    margin-top: 10px;
    font-size: clamp(30px, 4vw, 48px);
    line-height: 1;
  }

  h3 {
    color: var(--foreground);
    font-size: 20px;
    line-height: 1.1;
  }

  ul {
    display: grid;
    gap: 10px;
    padding: 0;
    list-style: none;
  }

  li,
  p {
    color: var(--academy-readable-muted);
    line-height: 1.58;
  }

  li {
    border-top: 1px solid var(--border);
    padding-top: 10px;
  }

  @media (max-width: 980px) {
    .practice-groups {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: Run type check**

Run:

```bash
pnpm check
```

Expected: PASS after Task 5 wires props with matching shapes.

## Phase 5: Compose The Model Chapter Page

### Task 5: Wire New Data And Components Into The Chapter Route

**Files:**

- Modify: `src/pages/courses/[slug]/[chapter].astro`
- Modify: `tests/sliding-window-chapter.spec.ts`

- [ ] **Step 1: Import new components**

Add these imports to `src/pages/courses/[slug]/[chapter].astro`:

```astro
import CodeWalkthrough from '@/components/lesson/CodeWalkthrough.astro'; import
PracticeLadder from '@/components/lesson/PracticeLadder.astro'; import
WindowSimulator from '@/components/lesson/WindowSimulator.vue';
```

- [ ] **Step 2: Update chapter sections**

Replace the `chapterSections` array with:

```ts
const chapterSections = [
  { href: '#idea', label: 'Idea' },
  { href: '#pregunta', label: 'Pregunta guía' },
  { href: '#concepto', label: 'Concepto' },
  { href: '#ejemplo', label: 'Ejemplo trabajado' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#invariantes', label: 'Invariantes' },
  { href: '#codigo', label: 'Código Rust' },
  { href: '#lectura-codigo', label: 'Lectura' },
  { href: '#practica', label: 'Práctica' },
];
```

- [ ] **Step 3: Add the guiding question section**

Insert after the `#idea` section:

```astro
<section id="pregunta" class="lesson-section question-section">
  <p class="system-line">Pregunta guía</p>
  <h2>Antes de escribir código, decide si hay ventana.</h2>
  <p>{lesson.guidingQuestion}</p>
</section>
```

- [ ] **Step 4: Add the worked example section**

Insert after the `#concepto` section:

```astro
<section id="ejemplo" class="lesson-section worked-example">
  <div>
    <p class="system-line">Ejemplo trabajado</p>
    <h2>{lesson.workedExample.title}</h2>
    <p>{lesson.workedExample.goal}</p>
  </div>
  <dl>
    <div>
      <dt>Entrada</dt>
      <dd>{lesson.workedExample.input}</dd>
    </div>
    <div>
      <dt>Idea</dt>
      <dd>{lesson.workedExample.insight}</dd>
    </div>
    <div>
      <dt>Resultado</dt>
      <dd>{lesson.workedExample.result}</dd>
    </div>
  </dl>
</section>
```

- [ ] **Step 5: Replace static lab with interactive simulator**

Replace the existing `#laboratorio` section with:

```astro
<section id="simulador" class="lesson-section simulator-anchor">
  <WindowSimulator client:load />
</section>
```

- [ ] **Step 6: Add the invariants section**

Insert before `#patron`:

```astro
<section id="invariantes" class="lesson-section invariants-section">
  <div>
    <p class="system-line">Invariantes</p>
    <h2>Lo que debe seguir siendo verdad.</h2>
  </div>
  <ul>
    {lesson.invariants.map((invariant) => <li>{invariant}</li>)}
  </ul>
</section>
```

- [ ] **Step 7: Add code walkthrough and practice ladder**

Insert `<CodeWalkthrough items={lesson.codeWalkthrough} />` after the existing code block.

Replace the current `#practica` section with:

```astro
<PracticeLadder groups={lesson.practice} />
```

- [ ] **Step 8: Add styles for new sections**

Add these styles inside the existing `<style>` block:

```css
.question-section,
.worked-example,
.invariants-section {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  padding: 24px;
}

.question-section p:last-child,
.worked-example p,
.worked-example dd,
.invariants-section li {
  color: var(--academy-readable-muted);
  line-height: 1.58;
}

.worked-example {
  display: grid;
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.2fr);
  gap: 18px;
}

.worked-example dl,
.invariants-section ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.worked-example div,
.invariants-section li {
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.worked-example dt {
  color: var(--academy-gold);
  font-size: 12px;
  font-weight: 820;
  text-transform: uppercase;
}

.worked-example dd {
  margin: 6px 0 0;
}

.simulator-anchor {
  scroll-margin-top: 92px;
}
```

Also extend the existing responsive grid rule:

```css
.worked-example {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 9: Update old home test expectation**

In `tests/home.spec.ts`, replace:

```ts
lessonContent.getByRole('heading', { name: 'Laboratorio visual' });
```

with:

```ts
lessonContent.getByRole('heading', {
  name: 'Una ventana que aprende a moverse.',
});
```

- [ ] **Step 10: Run focused tests**

Run:

```bash
pnpm exec playwright test tests/sliding-window-chapter.spec.ts tests/home.spec.ts --grep "Sliding Window|capítulo modelo|simulador"
```

Expected: PASS.

- [ ] **Step 11: Run type check**

Run:

```bash
pnpm check
```

Expected: PASS.

- [ ] **Step 12: Commit**

```bash
git add src/data/lessons.ts src/data/lessons/sliding-window.ts src/components/lesson/WindowSimulator.vue src/components/lesson/CodeWalkthrough.astro src/components/lesson/PracticeLadder.astro 'src/pages/courses/[slug]/[chapter].astro' tests/sliding-window-chapter.spec.ts tests/home.spec.ts
git commit -m "feat: make sliding window the model chapter"
```

## Phase 6: Final Verification

### Task 6: Verify The Chapter As A Reusable Template

**Files:**

- Modify: `docs/superpowers/plans/2026-07-14-sliding-window-model-chapter.md`

- [ ] **Step 1: Run all checks**

Run commands in this order:

```bash
pnpm check
pnpm test
git diff --check
```

Expected:

- `pnpm check`: 0 errors.
- `pnpm test`: all Playwright tests pass.
- `git diff --check`: no output.

- [ ] **Step 2: Manual browser review**

Open `/courses/algorithms/sliding-window/` and verify:

- The left rail still shows the course path.
- The middle column reads like a complete chapter.
- The right rail still shows anchors, status, progress button, and GitHub prompt.
- The simulator buttons work in dark and light themes.
- Mobile layout does not overlap text or controls.

- [ ] **Step 3: Record verification in this plan**

Update this section after running checks:

```md
## Verification Result

- `pnpm check`: PASS
- `pnpm test`: PASS
- `git diff --check`: PASS
- Manual browser review: PASS
```

- [ ] **Step 4: Commit verification**

```bash
git add docs/superpowers/plans/2026-07-14-sliding-window-model-chapter.md
git commit -m "docs: record sliding window model verification"
```

- [ ] **Step 5: Push main after human-approved execution**

```bash
git push origin main
```

## Self-Review

- Spec coverage: The plan covers content extraction, interactive lab, Rust walkthrough, practice ladder, tests, verification, and commit cadence.
- Ambiguity scan: All implementation steps name concrete files, commands, and expected results.
- Type consistency: New fields referenced by the route are defined in `slidingWindowLesson`.
- Scope check: This plan is limited to one model chapter and reusable local components; it does not add backend, accounts, video, or new course pages.
