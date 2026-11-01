import { STOCK_BAJO } from "../types";

// Cantidad a partir de la cual el stock se considera "alto" (verde completo).
export const STOCK_ALTO = 30;

/**
 * Escala continua de rojo (0 unidades) a verde (STOCK_ALTO o más), pasando por naranja y amarillo.
 * El tono (hue) va de 0 a 120 grados.
 */
export function estiloStock(stock: number) {
  const t = Math.min(Math.max(stock / STOCK_ALTO, 0), 1);
  const tono = Math.round(t * 120);
  const etiqueta =
    stock === 0 ? "Agotado" : stock <= STOCK_BAJO ? "Stock bajo" : stock >= STOCK_ALTO ? "Stock alto" : "Stock medio";
  return {
    fondo: `hsl(${tono} 75% 80%)`,
    texto: `hsl(${tono} 90% 17%)`,
    etiqueta,
  };
}

// Barra de leyenda para mostrar la escala completa.
export const LEYENDA_STOCK =
  "linear-gradient(90deg, hsl(0 75% 72%), hsl(30 75% 72%), hsl(60 75% 72%), hsl(90 75% 72%), hsl(120 75% 72%))";
