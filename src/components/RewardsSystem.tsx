import React, { useState, useEffect } from 'react';
import { Star, Trophy, Gift, Plus, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import type { RewardChart, RewardEntry, RewardGoal } from '../types/components';

export default function RewardsSystem() {
  const { user } = useAuth();
  const [charts, setCharts] = useState<RewardChart[]>([]);
  const [entries, setEntries] = useState<{ [key: string]: RewardEntry[] }>({});
  const [goals, setGoals] = useState<{ [key: string]: RewardGoal[] }>({});
  const { loading, setLoading } = useLoadingState();
  const [showChartForm, setShowChartForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState<string | null>(null);
  const [showGoalForm, setShowGoalForm] = useState<string | null>(null);

  const [chartForm, setChartForm] = useState({
    child_name: '',
    chart_name: '',
    chart_type: 'star_chart',
    target_behavior: '',
    points_per_star: 1
  });

  const [entryForm, setEntryForm] = useState({
    behavior_performed: '',
    points_earned: 1
  });

  const [goalForm, setGoalForm] = useState({
    goal_name: '',
    points_required: 10,
    reward_item: ''
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
      const { data: chartsData } = await supabase
        .from('reward_charts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (chartsData) {
        setCharts(chartsData);

        const entriesMap: { [key: string]: RewardEntry[] } = {};
        const goalsMap: { [key: string]: RewardGoal[] } = {};

        for (const chart of chartsData) {
          const { data: entriesData } = await supabase
            .from('reward_entries')
            .select('*')
            .eq('chart_id', chart.id)
            .order('entry_date', { ascending: false });

          const { data: goalsData } = await supabase
            .from('reward_goals')
            .select('*')
            .eq('chart_id', chart.id);

          if (entriesData) entriesMap[chart.id] = entriesData;
          if (goalsData) goalsMap[chart.id] = goalsData;
        }

        setEntries(entriesMap);
        setGoals(goalsMap);
      }
    } catch (error) {
      logger.error('Error loading rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a reward chart');
      return;
    }

    try {
      const { error } = await supabase.from('reward_charts').insert({
        user_id: user.id,
        child_name: chartForm.child_name,
        chart_name: chartForm.chart_name,
        chart_type: chartForm.chart_type,
        target_behavior: chartForm.target_behavior,
        points_per_star: chartForm.points_per_star
      });

      if (error) throw error;

      setShowChartForm(false);
      setChartForm({
        child_name: '',
        chart_name: '',
        chart_type: 'star_chart',
        target_behavior: '',
        points_per_star: 1
      });
      loadData();
    } catch (error) {
      logger.error('Error creating reward chart:', error);
      alert('Failed to create reward chart');
    }
  };

  const handleEntrySubmit = async (e: React.FormEvent, chartId: string) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('reward_entries').insert({
        chart_id: chartId,
        behavior_performed: entryForm.behavior_performed,
        points_earned: entryForm.points_earned
      });

      if (error) throw error;

      setShowEntryForm(null);
      setEntryForm({
        behavior_performed: '',
        points_earned: 1
      });
      loadData();
    } catch (error) {
      logger.error('Error adding entry:', error);
      alert('Failed to add entry');
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent, chartId: string) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('reward_goals').insert({
        chart_id: chartId,
        goal_name: goalForm.goal_name,
        points_required: goalForm.points_required,
        reward_item: goalForm.reward_item
      });

      if (error) throw error;

      setShowGoalForm(null);
      setGoalForm({
        goal_name: '',
        points_required: 10,
        reward_item: ''
      });
      loadData();
    } catch (error) {
      logger.error('Error creating goal:', error);
      alert('Failed to create goal');
    }
  };

  const getTotalPoints = (chartId: string) => {
    return entries[chartId]?.reduce((sum, entry) => sum + entry.points_earned, 0) || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Rewards System</h1>
        </div>
        <button
          onClick={() => setShowChartForm(true)}
          className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Chart
        </button>
      </div>

      {showChartForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Create Reward Chart</h2>
          <form onSubmit={handleChartSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                <input
                  type="text"
                  required
                  value={chartForm.child_name}
                  onChange={(e) => setChartForm({ ...chartForm, child_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chart Name</label>
                <input
                  type="text"
                  required
                  value={chartForm.chart_name}
                  onChange={(e) => setChartForm({ ...chartForm, chart_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g., Morning Routine Chart"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Behavior</label>
              <input
                type="text"
                required
                value={chartForm.target_behavior}
                onChange={(e) => setChartForm({ ...chartForm, target_behavior: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., Completing morning tasks without reminders"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition"
              >
                Create Chart
              </button>
              <button
                type="button"
                onClick={() => setShowChartForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => {
          const totalPoints = getTotalPoints(chart.id);
          const chartGoals = goals[chart.id] || [];
          const chartEntries = entries[chart.id] || [];

          return (
            <div key={chart.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border-2 border-yellow-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{chart.chart_name}</h2>
                  <p className="text-gray-600">{chart.child_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{chart.target_behavior}</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                    <span className="text-2xl font-bold">{totalPoints}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Points</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">Goals</h3>
                  <button
                    onClick={() => setShowGoalForm(chart.id)}
                    className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold"
                  >
                    + Add Goal
                  </button>
                </div>

                {showGoalForm === chart.id && (
                  <form onSubmit={(e) => handleGoalSubmit(e, chart.id)} className="mb-4 space-y-3 bg-white p-4 rounded-lg">
                    <input
                      type="text"
                      required
                      value={goalForm.goal_name}
                      onChange={(e) => setGoalForm({ ...goalForm, goal_name: e.target.value })}
                      placeholder="Goal name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                    <input
                      type="number"
                      required
                      value={goalForm.points_required}
                      onChange={(e) => setGoalForm({ ...goalForm, points_required: parseInt(e.target.value) })}
                      placeholder="Points required"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                    <input
                      type="text"
                      required
                      value={goalForm.reward_item}
                      onChange={(e) => setGoalForm({ ...goalForm, reward_item: e.target.value })}
                      placeholder="Reward"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm">
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowGoalForm(null)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {chartGoals.map((goal) => {
                    const progress = (totalPoints / goal.points_required) * 100;
                    return (
                      <div key={goal.id} className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-yellow-600" />
                            <span className="font-semibold text-gray-800 text-sm">{goal.goal_name}</span>
                          </div>
                          <span className="text-xs text-gray-600">{totalPoints}/{goal.points_required}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Gift className="w-3 h-3" />
                          {goal.reward_item}
                        </div>
                      </div>
                    );
                  })}

                  {chartGoals.length === 0 && showGoalForm !== chart.id && (
                    <p className="text-sm text-gray-500 text-center py-2">No goals yet</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">Recent Stars</h3>
                  <button
                    onClick={() => setShowEntryForm(chart.id)}
                    className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold"
                  >
                    + Add Star
                  </button>
                </div>

                {showEntryForm === chart.id && (
                  <form onSubmit={(e) => handleEntrySubmit(e, chart.id)} className="mb-4 space-y-3 bg-white p-4 rounded-lg">
                    <input
                      type="text"
                      required
                      value={entryForm.behavior_performed}
                      onChange={(e) => setEntryForm({ ...entryForm, behavior_performed: e.target.value })}
                      placeholder="What did they do?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      value={entryForm.points_earned}
                      onChange={(e) => setEntryForm({ ...entryForm, points_earned: parseInt(e.target.value) })}
                      placeholder="Points"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm">
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEntryForm(null)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {chartEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-600 fill-current" />
                        <span className="text-sm text-gray-800">{entry.behavior_performed}</span>
                      </div>
                      <span className="text-xs font-semibold text-yellow-600">+{entry.points_earned}</span>
                    </div>
                  ))}

                  {chartEntries.length === 0 && showEntryForm !== chart.id && (
                    <p className="text-sm text-gray-500 text-center py-2">No stars yet</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {charts.length === 0 && !showChartForm && (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reward Charts</h3>
            <p className="text-gray-600 mb-6">Create charts to motivate and track positive behaviors</p>
            <button
              onClick={() => setShowChartForm(true)}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
            >
              Create First Chart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}