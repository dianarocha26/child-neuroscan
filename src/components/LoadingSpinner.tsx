import { memo } from 'react';

const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="text-center">
        <div
          className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"
          aria-hidden="true"
        ></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
});

export default LoadingSpinner;
