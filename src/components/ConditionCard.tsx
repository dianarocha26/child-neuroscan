import { ChevronRight } from 'lucide-react';
import type { Condition } from '../types/database';
import { useLanguage } from '../contexts/LanguageContext';

interface ConditionCardProps {
  condition: Condition;
  onClick: () => void;
}

const colorClasses: Record<string, { bg: string; hover: string; border: string }> = {
  blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', border: 'border-blue-200' },
  green: { bg: 'bg-green-50', hover: 'hover:bg-green-100', border: 'border-green-200' },
  orange: { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', border: 'border-orange-200' },
  teal: { bg: 'bg-teal-50', hover: 'hover:bg-teal-100', border: 'border-teal-200' },
  pink: { bg: 'bg-pink-50', hover: 'hover:bg-pink-100', border: 'border-pink-200' },
  amber: { bg: 'bg-amber-50', hover: 'hover:bg-amber-100', border: 'border-amber-200' },
  cyan: { bg: 'bg-cyan-50', hover: 'hover:bg-cyan-100', border: 'border-cyan-200' },
  slate: { bg: 'bg-slate-50', hover: 'hover:bg-slate-100', border: 'border-slate-200' },
  red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', border: 'border-red-200' },
};

export function ConditionCard({ condition, onClick }: ConditionCardProps) {
  const { language } = useLanguage();
  const colors = colorClasses[condition.color as keyof typeof colorClasses] || colorClasses.blue;

  const displayName = language === 'es' ? condition.name_es : condition.name_en;
  const displayDescription = language === 'es' ? condition.description_es : condition.description_en;

  console.log('🎴 ConditionCard rendering:', {
    condition,
    language,
    displayName,
    displayDescription,
    hasName: !!displayName,
    hasDescription: !!displayDescription
  });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.hover} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-100`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {displayName}
          </h3>
          <p className="text-gray-700 text-sm">
            {displayDescription}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}
