import { useEffect, useState } from 'react';
import { Brain, Loader2, TrendingUp, Search, Users, Video, Calendar, Camera, Target, Pill, BookOpen, AlertTriangle, Trophy, Bell, Sparkles, CalendarClock, BarChart3, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';
import { getConditions } from '../lib/database';
import type { Condition } from '../types/database';
import { ConditionCard } from './ConditionCard';
import { WelcomeIllustration } from './FriendlyIllustrations';
import { logger } from '../lib/logger';

interface LandingPageProps {
  onConditionSelect: (condition: Condition) => void;
  onViewDashboard?: () => void;
  onViewResourceFinder?: () => void;
  onViewCommunity?: () => void;
  onViewVideoLibrary?: () => void;
  onViewAppointmentPrep?: () => void;
  onViewPhotoJournal?: () => void;
  onViewGoalTracker?: () => void;
  onViewMedicationTracker?: () => void;
  onViewBehaviorDiary?: () => void;
  onViewCrisisPlan?: () => void;
  onViewRewardsSystem?: () => void;
  onViewReminders?: () => void;
  onViewVisualSchedule?: () => void;
  onViewSensoryProfile?: () => void;
  onViewAnalytics?: () => void;
  onViewReports?: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export function LandingPage({ onConditionSelect, onViewDashboard, onViewResourceFinder, onViewCommunity, onViewVideoLibrary, onViewAppointmentPrep, onViewPhotoJournal, onViewGoalTracker, onViewMedicationTracker, onViewBehaviorDiary, onViewCrisisPlan, onViewRewardsSystem, onViewReminders, onViewVisualSchedule, onViewSensoryProfile, onViewAnalytics, onViewReports, onLogin, onSignUp }: LandingPageProps) {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConditions();
  }, []);

  async function loadConditions() {
    try {
      setLoading(true);
      const data = await getConditions();
      setConditions(data);
    } catch (err) {
      setError(t('Failed to load conditions', 'Error al cargar las condiciones'));
      logger.error('Error loading conditions:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      <div className="max-w-6xl mx-auto px-4 py-6 relative">
        {/* Quick links (language, search and account controls live in the app header) */}
        <nav className={`${user ? 'grid grid-cols-2' : 'flex'} sm:flex sm:flex-wrap gap-2 mb-6 sm:mb-8 animate-in`} aria-label={t('Quick links', 'Accesos rápidos')}>
          {user && onViewDashboard && (
            <button
              onClick={onViewDashboard}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm sm:text-base whitespace-nowrap text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-primary-500/30"
            >
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              {t('Progress', 'Progreso')}
            </button>
          )}
          {onViewVideoLibrary && (
            <button
              onClick={onViewVideoLibrary}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm sm:text-base whitespace-nowrap text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:shadow-emerald-500/30"
            >
              <Video className="w-4 h-4" aria-hidden="true" />
              {t('Videos', 'Videos')}
            </button>
          )}
          {user && onViewResourceFinder && (
            <button
              onClick={onViewResourceFinder}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm sm:text-base whitespace-nowrap text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 font-semibold bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-teal-500/30"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              {t('Resources', 'Recursos')}
            </button>
          )}
          {user && onViewCommunity && (
            <button
              onClick={onViewCommunity}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm sm:text-base whitespace-nowrap text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200 font-semibold bg-gradient-to-r from-orange-600 to-orange-700 hover:shadow-orange-500/30"
            >
              <Users className="w-4 h-4" aria-hidden="true" />
              {t('Community', 'Comunidad')}
            </button>
          )}
        </nav>

        {user && (
          <div className="mb-10 space-y-6 animate-in-delay-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg p-4 sm:p-8 border border-white/60">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t('Essential Tools', 'Herramientas esenciales')}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1">
                {onViewBehaviorDiary && (
                  <button
                    onClick={onViewBehaviorDiary}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-100 rounded-2xl hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105 hover:-translate-y-2 active:scale-100 transition-all duration-300 border border-blue-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer"></div>
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900 sm:text-lg">{t('Behavior Diary', 'Diario de conducta')}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('Track patterns', 'Registrar patrones')}</div>
                    </div>
                  </button>
                )}
                {onViewCrisisPlan && (
                  <button
                    onClick={onViewCrisisPlan}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-br from-red-50 via-red-50 to-orange-100 rounded-2xl hover:shadow-xl hover:shadow-red-300/50 hover:scale-105 hover:-translate-y-2 active:scale-100 transition-all duration-300 border border-red-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer"></div>
                    <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900 sm:text-lg">{t('Crisis Plan', 'Plan de crisis')}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('Emergency prep', 'Preparación para emergencias')}</div>
                    </div>
                  </button>
                )}
                {onViewRewardsSystem && (
                  <button
                    onClick={onViewRewardsSystem}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gradient-to-br from-yellow-50 via-yellow-50 to-amber-100 rounded-2xl hover:shadow-xl hover:shadow-yellow-300/50 hover:scale-105 hover:-translate-y-2 active:scale-100 transition-all duration-300 border border-yellow-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-shimmer"></div>
                    <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900 sm:text-lg">{t('Rewards', 'Recompensas')}</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('Motivate progress', 'Motivar el progreso')}</div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg p-4 sm:p-8 border border-white/60">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t('Daily Management', 'Gestión diaria')}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1">
                {onViewMedicationTracker && (
                  <button
                    onClick={onViewMedicationTracker}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-violet-50 via-violet-50 to-purple-100 rounded-2xl hover:shadow-lg hover:shadow-violet-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-violet-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Pill className="w-8 h-8 sm:w-9 sm:h-9 text-violet-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Medication', 'Medicamentos')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Track doses', 'Registrar dosis')}</div>
                    </div>
                  </button>
                )}
                {onViewGoalTracker && (
                  <button
                    onClick={onViewGoalTracker}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-green-50 via-green-50 to-emerald-100 rounded-2xl hover:shadow-lg hover:shadow-green-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-green-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Target className="w-8 h-8 sm:w-9 sm:h-9 text-green-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Goals', 'Metas')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Track progress', 'Seguir el progreso')}</div>
                    </div>
                  </button>
                )}
                {onViewPhotoJournal && (
                  <button
                    onClick={onViewPhotoJournal}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-pink-50 via-pink-50 to-rose-100 rounded-2xl hover:shadow-lg hover:shadow-pink-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-pink-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Camera className="w-8 h-8 sm:w-9 sm:h-9 text-pink-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Photos', 'Fotos')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Document moments', 'Documentar momentos')}</div>
                    </div>
                  </button>
                )}
                {onViewAppointmentPrep && (
                  <button
                    onClick={onViewAppointmentPrep}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-indigo-50 via-indigo-50 to-blue-100 rounded-2xl hover:shadow-lg hover:shadow-indigo-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-indigo-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Calendar className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Appointments', 'Citas')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Prepare & track', 'Preparar y seguir')}</div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft-lg p-4 sm:p-8 border border-white/60">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t('Advanced Features', 'Funciones avanzadas')}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1">
                {onViewVisualSchedule && (
                  <button
                    onClick={onViewVisualSchedule}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-teal-50 via-teal-50 to-cyan-100 rounded-2xl hover:shadow-lg hover:shadow-teal-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-teal-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CalendarClock className="w-8 h-8 sm:w-9 sm:h-9 text-teal-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Schedule', 'Horario')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Visual routines', 'Rutinas visuales')}</div>
                    </div>
                  </button>
                )}
                {onViewSensoryProfile && (
                  <button
                    onClick={onViewSensoryProfile}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 rounded-2xl hover:shadow-lg hover:shadow-purple-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-purple-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-purple-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Sensory', 'Sensorial')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Profile needs', 'Perfil sensorial')}</div>
                    </div>
                  </button>
                )}
                {onViewAnalytics && (
                  <button
                    onClick={onViewAnalytics}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-2xl hover:shadow-lg hover:shadow-blue-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-blue-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <BarChart3 className="w-8 h-8 sm:w-9 sm:h-9 text-blue-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Analytics', 'Análisis')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Find patterns', 'Encontrar patrones')}</div>
                    </div>
                  </button>
                )}
                {onViewReports && (
                  <button
                    onClick={onViewReports}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-gray-50 via-gray-50 to-slate-100 rounded-2xl hover:shadow-lg hover:shadow-gray-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-gray-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 to-slate-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <FileText className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Reports', 'Informes')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Generate docs', 'Generar documentos')}</div>
                    </div>
                  </button>
                )}
                {onViewReminders && (
                  <button
                    onClick={onViewReminders}
                    className="group relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br from-orange-50 via-orange-50 to-amber-100 rounded-2xl hover:shadow-lg hover:shadow-orange-200/50 hover:scale-105 active:scale-100 transition-all duration-300 border border-orange-100/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Bell className="w-8 h-8 sm:w-9 sm:h-9 text-orange-600 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="font-bold text-gray-900">{t('Reminders', 'Recordatorios')}</div>
                      <div className="text-xs text-gray-600 mt-1">{t('Stay on track', 'Mantenerse al día')}</div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-10 sm:mb-16 animate-in-delay-2">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center max-w-5xl mx-auto mb-8">
            <div className="order-2 md:order-1 text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-cyan-100 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">{translations.trustedCompanion[language]}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                {translations.appTitle[language]}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                {translations.appSubtitle[language]}
              </p>
              {!user && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={onSignUp}
                    className="btn-primary group"
                  >
                    <span>{translations.getStartedFree[language]}</span>
                    <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  </button>
                  <button
                    onClick={onLogin}
                    className="btn-secondary"
                  >
                    {translations.signIn[language]}
                  </button>
                </div>
              )}
            </div>
            <div className={`order-1 md:order-2 relative ${user ? 'hidden md:block' : ''}`}>
              <div className="relative w-full max-w-md mx-auto animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative animate-scale-in">
                  <img
                    src="/mascot.png"
                    alt="ChildNeuroScan Mascot"
                    className="w-44 sm:w-64 md:w-full max-w-sm mx-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {!user && (
            <div className="bg-gradient-to-br from-primary-50 via-white to-cyan-50 rounded-3xl p-5 sm:p-8 border-2 border-primary-100 max-w-4xl mx-auto shadow-soft-lg backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-4 right-4 w-20 h-20 opacity-30" aria-hidden="true">
                <WelcomeIllustration />
              </div>
              <div className="relative">
                <p className="text-gray-700 sm:text-lg leading-relaxed mb-6 pr-16 sm:pr-24">
                  {translations.exploreTools[language]}
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{translations.tracking[language]}</h4>
                      <p className="text-sm text-gray-600">{translations.trackingDescription[language]}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{translations.analysis[language]}</h4>
                      <p className="text-sm text-gray-600">{translations.analysisDescription[language]}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{translations.community[language]}</h4>
                      <p className="text-sm text-gray-600">{translations.communityDescription[language]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft-lg p-5 sm:p-10 mb-8 sm:mb-10 border border-white/60 animate-in-delay-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            {translations.selectCondition[language]}
          </h2>
          <p className="text-gray-600 mb-6">
            {translations.selectConditionDescription[language]}
          </p>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4 lg:grid-cols-2">
              {conditions.length === 0 && (
                <div className="text-center py-8 text-gray-600 lg:col-span-2">
                  {t('No conditions available right now.', 'No hay condiciones disponibles en este momento.')}
                </div>
              )}
              {conditions.map((condition, index) => {
                return (
                <div
                  key={condition.id}
                  className="animate-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <ConditionCard
                    condition={condition}
                    onClick={() => onConditionSelect(condition)}
                  />
                </div>
              );
              })}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            {translations.disclaimer[language]}
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            {translations.disclaimerText[language]}
          </p>
        </div>
      </div>
    </div>
  );
}