import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, TrendingUp, Filter, Calendar, Clock, AlertCircle, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import {
  createBehaviorEntry, deleteBehaviorEntry, listBehaviorEntries, listBehaviorInterventions, listBehaviorTriggers,
  updateBehaviorEntry, type BehaviorEntry, type BehaviorIntervention, type BehaviorTrigger
} from '../lib/api/behavior';
import { PageHeader } from './PageHeader';

export default function BehaviorDiary() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<BehaviorEntry[]>([]);
  const [triggers, setTriggers] = useState<BehaviorTrigger[]>([]);
  const [, setInterventions] = useState<BehaviorIntervention[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BehaviorEntry | null>(null);
  const { loading, setLoading } = useLoadingState();
  const [filterType, setFilterType] = useState<string>('all');

  const emptyForm = {
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
  };

  const [formData, setFormData] = useState(emptyForm);

  const behaviorTypes = [
    'Meltdown', 'Tantrum', 'Positive Behavior', 'Aggressive', 'Self-Harm',
    'Repetitive Behavior', 'Withdrawal', 'Defiance', 'Other'
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [entriesData, triggersData, interventionsData] = await Promise.all([
        listBehaviorEntries(user.id),
        listBehaviorTriggers(user.id),
        listBehaviorInterventions(user.id)
      ]);

      setEntries(entriesData);
      setTriggers(triggersData);
      setInterventions(interventionsData);
    } catch (error) {
      logger.error('Error loading behavior diary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openNewEntry = () => {
    setEditingEntry(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditEntry = (entry: BehaviorEntry) => {
    setEditingEntry(entry);
    setFormData({
      child_name: entry.child_name,
      entry_date: entry.entry_date,
      entry_time: entry.entry_time || '',
      behavior_type: entry.behavior_type || '',
      severity: entry.severity || 3,
      duration_minutes: entry.duration_minutes ? String(entry.duration_minutes) : '',
      location: entry.location || '',
      triggers: Array.isArray(entry.triggers) ? entry.triggers as string[] : [],
      antecedents: entry.antecedents || '',
      consequences: entry.consequences || '',
      interventions_used: entry.interventions_used || [],
      effectiveness: entry.effectiveness ? String(entry.effectiveness) : '',
      notes: entry.notes || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in');
      return;
    }

    try {
      const payload = {
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
      };

      if (editingEntry) {
        await updateBehaviorEntry(editingEntry.id, payload);
      } else {
        await createBehaviorEntry(user.id, payload);
      }

      setShowForm(false);
      setEditingEntry(null);
      setFormData(emptyForm);
      loadData();
    } catch (error) {
      logger.error('Error saving behavior entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      await deleteBehaviorEntry(entryId);
      loadData();
    } catch (error) {
      logger.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
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
      <PageHeader
        icon={BookOpen}
        tone="blue"
        title="Behavior Diary"
        subtitle="Log behaviors, what triggered them and what helped"
        action={{ label: 'New Entry', icon: Plus, onClick: openNewEntry }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">Total Entries</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{entries.length}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">This Week</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {entries.filter(e => {
              const entryDate = new Date(e.entry_date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return entryDate >= weekAgo;
            }).length}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">Avg Severity</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {entries.length > 0
              ? (entries.reduce((sum, e) => sum + (e.severity || 0), 0) / entries.length).toFixed(1)
              : '0'}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-700">Saved Triggers</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{triggers.length}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3 sm:gap-4">
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
        <div className="modal-overlay">
          <div className="modal-panel max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">{editingEntry ? 'Edit Entry' : 'New Behavior Entry'}</h2>
              <button onClick={() => { setShowForm(false); setEditingEntry(null); }} type="button" aria-label="Close" className="p-2 -m-2 flex-shrink-0 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="behavior-diary-child-name" className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                  <input id="behavior-diary-child-name"
                    type="text"
                    required
                    value={formData.child_name}
                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="behavior-diary-behavior-type" className="block text-sm font-medium text-gray-700 mb-1">Behavior Type</label>
                  <select id="behavior-diary-behavior-type"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="behavior-diary-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input id="behavior-diary-date"
                    type="date"
                    required
                    value={formData.entry_date}
                    onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="behavior-diary-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input id="behavior-diary-time"
                    type="time"
                    value={formData.entry_time}
                    onChange={(e) => setFormData({ ...formData, entry_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="behavior-diary-severity-1-5" className="block text-sm font-medium text-gray-700 mb-1">Severity (1-5)</label>
                  <input id="behavior-diary-severity-1-5"
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
                  <label htmlFor="behavior-diary-duration-minutes" className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input id="behavior-diary-duration-minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="behavior-diary-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input id="behavior-diary-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="behavior-diary-what-happened-before-anteceden" className="block text-sm font-medium text-gray-700 mb-1">What happened before? (Antecedents)</label>
                <textarea id="behavior-diary-what-happened-before-anteceden"
                  value={formData.antecedents}
                  onChange={(e) => setFormData({ ...formData, antecedents: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="behavior-diary-what-happened-after-consequenc" className="block text-sm font-medium text-gray-700 mb-1">What happened after? (Consequences)</label>
                <textarea id="behavior-diary-what-happened-after-consequenc"
                  value={formData.consequences}
                  onChange={(e) => setFormData({ ...formData, consequences: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="behavior-diary-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea id="behavior-diary-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="modal-footer flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-teal-700 text-white py-2.5 rounded-lg hover:bg-teal-800 transition"
                >
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingEntry(null); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition"
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
          <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{entry.child_name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(entry.severity || 3)}`}>
                    Severity {entry.severity}/5
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {entry.behavior_type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </span>
                  {entry.entry_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {entry.entry_time}
                    </span>
                  )}
                  {entry.duration_minutes && <span>{entry.duration_minutes} min</span>}
                  {entry.location && <span>@ {entry.location}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => openEditEntry(entry)}
                  className="w-10 h-10 inline-flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit entry"
                  aria-label="Edit entry"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="w-10 h-10 inline-flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete entry"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
            {Array.isArray(entry.triggers) && entry.triggers.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="text-sm font-semibold text-gray-700">Triggers:</span>
                {(entry.triggers as string[]).map((trigger, idx) => (
                  <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">{trigger}</span>
                ))}
              </div>
            )}
            {entry.interventions_used && entry.interventions_used.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="text-sm font-semibold text-gray-700">Interventions:</span>
                {entry.interventions_used.map((intervention, idx) => (
                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{intervention}</span>
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
              onClick={openNewEntry}
              className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
            >
              Create First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}