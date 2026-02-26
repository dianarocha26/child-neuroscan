import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Calendar, Edit2, Trash2, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface Goal {
  id: string;
  child_name: string;
  title: string;
  description: string;
  category: 'speech' | 'motor' | 'social' | 'behavioral' | 'academic' | 'self-care';
  linked_condition: string;
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string | null;
  status: 'not_started' | 'in_progress' | 'achieved' | 'archived';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  created_at: string;
  completed_at: string | null;
}

interface ProgressLog {
  id: string;
  goal_id: string;
  value: number;
  notes: string;
  logged_at: string;
}

export default function GoalTracker() {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [filterCategory, setFilterCategory] = useState<string>('');

  const [goalForm, setGoalForm] = useState({
    child_name: '',
    title: '',
    description: '',
    category: 'speech' as Goal['category'],
    linked_condition: '',
    target_value: 0,
    current_value: 0,
    unit: 'count',
    target_date: '',
    priority: 'medium' as Goal['priority'],
    notes: ''
  });

  const [progressForm, setProgressForm] = useState({
    value: 0,
    notes: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    if (selectedGoal) {
      loadProgressLogs(selectedGoal.id);
    }
  }, [selectedGoal]);

  const loadGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      logger.error('Failed to load goals', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressLogs = async (goalId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('goal_progress_logs')
        .select('*')
        .eq('goal_id', goalId)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setProgressLogs(data || []);
    } catch (error) {
      logger.error('Failed to load progress logs', error);
    }
  };

  const handleSubmitGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const goalData = {
        ...goalForm,
        user_id: user.id,
        status: goalForm.current_value === 0 ? 'not_started' : 'in_progress'
      };

      if (editingGoal) {
        const { error } = await supabase
          .from('goals')
          .update(goalData)
          .eq('id', editingGoal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('goals')
          .insert(goalData);
        if (error) throw error;
      }

      setShowGoalForm(false);
      setEditingGoal(null);
      resetGoalForm();
      loadGoals();
    } catch (error) {
      logger.error('Error saving goal', error);
      alert('Failed to save goal. Please try again.');
    }
  };

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: logError } = await supabase
        .from('goal_progress_logs')
        .insert({
          goal_id: selectedGoal.id,
          user_id: user.id,
          value: progressForm.value,
          notes: progressForm.notes
        });

      if (logError) throw logError;

      const newStatus = progressForm.value >= selectedGoal.target_value ? 'achieved' : 'in_progress';
      const updateData: any = {
        current_value: progressForm.value,
        status: newStatus
      };

      if (newStatus === 'achieved' && !selectedGoal.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('goals')
        .update(updateData)
        .eq('id', selectedGoal.id);

      if (updateError) throw updateError;

      setShowProgressForm(false);
      setProgressForm({ value: 0, notes: '' });
      loadGoals();
      loadProgressLogs(selectedGoal.id);
    } catch (error) {
      logger.error('Error logging progress', error);
      alert('Failed to log progress. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      loadGoals();
      setSelectedGoal(null);
    } catch (error) {
      logger.error('Error deleting goal', error);
      alert('Failed to delete goal. Please try again.');
    }
  };

  const resetGoalForm = () => {
    setGoalForm({
      child_name: '',
      title: '',
      description: '',
      category: 'speech',
      linked_condition: '',
      target_value: 0,
      current_value: 0,
      unit: 'count',
      target_date: '',
      priority: 'medium',
      notes: ''
    });
  };

  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      child_name: goal.child_name,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      linked_condition: goal.linked_condition,
      target_value: goal.target_value,
      current_value: goal.current_value,
      unit: goal.unit,
      target_date: goal.target_date || '',
      priority: goal.priority,
      notes: goal.notes
    });
    setShowGoalForm(true);
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.target_value === 0) return 0;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'achieved': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'archived': return 'text-gray-400 bg-gray-50';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filterStatus === 'active' && (goal.status === 'archived' || goal.status === 'achieved')) return false;
    if (filterStatus === 'achieved' && goal.status !== 'achieved') return false;
    if (filterStatus === 'archived' && goal.status !== 'archived') return false;
    if (filterCategory && goal.category !== filterCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Goal Tracker</h2>
            <p className="text-gray-600">Set and track therapy goals for your child</p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              resetGoalForm();
              setShowGoalForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active Goals</option>
            <option value="achieved">Achieved Goals</option>
            <option value="archived">Archived Goals</option>
            <option value="">All Goals</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="speech">Speech</option>
            <option value="motor">Motor Skills</option>
            <option value="social">Social Skills</option>
            <option value="behavioral">Behavioral</option>
            <option value="academic">Academic</option>
            <option value="self-care">Self-Care</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center justify-end">
            {filteredGoals.length} {filteredGoals.length === 1 ? 'goal' : 'goals'}
          </div>
        </div>
      </div>

      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <button onClick={() => setShowGoalForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name *</label>
                  <input
                    type="text"
                    value={goalForm.child_name}
                    onChange={(e) => setGoalForm({ ...goalForm, child_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={goalForm.category}
                    onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value as Goal['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="speech">Speech</option>
                    <option value="motor">Motor Skills</option>
                    <option value="social">Social Skills</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="academic">Academic</option>
                    <option value="self-care">Self-Care</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Use 50 words spontaneously"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Value *</label>
                  <input
                    type="number"
                    value={goalForm.current_value}
                    onChange={(e) => setGoalForm({ ...goalForm, current_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                  <input
                    type="number"
                    value={goalForm.target_value}
                    onChange={(e) => setGoalForm({ ...goalForm, target_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                  <input
                    type="text"
                    placeholder="e.g., words, times"
                    value={goalForm.unit}
                    onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                  <select
                    value={goalForm.priority}
                    onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value as Goal['priority'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.target_date}
                    onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Condition</label>
                  <input
                    type="text"
                    placeholder="e.g., Autism"
                    value={goalForm.linked_condition}
                    onChange={(e) => setGoalForm({ ...goalForm, linked_condition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={goalForm.notes}
                  onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedGoal.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGoal.status)}`}>
                    {selectedGoal.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-gray-600">{selectedGoal.child_name} • {selectedGoal.category}</div>
              </div>
              <button onClick={() => setSelectedGoal(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {selectedGoal.current_value} / {selectedGoal.target_value} {selectedGoal.unit}</span>
                <span>{getProgressPercentage(selectedGoal).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage(selectedGoal)}%` }}
                />
              </div>
            </div>

            {selectedGoal.description && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
                <p className="text-gray-600">{selectedGoal.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Priority: </span>
                <span className={`px-2 py-1 rounded ${getPriorityColor(selectedGoal.priority)}`}>
                  {selectedGoal.priority}
                </span>
              </div>
              {selectedGoal.target_date && (
                <div>
                  <span className="font-semibold text-gray-700">Target Date: </span>
                  <span className="text-gray-600">{new Date(selectedGoal.target_date).toLocaleDateString()}</span>
                </div>
              )}
              {selectedGoal.linked_condition && (
                <div>
                  <span className="font-semibold text-gray-700">Condition: </span>
                  <span className="text-gray-600">{selectedGoal.linked_condition}</span>
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-700">Created: </span>
                <span className="text-gray-600">{new Date(selectedGoal.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Progress History</h4>
                {selectedGoal.status !== 'achieved' && selectedGoal.status !== 'archived' && (
                  <button
                    onClick={() => {
                      setProgressForm({ value: selectedGoal.current_value, notes: '' });
                      setShowProgressForm(true);
                    }}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Log Progress
                  </button>
                )}
              </div>

              {showProgressForm && (
                <form onSubmit={handleLogProgress} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Value</label>
                    <input
                      type="number"
                      value={progressForm.value}
                      onChange={(e) => setProgressForm({ ...progressForm, value: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={progressForm.notes}
                      onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowProgressForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {progressLogs.length === 0 ? (
                  <p className="text-gray-500 text-sm">No progress logged yet</p>
                ) : (
                  progressLogs.map(log => (
                    <div key={log.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-900">{log.value} {selectedGoal.unit}</span>
                        <span className="text-xs text-gray-500">{new Date(log.logged_at).toLocaleDateString()}</span>
                      </div>
                      {log.notes && <p className="text-sm text-gray-600">{log.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openEditGoal(selectedGoal)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Goal
              </button>
              <button
                onClick={() => handleDeleteGoal(selectedGoal.id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredGoals.length === 0 ? (
        <div className="text-center py-16">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Goals Yet</h3>
          <p className="text-gray-600 mb-6">Start setting therapy goals for your child</p>
          <button
            onClick={() => {
              resetGoalForm();
              setShowGoalForm(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <div
              key={goal.id}
              onClick={() => setSelectedGoal(goal)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                  <div className="text-sm text-gray-600">{goal.child_name}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                  <span>{getProgressPercentage(goal).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${getProgressPercentage(goal)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('_', ' ')}
                </span>
                <span className="text-gray-500 capitalize">{goal.category}</span>
              </div>

              {goal.target_date && (
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
