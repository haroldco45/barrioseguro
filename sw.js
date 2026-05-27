const CACHE_NAME = 'alerta-vecinal-v1';

// Recursos locales indispensables para que la PWA funcione offline de forma óptima
const assets = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './sw.js'
];

// Evento de Instalación: Descarga y almacenamiento en caché de los archivos base
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caché abierto correctamente.');
      return cache.addAll(assets);
    })
  );
});

// Evento de Activación: Limpieza de cachés antiguos si se actualiza la versión
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Evento Fetch: Estrategia Cache-First (Responde desde caché; si no existe, va a la red)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // Opcional: Aquí podrías retornar una página offline genérica si falla la red
        console.error('Recurso no encontrado en red ni en caché:', e.request.url);
      });
    })
  );
});
