import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Calendar, Brain, Activity, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import { ErrorState } from './ErrorState';
import { ThinkingIllustration, EmptyStateIllustration } from './FriendlyIllustrations';
import type { BehaviorPattern, Correlation, WeeklySummary, TriggerAnalysis } from '../types/components';

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { loading, setLoading } = useLoadingState();
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

      const [patternsRes, correlationsRes, summariesRes, triggersRes] = await Promise.all([
        supabase
          .from('analytics_behavior_patterns')
          .select('*')
          .eq('user_id', user.id)
          .gte('time_range_start', startDate.toISOString())
          .order('frequency', { ascending: false })
          .limit(10),

        supabase
          .from('analytics_correlations')
          .select('*')
          .eq('user_id', user.id)
          .gte('date_range_start', startDate.toISOString())
          .order('correlation_strength', { ascending: false })
          .limit(5),

        supabase
          .from('analytics_weekly_summaries')
          .select('*')
          .eq('user_id', user.id)
          .gte('week_start_date', startDate.toISOString().split('T')[0])
          .order('week_start_date', { ascending: false })
          .limit(8),

        supabase
          .from('analytics_trigger_analysis')
          .select('*')
          .eq('user_id', user.id)
          .order('total_occurrences', { ascending: false })
          .limit(10)
      ]);

      setPatterns(patternsRes.data || []);
      setCorrelations(correlationsRes.data || []);
      setWeeklySummaries(summariesRes.data || []);
      setTriggerAnalysis(triggersRes.data || []);
    } catch (error) {
      logger.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCorrelationColor = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.7) return 'text-red-600 bg-red-50';
    if (abs >= 0.4) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const formatCorrelationText = (factorA: string, factorB: string) => {
    return `${factorA.replace(/_/g, ' ')} → ${factorB.replace(/_/g, ' ')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="w-48 h-48 mb-6">
          <ThinkingIllustration />
        </div>
        <p className="text-xl font-semibold text-gray-700 animate-pulse">{t.analyzingData}</p>
        <div className="flex gap-2 mt-4">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-10 animate-in">
          <div className="inline-flex items-center justify-center mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-glow-md">
            <BarChart3 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-3 leading-tight">
            {t.analytics?.title || 'Analytics Dashboard'}
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            {t.analytics?.subtitle || 'Discover patterns, trends, and insights from your tracking data'}
          </p>
        </div>

        <div className="mb-8 flex gap-2 flex-wrap animate-in-delay-1">
          {['7days', '30days', '90days', '6months'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:scale-105 border-2 border-gray-200'
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Weekly Trends</h2>
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

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Key Correlations</h2>
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
                    className={`p-4 rounded-lg border ${getCorrelationColor(corr.correlation_strength)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold capitalize">
                        {formatCorrelationText(corr.factor_a, corr.factor_b)}
                      </p>
                      <span className="text-sm font-bold">
                        {(corr.correlation_strength * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm">
                      Observed together {corr.occurrences} times
                    </p>
                    {Math.abs(corr.correlation_strength) >= 0.7 && (
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Behavior Patterns</h2>
            </div>
            {patterns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-48 h-48 mb-4">
                  <EmptyStateIllustration />
                </div>
                <p className="text-gray-600 text-center text-lg font-medium">
                  {t.noPatternsYet}
                </p>
                <p className="text-gray-500 text-center mt-2">
                  {t.continueTracking}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-700">{t.insightsSoon}</span>
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
                        style={{ width: `${Math.min(100, (pattern.frequency / 20) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft-lg p-8 border border-white/60 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Top Triggers</h2>
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
                    {trigger.successful_strategies && trigger.successful_strategies.length > 0 && (
                      <div className="mt-2 bg-green-50 rounded p-2">
                        <p className="text-xs text-green-800 font-medium mb-1">Effective Strategies:</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          {trigger.successful_strategies.slice(0, 2).map((strategy: string, idx: number) => (
                            <li key={idx}>• {strategy}</li>
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

        <div className="mt-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-blue-100 shadow-soft-lg backdrop-blur-sm">
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
