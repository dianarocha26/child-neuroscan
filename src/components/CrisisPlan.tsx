import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Heart, Shield, Plus, Edit2, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import type { CrisisPlan, CrisisContact, CalmingStrategy } from '../types/components';

export default function CrisisPlan() {
  const { user } = useAuth();
  const [crisisPlans, setCrisisPlans] = useState<CrisisPlan[]>([]);
  const [contacts, setContacts] = useState<CrisisContact[]>([]);
  const [strategies, setStrategies] = useState<CalmingStrategy[]>([]);
  const { loading, setLoading } = useLoadingState();
  const [activeTab, setActiveTab] = useState<'plan' | 'contacts' | 'strategies'>('plan');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showStrategyForm, setShowStrategyForm] = useState(false);

  const [planForm, setPlanForm] = useState({
    child_name: '',
    warning_signs: [''],
    immediate_actions: [''],
    things_to_avoid: [''],
    safe_space_location: '',
    medication_instructions: '',
    when_to_call_911: [''],
    additional_notes: ''
  });

  const [contactForm, setContactForm] = useState({
    contact_name: '',
    relationship: '',
    phone_number: '',
    email: '',
    contact_type: 'emergency',
    priority_order: 1,
    notes: ''
  });

  const [strategyForm, setStrategyForm] = useState({
    child_name: '',
    strategy_name: '',
    strategy_type: '',
    description: '',
    effectiveness_rating: '',
    duration_minutes: '',
    materials_needed: [''],
    instructions: ['']
  });

  const contactTypes = ['Emergency', 'Therapist', 'Family', 'School', 'Medical', 'Other'];
  const strategyTypes = ['Deep Breathing', 'Sensory', 'Physical Activity', 'Music', 'Visual', 'Verbal', 'Other'];

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

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a crisis plan');
      return;
    }

    try {
      const { error } = await supabase.from('crisis_plans').insert({
        user_id: user.id,
        child_name: planForm.child_name,
        warning_signs: planForm.warning_signs.filter(s => s.trim()),
        immediate_actions: planForm.immediate_actions.filter(s => s.trim()),
        things_to_avoid: planForm.things_to_avoid.filter(s => s.trim()),
        safe_space_location: planForm.safe_space_location || null,
        medication_instructions: planForm.medication_instructions || null,
        when_to_call_911: planForm.when_to_call_911.filter(s => s.trim()),
        additional_notes: planForm.additional_notes || null
      });

      if (error) throw error;

      setShowPlanForm(false);
      setPlanForm({
        child_name: '',
        warning_signs: [''],
        immediate_actions: [''],
        things_to_avoid: [''],
        safe_space_location: '',
        medication_instructions: '',
        when_to_call_911: [''],
        additional_notes: ''
      });
      loadData();
    } catch (error) {
      logger.error('Error creating crisis plan:', error);
      alert('Failed to create crisis plan');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to add a crisis contact');
      return;
    }

    try {
      const { error } = await supabase.from('crisis_contacts').insert({
        user_id: user.id,
        contact_name: contactForm.contact_name,
        relationship: contactForm.relationship,
        phone_number: contactForm.phone_number,
        email: contactForm.email || null,
        contact_type: contactForm.contact_type,
        priority_order: contactForm.priority_order,
        notes: contactForm.notes || null
      });

      if (error) throw error;

      setShowContactForm(false);
      setContactForm({
        contact_name: '',
        relationship: '',
        phone_number: '',
        email: '',
        contact_type: 'emergency',
        priority_order: 1,
        notes: ''
      });
      loadData();
    } catch (error) {
      logger.error('Error creating contact:', error);
      alert('Failed to create contact');
    }
  };

  const handleStrategySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to add a calming strategy');
      return;
    }

    try {
      const { error } = await supabase.from('calming_strategies').insert({
        user_id: user.id,
        child_name: strategyForm.child_name,
        strategy_name: strategyForm.strategy_name,
        strategy_type: strategyForm.strategy_type,
        description: strategyForm.description,
        effectiveness_rating: strategyForm.effectiveness_rating ? parseInt(strategyForm.effectiveness_rating) : null,
        duration_minutes: strategyForm.duration_minutes ? parseInt(strategyForm.duration_minutes) : null,
        materials_needed: strategyForm.materials_needed.filter(s => s.trim()),
        instructions: strategyForm.instructions.filter(s => s.trim())
      });

      if (error) throw error;

      setShowStrategyForm(false);
      setStrategyForm({
        child_name: '',
        strategy_name: '',
        strategy_type: '',
        description: '',
        effectiveness_rating: '',
        duration_minutes: '',
        materials_needed: [''],
        instructions: ['']
      });
      loadData();
    } catch (error) {
      logger.error('Error creating strategy:', error);
      alert('Failed to create calming strategy');
    }
  };

  const addArrayField = (setter: any, field: string, currentArray: string[]) => {
    setter((prev: any) => ({
      ...prev,
      [field]: [...currentArray, '']
    }));
  };

  const updateArrayField = (setter: any, field: string, index: number, value: string, currentArray: string[]) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    setter((prev: any) => ({
      ...prev,
      [field]: newArray
    }));
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
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'plan'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Crisis Plans
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'contacts'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Emergency Contacts
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'strategies'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Calming Strategies
        </button>
      </div>

      {activeTab === 'plan' && (
        <div>
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowPlanForm(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create Crisis Plan
            </button>
          </div>

          {showPlanForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">New Crisis Plan</h2>
              <form onSubmit={handlePlanSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child Name
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.child_name}
                    onChange={(e) => setPlanForm({ ...planForm, child_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warning Signs (What to watch for)
                  </label>
                  {planForm.warning_signs.map((sign, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={sign}
                      onChange={(e) => updateArrayField(setPlanForm, 'warning_signs', idx, e.target.value, planForm.warning_signs)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                      placeholder="e.g., Increased pacing, hand flapping, covering ears"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField(setPlanForm, 'warning_signs', planForm.warning_signs)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    + Add Warning Sign
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immediate Actions (What to do)
                  </label>
                  {planForm.immediate_actions.map((action, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={action}
                      onChange={(e) => updateArrayField(setPlanForm, 'immediate_actions', idx, e.target.value, planForm.immediate_actions)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                      placeholder="e.g., Move to quiet space, remove triggering items"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField(setPlanForm, 'immediate_actions', planForm.immediate_actions)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    + Add Action
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Things to AVOID
                  </label>
                  {planForm.things_to_avoid.map((thing, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={thing}
                      onChange={(e) => updateArrayField(setPlanForm, 'things_to_avoid', idx, e.target.value, planForm.things_to_avoid)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                      placeholder="e.g., Loud voices, physical restraint, asking questions"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField(setPlanForm, 'things_to_avoid', planForm.things_to_avoid)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    + Add Item
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Safe Space Location
                  </label>
                  <input
                    type="text"
                    value={planForm.safe_space_location}
                    onChange={(e) => setPlanForm({ ...planForm, safe_space_location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., Bedroom, sensory corner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    When to Call 911
                  </label>
                  {planForm.when_to_call_911.map((situation, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={situation}
                      onChange={(e) => updateArrayField(setPlanForm, 'when_to_call_911', idx, e.target.value, planForm.when_to_call_911)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                      placeholder="e.g., Risk of self-harm, unresponsive, seizure lasting over 5 min"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField(setPlanForm, 'when_to_call_911', planForm.when_to_call_911)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    + Add Situation
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Save Crisis Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPlanForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-6">
            {crisisPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{plan.child_name}'s Crisis Plan</h2>

                {plan.warning_signs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Warning Signs
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {plan.warning_signs.map((sign, idx) => (
                        <li key={idx} className="text-gray-700">{sign}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.immediate_actions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Immediate Actions
                    </h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {plan.immediate_actions.map((action, idx) => (
                        <li key={idx} className="text-gray-700">{action}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {plan.things_to_avoid.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-orange-800 mb-3">Things to AVOID</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {plan.things_to_avoid.map((thing, idx) => (
                        <li key={idx} className="text-gray-700">{thing}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.safe_space_location && (
                  <div className="mb-6">
                    <h3 className="font-bold text-blue-800 mb-2">Safe Space</h3>
                    <p className="text-gray-700">{plan.safe_space_location}</p>
                  </div>
                )}

                {plan.when_to_call_911.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      When to Call 911
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {plan.when_to_call_911.map((situation, idx) => (
                        <li key={idx} className="text-red-800">{situation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {crisisPlans.length === 0 && !showPlanForm && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Crisis Plans Yet</h3>
                <p className="text-gray-600 mb-6">Create a plan to be prepared for challenging situations</p>
                <button
                  onClick={() => setShowPlanForm(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Create Crisis Plan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div>
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowContactForm(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          </div>

          {showContactForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">New Emergency Contact</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.contact_name}
                      onChange={(e) => setContactForm({ ...contactForm, contact_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      required
                      value={contactForm.relationship}
                      onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone_number}
                      onChange={(e) => setContactForm({ ...contactForm, phone_number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
                    <select
                      value={contactForm.contact_type}
                      onChange={(e) => setContactForm({ ...contactForm, contact_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      {contactTypes.map(type => (
                        <option key={type} value={type.toLowerCase()}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Save Contact
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
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
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    {contact.contact_type}
                  </span>
                </div>
                <div className="space-y-2">
                  <a
                    href={`tel:${contact.phone_number}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    {contact.phone_number}
                  </a>
                  {contact.email && (
                    <p className="text-gray-600 text-sm">{contact.email}</p>
                  )}
                </div>
              </div>
            ))}

            {contacts.length === 0 && !showContactForm && (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Emergency Contacts</h3>
                <p className="text-gray-600 mb-6">Add contacts you can reach in an emergency</p>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Add First Contact
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'strategies' && (
        <div>
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowStrategyForm(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Strategy
            </button>
          </div>

          {showStrategyForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">New Calming Strategy</h2>
              <form onSubmit={handleStrategySubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                    <input
                      type="text"
                      required
                      value={strategyForm.child_name}
                      onChange={(e) => setStrategyForm({ ...strategyForm, child_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Name</label>
                    <input
                      type="text"
                      required
                      value={strategyForm.strategy_name}
                      onChange={(e) => setStrategyForm({ ...strategyForm, strategy_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Type</label>
                  <select
                    required
                    value={strategyForm.strategy_type}
                    onChange={(e) => setStrategyForm({ ...strategyForm, strategy_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select type</option>
                    {strategyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={strategyForm.description}
                    onChange={(e) => setStrategyForm({ ...strategyForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                  {strategyForm.instructions.map((instruction, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={instruction}
                      onChange={(e) => updateArrayField(setStrategyForm, 'instructions', idx, e.target.value, strategyForm.instructions)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
                      placeholder={`Step ${idx + 1}`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField(setStrategyForm, 'instructions', strategyForm.instructions)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Save Strategy
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStrategyForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
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
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    {strategy.strategy_type}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{strategy.description}</p>

                {strategy.instructions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {strategy.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {strategy.duration_minutes && (
                    <span>Duration: {strategy.duration_minutes} min</span>
                  )}
                  {strategy.effectiveness_rating && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      {strategy.effectiveness_rating}/5
                    </span>
                  )}
                </div>
              </div>
            ))}

            {strategies.length === 0 && !showStrategyForm && (
              <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Calming Strategies</h3>
                <p className="text-gray-600 mb-6">Add strategies that help calm your child during difficult moments</p>
                <button
                  onClick={() => setShowStrategyForm(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Add First Strategy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}