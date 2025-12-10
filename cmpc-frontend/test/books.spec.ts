import { test, expect } from '@playwright/test';

test.describe('Books Page', () => {
  test('should login and display books', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@cmpc.com');
    await page.getByLabel('Contraseña').fill('test123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    
    await page.waitForURL('/books', { timeout: 15000 });
    await expect(page.getByText('CMPC Libros')).toBeVisible();
  });
});
