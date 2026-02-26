import { BookOpen, Eye, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Condition } from '../types/database';

interface ConditionInfoProps {
  condition: Condition;
}

export function ConditionInfo({ condition }: ConditionInfoProps) {
  const { language, t } = useLanguage();

  if (!condition.explanation_en || !condition.explanation_es) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {t('Understanding the Condition', 'Comprendiendo la Condición')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('A parent-friendly explanation', 'Una explicación para padres')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          {t('What is it?', '¿Qué es?')}
        </h4>
        <p className="text-gray-700 leading-relaxed">
          {language === 'es' ? condition.explanation_es : condition.explanation_en}
        </p>
      </div>

      {condition.what_parents_see_en && condition.what_parents_see_es && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-teal-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              {t('What you might notice', 'Qué puede notar')}
            </h4>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {language === 'es' ? condition.what_parents_see_es : condition.what_parents_see_en}
          </p>
        </div>
      )}

      {condition.how_to_help_en && condition.how_to_help_es && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-rose-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              {t('How you can help', 'Cómo puede ayudar')}
            </h4>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {language === 'es' ? condition.how_to_help_es : condition.how_to_help_en}
          </p>
        </div>
      )}
    </div>
  );
}
