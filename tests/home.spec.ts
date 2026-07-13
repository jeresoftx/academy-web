import { test, expect } from '@playwright/test';

test('la home carga y muestra "El camino"', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('El camino')).toBeVisible();
});

test('el selector de tema alterna la clase dark', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');

  await page.getByRole('button', { name: 'Oscuro' }).click();
  await expect(html).toHaveClass(/dark/);

  await page.getByRole('button', { name: 'Claro' }).click();
  await expect(html).not.toHaveClass(/dark/);
});
