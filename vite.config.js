import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005, // Asegurándonos de usar este puerto
    open: true, // Que abra automáticamente la app en el navegador
  },
});
