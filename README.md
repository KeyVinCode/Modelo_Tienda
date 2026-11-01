# Catálogo de productos

Front de muestra hecho con React 19, TypeScript, Vite, Tailwind CSS 4 y react-icons. Gestor de paquetes: pnpm.

## Comandos

```bash
pnpm install   # instalar dependencias
pnpm dev       # servidor de desarrollo
pnpm build     # revisar tipos y compilar para producción
pnpm preview   # ver la compilación
```

## Estructura

- `src/App.tsx`: pantalla principal, búsqueda, filtro y estado de los productos.
- `src/components/`: tabla, formulario, confirmación de borrado, ventana modal y `PanelVentas` (registro de ventas, historial y anulación).
- `src/lib/data.ts`: datos de ejemplo (se reemplazarán por llamadas a la API).
- `src/index.css`: colores y sombras del tema (`@theme`). Para aplicar los colores corporativos, cambia `--color-accent` y `--color-base`.

## Pendiente

Backend (Node + Express + PostgreSQL), login, roles y conexión de este front con la API.
