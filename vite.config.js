import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Export files 
export default defineConfig({
  //pluggins
  plugins: [react()],
  server: {
    allowedHosts: ["provision-improving-dont-distance.trycloudflare.com"],
  },
});
