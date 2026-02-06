/**
 * HOW TO ADD API PROXY TO vite.config.ts
 * 
 * Add the 'proxy' configuration to the server object.
 * This allows frontend calls to /api/* to be proxied to your backend.
 */

// Add this to your vite.config.ts server configuration:

/*
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // ADD THIS PROXY CONFIGURATION:
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Your backend server URL
        changeOrigin: true,
      },
    },
  },
  // ... rest of config
}));
*/

// Example complete vite.config.ts:
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // API Proxy Configuration
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
