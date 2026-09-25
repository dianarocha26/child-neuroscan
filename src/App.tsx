import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { GlobalSearch } from './components/GlobalSearch';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { AccountPrompt } from './components/AccountPrompt';
import { LandingPage } from './components/LandingPage';
import { AgeInput } from './components/AgeInput';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { MobileNavigation } from './components/MobileNavigation';
import { AppHeader } from './components/AppHeader';
import LoadingSpinner from './components/LoadingSpinner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SkipLink } from './components/SkipLink';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './lib/logger';

const ProgressDashboard = lazy(() => import('./components/ProgressDashboard'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));
const ResourceFinder = lazy(() => import('./components/ResourceFinder'));
const Community = lazy(() => import('./components/Community'));
const VideoLibrary = lazy(() => import('./components/VideoLibrary'));
const AppointmentPrep = lazy(() => import('./components/AppointmentPrep'));
const PhotoJournal = lazy(() => import('./components/PhotoJournal'));
const GoalTracker = lazy(() => import('./components/GoalTracker'));
const MedicationTracker = lazy(() => import('./components/MedicationTracker'));
const BehaviorDiary = lazy(() => import('./components/BehaviorDiary'));
const CrisisPlan = lazy(() => import('./components/CrisisPlan'));
const RewardsSystem = lazy(() => import('./components/RewardsSystem'));
const NotificationCenter = lazy(() => import('./components/NotificationCenter'));
const VisualSchedule = lazy(() => import('./components/VisualSchedule'));
const SensoryProfile = lazy(() => import('./components/SensoryProfile'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const ComprehensiveReportGenerator = lazy(() => import('./components/ComprehensiveReportGenerator'));
const ScreenWrapper = lazy(() => import('./components/ScreenWrapper'));
import { calculateScreeningScore, saveScreeningResult, getQuestionsForCondition } from './lib/database';
import type { Condition, RiskLevel, DomainScore } from './types/database';

export type Screen = 'login' | 'signup' | 'forgot-password' | 'landing' | 'age-input' | 'questionnaire' | 'results' | 'dashboard' | 'report' | 'resources' | 'community' | 'videos' | 'appointments' | 'photos' | 'goals' | 'medications' | 'behavior' | 'crisis' | 'rewards' | 'reminders' | 'schedule' | 'sensory' | 'analytics' | 'reports';

function AppContent() {
  const { user, loading, passwordRecovery, clearPasswordRecovery, signOut } = useAuth();
  const { language } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [childAgeMonths, setChildAgeMonths] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [hasRedFlags, setHasRedFlags] = useState(false);
  const [domainScores, setDomainScores] = useState<Record<string, DomainScore>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [selectedReportSessionId, setSelectedReportSessionId] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingSaveAction, setPendingSaveAction] = useState<'results' | 'dashboard' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (user && (currentScreen === 'login' || currentScreen === 'signup')) {
      setCurrentScreen('landing');
    }
  }, [user, currentScreen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  function handleConditionSelect(condition: Condition) {
    setSelectedCondition(condition);
    setCurrentScreen('age-input');
  }

  function handleAgeSubmit(ageInMonths: number) {
    setChildAgeMonths(ageInMonths);
    setCurrentScreen('questionnaire');
  }

  async function handleQuestionnaireComplete(questionResponses: Record<string, boolean>, name: string) {
    if (!selectedCondition) return;

    const fetchedQuestions = await getQuestionsForCondition(selectedCondition.id);

    const scoring = await calculateScreeningScore(
      selectedCondition.id,
      questionResponses,
      fetchedQuestions,
      childAgeMonths
    );

    setRiskLevel(scoring.riskLevel);
    setHasRedFlags(scoring.hasRedFlags);
    setDomainScores(scoring.domainScores);
    setTotalScore(scoring.totalScore);
    setMaxScore(scoring.maxScore);

    if (user) {
      await saveScreeningResult(
        selectedCondition.id,
        childAgeMonths,
        language,
        questionResponses,
        scoring.totalScore,
        scoring.maxScore,
        scoring.riskLevel,
        scoring.hasRedFlags,
        scoring.domainScores,
        name
      );
    } else {
      localStorage.setItem('guestScreeningData', JSON.stringify({
        condition: selectedCondition,
        childName: name,
        childAgeMonths,
        language,
        responses: questionResponses,
        scoring,
        timestamp: new Date().toISOString()
      }));
    }

    setCurrentScreen('results');
  }


  function handleStartNew() {
    // Don't keep a child's unsaved answers on a shared device
    localStorage.removeItem('guestScreeningData');
    setCurrentScreen('landing');
    setSelectedCondition(null);
    setChildAgeMonths(0);
    setRiskLevel('low');
    setHasRedFlags(false);
    setDomainScores({});
    setTotalScore(0);
    setMaxScore(0);
  }

  function handleViewDashboard() {
    if (!user) {
      setPendingSaveAction('dashboard');
      setShowAuthPrompt(true);
      return;
    }
    setCurrentScreen('dashboard');
  }

  function handleViewResourceFinder() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('resources');
  }

  function handleViewCommunity() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('community');
  }

  function handleViewVideoLibrary() {
    setCurrentScreen('videos');
  }

  function handleViewAppointmentPrep() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('appointments');
  }

  function handleViewPhotoJournal() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('photos');
  }

  function handleViewGoalTracker() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('goals');
  }

  function handleViewMedicationTracker() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('medications');
  }

  function handleViewBehaviorDiary() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('behavior');
  }

  function handleViewCrisisPlan() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('crisis');
  }

  function handleViewRewardsSystem() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('rewards');
  }

  function handleViewReminders() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('reminders');
  }

  function handleViewVisualSchedule() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('schedule');
  }

  function handleViewSensoryProfile() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('sensory');
  }

  function handleViewAnalytics() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('analytics');
  }

  function handleViewReports() {
    if (!user) {
      setCurrentScreen('signup');
      return;
    }
    setCurrentScreen('reports');
  }

  function handleSaveProgress() {
    if (!user) {
      setPendingSaveAction('results');
      setShowAuthPrompt(true);
    }
  }

  // Finish what a guest asked for (save results / open dashboard) once they
  // have logged in. Must run after `user` is set, not from the login
  // callback, which still sees the pre-login state.
  useEffect(() => {
    if (!user || !pendingSaveAction) return;

    const action = pendingSaveAction;
    setPendingSaveAction(null);
    setShowAuthPrompt(false);

    if (action === 'dashboard') {
      setCurrentScreen('dashboard');
      return;
    }

    // Stay on (or return to) results while saving; the login effect just
    // sent us to landing
    if (selectedCondition) setCurrentScreen('results');

    const guestData = localStorage.getItem('guestScreeningData');
    if (!guestData) return;

    (async () => {
      try {
        const parsed = JSON.parse(guestData);
        await saveScreeningResult(
          parsed.condition.id,
          parsed.childAgeMonths,
          parsed.language || language,
          parsed.responses,
          parsed.scoring.totalScore,
          parsed.scoring.maxScore,
          parsed.scoring.riskLevel,
          parsed.scoring.hasRedFlags,
          parsed.scoring.domainScores,
          parsed.childName
        );
        localStorage.removeItem('guestScreeningData');
      } catch (err) {
        logger.error('Failed to save guest screening after login', err);
        alert(language === 'es'
          ? 'No pudimos guardar su evaluación. Intente de nuevo más tarde.'
          : 'We could not save your screening. Please try again later.');
      }
    })();
  }, [user, pendingSaveAction, selectedCondition, language]);

  function handleGenerateReport(sessionId: string) {
    setSelectedReportSessionId(sessionId);
    setCurrentScreen('report');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (passwordRecovery) {
    return (
      <ResetPassword
        onComplete={() => {
          clearPasswordRecovery();
          setCurrentScreen('landing');
        }}
      />
    );
  }

  const isAuthScreen = ['login', 'signup', 'forgot-password'].includes(currentScreen);
  const showMobileNav = user && !isAuthScreen;

  return (
    <>
      <SkipLink />
      <OfflineIndicator />
      <AppHeader
        isLoggedIn={!!user}
        hideSignIn={isAuthScreen}
        onHome={() => setCurrentScreen('landing')}
        onSearch={() => setIsSearchOpen(true)}
        onLogin={() => setCurrentScreen('login')}
        onLogout={() => {
          setCurrentScreen('landing');
          void signOut();
        }}
      />
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={{
          onViewDashboard: handleViewDashboard,
          onViewMedicationTracker: handleViewMedicationTracker,
          onViewGoalTracker: handleViewGoalTracker,
          onViewPhotoJournal: handleViewPhotoJournal,
          onViewAppointmentPrep: handleViewAppointmentPrep,
          onViewCommunity: handleViewCommunity,
          onViewVideoLibrary: handleViewVideoLibrary,
          onViewResourceFinder: handleViewResourceFinder,
          onViewBehaviorDiary: handleViewBehaviorDiary,
          onViewCrisisPlan: handleViewCrisisPlan,
          onViewRewardsSystem: handleViewRewardsSystem,
          onViewVisualSchedule: handleViewVisualSchedule,
          onViewSensoryProfile: handleViewSensoryProfile,
          onViewAnalytics: handleViewAnalytics,
          onViewReports: handleViewReports
        }}
      />

      {showAuthPrompt && (
        <AccountPrompt
          onCreateAccount={() => {
            setShowAuthPrompt(false);
            setCurrentScreen('signup');
          }}
          onLogin={() => {
            setShowAuthPrompt(false);
            setCurrentScreen('login');
          }}
          onClose={() => {
            setShowAuthPrompt(false);
            setPendingSaveAction(null);
          }}
          context={pendingSaveAction === 'results' ? 'save' : 'dashboard'}
        />
      )}

      <main
        id="main-content"
        tabIndex={-1}
        className={`focus:outline-none ${showMobileNav ? 'pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0' : ''}`}
      >
      {currentScreen === 'login' && (
        <Login
          onSwitchToSignUp={() => setCurrentScreen('signup')}
          onForgotPassword={() => setCurrentScreen('forgot-password')}
          // Redirect happens in the effects above once `user` is set
          onLoginSuccess={() => {}}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPassword onBackToLogin={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'signup' && (
        <SignUp
          onSwitchToLogin={() => setCurrentScreen('login')}
          onSignUpSuccess={() => setCurrentScreen(s => (s === 'signup' ? 'login' : s))}
        />
      )}

      {currentScreen === 'landing' && (
        <LandingPage
          onConditionSelect={handleConditionSelect}
          onViewDashboard={handleViewDashboard}
          onViewResourceFinder={handleViewResourceFinder}
          onViewCommunity={handleViewCommunity}
          onViewVideoLibrary={handleViewVideoLibrary}
          onViewAppointmentPrep={handleViewAppointmentPrep}
          onViewPhotoJournal={handleViewPhotoJournal}
          onViewGoalTracker={handleViewGoalTracker}
          onViewMedicationTracker={handleViewMedicationTracker}
          onViewBehaviorDiary={handleViewBehaviorDiary}
          onViewCrisisPlan={handleViewCrisisPlan}
          onViewRewardsSystem={handleViewRewardsSystem}
          onViewReminders={handleViewReminders}
          onViewVisualSchedule={handleViewVisualSchedule}
          onViewSensoryProfile={handleViewSensoryProfile}
          onViewAnalytics={handleViewAnalytics}
          onViewReports={handleViewReports}
          onLogin={() => setCurrentScreen('login')}
          onSignUp={() => setCurrentScreen('signup')}
        />
      )}

      {currentScreen === 'age-input' && selectedCondition && (
        <AgeInput
          onSubmit={handleAgeSubmit}
          onBack={() => setCurrentScreen('landing')}
        />
      )}

      {currentScreen === 'questionnaire' && selectedCondition && (
        <Questionnaire
          condition={selectedCondition}
          childAgeMonths={childAgeMonths}
          onComplete={handleQuestionnaireComplete}
          onBack={() => setCurrentScreen('age-input')}
        />
      )}

      {currentScreen === 'results' && selectedCondition && (
        <Results
          condition={selectedCondition}
          riskLevel={riskLevel}
          hasRedFlags={hasRedFlags}
          domainScores={domainScores}
          totalScore={totalScore}
          maxScore={maxScore}
          childAgeMonths={childAgeMonths}
          onStartNew={handleStartNew}
          onViewDashboard={handleViewDashboard}
          onSaveProgress={handleSaveProgress}
          isGuest={!user}
        />
      )}

      {currentScreen === 'dashboard' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ProgressDashboard
            userId={user.id}
            onGenerateReport={handleGenerateReport}
            onBack={() => setCurrentScreen('landing')}
          />
        </Suspense>
      )}

      {currentScreen === 'report' && user && selectedReportSessionId && (
        <Suspense fallback={<LoadingSpinner />}>
          <ReportGenerator
            sessionId={selectedReportSessionId}
            userId={user.id}
            onBack={handleViewDashboard}
          />
        </Suspense>
      )}

      {currentScreen === 'resources' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ResourceFinder
            userId={user.id}
            onBack={() => setCurrentScreen('landing')}
          />
        </Suspense>
      )}

      {currentScreen === 'community' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <Community
            userId={user.id}
            onBack={() => setCurrentScreen('landing')}
          />
        </Suspense>
      )}

      {currentScreen === 'videos' && (
        <Suspense fallback={<LoadingSpinner />}>
          <VideoLibrary
            userId={user?.id}
            onBack={() => setCurrentScreen('landing')}
          />
        </Suspense>
      )}

      {currentScreen === 'appointments' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <AppointmentPrep
            userId={user.id}
            onBack={() => setCurrentScreen('landing')}
          />
        </Suspense>
      )}

      {currentScreen === 'photos' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <PhotoJournal />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'goals' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <GoalTracker />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'medications' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <MedicationTracker />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'behavior' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <BehaviorDiary />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'crisis' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <CrisisPlan />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'rewards' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <RewardsSystem />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'reminders' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <NotificationCenter />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'schedule' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <VisualSchedule />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'sensory' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <SensoryProfile />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'analytics' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <AnalyticsDashboard />
          </ScreenWrapper>
        </Suspense>
      )}

      {currentScreen === 'reports' && user && (
        <Suspense fallback={<LoadingSpinner />}>
          <ScreenWrapper onBack={() => setCurrentScreen('landing')}>
            <ComprehensiveReportGenerator />
          </ScreenWrapper>
        </Suspense>
      )}

      </main>

      {showMobileNav && (
        <MobileNavigation
          currentView={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
