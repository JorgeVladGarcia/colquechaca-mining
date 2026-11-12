import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { registerData } from '../data/register.data';

/**
 * Page Object de la página de login (/auth/login).
 */
export class LoginPage extends BasePage {
  protected readonly path = '/auth/login';

  /** Confirma que la página de login está cargada. */
  async expectLoaded(): Promise<void> {
    await this.expectUrl(registerData.expectedLoginUrl);
    await expect(this.heading('Login')).toBeVisible();
  }

  /** Inicia sesión con el correo y la contraseña indicados. */
  async login(email: string, password: string): Promise<void> {
    await this.page.getByTestId('email').fill(email);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-submit').click();
  }

  /** Verifica que se muestra el mensaje de error de credenciales inválidas. */
  async expectLoginError(message: string): Promise<void> {
    await expect(this.page.getByTestId('login-error')).toBeVisible();
    await expect(this.page.getByTestId('login-error')).toContainText(message);
  }
}
