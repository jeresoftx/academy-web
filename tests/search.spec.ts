import { expect, test } from '@playwright/test';

test('la búsqueda muestra resultados derivados del contenido canónico', async ({
  page,
}) => {
  await page.goto('/search/?q=sliding%20window');

  await expect(
    page.getByRole('heading', { name: 'Búsqueda en Jeresoft Academy' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: /Sliding Window: pensar en ventanas, no en ciclos/,
    }),
  ).toHaveAttribute('href', '/courses/algorithms/sliding-window/');
});

test('la búsqueda conserva la consulta visible sin ejecutar HTML', async ({
  page,
}) => {
  await page.goto('/search/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E%20grafos');

  await expect(page.getByText('alert(1) grafos')).toBeVisible();
  await expect(page.locator('script', { hasText: 'alert(1)' })).toHaveCount(0);
});
