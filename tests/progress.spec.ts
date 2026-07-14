import { expect, test } from '@playwright/test';

test('un capítulo puede marcarse como completado localmente sin cuenta', async ({
  page,
}) => {
  await page.goto('/courses/algorithms/sliding-window/');

  await page.getByRole('button', { name: 'Marcar como completado' }).click();

  await expect(page.getByRole('button', { name: 'Completado' })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('button', { name: 'Completado' })).toBeVisible();
});

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
