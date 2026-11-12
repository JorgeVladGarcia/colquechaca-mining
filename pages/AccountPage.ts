import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object de la cuenta del usuario (/account).
 */
export class AccountPage extends BasePage {
  protected readonly path = '/account';

  /** Confirma que el nombre del usuario aparece en el menú de cuenta (esquina superior derecha). */
  async expectLoggedInAs(fullName: string): Promise<void> {
    await expect(this.page.getByTestId('nav-menu')).toContainText(fullName);
  }

  /**
   * Confirma que el usuario NO tiene sesión: no llega a /account y el menú
   * sigue ofreciendo "Sign in" en lugar de la cuenta.
   */
  async expectNotLoggedIn(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/account$/);
    await expect(this.page.getByTestId('nav-sign-in')).toBeVisible();
  }
}
