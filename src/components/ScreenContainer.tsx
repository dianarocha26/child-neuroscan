import { ArrowLeft } from 'lucide-react';

interface ScreenContainerProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function ScreenContainer({
  title,
  onBack,
  children,
  actions,
  className = ''
}: ScreenContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          {actions}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
}
