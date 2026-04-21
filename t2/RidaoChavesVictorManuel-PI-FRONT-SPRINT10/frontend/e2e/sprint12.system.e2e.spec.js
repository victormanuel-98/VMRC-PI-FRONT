import { expect, test } from '@playwright/test';
import { mockFitFoodApi, setAuthenticatedSession } from './support/mockApi.js';

test.describe('Sprint 12 - Pruebas de sistema E2E', () => {
  test('redirige a login cuando una ruta protegida no tiene sesion', async ({ page }) => {
    await mockFitFoodApi(page);

    await page.goto('/inicio');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: /Iniciar sesi[oó]n|Sign in/i })).toBeVisible();
  });

  test('registro y acceso al inicio', async ({ page }) => {
    await mockFitFoodApi(page);

    await page.goto('/registro');
    await page.locator('input[name="nombre"]').fill('QA');
    await page.locator('input[name="apellidos"]').fill('Automation');
    await page.locator('input[name="usuario"]').fill('qa_automation');
    await page.locator('input[name="contrasena"]').fill('QATest123!');
    await page.locator('input[name="email"]').fill('qa.automation@fitfood.test');
    await page.getByRole('button', { name: /Crear usuario|Create user/i }).click();

    await expect(page.getByText(/Cuenta creada correctamente|Account created successfully/i)).toBeVisible();
    await page.waitForURL(/\/login$/, { timeout: 8_000 });

    await page.locator('#usuario').fill('qa_automation');
    await page.locator('#contrasena').fill('QATest123!');
    await page.getByRole('button', { name: /Acceder|Access/i }).click();

    await expect(page).toHaveURL(/\/inicio$/);
    await expect(page.getByRole('heading', { name: /Bienvenidos a FitFood|Welcome to FitFood/i })).toBeVisible();
  });

  test('ajustes: idioma y tema persisten en localStorage', async ({ page }) => {
    await mockFitFoodApi(page);
    await setAuthenticatedSession(page);

    await page.goto('/ajustes');
    await page.getByRole('button', { name: /Ingl[eé]s|English/i }).click();
    await page.getByRole('button', { name: /Modo oscuro|Dark mode/i }).click();
    await page.getByRole('button', { name: /Guardar cambios|Save changes/i }).click();

    await expect(page.getByText(/Cambios guardados correctamente|Changes saved successfully/i)).toBeVisible();

    const saved = await page.evaluate(() => ({
      uiPreferences: window.localStorage.getItem('uiPreferences'),
      userSettings: window.localStorage.getItem('userSettings')
    }));

    expect(saved.uiPreferences).toContain('"language":"en"');
    expect(saved.uiPreferences).toContain('"theme":"dark"');
    expect(saved.userSettings).toContain('"idioma":"ingles"');
    expect(saved.userSettings).toContain('"iluminacion":"oscuro"');
  });

  test('contacto: envia mensaje y muestra confirmacion', async ({ page }) => {
    await mockFitFoodApi(page);
    await setAuthenticatedSession(page);

    await page.goto('/contacto');
    await page.locator('#asunto').fill('Consulta Sprint 12');
    await page.locator('#contenido').fill('Verificacion automatica de formulario de contacto.');
    await page.getByRole('button', { name: /Enviar mensaje|Send message/i }).click();

    await expect(page.getByText(/Mensaje enviado correctamente|Message sent successfully/i)).toBeVisible();
  });
});
