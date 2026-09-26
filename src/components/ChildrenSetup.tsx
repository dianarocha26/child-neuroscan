import { useState } from 'react';
import { Pencil, Trash2, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChildren } from '../contexts/ChildrenContext';
import { addChild, updateChild, deleteChild, ageInMonths, type Child } from '../lib/api/children';
import { localToday, formatDateOnly } from '../lib/dates';
import { logger } from '../lib/logger';

interface ChildrenSetupProps {
  /** First visit after sign-in: explains why we ask and offers "Skip for now" */
  isOnboarding: boolean;
  onDone: () => void;
}

const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500';

function formatAge(dob: string | null): string {
  const months = ageInMonths(dob);
  if (months === null) return '';
  return months < 24 ? `${months} months` : `${Math.floor(months / 12)} years`;
}

/** Add, edit and remove the parent's child profiles. */
export function ChildrenSetup({ isOnboarding, onDone }: ChildrenSetupProps) {
  const { user } = useAuth();
  const { childList, refresh } = useChildren();
  const [editing, setEditing] = useState<Child | null>(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(child: Child) {
    setEditing(child);
    setName(child.child_name);
    setDob(child.date_of_birth ?? '');
  }

  function resetForm() {
    setEditing(null);
    setName('');
    setDob('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !name.trim() || !dob) return;
    setSaving(true);
    setError(null);
    try {
      if (editing) await updateChild(editing.id, name, dob);
      else await addChild(user.id, name, dob);
      await refresh();
      resetForm();
    } catch (err) {
      logger.error('Failed to save child', err);
      setError('Could not save. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(child: Child) {
    if (!confirm(`Remove ${child.child_name}? Entries you already saved for them are kept.`)) return;
    try {
      await deleteChild(child.id);
      if (editing?.id === child.id) resetForm();
      await refresh();
    } catch (err) {
      logger.error('Failed to delete child', err);
      setError('Could not remove. Please try again.');
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-start sm:items-center justify-center px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Users className="w-5 h-5" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Your children</h2>
        </div>
        <p className="text-gray-600 mb-6">
          {isOnboarding
            ? "Add each child once and we'll fill in their name and age for you across the app."
            : 'These names and ages are used across screenings and trackers.'}
        </p>

        {childList.length > 0 && (
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg mb-6">
            {childList.map(child => (
              <li key={child.id} className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{child.child_name}</div>
                  <div className="text-sm text-gray-500">
                    {formatDateOnly(child.date_of_birth)}{child.date_of_birth && ` · ${formatAge(child.date_of_birth)}`}
                  </div>
                </div>
                <div className="flex flex-shrink-0">
                  <button type="button" onClick={() => startEdit(child)} className="p-2 min-w-[44px] min-h-[44px] text-gray-500 hover:text-gray-900 rounded-lg" aria-label={`Edit ${child.child_name}`}>
                    <Pencil className="w-4 h-4 mx-auto" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => handleDelete(child)} className="p-2 min-w-[44px] min-h-[44px] text-gray-500 hover:text-red-600 rounded-lg" aria-label={`Remove ${child.child_name}`}>
                    <Trash2 className="w-4 h-4 mx-auto" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-semibold text-gray-900">{editing ? `Edit ${editing.child_name}` : 'Add a child'}</h3>
          <div>
            <label htmlFor="child-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="child-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="child-dob" className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
            <input id="child-dob" type="date" required max={localToday()} value={dob} onChange={(e) => setDob(e.target.value)} className={inputClass} />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <div className="flex gap-3">
            {editing && (
              <button type="button" onClick={resetForm} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving || !name.trim() || !dob} className="flex-1 px-4 py-3 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add child'}
            </button>
          </div>
        </form>

        <button type="button" onClick={onDone} className="w-full mt-6 px-4 py-3 text-teal-700 font-medium rounded-lg hover:bg-teal-50">
          {childList.length > 0 ? 'Done' : isOnboarding ? 'Skip for now' : 'Back'}
        </button>
      </div>
    </div>
  );
}
