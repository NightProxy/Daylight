
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
    //we're using the direct paths instead of the exported uvPath epoxyPath etc because typescript support for some is weird
    viteStaticCopy({
      targets: [ 
        {
          src: `node_modules/@titaniumnetwork-dev/ultraviolet/dist/**/*`.replace(/\\/g, "/"),
          dest: "&",
          overwrite: false
        },
        {
          src: `node_modules/@mercuryworkshop/epoxy-transport/dist/**/*`.replace(/\\/g, "/"),
          dest: "epoxy",
          overwrite: false
        },
        {
          src: `node_modules/meteorproxy/dist/meteor.*`.replace(/\\/g, "/"),
          dest: "!",
          overwrite: false,
        },
        {
          src: `node_modules/@mercuryworkshop/libcurl-transport/dist/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false
        },
        {
          src: `node_modules/@mercuryworkshop/bare-mux/dist/*.js.*`.replace(/\\/g, '/'),
          dest: 'baremux',
          overwrite: false
        },
        {
          src: `node_modules/@mercuryworkshop/bare-mux/dist/*.js`.replace(/\\/g, "/"),
          dest: 'baremux',
          overwrite: false
        },
        //for that one index.mjs lmao
        {
          src: `node_modules/@mercuryworkshop/bare-mux/dist/*.mjs`.replace(/\\/g, "/"),
          dest: "baremux",
          overwrite: false
        }
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
          },
     
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
