import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object del carrito (/checkout, al que se llega desde el icono del carrito).
 */
export class CartPage extends BasePage {
  protected readonly path = '/checkout';

  /** Fila del carrito para un producto, identificada por su nombre. */
  private row(name: string) {
    return this.page.getByRole('row').filter({ has: this.page.getByTestId('product-title').filter({ hasText: name }) });
  }

  /** Abre el carrito desde la barra de navegación. */
  async open(): Promise<void> {
    await this.page.getByTestId('nav-cart').click();
    await this.expectUrl(/\/checkout$/);
  }

  /** Valida nombre, cantidad y precio (unitario y de línea) de un producto en el carrito. */
  async expectItem(name: string, quantity: number, unitPrice: number): Promise<void> {
    const row = this.row(name);
    await expect(row.getByTestId('product-title')).toHaveText(name);
    await expect(row.getByRole('spinbutton', { name: `Quantity for ${name}` })).toHaveValue(String(quantity));
    await expect(row.getByTestId('product-price')).toContainText(unitPrice.toFixed(2));
    await expect(row.getByTestId('line-price')).toContainText((unitPrice * quantity).toFixed(2));
  }
}
