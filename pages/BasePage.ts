import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Clase base de la que heredan todos los Page Objects.
 * Centraliza la navegación y las acciones/validaciones comunes.
 */
export abstract class BasePage {
  /** Ruta relativa al baseURL definido en playwright.config.ts */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async expectUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  protected heading(name: string | RegExp): Locator {
    return this.page.getByRole('heading', { name });
  }

  protected link(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name });
  }
}
