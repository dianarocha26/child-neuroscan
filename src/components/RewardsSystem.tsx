import React, { useState, useEffect } from 'react';
import { Star, Trophy, Plus, Target, Edit2, Trash2, X, Info, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import {
  createRewardChart, createRewardEntry, createRewardGoal, deleteRewardChart, deleteRewardEntry,
  deleteRewardGoal, listRewardCharts, listRewardEntries, listRewardGoals, rateRewardChart,
  updateRewardChart, updateRewardEntry, updateRewardGoal,
  type RewardChart, type RewardEntry, type RewardGoal
} from '../lib/api/rewards';
import { PageHeader } from './PageHeader';

export default function RewardsSystem() {
  const { user } = useAuth();
  const [charts, setCharts] = useState<RewardChart[]>([]);
  const [entries, setEntries] = useState<{ [key: string]: RewardEntry[] }>({});
  const [goals, setGoals] = useState<{ [key: string]: RewardGoal[] }>({});
  const { loading, setLoading } = useLoadingState();

  const [showChartForm, setShowChartForm] = useState(false);
  const [editingChart, setEditingChart] = useState<RewardChart | null>(null);
  const [showEntryForm, setShowEntryForm] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<RewardEntry | null>(null);
  const [showGoalForm, setShowGoalForm] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<RewardGoal | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const emptyChartForm = { child_name: '', chart_name: '', chart_type: 'star_chart', target_behavior: '', points_per_star: 1 };
  const emptyEntryForm = { stars_earned: 1, notes: '' };
  const emptyGoalForm = { goal_name: '', stars_required: 10 };

  const [chartForm, setChartForm] = useState(emptyChartForm);
  const [entryForm, setEntryForm] = useState(emptyEntryForm);
  const [goalForm, setGoalForm] = useState(emptyGoalForm);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const chartsData = await listRewardCharts();
      setCharts(chartsData);
      const entriesMap: { [key: string]: RewardEntry[] } = {};
      const goalsMap: { [key: string]: RewardGoal[] } = {};
      for (const chart of chartsData) {
        entriesMap[chart.id] = await listRewardEntries(chart.id);
        goalsMap[chart.id] = await listRewardGoals(chart.id);
      }
      setEntries(entriesMap);
      setGoals(goalsMap);
    } catch (error) {
      logger.error('Error loading rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Chart handlers ---
  const openNewChart = () => { setEditingChart(null); setChartForm(emptyChartForm); setShowChartForm(true); };
  const openEditChart = (chart: RewardChart) => {
    setEditingChart(chart);
    setChartForm({ child_name: chart.child_name, chart_name: chart.chart_name, chart_type: chart.chart_type, target_behavior: chart.target_behavior, points_per_star: chart.points_per_star ?? 1 });
    setShowChartForm(true);
  };
  const handleChartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (editingChart) {
        await updateRewardChart(editingChart.id, chartForm);
      } else {
        await createRewardChart(chartForm);
      }
      setShowChartForm(false); setEditingChart(null); setChartForm(emptyChartForm); loadData();
    } catch (error) { logger.error('Error saving chart:', error); alert('Failed to save reward chart. Please try again.'); }
  };
  const handleDeleteChart = async (id: string) => {
    if (!confirm('Delete this reward chart and all its data?')) return;
    try {
      await deleteRewardChart(id);
      loadData();
    } catch (error) { logger.error('Error deleting chart:', error); alert('Failed to delete chart. Please try again.'); }
  };

  const handleRateChart = async (chart: RewardChart, isEffective: boolean) => {
    // Clicking the active rating again clears it
    const value = chart.is_effective === isEffective ? null : isEffective;
    try {
      await rateRewardChart(chart.id, value);
      setCharts(prev => prev.map(c => (c.id === chart.id ? { ...c, is_effective: value } : c)));
    } catch (error) { logger.error('Error rating chart:', error); alert('Failed to save rating. Please try again.'); }
  };

  // --- Entry handlers ---
  const openNewEntry = (chartId: string) => { setEditingEntry(null); setEntryForm(emptyEntryForm); setShowEntryForm(chartId); };
  const openEditEntry = (entry: RewardEntry, chartId: string) => {
    setEditingEntry(entry);
    setEntryForm({ stars_earned: entry.stars_earned, notes: entry.notes || '' });
    setShowEntryForm(chartId);
  };
  const handleEntrySubmit = async (e: React.FormEvent, chartId: string) => {
    e.preventDefault();
    try {
      const payload = {
        stars_earned: entryForm.stars_earned,
        notes: entryForm.notes || null,
        entry_date: new Date().toISOString().split('T')[0]
      };
      if (editingEntry) {
        await updateRewardEntry(editingEntry.id, payload);
      } else {
        await createRewardEntry(chartId, payload);
      }
      setShowEntryForm(null); setEditingEntry(null); setEntryForm(emptyEntryForm); loadData();
    } catch (error) { logger.error('Error saving entry:', error); alert('Failed to save entry. Please try again.'); }
  };
  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Delete this star entry?')) return;
    try {
      await deleteRewardEntry(id);
      loadData();
    } catch (error) { logger.error('Error deleting entry:', error); alert('Failed to delete entry. Please try again.'); }
  };

  // --- Goal handlers ---
  const openNewGoal = (chartId: string) => { setEditingGoal(null); setGoalForm(emptyGoalForm); setShowGoalForm(chartId); };
  const openEditGoal = (goal: RewardGoal, chartId: string) => {
    setEditingGoal(goal);
    setGoalForm({ goal_name: goal.goal_name, stars_required: goal.stars_required });
    setShowGoalForm(chartId);
  };
  const handleGoalSubmit = async (e: React.FormEvent, chartId: string) => {
    e.preventDefault();
    try {
      const payload = { goal_name: goalForm.goal_name, stars_required: goalForm.stars_required };
      if (editingGoal) {
        await updateRewardGoal(editingGoal.id, payload);
      } else {
        await createRewardGoal(chartId, payload);
      }
      setShowGoalForm(null); setEditingGoal(null); setGoalForm(emptyGoalForm); loadData();
    } catch (error) { logger.error('Error saving goal:', error); alert('Failed to save goal. Please try again.'); }
  };
  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    try {
      await deleteRewardGoal(id);
      loadData();
    } catch (error) { logger.error('Error deleting goal:', error); alert('Failed to delete goal. Please try again.'); }
  };

  const getTotalStars = (chartId: string) => entries[chartId]?.reduce((sum, e) => sum + (e.stars_earned || 0), 0) || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Trophy}
        tone="amber"
        title="Rewards System"
        subtitle="Star charts that motivate everyday goals"
        action={{ label: 'New Chart', icon: Plus, onClick: openNewChart }}
      />

      {/* Parent explainer */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl">
        <button
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full flex items-center justify-between p-4 text-left"
          aria-expanded={showHowItWorks}
        >
          <span className="flex items-center gap-2 font-semibold text-blue-900">
            <Info className="w-5 h-5" /> How this works
          </span>
          {showHowItWorks ? <ChevronUp className="w-5 h-5 text-blue-900" /> : <ChevronDown className="w-5 h-5 text-blue-900" />}
        </button>
        {showHowItWorks && (
          <div className="px-4 pb-4 text-sm text-blue-900 space-y-2">
            <p><strong>1. Create a chart</strong> for one specific behavior you want to encourage (e.g., "Brushing teeth without reminders").</p>
            <p><strong>2. Set goals</strong> — rewards your child earns after collecting a number of stars (e.g., 10 stars = trip to the park).</p>
            <p><strong>3. Add stars</strong> right after your child shows the behavior. Immediate, consistent praise works best.</p>
            <p><strong>4. Check in weekly.</strong> Use the thumbs up / down on each chart to note whether it's helping. If a chart isn't working after 2–3 weeks, try a smaller goal, a different reward, or a simpler behavior.</p>
          </div>
        )}
      </div>

      {/* Chart Form Modal */}
      {showChartForm && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">{editingChart ? 'Edit Chart' : 'Create Reward Chart'}</h2>
              <button onClick={() => { setShowChartForm(false); setEditingChart(null); }} type="button" aria-label="Close" className="p-2 -m-2 flex-shrink-0 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleChartSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rewards-system-child-name" className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                  <input id="rewards-system-child-name" type="text" required value={chartForm.child_name} onChange={(e) => setChartForm({ ...chartForm, child_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" />
                </div>
                <div>
                  <label htmlFor="rewards-system-chart-name" className="block text-sm font-medium text-gray-700 mb-1">Chart Name</label>
                  <input id="rewards-system-chart-name" type="text" required value={chartForm.chart_name} onChange={(e) => setChartForm({ ...chartForm, chart_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Morning Routine Chart" />
                </div>
              </div>
              <div>
                <label htmlFor="rewards-system-target-behavior" className="block text-sm font-medium text-gray-700 mb-1">Target Behavior</label>
                <input id="rewards-system-target-behavior" type="text" required value={chartForm.target_behavior} onChange={(e) => setChartForm({ ...chartForm, target_behavior: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g., Completing morning tasks without reminders" />
              </div>
              <div className="modal-footer flex gap-3">
                <button type="submit" className="flex-1 bg-amber-700 text-white py-2.5 rounded-lg font-medium hover:bg-amber-800 transition">
                  {editingChart ? 'Update Chart' : 'Create Chart'}
                </button>
                <button type="button" onClick={() => { setShowChartForm(false); setEditingChart(null); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => {
          const totalStars = getTotalStars(chart.id);
          const chartGoals = goals[chart.id] || [];
          const chartEntries = entries[chart.id] || [];

          return (
            <div key={chart.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border-2 border-yellow-200 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{chart.chart_name}</h2>
                  <p className="text-gray-600">{chart.child_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{chart.target_behavior}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-600">Is this chart working?</span>
                    <button
                      onClick={() => handleRateChart(chart, true)}
                      className={`w-10 h-10 flex-shrink-0 inline-flex items-center justify-center rounded-lg transition ${chart.is_effective === true ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                      title="Working"
                      aria-label="Chart is working"
                      aria-pressed={chart.is_effective === true}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRateChart(chart, false)}
                      className={`w-10 h-10 flex-shrink-0 inline-flex items-center justify-center rounded-lg transition ${chart.is_effective === false ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                      title="Not working"
                      aria-label="Chart is not working"
                      aria-pressed={chart.is_effective === false}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-1 sm:gap-2 flex-shrink-0">
                  <div className="text-center">
                    <div className="bg-yellow-600 text-white rounded-full w-14 h-14 flex items-center justify-center">
                      <span className="text-xl font-bold">{totalStars}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Stars</p>
                  </div>
                  <div className="flex flex-col">
                    <button onClick={() => openEditChart(chart)} className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit chart" aria-label="Edit chart"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteChart(chart.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete chart" aria-label="Delete chart"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Goals section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">Goals</h3>
                  <button onClick={() => openNewGoal(chart.id)} className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 text-sm font-semibold px-2 py-1.5 -mr-2 rounded-lg whitespace-nowrap">+ Add Goal</button>
                </div>

                {showGoalForm === chart.id && (
                  <form onSubmit={(e) => handleGoalSubmit(e, chart.id)} className="mb-4 space-y-3 bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{editingGoal ? 'Edit Goal' : 'New Goal'}</span>
                      <button type="button" onClick={() => { setShowGoalForm(null); setEditingGoal(null); }} aria-label="Close" className="p-2 -m-2 rounded-lg text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>
                    <input type="text" required value={goalForm.goal_name} onChange={(e) => setGoalForm({ ...goalForm, goal_name: e.target.value })}
                      placeholder="Goal name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm" />
                    <input type="number" required min="1" value={goalForm.stars_required} onChange={(e) => setGoalForm({ ...goalForm, stars_required: parseInt(e.target.value) })}
                      placeholder="Stars required" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm" />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-amber-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800">{editingGoal ? 'Update' : 'Add'}</button>
                      <button type="button" onClick={() => { setShowGoalForm(null); setEditingGoal(null); }} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {chartGoals.map((goal) => {
                    const progress = (totalStars / goal.stars_required) * 100;
                    return (
                      <div key={goal.id} className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-yellow-600" />
                            <span className="font-semibold text-gray-800 text-sm">{goal.goal_name}</span>
                            {goal.is_achieved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Achieved!</span>}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">{totalStars}/{goal.stars_required} ⭐</span>
                            <button onClick={() => openEditGoal(goal, chart.id)} className="p-2 text-gray-400 hover:text-blue-600 rounded transition" aria-label="Edit reward goal"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => handleDeleteGoal(goal.id)} className="p-2 text-gray-400 hover:text-red-600 rounded transition" aria-label="Delete reward goal"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {chartGoals.length === 0 && showGoalForm !== chart.id && <p className="text-sm text-gray-500 text-center py-2">No goals yet</p>}
                </div>
              </div>

              {/* Stars/Entries section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">Recent Stars</h3>
                  <button onClick={() => openNewEntry(chart.id)} className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 text-sm font-semibold px-2 py-1.5 -mr-2 rounded-lg whitespace-nowrap">+ Add Star</button>
                </div>

                {showEntryForm === chart.id && (
                  <form onSubmit={(e) => handleEntrySubmit(e, chart.id)} className="mb-4 space-y-3 bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{editingEntry ? 'Edit Star' : 'New Star'}</span>
                      <button type="button" onClick={() => { setShowEntryForm(null); setEditingEntry(null); }} aria-label="Close" className="p-2 -m-2 rounded-lg text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>
                    <input type="number" required min="1" value={entryForm.stars_earned} onChange={(e) => setEntryForm({ ...entryForm, stars_earned: parseInt(e.target.value) })}
                      placeholder="Stars earned" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm" />
                    <input type="text" value={entryForm.notes} onChange={(e) => setEntryForm({ ...entryForm, notes: e.target.value })}
                      placeholder="Notes (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm" />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-amber-700 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800">{editingEntry ? 'Update' : 'Add'}</button>
                      <button type="button" onClick={() => { setShowEntryForm(null); setEditingEntry(null); }} className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm">Cancel</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {chartEntries.slice(0, 8).map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-600 fill-current" />
                        <span className="text-sm text-gray-800">{entry.notes || entry.entry_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-yellow-600">+{entry.stars_earned}⭐</span>
                        <button onClick={() => openEditEntry(entry, chart.id)} className="p-2 text-gray-400 hover:text-blue-600 rounded transition" aria-label="Edit star entry"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => handleDeleteEntry(entry.id)} className="p-2 text-gray-400 hover:text-red-600 rounded transition" aria-label="Delete star entry"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                  {chartEntries.length === 0 && showEntryForm !== chart.id && <p className="text-sm text-gray-500 text-center py-2">No stars yet</p>}
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
            <button onClick={openNewChart} className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition">Create First Chart</button>
          </div>
        )}
      </div>
    </div>
  );
}