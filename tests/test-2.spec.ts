import { test } from '../fixtures/pages.fixture';
import { generateRegisterUser, registerData } from '../data/register.data';

test.describe('Inicio de sesión', () => {
  test('el usuario recién creado inicia sesión y ve su nombre en el menú de cuenta', async ({
    registerPage,
    loginPage,
    accountPage,
  }) => {
    const user = generateRegisterUser();

    await test.step('1. Crear el usuario por registro', async () => {
      await registerPage.goto();
      await registerPage.fillForm(user, registerData.country, registerData.postalCode, registerData.houseNumber);
      await registerPage.expectAddressAutofilled();
      await registerPage.submit();
      await loginPage.expectLoaded();
    });

    await test.step('2. Iniciar sesión con el usuario recién creado', async () => {
      await loginPage.login(user.email, user.password);
    });

    await test.step('3. Validar que el nombre aparece en el menú de cuenta', async () => {
      await accountPage.expectUrl(/\/account$/);
      await accountPage.expectLoggedInAs(`${user.firstName} ${user.lastName}`);
    });
  });
});
