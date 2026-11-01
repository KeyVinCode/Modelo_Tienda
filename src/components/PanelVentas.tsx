import { useEffect, useState } from "react";
import { FiEye, FiRotateCcw } from "react-icons/fi";
import { totalVenta, type ItemVenta, type Producto, type Venta } from "../types";
import { formatearFecha, formatearPrecio } from "../lib/format";
import Modal from "./Modal";
import FormularioVenta from "./FormularioVenta";

interface Props {
  productos: Producto[];
  ventas: Venta[];
  formularioAbierto: boolean;
  onCerrarFormulario: () => void;
  onRegistrar: (items: ItemVenta[]) => void;
  onAnular: (id: number) => void;
}

const boton =
  "flex items-center justify-center gap-2 rounded-xl bg-base px-4 py-2.5 shadow-neu-sm transition-shadow active:shadow-neu-in";
const TONOS = ["from-[#3b6fe0] to-[#1f4fbf]", "from-[#2a58c4] to-[#1b3f94]", "from-[#1f4fbf] to-[#0f2f7a]"];
const celda = "border-b border-row-line px-4 py-3";

export default function PanelVentas({
  productos,
  ventas,
  formularioAbierto,
  onCerrarFormulario,
  onRegistrar,
  onAnular,
}: Props) {
  const [aviso, setAviso] = useState("");
  const [porAnular, setPorAnular] = useState<Venta | null>(null);
  const [porVer, setPorVer] = useState<Venta | null>(null);

  useEffect(() => {
    if (formularioAbierto) setAviso("");
  }, [formularioAbierto]);

  const registrar = (items: ItemVenta[]) => {
    onRegistrar(items);
    onCerrarFormulario();
    setAviso("Venta registrada. El inventario se actualizó.");
  };

  const vigentes = ventas.filter((v) => !v.anulada);
  const resumen = [
    { etiqueta: "Ventas registradas", valor: String(vigentes.length) },
    {
      etiqueta: "Unidades vendidas",
      valor: String(vigentes.reduce((s, v) => s + v.items.reduce((u, i) => u + i.cantidad, 0), 0)),
    },
    { etiqueta: "Total vendido", valor: formatearPrecio(vigentes.reduce((s, v) => s + totalVenta(v), 0)) },
  ];
  const historial = [...ventas].reverse();

  return (
    <div className="space-y-6">
      {aviso && (
        <p role="status" className="rounded-2xl px-4 py-2.5 text-sm font-medium bg-chip text-chip-ink">
          {aviso}
        </p>
      )}

      <dl className="grid gap-4 sm:grid-cols-3">
        {resumen.map((r, n) => (
          <div key={r.etiqueta} className={`rounded-2xl bg-gradient-to-br ${TONOS[n]} p-4 text-white shadow-neu-sm`}>
            <dt className="text-sm text-white/85">{r.etiqueta}</dt>
            <dd className="mt-1 text-xl font-semibold">{r.valor}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="titulo-historial">
        <h2 id="titulo-historial" className="mb-3 text-lg font-semibold">
          Historial de ventas
        </h2>
        {historial.length === 0 ? (
          <div className="rounded-3xl bg-base p-10 text-center text-muted shadow-neu">
            Aún no hay ventas registradas. Usa “Agregar venta” para registrar la primera.
          </div>
        ) : (
          <>
            <ul className="space-y-3 lg:hidden">
              {historial.map((v) => (
                <li key={v.id} className={`rounded-2xl bg-base p-4 shadow-neu ${v.anulada ? "text-muted" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{formatearFecha(v.fecha)}</p>
                      <p className="text-sm text-muted">
                        {v.items.length} {v.items.length === 1 ? "producto" : "productos"}
                      </p>
                    </div>
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                        v.anulada ? "text-muted shadow-neu-in" : "bg-chip text-chip-ink"
                      }`}
                    >
                      {v.anulada ? "Anulada" : "Registrada"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className={`text-lg font-semibold ${v.anulada ? "line-through" : ""}`}>
                      {formatearPrecio(totalVenta(v))}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPorVer(v)}
                        aria-label="Ver detalle de la venta"
                        title="Ver detalle"
                        className="btn-primary grid size-9 place-items-center rounded-xl"
                      >
                        <FiEye size={16} />
                      </button>
                      {!v.anulada && (
                        <button
                          onClick={() => setPorAnular(v)}
                          aria-label="Anular venta"
                          title="Anular venta"
                          className="btn-dark grid size-9 place-items-center rounded-xl"
                        >
                          <FiRotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

          <div className="hidden overflow-hidden rounded-3xl bg-base shadow-neu lg:block">
            <div>
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-gradient-to-r from-[#2f63d6] to-[#1b3f94] text-xs text-white">
                  <tr>
                    <th className={`${celda} font-semibold`}>Fecha</th>
                    <th className={`${celda} font-semibold`}>Productos</th>
                    <th className={`${celda} text-right font-semibold`}>Total</th>
                    <th className={`${celda} font-semibold`}>Estado</th>
                    <th className={`${celda} text-right font-semibold`}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((v) => (
                    <tr key={v.id} className={`even:bg-[#c2d3ee]/60 ${v.anulada ? "text-muted" : "hover:bg-[#b9ccec]/70"}`}>
                      <td className={`${celda} whitespace-nowrap`}>{formatearFecha(v.fecha)}</td>
                      <td className={celda}>
                        {v.items.length} {v.items.length === 1 ? "producto" : "productos"}
                      </td>
                      <td className={`${celda} text-right whitespace-nowrap ${v.anulada ? "line-through" : ""}`}>
                        {formatearPrecio(totalVenta(v))}
                      </td>
                      <td className={celda}>
                        <span
                          className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                            v.anulada ? "text-muted shadow-neu-in" : "bg-chip text-chip-ink"
                          }`}
                        >
                          {v.anulada ? "Anulada" : "Registrada"}
                        </span>
                      </td>
                      <td className={celda}>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setPorVer(v)}
                            aria-label="Ver detalle de la venta"
                            title="Ver detalle"
                            className="btn-primary grid size-9 place-items-center rounded-xl"
                          >
                            <FiEye size={16} />
                          </button>
                          {!v.anulada && (
                            <button
                              onClick={() => setPorAnular(v)}
                              aria-label="Anular venta"
                              title="Anular venta"
                              className="btn-dark grid size-9 place-items-center rounded-xl"
                            >
                              <FiRotateCcw size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
      </section>

      {formularioAbierto && (
        <FormularioVenta productos={productos} onRegistrar={registrar} onCancelar={onCerrarFormulario} />
      )}

      {porVer && (
        <Modal titulo="Detalle de la venta" onCerrar={() => setPorVer(null)}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
            <span>{formatearFecha(porVer.fecha)}</span>
            <span
              className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                porVer.anulada ? "text-muted shadow-neu-in" : "bg-chip text-chip-ink"
              }`}
            >
              {porVer.anulada ? "Anulada" : "Registrada"}
            </span>
          </div>
          <ul className="mt-4 max-h-64 divide-y divide-row-line overflow-auto rounded-2xl p-3 text-sm shadow-neu-in">
            {porVer.items.map((i) => (
              <li key={i.productoId} className="flex items-start justify-between gap-3 py-2">
                <span>
                  <span className="block font-medium">{i.nombre}</span>
                  <span className="block text-xs text-muted">
                    {i.codigo}: {i.cantidad} × {formatearPrecio(i.precioUnitario)}
                  </span>
                </span>
                <span className="font-medium whitespace-nowrap">{formatearPrecio(i.cantidad * i.precioUnitario)}</span>
              </li>
            ))}
          </ul>
          {porVer.anulada && (
            <p className="mt-3 text-sm text-muted">Esta venta fue anulada y sus unidades volvieron al inventario.</p>
          )}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-row-line pt-4">
            <p className="text-lg font-semibold">Total: {formatearPrecio(totalVenta(porVer))}</p>
            <button
              onClick={() => setPorVer(null)}
              className="btn-primary flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}

      {porAnular && (
        <Modal titulo="¿Anular venta?" onCerrar={() => setPorAnular(null)}>
          <p className="text-muted">
            Las unidades de esta venta volverán al inventario. La venta quedará en el historial como anulada.
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => setPorAnular(null)} className={boton}>
              Cancelar
            </button>
            <button
              onClick={() => {
                onAnular(porAnular.id);
                setPorAnular(null);
              }}
              className="btn-dark flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold"
            >
              Anular venta
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
