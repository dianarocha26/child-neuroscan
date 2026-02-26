import { useState, useEffect } from 'react';
import { FileText, Download, ArrowLeft, Printer, AlertCircle, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { getScreeningResultById, getRecommendationsForCondition } from '../lib/database';
import { useLanguage } from '../contexts/LanguageContext';
import type { ScreeningResult, Recommendation, RiskLevel } from '../types/database';

interface ReportGeneratorProps {
  sessionId: string;
  userId: string;
  onBack: () => void;
}

export default function ReportGenerator({ sessionId, userId, onBack }: ReportGeneratorProps) {
  const { language } = useLanguage();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [sessionId]);

  const loadResult = async () => {
    setLoading(true);
    try {
      const data = await getScreeningResultById(sessionId);
      if (data) {
        setResult(data);
        const recs = await getRecommendationsForCondition(
          data.condition_id,
          data.risk_level,
          data.child_age_months
        );
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Error loading result:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskConfig = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return {
          label: 'Low Risk',
          color: 'text-green-700',
          bg: 'bg-green-50',
          border: 'border-green-200',
          description: 'Screening indicates minimal concerns. Continue monitoring development.',
          icon: CheckCircle
        };
      case 'moderate':
        return {
          label: 'Moderate Risk',
          color: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          description: 'Some concerns noted. Consultation with healthcare provider recommended.',
          icon: AlertCircle
        };
      case 'high':
        return {
          label: 'High Risk',
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
          description: 'Significant concerns identified. Professional evaluation strongly recommended.',
          icon: AlertTriangle
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const riskConfig = getRiskConfig(result.risk_level);
  const RiskIcon = riskConfig.icon;
  const conditionName = language === 'es' ? result.condition.name_es : result.condition.name_en;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="no-print mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      <div id="report-content" className="bg-white rounded-xl shadow-lg print:shadow-none">
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-8 rounded-t-xl print:rounded-none">
          <div className="flex items-start gap-4">
            <FileText className="w-12 h-12 opacity-90 flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                Developmental Screening Report
              </h1>
              <p className="text-teal-100 text-lg">
                Professional Assessment Summary
              </p>
              <div className="mt-4 flex items-center gap-6 text-sm text-teal-100">
                <span>Report ID: {result.id.substring(0, 8).toUpperCase()}</span>
                <span>Generated: {formatDate(new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
              Child Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Child Name</div>
                <div className="text-lg font-semibold text-gray-900">{result.child_name || 'Not provided'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Age at Screening</div>
                <div className="text-lg font-semibold text-gray-900">
                  {Math.floor(result.child_age_months / 12)} years {result.child_age_months % 12} months
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Screening Date</div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(result.created_at)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Condition Screened</div>
                <div className="text-lg font-semibold text-gray-900">{conditionName}</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
              Screening Results Summary
            </h2>
            <div className={`border-2 ${riskConfig.border} ${riskConfig.bg} p-6 rounded-lg`}>
              <div className="flex items-start gap-4 mb-4">
                <RiskIcon className={`w-8 h-8 ${riskConfig.color} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Overall Risk Assessment</div>
                      <div className={`text-3xl font-bold ${riskConfig.color}`}>{riskConfig.label}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Score</div>
                      <div className={`text-3xl font-bold ${riskConfig.color}`}>
                        {result.total_score?.toFixed(1) || 0}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-3 leading-relaxed">{riskConfig.description}</p>
                </div>
              </div>

              {result.has_red_flags && (
                <div className="mt-4 pt-4 border-t border-red-300 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-900 mb-1">Urgent Indicators Detected</div>
                    <p className="text-sm text-red-800">
                      This screening identified one or more urgent developmental indicators. Please consult with a healthcare professional promptly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {result.domain_scores && Object.keys(result.domain_scores).length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                Domain-Specific Analysis
              </h2>
              <div className="space-y-4">
                {Object.values(result.domain_scores).map((domain: any) => (
                  <div key={domain.domain_id} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {domain.domain_code.replace('_', ' ')}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
                        {Math.round(domain.percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full transition-all bg-teal-600 flex items-center px-2"
                        style={{ width: `${domain.percentage}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {domain.score.toFixed(1)} / {domain.max_score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                Professional Recommendations
              </h2>
              <div className="space-y-4">
                {recommendations.slice(0, 8).map((rec, index) => (
                  <div key={rec.id} className="border-l-4 border-teal-500 bg-teal-50 p-5 rounded">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-teal-900 text-lg mb-2">
                          {language === 'es' ? rec.title_es : rec.title_en}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {language === 'es' ? rec.description_es : rec.description_en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
              Next Steps
            </h2>
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-lg p-6">
              <h3 className="font-semibold text-teal-900 text-lg mb-4">Recommended Actions:</h3>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Share this report with your pediatrician or primary care physician</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Discuss the screening results during your next healthcare visit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Request referrals for specialized evaluation if recommended</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <span>Continue monitoring development and maintain open communication with educators</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Important Medical Disclaimer
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              <strong>This screening report is for informational purposes only and does not constitute medical advice or diagnosis.</strong> Results are based on parent-reported observations and should be interpreted by qualified healthcare professionals.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Only licensed healthcare providers can provide formal diagnoses and treatment recommendations. If you have urgent concerns, contact your healthcare provider immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
