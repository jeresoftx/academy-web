import { test, expect } from '@playwright/test';

test('la home carga la primera version publicable', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'Aprende a fondo. Construye como profesional.',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /rust-algorithms/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /rust-design-patterns/ }),
  ).toBeVisible();
  await expect(page.getByText('Laboratorios web')).toBeVisible();
});

test('la home enlaza a la ruta de Algorithms', async ({ page }) => {
  await page.goto('/');

  await page
    .getByRole('link', { name: /Ver ruta del curso/ })
    .first()
    .click();

  await expect(page).toHaveURL(/\/courses\/algorithms\/?$/);
  await expect(
    page.getByRole('heading', { name: 'Algoritmos', exact: true }),
  ).toBeVisible();
});

test('la home enlaza a la ruta de Patrones de diseño', async ({ page }) => {
  await page.goto('/');

  await page
    .getByRole('link', { name: /Ver ruta del curso/ })
    .nth(1)
    .click();

  await expect(page).toHaveURL(/\/courses\/design-patterns\/?$/);
  await expect(
    page.getByRole('heading', { name: 'Patrones de diseño', exact: true }),
  ).toBeVisible();
});

test('la página de Algorithms carga sus assets publicados', async ({
  page,
}) => {
  const missingAssets: string[] = [];
  page.on('response', (response) => {
    const url = response.url();
    if (
      url.includes('/assets/illustrations/courses/algorithms/') &&
      response.status() >= 400
    ) {
      missingAssets.push(url);
    }
  });

  await page.goto('/courses/algorithms/');

  await expect(page.getByText('Primeros capítulos')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Abrir en GitHub' }),
  ).toBeVisible();
  expect(missingAssets).toEqual([]);
});

test('la página de Algorithms muestra el mapa completo del curso', async ({
  page,
}) => {
  await page.goto('/courses/algorithms/');

  const courseMap = page.getByRole('region', { name: 'Mapa del curso' });

  await expect(
    courseMap.getByRole('heading', { name: 'Mapa del curso' }),
  ).toBeVisible();
  await expect(courseMap.getByText('Fundamentos de criterio')).toBeVisible();
  await expect(courseMap.getByText('Patrones lineales')).toBeVisible();
  await expect(courseMap.getByText('Estructuras y recorridos')).toBeVisible();
  await expect(courseMap.getByText('Algoritmos avanzados')).toBeVisible();
  await expect(courseMap.getByText('Ordenamiento')).toBeVisible();
  await expect(courseMap.getByText('MST y Tarjan')).toBeVisible();
  await expect(courseMap.getByText('Geometría computacional')).toBeVisible();
  await expect(
    courseMap.getByText('23 capítulos visibles desde la primera versión.'),
  ).toBeVisible();
});

test('la página de Sliding Window muestra el diseño editorial del capítulo', async ({
  page,
}) => {
  await page.goto('/courses/algorithms/sliding-window/');

  const coursePath = page.getByRole('navigation', {
    name: 'Camino del curso',
  });
  const lessonContent = page.getByRole('main', {
    name: 'Contenido del capítulo',
  });
  const chapterAside = page.getByRole('navigation', {
    name: 'En este capítulo',
  });
  const currentChapter = coursePath.getByRole('link', {
    name: /05\s+Sliding window/,
  });

  await expect(coursePath.getByText('S1 · Algoritmos')).toBeVisible();
  await expect(currentChapter).toBeVisible();
  await expect(currentChapter).toContainText('Código disponible');
  await expect(
    lessonContent.getByRole('heading', {
      name: 'Sliding Window: pensar en ventanas, no en ciclos',
    }),
  ).toBeVisible();
  await expect(lessonContent.getByText('La idea en una frase')).toBeVisible();
  await expect(
    lessonContent.getByText('expandir → validar → contraer'),
  ).toBeVisible();
  await expect(
    lessonContent.getByRole('heading', { name: 'Laboratorio visual' }),
  ).toBeVisible();
  await expect(
    lessonContent.getByText('Longest Substring Without Repeating Characters'),
  ).toBeVisible();
  await expect(chapterAside.getByText('En este capítulo')).toBeVisible();
  await expect(
    chapterAside.getByRole('link', { name: 'Idea' }),
  ).toHaveAttribute('href', '#idea');
  await expect(
    chapterAside.getByRole('link', { name: 'Código Rust' }),
  ).toHaveAttribute('href', '#codigo');
  await expect(
    lessonContent.getByRole('link', { name: 'Ver código en rust-algorithms' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/jeresoftx/rust-algorithms/blob/main/src/patterns/sliding_window.rs',
  );
});

test('la página de Patrones de diseño carga sus assets publicados', async ({
  page,
}) => {
  const missingAssets: string[] = [];
  page.on('response', (response) => {
    const url = response.url();
    if (
      url.includes('/assets/illustrations/courses/design-patterns/') &&
      response.status() >= 400
    ) {
      missingAssets.push(url);
    }
  });

  await page.goto('/courses/design-patterns/');

  await expect(page.getByText('Primeros capítulos')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Abrir en GitHub' }),
  ).toBeVisible();
  expect(missingAssets).toEqual([]);
});

test('el footer muestra redes, licencias y gobernanza', async ({ page }) => {
  await page.goto('/');

  const footer = page.getByRole('contentinfo');

  await expect(footer.getByRole('link', { name: /YouTube/ })).toHaveAttribute(
    'href',
    'https://www.youtube.com/@jeresoft',
  );
  await expect(footer.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/jeresoft',
  );
  await expect(
    footer.getByRole('link', { name: /X \/ Twitter/ }),
  ).toHaveAttribute('href', 'https://x.com/jeresoft');
  await expect(footer.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/jeresoftx',
  );
  await expect(footer.getByText('MIT / Apache-2.0')).toBeVisible();
  await expect(footer.getByText('CC BY-SA 4.0')).toBeVisible();
  await expect(
    footer.getByText('La IA acelera; el criterio humano decide.'),
  ).toBeVisible();
});

test('el selector de tema alterna la clase dark', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');

  await page.getByRole('button', { name: 'Oscuro' }).click();
  await expect(html).toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Claro' }).click();
  await expect(html).not.toHaveClass(/dark/);
});
