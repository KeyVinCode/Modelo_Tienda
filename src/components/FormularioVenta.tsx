import { useState } from "react";
import { FiAlertCircle, FiPlus, FiX } from "react-icons/fi";
import { totalVenta, type ItemVenta, type Producto } from "../types";
import { formatearPrecio } from "../lib/format";
import Modal from "./Modal";

interface Props {
  productos: Producto[];
  onRegistrar: (items: ItemVenta[]) => void;
  onCancelar: () => void;
}

const campo =
  "mt-1 block w-full rounded-xl border border-field-line bg-field px-3.5 py-2.5 text-ink focus:outline-2 focus:outline-accent";
const boton =
  "flex items-center justify-center gap-2 rounded-xl bg-base px-4 py-2.5 shadow-neu-sm transition-shadow active:shadow-neu-in disabled:cursor-not-allowed disabled:opacity-50";

export default function FormularioVenta({ productos, onRegistrar, onCancelar }: Props) {
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [error, setError] = useState("");

  const agregar = () => {
    const producto = productos.find((p) => p.id === Number(productoId));
    const n = Number(cantidad);
    if (!producto) return setError("Elige un producto");
    if (!Number.isInteger(n) || n < 1) return setError("La cantidad debe ser un número entero desde 1");

    const yaEnVenta = carrito.find((i) => i.productoId === producto.id)?.cantidad ?? 0;
    const disponible = producto.stock - yaEnVenta;
    if (n > disponible) {
      return setError(
        disponible > 0
          ? `Solo quedan ${disponible} unidades de “${producto.nombre}”`
          : `No quedan unidades de “${producto.nombre}”`,
      );
    }

    setError("");
    setCarrito((actual) => {
      if (actual.some((i) => i.productoId === producto.id)) {
        return actual.map((i) => (i.productoId === producto.id ? { ...i, cantidad: i.cantidad + n } : i));
      }
      return [
        ...actual,
        {
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          cantidad: n,
          precioUnitario: producto.precio,
        },
      ];
    });
    setProductoId("");
    setCantidad("1");
  };

  return (
    <Modal titulo="Agregar venta" onCerrar={onCancelar}>
      <label className="block text-sm text-muted">
        Producto
        <select className={campo} value={productoId} onChange={(e) => setProductoId(e.target.value)}>
          <option value="">Elige un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id} disabled={p.stock === 0}>
              {p.nombre} (stock: {p.stock})
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="w-28 text-sm text-muted">
          Cantidad
          <input type="number" min="1" className={campo} value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </label>
        <button onClick={agregar} className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold">
          <FiPlus size={18} /> Agregar a la lista
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-medium text-danger">
          <FiAlertCircle className="mt-0.5 shrink-0" size={16} /> {error}
        </p>
      )}

      <div className="mt-4">
        {carrito.length === 0 ? (
          <p className="rounded-2xl p-4 text-sm text-muted shadow-neu-in">
            Aún no hay productos en la venta. Elige uno y pulsa “Agregar a la lista”.
          </p>
        ) : (
          <ul className="max-h-48 divide-y divide-row-line overflow-auto rounded-2xl p-3 text-sm shadow-neu-in">
            {carrito.map((i) => (
              <li key={i.productoId} className="flex items-center justify-between gap-3 py-2">
                <span>
                  {i.cantidad} × {i.nombre}
                </span>
                <span className="flex items-center gap-3">
                  {formatearPrecio(i.cantidad * i.precioUnitario)}
                  <button
                    aria-label={`Quitar ${i.nombre}`}
                    title="Quitar"
                    onClick={() => setCarrito((c) => c.filter((x) => x.productoId !== i.productoId))}
                    className="btn-dark grid size-8 place-items-center rounded-lg"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-row-line pt-4">
        <p className="text-lg font-semibold">Total: {formatearPrecio(totalVenta({ items: carrito }))}</p>
        <div className="flex gap-3">
          <button onClick={onCancelar} className={boton}>
            Cancelar
          </button>
          <button
            onClick={() => onRegistrar(carrito)}
            disabled={carrito.length === 0}
            className="btn-primary flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Registrar venta
          </button>
        </div>
      </div>
    </Modal>
  );
}
