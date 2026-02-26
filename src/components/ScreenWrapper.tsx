import { ReactNode } from 'react';

interface ScreenWrapperProps {
  onBack: () => void;
  children: ReactNode;
}

export default function ScreenWrapper({ onBack, children }: ScreenWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium"
          aria-label="Back to Home"
        >
          ← Back to Home
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
