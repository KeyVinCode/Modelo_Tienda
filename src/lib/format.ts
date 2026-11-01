const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const formatearPrecio = (valor: number) => copFormatter.format(valor);

const fechaFormatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });

export const formatearFecha = (iso: string) => fechaFormatter.format(new Date(iso));
