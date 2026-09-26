import React, { useState, useEffect } from 'react';
import { Target, Plus, Calendar, Edit2, Trash2, X } from 'lucide-react';
import { logger } from '../lib/logger';
import { PageHeader } from './PageHeader';
import { ErrorState, LOAD_ERROR_MESSAGE } from './ErrorState';
import {
  createGoal, deleteGoal, listGoalProgress, listGoals, logGoalProgress, updateGoal,
  type Goal, type GoalProgressLog as ProgressLog
} from '../lib/api/goals';
import { ChildPicker } from './ChildPicker';
import { useDialog } from '../contexts/DialogContext';

export default function GoalTracker() {
  const { notify, confirm } = useDialog();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'form' | 'detail'>('none');
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
    setLoadFailed(false);
    try {
      setGoals(await listGoals());
    } catch (error) {
      logger.error('Failed to load goals', error);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressLogs = async (goalId: string) => {
    try {
      setProgressLogs(await listGoalProgress(goalId));
    } catch (error) {
      logger.error('Failed to load progress logs', error);
      notify('Could not load progress. Please try again.');
    }
  };

  const handleSubmitGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.target_date) {
      setDateError(true);
      return;
    }
    setDateError(false);
    try {
      const { target_date, ...restForm } = goalForm;
      const goalData = {
        ...restForm,
        target_date: target_date ? target_date : null,
        status: goalForm.current_value === 0 ? 'not_started' as const : 'in_progress' as const
      };

      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
      } else {
        await createGoal(goalData);
      }

      setActiveModal("none");
      setEditingGoal(null);
      resetGoalForm();
      loadGoals();
    } catch (error: unknown) {
      logger.error('Error saving goal', error);
      notify('Failed to save goal. Please try again.');
    }
  };

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      await logGoalProgress(selectedGoal, progressForm.value, progressForm.notes);

      setShowProgressForm(false);
      setProgressForm({ value: 0, notes: '' });
      loadGoals();
      loadProgressLogs(selectedGoal.id);
    } catch (error) {
      logger.error('Error logging progress', error);
      notify('Failed to log progress. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!(await confirm('Are you sure you want to delete this goal?'))) return;

    try {
      await deleteGoal(goalId);
      loadGoals();
      setSelectedGoal(null);
      setActiveModal("none");
    } catch (error) {
      logger.error('Error deleting goal', error);
      notify('Failed to delete goal. Please try again.');
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
      description: goal.description ?? '',
      category: goal.category,
      linked_condition: goal.linked_condition ?? '',
      target_value: goal.target_value,
      current_value: goal.current_value,
      unit: goal.unit,
      target_date: goal.target_date || '',
      priority: goal.priority,
      notes: goal.notes ?? ''
    });
    setSelectedGoal(null);
    setActiveModal("form");
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

  if (loadFailed) {
    return <ErrorState inline message={LOAD_ERROR_MESSAGE} onRetry={() => { setLoadFailed(false); setLoading(true); loadGoals(); }} />;
  }

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
        <PageHeader
          icon={Target}
          tone="blue"
          title="Goal Tracker"
          subtitle="Set and track therapy goals for your child"
          action={{
            label: 'New Goal',
            icon: Plus,
            onClick: () => {
              setEditingGoal(null);
              resetGoalForm();
              setActiveModal("form");
            },
          }}
        />

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

      {activeModal === "form" && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h3>
              <button onClick={() => setActiveModal("none")} type="button" aria-label="Close" className="p-2 -m-2 flex-shrink-0 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="goal-tracker-child-s-name" className="block text-sm font-medium text-gray-700 mb-2">Child's Name *</label>
                  <ChildPicker id="goal-tracker-child-s-name" required value={goalForm.child_name} onChange={(name) => setGoalForm({ ...goalForm, child_name: name })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="goal-tracker-category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select id="goal-tracker-category"
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
                <label htmlFor="goal-tracker-goal-title" className="block text-sm font-medium text-gray-700 mb-2">Goal Title *</label>
                <input id="goal-tracker-goal-title"
                  type="text"
                  placeholder="e.g., Use 50 words spontaneously"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="goal-tracker-description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea id="goal-tracker-description"
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="goal-tracker-current-value" className="block text-sm font-medium text-gray-700 mb-2">Current Value *</label>
                  <input id="goal-tracker-current-value"
                    type="number"
                    value={goalForm.current_value}
                    onChange={(e) => setGoalForm({ ...goalForm, current_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="goal-tracker-target-value" className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                  <input id="goal-tracker-target-value"
                    type="number"
                    value={goalForm.target_value}
                    onChange={(e) => setGoalForm({ ...goalForm, target_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="goal-tracker-unit" className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                  <input id="goal-tracker-unit"
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
                  <label htmlFor="goal-tracker-priority" className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                  <select id="goal-tracker-priority"
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
                  <label htmlFor="goal-tracker-target-date" className="block text-sm font-medium text-gray-700 mb-2">Target Date *</label>
                  <input id="goal-tracker-target-date"
                    type="date"
                    required
                    value={goalForm.target_date}
                    onChange={(e) => { setGoalForm({ ...goalForm, target_date: e.target.value }); setDateError(false); }}
                    className={"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 " + (dateError ? "border-red-500" : "border-gray-300")}
                  />
                  {dateError && <p className="text-red-500 text-xs mt-1">Target date is required</p>}
                </div>
                <div>
                  <label htmlFor="goal-tracker-related-condition" className="block text-sm font-medium text-gray-700 mb-2">Related Condition</label>
                  <input id="goal-tracker-related-condition"
                    type="text"
                    placeholder="e.g., Autism"
                    value={goalForm.linked_condition}
                    onChange={(e) => setGoalForm({ ...goalForm, linked_condition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="goal-tracker-notes" className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea id="goal-tracker-notes"
                  value={goalForm.notes}
                  onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="modal-footer flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGoal && activeModal === "detail" && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-3xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedGoal.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGoal.status)}`}>
                    {selectedGoal.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-gray-600">{selectedGoal.child_name} • {selectedGoal.category}</div>
              </div>
              <button onClick={() => { setSelectedGoal(null); setActiveModal("none"); }} type="button" aria-label="Close" className="p-2 -m-2 flex-shrink-0 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100">
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
                <span className="text-gray-600">{new Date(selectedGoal.created_at ?? '').toLocaleDateString()}</span>
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
                    className="text-sm bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition"
                  >
                    Log Progress
                  </button>
                )}
              </div>

              {showProgressForm && (
                <form onSubmit={handleLogProgress} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="mb-3">
                    <label htmlFor="goal-tracker-new-value" className="block text-sm font-medium text-gray-700 mb-2">New Value</label>
                    <input id="goal-tracker-new-value"
                      type="number"
                      value={progressForm.value}
                      onChange={(e) => setProgressForm({ ...progressForm, value: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="goal-tracker-notes-2" className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea id="goal-tracker-notes-2"
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
                      className="flex-1 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
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
                        <span className="text-xs text-gray-500">{new Date(log.logged_at ?? '').toLocaleDateString()}</span>
                      </div>
                      {log.notes && <p className="text-sm text-gray-600">{log.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-footer flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => openEditGoal(selectedGoal)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-teal-700 text-teal-700 rounded-lg hover:bg-teal-50 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Goal
              </button>
              <button
                onClick={() => handleDeleteGoal(selectedGoal.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
              setActiveModal("form");
            }}
            className="inline-flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
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
              onClick={() => { setSelectedGoal(goal); setActiveModal("detail"); }}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 cursor-pointer hover:shadow-xl transition"
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