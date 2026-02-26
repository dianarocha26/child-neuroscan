import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Eye, Ear, Hand, Aperture, Wind, Activity, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { logger } from '../lib/logger';
import type { SensoryProfile } from '../types/components';

export default function SensoryProfile() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<SensoryProfile[]>([]);
  const { loading, setLoading } = useLoadingState();
  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    child_name: '',
    visual_sensitivity: 'typical',
    auditory_sensitivity: 'typical',
    tactile_sensitivity: 'typical',
    taste_sensitivity: 'typical',
    smell_sensitivity: 'typical',
    vestibular_sensitivity: 'typical',
    proprioceptive_sensitivity: 'typical',
    visual_notes: '',
    auditory_notes: '',
    tactile_notes: '',
    taste_notes: '',
    smell_notes: '',
    vestibular_notes: '',
    proprioceptive_notes: ''
  });

  const sensoryystems = [
    {
      key: 'visual',
      name: 'Visual',
      icon: Eye,
      color: 'blue',
      description: 'How they process what they see',
      examples: 'Bright lights, patterns, colors'
    },
    {
      key: 'auditory',
      name: 'Auditory',
      icon: Ear,
      color: 'purple',
      description: 'How they process sounds',
      examples: 'Loud noises, background sounds, music'
    },
    {
      key: 'tactile',
      name: 'Tactile',
      icon: Hand,
      color: 'pink',
      description: 'How they process touch',
      examples: 'Textures, temperatures, physical contact'
    },
    {
      key: 'taste',
      name: 'Taste/Oral',
      icon: Aperture,
      color: 'orange',
      description: 'How they process tastes and oral input',
      examples: 'Food textures, temperatures, flavors'
    },
    {
      key: 'smell',
      name: 'Smell',
      icon: Wind,
      color: 'green',
      description: 'How they process scents',
      examples: 'Strong smells, perfumes, food odors'
    },
    {
      key: 'vestibular',
      name: 'Vestibular',
      icon: Activity,
      color: 'red',
      description: 'Movement and balance',
      examples: 'Spinning, swinging, rocking'
    },
    {
      key: 'proprioceptive',
      name: 'Proprioceptive',
      icon: Users,
      color: 'teal',
      description: 'Body awareness and position',
      examples: 'Pushing, pulling, heavy work'
    }
  ];

  const sensitivityLevels = [
    { value: 'under-responsive', label: 'Under-Responsive (Seeks more)', color: 'blue' },
    { value: 'typical', label: 'Typical', color: 'green' },
    { value: 'over-responsive', label: 'Over-Responsive (Avoids)', color: 'red' }
  ];

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  const loadProfiles = async () => {
    if (!user) {
      logger.error('Cannot load profiles: user is null');
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('sensory_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setProfiles(data);
        if (data.length > 0 && !selectedProfile) {
          setSelectedProfile(data[0].id);
        }
      }
    } catch (error) {
      logger.error('Error loading sensory profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a sensory profile');
      return;
    }

    try {
      const { error } = await supabase.from('sensory_profiles').insert({
        user_id: user.id,
        child_name: formData.child_name,
        visual_sensitivity: formData.visual_sensitivity,
        auditory_sensitivity: formData.auditory_sensitivity,
        tactile_sensitivity: formData.tactile_sensitivity,
        taste_sensitivity: formData.taste_sensitivity,
        smell_sensitivity: formData.smell_sensitivity,
        vestibular_sensitivity: formData.vestibular_sensitivity,
        proprioceptive_sensitivity: formData.proprioceptive_sensitivity,
        visual_notes: formData.visual_notes || null,
        auditory_notes: formData.auditory_notes || null,
        tactile_notes: formData.tactile_notes || null
      });

      if (error) throw error;

      setShowForm(false);
      setFormData({
        child_name: '',
        visual_sensitivity: 'typical',
        auditory_sensitivity: 'typical',
        tactile_sensitivity: 'typical',
        taste_sensitivity: 'typical',
        smell_sensitivity: 'typical',
        vestibular_sensitivity: 'typical',
        proprioceptive_sensitivity: 'typical',
        visual_notes: '',
        auditory_notes: '',
        tactile_notes: '',
        taste_notes: '',
        smell_notes: '',
        vestibular_notes: '',
        proprioceptive_notes: ''
      });
      loadProfiles();
    } catch (error) {
      logger.error('Error creating sensory profile:', error);
      alert('Failed to create sensory profile');
    }
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'under-responsive': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'over-responsive': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const currentProfile = profiles.find(p => p.id === selectedProfile);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Sensory Profile</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Profile
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-1">What is a Sensory Profile?</h3>
        <p className="text-blue-800 text-sm">
          A sensory profile helps identify how your child processes sensory information. This understanding can help you prevent meltdowns, choose appropriate activities, and communicate needs to therapists and teachers.
        </p>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Create Sensory Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
              <input
                type="text"
                required
                value={formData.child_name}
                onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-6">
              {sensoryystems.map((system) => {
                const Icon = system.icon;
                const sensitivityKey = `${system.key}_sensitivity` as keyof typeof formData;
                const notesKey = `${system.key}_notes` as keyof typeof formData;

                return (
                  <div key={system.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className={`w-6 h-6 text-${system.color}-600`} />
                      <div>
                        <h3 className="font-bold text-gray-900">{system.name}</h3>
                        <p className="text-sm text-gray-600">{system.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Examples: {system.examples}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity Level</label>
                        <div className="grid grid-cols-3 gap-2">
                          {sensitivityLevels.map((level) => (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, [sensitivityKey]: level.value })}
                              className={`p-3 rounded-lg border-2 transition text-sm ${
                                formData[sensitivityKey] === level.value
                                  ? `border-${level.color}-500 bg-${level.color}-50`
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes & Examples</label>
                        <textarea
                          value={formData[notesKey] as string}
                          onChange={(e) => setFormData({ ...formData, [notesKey]: e.target.value })}
                          placeholder="Specific triggers, reactions, or helpful strategies..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Create Profile
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {profiles.length > 0 && !showForm && (
        <div className="space-y-6">
          <div className="flex gap-3">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  selectedProfile === profile.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {profile.child_name}
              </button>
            ))}
          </div>

          {currentProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sensoryystems.map((system) => {
                const Icon = system.icon;
                const sensitivity = currentProfile[`${system.key}_sensitivity` as keyof SensoryProfile] as string;
                const notes = currentProfile[`${system.key}_notes` as keyof SensoryProfile] as string;

                return (
                  <div key={system.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-6 h-6 text-${system.color}-600`} />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{system.name}</h3>
                        <p className="text-sm text-gray-600">{system.description}</p>
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-lg border-2 mb-3 text-sm font-semibold ${getSensitivityColor(sensitivity)}`}>
                      {sensitivityLevels.find(l => l.value === sensitivity)?.label || sensitivity}
                    </div>

                    {notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{notes}</p>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Examples: {system.examples}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {profiles.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sensory Profiles</h3>
          <p className="text-gray-600 mb-6">Create a sensory profile to understand your child's sensory needs</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Create First Profile
          </button>
        </div>
      )}
    </div>
  );
}