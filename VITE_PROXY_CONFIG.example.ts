/**
 * Vite Proxy Configuration for Development
 * 
 * This shows how to proxy API calls to your backend during development.
 * 
 * Add this to your vite.config.ts in the defineConfig function:
 */

// Example: Complete vite.config.ts with proxy setup
/*
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
        target: "http://localhost:3001", // Your backend server
        changeOrigin: true,
        rewrite: (path) => path, // Keep the /api prefix
        // Optional: Add headers or other proxy options
        // headers: {
        //   "X-Custom-Header": "value",
        // },
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
*/

// Key Points:
// 1. Set target to your backend URL (http://localhost:3001)
// 2. changeOrigin: true allows the proxy to work with CORS
// 3. The rewrite function can modify paths if needed
// 4. During development, /api/consultation will be proxied to http://localhost:3001/api/consultation

// To use this:
// 1. Start your backend: npm run server
// 2. Start your frontend: npm run dev
// 3. Frontend will proxy API calls to backend automatically
