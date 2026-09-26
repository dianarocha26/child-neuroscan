import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../contexts/DialogContext';
import { listReminders, type Reminder } from '../lib/api/reminders';
import { alertKey, dueReminders } from '../lib/reminderAlerts';
import { logger } from '../lib/logger';

const CHECK_MS = 30 * 1000;
const RELOAD_MS = 5 * 60 * 1000;
export const REMINDERS_CHANGED = 'reminders-changed';

const storageKey = (userId: string) => `reminderAlerts:${userId}`;

function readAlerted(userId: string): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKey(userId)) || '[]') as string[]);
  } catch {
    return new Set();
  }
}

function writeAlerted(userId: string, keys: Set<string>) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify([...keys]));
  } catch {
    // Storage full or blocked: worst case a reminder alerts twice.
  }
}

async function showBrowserNotification(r: Reminder) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const options: NotificationOptions = {
    body: r.child_name ? `${r.child_name}${r.description ? ` · ${r.description}` : ''}` : r.description ?? undefined,
    icon: '/icon-192.png',
    tag: alertKey(r)
  };
  try {
    // Android Chrome only allows notifications through a service worker.
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) await registration.showNotification(r.title, options);
    else new Notification(r.title, options);
  } catch (error) {
    logger.warn('Could not show reminder notification', { error });
  }
}

/**
 * Alerts signed-in users when a reminder comes due, while the app is open in a tab:
 * an in-app toast, plus a browser notification if the user allowed them.
 * No push service: nothing is sent when the app is closed.
 */
export function useReminderAlerts() {
  const { user } = useAuth();
  const { notify } = useDialog();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let reminders: Reminder[] = [];
    let cancelled = false;

    const check = () => {
      const alerted = readAlerted(userId);
      const due = dueReminders(reminders, new Date(), alerted);
      if (due.length === 0) return;
      due.forEach((r) => {
        alerted.add(alertKey(r));
        void showBrowserNotification(r);
      });
      // Keep only keys for reminders that still exist.
      const live = new Set(reminders.map(alertKey));
      writeAlerted(userId, new Set([...alerted].filter((k) => live.has(k))));
      notify(due.length === 1 ? `Reminder: ${due[0].title}` : `${due.length} reminders are due`, 'info', 8000);
    };

    const load = async () => {
      try {
        const rows = await listReminders(userId);
        if (cancelled) return;
        reminders = rows;
        check();
      } catch (error) {
        logger.warn('Could not load reminders for alerts', { error });
      }
    };

    const onVisible = () => { if (document.visibilityState === 'visible') void load(); };

    void load();
    const checkTimer = setInterval(check, CHECK_MS);
    const reloadTimer = setInterval(load, RELOAD_MS);
    window.addEventListener(REMINDERS_CHANGED, load);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      clearInterval(checkTimer);
      clearInterval(reloadTimer);
      window.removeEventListener(REMINDERS_CHANGED, load);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [userId, notify]);
}
