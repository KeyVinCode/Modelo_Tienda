import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  total: number;
  pagina: number;
  porPagina: number;
  onCambiar: (pagina: number) => void;
}

// Con muchas páginas muestra la primera, la última y las cercanas a la actual.
function numeros(actual: number, totalPaginas: number): (number | "…")[] {
  if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  const visibles = [...new Set([1, totalPaginas, actual - 1, actual, actual + 1])]
    .filter((n) => n >= 1 && n <= totalPaginas)
    .sort((a, b) => a - b);
  const resultado: (number | "…")[] = [];
  visibles.forEach((n, i) => {
    if (i > 0 && n - visibles[i - 1] > 1) resultado.push("…");
    resultado.push(n);
  });
  return resultado;
}

const base =
  "grid size-9 place-items-center rounded-xl bg-base text-sm font-medium transition-shadow focus-visible:outline-2 focus-visible:outline-accent";

export default function Paginacion({ total, pagina, porPagina, onCambiar }: Props) {
  if (total === 0) return null;

  const totalPaginas = Math.ceil(total / porPagina);
  const desde = (pagina - 1) * porPagina + 1;
  const hasta = Math.min(pagina * porPagina, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">
        Mostrando {desde}–{hasta} de {total}
      </p>

      {totalPaginas > 1 && (
        <nav aria-label="Paginación" className="flex items-center gap-2">
          <button
            onClick={() => onCambiar(pagina - 1)}
            disabled={pagina === 1}
            aria-label="Página anterior"
            className={`${base} text-accent shadow-neu-sm active:shadow-neu-in disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <FiChevronLeft size={18} />
          </button>

          {numeros(pagina, totalPaginas).map((n, i) =>
            n === "…" ? (
              <span key={`e${i}`} className="px-1 text-muted" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => onCambiar(n)}
                aria-label={`Página ${n}`}
                aria-current={n === pagina ? "page" : undefined}
                className={`${base} ${n === pagina ? "font-semibold text-accent shadow-neu-in" : "text-muted shadow-neu-sm"}`}
              >
                {n}
              </button>
            ),
          )}

          <button
            onClick={() => onCambiar(pagina + 1)}
            disabled={pagina === totalPaginas}
            aria-label="Página siguiente"
            className={`${base} text-accent shadow-neu-sm active:shadow-neu-in disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <FiChevronRight size={18} />
          </button>
        </nav>
      )}
    </div>
  );
}
