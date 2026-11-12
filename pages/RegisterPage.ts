import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { RegisterUser } from '../data/register.data';

/**
 * Page Object de la página de registro (/auth/register).
 *
 * Prioridad de locators: getByLabel (campos del formulario) > getByTestId (data-test)
 * > getByRole. No se usan XPath ni selectores CSS encadenados.
 */
export class RegisterPage extends BasePage {
  protected readonly path = '/auth/register';

  /**
   * El formulario solo se muestra navegando desde el home
   * (Sign in → Register), por lo que no se entra directo por URL.
   */
  override async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.getByTestId('nav-sign-in').click();
    await expect(this.page).toHaveURL(/\/auth\/login$/);
    await this.page.getByTestId('register-link').click();
  }

  /**
   * Completa el formulario. Street, city y state se autocompletan
   * al seleccionar el país, por lo que no se llenan manualmente.
   */
  async fillForm(user: RegisterUser, country: string, postalCode: string, houseNumber: string): Promise<void> {
    await this.page.getByLabel('First name').fill(user.firstName);
    await this.page.getByLabel('Last name').fill(user.lastName);
    await this.page.getByLabel('Date of Birth').fill(user.dob);
    await this.page.getByLabel('Country').selectOption(country);
    await this.page.getByLabel('Postal code').fill(postalCode);
    await this.page.getByLabel('House number').fill(houseNumber);
    await this.page.getByLabel('Phone').fill(user.phone);
    await this.page.getByLabel('Email address').fill(user.email);
    await this.page.getByLabel('Password', { exact: true }).fill(user.password);
  }

  /** Verifica que street, city y state se autocompletaron tras elegir el país. */
  async expectAddressAutofilled(): Promise<void> {
    await expect(this.page.getByLabel('Street')).not.toHaveValue('');
    await expect(this.page.getByLabel('City')).not.toHaveValue('');
    await expect(this.page.getByLabel('State')).not.toHaveValue('');
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('register-submit').click();
  }
}
