import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Dev server tüm IP’lerden erişilebilir
    host: true,
    port: 8080,
    strictPort: true,
    // Allowed hosts dev için
    allowedHosts: ["user-om5z.onrender.com"],
  },
  preview: {
    // preview komutu için
    allowedHosts: ["user-om5z.onrender.com"],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
