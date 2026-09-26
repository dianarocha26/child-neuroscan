import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Check, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import {
  createActivity, createSchedule, deleteActivity, deleteSchedule,
  listActivityTemplates, listScheduleActivities, listSchedules, resetScheduleActivities, setActivityCompleted,
  swapActivityOrder, updateActivity, updateSchedule,
  type Activity, type ActivityTemplate, type VisualSchedule
} from '../lib/api/schedules';
import { PageHeader } from './PageHeader';

export default function VisualSchedule() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<VisualSchedule[]>([]);
  const [activities, setActivities] = useState<{ [key: string]: Activity[] }>({});
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
  const { loading, setLoading } = useLoadingState();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditValues, setQuickEditValues] = useState({ start_time: '', duration_minutes: '', activity_name: '' });

  const [scheduleForm, setScheduleForm] = useState({
    child_name: '',
    schedule_name: '',
    schedule_type: 'daily'
  });

  const [activityForm, setActivityForm] = useState({
    activity_name: '',
    activity_description: '',
    icon_name: 'Circle',
    icon_color: '#3B82F6',
    start_time: '',
    duration_minutes: '30'
  });

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
      const schedulesData = await listSchedules(user.id);
      setSchedules(schedulesData);

      if (schedulesData.length > 0 && !selectedSchedule) {
        setSelectedSchedule(schedulesData[0].id);
      }

      const [templatesResult, ...activityResults] = await Promise.allSettled([
        listActivityTemplates(),
        ...schedulesData.map((schedule) => listScheduleActivities(schedule.id))
      ]);

      if (templatesResult.status === 'rejected') {
        logger.error('Error loading activity templates:', templatesResult.reason);
      } else {
        setTemplates(templatesResult.value);
      }

      const activitiesMap: { [key: string]: Activity[] } = {};
      activityResults.forEach((result, index) => {
        const schedule = schedulesData[index];
        if (result.status === 'rejected') {
          logger.error('Error loading schedule activities:', result.reason);
        } else {
          activitiesMap[schedule.id] = result.value;
        }
      });
      setActivities(activitiesMap);
    } catch (error) {
      logger.error('Error loading visual schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a visual schedule');
      return;
    }

    try {
      if (editingScheduleId) {
        await updateSchedule(editingScheduleId, {
          child_name: scheduleForm.child_name,
          schedule_name: scheduleForm.schedule_name,
          schedule_type: scheduleForm.schedule_type
        });
      } else {
        const created = await createSchedule(user.id, {
          child_name: scheduleForm.child_name,
          schedule_name: scheduleForm.schedule_name,
          schedule_type: scheduleForm.schedule_type
        });
        setSelectedSchedule(created.id);
      }

      setShowScheduleForm(false);
      setEditingScheduleId(null);
      setScheduleForm({ child_name: '', schedule_name: '', schedule_type: 'daily' });
      loadData();
    } catch (error) {
      logger.error('Error saving schedule:', error);
      alert('Failed to save schedule');
    }
  };

  const handleEditSchedule = (schedule: VisualSchedule) => {
    setEditingScheduleId(schedule.id);
    setScheduleForm({
      child_name: schedule.child_name,
      schedule_name: schedule.schedule_name,
      schedule_type: schedule.schedule_type || 'daily'
    });
    setShowScheduleForm(true);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Delete this schedule and all its activities? This cannot be undone.')) return;

    try {
      await deleteSchedule(scheduleId);

      if (selectedSchedule === scheduleId) setSelectedSchedule(null);
      loadData();
    } catch (error) {
      logger.error('Error deleting schedule:', error);
      alert('Failed to delete schedule');
    }
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchedule) return;

    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id, {
          activity_name: activityForm.activity_name,
          activity_description: activityForm.activity_description || null,
          icon_name: activityForm.icon_name,
          icon_color: activityForm.icon_color,
          start_time: activityForm.start_time || null,
          duration_minutes: activityForm.duration_minutes ? parseInt(activityForm.duration_minutes) : null
        });
      } else {
        const currentActivities = activities[selectedSchedule] || [];
        const nextOrder = currentActivities.length + 1;

        await createActivity({
          schedule_id: selectedSchedule,
          activity_order: nextOrder,
          activity_name: activityForm.activity_name,
          activity_description: activityForm.activity_description || null,
          icon_name: activityForm.icon_name,
          icon_color: activityForm.icon_color,
          start_time: activityForm.start_time || null,
          duration_minutes: activityForm.duration_minutes ? parseInt(activityForm.duration_minutes) : null
        });
      }

      handleCancelEdit();
      loadData();
    } catch (error) {
      logger.error('Error saving activity:', error);
      alert('Failed to save activity');
    }
  };

  const addTemplateActivity = async (template: ActivityTemplate) => {
    if (!selectedSchedule) return;

    const currentActivities = activities[selectedSchedule] || [];
    const nextOrder = currentActivities.length + 1;

    try {
      await createActivity({
        schedule_id: selectedSchedule,
        activity_order: nextOrder,
        activity_name: template.template_name,
        icon_name: template.icon_name,
        icon_color: template.icon_color,
        duration_minutes: template.typical_duration_minutes
      });
      loadData();
    } catch (error) {
      logger.error('Error adding template activity:', error);
    }
  };

  const toggleActivityCompletion = async (activityId: string, currentStatus: boolean) => {
    try {
      await setActivityCompleted(activityId, !currentStatus);
      loadData();
    } catch (error) {
      logger.error('Error updating activity:', error);
    }
  };

  const resetSchedule = async () => {
    if (!selectedSchedule) return;

    try {
      await resetScheduleActivities(selectedSchedule);
      loadData();
    } catch (error) {
      logger.error('Error resetting schedule:', error);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setActivityForm({
      activity_name: activity.activity_name,
      activity_description: activity.activity_description || '',
      icon_name: activity.icon_name || '',
      icon_color: activity.icon_color || '',
      start_time: activity.start_time || '',
      duration_minutes: activity.duration_minutes?.toString() || '30'
    });
    setShowActivityForm(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      await deleteActivity(activityId);
      loadData();
    } catch (error) {
      logger.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  const handleCancelEdit = () => {
    setShowActivityForm(false);
    setEditingActivity(null);
    setActivityForm({
      activity_name: '',
      activity_description: '',
      icon_name: 'Circle',
      icon_color: '#3B82F6',
      start_time: '',
      duration_minutes: '30'
    });
  };

  const startQuickEdit = (activity: Activity) => {
    setQuickEditId(activity.id);
    setQuickEditValues({
      start_time: activity.start_time || '',
      duration_minutes: activity.duration_minutes?.toString() || '',
      activity_name: activity.activity_name
    });
  };

  const saveQuickEdit = async (activityId: string) => {
    try {
      await updateActivity(activityId, {
        activity_name: quickEditValues.activity_name,
        start_time: quickEditValues.start_time || null,
        duration_minutes: quickEditValues.duration_minutes ? parseInt(quickEditValues.duration_minutes) : null
      });
      setQuickEditId(null);
      loadData();
    } catch (error) {
      logger.error('Error quick-saving activity:', error);
      alert('Failed to save changes');
    }
  };

  const moveActivity = async (activity: Activity, direction: 'up' | 'down') => {
    if (!selectedSchedule) return;
    const list = [...(activities[selectedSchedule] || [])];
    const idx = list.findIndex(a => a.id === activity.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;

    const a = list[idx];
    const b = list[swapIdx];

    try {
      await swapActivityOrder(a, b);
      loadData();
    } catch (error) {
      logger.error('Error reordering activities:', error);
    }
  };

  const currentSchedule = schedules.find(s => s.id === selectedSchedule);
  const currentActivities = selectedSchedule ? (activities[selectedSchedule] || []) : [];
  const completedCount = currentActivities.filter(a => a.is_completed).length;
  const totalCount = currentActivities.length;

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
        icon={Calendar}
        tone="blue"
        title="Visual Schedules"
        subtitle="Picture routines your child can follow step by step"
        action={{
          label: 'New Schedule',
          icon: Plus,
          onClick: () => {
            setEditingScheduleId(null);
            setScheduleForm({ child_name: '', schedule_name: '', schedule_type: 'daily' });
            setShowScheduleForm(true);
          },
        }}
      />

      {showScheduleForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingScheduleId ? 'Edit Schedule' : 'Create Visual Schedule'}
          </h2>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="visual-schedule-child-name" className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                <input id="visual-schedule-child-name"
                  type="text"
                  required
                  value={scheduleForm.child_name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, child_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="visual-schedule-schedule-name" className="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
                <input id="visual-schedule-schedule-name"
                  type="text"
                  required
                  value={scheduleForm.schedule_name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, schedule_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Morning Routine, School Day"
                />
              </div>
              <div>
                <label htmlFor="visual-schedule-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select id="visual-schedule-type"
                  value={scheduleForm.schedule_type}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, schedule_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="school">School Day</option>
                  <option value="weekend">Weekend</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-teal-700 text-white py-2.5 rounded-lg hover:bg-teal-800 transition">
                {editingScheduleId ? 'Save Changes' : 'Create Schedule'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowScheduleForm(false);
                  setEditingScheduleId(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {schedules.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="font-bold text-gray-900 mb-4">Your Schedules</h3>
              <div className="space-y-2">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`rounded-lg transition ${
                      selectedSchedule === schedule.id
                        ? 'bg-blue-100 border-2 border-blue-600'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedSchedule(schedule.id)}
                      className="w-full text-left p-4"
                    >
                      <div className="font-semibold text-gray-900">{schedule.schedule_name}</div>
                      <div className="text-sm text-gray-600">{schedule.child_name}</div>
                    </button>
                    {selectedSchedule === schedule.id && (
                      <div className="flex gap-1 px-3 pb-3">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="flex-1 flex items-center justify-center gap-1.5 h-9 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 h-9 text-sm font-medium bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {templates.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-900 mb-3">Quick Add Activities</h4>
                  <div className="max-h-96 overflow-y-auto space-y-1">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => addTemplateActivity(template)}
                        className="w-full text-left p-2 rounded hover:bg-gray-100 transition text-sm flex items-center gap-2"
                      >
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: template.icon_color || undefined }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{template.template_name}</div>
                          <div className="text-xs text-gray-500">{template.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {currentSchedule && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{currentSchedule.schedule_name}</h2>
                    <p className="text-gray-600">{currentSchedule.child_name}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm">
                      <span className="font-bold text-blue-600 text-lg">{completedCount}</span>
                      <span className="text-gray-600"> / {totalCount} Complete</span>
                    </div>
                    <button
                      onClick={() => handleEditSchedule(currentSchedule)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                      title="Edit schedule info"
                    >
                      <Settings className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={resetSchedule}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => {
                        setEditingActivity(null);
                        setActivityForm({
                          activity_name: '',
                          activity_description: '',
                          icon_name: 'Circle',
                          icon_color: '#3B82F6',
                          start_time: '',
                          duration_minutes: '30'
                        });
                        setShowActivityForm(true);
                      }}
                      className="flex items-center gap-2 bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Activity
                    </button>
                  </div>
                </div>

                {showActivityForm && (
                  <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="font-bold text-gray-900 mb-4">
                      {editingActivity ? 'Edit Activity' : 'Add Custom Activity'}
                    </h3>
                    <form onSubmit={handleActivitySubmit} className="space-y-3">
                      <input
                        type="text"
                        required
                        value={activityForm.activity_name}
                        onChange={(e) => setActivityForm({ ...activityForm, activity_name: e.target.value })}
                        placeholder="Activity name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={activityForm.activity_description}
                        onChange={(e) => setActivityForm({ ...activityForm, activity_description: e.target.value })}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="visual-schedule-start-time" className="block text-sm font-medium text-gray-700 mb-1">Start time</label>
                          <input id="visual-schedule-start-time"
                            type="time"
                            value={activityForm.start_time}
                            onChange={(e) => setActivityForm({ ...activityForm, start_time: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="visual-schedule-duration-min" className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                          <input id="visual-schedule-duration-min"
                            type="number"
                            min="1"
                            value={activityForm.duration_minutes}
                            onChange={(e) => setActivityForm({ ...activityForm, duration_minutes: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="visual-schedule-icon-color" className="block text-sm font-medium text-gray-700 mb-2">Icon Color</label>
                        <input id="visual-schedule-icon-color"
                          type="color"
                          value={activityForm.icon_color}
                          onChange={(e) => setActivityForm({ ...activityForm, icon_color: e.target.value })}
                          className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-teal-700 text-white py-2.5 rounded-lg hover:bg-teal-800 transition">
                          {editingActivity ? 'Save Changes' : 'Add Activity'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-3">
                  {currentActivities.map((activity, index) => {
                    const isQuickEditing = quickEditId === activity.id;
                    return (
                      <div
                        key={activity.id}
                        className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-lg border-2 transition ${
                          activity.is_completed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex flex-col flex-shrink-0 -my-1">
                          <button
                            onClick={() => moveActivity(activity, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                            aria-label="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveActivity(activity, 'down')}
                            disabled={index === currentActivities.length - 1}
                            className="p-1.5 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                            aria-label="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleActivityCompletion(activity.id, activity.is_completed ?? false)}
                          aria-label={`Mark done: ${activity.activity_name}`}
                          className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition ${
                            activity.is_completed
                              ? 'bg-green-600 text-white'
                              : 'bg-white border-2 border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {activity.is_completed ? (
                            <Check className="w-6 h-6" />
                          ) : (
                            <span className="text-lg font-bold text-gray-600">{index + 1}</span>
                          )}
                        </button>

                        <div
                          className="w-7 h-7 sm:w-10 sm:h-10 rounded flex-shrink-0"
                          style={{ backgroundColor: activity.icon_color || undefined }}
                        />

                        <div className="flex-1 min-w-0">
                          {isQuickEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={quickEditValues.activity_name}
                                onChange={(e) => setQuickEditValues({ ...quickEditValues, activity_name: e.target.value })}
                                className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                placeholder="Activity name"
                              />
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label htmlFor="visual-schedule-start-time-2" className="block text-xs text-gray-600 mb-0.5">Start time</label>
                                  <input id="visual-schedule-start-time-2"
                                    type="time"
                                    value={quickEditValues.start_time}
                                    onChange={(e) => setQuickEditValues({ ...quickEditValues, start_time: e.target.value })}
                                    className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label htmlFor="visual-schedule-duration-min-2" className="block text-xs text-gray-600 mb-0.5">Duration (min)</label>
                                  <input id="visual-schedule-duration-min-2"
                                    type="number"
                                    min="1"
                                    value={quickEditValues.duration_minutes}
                                    onChange={(e) => setQuickEditValues({ ...quickEditValues, duration_minutes: e.target.value })}
                                    className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startQuickEdit(activity)}
                              className="text-left w-full hover:bg-white/50 rounded p-1 -m-1 transition"
                              title="Click to edit time and name"
                            >
                              <h4 className="font-bold text-gray-900">{activity.activity_name}</h4>
                              {activity.activity_description && (
                                <p className="text-sm text-gray-600">{activity.activity_description}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                                {activity.start_time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {activity.start_time}
                                  </span>
                                )}
                                {activity.duration_minutes && (
                                  <span>{activity.duration_minutes} min</span>
                                )}
                                <span className="hidden sm:inline text-blue-600 italic">click to edit</span>
                              </div>
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-1 flex-shrink-0">
                          {isQuickEditing ? (
                            <>
                              <button
                                onClick={() => saveQuickEdit(activity.id)}
                                className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                                title="Save changes"
                                aria-label="Save changes"
                              >
                                <Save className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setQuickEditId(null)}
                                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                title="Cancel"
                                aria-label="Cancel"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditActivity(activity)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit full activity"
                                aria-label="Edit full activity"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete activity"
                                aria-label="Delete activity"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {currentActivities.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p>No activities yet. Add activities from templates or create custom ones.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {schedules.length === 0 && !showScheduleForm && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Visual Schedules</h3>
          <p className="text-gray-600 mb-6">Create visual schedules to help with transitions and routines</p>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
          >
            Create First Schedule
          </button>
        </div>
      )}
    </div>
  );
}
