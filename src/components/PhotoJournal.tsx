import React, { useState, useEffect } from 'react';
import { Camera, Upload, X, Filter, Search, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingState } from '../hooks/useLoadingState';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface PhotoEntry {
  id: string;
  child_name: string;
  title: string;
  description: string;
  photo_url: string;
  media_type: 'photo' | 'video';
  milestone_type: string;
  age_at_capture: string;
  linked_condition: string;
  tags: string[];
  created_at: string;
}

export default function PhotoJournal() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<PhotoEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<PhotoEntry[]>([]);
  const { loading, setLoading } = useLoadingState();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PhotoEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    child_name: '',
    title: '',
    description: '',
    milestone_type: '',
    age_at_capture: '',
    linked_condition: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, filterCondition]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('photo_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      logger.error('Failed to load photo journal entries', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = [...entries];

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCondition) {
      filtered = filtered.filter(entry => entry.linked_condition === filterCondition);
    }

    setFilteredEntries(filtered);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('File size must be less than 50MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image or video file');
        return;
      }

      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('photo-journal')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photo-journal')
        .getPublicUrl(fileName);

      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      const mediaType = selectedFile.type.startsWith('video/') ? 'video' : 'photo';

      const { error: insertError } = await supabase
        .from('photo_journal_entries')
        .insert({
          user_id: user.id,
          child_name: formData.child_name,
          title: formData.title,
          description: formData.description,
          photo_url: publicUrl,
          media_type: mediaType,
          milestone_type: formData.milestone_type,
          age_at_capture: formData.age_at_capture,
          linked_condition: formData.linked_condition,
          tags: tagsArray
        });

      if (insertError) throw insertError;

      setShowUploadForm(false);
      setFormData({
        child_name: '',
        title: '',
        description: '',
        milestone_type: '',
        age_at_capture: '',
        linked_condition: '',
        tags: ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
      loadEntries();
    } catch (error) {
      logger.error('Error uploading photo/video', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (entry: PhotoEntry) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const fileName = entry.photo_url.split('/').pop();
      if (fileName) {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.storage
          .from('photo-journal')
          .remove([`${user?.id}/${fileName}`]);
      }

      const { error } = await supabase
        .from('photo_journal_entries')
        .delete()
        .eq('id', entry.id);

      if (error) throw error;
      loadEntries();
      setSelectedEntry(null);
    } catch (error) {
      logger.error('Error deleting photo journal entry', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleEdit = async (entry: PhotoEntry) => {
    setFormData({
      child_name: entry.child_name,
      title: entry.title,
      description: entry.description,
      milestone_type: entry.milestone_type,
      age_at_capture: entry.age_at_capture,
      linked_condition: entry.linked_condition,
      tags: entry.tags.join(', ')
    });
    setSelectedEntry(entry);
    setShowUploadForm(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry) return;

    setUploading(true);
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      const { error } = await supabase
        .from('photo_journal_entries')
        .update({
          child_name: formData.child_name,
          title: formData.title,
          description: formData.description,
          milestone_type: formData.milestone_type,
          age_at_capture: formData.age_at_capture,
          linked_condition: formData.linked_condition,
          tags: tagsArray
        })
        .eq('id', selectedEntry.id);

      if (error) throw error;

      setShowUploadForm(false);
      setFormData({
        child_name: '',
        title: '',
        description: '',
        milestone_type: '',
        age_at_capture: '',
        linked_condition: '',
        tags: ''
      });
      setSelectedEntry(null);
      loadEntries();
    } catch (error) {
      logger.error('Error updating photo journal entry', error);
      alert('Failed to update entry. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const conditions = Array.from(new Set(entries.map(e => e.linked_condition).filter(c => c)));

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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Photo Journal</h2>
            <p className="text-gray-600">Document your child's progress with photos and videos</p>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Upload className="w-5 h-5" />
            Add Entry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Conditions</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600 flex items-center justify-end">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedEntry ? 'Edit Entry' : 'Add Photo/Video Entry'}
              </h3>
              <button onClick={() => {
                setShowUploadForm(false);
                setSelectedEntry(null);
                setFormData({
                  child_name: '',
                  title: '',
                  description: '',
                  milestone_type: '',
                  age_at_capture: '',
                  linked_condition: '',
                  tags: ''
                });
                setSelectedFile(null);
                setPreviewUrl('');
              }} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={selectedEntry ? handleUpdate : handleUpload} className="space-y-4">
              {!selectedEntry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo or Video *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewUrl ? (
                      <div className="relative">
                        {selectedFile?.type.startsWith('video/') ? (
                          <video src={previewUrl} controls className="max-h-64 mx-auto rounded" />
                        ) : (
                          <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded" />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <span className="text-blue-600 hover:text-blue-700">Choose file</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Name *
                  </label>
                  <input
                    type="text"
                    value={formData.child_name}
                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age at Time *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 3 years 2 months"
                    value={formData.age_at_capture}
                    onChange={(e) => setFormData({ ...formData, age_at_capture: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., First time using fork independently"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Motor Skills, Social"
                    value={formData.milestone_type}
                    onChange={(e) => setFormData({ ...formData, milestone_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Condition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Autism, ADHD"
                    value={formData.linked_condition}
                    onChange={(e) => setFormData({ ...formData, linked_condition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., eating, independence, progress"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setSelectedEntry(null);
                    setFormData({
                      child_name: '',
                      title: '',
                      description: '',
                      milestone_type: '',
                      age_at_capture: '',
                      linked_condition: '',
                      tags: ''
                    });
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {uploading ? (selectedEntry ? 'Updating...' : 'Uploading...') : (selectedEntry ? 'Update Entry' : 'Add Entry')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={() => setSelectedEntry(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
              >
                <X className="w-6 h-6" />
              </button>
              {selectedEntry.media_type === 'video' ? (
                <video src={selectedEntry.photo_url} controls className="w-full max-h-96 object-contain bg-black" />
              ) : (
                <img src={selectedEntry.photo_url} alt={selectedEntry.title} className="w-full max-h-96 object-contain bg-black" />
              )}
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedEntry.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedEntry.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{selectedEntry.child_name}</span>
                  <span>•</span>
                  <span>Age: {selectedEntry.age_at_capture}</span>
                </div>
              </div>

              {selectedEntry.description && (
                <p className="text-gray-700 mb-4">{selectedEntry.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                {selectedEntry.milestone_type && (
                  <div>
                    <span className="font-semibold text-gray-700">Milestone: </span>
                    <span className="text-gray-600">{selectedEntry.milestone_type}</span>
                  </div>
                )}
                {selectedEntry.linked_condition && (
                  <div>
                    <span className="font-semibold text-gray-700">Condition: </span>
                    <span className="text-gray-600">{selectedEntry.linked_condition}</span>
                  </div>
                )}
              </div>

              {selectedEntry.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(selectedEntry)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Entry
                </button>
                <button
                  onClick={() => handleDelete(selectedEntry)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="text-center py-16">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Entries Yet</h3>
          <p className="text-gray-600 mb-6">Start documenting your child's milestones and progress</p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Upload className="w-5 h-5" />
            Add First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map(entry => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition group"
            >
              <div className="relative aspect-video bg-gray-100">
                {entry.media_type === 'video' ? (
                  <video src={entry.photo_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={entry.photo_url} alt={entry.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                )}
                {entry.media_type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-8 border-l-blue-600 border-y-6 border-y-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{entry.title}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <div>{entry.child_name} • {entry.age_at_capture}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{entry.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
