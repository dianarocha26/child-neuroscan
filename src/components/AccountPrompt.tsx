import React from 'react';
import { UserPlus, Lock, TrendingUp, Shield, X } from 'lucide-react';

interface AccountPromptProps {
  onCreateAccount: () => void;
  onLogin: () => void;
  onClose: () => void;
  context?: 'save' | 'dashboard' | 'feature';
}

export function AccountPrompt({ onCreateAccount, onLogin, onClose, context = 'save' }: AccountPromptProps) {
  const messages = {
    save: {
      title: 'Save Your Progress',
      description: 'Create your free account to securely save your child\'s progress and track development over time.',
    },
    dashboard: {
      title: 'Track Development Over Time',
      description: 'Create your free account to access your progress dashboard and view historical data.',
    },
    feature: {
      title: 'Unlock Full Features',
      description: 'Create your free account to access all tracking tools and community features.',
    },
  };

  const message = messages[context];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{message.title}</h2>
          <p className="text-gray-600">{message.description}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
            <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Secure & Private</h4>
              <p className="text-xs text-gray-600">Your data is encrypted and only accessible by you</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Track Progress</h4>
              <p className="text-xs text-gray-600">Monitor development milestones and growth over time</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Always Accessible</h4>
              <p className="text-xs text-gray-600">Access your data anytime, from any device</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onCreateAccount}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Create Free Account
          </button>

          <button
            onClick={onLogin}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            I Already Have an Account
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          No credit card required. Free forever.
        </p>
      </div>
    </div>
  );
}
