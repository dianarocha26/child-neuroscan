import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, X, Check, RotateCcw, Calendar, Clock, Pill, Stethoscope, Activity, Target, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import { PageHeader } from './PageHeader';
import {
  createReminder, deleteReminder, listReminders, setReminderActive, updateReminder,
  type Reminder, type ReminderType
} from '../lib/api/reminders';
import { ChildPicker } from './ChildPicker';
import { useDialog } from '../contexts/DialogContext';

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
  const { notify, confirm } = useDialog();
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
      setReminders(await listReminders(user.id));
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
      };
      if (editing) {
        await updateReminder(editing.id, payload);
      } else {
        await createReminder(user.id, payload);
      }
      closeForm(); loadData();
    } catch (error) { logger.error('Error saving reminder:', error); notify('Failed to save reminder'); }
  };

  const handleToggleDone = async (r: Reminder) => {
    try {
      await setReminderActive(r.id, !r.is_active);
      setReminders(prev => prev.map(x => (x.id === r.id ? { ...x, is_active: !r.is_active } : x)));
    } catch (error) { logger.error('Error updating reminder:', error); notify('Failed to update reminder'); }
  };

  const handleDelete = async (id: string) => {
    if (!(await confirm('Delete this reminder?'))) return;
    try {
      await deleteReminder(id);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (error) { logger.error('Error deleting reminder:', error); notify('Failed to delete reminder'); }
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
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${info.color}`}><Icon className="w-5 h-5" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-semibold text-gray-900 ${!r.is_active ? 'line-through' : ''}`}>{r.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${info.color}`}>{info.label}</span>
              {r.is_active && isOverdue(r) && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Overdue</span>}
            </div>
            {r.child_name && <p className="text-sm text-gray-600">{r.child_name}</p>}
            {r.description && <p className="text-sm text-gray-600 mt-1">{r.description}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1 whitespace-nowrap"><Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />{formatDate(r.reminder_date)}</span>
              <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />{formatTime(r.reminder_time)}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-1 -my-1 flex-shrink-0">
            <button onClick={() => handleToggleDone(r)}
              className={`w-10 h-10 inline-flex items-center justify-center rounded-lg transition ${r.is_active ? 'text-gray-400 hover:text-green-600 hover:bg-green-50' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'}`}
              title={r.is_active ? 'Mark done' : 'Mark not done'} aria-label={r.is_active ? 'Mark done' : 'Mark not done'}>
              {r.is_active ? <Check className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            </button>
            <button onClick={() => openEdit(r)} className="w-10 h-10 inline-flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit reminder" aria-label="Edit reminder"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(r.id)} className="w-10 h-10 inline-flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete reminder" aria-label="Delete reminder"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Bell}
        tone="teal"
        title="Reminders"
        subtitle="Medications, appointments and therapy in one list"
        action={{ label: 'New Reminder', icon: Plus, onClick: openNew }}
      />

      <div className="flex gap-2 flex-wrap mb-6">
        {[{ value: 'all' as const, label: 'All' }, ...REMINDER_TYPES].map(t => (
          <button key={t.value} onClick={() => setFilter(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === t.value ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">{editing ? 'Edit Reminder' : 'New Reminder'}</h2>
              <button onClick={closeForm} type="button" aria-label="Close" className="p-2 -m-2 flex-shrink-0 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"><X className="w-6 h-6" /></button>
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
                <ChildPicker value={form.child_name} onChange={(name) => setForm({ ...form, child_name: name })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="modal-footer flex gap-3">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 transition">
                  {editing ? 'Update Reminder' : 'Add Reminder'}
                </button>
                <button type="button" onClick={closeForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition">Cancel</button>
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
