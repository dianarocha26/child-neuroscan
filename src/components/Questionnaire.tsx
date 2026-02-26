import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';
import { logger } from '../lib/logger';
import { ErrorState } from './ErrorState';
import type { Condition, Question } from '../types/database';
import { getQuestionsForCondition } from '../lib/database';

interface QuestionnaireProps {
  condition: Condition;
  childAgeMonths: number;
  onComplete: (responses: Record<string, boolean>, childName: string) => void;
  onBack: () => void;
}

export function Questionnaire({ condition, childAgeMonths, onComplete, onBack }: QuestionnaireProps) {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childName, setChildName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [condition.id]);

  async function loadQuestions() {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuestionsForCondition(condition.id);
      const filtered = data.filter(
        q => childAgeMonths >= q.age_min_months && childAgeMonths <= q.age_max_months
      );

      if (filtered.length === 0) {
        setError('No questions available for this age range. Please try a different condition or age.');
      } else {
        setQuestions(filtered);
      }
    } catch (err) {
      logger.error('Failed to load screening questions', err);
      setError('Unable to load screening questions. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(answer: boolean) {
    const currentQuestion = questions[currentIndex];
    setResponses(prev => ({ ...prev, [currentQuestion.id]: answer }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleSubmit() {
    onComplete(responses, childName || 'Child');
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (childName.trim()) {
      setShowNameInput(false);
    }
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadQuestions}
        onBack={onBack}
      />
    );
  }

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("Child's Name", "Nombre del Niño")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("Please enter your child's name to track their progress over time.", "Ingrese el nombre de su hijo para rastrear su progreso con el tiempo.")}
          </p>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder={t("Enter child's name", "Ingrese el nombre del niño")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              autoFocus
              aria-label="Child's name"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                aria-label="Go back"
              >
                {translations.previous[language]}
              </button>
              <button
                type="submit"
                disabled={!childName.trim()}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Continue to questions"
              >
                {translations.next[language]}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-gray-700 mb-4">
            {t('No questions available for this age range', 'No hay preguntas disponibles para este rango de edad')}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            {translations.previous[language]}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const hasAnswered = currentQuestion.id in responses;
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-teal-600 px-6 py-4">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="text-sm font-medium">
                {translations.progress[language]} {currentIndex + 1} {translations.of[language]} {questions.length}
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-teal-800 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="p-8">
            {currentQuestion.is_red_flag && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800 font-medium">
                  {t('Urgent Indicator', 'Indicador Urgente')}
                </span>
              </div>
            )}

            <h3 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
              {language === 'es' ? currentQuestion.question_es : currentQuestion.question_en}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8" role="group" aria-label="Answer options">
              <button
                onClick={() => handleAnswer(true)}
                className={`py-6 px-8 rounded-xl border-2 font-semibold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-teal-200 ${
                  responses[currentQuestion.id] === true
                    ? 'bg-teal-600 border-teal-600 text-white shadow-lg'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-teal-500 hover:bg-teal-50'
                }`}
                aria-label="Answer Yes"
                aria-pressed={responses[currentQuestion.id] === true}
              >
                {translations.yes[language]}
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className={`py-6 px-8 rounded-xl border-2 font-semibold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-gray-200 ${
                  responses[currentQuestion.id] === false
                    ? 'bg-gray-600 border-gray-600 text-white shadow-lg'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50'
                }`}
                aria-label="Answer No"
                aria-pressed={responses[currentQuestion.id] === false}
              >
                {translations.no[language]}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={currentIndex === 0 ? onBack : handlePrevious}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {translations.previous[language]}
              </button>

              {isLastQuestion && hasAnswered && (
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  {translations.submit[language]}
                </button>
              )}

              {!isLastQuestion && hasAnswered && (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  {translations.next[language]}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
