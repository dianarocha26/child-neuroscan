import { memo } from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'dashboard' | 'form';
  count?: number;
}

export const SkeletonLoader = memo(function SkeletonLoader({
  variant = 'card',
  count = 3
}: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div className="space-y-4" role="status" aria-label="Loading content">
        {skeletons.map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3" role="status" aria-label="Loading list">
        {skeletons.map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="space-y-6" role="status" aria-label="Loading dashboard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          {skeletons.map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="space-y-4" role="status" aria-label="Loading form">
        {skeletons.map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-6"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
});
