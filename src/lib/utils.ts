import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
//@ts-ignore
import { BareMuxConnection } from "@mercuryworkshop/bare-mux"
import { RammerheadEncode } from "../../public/~/rh.mjs"
import $ from "jquery"
//there i fixed it
//no the current working directory is lib which is inside src
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Ensure `input` is properly initialized
const form = document.getElementById("uv-form");
export const address = document.getElementById("uv-address") as HTMLInputElement | null;
export const input = document.querySelector("input") as HTMLInputElement | null;
export const connection = new BareMuxConnection("/baremux/worker.js");

export const proxySetting: string = localStorage.getItem("proxy") ?? 'uv';

interface SwConfig {
  file: string;
  config: any;
}

export declare const __uv$config: any;
export declare const $scramjet: { config: any };
export declare const __meteor$config: any;
export declare const api: { proxy: { crypts: { encode: (url: string) => string } } };
export const swConfig = {
  uv: { file: '/&/sw.js', config: __uv$config },
  sj: { file: '/$/sw.js', config: $scramjet.config },
  mt: { file: '/!/sw.js', config: __meteor$config }
};

export const { file: swFile, config: swConfigSettings } = swConfig[proxySetting] ?? { file: '/&/sw.js', config: __uv$config };

export const defWisp: string = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
export const wispUrl: string = localStorage.getItem("wisp") || defWisp;
export const bareUrl: string = localStorage.getItem("bare") || "/bare/";

export function searchProxy() {
  console.log("search proxy function is now triggered.");
  if (localStorage.getItem("proxy") === "rammerhead") {
    address?.addEventListener('keydown', async function (event: KeyboardEvent) {
      event.preventDefault();
      if (event.key === 'Enter') {
        const encodedUrl: string = await RammerheadEncode(search(address?.value ?? ''));
        sessionStorage.setItem("encodedUrl", encodedUrl);
        localStorage.setItem("documentClassList", document.documentElement.classList.toString())
        location.href = "/go";
      }
    });
  } else {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(async () => {
        await setTransports();
      });
      navigator.serviceWorker.register(swFile, { scope: swConfigSettings.prefix })
        .then(async (registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          await setTransports();
          $("#uv-address").on("keypress", async function(e){
            if (e && e.which === 13) {
              await setTransports();
              const encodedUrl: string = swConfigSettings.prefix + __uv$config.encodeUrl(search(address?.value ?? ''));
              sessionStorage.setItem("encodedUrl", encodedUrl);
              localStorage.setItem("documentClassList", document.documentElement.classList.toString())
              location.href = "/go";
            }
          });
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed:', error);
        });
    }
  }
}

export async function setTransports(): Promise<void> {
  const transports: string = localStorage.getItem("transports") || "epoxy";
  if (transports === "epoxy") {
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
  } else if (transports === "libcurl") {
    await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
  } else if (transports === "bare") {
    await connection.setTransport("/baremod/index.mjs", [bareUrl]);
  } else {
    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
  }
}

// Search function definition
export function search(input: string): string {
  input = (input || '').trim();  // Ensure input is not undefined
  const searchTemplate: string = localStorage.getItem("search") || 'https://google.com/search?q=%s';

  try {
    return new URL(input).toString();
  } catch (err) {
    try {
      const url = new URL(`http://${input}`);
      if (url.hostname.includes(".")) {
        return url.toString();
      }
      throw new Error('Invalid hostname');
    } catch (err) {
      return searchTemplate.replace("%s", encodeURIComponent(input));
    }
  }
}
