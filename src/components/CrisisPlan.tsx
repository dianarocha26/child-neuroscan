import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Heart, Shield, Plus, Edit2, Trash2, Users, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import type { CrisisPlan, CrisisContact, CalmingStrategy } from '../types/components';

export default function CrisisPlanComponent() {
  const { user } = useAuth();
  const [crisisPlans, setCrisisPlans] = useState<CrisisPlan[]>([]);
  const [contacts, setContacts] = useState<CrisisContact[]>([]);
  const [strategies, setStrategies] = useState<CalmingStrategy[]>([]);
  const { loading, setLoading } = useLoadingState();
  const [activeTab, setActiveTab] = useState<'plan' | 'contacts' | 'strategies'>('plan');

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CrisisPlan | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<CrisisContact | null>(null);
  const [showStrategyForm, setShowStrategyForm] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<CalmingStrategy | null>(null);

  const emptyPlanForm = {
    child_name: '', warning_signs: [''], immediate_actions: [''],
    things_to_avoid: [''], safe_space_location: '', medication_instructions: '',
    when_to_call_911: [''], additional_notes: ''
  };
  const emptyContactForm = {
    contact_name: '', relationship: '', phone_number: '',
    email: '', contact_type: 'emergency', priority_order: 1, notes: ''
  };
  const emptyStrategyForm = {
    child_name: '', strategy_name: '', strategy_type: '', description: '',
    effectiveness_rating: '', duration_minutes: '', materials_needed: [''], instructions: ['']
  };

  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [strategyForm, setStrategyForm] = useState(emptyStrategyForm);

  const contactTypes = ['Emergency', 'Therapist', 'Family', 'School', 'Medical', 'Other'];
  const strategyTypes = ['Deep Breathing', 'Sensory', 'Physical Activity', 'Music', 'Visual', 'Verbal', 'Other'];

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const [plansRes, contactsRes, strategiesRes] = await Promise.all([
        supabase.from('crisis_plans').select('*').eq('user_id', user.id),
        supabase.from('crisis_contacts').select('*').eq('user_id', user.id).order('priority_order'),
        supabase.from('calming_strategies').select('*').eq('user_id', user.id)
      ]);
      if (plansRes.data) setCrisisPlans(plansRes.data);
      if (contactsRes.data) setContacts(contactsRes.data);
      if (strategiesRes.data) setStrategies(strategiesRes.data);
    } catch (error) {
      logger.error('Error loading crisis plan data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Plan handlers ---
  const openNewPlan = () => { setEditingPlan(null); setPlanForm(emptyPlanForm); setShowPlanForm(true); };
  const openEditPlan = (plan: CrisisPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      child_name: plan.child_name,
      warning_signs: plan.warning_signs.length ? plan.warning_signs : [''],
      immediate_actions: plan.immediate_actions.length ? plan.immediate_actions : [''],
      things_to_avoid: plan.things_to_avoid.length ? plan.things_to_avoid : [''],
      safe_space_location: plan.safe_space_location || '',
      medication_instructions: plan.medication_instructions || '',
      when_to_call_911: plan.when_to_call_911.length ? plan.when_to_call_911 : [''],
      additional_notes: plan.additional_notes || ''
    });
    setShowPlanForm(true);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        child_name: planForm.child_name,
        warning_signs: planForm.warning_signs.filter(s => s.trim()),
        immediate_actions: planForm.immediate_actions.filter(s => s.trim()),
        things_to_avoid: planForm.things_to_avoid.filter(s => s.trim()),
        safe_space_location: planForm.safe_space_location || null,
        medication_instructions: planForm.medication_instructions || null,
        when_to_call_911: planForm.when_to_call_911.filter(s => s.trim()),
        additional_notes: planForm.additional_notes || null
      };
      if (editingPlan) {
        const { error } = await supabase.from('crisis_plans').update(payload).eq('id', editingPlan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('crisis_plans').insert(payload);
        if (error) throw error;
      }
      setShowPlanForm(false); setEditingPlan(null); setPlanForm(emptyPlanForm); loadData();
    } catch (error) {
      logger.error('Error saving crisis plan:', error);
      alert('Failed to save crisis plan');
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Delete this crisis plan?')) return;
    try {
      const { error } = await supabase.from('crisis_plans').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) { logger.error('Error deleting plan:', error); alert('Failed to delete plan'); }
  };

  // --- Contact handlers ---
  const openNewContact = () => { setEditingContact(null); setContactForm(emptyContactForm); setShowContactForm(true); };
  const openEditContact = (contact: CrisisContact) => {
    setEditingContact(contact);
    setContactForm({
      contact_name: contact.contact_name,
      relationship: contact.relationship,
      phone_number: contact.phone_number,
      email: contact.email || '',
      contact_type: contact.contact_type,
      priority_order: contact.priority_order,
      notes: contact.notes || ''
    });
    setShowContactForm(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        contact_name: contactForm.contact_name,
        relationship: contactForm.relationship,
        phone_number: contactForm.phone_number,
        email: contactForm.email || null,
        contact_type: contactForm.contact_type,
        priority_order: contactForm.priority_order,
        notes: contactForm.notes || null
      };
      if (editingContact) {
        const { error } = await supabase.from('crisis_contacts').update(payload).eq('id', editingContact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('crisis_contacts').insert(payload);
        if (error) throw error;
      }
      setShowContactForm(false); setEditingContact(null); setContactForm(emptyContactForm); loadData();
    } catch (error) {
      logger.error('Error saving contact:', error);
      alert('Failed to save contact');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      const { error } = await supabase.from('crisis_contacts').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) { logger.error('Error deleting contact:', error); alert('Failed to delete contact'); }
  };

  // --- Strategy handlers ---
  const openNewStrategy = () => { setEditingStrategy(null); setStrategyForm(emptyStrategyForm); setShowStrategyForm(true); };
  const openEditStrategy = (strategy: CalmingStrategy) => {
    setEditingStrategy(strategy);
    setStrategyForm({
      child_name: strategy.child_name,
      strategy_name: strategy.strategy_name,
      strategy_type: strategy.strategy_type,
      description: strategy.description,
      effectiveness_rating: strategy.effectiveness_rating ? String(strategy.effectiveness_rating) : '',
      duration_minutes: strategy.duration_minutes ? String(strategy.duration_minutes) : '',
      materials_needed: strategy.materials_needed.length ? strategy.materials_needed : [''],
      instructions: strategy.instructions.length ? strategy.instructions : ['']
    });
    setShowStrategyForm(true);
  };

  const handleStrategySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        child_name: strategyForm.child_name,
        strategy_name: strategyForm.strategy_name,
        strategy_type: strategyForm.strategy_type,
        description: strategyForm.description,
        effectiveness_rating: strategyForm.effectiveness_rating ? parseInt(strategyForm.effectiveness_rating) : null,
        duration_minutes: strategyForm.duration_minutes ? parseInt(strategyForm.duration_minutes) : null,
        materials_needed: strategyForm.materials_needed.filter(s => s.trim()),
        instructions: strategyForm.instructions.filter(s => s.trim())
      };
      if (editingStrategy) {
        const { error } = await supabase.from('calming_strategies').update(payload).eq('id', editingStrategy.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('calming_strategies').insert(payload);
        if (error) throw error;
      }
      setShowStrategyForm(false); setEditingStrategy(null); setStrategyForm(emptyStrategyForm); loadData();
    } catch (error) {
      logger.error('Error saving strategy:', error);
      alert('Failed to save calming strategy');
    }
  };

  const handleDeleteStrategy = async (id: string) => {
    if (!confirm('Delete this calming strategy?')) return;
    try {
      const { error } = await supabase.from('calming_strategies').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) { logger.error('Error deleting strategy:', error); alert('Failed to delete strategy'); }
  };

  const addArrayField = (setter: any, field: string, currentArray: string[]) => {
    setter((prev: any) => ({ ...prev, [field]: [...currentArray, ''] }));
  };

  const updateArrayField = (setter: any, field: string, index: number, value: string, currentArray: string[]) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    setter((prev: any) => ({ ...prev, [field]: newArray }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Crisis Plan</h1>
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
        <div className="flex items-start">
          <Shield className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-1">Emergency Resources</h3>
            <p className="text-red-800 mb-2">In case of immediate danger, always call 911 first</p>
            <div className="space-y-1 text-sm text-red-800">
              <p>National Suicide Prevention Lifeline: 988</p>
              <p>Crisis Text Line: Text HOME to 741741</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['plan', 'contacts', 'strategies'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition ${activeTab === tab ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {tab === 'plan' ? 'Crisis Plans' : tab === 'contacts' ? 'Emergency Contacts' : 'Calming Strategies'}
          </button>
        ))}
      </div>

      {/* ---- PLANS TAB ---- */}
      {activeTab === 'plan' && (
        <div>
          <div className="mb-6 flex justify-end">
            <button onClick={openNewPlan} className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
              <Plus className="w-5 h-5" /> Create Crisis Plan
            </button>
          </div>

          {showPlanForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{editingPlan ? 'Edit Crisis Plan' : 'New Crisis Plan'}</h2>
                  <button onClick={() => { setShowPlanForm(false); setEditingPlan(null); }} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handlePlanSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                    <input type="text" required value={planForm.child_name}
                      onChange={(e) => setPlanForm({ ...planForm, child_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warning Signs</label>
                    {planForm.warning_signs.map((sign, idx) => (
                      <input key={idx} type="text" value={sign}
                        onChange={(e) => updateArrayField(setPlanForm, 'warning_signs', idx, e.target.value, planForm.warning_signs)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                        placeholder="e.g., Increased pacing, hand flapping" />
                    ))}
                    <button type="button" onClick={() => addArrayField(setPlanForm, 'warning_signs', planForm.warning_signs)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold">+ Add Warning Sign</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Actions</label>
                    {planForm.immediate_actions.map((action, idx) => (
                      <input key={idx} type="text" value={action}
                        onChange={(e) => updateArrayField(setPlanForm, 'immediate_actions', idx, e.target.value, planForm.immediate_actions)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                        placeholder="e.g., Move to quiet space" />
                    ))}
                    <button type="button" onClick={() => addArrayField(setPlanForm, 'immediate_actions', planForm.immediate_actions)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold">+ Add Action</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Things to AVOID</label>
                    {planForm.things_to_avoid.map((thing, idx) => (
                      <input key={idx} type="text" value={thing}
                        onChange={(e) => updateArrayField(setPlanForm, 'things_to_avoid', idx, e.target.value, planForm.things_to_avoid)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                        placeholder="e.g., Loud voices, physical restraint" />
                    ))}
                    <button type="button" onClick={() => addArrayField(setPlanForm, 'things_to_avoid', planForm.things_to_avoid)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold">+ Add Item</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Safe Space Location</label>
                    <input type="text" value={planForm.safe_space_location}
                      onChange={(e) => setPlanForm({ ...planForm, safe_space_location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., Bedroom, sensory corner" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">When to Call 911</label>
                    {planForm.when_to_call_911.map((situation, idx) => (
                      <input key={idx} type="text" value={situation}
                        onChange={(e) => updateArrayField(setPlanForm, 'when_to_call_911', idx, e.target.value, planForm.when_to_call_911)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                        placeholder="e.g., Risk of self-harm, seizure" />
                    ))}
                    <button type="button" onClick={() => addArrayField(setPlanForm, 'when_to_call_911', planForm.when_to_call_911)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold">+ Add Situation</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea value={planForm.additional_notes}
                      onChange={(e) => setPlanForm({ ...planForm, additional_notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" rows={3} />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                      {editingPlan ? 'Update Crisis Plan' : 'Save Crisis Plan'}
                    </button>
                    <button type="button" onClick={() => { setShowPlanForm(false); setEditingPlan(null); }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {crisisPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.child_name}'s Crisis Plan</h2>
                  <div className="flex gap-2">
                    <button onClick={() => openEditPlan(plan)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeletePlan(plan.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {plan.warning_signs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Warning Signs</h3>
                    <ul className="list-disc list-inside space-y-1">{plan.warning_signs.map((s, i) => <li key={i} className="text-gray-700">{s}</li>)}</ul>
                  </div>
                )}
                {plan.immediate_actions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2"><Shield className="w-5 h-5" /> Immediate Actions</h3>
                    <ol className="list-decimal list-inside space-y-1">{plan.immediate_actions.map((a, i) => <li key={i} className="text-gray-700">{a}</li>)}</ol>
                  </div>
                )}
                {plan.things_to_avoid.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-orange-800 mb-3">Things to AVOID</h3>
                    <ul className="list-disc list-inside space-y-1">{plan.things_to_avoid.map((t, i) => <li key={i} className="text-gray-700">{t}</li>)}</ul>
                  </div>
                )}
                {plan.safe_space_location && (
                  <div className="mb-6"><h3 className="font-bold text-blue-800 mb-2">Safe Space</h3><p className="text-gray-700">{plan.safe_space_location}</p></div>
                )}
                {plan.when_to_call_911.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2"><Phone className="w-5 h-5" /> When to Call 911</h3>
                    <ul className="list-disc list-inside space-y-1">{plan.when_to_call_911.map((s, i) => <li key={i} className="text-red-800">{s}</li>)}</ul>
                  </div>
                )}
                {plan.additional_notes && (
                  <div className="mt-4"><h3 className="font-bold text-gray-800 mb-2">Additional Notes</h3><p className="text-gray-700">{plan.additional_notes}</p></div>
                )}
              </div>
            ))}
            {crisisPlans.length === 0 && !showPlanForm && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Crisis Plans Yet</h3>
                <p className="text-gray-600 mb-6">Create a plan to be prepared for challenging situations</p>
                <button onClick={openNewPlan} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">Create Crisis Plan</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- CONTACTS TAB ---- */}
      {activeTab === 'contacts' && (
        <div>
          <div className="mb-6 flex justify-end">
            <button onClick={openNewContact} className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
              <Plus className="w-5 h-5" /> Add Contact
            </button>
          </div>

          {showContactForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{editingContact ? 'Edit Contact' : 'New Emergency Contact'}</h2>
                  <button onClick={() => { setShowContactForm(false); setEditingContact(null); }} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" required value={contactForm.contact_name}
                        onChange={(e) => setContactForm({ ...contactForm, contact_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <input type="text" required value={contactForm.relationship}
                        onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" required value={contactForm.phone_number}
                        onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
                      <select value={contactForm.contact_type}
                        onChange={(e) => setContactForm({ ...contactForm, contact_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                        {contactTypes.map(type => <option key={type} value={type.toLowerCase()}>{type}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                    <input type="email" value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea value={contactForm.notes}
                      onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" rows={2} />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                      {editingContact ? 'Update Contact' : 'Save Contact'}
                    </button>
                    <button type="button" onClick={() => { setShowContactForm(false); setEditingContact(null); }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{contact.contact_name}</h3>
                    <p className="text-gray-600">{contact.relationship}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{contact.contact_type}</span>
                    <button onClick={() => openEditContact(contact)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href={`tel:${contact.phone_number}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                    <Phone className="w-4 h-4" />{contact.phone_number}
                  </a>
                  {contact.email && <p className="text-gray-600 text-sm">{contact.email}</p>}
                  {contact.notes && <p className="text-gray-600 text-sm">{contact.notes}</p>}
                </div>
              </div>
            ))}
            {contacts.length === 0 && !showContactForm && (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Emergency Contacts</h3>
                <p className="text-gray-600 mb-6">Add contacts you can reach in an emergency</p>
                <button onClick={openNewContact} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">Add First Contact</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---- STRATEGIES TAB ---- */}
      {activeTab === 'strategies' && (
        <div>
          <div className="mb-6 flex justify-end">
            <button onClick={openNewStrategy} className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
              <Plus className="w-5 h-5" /> Add Strategy
            </button>
          </div>

          {showStrategyForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{editingStrategy ? 'Edit Strategy' : 'New Calming Strategy'}</h2>
                  <button onClick={() => { setShowStrategyForm(false); setEditingStrategy(null); }} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleStrategySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                      <input type="text" required value={strategyForm.child_name}
                        onChange={(e) => setStrategyForm({ ...strategyForm, child_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Name</label>
                      <input type="text" required value={strategyForm.strategy_name}
                        onChange={(e) => setStrategyForm({ ...strategyForm, strategy_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Type</label>
                    <select required value={strategyForm.strategy_type}
                      onChange={(e) => setStrategyForm({ ...strategyForm, strategy_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                      <option value="">Select type</option>
                      {strategyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required value={strategyForm.description}
                      onChange={(e) => setStrategyForm({ ...strategyForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    {strategyForm.instructions.map((instruction, idx) => (
                      <input key={idx} type="text" value={instruction}
                        onChange={(e) => updateArrayField(setStrategyForm, 'instructions', idx, e.target.value, strategyForm.instructions)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                        placeholder={`Step ${idx + 1}`} />
                    ))}
                    <button type="button" onClick={() => addArrayField(setStrategyForm, 'instructions', strategyForm.instructions)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold">+ Add Step</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Effectiveness (1-5)</label>
                      <input type="number" min="1" max="5" value={strategyForm.effectiveness_rating}
                        onChange={(e) => setStrategyForm({ ...strategyForm, effectiveness_rating: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input type="number" value={strategyForm.duration_minutes}
                        onChange={(e) => setStrategyForm({ ...strategyForm, duration_minutes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                      {editingStrategy ? 'Update Strategy' : 'Save Strategy'}
                    </button>
                    <button type="button" onClick={() => { setShowStrategyForm(false); setEditingStrategy(null); }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{strategy.strategy_name}</h3>
                    <p className="text-gray-600">{strategy.child_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">{strategy.strategy_type}</span>
                    <button onClick={() => openEditStrategy(strategy)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteStrategy(strategy.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{strategy.description}</p>
                {strategy.instructions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {strategy.instructions.map((instruction, idx) => <li key={idx}>{instruction}</li>)}
                    </ol>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {strategy.duration_minutes && <span>Duration: {strategy.duration_minutes} min</span>}
                  {strategy.effectiveness_rating && (
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500 fill-current" />{strategy.effectiveness_rating}/5</span>
                  )}
                </div>
              </div>
            ))}
            {strategies.length === 0 && !showStrategyForm && (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Calming Strategies</h3>
                <p className="text-gray-600 mb-6">Add strategies that help calm your child during difficult moments</p>
                <button onClick={openNewStrategy} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">Add First Strategy</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}