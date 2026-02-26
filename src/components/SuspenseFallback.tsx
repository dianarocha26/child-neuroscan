import { Loader2 } from 'lucide-react';

interface SuspenseFallbackProps {
  message?: string;
}

export function SuspenseFallback({ message = 'Loading...' }: SuspenseFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

export function FullScreenFallback({ message = 'Loading application...' }: SuspenseFallbackProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-6" />
          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-teal-200 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ChildNeuroScan</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
