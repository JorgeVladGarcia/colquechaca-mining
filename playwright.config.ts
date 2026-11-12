import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Carga variables de entorno desde .env (ver .env.example).
 */
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

const BASE_URL = process.env.BASE_URL ?? 'https://practicesoftwaretesting.com/';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Ejecuta los tests de cada archivo en paralelo */
  fullyParallel: true,
  /* Falla en CI si quedó un test.only en el código */
  forbidOnly: !!process.env.CI,
  /* Reintentos solo en CI */
  retries: process.env.CI ? 2 : 0,
  /* Un solo worker en CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporte HTML (no se abre automáticamente) */
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    /* Permite usar rutas relativas: await page.goto('/docs/intro') */
    baseURL: BASE_URL,

    /* Atributo usado por getByTestId(): la app marca sus elementos con data-test */
    testIdAttribute: 'data-test',

    /* Evidencias */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
