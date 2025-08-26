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
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.intercomcdn.com https://kidato-images.s3.eu-west-1.amazonaws.com https://maps.googleapis.com https://cdn.gpteng.co https://js.stripe.com https://js.basistheory.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://127.0.0.1:* http://localhost:* https: wss:; frame-src 'self' https:",
    },
  },
  preview: {
    host: "::",
    port: parseInt(process.env.PORT || '80'),
    allowedHosts: ['demo.kidato.com', 'localhost', '127.0.0.1'],
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.intercomcdn.com https://kidato-images.s3.eu-west-1.amazonaws.com https://maps.googleapis.com https://cdn.gpteng.co https://js.stripe.com https://js.basistheory.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://127.0.0.1:* http://localhost:* https: wss:; frame-src 'self' https:",
    },
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
