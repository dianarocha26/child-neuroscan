/* ChildNeuroScan service worker.
 *
 * __BUILD_ID__ is replaced at build time (see swBuildIdPlugin in vite.config.ts),
 * so every deploy gets fresh cache names and `activate` purges the old ones.
 *
 * Strategy (same-origin GET requests only; everything else is left to the browser):
 *   - navigations: network-first, cached app shell only when offline
 *   - /assets/* (content-hashed): cache-first, caching only ok, non-HTML responses
 *   - anything else: not intercepted
 */
const BUILD_ID = '__BUILD_ID__';
const SHELL_CACHE = `cns-shell-${BUILD_ID}`;
const ASSET_CACHE = `cns-assets-${BUILD_ID}`;
const SHELL_URL = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) =>
        fetch(SHELL_URL, { cache: 'reload' }).then((res) => {
          if (res.ok) return cache.put(SHELL_URL, res);
        })
      )
      .catch(() => {
        /* offline shell is best-effort */
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== SHELL_CACHE && name !== ASSET_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isHtml(response) {
  const type = response.headers.get('content-type') || '';
  return type.includes('text/html');
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic' && isHtml(response)) {
      const cache = await caches.open(SHELL_CACHE);
      await cache.put(SHELL_URL, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(SHELL_URL, { cacheName: SHELL_CACHE });
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Never cache errors, redirects/opaque responses, or an HTML fallback served
  // in place of a missing hashed chunk.
  if (response.ok && response.type === 'basic' && !isHtml(response)) {
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirstAsset(request));
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name))))
    );
  }
});

// Reminder notifications (shown by the app while it is open): focus the app on click.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const client = clients.find((c) => 'focus' in c);
      return client ? client.focus() : self.clients.openWindow('/');
    })
  );
});
