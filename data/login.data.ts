import { generateRegisterUser } from './register.data';

/**
 * Datos de prueba del flujo de inicio de sesión en Practice Software Testing.
 */

/** Mensaje que la app muestra cuando las credenciales no son válidas. */
export const loginErrorMessage = 'Invalid email or password';

/**
 * Credenciales incorrectas: un correo que no está registrado y una contraseña
 * que no corresponde a ninguna cuenta. Se generan en cada ejecución para que
 * el test no dependa de usuarios existentes.
 */
export function generateInvalidCredentials(): { email: string; password: string } {
  return {
    email: generateRegisterUser().email,
    password: 'ContrasenaIncorrecta!123',
  };
}
