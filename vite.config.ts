import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// En GitHub Pages el sitio vive en https://usuario.github.io/nombre-del-repo/,
// por eso el workflow define VITE_BASE con esa ruta. En local se usa "/".
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
});
