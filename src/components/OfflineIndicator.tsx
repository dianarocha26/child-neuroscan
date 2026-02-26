import { WifiOff, Wifi } from 'lucide-react';
import { useOnline } from '../hooks/useOnline';
import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const isOnline = useOnline();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white animate-slide-up'
          : 'bg-orange-500 text-white animate-bounce-subtle'
      }`}
      role="alert"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">No internet connection</span>
        </>
      )}
    </div>
  );
}
