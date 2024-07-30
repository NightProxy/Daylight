importScripts('/@/uv.bundle.js');
importScripts('/@/uv.config.js');
importScripts(__uv$config.sw || '/@/uv.sw.js');

const uv = new UVServiceWorker();

async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }
    
    return await fetch(event.request)
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});