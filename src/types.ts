export const CATEGORIAS = ["Bebidas", "Aseo", "Snacks", "Papelería", "Lácteos"] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  stock: number;
}

export type ProductoNuevo = Omit<Producto, "id">;

export const STOCK_BAJO = 5;

export interface ItemVenta {
  productoId: number;
  codigo: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number; // precio al momento de la venta
}

export interface Venta {
  id: number;
  fecha: string; // ISO
  items: ItemVenta[];
  anulada: boolean;
}

export const totalVenta = (v: { items: ItemVenta[] }) =>
  v.items.reduce((suma, i) => suma + i.cantidad * i.precioUnitario, 0);
