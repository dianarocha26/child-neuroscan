import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Check, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import type { VisualSchedule, Activity, ActivityTemplate } from '../types/components';

export default function VisualSchedule() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<VisualSchedule[]>([]);
  const [activities, setActivities] = useState<{ [key: string]: Activity[] }>({});
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
  const { loading, setLoading } = useLoadingState();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [showActivityForm, setShowActivityForm] = useState(false);

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
      const { data: schedulesData } = await supabase
        .from('visual_schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: templatesData } = await supabase
        .from('activity_templates')
        .select('*')
        .eq('is_public', true)
        .order('category', { ascending: true });

      if (schedulesData) {
        setSchedules(schedulesData);

        const activitiesMap: { [key: string]: Activity[] } = {};
        for (const schedule of schedulesData) {
          const { data: activitiesData } = await supabase
            .from('schedule_activities')
            .select('*')
            .eq('schedule_id', schedule.id)
            .order('activity_order');

          if (activitiesData) activitiesMap[schedule.id] = activitiesData;
        }
        setActivities(activitiesMap);

        if (schedulesData.length > 0 && !selectedSchedule) {
          setSelectedSchedule(schedulesData[0].id);
        }
      }

      if (templatesData) setTemplates(templatesData);
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
      const { data, error } = await supabase.from('visual_schedules').insert({
        user_id: user.id,
        child_name: scheduleForm.child_name,
        schedule_name: scheduleForm.schedule_name,
        schedule_type: scheduleForm.schedule_type
      }).select().single();

      if (error) throw error;

      if (data) {
        setSelectedSchedule(data.id);
      }

      setShowScheduleForm(false);
      setScheduleForm({
        child_name: '',
        schedule_name: '',
        schedule_type: 'daily'
      });
      loadData();
    } catch (error) {
      logger.error('Error creating schedule:', error);
      alert('Failed to create schedule');
    }
  };

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchedule) return;

    const currentActivities = activities[selectedSchedule] || [];
    const nextOrder = currentActivities.length + 1;

    try {
      const { error } = await supabase.from('schedule_activities').insert({
        schedule_id: selectedSchedule,
        activity_order: nextOrder,
        activity_name: activityForm.activity_name,
        activity_description: activityForm.activity_description || null,
        icon_name: activityForm.icon_name,
        icon_color: activityForm.icon_color,
        start_time: activityForm.start_time || null,
        duration_minutes: activityForm.duration_minutes ? parseInt(activityForm.duration_minutes) : null
      });

      if (error) throw error;

      setShowActivityForm(false);
      setActivityForm({
        activity_name: '',
        activity_description: '',
        icon_name: 'Circle',
        icon_color: '#3B82F6',
        start_time: '',
        duration_minutes: '30'
      });
      loadData();
    } catch (error) {
      logger.error('Error adding activity:', error);
      alert('Failed to add activity');
    }
  };

  const addTemplateActivity = async (template: Template) => {
    if (!selectedSchedule) return;

    const currentActivities = activities[selectedSchedule] || [];
    const nextOrder = currentActivities.length + 1;

    try {
      const { error } = await supabase.from('schedule_activities').insert({
        schedule_id: selectedSchedule,
        activity_order: nextOrder,
        activity_name: template.template_name,
        icon_name: template.icon_name,
        icon_color: template.icon_color,
        duration_minutes: template.typical_duration_minutes
      });

      if (error) throw error;
      loadData();
    } catch (error) {
      logger.error('Error adding template activity:', error);
    }
  };

  const toggleActivityCompletion = async (activityId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('schedule_activities')
        .update({ is_completed: !currentStatus })
        .eq('id', activityId);

      if (error) throw error;
      loadData();
    } catch (error) {
      logger.error('Error updating activity:', error);
    }
  };

  const resetSchedule = async () => {
    if (!selectedSchedule) return;

    try {
      const { error } = await supabase
        .from('schedule_activities')
        .update({ is_completed: false })
        .eq('schedule_id', selectedSchedule);

      if (error) throw error;
      loadData();
    } catch (error) {
      logger.error('Error resetting schedule:', error);
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Visual Schedules</h1>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Schedule
        </button>
      </div>

      {showScheduleForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create Visual Schedule</h2>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.child_name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, child_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.schedule_name}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, schedule_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Morning Routine, School Day"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Create Schedule
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Your Schedules</h3>
              <div className="space-y-2">
                {schedules.map((schedule) => (
                  <button
                    key={schedule.id}
                    onClick={() => setSelectedSchedule(schedule.id)}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedSchedule === schedule.id
                        ? 'bg-blue-100 border-2 border-blue-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{schedule.schedule_name}</div>
                    <div className="text-sm text-gray-600">{schedule.child_name}</div>
                  </button>
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
                          style={{ backgroundColor: template.icon_color }}
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentSchedule.schedule_name}</h2>
                    <p className="text-gray-600">{currentSchedule.child_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <span className="font-bold text-blue-600 text-lg">{completedCount}</span>
                      <span className="text-gray-600"> / {totalCount} Complete</span>
                    </div>
                    <button
                      onClick={resetSchedule}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowActivityForm(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add Activity
                    </button>
                  </div>
                </div>

                {showActivityForm && (
                  <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="font-bold text-gray-900 mb-4">Add Custom Activity</h3>
                    <form onSubmit={handleActivitySubmit} className="space-y-3">
                      <input
                        type="text"
                        required
                        value={activityForm.activity_name}
                        onChange={(e) => setActivityForm({ ...activityForm, activity_name: e.target.value })}
                        placeholder="Activity name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="time"
                          value={activityForm.start_time}
                          onChange={(e) => setActivityForm({ ...activityForm, start_time: e.target.value })}
                          placeholder="Start time"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          value={activityForm.duration_minutes}
                          onChange={(e) => setActivityForm({ ...activityForm, duration_minutes: e.target.value })}
                          placeholder="Duration (min)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowActivityForm(false)}
                          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-3">
                  {currentActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition ${
                        activity.is_completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleActivityCompletion(activity.id, activity.is_completed)}
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition ${
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
                        className="w-10 h-10 rounded flex-shrink-0"
                        style={{ backgroundColor: activity.icon_color }}
                      />

                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{activity.activity_name}</h4>
                        {activity.activity_description && (
                          <p className="text-sm text-gray-600">{activity.activity_description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          {activity.start_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.start_time}
                            </span>
                          )}
                          {activity.duration_minutes && (
                            <span>{activity.duration_minutes} min</span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}

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
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create First Schedule
          </button>
        </div>
      )}
    </div>
  );
}