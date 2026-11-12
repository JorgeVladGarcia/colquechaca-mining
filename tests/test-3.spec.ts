import { test } from '../fixtures/pages.fixture';
import { cartData } from '../data/cart.data';

test.describe('Carrito de compras', () => {
  test('agrega productos al carrito y valida nombre, cantidad y precio en el carrito', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    test.setTimeout(90000);
    const { helmet, saw } = cartData;
    let helmetPrice: number;
    let sawPrice: number;

    await test.step('1. Buscar el producto "Construction Helmet"', async () => {
      await homePage.goto();
      await homePage.search(helmet.name);
    });

    await test.step('2. Abrir el detalle del producto y validar nombre y precio', async () => {
      await homePage.expectProductInResults(helmet.name);
      helmetPrice = await homePage.getProductPrice(helmet.name);
      await homePage.openProduct(helmet.name);
      await productPage.expectDetails(helmet.name, helmetPrice);
    });

    await test.step('3. Agregar un item del producto al carrito', async () => {
      await productPage.setQuantity(helmet.quantity);
      await productPage.addToCart();
    });

    await test.step('4. Buscar el producto "Circular Saw"', async () => {
      await homePage.navigateHome();
      await homePage.search(saw.name);
    });

    await test.step('5. Abrir el detalle del producto y validar nombre y precio', async () => {
      await homePage.expectProductInResults(saw.name);
      sawPrice = await homePage.getProductPrice(saw.name);
      await homePage.openProduct(saw.name);
      await productPage.expectDetails(saw.name, sawPrice);
    });

    await test.step('6. Agregar dos items del producto al carrito', async () => {
      await productPage.setQuantity(saw.quantity);
      await productPage.addToCart();
    });

    await test.step('7. Abrir el carrito y validar productos, cantidad y precio', async () => {
      await cartPage.open();
      await cartPage.expectItem(helmet.name, helmet.quantity, helmetPrice);
      await cartPage.expectItem(saw.name, saw.quantity, sawPrice);
    });
  });
});
