// vite.config.ts
import million from "file:///workspaces/Daylight/node_modules/million/dist/packages/compiler.mjs";
import { defineConfig } from "file:///workspaces/Daylight/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///workspaces/Daylight/node_modules/vite-plugin-static-copy/dist/index.js";
import { uvPath } from "file:///workspaces/Daylight/node_modules/@titaniumnetwork-dev/ultraviolet/lib/index.cjs";
import { epoxyPath } from "file:///workspaces/Daylight/node_modules/@mercuryworkshop/epoxy-transport/lib/index.cjs";
import { libcurlPath } from "file:///workspaces/Daylight/node_modules/@mercuryworkshop/libcurl-transport/lib/index.cjs";
import path from "path";
import react from "file:///workspaces/Daylight/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { terser } from "file:///workspaces/Daylight/node_modules/rollup-plugin-terser/rollup-plugin-terser.mjs";
import { meteorPath } from "file:///workspaces/Daylight/node_modules/meteorproxy/lib/index.cjs";
var __dirname = path.resolve();
function isErrorWithCause(log) {
  return log.cause && typeof log.cause.message === "string";
}
var vite_config_default = defineConfig({
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
          overwrite: false
        },
        {
          src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false
        }
      ]
    }),
    million.vite({ auto: true }),
    react(),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      output: {
        comments: false
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3e3,
    watch: {
      usePolling: true
    },
    proxy: {
      "/bare/": {
        target: "http://localhost:8080/bare/",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/bare\//, "")
      },
      "/wisp/": {
        target: "http://localhost:8080/wisp/",
        changeOrigin: true,
        ws: true,
        rewrite: (path2) => path2.replace(/^\/wisp\//, "")
      }
    }
  },
  build: {
    sourcemap: true,
    assetsInlineLimit: 8192,
    cssCodeSplit: true,
    minify: terser,
    rollupOptions: {
      output: {
        entryFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.includes("index")) {
            return "assets/js/index.js";
          }
          return "assets/js/[name].[hash].js";
        },
        chunkFileNames: "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/css/index.css";
          }
          if (assetInfo.name && assetInfo.name.includes("lucide")) {
            return `assets/icons/lucide${path.extname(assetInfo.name)}`;
          }
          return "assets/[name].[hash][extname]";
        }
      },
      onLog(level, log, handler) {
        if (isErrorWithCause(log) && log.cause.message === `Can't resolve original location of error.`) {
          return;
        }
        handler(level, log);
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9EYXlsaWdodFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3dvcmtzcGFjZXMvRGF5bGlnaHQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3dvcmtzcGFjZXMvRGF5bGlnaHQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgbWlsbGlvbiBmcm9tIFwibWlsbGlvbi9jb21waWxlclwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHZpdGVTdGF0aWNDb3B5IH0gZnJvbSBcInZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5XCI7XG5pbXBvcnQgeyB1dlBhdGggfSBmcm9tIFwiQHRpdGFuaXVtbmV0d29yay1kZXYvdWx0cmF2aW9sZXRcIjtcbmltcG9ydCB7IGR5bmFtaWNQYXRoIH0gZnJvbSBcIkBuZWJ1bGEtc2VydmljZXMvZHluYW1pY1wiO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgZXBveHlQYXRoIH0gZnJvbSBcIkBtZXJjdXJ5d29ya3Nob3AvZXBveHktdHJhbnNwb3J0XCI7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgeyBsaWJjdXJsUGF0aCB9IGZyb20gXCJAbWVyY3VyeXdvcmtzaG9wL2xpYmN1cmwtdHJhbnNwb3J0XCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgdGVyc2VyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi10ZXJzZXInO1xuaW1wb3J0IHsgbWV0ZW9yUGF0aCB9IGZyb20gXCJtZXRlb3Jwcm94eVwiXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLnJlc29sdmUoKTtcblxuZnVuY3Rpb24gaXNFcnJvcldpdGhDYXVzZShsb2c6IGFueSk6IGxvZyBpcyB7IGNhdXNlOiB7IG1lc3NhZ2U6IHN0cmluZyB9IH0ge1xuICByZXR1cm4gbG9nLmNhdXNlICYmIHR5cGVvZiAobG9nLmNhdXNlIGFzIHsgbWVzc2FnZTogc3RyaW5nIH0pLm1lc3NhZ2UgPT09ICdzdHJpbmcnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgdGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBgJHt1dlBhdGh9LyoqLypgLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpLFxuICAgICAgICAgIGRlc3Q6IFwidXZcIixcbiAgICAgICAgICBvdmVyd3JpdGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6IGAke2Vwb3h5UGF0aH0vKiovKmAucmVwbGFjZSgvXFxcXC9nLCBcIi9cIiksXG4gICAgICAgICAgZGVzdDogXCJlcG94eVwiLFxuICAgICAgICAgIG92ZXJ3cml0ZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogYCR7bWV0ZW9yUGF0aH0vbWV0ZW9yLipgLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpLFxuICAgICAgICAgIGRlc3Q6IFwibWV0ZW9yXCIsXG4gICAgICAgICAgb3ZlcndyaXRlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogYCR7bGliY3VybFBhdGh9LyoqLypgLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpLFxuICAgICAgICAgIGRlc3Q6IFwibGliY3VybFwiLFxuICAgICAgICAgIG92ZXJ3cml0ZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICBcbiAgICAgIF1cbiAgICB9KSxcbiAgICBtaWxsaW9uLnZpdGUoeyBhdXRvOiB0cnVlIH0pLFxuICAgIHJlYWN0KCksXG4gICAgdGVyc2VyKHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY29tbWVudHM6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9XG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgd2F0Y2g6IHtcbiAgICAgIHVzZVBvbGxpbmc6IHRydWVcbiAgICB9LFxuICAgIHByb3h5OiB7XG4gICAgICBcIi9iYXJlL1wiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjgwODAvYmFyZS9cIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYmFyZVxcLy8sIFwiXCIpXG4gICAgICB9LFxuICAgICAgXCIvd2lzcC9cIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3dpc3AvXCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC93aXNwXFwvLywgXCJcIilcbiAgICAgIH0sXG4gICAgfVxuICB9LFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogODE5MixcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgbWluaWZ5OiB0ZXJzZXIsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBhc3NldEluZm8gPT4ge1xuICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSAmJiBhc3NldEluZm8ubmFtZS5pbmNsdWRlcygnaW5kZXgnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdhc3NldHMvanMvaW5kZXguanMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9qcy9bbmFtZV0uW2hhc2hdLmpzJztcbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLltoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBhc3NldEluZm8gPT4ge1xuICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSAmJiBhc3NldEluZm8ubmFtZS5lbmRzV2l0aCgnLmNzcycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9jc3MvaW5kZXguY3NzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lICYmIGFzc2V0SW5mby5uYW1lLmluY2x1ZGVzKCdsdWNpZGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvaWNvbnMvbHVjaWRlJHtwYXRoLmV4dG5hbWUoYXNzZXRJbmZvLm5hbWUpfWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnYXNzZXRzL1tuYW1lXS5baGFzaF1bZXh0bmFtZV0nO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9uTG9nKGxldmVsLCBsb2csIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGlzRXJyb3JXaXRoQ2F1c2UobG9nKSAmJiBsb2cuY2F1c2UubWVzc2FnZSA9PT0gYENhbid0IHJlc29sdmUgb3JpZ2luYWwgbG9jYXRpb24gb2YgZXJyb3IuYCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVyKGxldmVsLCBsb2cpO1xuICAgICAgfSxcbiAgICB9XG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOE8sT0FBTyxhQUFhO0FBQ2xRLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMsY0FBYztBQUd2QixTQUFTLGlCQUFpQjtBQUUxQixTQUFTLG1CQUFtQjtBQUM1QixPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsY0FBYztBQUN2QixTQUFTLGtCQUFrQjtBQUMzQixJQUFNLFlBQVksS0FBSyxRQUFRO0FBRS9CLFNBQVMsaUJBQWlCLEtBQWlEO0FBQ3pFLFNBQU8sSUFBSSxTQUFTLE9BQVEsSUFBSSxNQUE4QixZQUFZO0FBQzVFO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1A7QUFBQSxVQUNFLEtBQUssR0FBRyxNQUFNLFFBQVEsUUFBUSxPQUFPLEdBQUc7QUFBQSxVQUN4QyxNQUFNO0FBQUEsVUFDTixXQUFXO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUssR0FBRyxTQUFTLFFBQVEsUUFBUSxPQUFPLEdBQUc7QUFBQSxVQUMzQyxNQUFNO0FBQUEsVUFDTixXQUFXO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUssR0FBRyxVQUFVLFlBQVksUUFBUSxPQUFPLEdBQUc7QUFBQSxVQUNoRCxNQUFNO0FBQUEsVUFDTixXQUFXO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUssR0FBRyxXQUFXLFFBQVEsUUFBUSxPQUFPLEdBQUc7QUFBQSxVQUM3QyxNQUFNO0FBQUEsVUFDTixXQUFXO0FBQUEsUUFDYjtBQUFBLE1BRUY7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFFBQVEsS0FBSyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBQUEsSUFDM0IsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFVBQVU7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsTUFDQSxVQUFVO0FBQUEsUUFDUixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxJQUFJO0FBQUEsUUFDSixTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxhQUFhLEVBQUU7QUFBQSxNQUNqRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxtQkFBbUI7QUFBQSxJQUNuQixjQUFjO0FBQUEsSUFDZCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0IsZUFBYTtBQUMzQixjQUFJLFVBQVUsUUFBUSxVQUFVLEtBQUssU0FBUyxPQUFPLEdBQUc7QUFDdEQsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0IsZUFBYTtBQUMzQixjQUFJLFVBQVUsUUFBUSxVQUFVLEtBQUssU0FBUyxNQUFNLEdBQUc7QUFDckQsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FBSSxVQUFVLFFBQVEsVUFBVSxLQUFLLFNBQVMsUUFBUSxHQUFHO0FBQ3ZELG1CQUFPLHNCQUFzQixLQUFLLFFBQVEsVUFBVSxJQUFJLENBQUM7QUFBQSxVQUMzRDtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU0sT0FBTyxLQUFLLFNBQVM7QUFDekIsWUFBSSxpQkFBaUIsR0FBRyxLQUFLLElBQUksTUFBTSxZQUFZLDZDQUE2QztBQUM5RjtBQUFBLFFBQ0Y7QUFDQSxnQkFBUSxPQUFPLEdBQUc7QUFBQSxNQUNwQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
