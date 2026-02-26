import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Globe, Star, Heart, Bookmark, CheckCircle, Filter, X, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';

interface TherapyResource {
  id: string;
  name: string;
  resource_type: string;
  specialties: string[];
  description: string;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  zip_code: string | null;
  services_offered: string[];
  age_groups: string[];
  languages: string[];
  accepts_insurance: boolean;
  insurance_types: string[];
  teletherapy_available: boolean;
  rating: number;
}

interface SavedResource {
  id: string;
  resource_id: string;
  notes: string;
  contacted: boolean;
  contacted_date: string | null;
}

interface ResourceFinderProps {
  userId: string;
  initialCondition?: string;
  onBack?: () => void;
}

export default function ResourceFinder({ userId, initialCondition, onBack }: ResourceFinderProps) {
  const { t } = useLanguage();
  const [resources, setResources] = useState<TherapyResource[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>(initialCondition || 'all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showTeletherapyOnly, setShowTeletherapyOnly] = useState(false);
  const [showInsuranceOnly, setShowInsuranceOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    loadResources();
    loadSavedResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('therapy_resources')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      logger.error('Error loading resources:', error);
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  const loadSavedResources = async () => {
    const { data, error } = await supabase
      .from('user_saved_resources')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      logger.error('Error loading saved resources:', error);
    } else {
      setSavedResources(data || []);
    }
  };

  const toggleSaveResource = async (resourceId: string) => {
    const isSaved = savedResources.some(sr => sr.resource_id === resourceId);

    if (isSaved) {
      const savedResource = savedResources.find(sr => sr.resource_id === resourceId);
      if (savedResource) {
        const { error } = await supabase
          .from('user_saved_resources')
          .delete()
          .eq('id', savedResource.id);

        if (!error) {
          await loadSavedResources();
        }
      }
    } else {
      const { error } = await supabase
        .from('user_saved_resources')
        .insert({
          user_id: userId,
          resource_id: resourceId
        });

      if (!error) {
        await loadSavedResources();
      }
    }
  };

  const markAsContacted = async (resourceId: string) => {
    const savedResource = savedResources.find(sr => sr.resource_id === resourceId);
    if (savedResource) {
      const { error } = await supabase
        .from('user_saved_resources')
        .update({
          contacted: true,
          contacted_date: new Date().toISOString()
        })
        .eq('id', savedResource.id);

      if (!error) {
        await loadSavedResources();
      }
    }
  };

  const conditionTypes = [
    { id: 'all', label: 'All Conditions' },
    { id: 'asd', label: 'Autism Spectrum' },
    { id: 'adhd', label: 'ADHD' },
    { id: 'speech', label: 'Speech & Language' },
    { id: 'developmental', label: 'Developmental Delay' },
    { id: 'learning', label: 'Learning Disorders' },
    { id: 'sensory', label: 'Sensory Processing' },
  ];

  const resourceTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'therapist', label: 'Individual Therapist' },
    { id: 'clinic', label: 'Clinic/Center' },
    { id: 'online_resource', label: 'Online Resource' },
    { id: 'support_group', label: 'Support Group' },
    { id: 'educational_program', label: 'Educational Program' },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' ||
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCondition = selectedCondition === 'all' ||
      resource.specialties.includes(selectedCondition);

    const matchesType = selectedType === 'all' ||
      resource.resource_type === selectedType;

    const matchesState = selectedState === 'all' ||
      resource.state === selectedState;

    const matchesTeletherapy = !showTeletherapyOnly ||
      resource.teletherapy_available;

    const matchesInsurance = !showInsuranceOnly ||
      resource.accepts_insurance;

    const matchesSaved = !showSavedOnly ||
      savedResources.some(sr => sr.resource_id === resource.id);

    return matchesSearch && matchesCondition && matchesType &&
           matchesState && matchesTeletherapy && matchesInsurance && matchesSaved;
  });

  const uniqueStates = Array.from(new Set(resources.map(r => r.state).filter(Boolean))).sort();

  const isSaved = (resourceId: string) => {
    return savedResources.some(sr => sr.resource_id === resourceId);
  };

  const isContacted = (resourceId: string) => {
    const saved = savedResources.find(sr => sr.resource_id === resourceId);
    return saved?.contacted || false;
  };

  const getResourceTypeLabel = (type: string) => {
    return resourceTypes.find(rt => rt.id === type)?.label || type;
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'therapist': return 'bg-blue-100 text-blue-700';
      case 'clinic': return 'bg-green-100 text-green-700';
      case 'online_resource': return 'bg-purple-100 text-purple-700';
      case 'support_group': return 'bg-orange-100 text-orange-700';
      case 'educational_program': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('Therapy Resource Finder', 'Buscador de Recursos Terapéuticos')}
        </h1>
        <p className="text-gray-600">
          {t('Find therapists, clinics, and support services for your child',
             'Encuentre terapeutas, clínicas y servicios de apoyo para su hijo')}
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('Search by name, location, or service...', 'Buscar por nombre, ubicación o servicio...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            {t('Filters', 'Filtros')}
          </button>
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showSavedOnly ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            {t('Saved', 'Guardados')}
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Condition', 'Condición')}
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {conditionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Resource Type', 'Tipo de Recurso')}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {resourceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('State', 'Estado')}
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">{t('All States', 'Todos los Estados')}</option>
                  {uniqueStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTeletherapyOnly}
                  onChange={(e) => setShowTeletherapyOnly(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  {t('Teletherapy available', 'Teleterapia disponible')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInsuranceOnly}
                  onChange={(e) => setShowInsuranceOnly(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">
                  {t('Accepts insurance', 'Acepta seguros')}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {t(`Showing ${filteredResources.length} resources`, `Mostrando ${filteredResources.length} recursos`)}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('No resources found', 'No se encontraron recursos')}
          </h3>
          <p className="text-gray-600">
            {t('Try adjusting your filters or search terms', 'Intente ajustar sus filtros o términos de búsqueda')}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredResources.map(resource => {
            const saved = isSaved(resource.id);
            const contacted = isContacted(resource.id);

            return (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{resource.name}</h3>
                      {contacted && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          {t('Contacted', 'Contactado')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getResourceTypeColor(resource.resource_type)}`}>
                        {getResourceTypeLabel(resource.resource_type)}
                      </span>
                      {resource.teletherapy_available && (
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {t('Teletherapy', 'Teleterapia')}
                        </span>
                      )}
                      {resource.accepts_insurance && (
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          {t('Insurance', 'Seguros')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {resource.rating > 0 && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-700">{resource.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => toggleSaveResource(resource.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        saved
                          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {saved ? <Heart className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{resource.description}</p>

                {resource.services_offered.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      {t('Services Offered', 'Servicios Ofrecidos')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resource.services_offered.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {resource.city && resource.state && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{resource.city}, {resource.state}</span>
                    </div>
                  )}

                  {resource.contact_phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${resource.contact_phone}`} className="text-sm hover:text-teal-600">
                        {resource.contact_phone}
                      </a>
                    </div>
                  )}

                  {resource.contact_email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${resource.contact_email}`} className="text-sm hover:text-teal-600">
                        {resource.contact_email}
                      </a>
                    </div>
                  )}

                  {resource.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-teal-600 flex items-center gap-1"
                      >
                        {t('Visit Website', 'Visitar Sitio Web')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {saved && !contacted && (
                  <button
                    onClick={() => markAsContacted(resource.id)}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    {t('Mark as Contacted', 'Marcar como Contactado')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}