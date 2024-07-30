
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
// @ts-ignore
import { baremuxPath } from '@mercuryworkshop/bare-mux/node'
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
          dest: "&",
          overwrite: false
        },
        {
          src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
          dest: "epoxy",
          overwrite: false
        },
        {
          src: `${meteorPath}/meteor.*`.replace(/\\/g, "/"),
          dest: "!",
          overwrite: false,
        },
        {
          src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false
        },
        {
          src: `${baremuxPath}/**/*`.replace(/\\/g, '/'),
          dest: 'baremux',
          overwrite: false
        } //yes 
        //we dont need we have server remember
        //doesnt it already static the library through express
        //ohhhh okay makes sense
      ]
    }),
    ,
    react(),
    terser({
      compress: {
        
        drop_debugger: true,
      },
      output: {
        comments: false,
      },
    }),
    
    
    {
      name: 'add-defer-to-links',
      enforce: 'post',
      transformIndexHtml(html: string) {
        return html.replace(
          /<link (.*?)>/g,
          (match: any, attributes: string | string[]) => {
            if (!attributes.includes('defer') && !attributes.includes('rel="preload"') && !attributes.includes('rel="prefetch"')) {
              return `<link ${attributes} defer>`;
            }
            return match;
          }
        );
      },
    } as unknown as Plugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    host: "0.0.0.0",
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
          if (assetInfo.name && assetInfo.name.includes('lucide')) {
            return `assets/icons/lucide${path.extname(assetInfo.name)}`;
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
