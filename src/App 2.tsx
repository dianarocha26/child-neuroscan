import { useState, useEffect, lazy, Suspense } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { ThemeSwitch } from './components/ThemeSwitch';
import { GlobalSearch } from './components/GlobalSearch';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { AccountPrompt } from './components/AccountPrompt';
import { LandingPage } from './components/LandingPage';
import { AgeInput } from './components/AgeInput';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { MobileNavigation } from './components/MobileNavigation';
import LoadingSpinner from './components/LoadingSpinner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SkipLink } from './components/SkipLink';
import { ErrorBoundary } from './components/ErrorBoundary';

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
import type { Condition, Question, RiskLevel, DomainScore } from './types/database';

type Screen = 'login' | 'signup' | 'landing' | 'age-input' | 'questionnaire' | 'results' | 'dashboard' | 'report' | 'resources' | 'community' | 'videos' | 'appointments' | 'photos' | 'goals' | 'medications' | 'behavior' | 'crisis' | 'rewards' | 'reminders' | 'schedule' | 'sensory' | 'analytics' | 'reports';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [childAgeMonths, setChildAgeMonths] = useState<number>(0);
  const [childName, setChildName] = useState<string>('');
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [hasRedFlags, setHasRedFlags] = useState(false);
  const [domainScores, setDomainScores] = useState<Record<string, DomainScore>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
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

    setResponses(questionResponses);
    setChildName(name);

    const fetchedQuestions = await getQuestionsForCondition(selectedCondition.id);
    setQuestions(fetchedQuestions);

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
      const result = await saveScreeningResult(
        selectedCondition.id,
        childAgeMonths,
        'en',
        questionResponses,
        scoring.totalScore,
        scoring.riskLevel,
        scoring.hasRedFlags,
        scoring.domainScores,
        name
      );

      if (result) {
        setCurrentSessionId(result.id);
      }
    } else {
      localStorage.setItem('guestScreeningData', JSON.stringify({
        condition: selectedCondition,
        childName: name,
        childAgeMonths,
        responses: questionResponses,
        scoring,
        timestamp: new Date().toISOString()
      }));
    }

    setCurrentScreen('results');
  }


  function handleStartNew() {
    setCurrentScreen('landing');
    setSelectedCondition(null);
    setChildAgeMonths(0);
    setChildName('');
    setResponses({});
    setQuestions([]);
    setRiskLevel('low');
    setHasRedFlags(false);
    setDomainScores({});
    setTotalScore(0);
    setMaxScore(0);
    setCurrentSessionId(null);
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

  async function handleAuthSuccess() {
    setShowAuthPrompt(false);

    if (pendingSaveAction === 'results' && selectedCondition) {
      const guestData = localStorage.getItem('guestScreeningData');
      if (guestData && user) {
        const parsed = JSON.parse(guestData);

        const result = await saveScreeningResult(
          parsed.condition.id,
          parsed.childAgeMonths,
          'en',
          parsed.responses,
          parsed.scoring.totalScore,
          parsed.scoring.riskLevel,
          parsed.scoring.hasRedFlags,
          parsed.scoring.domainScores,
          parsed.childName
        );

        if (result) {
          setCurrentSessionId(result.id);
        }

        localStorage.removeItem('guestScreeningData');
      }
    } else if (pendingSaveAction === 'dashboard') {
      setCurrentScreen('dashboard');
    }

    setPendingSaveAction(null);
  }

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

  const showMobileNav = user && !['login', 'signup'].includes(currentScreen);

  return (
    <>
      <SkipLink />
      <OfflineIndicator />
      <div className={showMobileNav ? 'pb-16' : ''} id="main-content">
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

      {user && currentScreen !== 'login' && currentScreen !== 'signup' && (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="fixed top-4 right-20 z-40 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 border border-gray-200 dark:border-gray-700"
          title="Search (Cmd/Ctrl+K)"
          aria-label="Open search"
        >
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
        </button>
      )}

      {currentScreen !== 'login' && currentScreen !== 'signup' && (
        <div className="fixed top-4 right-4 z-40">
          <ThemeSwitch />
        </div>
      )}

      {currentScreen === 'login' && (
        <Login
          onSwitchToSignUp={() => setCurrentScreen('signup')}
          onLoginSuccess={() => {
            handleAuthSuccess();
            setCurrentScreen('landing');
          }}
        />
      )}

      {currentScreen === 'signup' && (
        <SignUp
          onSwitchToLogin={() => setCurrentScreen('login')}
          onSignUpSuccess={() => setCurrentScreen('login')}
        />
      )}

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

      {showMobileNav && (
        <MobileNavigation
          currentView={currentScreen}
          onNavigate={(view) => {
            const screenMap: Record<string, Screen> = {
              'dashboard': 'dashboard',
              'screening': 'questionnaire',
              'resources': 'resources',
              'community': 'community',
              'progress': 'progress',
              'profile': 'analytics'
            };
            const targetScreen = screenMap[view] || 'landing';
            setCurrentScreen(targetScreen);
          }}
        />
      )}
      </div>
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
