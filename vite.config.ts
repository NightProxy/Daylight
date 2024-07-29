import million from "million/compiler";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
// @ts-ignore
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
// @ts-ignore
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import path from "path";
import react from "@vitejs/plugin-react";
import { terser } from 'rollup-plugin-terser';
import { meteorPath } from "meteorproxy"
import postcss from 'postcss';
const __dirname = path.resolve();

function isErrorWithCause(log: any): log is { cause: { message: string } } {
  return log.cause && typeof (log.cause as { message: string }).message === 'string';
}

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `${uvPath}/**/*`.replace(/\\/g, "/"),
          dest: "uv",
          overwrite: false
        },
        {
          src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
          dest: "epoxy",
          overwrite: false
        },
        {
          src: `${meteorPath}/meteor.*`.replace(/\\/g, "/"),
          dest: "meteor",
          overwrite: false,
        },
        {
          src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false
        },
       
      ]
    }),
    million.vite({ auto: true }),
    react(),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      output: {
        comments: false,
      },
    }),
    {
      ...postcss(),
      apply: 'build',
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    port: 8080,
    watch: {
      usePolling: true
    },
    proxy: {
      "/bare/": {
        target: "http://localhost:8080/bare/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bare\//, "")
      },
      "/wisp/": {
        target: "http://localhost:8080/wisp/",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/wisp\//, "")
      },
    }
  },
  build: {
    sourcemap: true,
    assetsInlineLimit: 8192,
    cssCodeSplit: true,
    minify: terser,
    rollupOptions: {
      output: {
        entryFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.includes('index')) {
            return 'assets/js/index.js';
          }
          return 'assets/js/[name].[hash].js';
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/index.css';
          }
          if (assetInfo.name && assetInfo.name.includes('lucide')) {
            return `assets/icons/lucide${path.extname(assetInfo.name)}`;
          }
          return 'assets/[name].[hash][extname]';
        },
      },
      onLog(level, log, handler) {
        if (isErrorWithCause(log) && log.cause.message === `Can't resolve original location of error.`) {
          return;
        }
        handler(level, log);
      },
    }
  },
});
