import { logger } from './logger';

/**
 * Registers /sw.js in production builds only. The worker activates immediately
 * (skipWaiting + clients.claim) and serves navigations network-first, so a new
 * deploy reaches users on their next load. When an update lands while a page is
 * open, we offer a reload rather than forcing one (avoids losing form input).
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      // Only an update (not the very first install) should prompt a reload.
      const wasControlled = Boolean(navigator.serviceWorker.controller);

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker || !wasControlled) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') showUpdateNotification();
        });
      });

      setInterval(() => {
        registration.update().catch((error) => {
          logger.warn('Service Worker update check failed', { error });
        });
      }, 60 * 60 * 1000);
    } catch (error) {
      logger.warn('Service Worker registration failed', { error });
    }
  });
}

function showUpdateNotification() {
  if (document.getElementById('sw-update-toast')) return;

  const toast = document.createElement('div');
  toast.id = 'sw-update-toast';
  toast.setAttribute('role', 'status');
  toast.className =
    'fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4';

  const message = document.createElement('span');
  message.textContent = 'A new version is available!';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Update';
  button.className =
    'bg-white text-blue-600 px-4 py-1 rounded font-medium hover:bg-blue-50 transition-colors';
  button.addEventListener('click', () => window.location.reload());

  toast.append(message, button);
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 10000);
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
}
