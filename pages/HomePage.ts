import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

/**
 * Page Object de la página de inicio: búsqueda y resultados de productos.
 */
export class HomePage extends BasePage {
  protected readonly path = '/';

  /**
   * Tarjeta de producto en los resultados. Las tarjetas tienen data-test="product-<ID>",
   * pero el ID puede cambiar de formato, así que se identifica por el nombre que contienen.
   * El prefijo "product-" también coincide con elementos internos (product-name, product-price);
   * el filtro `has` descarta esos elementos porque no contienen un product-name.
   */
  private productCard(name: string) {
    return this.page
      .getByTestId(/^product-/)
      .filter({ has: this.page.getByTestId('product-name').filter({ hasText: name }) });
  }

  /**
   * Abre el inicio y espera a que termine el listado inicial de productos.
   * Si una búsqueda se envía mientras ese listado aún está en curso, la respuesta
   * del listado completo puede llegar después y reemplazar los resultados
   * (por ejemplo, mostrar 45 productos bajo "Construction Helmet").
   */
  override async goto(): Promise<void> {
    const initialListing = this.page.waitForResponse(
      (response) => new URL(response.url()).pathname === '/products' && response.ok(),
      { timeout: 30000 },
    );
    await super.goto();
    await initialListing;
  }

  /** Vuelve al inicio desde cualquier página usando la barra de navegación. */
  async navigateHome(): Promise<void> {
    const initialListing = this.page.waitForResponse(
      (response) => new URL(response.url()).pathname === '/products' && response.ok(),
      { timeout: 30000 },
    );
    await this.page.getByTestId('nav-home').click();
    await this.expectUrl(/\/$/);
    await initialListing;
  }

  /**
   * Busca un término y espera la respuesta real de la API de búsqueda.
   * Esperar la respuesta evita depender de un timeout fijo: si la búsqueda no
   * llega a ejecutarse o el sitio no responde, el error lo indica explícitamente.
   */
  async search(term: string): Promise<void> {
    await this.page.getByTestId('search-query').fill(term);
    await Promise.all([
      this.page.waitForResponse(
        (response) => response.url().includes('/products/search') && response.ok(),
        { timeout: 30000 },
      ),
      this.page.getByTestId('search-submit').click(),
    ]);
  }

  /** Verifica que el producto aparece en los resultados con su nombre y un precio válido. */
  async expectProductInResults(name: string): Promise<void> {
    // La búsqueda filtra en el cliente y puede tardar más que el timeout por defecto
    await expect(this.productCard(name)).toBeVisible({ timeout: 15000 });
    await expect(this.productCard(name).getByTestId('product-name')).toHaveText(name);
    await expect(this.productCard(name).getByTestId('product-price')).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
  }

  /** Lee el precio del producto desde los resultados de búsqueda. */
  async getProductPrice(name: string): Promise<number> {
    const text = await this.productCard(name).getByTestId('product-price').innerText();
    return parsePrice(text);
  }

  /** Abre el detalle del producto desde los resultados de búsqueda. */
  async openProduct(name: string): Promise<void> {
    await this.productCard(name).click();
  }
}
