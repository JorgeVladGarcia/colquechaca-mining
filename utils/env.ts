/**
 * Lee una variable de entorno obligatoria (cargada desde .env en playwright.config.ts).
 * Falla con un mensaje claro si no está definida.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Revisa tu .env (ver .env.example).`);
  }
  return value;
}
