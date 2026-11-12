/**
 * Datos de prueba del flujo de carrito.
 * Los productos se buscan por nombre (no por ID) para no depender de IDs internos.
 * Los precios NO se fijan aquí: se leen de la propia app en cada ejecución,
 * así el test no falla si el sitio cambia un precio.
 */
export const cartData = {
  helmet: { name: 'Construction Helmet', quantity: 1 },
  saw: { name: 'Circular Saw', quantity: 2 },
} as const;
