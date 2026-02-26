import { useState } from 'react';
import { Home, Clock, TrendingUp, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { DailyTip } from '../types/database';

interface HomeProgramTipsProps {
  tips: DailyTip[];
}

export function HomeProgramTips({ tips }: HomeProgramTipsProps) {
  const { language, t } = useLanguage();
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());

  function toggleTip(tipId: string) {
    setCompletedTips(prev => {
      const next = new Set(prev);
      if (next.has(tipId)) {
        next.delete(tipId);
      } else {
        next.add(tipId);
      }
      return next;
    });
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    challenging: 'bg-orange-100 text-orange-800'
  };

  const difficultyLabels = {
    easy: { en: 'Easy', es: 'Fácil' },
    moderate: { en: 'Moderate', es: 'Moderado' },
    challenging: { en: 'Challenging', es: 'Desafiante' }
  };

  const categoryLabels: Record<string, { en: string; es: string }> = {
    communication: { en: 'Communication', es: 'Comunicación' },
    social: { en: 'Social Skills', es: 'Habilidades Sociales' },
    behavior: { en: 'Behavior', es: 'Comportamiento' },
    sensory: { en: 'Sensory', es: 'Sensorial' },
    motor: { en: 'Motor Skills', es: 'Habilidades Motoras' },
    physical: { en: 'Physical Activity', es: 'Actividad Física' },
    education: { en: 'Education', es: 'Educación' },
    focus: { en: 'Focus & Attention', es: 'Enfoque y Atención' },
    regulation: { en: 'Self-Regulation', es: 'Autorregulación' },
    organization: { en: 'Organization', es: 'Organización' },
    routine: { en: 'Routine', es: 'Rutina' },
    reading: { en: 'Reading', es: 'Lectura' },
    math: { en: 'Math', es: 'Matemáticas' },
    strategy: { en: 'Learning Strategies', es: 'Estrategias de Aprendizaje' },
    motivation: { en: 'Motivation', es: 'Motivación' },
    skills: { en: 'Skill Building', es: 'Desarrollo de Habilidades' },
    play: { en: 'Play Skills', es: 'Habilidades de Juego' },
    daily_living: { en: 'Daily Living', es: 'Vida Diaria' },
    cognitive: { en: 'Cognitive', es: 'Cognitivo' },
    feeding: { en: 'Feeding', es: 'Alimentación' },
    preparation: { en: 'Preparation', es: 'Preparación' }
  };

  const completionPercentage = tips.length > 0
    ? Math.round((completedTips.size / tips.length) * 100)
    : 0;

  if (tips.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
          <Home className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">
            {t('Daily Home Program', 'Programa Diario en Casa')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('Simple activities to do at home every day', 'Actividades simples para hacer en casa todos los días')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t('Progress Today', 'Progreso Hoy')}
          </span>
          <span className="text-sm font-semibold text-emerald-600">
            {completedTips.size} / {tips.length} {t('completed', 'completados')}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-emerald-600 rounded-full h-3 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip) => {
          const isCompleted = completedTips.has(tip.id);
          const categoryLabel = categoryLabels[tip.category] || { en: tip.category, es: tip.category };

          return (
            <div
              key={tip.id}
              className={`bg-white rounded-lg p-5 shadow-sm transition-all ${
                isCompleted ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTip(tip.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-gray-300 hover:border-emerald-500'
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through' : ''}`}>
                      {language === 'es' ? tip.title_es : tip.title_en}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[tip.difficulty]}`}>
                      {language === 'es' ? difficultyLabels[tip.difficulty].es : difficultyLabels[tip.difficulty].en}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {language === 'es' ? tip.description_es : tip.description_en}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tip.time_needed_minutes} {t('min', 'min')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="capitalize">
                        {language === 'es' ? categoryLabel.es : categoryLabel.en}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-emerald-100 border border-emerald-200 rounded-lg p-4">
        <p className="text-sm text-emerald-900 leading-relaxed">
          <strong>{t('Tip:', 'Consejo:')}</strong>{' '}
          {t(
            'Start with 2-3 activities daily. Consistency is more important than doing everything at once. Track your progress and celebrate small wins!',
            'Comience con 2-3 actividades diarias. La consistencia es más importante que hacer todo a la vez. ¡Registre su progreso y celebre pequeñas victorias!'
          )}
        </p>
      </div>
    </div>
  );
}
