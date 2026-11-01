import { useState } from "react";
import { CATEGORIAS, type Categoria, type Producto, type ProductoNuevo } from "../types";
import Modal from "./Modal";

interface Props {
  producto: Producto | null; // null = crear uno nuevo
  onGuardar: (datos: ProductoNuevo, id?: number) => void;
  onCancelar: () => void;
}

type Errores = Partial<Record<"codigo" | "nombre" | "precio" | "stock", string>>;

const campo =
  "mt-1 block w-full rounded-xl border border-field-line bg-field px-3.5 py-2.5 text-ink focus:outline-2 focus:outline-accent";

export default function FormularioProducto({ producto, onGuardar, onCancelar }: Props) {
  const [codigo, setCodigo] = useState(producto?.codigo ?? "");
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [categoria, setCategoria] = useState<Categoria>(producto?.categoria ?? CATEGORIAS[0]);
  const [precio, setPrecio] = useState(producto ? String(producto.precio) : "");
  const [stock, setStock] = useState(producto ? String(producto.stock) : "");
  const [errores, setErrores] = useState<Errores>({});

  const guardar = () => {
    const nuevos: Errores = {};
    if (!codigo.trim()) nuevos.codigo = "Escribe el código";
    if (!nombre.trim()) nuevos.nombre = "Escribe el nombre";
    if (precio === "" || Number(precio) < 0) nuevos.precio = "Escribe un precio válido";
    if (stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0)
      nuevos.stock = "Usa un número entero desde 0";

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    onGuardar(
      {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoria,
        precio: Number(precio),
        stock: Number(stock),
      },
      producto?.id,
    );
  };

  const error = (msg?: string) =>
    msg ? <p className="mt-1 text-xs text-danger">{msg}</p> : null;

  return (
    <Modal titulo={producto ? "Editar producto" : "Nuevo producto"} onCerrar={onCancelar}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm text-muted">
          Código
          <input className={campo} value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          {error(errores.codigo)}
        </label>
        <label className="block text-sm text-muted">
          Categoría
          <select
            className={campo}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as Categoria)}
          >
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block text-sm text-muted">
        Nombre
        <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {error(errores.nombre)}
      </label>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm text-muted">
          Precio (COP)
          <input
            type="number"
            min="0"
            className={campo}
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          {error(errores.precio)}
        </label>
        <label className="block text-sm text-muted">
          Cantidad en stock
          <input
            type="number"
            min="0"
            className={campo}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          {error(errores.stock)}
        </label>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={onCancelar}
          className="rounded-xl bg-base px-4 py-2.5 shadow-neu-sm active:shadow-neu-in"
        >
          Cancelar
        </button>
        <button
          onClick={guardar}
          className="btn-primary rounded-xl px-4 py-2.5 font-semibold"
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
}
