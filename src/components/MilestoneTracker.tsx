import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Plus, X, Calendar, Trophy, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';

interface Milestone {
  id: string;
  milestone_text: string;
  achieved: boolean;
  achieved_date: string | null;
  created_at: string;
}

interface MilestoneTrackerProps {
  userId: string;
  sessionId?: string;
  conditionType?: string;
}

const MILESTONE_SUGGESTIONS: { [key: string]: string[] } = {
  asd: [
    'Makes eye contact during interactions',
    'Responds to their name when called',
    'Shows interest in other children',
    'Uses gestures to communicate (pointing, waving)',
    'Engages in pretend play',
    'Follows simple one-step instructions',
    'Shows objects to share interest'
  ],
  adhd: [
    'Completes a task without reminders',
    'Sits through a meal or activity',
    'Follows a morning routine independently',
    'Waits their turn in games',
    'Controls impulses in challenging situations',
    'Organizes toys or materials without help',
    'Listens to instructions before starting a task'
  ],
  speech: [
    'Says first word clearly',
    'Combines two words together',
    'Names familiar objects',
    'Follows two-step directions',
    'Uses pronouns correctly (I, me, you)',
    'Speaks in short sentences',
    'Asks simple questions'
  ],
  developmental: [
    'Rolls over independently',
    'Sits without support',
    'Crawls or scoots',
    'Pulls to standing',
    'Takes first steps',
    'Feeds self with fingers',
    'Stacks blocks or objects'
  ],
  learning: [
    'Recognizes letters of the alphabet',
    'Counts to 10',
    'Writes their name',
    'Identifies colors correctly',
    'Sorts objects by category',
    'Completes a simple puzzle',
    'Follows a story sequence'
  ],
  sensory: [
    'Tolerates different clothing textures',
    'Participates in messy play activities',
    'Tries new foods without distress',
    'Manages loud environments better',
    'Uses appropriate touch with others',
    'Transitions between activities smoothly',
    'Self-regulates when overwhelmed'
  ]
};

export function MilestoneTracker({ userId, sessionId, conditionType }: MilestoneTrackerProps) {
  const { t } = useLanguage();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    loadMilestones();
  }, [userId, sessionId]);

  const loadMilestones = async () => {
    setLoading(true);
    let query = supabase
      .from('progress_milestones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error loading milestones:', error);
    } else {
      setMilestones(data || []);
    }
    setLoading(false);
  };

  const addMilestone = async (text: string) => {
    if (!text.trim()) return;

    const { error } = await supabase
      .from('progress_milestones')
      .insert({
        user_id: userId,
        session_id: sessionId || null,
        milestone_text: text.trim(),
        achieved: false
      });

    if (error) {
      logger.error('Error adding milestone:', error);
    } else {
      setNewMilestone('');
      setShowAddForm(false);
      setShowSuggestions(false);
      await loadMilestones();
    }
  };

  const toggleMilestone = async (milestone: Milestone) => {
    const { error } = await supabase
      .from('progress_milestones')
      .update({
        achieved: !milestone.achieved,
        achieved_date: !milestone.achieved ? new Date().toISOString() : null
      })
      .eq('id', milestone.id);

    if (error) {
      logger.error('Error updating milestone:', error);
    } else {
      await loadMilestones();
    }
  };

  const deleteMilestone = async (id: string) => {
    const { error } = await supabase
      .from('progress_milestones')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting milestone:', error);
    } else {
      await loadMilestones();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const achievedCount = milestones.filter(m => m.achieved).length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

  const suggestions = conditionType ? MILESTONE_SUGGESTIONS[conditionType] || [] : [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-teal-600" />
          <h3 className="text-xl font-bold text-gray-900">
            {t('Milestone Tracker', 'Rastreador de Hitos')}
          </h3>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {achievedCount} / {totalCount}
            </span>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {t('Overall Progress', 'Progreso General')}
            </span>
            <span className="text-sm font-semibold text-teal-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-teal-500 to-green-500 rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors font-medium mb-4"
        >
          <Plus className="w-5 h-5" />
          {t('Add Milestone', 'Agregar Hito')}
        </button>
      )}

      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder={t('Enter milestone...', 'Ingrese hito...')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addMilestone(newMilestone);
                }
              }}
            />
            <button
              onClick={() => addMilestone(newMilestone)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              {t('Add', 'Agregar')}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewMilestone('');
                setShowSuggestions(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-2"
              >
                {showSuggestions
                  ? t('Hide suggestions', 'Ocultar sugerencias')
                  : t('Show milestone suggestions', 'Mostrar sugerencias de hitos')}
              </button>

              {showSuggestions && (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => addMilestone(suggestion)}
                      className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-sm text-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      )}

      {!loading && milestones.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {t('No milestones yet. Add your first milestone to start tracking!',
               'Aún no hay hitos. ¡Agregue su primer hito para comenzar a rastrear!')}
          </p>
        </div>
      )}

      {!loading && milestones.length > 0 && (
        <div className="space-y-2">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                milestone.achieved
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-teal-300'
              }`}
            >
              <button
                onClick={() => toggleMilestone(milestone)}
                className="flex-shrink-0 mt-0.5"
              >
                {milestone.achieved ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 hover:text-teal-500 transition-colors" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    milestone.achieved
                      ? 'text-green-900 line-through'
                      : 'text-gray-900'
                  }`}
                >
                  {milestone.milestone_text}
                </p>
                {milestone.achieved && milestone.achieved_date && (
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">
                      {t('Achieved on', 'Logrado el')} {formatDate(milestone.achieved_date)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => deleteMilestone(milestone.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}