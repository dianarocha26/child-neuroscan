import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Brain, Home, ChevronDown, ChevronUp, TrendingUp, Save, Info, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';
import { logger } from '../lib/logger';
import { getRecommendationsForCondition, getDailyTipsForCondition } from '../lib/database';
import { ConditionInfo } from './ConditionInfo';
import { HomeProgramTips } from './HomeProgramTips';
import type { Condition, RiskLevel, DomainScore, Recommendation, DailyTip } from '../types/database';

interface ResultsProps {
  condition: Condition;
  riskLevel: RiskLevel;
  hasRedFlags: boolean;
  domainScores: Record<string, DomainScore>;
  totalScore: number;
  maxScore: number;
  childAgeMonths: number;
  onStartNew: () => void;
  onViewDashboard?: () => void;
  onSaveProgress?: () => void;
  isGuest?: boolean;
}

export function Results({
  condition,
  riskLevel,
  hasRedFlags,
  domainScores,
  totalScore,
  maxScore,
  childAgeMonths,
  onStartNew,
  onViewDashboard,
  onSaveProgress,
  isGuest = false
}: ResultsProps) {
  const { language, t } = useLanguage();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [condition.id, riskLevel, childAgeMonths]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [recsData, tipsData] = await Promise.all([
        getRecommendationsForCondition(condition.id, riskLevel, childAgeMonths),
        getDailyTipsForCondition(condition.id)
      ]);
      setRecommendations(recsData);
      setDailyTips(tipsData);
      if (recsData.length > 0 && recsData[0].category) {
        setExpandedCategories(new Set([recsData[0].category.id]));
      }
    } catch (err) {
      logger.error('Failed to load results data', err);
      setError(t(
        'Unable to load recommendations and tips. Some features may be unavailable.',
        'No se pudieron cargar las recomendaciones y los consejos. Algunas funciones pueden no estar disponibles.'
      ));
    } finally {
      setLoading(false);
    }
  }

  function toggleCategory(categoryId: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  const riskConfig = {
    low: {
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      title: {
        en: 'Low Risk',
        es: 'Riesgo Bajo'
      },
      description: {
        en: 'Your answers did not point to concerns in this area right now. Keep watching your child\'s development and share any new worries with your child\'s doctor.',
        es: 'Sus respuestas no señalaron inquietudes en esta área por ahora. Siga observando el desarrollo de su hijo y comente cualquier nueva inquietud con su médico.'
      }
    },
    moderate: {
      color: 'amber',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: AlertCircle,
      title: {
        en: 'Moderate Risk',
        es: 'Riesgo Moderado'
      },
      description: {
        en: 'Some of your answers suggest it would be helpful to talk with your child\'s doctor about this area at the next visit.',
        es: 'Algunas de sus respuestas sugieren que sería útil hablar de esta área con el médico de su hijo en la próxima consulta.'
      }
    },
    high: {
      color: 'red',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertTriangle,
      title: {
        en: 'High Risk',
        es: 'Riesgo Alto'
      },
      description: {
        en: 'Your answers suggest it would be worth talking to your child\'s doctor or a specialist soon.',
        es: 'Sus respuestas sugieren que valdría la pena hablar pronto con el médico de su hijo o con un especialista.'
      }
    }
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const sortedDomains = Object.values(domainScores).sort((a, b) => b.percentage - a.percentage);
  const topDomains = sortedDomains.slice(0, 3).filter(d => d.percentage > 0);

  const recommendationsByCategory = recommendations.reduce((acc, rec) => {
    const categoryId = rec.category?.id || 'other';
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: rec.category,
        recommendations: []
      };
    }
    acc[categoryId].recommendations.push(rec);
    return acc;
  }, {} as Record<string, { category: Recommendation['category']; recommendations: Recommendation[] }>);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-teal-50 via-white to-blue-50 px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-teal-600 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-3 text-white">
              <Brain className="w-8 h-8 flex-shrink-0" aria-hidden="true" />
              <div>
                <h1 className="text-2xl font-bold">{translations.results[language]}</h1>
                <p className="text-teal-100">
                  {language === 'es' ? condition.name_es : condition.name_en}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-6">
            <div className={`${config.bg} ${config.border} border-2 rounded-xl p-4 sm:p-6`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <Icon className={`w-8 h-8 ${config.text} flex-shrink-0`} />
                <div className="flex-1">
                  <h2 className={`text-xl sm:text-2xl font-bold ${config.text} mb-2`}>
                    {language === 'es' ? config.title.es : config.title.en}
                  </h2>
                  <p className={`${config.text} leading-relaxed mb-3`}>
                    {language === 'es' ? config.description.es : config.description.en}
                  </p>
                  <div className={`text-sm font-medium ${config.text}`}>
                    {t('Score', 'Puntuación')}: {totalScore.toFixed(1)} / {maxScore.toFixed(1)} ({percentage}%)
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2 bg-white/70 rounded-lg p-3 text-sm text-gray-700">
                <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <p>
                  {t(
                    'This is a parent-reported screening, not a diagnosis. Only a qualified healthcare professional can evaluate and diagnose your child.',
                    'Esta es una evaluación de detección basada en lo que reportan los padres, no un diagnóstico. Solo un profesional de la salud calificado puede evaluar y diagnosticar a su hijo.'
                  )}
                </p>
              </div>
            </div>

            {hasRedFlags && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-red-900 mb-2">
                      {translations.redFlags[language]}
                    </h3>
                    <p className="text-red-800 text-sm">
                      {t(
                        'One or more of your answers are ones that specialists recommend checking promptly, even when other answers look typical. This is why the result above is marked high. Please contact your child\'s doctor soon to talk about these answers.',
                        'Una o más de sus respuestas son de las que los especialistas recomiendan revisar pronto, aunque las demás respuestas parezcan típicas. Por eso el resultado de arriba aparece como alto. Comuníquese pronto con el médico de su hijo para hablar sobre estas respuestas.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {topDomains.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {translations.functionalDomains[language]}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t(
                    'Areas with higher signal concentration:',
                    'Áreas con mayor concentración de señales:'
                  )}
                </p>
                <div className="space-y-3">
                  {topDomains.map((domain) => (
                    <div key={domain.domain_id} className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 capitalize">
                          {domain.domain_code.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-semibold text-teal-600">
                          {Math.round(domain.percentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-teal-600 rounded-full h-2 transition-all duration-300"
                          style={{ width: `${domain.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3" role="alert">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800">{error}</p>
                  <button
                    onClick={loadData}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amber-900 hover:underline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t('Try again', 'Intentar de nuevo')}
                  </button>
                </div>
              </div>
            )}

            <ConditionInfo condition={condition} />

            {!loading && dailyTips.length > 0 && (
              <HomeProgramTips tips={dailyTips} />
            )}

            {!loading && recommendations.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {t('Personalized Recommendations', 'Recomendaciones Personalizadas')}
                </h3>
                <p className="text-gray-700 mb-6">
                  {t(
                    'Evidence-based strategies to support your child\'s development',
                    'Estrategias basadas en evidencia para apoyar el desarrollo de su hijo'
                  )}
                </p>

                <div className="space-y-3">
                  {Object.values(recommendationsByCategory).map(({ category, recommendations: catRecs }) => (
                    <div key={category?.id || 'other'} className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <button
                        onClick={() => toggleCategory(category?.id || 'other')}
                        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0 bg-teal-100 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-teal-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">
                              {language === 'es' ? category?.name_es : category?.name_en}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {catRecs.length} {t('recommendation', 'recomendación')}{catRecs.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        {expandedCategories.has(category?.id || 'other') ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {expandedCategories.has(category?.id || 'other') && (
                        <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
                          {catRecs.map((rec) => (
                            <div key={rec.id} className="border-l-4 border-teal-500 pl-4 py-2">
                              <div className="flex flex-col items-start gap-1.5 mb-2">
                                {rec.priority === 1 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
                                    {t('High Priority', 'Alta Prioridad')}
                                  </span>
                                )}
                                <h5 className="font-semibold text-gray-900">
                                  {language === 'es' ? rec.title_es : rec.title_en}
                                </h5>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {language === 'es' ? rec.description_es : rec.description_en}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
              <h3 className="font-bold text-yellow-900 mb-2">
                {translations.disclaimer[language]}
              </h3>
              <p className="text-sm text-yellow-800 leading-relaxed">
                {translations.disclaimerText[language]}
              </p>
            </div>

            {isGuest && (
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 border-2 border-teal-200">
                <div className="flex items-start gap-4">
                  <Save className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {t('Save Your Progress', 'Guarde su progreso')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t(
                        'Create your free account to securely save this screening and track your child\'s development over time.',
                        'Cree su cuenta gratuita para guardar esta evaluación de forma segura y seguir el desarrollo de su hijo a lo largo del tiempo.'
                      )}
                    </p>
                    <button
                      onClick={onSaveProgress}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
                    >
                      {t('Create Free Account', 'Crear cuenta gratuita')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {onViewDashboard && !isGuest && (
                <button
                  onClick={onViewDashboard}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-blue-600 text-white rounded-xl font-semibold sm:text-lg hover:bg-blue-700 transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  {t('View Progress', 'Ver Progreso')}
                </button>
              )}
              <button
                onClick={onStartNew}
                className={`${onViewDashboard && !isGuest ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-teal-600 text-white rounded-xl font-semibold sm:text-lg hover:bg-teal-700 transition-colors`}
              >
                <Home className="w-5 h-5" />
                {translations.startNewScreening[language]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
