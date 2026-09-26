import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Target, Pill, Camera, Calendar, TrendingUp, Users, Video, type LucideIcon } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  action: () => void;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: {
    onViewDashboard?: () => void;
    onViewMedicationTracker?: () => void;
    onViewGoalTracker?: () => void;
    onViewPhotoJournal?: () => void;
    onViewAppointmentPrep?: () => void;
    onViewCommunity?: () => void;
    onViewVideoLibrary?: () => void;
    onViewResourceFinder?: () => void;
    onViewBehaviorDiary?: () => void;
    onViewCrisisPlan?: () => void;
    onViewRewardsSystem?: () => void;
    onViewVisualSchedule?: () => void;
    onViewSensoryProfile?: () => void;
    onViewAnalytics?: () => void;
    onViewReports?: () => void;
  };
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allSearchableItems: SearchResult[] = [
    {
      id: 'dashboard',
      title: 'Progress Dashboard',
      description: 'View your child\'s progress and milestones',
      category: 'Tracking',
      icon: TrendingUp,
      action: () => { onNavigate?.onViewDashboard?.(); onClose(); }
    },
    {
      id: 'medication',
      title: 'Medication Tracker',
      description: 'Track medications and supplements',
      category: 'Health',
      icon: Pill,
      action: () => { onNavigate?.onViewMedicationTracker?.(); onClose(); }
    },
    {
      id: 'goals',
      title: 'Goal Tracker',
      description: 'Set and track therapy goals',
      category: 'Progress',
      icon: Target,
      action: () => { onNavigate?.onViewGoalTracker?.(); onClose(); }
    },
    {
      id: 'photos',
      title: 'Photo Journal',
      description: 'Document milestones with photos',
      category: 'Memory',
      icon: Camera,
      action: () => { onNavigate?.onViewPhotoJournal?.(); onClose(); }
    },
    {
      id: 'appointments',
      title: 'Appointment Prep',
      description: 'Prepare for medical appointments',
      category: 'Health',
      icon: Calendar,
      action: () => { onNavigate?.onViewAppointmentPrep?.(); onClose(); }
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with other parents',
      category: 'Support',
      icon: Users,
      action: () => { onNavigate?.onViewCommunity?.(); onClose(); }
    },
    {
      id: 'videos',
      title: 'Video Library',
      description: 'Educational videos and tutorials',
      category: 'Learning',
      icon: Video,
      action: () => { onNavigate?.onViewVideoLibrary?.(); onClose(); }
    },
    {
      id: 'behavior',
      title: 'Behavior Diary',
      description: 'Track behavior patterns and triggers',
      category: 'Tracking',
      icon: FileText,
      action: () => { onNavigate?.onViewBehaviorDiary?.(); onClose(); }
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate and export reports',
      category: 'Documentation',
      icon: FileText,
      action: () => { onNavigate?.onViewReports?.(); onClose(); }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      // Start with suggestions rather than an empty "No results" state
      setResults(allSearchableItems.slice(0, 8));
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      const filtered = allSearchableItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery)
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults(allSearchableItems.slice(0, 8));
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      results[selectedIndex].action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-4 sm:pt-20 px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search dialog"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools and help"
            className="flex-1 min-w-0 bg-transparent border-none outline-none rounded-md px-2 py-1 text-lg text-gray-900 placeholder-gray-500 focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Search tools and help"
            autoComplete="off"
          />
          <button
            onClick={onClose}
            className="p-2.5 -mr-1 hover:bg-gray-100 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-9rem)] sm:max-h-96 overflow-y-auto overscroll-contain">
          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <button
                    key={result.id}
                    onClick={result.action}
                    className={`w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition ${
                      index === selectedIndex ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden sm:flex p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 items-center justify-between">
          <div className="flex gap-4">
            <span><kbd className="px-2 py-1 bg-white rounded border border-gray-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-2 py-1 bg-white rounded border border-gray-300">Enter</kbd> Select</span>
            <span><kbd className="px-2 py-1 bg-white rounded border border-gray-300">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
