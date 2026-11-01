import type { Producto } from "../types";
import Modal from "./Modal";

interface Props {
  producto: Producto;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmarBorrado({ producto, onConfirmar, onCancelar }: Props) {
  return (
    <Modal titulo="¿Borrar producto?" onCerrar={onCancelar}>
      <p className="text-muted">
        Se eliminará “{producto.nombre}”. Esta acción no se puede deshacer.
      </p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={onCancelar}
          className="rounded-xl bg-base px-4 py-2.5 shadow-neu-sm active:shadow-neu-in"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          className="rounded-xl bg-base px-4 py-2.5 font-semibold text-danger shadow-neu-sm active:shadow-neu-in"
        >
          Borrar
        </button>
      </div>
    </Modal>
  );
}
