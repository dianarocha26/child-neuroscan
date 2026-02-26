import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, TrendingUp, Filter, Calendar, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import type { BehaviorEntry, BehaviorTrigger, BehaviorIntervention } from '../types/components';

export default function BehaviorDiary() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<BehaviorEntry[]>([]);
  const [triggers, setTriggers] = useState<BehaviorTrigger[]>([]);
  const [interventions, setInterventions] = useState<BehaviorIntervention[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { loading, setLoading } = useLoadingState();
  const [filterType, setFilterType] = useState<string>('all');

  const [formData, setFormData] = useState({
    child_name: '',
    entry_date: new Date().toISOString().split('T')[0],
    entry_time: new Date().toTimeString().slice(0, 5),
    behavior_type: '',
    severity: 3,
    duration_minutes: '',
    location: '',
    triggers: [] as string[],
    antecedents: '',
    consequences: '',
    interventions_used: [] as string[],
    effectiveness: '',
    notes: ''
  });

  const behaviorTypes = [
    'Meltdown', 'Tantrum', 'Positive Behavior', 'Aggressive', 'Self-Harm',
    'Repetitive Behavior', 'Withdrawal', 'Defiance', 'Other'
  ];

  const triggerCategories = [
    'Sensory', 'Social', 'Transition', 'Food', 'Sleep', 'Routine Change',
    'Communication', 'Environmental', 'Physical', 'Other'
  ];

  const interventionTypes = [
    'Calming', 'Redirection', 'Sensory', 'Communication', 'Physical Support',
    'Environmental Modification', 'Break/Time Out', 'Social Story', 'Other'
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) {
      logger.error('Cannot load data: user is null');
      setLoading(false);
      return;
    }

    try {
      const [entriesRes, triggersRes, interventionsRes] = await Promise.all([
        supabase
          .from('behavior_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('entry_date', { ascending: false })
          .order('entry_time', { ascending: false }),
        supabase
          .from('behavior_triggers')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('behavior_interventions')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (entriesRes.data) setEntries(entriesRes.data);
      if (triggersRes.data) setTriggers(triggersRes.data);
      if (interventionsRes.data) setInterventions(interventionsRes.data);
    } catch (error) {
      logger.error('Error loading behavior diary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a behavior entry');
      return;
    }

    try {
      const { error } = await supabase.from('behavior_entries').insert({
        user_id: user.id,
        child_name: formData.child_name,
        entry_date: formData.entry_date,
        entry_time: formData.entry_time,
        behavior_type: formData.behavior_type,
        severity: formData.severity,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        location: formData.location || null,
        triggers: formData.triggers,
        antecedents: formData.antecedents || null,
        consequences: formData.consequences || null,
        interventions_used: formData.interventions_used,
        effectiveness: formData.effectiveness ? parseInt(formData.effectiveness) : null,
        notes: formData.notes || null
      });

      if (error) throw error;

      setShowForm(false);
      setFormData({
        child_name: '',
        entry_date: new Date().toISOString().split('T')[0],
        entry_time: new Date().toTimeString().slice(0, 5),
        behavior_type: '',
        severity: 3,
        duration_minutes: '',
        location: '',
        triggers: [],
        antecedents: '',
        consequences: '',
        interventions_used: [],
        effectiveness: '',
        notes: ''
      });
      loadData();
    } catch (error) {
      logger.error('Error creating behavior entry:', error);
      alert('Failed to create behavior entry');
    }
  };

  const addCustomTrigger = async (triggerName: string, category: string) => {
    if (!user) {
      logger.error('Cannot add trigger: user is null');
      return;
    }

    try {
      const { error } = await supabase.from('behavior_triggers').insert({
        user_id: user.id,
        trigger_name: triggerName,
        trigger_category: category
      });

      if (!error) loadData();
    } catch (error) {
      logger.error('Error adding trigger:', error);
    }
  };

  const addCustomIntervention = async (interventionName: string, type: string) => {
    if (!user) {
      logger.error('Cannot add intervention: user is null');
      return;
    }

    try {
      const { error } = await supabase.from('behavior_interventions').insert({
        user_id: user.id,
        intervention_name: interventionName,
        intervention_type: type
      });

      if (!error) loadData();
    } catch (error) {
      logger.error('Error adding intervention:', error);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'bg-green-100 text-green-800';
    if (severity === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredEntries = filterType === 'all'
    ? entries
    : entries.filter(e => e.behavior_type === filterType);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Behavior Diary</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-700">Total Entries</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{entries.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-700">This Week</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {entries.filter(e => {
              const entryDate = new Date(e.entry_date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return entryDate >= weekAgo;
            }).length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-700">Avg Severity</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {entries.length > 0
              ? (entries.reduce((sum, e) => sum + e.severity, 0) / entries.length).toFixed(1)
              : '0'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-700">Saved Triggers</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{triggers.length}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Behaviors</option>
          {behaviorTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">New Behavior Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.child_name}
                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Behavior Type
                  </label>
                  <select
                    required
                    value={formData.behavior_type}
                    onChange={(e) => setFormData({ ...formData, behavior_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    {behaviorTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.entry_date}
                    onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.entry_time}
                    onChange={(e) => setFormData({ ...formData, entry_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity (1-5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center font-semibold text-lg">{formData.severity}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What happened before? (Antecedents)
                </label>
                <textarea
                  value={formData.antecedents}
                  onChange={(e) => setFormData({ ...formData, antecedents: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What happened after? (Consequences)
                </label>
                <textarea
                  value={formData.consequences}
                  onChange={(e) => setFormData({ ...formData, consequences: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{entry.child_name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(entry.severity)}`}>
                    Severity {entry.severity}/5
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {entry.behavior_type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {entry.entry_time}
                  </span>
                  {entry.duration_minutes && (
                    <span>{entry.duration_minutes} min</span>
                  )}
                  {entry.location && (
                    <span>@ {entry.location}</span>
                  )}
                </div>
              </div>
            </div>

            {entry.antecedents && (
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Before: </span>
                <span className="text-gray-600">{entry.antecedents}</span>
              </div>
            )}

            {entry.consequences && (
              <div className="mb-3">
                <span className="font-semibold text-gray-700">After: </span>
                <span className="text-gray-600">{entry.consequences}</span>
              </div>
            )}

            {entry.notes && (
              <div className="mb-3">
                <span className="font-semibold text-gray-700">Notes: </span>
                <span className="text-gray-600">{entry.notes}</span>
              </div>
            )}

            {entry.triggers.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="text-sm font-semibold text-gray-700">Triggers:</span>
                {entry.triggers.map((trigger, idx) => (
                  <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                    {trigger}
                  </span>
                ))}
              </div>
            )}

            {entry.interventions_used.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="text-sm font-semibold text-gray-700">Interventions:</span>
                {entry.interventions_used.map((intervention, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {intervention}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Entries Yet</h3>
            <p className="text-gray-600 mb-6">Start tracking behaviors to see patterns and progress</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}