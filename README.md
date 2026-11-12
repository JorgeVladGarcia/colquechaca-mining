# colquechaca-mining — Automatización E2E con Playwright

Framework de pruebas end-to-end con **Playwright + TypeScript**, sobre la aplicación [Practice Software Testing](https://practicesoftwaretesting.com/). Usa **Page Object Model (POM)** y **fixtures personalizados**.

**Demo grabada del framework:** [Carpeta en Google Drive](https://drive.google.com/drive/folders/1p9bZxx6sGoMT_hC6-q6kNRCy_C4-be9y?usp=drive_link)

## Estructura

```
.
├── .github/workflows/playwright.yml   # CI en GitHub Actions
├── data/                              # Datos de prueba
│   ├── cart.data.ts                   # Productos y cantidades del flujo de carrito
│   ├── login.data.ts                  # Credenciales inválidas y mensaje de error esperado
│   ├── register.data.ts               # Generación de usuarios nuevos
│   └── register.json                  # Datos fijos del registro (país, CP, prefijos)
├── fixtures/                          # Fixtures personalizados (test.extend)
│   └── pages.fixture.ts               # Inyecta los Page Objects en los tests
├── pages/                             # Page Objects
│   ├── BasePage.ts                    # Clase base: goto(), expectUrl(), locators comunes
│   ├── AccountPage.ts                 # /account
│   ├── CartPage.ts                    # /checkout (carrito)
│   ├── HomePage.ts                    # / (búsqueda y resultados)
│   ├── LoginPage.ts                   # /auth/login
│   ├── ProductPage.ts                 # /product/<ID>
│   └── RegisterPage.ts                # /auth/register
├── tests/                             # Especificaciones
│   ├── test-1.spec.ts                 # Registro de usuario
│   ├── test-2.spec.ts                 # Inicio de sesión con usuario recién creado
│   ├── test-3.spec.ts                 # Carrito de compras
│   └── test-4.spec.ts                 # Inicio de sesión con credenciales incorrectas
├── utils/
│   ├── env.ts                         # requireEnv(): lee variables obligatorias
│   └── price.ts                       # parsePrice(): convierte texto de precio a número
├── .env.example                       # Variables de entorno de ejemplo
└── playwright.config.ts
```

### Cómo se conectan las piezas

1. **`BasePage`** define lo que comparten todas las páginas (`goto()`, `expectUrl()`, etc.). Cada Page Object hereda de ella y declara su `path` y sus locators.
2. **`fixtures/pages.fixture.ts`** usa `test.extend` para inyectar los Page Objects. Los tests los reciben ya instanciados:
   ```ts
   import { test } from '../fixtures/pages.fixture';

   test('ejemplo', async ({ homePage }) => {
     await homePage.goto();
   });
   ```
3. **`data/`** guarda los datos de prueba, separados de la lógica. Los datos dinámicos se generan en cada ejecución.

## Independencia de los tests

Cada test debe poder ejecutarse solo, en cualquier orden y en paralelo. Para lograrlo:

- **Contexto de navegador nuevo por test:** no comparten cookies ni `localStorage`.
- **Datos únicos por ejecución:** los usuarios se crean con un correo distinto (`generateRegisterUser()`), y el login inválido usa credenciales que no existen.
- **Sin datos preexistentes:** ningún test depende de un usuario o de un carrito creado por otro.
- **Precios leídos de la app:** test-3 no fija precios; los lee de la búsqueda y los valida en el detalle y en el carrito.
- **Sin estado compartido:** no hay `beforeAll`, `serial` ni variables globales mutables.

`fullyParallel: true` en `playwright.config.ts` hace que esta independencia se compruebe en cada ejecución.

## Instalación

Requisitos: Node.js 18 o superior.

```bash
npm ci                        # instala dependencias
npx playwright install        # descarga los navegadores
cp .env.example .env          # configura las variables de entorno
```

## Variables de entorno

| Variable            | Descripción                                                        | Valor por defecto                                 |
|---------------------|--------------------------------------------------------------------|---------------------------------------------------|
| `BASE_URL`          | URL base de la aplicación bajo prueba                              | `https://practicesoftwaretesting.com/`            |
| `REGISTER_EMAIL`    | Correo del candidato para el registro. Se le agrega un sufijo único en cada ejecución | *(obligatoria, sin valor por defecto)* |
| `REGISTER_LOGIN_URL`| URL de login esperada tras el registro                              | `https://practicesoftwaretesting.com/auth/login`  |

`REGISTER_EMAIL` es obligatoria: si falta, `requireEnv()` detiene el test con un mensaje claro.

## Ejecución

| Comando                 | Qué hace                                               |
|-------------------------|--------------------------------------------------------|
| `npm test`              | Ejecuta todo en chromium, firefox y webkit (headless)  |
| `npm run test:headed`   | Ejecuta en Chromium con el navegador visible           |
| `npm run test:ui`       | Abre el modo UI interactivo                            |
| `npm run test:debug`    | Ejecuta paso a paso con el Playwright Inspector        |

Otros ejemplos:

```bash
npx playwright test tests/test-3.spec.ts              # un solo archivo
npx playwright test --project=firefox                 # un solo navegador
npx playwright test -g "Carrito"                      # filtrar por nombre de test
npx playwright test --shuffle --repeat-each=2         # orden aleatorio, para verificar independencia
```

> Los tests de registro (test-1, test-2) y de login inválido (test-4) interactúan con el sitio real y pueden crear usuarios de prueba en él.

## Reporte y evidencias

```bash
npm run report
```

Abre el reporte HTML (`playwright-report/`). Según la configuración de `playwright.config.ts`:

- **Screenshot:** solo cuando un test falla.
- **Video:** se conserva solo cuando un test falla.
- **Trace:** se conserva solo cuando un test falla. Se abre desde el reporte o con `npx playwright show-trace <archivo.zip>`.

## Integración continua

`.github/workflows/playwright.yml` corre los tests en cada push y pull request a `main`/`master`, con un solo worker, y publica el reporte como artifact (`playwright-report`, 30 días).

Configuración necesaria en el repositorio (*Settings → Secrets and variables → Actions*):

| Tipo     | Nombre               | Obligatorio | Uso                                              |
|----------|----------------------|-------------|--------------------------------------------------|
| Secret   | `REGISTER_EMAIL`     | Sí          | Correo del candidato (dato personal, no se muestra en logs) |
| Variable | `BASE_URL`           | No          | Si no se define, usa Practice Software Testing   |
| Variable | `REGISTER_LOGIN_URL` | No          | Si no se define, usa la URL de login de Practice Software Testing |

## Supuestos, limitaciones y mejoras

### Supuestos

- Los tests se ejecutan contra el sitio público de Practice Software Testing, sin mocks ni datos simulados.
- test-3 supone que los productos "Construction Helmet" y "Circular Saw" existen en el catálogo. Los precios no se fijan: se leen de la app.
- `REGISTER_EMAIL` debe ser un correo real que acepte sufijos `+xxxx`, porque cada ejecución crea un usuario con un sufijo distinto.

### Limitaciones

- **Usuarios de prueba sin limpieza:** test-1 y test-2 crean usuarios reales en el sitio y no los eliminan. Con el tiempo, el sitio acumula cuentas de prueba.
- **Dependencia del sitio externo:** el sitio usa un desafío de Cloudflare (`cdn-cgi/challenge-platform`). Desde algunas redes o desde CI, las búsquedas pueden fallar o retrasarse.
- **Carrera de búsqueda en la app:** `HomePage` espera el listado inicial y la respuesta de la búsqueda para evitar que un listado completo pise los resultados. Si la app cambia ese comportamiento, el problema puede reaparecer.
- **CI sin verificar en GitHub Actions:** la configuración se ha validado en local, no en un run real de GitHub Actions.
- **Sin `storageState`:** no hay sesión reutilizable. Hoy ningún test necesita un usuario autenticado que no sea el propio objeto de la prueba.

### Mejoras pendientes

- Crear los usuarios de prueba por API y eliminarlos al final de cada test, para no dejar cuentas en el sitio.
- Extraer el flujo de registro, que está duplicado en test-1 y test-2, a un helper o fixture.
- Añadir un proyecto `setup` con `storageState` cuando haya tests autenticados que no validen el login. Requeriría una cuenta dedicada por variables de entorno.

### Solución de problemas

- **test-3 falla con `element(s) not found` en la tarjeta de producto:** revisa si el sitio responde con el desafío de Cloudflare o si la búsqueda llegó a ejecutarse. Abre el `trace.zip` de la carpeta correspondiente en `test-results/`:

  ```bash
  npx playwright show-trace test-results/<carpeta-del-test>/trace.zip
  ```

- **Un test de registro falla por correo existente:** el sufijo `+xxxx` cambia en cada ejecución, pero si el sitio rechaza el correo base, revisa `REGISTER_EMAIL` en `.env`.
- **CI falla con "Falta la variable de entorno":** confirma que `REGISTER_EMAIL` está definido como secret en el repositorio.
