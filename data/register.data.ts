import { requireEnv } from '../utils/env';
import fixedData from './register.json';

/**
 * Datos de prueba del flujo de registro en Practice Software Testing.
 * - Fijos (data/register.json): país, código postal, número de casa y prefijos de nombre.
 * - Por entorno (.env): URL de login esperada y correo del candidato.
 * Los campos dinámicos se generan en cada ejecución para evitar colisiones.
 */
export const registerData = {
  country: fixedData.country,
  postalCode: fixedData.postalCode,
  houseNumber: fixedData.houseNumber,
  expectedLoginUrl: requireEnv('REGISTER_LOGIN_URL'),
} as const;

/** Número aleatorio de `length` dígitos. */
function randomDigits(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += Math.floor(Math.random() * 10).toString();
  }
  return out;
}

/** Sufijo alfabético en minúsculas, útil para nombres únicos. */
function randomLetters(length: number): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += letters[Math.floor(Math.random() * letters.length)];
  }
  return out;
}

/** Fecha de nacimiento aleatoria entre 1960 y 2000, formato YYYY-MM-DD. */
function randomDob(): string {
  const year = 1960 + Math.floor(Math.random() * 41);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  email: string;
  password: string;
}

/**
 * Agrega un sufijo "+xxxx" antes de la @ (ej. candidato+abc123@gmail.com).
 * Llega al mismo buzón del candidato, pero la app lo ve como correo nuevo
 * en cada ejecución; sin esto el registro falla con "email ya existe".
 */
function uniqueEmail(baseEmail: string, suffix: string): string {
  const at = baseEmail.lastIndexOf('@');
  return `${baseEmail.slice(0, at)}+${suffix}${baseEmail.slice(at)}`;
}

/**
 * Genera un usuario nuevo. El correo es el del candidato (REGISTER_EMAIL en .env)
 * con un sufijo único; el resto de campos son dinámicos.
 */
export function generateRegisterUser(): RegisterUser {
  const suffix = randomLetters(6);
  return {
    firstName: `${fixedData.firstNamePrefix}${suffix}`,
    lastName: `${fixedData.lastNamePrefix}${suffix}`,
    dob: randomDob(),
    phone: randomDigits(9),
    email: uniqueEmail(requireEnv('REGISTER_EMAIL'), `${suffix}${randomDigits(4)}`),
    password: `Aa1!${randomDigits(8)}`,
  };
}
