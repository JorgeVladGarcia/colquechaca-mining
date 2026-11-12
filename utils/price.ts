/**
 * Convierte un texto de precio (ej. "$41.29", "41.29") en número.
 * Lanza error si el texto no contiene un precio válido.
 */
export function parsePrice(text: string): number {
  const match = text.match(/\d[\d,]*\.\d{2}/);
  if (!match) {
    throw new Error(`No se encontró un precio válido en el texto: "${text}"`);
  }
  return Number(match[0].replace(/,/g, ''));
}
