import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { STOCK_BAJO, type Producto } from "../types";
import { formatearPrecio } from "../lib/format";

interface Props {
  productos: Producto[];
  onEditar: (p: Producto) => void;
  onBorrar: (p: Producto) => void;
}

const celda = "border-b border-row-line px-4 py-3 whitespace-nowrap";
const botonIcono =
  "grid size-9 place-items-center rounded-xl focus-visible:outline-2 focus-visible:outline-accent";

function EtiquetaStock({ stock }: { stock: number }) {
  const bajo = stock <= STOCK_BAJO;
  const etiqueta = stock === 0 ? "Agotado" : bajo ? "Stock bajo" : "Stock normal";
  return (
    <span
      title={etiqueta}
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
        bajo ? "bg-prueba1 text-red-950" : "bg-prueba2 text-green-950"
      }`}
    >
      {stock}
      <span className="sr-only"> unidades, {etiqueta}</span>
    </span>
  );
}

function Acciones({ p, onEditar, onBorrar }: { p: Producto } & Pick<Props, "onEditar" | "onBorrar">) {
  return (
    <div className="flex justify-end gap-3">
      <button
        className={`${botonIcono} btn-primary`}
        onClick={() => onEditar(p)}
        aria-label={`Editar ${p.nombre}`}
        title="Editar"
      >
        <FiEdit2 size={16} />
      </button>
      <button
        className={`${botonIcono} btn-dark`}
        onClick={() => onBorrar(p)}
        aria-label={`Borrar ${p.nombre}`}
        title="Borrar"
      >
        <FiTrash2 size={16} />
      </button>
    </div>
  );
}

export default function TablaProductos({ productos, onEditar, onBorrar }: Props) {
  if (productos.length === 0) {
    return (
      <div className="rounded-3xl bg-base p-10 text-center text-muted shadow-neu">
        No se encontraron productos. Prueba con otra búsqueda o cambia la categoría.
      </div>
    );
  }

  return (
    <>
      {/* Celulares y tabletas: una tarjeta por producto */}
      <ul className="space-y-3 lg:hidden">
        {productos.map((p) => (
          <li key={p.id} className="rounded-2xl bg-base p-4 shadow-neu">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">{p.nombre}</p>
              <EtiquetaStock stock={p.stock} />
            </div>
            <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted">
              <span>{p.codigo}</span>
              <span>{p.categoria}</span>
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-lg font-semibold">{formatearPrecio(p.precio)}</p>
              <Acciones p={p} onEditar={onEditar} onBorrar={onBorrar} />
            </div>
          </li>
        ))}
      </ul>

      {/* Pantallas grandes: tabla */}
      <div className="hidden overflow-hidden rounded-3xl bg-base shadow-neu lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gradient-to-r from-[#2f63d6] to-[#1b3f94] text-xs text-white">
            <tr>
              <th className={`${celda} font-semibold`}>Código</th>
              <th className={`${celda} font-semibold`}>Nombre</th>
              <th className={`${celda} font-semibold`}>Categoría</th>
              <th className={`${celda} text-right font-semibold`}>Precio</th>
              <th className={`${celda} text-right font-semibold`}>Stock</th>
              <th className={`${celda} text-right font-semibold`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="even:bg-[#c2d3ee]/60 hover:bg-[#b9ccec]/70">
                <td className={celda}>{p.codigo}</td>
                <td className={celda}>{p.nombre}</td>
                <td className={celda}>{p.categoria}</td>
                <td className={`${celda} text-right`}>{formatearPrecio(p.precio)}</td>
                <td className={`${celda} text-right`}>
                  <EtiquetaStock stock={p.stock} />
                </td>
                <td className={celda}>
                  <Acciones p={p} onEditar={onEditar} onBorrar={onBorrar} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
