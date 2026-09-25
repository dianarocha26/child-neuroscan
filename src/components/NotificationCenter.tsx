import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, X, Check, RotateCcw, Calendar, Clock, Pill, Stethoscope, Activity, Target, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';

type ReminderType = 'medication' | 'appointment' | 'therapy' | 'goal' | 'other';

interface Reminder {
  id: string;
  user_id: string;
  reminder_type: ReminderType;
  title: string;
  description: string | null;
  child_name: string | null;
  reminder_date: string;
  reminder_time: string;
  is_active: boolean;
  created_at?: string;
}

const REMINDER_TYPES: { value: ReminderType; label: string; icon: typeof Pill; color: string }[] = [
  { value: 'medication', label: 'Medication', icon: Pill, color: 'bg-purple-100 text-purple-700' },
  { value: 'appointment', label: 'Appointment', icon: Stethoscope, color: 'bg-blue-100 text-blue-700' },
  { value: 'therapy', label: 'Therapy', icon: Activity, color: 'bg-green-100 text-green-700' },
  { value: 'goal', label: 'Goal', icon: Target, color: 'bg-orange-100 text-orange-700' },
  { value: 'other', label: 'Other', icon: Tag, color: 'bg-gray-100 text-gray-700' },
];

const typeInfo = (type: string) => REMINDER_TYPES.find(t => t.value === type) || REMINDER_TYPES[4];

const today = () => new Date().toISOString().split('T')[0];

export default function NotificationCenter() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { loading, setLoading } = useLoadingState();
  const [filter, setFilter] = useState<ReminderType | 'all'>('all');
  const [showDone, setShowDone] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const emptyForm = { reminder_type: 'medication' as ReminderType, title: '', description: '', child_name: '', reminder_date: today(), reminder_time: '09:00' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('reminders').select('*').eq('user_id', user.id)
        .order('reminder_date', { ascending: true })
        .order('reminder_time', { ascending: true });
      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      logger.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => { setEditing(null); setForm({ ...emptyForm, reminder_date: today() }); setShowForm(true); };
  const openEdit = (r: Reminder) => {
    setEditing(r);
    setForm({
      reminder_type: r.reminder_type,
      title: r.title,
      description: r.description || '',
      child_name: r.child_name || '',
      reminder_date: r.reminder_date,
      reminder_time: r.reminder_time.slice(0, 5),
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const payload = {
        reminder_type: form.reminder_type,
        title: form.title,
        description: form.description || null,
        child_name: form.child_name || null,
        reminder_date: form.reminder_date,
        reminder_time: form.reminder_time,
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        const { error } = await supabase.from('reminders').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('reminders').insert({ user_id: user.id, ...payload, is_active: true });
        if (error) throw error;
      }
      closeForm(); loadData();
    } catch (error) { logger.error('Error saving reminder:', error); alert('Failed to save reminder'); }
  };

  const handleToggleDone = async (r: Reminder) => {
    try {
      const { error } = await supabase.from('reminders')
        .update({ is_active: !r.is_active, updated_at: new Date().toISOString() }).eq('id', r.id);
      if (error) throw error;
      setReminders(prev => prev.map(x => (x.id === r.id ? { ...x, is_active: !r.is_active } : x)));
    } catch (error) { logger.error('Error updating reminder:', error); alert('Failed to update reminder'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reminder?')) return;
    try {
      const { error } = await supabase.from('reminders').delete().eq('id', id);
      if (error) throw error;
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (error) { logger.error('Error deleting reminder:', error); alert('Failed to delete reminder'); }
  };

  const formatDate = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const byType = reminders.filter(r => filter === 'all' || r.reminder_type === filter);
  const upcoming = byType.filter(r => r.is_active);
  const done = byType.filter(r => !r.is_active);
  const isOverdue = (r: Reminder) => r.reminder_date < today();

  const renderReminder = (r: Reminder) => {
    const info = typeInfo(r.reminder_type);
    const Icon = info.icon;
    return (
      <div key={r.id} className={`bg-white rounded-xl shadow p-4 border ${r.is_active && isOverdue(r) ? 'border-red-200' : 'border-gray-100'} ${!r.is_active ? 'opacity-60' : ''}`}>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${info.color}`}><Icon className="w-5 h-5" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-semibold text-gray-900 ${!r.is_active ? 'line-through' : ''}`}>{r.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${info.color}`}>{info.label}</span>
              {r.is_active && isOverdue(r) && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Overdue</span>}
            </div>
            {r.child_name && <p className="text-sm text-gray-600">{r.child_name}</p>}
            {r.description && <p className="text-sm text-gray-600 mt-1">{r.description}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(r.reminder_date)}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatTime(r.reminder_time)}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => handleToggleDone(r)}
              className={`p-1.5 rounded transition ${r.is_active ? 'text-gray-400 hover:text-green-600 hover:bg-green-50' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'}`}
              title={r.is_active ? 'Mark done' : 'Mark not done'}>
              {r.is_active ? <Check className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            </button>
            <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit reminder"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete reminder"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">
          <Plus className="w-5 h-5" /> New Reminder
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {[{ value: 'all' as const, label: 'All' }, ...REMINDER_TYPES].map(t => (
          <button key={t.value} onClick={() => setFilter(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === t.value ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editing ? 'Edit Reminder' : 'New Reminder'}</h2>
              <button onClick={closeForm} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.reminder_type} onChange={(e) => setForm({ ...form, reminder_type: e.target.value as ReminderType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                  {REMINDER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Give evening medication" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child Name (optional)</label>
                <input type="text" value={form.child_name} onChange={(e) => setForm({ ...form, child_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" required value={form.reminder_date} onChange={(e) => setForm({ ...form, reminder_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" required value={form.reminder_time} onChange={(e) => setForm({ ...form, reminder_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition">
                  {editing ? 'Update Reminder' : 'Add Reminder'}
                </button>
                <button type="button" onClick={closeForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {upcoming.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No upcoming reminders</p>
          <p className="text-sm text-gray-500 mt-1">Add medication times, appointments, and therapy sessions so nothing slips.</p>
        </div>
      ) : (
        <div className="space-y-3">{upcoming.map(renderReminder)}</div>
      )}

      {done.length > 0 && (
        <div className="mt-8">
          <button onClick={() => setShowDone(!showDone)} className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-3">
            {showDone ? 'Hide' : 'Show'} completed ({done.length})
          </button>
          {showDone && <div className="space-y-3">{done.map(renderReminder)}</div>}
        </div>
      )}
    </div>
  );
}
