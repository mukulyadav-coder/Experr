import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  //pluggins
  plugins: [react()],
  server: {
    allowedHosts: ["provision-improving-dont-distance.trycloudflare.com"],
  },
});
