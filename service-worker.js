// service-worker.js
// Estrategia:
//  - Shell de la app (html/css/js/imagenes)  -> cache-first
//  - JSON de datos (config/menus/data)       -> network-first con fallback a cache
//
// IMPORTANTE: cada vez que cambies un fichero del "shell" (css, js, html),
// sube también la versión de CACHE_VERSION para forzar la actualización
// en los dispositivos de los usuarios.

const CACHE_VERSION = "v0.02";

const SHELL_CACHE = `ldrv-shell-${CACHE_VERSION}`;
const DATA_CACHE = `ldrv-data-${CACHE_VERSION}`;

// Rutas relativas al scope del service worker (raíz del repo en GitHub Pages)
const SHELL_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/bootstrap.min.css",
    "./css/app.css",
    "./js/bootstrap.bundle.min.js",
    "./js/app.js",
    "./js/menu-engine.js",
    "./assets/images/logo.png",
    "./assets/images/escudo.png"
];


self.addEventListener("install", (event) => {

    event.waitUntil(
        caches
            .open(SHELL_CACHE)
            .then((cache) => cache.addAll(SHELL_FILES))
            .then(() => self.skipWaiting())
    );

});


self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== SHELL_CACHE && key !== DATA_CACHE)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );

});


// Los JSON de datos (menú y contenidos) viven en estas carpetas
function isDataRequest(url) {

    return (
        url.pathname.includes("/config/") ||
        url.pathname.includes("/menus/") ||
        url.pathname.includes("/data/")
    );

}


self.addEventListener("fetch", (event) => {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Solo gestionamos peticiones del mismo origen
    if (url.origin !== self.location.origin) {
        return;
    }


    if (isDataRequest(url)) {

        // NETWORK-FIRST: intenta traer datos frescos; si falla (offline),
        // sirve la última copia guardada en caché.
        event.respondWith(

            fetch(request)
                .then((response) => {

                    const responseClone = response.clone();

                    caches
                        .open(DATA_CACHE)
                        .then((cache) => cache.put(request, responseClone));

                    return response;

                })
                .catch(() => caches.match(request))

        );

        return;

    }


    // CACHE-FIRST: para el shell de la app (html, css, js, imágenes)
    event.respondWith(

        caches
            .match(request)
            .then((cachedResponse) => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request).then((response) => {

                    const responseClone = response.clone();

                    caches
                        .open(SHELL_CACHE)
                        .then((cache) => cache.put(request, responseClone));

                    return response;

                });

            })

    );

});