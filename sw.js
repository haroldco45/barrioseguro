const CACHE_NAME = 'alerta-vecinal-v1';

// Recursos locales indispensables reales (Eliminado el style.css que no existe)
const assets = [
  './',
  './index.html',
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

// Evento Fetch: Estrategia de Red Primero para las peticiones de Telegram, Cache-First para el resto
self.addEventListener('fetch', e => {
  // Si la petición va dirigida a la API de Telegram, la dejamos pasar directo a la red sin tocar la caché
  if (e.request.url.includes('api.telegram.org')) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        console.error('Recurso no encontrado en red ni en caché:', e.request.url);
      });
    })
  );
});
