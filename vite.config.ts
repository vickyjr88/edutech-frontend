import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import envCompatible from "vite-plugin-env-compatible";
import 'dotenv/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: parseInt(process.env.PORT || '80'),
  },
  preview: {
    host: "::",
    port: parseInt(process.env.PORT || '80'),
    allowedHosts: ['demo.kidato.com', 'localhost', '127.0.0.1'],
  },
  plugins: [
    react(),
    envCompatible(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: '/',
}));
