import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface AgeInputProps {
  onSubmit: (ageInMonths: number) => void;
  onBack: () => void;
}

export function AgeInput({ onSubmit, onBack }: AgeInputProps) {
  const { language } = useLanguage();
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const totalMonths = (parseInt(years) || 0) * 12 + (parseInt(months) || 0);
    if (totalMonths > 0) {
      onSubmit(totalMonths);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-start sm:items-center justify-center px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {translations.childAge[language]}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age-years" className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {translations.years[language]}
              </label>
              <input
                id="age-years"
                type="number"
                min="0"
                max="18"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                inputMode="numeric"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="age-months" className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {translations.months[language]}
              </label>
              <input
                id="age-months"
                type="number"
                min="0"
                max="11"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                inputMode="numeric"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              {translations.previous[language]}
            </button>
            <button
              type="submit"
              disabled={!years && !months}
              className="flex-1 px-4 py-3 bg-teal-700 text-white rounded-lg font-medium whitespace-nowrap hover:bg-teal-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {translations.startScreening[language]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
