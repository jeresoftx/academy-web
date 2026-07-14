import { expect, test } from '@playwright/test';

test('la página de cuenta explica el valor de GitHub', async ({ page }) => {
  await page.goto('/account');

  await expect(page.getByRole('heading', { name: 'Tu avance' })).toBeVisible();
  await expect(
    page.getByText('Progreso sincronizado con GitHub'),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Insignias' })).toBeVisible();
});
