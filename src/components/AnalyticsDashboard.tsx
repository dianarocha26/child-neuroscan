import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Calendar, Brain, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import { ThinkingIllustration, EmptyStateIllustration } from './FriendlyIllustrations';
import type { BehaviorPattern, Correlation, WeeklySummary, TriggerAnalysis } from '../types/components';
import { listBehaviorPatterns, listCorrelations, listWeeklySummaries, listTriggerAnalysis } from '../lib/api/analytics';
import { PageHeader } from './PageHeader';
import { ErrorState, LOAD_ERROR_MESSAGE } from './ErrorState';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { loading, setLoading } = useLoadingState();
  const [loadFailed, setLoadFailed] = useState(false);
  const [timeRange, setTimeRange] = useState('30days');

  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [triggerAnalysis, setTriggerAnalysis] = useState<TriggerAnalysis[]>([]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    setLoadFailed(false);
    if (!user) {
      logger.error('Cannot load analytics: user is null');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '6months':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
      }

      const [patternsResult, correlationsResult, summariesResult, triggersResult] = await Promise.allSettled([
        listBehaviorPatterns(user.id, startDate.toISOString()),
        listCorrelations(user.id, startDate.toISOString()),
        listWeeklySummaries(user.id, startDate.toISOString().split('T')[0]),
        listTriggerAnalysis(user.id)
      ]);

      if (patternsResult.status === 'rejected') {
        logger.error('Error loading behavior patterns:', patternsResult.reason);
        setLoadFailed(true);
      } else {
        setPatterns(patternsResult.value);
      }

      if (correlationsResult.status === 'rejected') {
        logger.error('Error loading correlations:', correlationsResult.reason);
        setLoadFailed(true);
      } else {
        setCorrelations(correlationsResult.value);
      }

      if (summariesResult.status === 'rejected') {
        logger.error('Error loading weekly summaries:', summariesResult.reason);
        setLoadFailed(true);
      } else {
        setWeeklySummaries(summariesResult.value);
      }

      if (triggersResult.status === 'rejected') {
        logger.error('Error loading trigger analysis:', triggersResult.reason);
        setLoadFailed(true);
      } else {
        setTriggerAnalysis(triggersResult.value);
      }
    } catch (error) {
      logger.error('Error loading analytics:', error);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const getCorrelationColor = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.7) return 'text-red-600 bg-red-50';
    if (abs >= 0.4) return 'text-orange-700 bg-orange-50';
    return 'text-yellow-800 bg-yellow-50';
  };

  const formatCorrelationText = (factorA: string, factorB: string) => {
    return `${factorA.replace(/_/g, ' ')} → ${factorB.replace(/_/g, ' ')}`;
  };

  if (loadFailed) {
    return <ErrorState inline message={LOAD_ERROR_MESSAGE} onRetry={() => { setLoadFailed(false); setLoading(true); loadAnalytics(); }} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-48 h-48 mb-6">
          <ThinkingIllustration />
        </div>
        <p className="text-xl font-semibold text-gray-700 animate-pulse">{t('Analyzing your data...', 'Analizando tus datos...')}</p>
        <div className="flex gap-2 mt-4">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="max-w-7xl mx-auto relative">
        <PageHeader
          icon={BarChart3}
          tone="blue"
          title={t('Analytics', 'Análisis')}
          subtitle={t('Patterns, trends, and insights from your tracking data', 'Patrones, tendencias e información de tus datos de seguimiento')}
        />

        <div className="mb-6 sm:mb-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 animate-in-delay-1" role="group" aria-label="Time range">
          {['7days', '30days', '90days', '6months'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              aria-pressed={timeRange === range}
              className={`h-10 px-4 text-sm rounded-lg font-medium whitespace-nowrap transition-colors border ${
                timeRange === range
                  ? 'bg-teal-700 border-teal-700 text-white'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {range === '7days' && 'Last 7 Days'}
              {range === '30days' && 'Last 30 Days'}
              {range === '90days' && 'Last 90 Days'}
              {range === '6months' && 'Last 6 Months'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-in-delay-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-5 sm:p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Trends</h2>
            </div>
            {weeklySummaries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No weekly data available yet. Start tracking behaviors to see trends!
              </p>
            ) : (
              <div className="space-y-4">
                {weeklySummaries.slice(0, 4).map((summary) => (
                  <div key={summary.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(summary.week_start_date).toLocaleDateString()} - {new Date(summary.week_end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Total Behaviors: {summary.total_behaviors}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600 font-medium">
                          {summary.positive_behaviors} positive
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                          {summary.challenging_behaviors} challenging
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-gray-600">Med Adherence</p>
                        <p className="font-semibold text-blue-900">{summary.medication_adherence_rate}%</p>
                      </div>
                      <div className="bg-purple-50 rounded p-2">
                        <p className="text-gray-600">Avg Mood</p>
                        <p className="font-semibold text-purple-900">{summary.mood_average}/10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-5 sm:p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Key Correlations</h2>
            </div>
            {correlations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Not enough data to identify correlations yet. Keep tracking!
              </p>
            ) : (
              <div className="space-y-3">
                {correlations.map((corr) => (
                  <div
                    key={corr.id}
                    className={`p-4 rounded-lg border ${getCorrelationColor(corr.correlation_strength ?? 0)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold capitalize">
                        {formatCorrelationText(corr.factor_a, corr.factor_b)}
                      </p>
                      <span className="text-sm font-bold">
                        {((corr.correlation_strength ?? 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm">
                      Observed together {corr.occurrences} times
                    </p>
                    {Math.abs(corr.correlation_strength ?? 0) >= 0.7 && (
                      <p className="text-xs mt-2 font-medium">
                        Strong correlation detected - consider this pattern when planning interventions
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in-delay-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-5 sm:p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Behavior Patterns</h2>
            </div>
            {patterns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-36 h-36 sm:w-48 sm:h-48 mb-4">
                  <EmptyStateIllustration />
                </div>
                <p className="text-gray-600 text-center text-lg font-medium">
                  {t('No patterns detected yet', 'Aún no se detectan patrones')}
                </p>
                <p className="text-gray-500 text-center mt-2">
                  {t('Keep tracking behaviors, sleep, and medications to reveal patterns', 'Sigue registrando conductas, sueño y medicamentos para descubrir patrones')}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-700">{t('Insights coming soon', 'Información disponible pronto')}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {pattern.behavior_category.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          Pattern: {pattern.pattern_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <p className="text-sm font-bold text-blue-900">{pattern.frequency}x</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, ((pattern.frequency ?? 0) / 20) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-5 sm:p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Triggers</h2>
            </div>
            {triggerAnalysis.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No trigger data available yet. Log behaviors with triggers to see analysis!
              </p>
            ) : (
              <div className="space-y-3">
                {triggerAnalysis.slice(0, 5).map((trigger) => (
                  <div key={trigger.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-900">{trigger.trigger_name}</p>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        {trigger.total_occurrences}x
                      </span>
                    </div>
                    {Array.isArray(trigger.successful_strategies) && trigger.successful_strategies.length > 0 && (
                      <div className="mt-2 bg-green-50 rounded p-2">
                        <p className="text-xs text-green-800 font-medium mb-1">Effective Strategies:</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          {trigger.successful_strategies.slice(0, 2).map((strategy, idx: number) => (
                            <li key={idx}>• {String(strategy)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-5 sm:p-8 border-2 border-blue-100 shadow-soft-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Insights Summary</h3>
          </div>
          <div className="space-y-2 text-gray-700">
            {weeklySummaries.length > 0 && weeklySummaries[0].insights_summary ? (
              <p>{weeklySummaries[0].insights_summary}</p>
            ) : (
              <>
                <p>• Continue tracking daily to unlock personalized insights</p>
                <p>• Patterns emerge after 2-3 weeks of consistent data entry</p>
                <p>• The more details you log, the better the analysis becomes</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
