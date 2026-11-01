import { useMemo, useState } from "react";
import { FiLogOut, FiPackage, FiPlus, FiSearch, FiShoppingBag, FiShoppingCart, FiUser } from "react-icons/fi";
import type { IconType } from "react-icons";
import { CATEGORIAS, type ItemVenta, type Producto, type ProductoNuevo, type Venta } from "./types";
import { PRODUCTOS_INICIALES, VENTAS_INICIALES } from "./lib/data";
import TablaProductos from "./components/TablaProductos";
import FormularioProducto from "./components/FormularioProducto";
import ConfirmarBorrado from "./components/ConfirmarBorrado";
import PanelVentas from "./components/PanelVentas";
import Login from "./components/Login";
import Paginacion from "./components/Paginacion";
import type { Usuario } from "./lib/auth";

type Edicion = { producto: Producto | null } | null;
type Vista = "productos" | "ventas";

const MENU: { id: Vista; etiqueta: string; Icono: IconType }[] = [
  { id: "productos", etiqueta: "Productos", Icono: FiPackage },
  { id: "ventas", etiqueta: "Ventas", Icono: FiShoppingCart },
];

const TITULOS: Record<Vista, { titulo: string; descripcion: string }> = {
  productos: { titulo: "Catálogo de productos", descripcion: "Consulta, búsqueda y edición de inventario" },
  ventas: { titulo: "Ventas", descripcion: "Registra lo que se vendió y el inventario se actualiza solo" },
};

const POR_PAGINA = 5;

export default function App() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_INICIALES);
  const [ventas, setVentas] = useState<Venta[]>(VENTAS_INICIALES);
  const [vista, setVista] = useState<Vista>("productos");
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<string>("Todas");
  const [pagina, setPagina] = useState(1);
  const [edicion, setEdicion] = useState<Edicion>(null);
  const [porBorrar, setPorBorrar] = useState<Producto | null>(null);
  const [ventaAbierta, setVentaAbierta] = useState(false);
  const [sesion, setSesion] = useState<Usuario | null>(null);

  const visibles = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return productos.filter(
      (p) =>
        (categoria === "Todas" || p.categoria === categoria) &&
        (!t || p.nombre.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t)),
    );
  }, [productos, busqueda, categoria]);

  const totalPaginas = Math.max(1, Math.ceil(visibles.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const enPagina = visibles.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const guardar = (datos: ProductoNuevo, id?: number) => {
    if (id !== undefined) {
      setProductos((lista) => lista.map((p) => (p.id === id ? { ...datos, id } : p)));
    } else {
      setProductos((lista) => [...lista, { ...datos, id: Math.max(0, ...lista.map((p) => p.id)) + 1 }]);
    }
    setEdicion(null);
  };

  const borrar = () => {
    if (!porBorrar) return;
    setProductos((lista) => lista.filter((p) => p.id !== porBorrar.id));
    setPorBorrar(null);
  };

  // Provisional: en la versión final, el backend hace este descuento dentro de una transacción.
  const registrarVenta = (items: ItemVenta[]) => {
    setProductos((lista) =>
      lista.map((p) => {
        const item = items.find((i) => i.productoId === p.id);
        return item ? { ...p, stock: p.stock - item.cantidad } : p;
      }),
    );
    setVentas((lista) => [
      ...lista,
      { id: Math.max(0, ...lista.map((v) => v.id)) + 1, fecha: new Date().toISOString(), items, anulada: false },
    ]);
  };

  const anularVenta = (id: number) => {
    const venta = ventas.find((v) => v.id === id);
    if (!venta || venta.anulada) return;
    setProductos((lista) =>
      lista.map((p) => {
        const item = venta.items.find((i) => i.productoId === p.id);
        return item ? { ...p, stock: p.stock + item.cantidad } : p;
      }),
    );
    setVentas((lista) => lista.map((v) => (v.id === id ? { ...v, anulada: true } : v)));
  };

  const cerrarSesion = () => {
    setSesion(null);
    setVista("productos");
    setEdicion(null);
    setPorBorrar(null);
    setVentaAbierta(false);
  };

  if (!sesion) return <Login onEntrar={setSesion} />;

  const campo =
    "rounded-xl border border-field-line bg-field px-3.5 py-2.5 text-ink focus:outline-2 focus:outline-accent";

  return (
    <div className="min-h-dvh md:flex">
      <aside className="rounded-b-3xl bg-gradient-to-b from-[#2f63d6] to-[#16358a] p-3 text-white md:sticky md:top-0 md:m-4 md:flex md:h-[calc(100dvh-2rem)] md:w-60 md:shrink-0 md:flex-col md:rounded-3xl md:p-4 md:shadow-neu">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 px-1 text-lg font-semibold tracking-tight md:px-3 md:pt-2 md:pb-4">
            <FiShoppingBag size={20} /> Mi tienda
          </p>
          <div className="flex items-center gap-2 md:hidden">
            <span className="grid size-9 place-items-center rounded-full bg-white/20" aria-hidden="true">
              <FiUser size={18} />
            </span>
            <span className="hidden max-w-36 truncate text-sm font-medium sm:block">{sesion.nombre}</span>
            <button
              onClick={cerrarSesion}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="grid size-10 place-items-center rounded-xl text-white/85 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>

        <nav aria-label="Secciones" className="mt-3 grid grid-cols-2 gap-2 md:mt-0 md:flex md:flex-col">
          {MENU.map(({ id, etiqueta, Icono }) => {
            const activo = vista === id;
            return (
              <button
                key={id}
                onClick={() => setVista(id)}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-3 font-medium transition-shadow focus-visible:outline-2 focus-visible:outline-white md:justify-start md:text-left ${
                  activo
                    ? "bg-black/15 text-white shadow-[inset_3px_3px_8px_rgba(0,0,0,.35),inset_-2px_-2px_6px_rgba(255,255,255,.15)]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Icono size={18} /> {etiqueta}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto hidden md:block">
          <div className="flex items-center gap-3 px-3 pb-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/20" aria-hidden="true">
              <FiUser size={20} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{sesion.nombre}</p>
              <p className="text-xs text-white/70 capitalize">{sesion.rol}</p>
            </div>
          </div>
          <button
            onClick={cerrarSesion}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-medium text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <FiLogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 pt-4 pb-12 md:px-6 md:pt-6">
        <div className="mx-auto max-w-5xl 2xl:max-w-7xl">
          <div className="mb-4 rounded-2xl px-4 py-2.5 text-sm text-muted shadow-neu-in">
            Versión de muestra: los datos son de ejemplo y no se guardan al recargar la página.
          </div>

          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{TITULOS[vista].titulo}</h1>
              <p className="text-sm text-muted">{TITULOS[vista].descripcion}</p>
            </div>
            <button
              onClick={() => (vista === "productos" ? setEdicion({ producto: null }) : setVentaAbierta(true))}
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold sm:w-auto"
            >
              <FiPlus size={18} /> {vista === "productos" ? "Nuevo producto" : "Agregar venta"}
            </button>
          </header>

          {vista === "ventas" ? (
            <PanelVentas
              productos={productos}
              ventas={ventas}
              formularioAbierto={ventaAbierta}
              onCerrarFormulario={() => setVentaAbierta(false)}
              onRegistrar={registrarVenta}
              onAnular={anularVenta}
            />
          ) : (
            <>
              <div className="mb-3 flex flex-wrap gap-2">
                <div className="relative w-full min-w-0 flex-1 sm:min-w-56">
                  <FiSearch className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    aria-label="Buscar"
                    placeholder="Buscar por nombre o código"
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      setPagina(1);
                    }}
                    className={`${campo} w-full pl-10`}
                  />
                </div>
                <select
                  aria-label="Categoría"
                  value={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    setPagina(1);
                  }}
                  className={`${campo} w-full sm:w-auto`}
                >
                  <option>Todas</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <p className="mb-2 text-sm text-muted">
                {visibles.length} de {productos.length} productos
              </p>

              <TablaProductos
                productos={enPagina}
                onEditar={(p) => setEdicion({ producto: p })}
                onBorrar={setPorBorrar}
              />
              <Paginacion total={visibles.length} pagina={paginaActual} porPagina={POR_PAGINA} onCambiar={setPagina} />
            </>
          )}
        </div>
      </main>

      {edicion && (
        <FormularioProducto
          producto={edicion.producto}
          onGuardar={guardar}
          onCancelar={() => setEdicion(null)}
        />
      )}
      {porBorrar && (
        <ConfirmarBorrado producto={porBorrar} onConfirmar={borrar} onCancelar={() => setPorBorrar(null)} />
      )}
    </div>
  );
}
