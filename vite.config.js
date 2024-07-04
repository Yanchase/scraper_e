import { defineConfig } from "vite";
import postcss from "./postcss.config.cjs";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  css: {
    postcss,
  },
  plugins: [react()],
  server: {
    proxy: {
      "/scrape": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scrape/, "/scrape"),
      },
      "/emails": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/emails/, "/emails"),
      },
    },
    port: process.env.PORT || 3000,
  },
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
