import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, FileText, ArrowLeft, Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import { getUserScreeningResults } from '../lib/database';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';
import { ErrorState } from './ErrorState';
import type { Condition, ScreeningResultWithCondition, RiskLevel } from '../types/database';
import { PageHeader } from './PageHeader';

interface ProgressDashboardProps {
  userId: string;
  onGenerateReport: (sessionId: string) => void;
  onBack?: () => void;
}

export default function ProgressDashboard({ userId, onGenerateReport, onBack }: ProgressDashboardProps) {
  const { t, language } = useLanguage();
  const [results, setResults] = useState<ScreeningResultWithCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');

  useEffect(() => {
    loadResults();
  }, [userId]);

  const loadResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserScreeningResults(userId);
      setResults(data);
    } catch (err) {
      logger.error('Failed to load progress dashboard results', err);
      setError(t('Unable to load your screening history. Please check your connection and try again.',
                 'No se pudo cargar su historial de evaluaciones. Verifique su conexión e intente de nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  const uniqueConditions = Array.from(new Set(results.map(r => r.condition_id)))
    .map(id => results.find(r => r.condition_id === id)?.condition)
    .filter((c): c is Condition => Boolean(c));

  const filteredResults = selectedCondition === 'all'
    ? results
    : results.filter(r => r.condition_id === selectedCondition);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'moderate':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return CheckCircle;
      case 'moderate':
      case 'high':
        return AlertTriangle;
      default:
        return Brain;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const groupResultsByChild = () => {
    const grouped: { [key: string]: ScreeningResultWithCondition[] } = {};
    filteredResults.forEach(result => {
      const name = result.child_name || 'Unknown';
      if (!grouped[name]) {
        grouped[name] = [];
      }
      grouped[name].push(result);
    });
    return grouped;
  };

  const childGroups = groupResultsByChild();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadResults} onBack={onBack} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
      <div className="mb-6 sm:mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="no-print inline-flex items-center gap-1.5 -ml-2 mb-2 sm:mb-4 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Home
          </button>
        )}

        <PageHeader
          icon={TrendingUp}
          tone="blue"
          title="Progress"
          subtitle="Your child's screening history and development over time"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCondition('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCondition === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Screenings
          </button>
          {uniqueConditions.map(condition => (
            <button
              key={condition.id}
              onClick={() => setSelectedCondition(condition.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCondition === condition.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'es' ? condition.name_es : condition.name_en}
            </button>
          ))}
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Screenings Yet</h2>
          <p className="text-gray-600">Complete your first screening to start tracking progress</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(childGroups).map(([childName, childResults]) => {
            return (
              <div key={childName} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{childName}</h2>

                <div className="grid gap-4">
                  {childResults.map(result => {
                    const RiskIcon = getRiskIcon(result.risk_level);
                    // Older rows have no max_score; show the score without a bar
                    const percentage = result.max_score
                      ? Math.min(100, Math.round((result.total_score / result.max_score) * 100))
                      : null;

                    return (
                      <div
                        key={result.id}
                        className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="mb-4">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-semibold text-gray-900 leading-snug">
                              {result.condition
                                ? (language === 'es' ? result.condition.name_es : result.condition.name_en)
                                : 'Screening'}
                            </h4>
                            <span className={`inline-flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full border text-sm font-semibold ${getRiskColor(result.risk_level)}`}>
                              <RiskIcon className="w-4 h-4" aria-hidden="true" />
                              <span className="capitalize">{result.risk_level}</span> risk
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                            <span>Age {Math.floor(result.child_age_months / 12)}y {result.child_age_months % 12}m</span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="w-4 h-4" aria-hidden="true" />
                              {formatDate(result.created_at)}
                            </span>
                            {result.has_red_flags && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Total Score</span>
                            <span className="text-lg font-bold text-gray-900">
                              {Number(result.total_score || 0).toFixed(1)}
                              {result.max_score ? <span className="text-sm font-medium text-gray-500"> / {Number(result.max_score).toFixed(1)}</span> : null}
                            </span>
                          </div>
                          {percentage !== null && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-teal-600 rounded-full h-2 transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {result.domain_scores && Object.keys(result.domain_scores).length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Domain Breakdown</div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.values(result.domain_scores).slice(0, 4).map((domain) => (
                                <div key={domain.domain_id} className="bg-white border border-gray-200 rounded p-2">
                                  <div className="text-xs text-gray-600 capitalize mb-1">
                                    {domain.domain_code.replace('_', ' ')}
                                  </div>
                                  <div className="text-sm font-semibold text-teal-600">
                                    {Math.round(domain.percentage)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => onGenerateReport(result.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            Generate Report
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {childResults.length > 1 && (
                  <div className="mt-6 p-5 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                    <h3 className="font-semibold text-teal-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Progress Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-teal-700">{childResults.length}</div>
                        <div className="text-xs sm:text-sm text-teal-600 font-medium">Total Screenings</div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-teal-700 capitalize">
                          {childResults[0].risk_level}
                        </div>
                        <div className="text-xs sm:text-sm text-teal-600 font-medium">Latest Risk</div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-teal-700">
                          {Math.round((Date.now() - new Date(childResults[childResults.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs sm:text-sm text-teal-600 font-medium">Days Tracking</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}