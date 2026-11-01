import type { Producto } from "../types";

// Datos de ejemplo. Se reemplazarán por llamadas a la API del backend.
export const PRODUCTOS_INICIALES: Producto[] = [
  { id: 1, codigo: "BEB-001", nombre: "Agua mineral 600 ml", categoria: "Bebidas", precio: 2500, stock: 48 },
  { id: 2, codigo: "BEB-002", nombre: "Gaseosa cola 1.5 L", categoria: "Bebidas", precio: 6800, stock: 22 },
  { id: 3, codigo: "ASE-001", nombre: "Detergente en polvo 1 kg", categoria: "Aseo", precio: 12900, stock: 4 },
  { id: 4, codigo: "ASE-002", nombre: "Jabón de manos 250 ml", categoria: "Aseo", precio: 7200, stock: 15 },
  { id: 5, codigo: "SNK-001", nombre: "Papas fritas 120 g", categoria: "Snacks", precio: 4500, stock: 31 },
  { id: 6, codigo: "SNK-002", nombre: "Galletas de avena", categoria: "Snacks", precio: 3200, stock: 3 },
  { id: 7, codigo: "PAP-001", nombre: "Cuaderno 100 hojas", categoria: "Papelería", precio: 5900, stock: 18 },
  { id: 8, codigo: "PAP-002", nombre: "Bolígrafo azul", categoria: "Papelería", precio: 1500, stock: 60 },
  { id: 9, codigo: "LAC-001", nombre: "Leche entera 1 L", categoria: "Lácteos", precio: 4800, stock: 25 },
  { id: 10, codigo: "LAC-002", nombre: "Queso campesino 500 g", categoria: "Lácteos", precio: 14500, stock: 5 },
];

import type { Venta } from "../types";

// Ventas de ejemplo para que el historial no aparezca vacío.
export const VENTAS_INICIALES: Venta[] = [
  {
    id: 1,
    fecha: "2026-10-31T10:15:00",
    anulada: false,
    items: [
      { productoId: 1, codigo: "BEB-001", nombre: "Agua mineral 600 ml", cantidad: 3, precioUnitario: 2500 },
      { productoId: 5, codigo: "SNK-001", nombre: "Papas fritas 120 g", cantidad: 2, precioUnitario: 4500 },
    ],
  },
  {
    id: 2,
    fecha: "2026-10-31T16:40:00",
    anulada: false,
    items: [{ productoId: 9, codigo: "LAC-001", nombre: "Leche entera 1 L", cantidad: 4, precioUnitario: 4800 }],
  },
];
