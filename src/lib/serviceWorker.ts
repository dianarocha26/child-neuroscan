import { logger } from './logger';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        logger.info('Service Worker registered', {
          scope: registration.scope
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              logger.info('New service worker available');
              showUpdateNotification();
            }
          });
        });

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });

        checkForUpdates(registration);

      } catch (error) {
        logger.warn('Service Worker registration failed', { error });
      }
    });
  } else {
    logger.info('Service Workers not supported in this environment');
  }
}

function checkForUpdates(registration: ServiceWorkerRegistration) {
  setInterval(() => {
    registration.update().catch(err => {
      logger.error('Service Worker update check failed', { error: err });
    });
  }, 60 * 60 * 1000);
}

function showUpdateNotification() {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4';
  toast.innerHTML = `
    <span>A new version is available!</span>
    <button
      onclick="window.location.reload()"
      class="bg-white text-blue-600 px-4 py-1 rounded font-medium hover:bg-blue-50 transition-colors"
    >
      Update
    </button>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 10000);
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      logger.info('Service Worker unregistered');
    }
  }
}

export async function clearServiceWorkerCache() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    logger.info('Service Worker cache cleared');
  }
}
