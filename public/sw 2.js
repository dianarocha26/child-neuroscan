const CACHE_NAME = 'childneuroscan-v2.1';
const STATIC_CACHE = 'static-v2.1';
const DYNAMIC_CACHE = 'dynamic-v2.1';
const IMAGE_CACHE = 'images-v2.1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

const MAX_CACHE_SIZE = 50;
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const limitCacheSize = (cacheName, maxSize) => {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxSize) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxSize));
      }
    });
  });
};

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Installation failed:', err))
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName =>
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== IMAGE_CACHE
          )
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      console.log('[SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .catch(() => new Response(
          JSON.stringify({ error: 'Offline', offline: true }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        ))
    );
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          return caches.open(IMAGE_CACHE).then(cache => {
            cache.put(request, response.clone());
            limitCacheSize(IMAGE_CACHE, MAX_CACHE_SIZE);
            return response;
          });
        }).catch(() => {
          return new Response('Image not available offline', { status: 503 });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        const cachedDate = new Date(cachedResponse.headers.get('date') || 0);
        const now = Date.now();

        if (now - cachedDate.getTime() < MAX_AGE) {
          return cachedResponse;
        }
      }

      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, responseToCache);
          limitCacheSize(DYNAMIC_CACHE, MAX_CACHE_SIZE);
        });

        return response;
      }).catch(() => {
        if (cachedResponse) {
          return cachedResponse;
        }

        if (request.destination === 'document') {
          return caches.match('/index.html');
        }

        return new Response('Content not available offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});
