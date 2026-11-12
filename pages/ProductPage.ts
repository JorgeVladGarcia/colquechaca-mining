import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

/**
 * Page Object del detalle de producto (/product/<ID>).
 */
export class ProductPage extends BasePage {
  protected readonly path = '/product';

  /** Valida que el detalle muestra el nombre indicado y el precio unitario esperado. */
  async expectDetails(name: string, unitPrice: number): Promise<void> {
    await expect(this.page.getByTestId('product-name')).toContainText(name);
    await expect(this.page.getByTestId('unit-price')).toHaveText(unitPrice.toFixed(2));
  }

  /** Lee el precio unitario que muestra el detalle del producto. */
  async getUnitPrice(): Promise<number> {
    return parsePrice(await this.page.getByTestId('unit-price').innerText());
  }

  /** Ajusta la cantidad a `quantity` usando el botón de incremento (la cantidad inicial es 1). */
  async setQuantity(quantity: number): Promise<void> {
    for (let i = 1; i < quantity; i++) {
      await this.page.getByTestId('increase-quantity').click();
    }
  }

  /** Agrega el producto al carrito y confirma el mensaje de éxito. */
  async addToCart(): Promise<void> {
    await this.page.getByTestId('add-to-cart').click();
    await expect(this.page.getByRole('alert')).toContainText('Product added to shopping cart.');
  }
}
