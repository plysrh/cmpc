import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
  test('should display 404 page for invalid route', async ({ page }) => {
    await page.goto('/invalid-route');

    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Página no encontrada')).toBeVisible();
    await expect(page.getByText('La página que buscas no existe')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/invalid-route');

    await page.getByRole('link', { name: /volver al inicio/i }).click();
    await expect(page).toHaveURL('/login');
  });
});
