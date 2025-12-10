import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('CMPC Libros')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('should redirect to login from root', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.route('**/v1/auth/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      });
    });

    await page.goto('/login');

    await page.getByLabel('Email').fill('wrong@cmpc.com');
    await page.getByLabel('Contraseña').fill('wrong');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page.getByText('Credenciales inválidas')).toBeVisible();
  });
});
