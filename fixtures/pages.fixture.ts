import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

/**
 * Page Objects disponibles en cada test.
 * Para agregar uno nuevo: declararlo aquí y registrarlo en test.extend.
 */
type PageFixtures = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  accountPage: AccountPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
};

/**
 * Fixture personalizado: inyecta los Page Objects ya instanciados,
 * así los tests no necesitan hacer `new RegisterPage(page)`.
 */
export const test = base.extend<PageFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
