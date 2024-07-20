import path from "path";
import react from "@vitejs/plugin-react";
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from "vite";
function isErrorWithCause(log: any): log is { cause: { message: string } } {
  return log.cause && typeof log.cause.message === 'string';
}
export default defineConfig({
  plugins: [react(), terser({
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
    output: {
      comments: false,
    },
  }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true
    }
  },
  build: {
    sourcemap: true,
    assetsInlineLimit: 8192,
    cssCodeSplit: true,
    minify: terser,
    rollupOptions: {
      onLog(level, log, handler) {
        if (isErrorWithCause(log) && log.cause.message === `Can't resolve original location of error.`) {
          return;
        }
        handler(level, log);
      },
    }
  },
});
