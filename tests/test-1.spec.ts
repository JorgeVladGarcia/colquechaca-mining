import { test } from '../fixtures/pages.fixture';
import { generateRegisterUser, registerData } from '../data/register.data';

test.describe('Registro de usuario', () => {
  test('un usuario nuevo se registra y es redirigido al login', async ({ registerPage, loginPage }) => {
    const user = generateRegisterUser();

    await test.step('1. Ir a la página de registro', async () => {
      await registerPage.goto();
    });

    await test.step('2. Completar el formulario con datos dinámicos', async () => {
      await registerPage.fillForm(user, registerData.country, registerData.postalCode, registerData.houseNumber);
      await registerPage.expectAddressAutofilled();
    });

    await test.step('3. Enviar y validar la redirección a login', async () => {
      await registerPage.submit();
      await loginPage.expectUrl(registerData.expectedLoginUrl);
      await loginPage.expectLoaded();
    });
  });
});
