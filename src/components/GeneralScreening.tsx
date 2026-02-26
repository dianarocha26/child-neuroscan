import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Brain, CheckCircle, AlertCircle, BookOpen, Stethoscope } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';

interface Question {
  id: string;
  question_number: number;
  question_text: string;
  question_text_es: string;
  domain: string;
  response_type: string;
  response_options: Array<{
    value: string;
    label: string;
    score: number;
  }>;
  explanation: string;
}

interface DomainScore {
  domain: string;
  raw_score: number;
  max_possible_score: number;
  percentage_score: number;
  concern_level: 'low' | 'moderate' | 'elevated' | 'significant';
}

interface Recommendation {
  condition_id: string;
  condition_name: string;
  confidence_level: string;
  parent_message: string;
  educational_content: string;
  professional_guidance: string;
  professional_types: string[];
}

interface GeneralScreeningProps {
  userId: string;
  childAge: number;
  onComplete?: (recommendations: Recommendation[]) => void;
  onBack?: () => void;
}

export function GeneralScreening({ userId, childAge, onComplete, onBack }: GeneralScreeningProps) {
  const { t, language } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, { value: string; score: number }>>(new Map());
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [domainScores, setDomainScores] = useState<DomainScore[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [childAge]);

  const loadQuestions = async () => {
    setLoading(true);
    const childAgeMonths = childAge;

    const { data, error } = await supabase
      .from('general_developmental_questions')
      .select('*')
      .lte('age_range_min', childAgeMonths)
      .gte('age_range_max', childAgeMonths)
      .order('question_number');

    if (error) {
      logger.error('Error loading questions:', error);
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  const handleResponse = (value: string, score: number) => {
    const newResponses = new Map(responses);
    newResponses.set(questions[currentQuestionIndex].id, { value, score });
    setResponses(newResponses);
  };

  const goToNext = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = responses.get(currentQuestion.id);

    if (response) {
      await supabase.from('general_screening_responses').insert({
        user_id: userId,
        session_id: sessionId,
        child_age_months: childAge,
        question_id: currentQuestion.id,
        response_value: response.value,
        response_score: response.score,
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await calculateResults();
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = async () => {
    setLoading(true);

    const domainScoresMap: Map<string, { total: number; max: number; count: number }> = new Map();

    questions.forEach((q) => {
      const response = responses.get(q.id);
      if (response) {
        const domain = q.domain;
        const current = domainScoresMap.get(domain) || { total: 0, max: 0, count: 0 };
        current.total += response.score;
        current.max += 3;
        current.count += 1;
        domainScoresMap.set(domain, current);
      }
    });

    const calculatedDomainScores: DomainScore[] = [];

    for (const [domain, scores] of domainScoresMap.entries()) {
      const percentage = (scores.total / scores.max) * 100;
      let concernLevel: 'low' | 'moderate' | 'elevated' | 'significant' = 'low';

      if (percentage < 33) {
        concernLevel = 'low';
      } else if (percentage < 50) {
        concernLevel = 'moderate';
      } else if (percentage < 67) {
        concernLevel = 'elevated';
      } else {
        concernLevel = 'significant';
      }

      const domainScore: DomainScore = {
        domain,
        raw_score: scores.total,
        max_possible_score: scores.max,
        percentage_score: percentage,
        concern_level: concernLevel,
      };

      calculatedDomainScores.push(domainScore);

      await supabase.from('general_screening_domain_scores').insert({
        user_id: userId,
        session_id: sessionId,
        domain,
        raw_score: scores.total,
        max_possible_score: scores.max,
        percentage_score: percentage,
        concern_level: concernLevel,
      });
    }

    setDomainScores(calculatedDomainScores);
    await generateRecommendations(calculatedDomainScores);
    setShowResults(true);
    setLoading(false);
  };

  const generateRecommendations = async (scores: DomainScore[]) => {
    const { data: rules } = await supabase
      .from('screening_recommendation_rules')
      .select('*');

    if (!rules) return;

    const generatedRecs: Recommendation[] = [];

    for (const rule of rules) {
      const thresholds = rule.threshold_rules;
      const primaryDomains = rule.primary_domains as string[];
      const secondaryDomains = rule.secondary_domains as string[] || [];

      let primaryElevated = 0;
      let secondaryElevated = 0;

      primaryDomains.forEach((domain: string) => {
        const score = scores.find((s) => s.domain === domain);
        if (score && score.percentage_score >= (thresholds.primary_threshold * 33.33)) {
          primaryElevated++;
        }
      });

      secondaryDomains.forEach((domain: string) => {
        const score = scores.find((s) => s.domain === domain);
        if (score && score.percentage_score >= (thresholds.secondary_threshold * 33.33)) {
          secondaryElevated++;
        }
      });

      if (primaryElevated >= (thresholds.min_primary_domains || 1) &&
          (primaryElevated + secondaryElevated) >= (thresholds.min_elevated_questions || 2)) {

        let confidenceLevel = 'suggested';
        if (primaryElevated >= 2 && (primaryElevated + secondaryElevated) >= 4) {
          confidenceLevel = 'strongly_recommended';
        } else if (primaryElevated >= 2) {
          confidenceLevel = 'recommended';
        }

        const rec: Recommendation = {
          condition_id: rule.condition_id,
          condition_name: rule.condition_name,
          confidence_level: confidenceLevel,
          parent_message: language === 'es' ? rule.recommendation_message_es : rule.recommendation_message,
          educational_content: rule.educational_summary,
          professional_guidance: rule.next_steps,
          professional_types: rule.professional_types,
        };

        generatedRecs.push(rec);

        await supabase.from('general_screening_recommendations').insert({
          user_id: userId,
          session_id: sessionId,
          recommended_condition: rule.condition_id,
          confidence_level: confidenceLevel,
          reasoning: { primaryElevated, secondaryElevated, domains: primaryDomains },
          domain_triggers: [...primaryDomains, ...secondaryDomains],
          parent_message: rec.parent_message,
          educational_content: rec.educational_content,
          professional_guidance: rec.professional_guidance,
          priority_order: generatedRecs.length + 1,
        });
      }
    }

    setRecommendations(generatedRecs);
  };

  if (showDisclaimer) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'es' ? 'Evaluación General del Desarrollo' : 'General Developmental Screening'}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  {language === 'es' ? 'Importante: Esto NO es un diagnóstico' : 'Important: This is NOT a diagnosis'}
                </p>
                <p>
                  {language === 'es'
                    ? 'Esta evaluación es una herramienta de guía para ayudarle a entender áreas que pueden beneficiarse de evaluación profesional. Solo un profesional médico calificado puede proporcionar un diagnóstico.'
                    : 'This screening is a guidance tool to help you understand areas that may benefit from professional evaluation. Only a qualified medical professional can provide a diagnosis.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  {language === 'es' ? 'Cómo funciona' : 'How it works'}
                </p>
                <p>
                  {language === 'es'
                    ? 'Responderá 20 preguntas sobre el desarrollo de su hijo en 8 áreas clave. Según sus respuestas, sugeriremos evaluaciones específicas que pueden ser relevantes.'
                    : 'You will answer 20 questions about your child\'s development across 8 key areas. Based on your responses, we will suggest specific screenings that may be relevant.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Stethoscope className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  {language === 'es' ? 'Próximos pasos profesionales' : 'Professional next steps'}
                </p>
                <p>
                  {language === 'es'
                    ? 'Independientemente de los resultados, si tiene inquietudes, siempre recomendamos consultar con un pediatra del desarrollo, psicólogo infantil u otro profesional apropiado.'
                    : 'Regardless of results, if you have concerns, we always recommend consulting with a developmental pediatrician, child psychologist, or other appropriate professional.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {language === 'es' ? 'Atrás' : 'Back'}
              </button>
            )}
            <button
              onClick={() => setShowDisclaimer(false)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {language === 'es' ? 'Entiendo, Comenzar Evaluación' : 'I Understand, Begin Screening'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              {language === 'es' ? 'Evaluación Completa' : 'Screening Complete'}
            </h2>
          </div>

          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'es' ? 'Sus Resultados del Dominio' : 'Your Domain Results'}
            </h3>
            <div className="space-y-4">
              {domainScores.map((score) => (
                <div key={score.domain} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-700 capitalize">
                        {score.domain.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-gray-600">{score.percentage_score.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          score.concern_level === 'low' ? 'bg-green-500' :
                          score.concern_level === 'moderate' ? 'bg-yellow-500' :
                          score.concern_level === 'elevated' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${score.percentage_score}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    score.concern_level === 'low' ? 'bg-green-100 text-green-800' :
                    score.concern_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    score.concern_level === 'elevated' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {score.concern_level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'es' ? 'Evaluaciones Recomendadas' : 'Recommended Screenings'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'es'
                  ? 'Basado en sus respuestas, recomendamos explorar las siguientes evaluaciones específicas:'
                  : 'Based on your responses, we recommend exploring the following specific screenings:'}
              </p>
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{rec.condition_name}</h4>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        rec.confidence_level === 'strongly_recommended' ? 'bg-red-100 text-red-800' :
                        rec.confidence_level === 'recommended' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {rec.confidence_level.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{rec.parent_message}</p>
                    <div className="bg-white rounded p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2 font-semibold">
                        {language === 'es' ? 'Sobre esta condición:' : 'About this condition:'}
                      </p>
                      <p className="text-sm text-gray-700">{rec.educational_content}</p>
                    </div>
                    <div className="bg-white rounded p-4">
                      <p className="text-sm text-gray-600 mb-2 font-semibold">
                        {language === 'es' ? 'Próximos pasos:' : 'Next steps:'}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">{rec.professional_guidance}</p>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        {language === 'es' ? 'Profesionales recomendados:' : 'Recommended professionals:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {rec.professional_types.map((type, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === 'es' ? 'Desarrollo Típico' : 'Typical Development'}
              </h3>
              <p className="text-gray-700">
                {language === 'es'
                  ? 'Sus respuestas sugieren que su hijo está progresando dentro de rangos de desarrollo esperados. Si tiene inquietudes específicas, siempre recomendamos consultar con un profesional de la salud.'
                  : 'Your responses suggest your child is progressing within expected developmental ranges. If you have specific concerns, we always recommend consulting with a healthcare professional.'}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {onComplete && recommendations.length > 0 && (
              <button
                onClick={() => onComplete(recommendations)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {language === 'es' ? 'Continuar con Evaluaciones Detalladas' : 'Continue to Detailed Screenings'}
              </button>
            )}
            <button
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {language === 'es' ? 'Finalizar' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.get(currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestionIndex + 1} {language === 'es' ? 'de' : 'of'} {questions.length}
          </span>
          <span>{progress.toFixed(0)}% {language === 'es' ? 'Completo' : 'Complete'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-2 text-sm text-blue-600 font-medium uppercase tracking-wide">
          {currentQuestion.domain.replace(/_/g, ' ')}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {language === 'es' ? currentQuestion.question_text_es : currentQuestion.question_text}
        </h3>

        <div className="space-y-3 mb-6">
          {currentQuestion.response_options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleResponse(option.value, option.score)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                currentResponse?.value === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  currentResponse?.value === option.value
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300'
                }`}>
                  {currentResponse?.value === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium text-gray-900">{option.label}</span>
              </div>
            </button>
          ))}
        </div>

        {currentQuestion.explanation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{language === 'es' ? 'Por qué preguntamos:' : 'Why we ask:'}</span>{' '}
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'es' ? 'Anterior' : 'Previous'}
          </button>
          <button
            onClick={goToNext}
            disabled={!currentResponse}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentQuestionIndex === questions.length - 1
              ? (language === 'es' ? 'Ver Resultados' : 'View Results')
              : (language === 'es' ? 'Siguiente' : 'Next')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
