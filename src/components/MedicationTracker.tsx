import React, { useState, useEffect } from 'react';
import { Pill, Plus, Calendar, Clock, AlertCircle, CheckCircle, X, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface Medication {
  id: string;
  child_name: string;
  name: string;
  type: 'medication' | 'supplement' | 'vitamin';
  dosage: string;
  frequency: string;
  schedule_times: string[];
  purpose: string;
  prescribing_doctor: string;
  linked_condition: string;
  start_date: string;
  end_date: string | null;
  active: boolean;
  notes: string;
  side_effects: string;
  created_at: string;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  taken_at: string;
  scheduled_time: string;
  status: 'taken' | 'missed' | 'skipped';
  notes: string;
  side_effects_observed: string;
  behavioral_changes: string;
  logged_at: string;
}

export default function MedicationTracker() {
  const { t } = useLanguage();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMedForm, setShowMedForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [filterActive, setFilterActive] = useState(true);

  const [medForm, setMedForm] = useState({
    child_name: '',
    name: '',
    type: 'medication' as Medication['type'],
    dosage: '',
    frequency: '',
    schedule_times: '',
    purpose: '',
    prescribing_doctor: '',
    linked_condition: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: '',
    side_effects: ''
  });

  const [logForm, setLogForm] = useState({
    status: 'taken' as MedicationLog['status'],
    notes: '',
    side_effects_observed: '',
    behavioral_changes: ''
  });

  useEffect(() => {
    loadMedications();
  }, []);

  useEffect(() => {
    if (selectedMed) {
      loadLogs(selectedMed.id);
    }
  }, [selectedMed]);

  const loadMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      logger.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async (medId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('medication_id', medId)
        .order('taken_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      logger.error('Error loading logs:', error);
    }
  };

  const handleSubmitMed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const scheduleArray = medForm.schedule_times.split(',').map(t => t.trim()).filter(t => t);
      const medData = {
        ...medForm,
        user_id: user.id,
        schedule_times: scheduleArray,
        active: true
      };

      if (editingMed) {
        const { error } = await supabase
          .from('medications')
          .update(medData)
          .eq('id', editingMed.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('medications')
          .insert(medData);
        if (error) throw error;
      }

      setShowMedForm(false);
      setEditingMed(null);
      resetMedForm();
      loadMedications();
    } catch (error) {
      logger.error('Error saving medication:', error);
      alert('Failed to save medication. Please try again.');
    }
  };

  const handleLogDose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('medication_logs')
        .insert({
          medication_id: selectedMed.id,
          user_id: user.id,
          taken_at: new Date().toISOString(),
          scheduled_time: new Date().toTimeString().slice(0, 5),
          ...logForm
        });

      if (error) throw error;

      setShowLogForm(false);
      setLogForm({
        status: 'taken',
        notes: '',
        side_effects_observed: '',
        behavioral_changes: ''
      });
      loadLogs(selectedMed.id);
    } catch (error) {
      logger.error('Error logging dose:', error);
      alert('Failed to log dose. Please try again.');
    }
  };

  const handleToggleActive = async (med: Medication) => {
    try {
      const { error } = await supabase
        .from('medications')
        .update({ active: !med.active })
        .eq('id', med.id);

      if (error) throw error;
      loadMedications();
    } catch (error) {
      logger.error('Error toggling medication', error);
      alert('Failed to update medication status. Please try again.');
    }
  };

  const handleDeleteMed = async (medId: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) return;

    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medId);

      if (error) throw error;
      loadMedications();
      setSelectedMed(null);
    } catch (error) {
      logger.error('Error deleting medication', error);
      alert('Failed to delete medication. Please try again.');
    }
  };

  const resetMedForm = () => {
    setMedForm({
      child_name: '',
      name: '',
      type: 'medication',
      dosage: '',
      frequency: '',
      schedule_times: '',
      purpose: '',
      prescribing_doctor: '',
      linked_condition: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      notes: '',
      side_effects: ''
    });
  };

  const openEditMed = (med: Medication) => {
    setEditingMed(med);
    setMedForm({
      child_name: med.child_name,
      name: med.name,
      type: med.type,
      dosage: med.dosage,
      frequency: med.frequency,
      schedule_times: med.schedule_times.join(', '),
      purpose: med.purpose,
      prescribing_doctor: med.prescribing_doctor,
      linked_condition: med.linked_condition,
      start_date: med.start_date,
      end_date: med.end_date || '',
      notes: med.notes,
      side_effects: med.side_effects
    });
    setShowMedForm(true);
  };

  const getAdherenceRate = () => {
    if (logs.length === 0) return 0;
    const takenCount = logs.filter(log => log.status === 'taken').length;
    return (takenCount / logs.length) * 100;
  };

  const getTypeColor = (type: Medication['type']) => {
    switch (type) {
      case 'medication': return 'text-blue-600 bg-blue-100';
      case 'supplement': return 'text-green-600 bg-green-100';
      case 'vitamin': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: MedicationLog['status']) => {
    switch (status) {
      case 'taken': return 'text-green-600 bg-green-100';
      case 'missed': return 'text-red-600 bg-red-100';
      case 'skipped': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredMedications = medications.filter(med => filterActive ? med.active : !med.active);

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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Medication Tracker</h2>
            <p className="text-gray-600">Track medications, supplements, and vitamins</p>
          </div>
          <button
            onClick={() => {
              setEditingMed(null);
              resetMedForm();
              setShowMedForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Medication
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilterActive(true)}
            className={`px-4 py-2 rounded-lg transition ${
              filterActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active ({medications.filter(m => m.active).length})
          </button>
          <button
            onClick={() => setFilterActive(false)}
            className={`px-4 py-2 rounded-lg transition ${
              !filterActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive ({medications.filter(m => !m.active).length})
          </button>
        </div>
      </div>

      {showMedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingMed ? 'Edit Medication' : 'Add Medication'}
              </h3>
              <button onClick={() => setShowMedForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitMed} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name *</label>
                  <input
                    type="text"
                    value={medForm.child_name}
                    onChange={(e) => setMedForm({ ...medForm, child_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={medForm.type}
                    onChange={(e) => setMedForm({ ...medForm, type: e.target.value as Medication['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="medication">Medication</option>
                    <option value="supplement">Supplement</option>
                    <option value="vitamin">Vitamin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Methylphenidate, Omega-3, Vitamin D"
                  value={medForm.name}
                  onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
                  <input
                    type="text"
                    placeholder="e.g., 5mg, 1 tablet"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                  <input
                    type="text"
                    placeholder="e.g., twice daily, as needed"
                    value={medForm.frequency}
                    onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Times (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 08:00, 20:00"
                  value={medForm.schedule_times}
                  onChange={(e) => setMedForm({ ...medForm, schedule_times: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <input
                    type="text"
                    placeholder="e.g., ADHD management"
                    value={medForm.purpose}
                    onChange={(e) => setMedForm({ ...medForm, purpose: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Condition</label>
                  <input
                    type="text"
                    placeholder="e.g., ADHD, Autism"
                    value={medForm.linked_condition}
                    onChange={(e) => setMedForm({ ...medForm, linked_condition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescribing Doctor</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. Smith"
                  value={medForm.prescribing_doctor}
                  onChange={(e) => setMedForm({ ...medForm, prescribing_doctor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={medForm.start_date}
                    onChange={(e) => setMedForm({ ...medForm, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    value={medForm.end_date}
                    onChange={(e) => setMedForm({ ...medForm, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Known Side Effects</label>
                <textarea
                  value={medForm.side_effects}
                  onChange={(e) => setMedForm({ ...medForm, side_effects: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="e.g., may cause drowsiness, decreased appetite"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={medForm.notes}
                  onChange={(e) => setMedForm({ ...medForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMedForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingMed ? 'Update' : 'Add'} Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedMed.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedMed.type)}`}>
                    {selectedMed.type}
                  </span>
                </div>
                <div className="text-gray-600">{selectedMed.child_name}</div>
              </div>
              <button onClick={() => setSelectedMed(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {logs.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Adherence Rate (Last 30 logs)</span>
                  <span className="text-2xl font-bold text-blue-600">{getAdherenceRate().toFixed(0)}%</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Dosage: </span>
                <span className="text-gray-600">{selectedMed.dosage}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Frequency: </span>
                <span className="text-gray-600">{selectedMed.frequency}</span>
              </div>
              {selectedMed.schedule_times.length > 0 && (
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Schedule: </span>
                  <span className="text-gray-600">{selectedMed.schedule_times.join(', ')}</span>
                </div>
              )}
              {selectedMed.purpose && (
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Purpose: </span>
                  <span className="text-gray-600">{selectedMed.purpose}</span>
                </div>
              )}
              {selectedMed.prescribing_doctor && (
                <div>
                  <span className="font-semibold text-gray-700">Doctor: </span>
                  <span className="text-gray-600">{selectedMed.prescribing_doctor}</span>
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-700">Started: </span>
                <span className="text-gray-600">{new Date(selectedMed.start_date).toLocaleDateString()}</span>
              </div>
              {selectedMed.side_effects && (
                <div className="col-span-2">
                  <span className="font-semibold text-gray-700">Side Effects: </span>
                  <span className="text-gray-600">{selectedMed.side_effects}</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Dose History</h4>
                {selectedMed.active && (
                  <button
                    onClick={() => setShowLogForm(true)}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Log Dose
                  </button>
                )}
              </div>

              {showLogForm && (
                <form onSubmit={handleLogDose} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      value={logForm.status}
                      onChange={(e) => setLogForm({ ...logForm, status: e.target.value as MedicationLog['status'] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="taken">Taken</option>
                      <option value="missed">Missed</option>
                      <option value="skipped">Skipped</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={logForm.notes}
                      onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Side Effects Observed</label>
                    <textarea
                      value={logForm.side_effects_observed}
                      onChange={(e) => setLogForm({ ...logForm, side_effects_observed: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Behavioral Changes</label>
                    <textarea
                      value={logForm.behavioral_changes}
                      onChange={(e) => setLogForm({ ...logForm, behavioral_changes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLogForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Log
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-sm">No doses logged yet</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.taken_at).toLocaleString()}
                        </span>
                      </div>
                      {log.notes && <p className="text-sm text-gray-700 mb-1"><strong>Notes:</strong> {log.notes}</p>}
                      {log.side_effects_observed && (
                        <p className="text-sm text-gray-700 mb-1"><strong>Side Effects:</strong> {log.side_effects_observed}</p>
                      )}
                      {log.behavioral_changes && (
                        <p className="text-sm text-gray-700"><strong>Behavioral Changes:</strong> {log.behavioral_changes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleToggleActive(selectedMed)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                {selectedMed.active ? 'Mark Inactive' : 'Mark Active'}
              </button>
              <button
                onClick={() => openEditMed(selectedMed)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteMed(selectedMed.id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredMedications.length === 0 ? (
        <div className="text-center py-16">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filterActive ? 'No Active Medications' : 'No Inactive Medications'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterActive ? 'Add medications, supplements, or vitamins to track' : 'No inactive medications found'}
          </p>
          {filterActive && (
            <button
              onClick={() => {
                resetMedForm();
                setShowMedForm(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add First Medication
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map(med => (
            <div
              key={med.id}
              onClick={() => setSelectedMed(med)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{med.name}</h3>
                  <div className="text-sm text-gray-600">{med.child_name}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(med.type)}`}>
                  {med.type}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="text-gray-700">
                  <span className="font-medium">Dosage:</span> {med.dosage}
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">Frequency:</span> {med.frequency}
                </div>
                {med.schedule_times.length > 0 && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-3 h-3" />
                    {med.schedule_times.join(', ')}
                  </div>
                )}
              </div>

              {med.purpose && (
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {med.purpose}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
                <span className="text-gray-500">
                  Since {new Date(med.start_date).toLocaleDateString()}
                </span>
                {med.linked_condition && (
                  <span className="text-gray-600 font-medium">{med.linked_condition}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
