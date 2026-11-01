# Catálogo de productos

Front de muestra para una tienda pequeña: catálogo de productos con búsqueda, filtro y paginación, registro de ventas con descuento de inventario, e inicio de sesión. Hecho con React 19, TypeScript, Vite, Tailwind CSS 4 y react-icons. Gestor de paquetes: pnpm.

> **Versión de muestra.** Los datos son de ejemplo y viven en el navegador. El login es provisional: las cuentas están en el código. No uses datos reales ni contraseñas reales hasta tener el backend.

## Comandos

```bash
pnpm install   # instalar dependencias
pnpm dev       # servidor de desarrollo
pnpm build     # revisar tipos y compilar para producción (carpeta dist)
pnpm preview   # ver la compilación en local
```

Acceso de prueba: usuario `admin` o `empleado`, contraseña `demo1234`.

## Estructura

- `src/App.tsx`: pantalla principal, menú lateral, búsqueda, filtro, paginación y estado.
- `src/components/`: tabla, formularios, ventas, login, paginación y ventana modal.
- `src/lib/`: datos de ejemplo, formatos y autenticación provisional (`auth.ts`).
- `src/index.css`: colores y sombras del tema. Para aplicar los colores corporativos cambia `--color-accent` y `--color-base`.
- `.github/workflows/deploy.yml`: compila y publica en GitHub Pages.

## Publicar en GitHub Pages

1. Crea un repositorio vacío en GitHub (por ejemplo `catalogo-productos`).
2. Sube el proyecto:

   ```bash
   git init
   git add .
   git commit -m "Primera versión del catálogo"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/catalogo-productos.git
   git push -u origin main
   ```

3. En GitHub entra a **Settings → Pages** y, en **Source**, elige **GitHub Actions**.
4. Cada vez que hagas `push` a `main`, el workflow compila y publica el sitio. Queda en:

   `https://TU_USUARIO.github.io/catalogo-productos/`

El workflow calcula solo la ruta base según el nombre del repositorio. Si renombras el repositorio, el sitio se ajusta en el siguiente despliegue. Para probar en local con la misma ruta: `VITE_BASE=/catalogo-productos/ pnpm build && pnpm preview`.

### Antes de publicar

- GitHub Pages es **público**: cualquiera con el enlace puede ver el sitio y leer el código compilado, incluidas las cuentas de prueba.
- No guardes secretos en este proyecto. Las variables `VITE_*` terminan visibles en el navegador.
- El archivo `.env` ya está en `.gitignore`.

## Pendiente

Backend (Node + Express + PostgreSQL), login real con sesiones en cookie `httpOnly`, roles validados en el servidor y conexión de este front con la API.
