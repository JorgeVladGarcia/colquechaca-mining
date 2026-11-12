import { test } from '../fixtures/pages.fixture';
import { generateInvalidCredentials, loginErrorMessage } from '../data/login.data';

test.describe('Inicio de sesión', () => {
  test('con credenciales incorrectas muestra el error y el usuario no accede a su cuenta', async ({
    loginPage,
    accountPage,
  }) => {
    const credentials = generateInvalidCredentials();

    await test.step('1. Abrir la página de login', async () => {
      await loginPage.goto();
      await loginPage.expectLoaded();
    });

    await test.step('2. Intentar iniciar sesión con credenciales incorrectas', async () => {
      await loginPage.login(credentials.email, credentials.password);
    });

    await test.step('3. Validar que se muestra el mensaje de error', async () => {
      await loginPage.expectLoginError(loginErrorMessage);
    });

    await test.step('4. Validar que el usuario no accede a su cuenta', async () => {
      await accountPage.expectNotLoggedIn();
    });
  });
});
