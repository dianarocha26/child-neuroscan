import React, { useState, useEffect } from 'react';
import {
  Calendar, Plus, ChevronLeft, FileText, Save, Trash2,
  AlertCircle, CheckCircle2, Clock, MapPin, User,
  ClipboardList, MessageSquare, FolderOpen, ListTodo,
  Download, Printer, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface AppointmentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  typical_duration: number;
  preparation_tips: string[];
}

interface Appointment {
  id: string;
  child_name: string;
  appointment_type: AppointmentType;
  appointment_date: string;
  provider_name: string;
  location: string;
  notes: string;
  completed: boolean;
  observations: Observation[];
  questions: Question[];
  documents: Document[];
  followups: Followup[];
}

interface Observation {
  id?: string;
  category: string;
  observation: string;
  date_observed: string;
  frequency: string;
  concern_level: string;
}

interface Question {
  id?: string;
  question: string;
  priority: string;
  answered: boolean;
  answer: string;
}

interface Document {
  id?: string;
  document_type: string;
  document_name: string;
  notes: string;
}

interface Followup {
  id?: string;
  followup_item: string;
  due_date: string;
  completed: boolean;
  completed_at?: string;
}

interface AppointmentPrepProps {
  userId: string;
  onBack: () => void;
}

export default function AppointmentPrep({ userId, onBack }: AppointmentPrepProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'observations' | 'questions' | 'documents' | 'followup'>('overview');

  const [formData, setFormData] = useState({
    child_name: '',
    appointment_type_id: '',
    appointment_date: '',
    provider_name: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    const [typesResult, appointmentsResult] = await Promise.all([
      supabase.from('appointment_types').select('*').order('name'),
      supabase
        .from('appointments')
        .select(`
          *,
          appointment_type:appointment_types(*),
          observations:appointment_observations(*),
          questions:appointment_questions(*),
          documents:appointment_documents(*),
          followups:appointment_followups(*)
        `)
        .eq('user_id', userId)
        .order('appointment_date', { ascending: true })
    ]);

    if (typesResult.data) setAppointmentTypes(typesResult.data);
    if (appointmentsResult.data) setAppointments(appointmentsResult.data as any);
    setLoading(false);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: userId,
        ...formData
      })
      .select(`
        *,
        appointment_type:appointment_types(*),
        observations:appointment_observations(*),
        questions:appointment_questions(*),
        documents:appointment_documents(*),
        followups:appointment_followups(*)
      `)
      .single();

    if (!error && data) {
      setAppointments([...appointments, data as any]);
      setSelectedAppointment(data as any);
      setView('detail');
      setFormData({
        child_name: '',
        appointment_type_id: '',
        appointment_date: '',
        provider_name: '',
        location: '',
        notes: ''
      });
    }
  };

  const handleAddObservation = async (observation: Observation) => {
    if (!selectedAppointment) return;

    const { data, error } = await supabase
      .from('appointment_observations')
      .insert({
        appointment_id: selectedAppointment.id,
        ...observation
      })
      .select()
      .single();

    if (!error && data) {
      const updated = {
        ...selectedAppointment,
        observations: [...selectedAppointment.observations, data]
      };
      setSelectedAppointment(updated);
      updateAppointmentInList(updated);
    }
  };

  const handleAddQuestion = async (question: Question) => {
    if (!selectedAppointment) return;

    const { data, error } = await supabase
      .from('appointment_questions')
      .insert({
        appointment_id: selectedAppointment.id,
        question: question.question,
        priority: question.priority
      })
      .select()
      .single();

    if (!error && data) {
      const updated = {
        ...selectedAppointment,
        questions: [...selectedAppointment.questions, data]
      };
      setSelectedAppointment(updated);
      updateAppointmentInList(updated);
    }
  };

  const handleAddDocument = async (doc: Document) => {
    if (!selectedAppointment) return;

    const { data, error } = await supabase
      .from('appointment_documents')
      .insert({
        appointment_id: selectedAppointment.id,
        ...doc
      })
      .select()
      .single();

    if (!error && data) {
      const updated = {
        ...selectedAppointment,
        documents: [...selectedAppointment.documents, data]
      };
      setSelectedAppointment(updated);
      updateAppointmentInList(updated);
    }
  };

  const handleAddFollowup = async (followup: Followup) => {
    if (!selectedAppointment) return;

    const { data, error } = await supabase
      .from('appointment_followups')
      .insert({
        appointment_id: selectedAppointment.id,
        ...followup
      })
      .select()
      .single();

    if (!error && data) {
      const updated = {
        ...selectedAppointment,
        followups: [...selectedAppointment.followups, data]
      };
      setSelectedAppointment(updated);
      updateAppointmentInList(updated);
    }
  };

  const handleDeleteItem = async (table: string, id: string, field: keyof Appointment) => {
    await supabase.from(table).delete().eq('id', id);

    if (selectedAppointment) {
      const updated = {
        ...selectedAppointment,
        [field]: (selectedAppointment[field] as any[]).filter((item: any) => item.id !== id)
      };
      setSelectedAppointment(updated);
      updateAppointmentInList(updated);
    }
  };

  const updateAppointmentInList = (updated: Appointment) => {
    setAppointments(appointments.map(apt => apt.id === updated.id ? updated : apt));
  };

  const handleGenerateSummary = () => {
    if (!selectedAppointment) return;

    const summary = generateAppointmentSummary(selectedAppointment);
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-prep-${selectedAppointment.child_name}-${new Date(selectedAppointment.appointment_date).toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const generateAppointmentSummary = (apt: Appointment): string => {
    const date = new Date(apt.appointment_date).toLocaleString();
    let summary = `APPOINTMENT PREPARATION SUMMARY\n`;
    summary += `${'='.repeat(50)}\n\n`;
    summary += `Child: ${apt.child_name}\n`;
    summary += `Appointment Type: ${apt.appointment_type.name}\n`;
    summary += `Date: ${date}\n`;
    summary += `Provider: ${apt.provider_name || 'N/A'}\n`;
    summary += `Location: ${apt.location || 'N/A'}\n\n`;

    if (apt.observations.length > 0) {
      summary += `OBSERVATIONS & CONCERNS\n`;
      summary += `${'-'.repeat(50)}\n`;
      apt.observations.forEach((obs, idx) => {
        summary += `${idx + 1}. [${obs.category}] ${obs.observation}\n`;
        summary += `   Frequency: ${obs.frequency} | Concern Level: ${obs.concern_level}\n`;
        summary += `   Observed: ${obs.date_observed}\n\n`;
      });
    }

    if (apt.questions.length > 0) {
      summary += `\nQUESTIONS TO ASK\n`;
      summary += `${'-'.repeat(50)}\n`;
      const sortedQuestions = [...apt.questions].sort((a, b) => {
        const priority = { high: 0, medium: 1, low: 2 };
        return priority[a.priority as keyof typeof priority] - priority[b.priority as keyof typeof priority];
      });
      sortedQuestions.forEach((q, idx) => {
        summary += `${idx + 1}. [${q.priority.toUpperCase()}] ${q.question}\n`;
      });
    }

    if (apt.documents.length > 0) {
      summary += `\nDOCUMENTS TO BRING\n`;
      summary += `${'-'.repeat(50)}\n`;
      apt.documents.forEach((doc, idx) => {
        summary += `${idx + 1}. ${doc.document_name} (${doc.document_type})\n`;
        if (doc.notes) summary += `   Notes: ${doc.notes}\n`;
      });
    }

    if (apt.appointment_type.preparation_tips.length > 0) {
      summary += `\nPREPARATION TIPS\n`;
      summary += `${'-'.repeat(50)}\n`;
      apt.appointment_type.preparation_tips.forEach((tip, idx) => {
        summary += `${idx + 1}. ${tip}\n`;
      });
    }

    if (apt.notes) {
      summary += `\nADDITIONAL NOTES\n`;
      summary += `${'-'.repeat(50)}\n`;
      summary += `${apt.notes}\n`;
    }

    return summary;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('Back to Appointments', 'Volver a Citas')}
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('Create New Appointment', 'Crear Nueva Cita')}
            </h2>

            <form onSubmit={handleCreateAppointment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Child Name', 'Nombre del Niño')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.child_name}
                  onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Appointment Type', 'Tipo de Cita')}
                </label>
                <select
                  required
                  value={formData.appointment_type_id}
                  onChange={(e) => setFormData({ ...formData, appointment_type_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('Select appointment type', 'Seleccionar tipo de cita')}</option>
                  {appointmentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Date and Time', 'Fecha y Hora')}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Provider Name', 'Nombre del Proveedor')}
                </label>
                <input
                  type="text"
                  value={formData.provider_name}
                  onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('Dr. Smith', 'Dr. García')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Location', 'Ubicación')}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('Clinic address', 'Dirección de la clínica')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Notes', 'Notas')}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('Any additional notes...', 'Notas adicionales...')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {t('Create Appointment', 'Crear Cita')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'detail' && selectedAppointment) {
    return (
      <AppointmentDetail
        appointment={selectedAppointment}
        onBack={() => setView('list')}
        onAddObservation={handleAddObservation}
        onAddQuestion={handleAddQuestion}
        onAddDocument={handleAddDocument}
        onAddFollowup={handleAddFollowup}
        onDeleteItem={handleDeleteItem}
        onGenerateSummary={handleGenerateSummary}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('Back', 'Volver')}
          </button>
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {t('New Appointment', 'Nueva Cita')}
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('Appointment Preparation', 'Preparación de Citas')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('Organize your observations, questions, and documents for doctor visits',
               'Organice sus observaciones, preguntas y documentos para visitas médicas')}
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('No appointments yet', 'Aún no hay citas')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('Create your first appointment to start organizing',
                 'Cree su primera cita para comenzar a organizar')}
            </p>
            <button
              onClick={() => setView('create')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              {t('Create Appointment', 'Crear Cita')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map(apt => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onClick={() => {
                  setSelectedAppointment(apt);
                  setView('detail');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, onClick }: { appointment: Appointment; onClick: () => void }) {
  const date = new Date(appointment.appointment_date);
  const isUpcoming = date > new Date();
  const isPast = date < new Date();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      <div className={`h-2 ${isUpcoming ? 'bg-blue-600' : isPast ? 'bg-gray-400' : 'bg-green-600'}`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {appointment.appointment_type.name}
            </h3>
            <p className="text-sm text-gray-600">{appointment.child_name}</p>
          </div>
          {appointment.completed && (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {appointment.provider_name && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {appointment.provider_name}
            </div>
          )}
          {appointment.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {appointment.location}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
          <span>{appointment.observations.length} observations</span>
          <span>{appointment.questions.length} questions</span>
        </div>
      </div>
    </div>
  );
}

function AppointmentDetail({
  appointment,
  onBack,
  onAddObservation,
  onAddQuestion,
  onAddDocument,
  onAddFollowup,
  onDeleteItem,
  onGenerateSummary
}: {
  appointment: Appointment;
  onBack: () => void;
  onAddObservation: (obs: Observation) => void;
  onAddQuestion: (q: Question) => void;
  onAddDocument: (doc: Document) => void;
  onAddFollowup: (f: Followup) => void;
  onDeleteItem: (table: string, id: string, field: keyof Appointment) => void;
  onGenerateSummary: () => void;
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'observations' | 'questions' | 'documents' | 'followup'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);

  const date = new Date(appointment.appointment_date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('Back to Appointments', 'Volver a Citas')}
          </button>
          <button
            onClick={onGenerateSummary}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            {t('Download Summary', 'Descargar Resumen')}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {appointment.appointment_type.name}
              </h1>
              <p className="text-lg text-gray-600">{appointment.child_name}</p>
            </div>
            {appointment.completed && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Completed
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Date & Time</div>
                <div className="text-gray-600">
                  {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            {appointment.provider_name && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Provider</div>
                  <div className="text-gray-600">{appointment.provider_name}</div>
                </div>
              </div>
            )}
            {appointment.location && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Location</div>
                  <div className="text-gray-600">{appointment.location}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={<FileText className="w-5 h-5" />}
                label="Overview"
              />
              <TabButton
                active={activeTab === 'observations'}
                onClick={() => setActiveTab('observations')}
                icon={<ClipboardList className="w-5 h-5" />}
                label="Observations"
                count={appointment.observations.length}
              />
              <TabButton
                active={activeTab === 'questions'}
                onClick={() => setActiveTab('questions')}
                icon={<MessageSquare className="w-5 h-5" />}
                label="Questions"
                count={appointment.questions.length}
              />
              <TabButton
                active={activeTab === 'documents'}
                onClick={() => setActiveTab('documents')}
                icon={<FolderOpen className="w-5 h-5" />}
                label="Documents"
                count={appointment.documents.length}
              />
              <TabButton
                active={activeTab === 'followup'}
                onClick={() => setActiveTab('followup')}
                icon={<ListTodo className="w-5 h-5" />}
                label="Follow-up"
                count={appointment.followups.length}
              />
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <OverviewTab appointment={appointment} />
            )}
            {activeTab === 'observations' && (
              <ObservationsTab
                observations={appointment.observations}
                onAdd={onAddObservation}
                onDelete={(id) => onDeleteItem('appointment_observations', id, 'observations')}
              />
            )}
            {activeTab === 'questions' && (
              <QuestionsTab
                questions={appointment.questions}
                onAdd={onAddQuestion}
                onDelete={(id) => onDeleteItem('appointment_questions', id, 'questions')}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentsTab
                documents={appointment.documents}
                onAdd={onAddDocument}
                onDelete={(id) => onDeleteItem('appointment_documents', id, 'documents')}
              />
            )}
            {activeTab === 'followup' && (
              <FollowupTab
                followups={appointment.followups}
                onAdd={onAddFollowup}
                onDelete={(id) => onDeleteItem('appointment_followups', id, 'followups')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
        active
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function OverviewTab({ appointment }: { appointment: Appointment }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Appointment</h3>
        <p className="text-gray-700">{appointment.appointment_type.description}</p>
      </div>

      {appointment.notes && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{appointment.notes}</p>
        </div>
      )}

      {appointment.appointment_type.preparation_tips.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Preparation Tips</h3>
          <ul className="space-y-2">
            {appointment.appointment_type.preparation_tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <StatCard
          icon={<ClipboardList className="w-6 h-6 text-blue-600" />}
          label="Observations"
          value={appointment.observations.length}
        />
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-green-600" />}
          label="Questions"
          value={appointment.questions.length}
        />
        <StatCard
          icon={<FolderOpen className="w-6 h-6 text-orange-600" />}
          label="Documents"
          value={appointment.documents.length}
        />
        <StatCard
          icon={<ListTodo className="w-6 h-6 text-purple-600" />}
          label="Follow-ups"
          value={appointment.followups.length}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function ObservationsTab({ observations, onAdd, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Observation>({
    category: 'behavior',
    observation: '',
    date_observed: new Date().toISOString().split('T')[0],
    frequency: 'occasionally',
    concern_level: 'mild'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      category: 'behavior',
      observation: '',
      date_observed: new Date().toISOString().split('T')[0],
      frequency: 'occasionally',
      concern_level: 'mild'
    });
    setShowForm(false);
  };

  const categories = ['behavior', 'communication', 'motor skills', 'social', 'sensory', 'learning', 'sleep', 'eating', 'other'];
  const frequencies = ['daily', 'weekly', 'occasionally', 'rarely'];
  const concernLevels = ['mild', 'moderate', 'high'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Observations & Concerns</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Observation'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Observed</label>
              <input
                type="date"
                value={formData.date_observed}
                onChange={(e) => setFormData({ ...formData, date_observed: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observation</label>
            <textarea
              value={formData.observation}
              onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what you observed..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Concern Level</label>
              <select
                value={formData.concern_level}
                onChange={(e) => setFormData({ ...formData, concern_level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {concernLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Observation
          </button>
        </form>
      )}

      <div className="space-y-4">
        {observations.map((obs: Observation) => (
          <div key={obs.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {obs.category}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {obs.frequency}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    obs.concern_level === 'high' ? 'bg-red-100 text-red-700' :
                    obs.concern_level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {obs.concern_level} concern
                  </span>
                </div>
                <p className="text-gray-900">{obs.observation}</p>
                <p className="text-sm text-gray-500 mt-2">Observed: {obs.date_observed}</p>
              </div>
              <button
                onClick={() => obs.id && onDelete(obs.id)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {observations.length === 0 && (
          <p className="text-center text-gray-500 py-8">No observations added yet</p>
        )}
      </div>
    </div>
  );
}

function QuestionsTab({ questions, onAdd, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Question>({
    question: '',
    priority: 'medium',
    answered: false,
    answer: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      question: '',
      priority: 'medium',
      answered: false,
      answer: ''
    });
    setShowForm(false);
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    const priority = { high: 0, medium: 1, low: 2 };
    return priority[a.priority as keyof typeof priority] - priority[b.priority as keyof typeof priority];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Questions to Ask</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Question'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="What do you want to ask?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Question
          </button>
        </form>
      )}

      <div className="space-y-4">
        {sortedQuestions.map((q: Question) => (
          <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    q.priority === 'high' ? 'bg-red-100 text-red-700' :
                    q.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {q.priority} priority
                  </span>
                  {q.answered && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      Answered
                    </span>
                  )}
                </div>
                <p className="text-gray-900 font-medium">{q.question}</p>
                {q.answer && (
                  <p className="text-gray-600 mt-2 text-sm">Answer: {q.answer}</p>
                )}
              </div>
              <button
                onClick={() => q.id && onDelete(q.id)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <p className="text-center text-gray-500 py-8">No questions added yet</p>
        )}
      </div>
    </div>
  );
}

function DocumentsTab({ documents, onAdd, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Document>({
    document_type: 'medical_records',
    document_name: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      document_type: 'medical_records',
      document_name: '',
      notes: ''
    });
    setShowForm(false);
  };

  const documentTypes = [
    'medical_records',
    'previous_evaluation',
    'therapy_report',
    'school_report',
    'insurance_card',
    'medication_list',
    'other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents to Bring</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Document'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select
              value={formData.document_type}
              onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
            <input
              type="text"
              value={formData.document_name}
              onChange={(e) => setFormData({ ...formData, document_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Speech evaluation from Dr. Smith"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Document
          </button>
        </form>
      )}

      <div className="space-y-4">
        {documents.map((doc: Document) => (
          <div key={doc.id} className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <FolderOpen className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{doc.document_name}</p>
                <p className="text-sm text-gray-600">{doc.document_type.replace('_', ' ')}</p>
                {doc.notes && (
                  <p className="text-sm text-gray-500 mt-1">{doc.notes}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => doc.id && onDelete(doc.id)}
              className="text-red-600 hover:text-red-700 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-center text-gray-500 py-8">No documents added yet</p>
        )}
      </div>
    </div>
  );
}

function FollowupTab({ followups, onAdd, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Followup>({
    followup_item: '',
    due_date: '',
    completed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      followup_item: '',
      due_date: '',
      completed: false
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Follow-up Tasks</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
            <input
              type="text"
              value={formData.followup_item}
              onChange={(e) => setFormData({ ...formData, followup_item: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Schedule follow-up appointment"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Task
          </button>
        </form>
      )}

      <div className="space-y-4">
        {followups.map((task: Followup) => (
          <div key={task.id} className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {task.followup_item}
                </p>
                {task.due_date && (
                  <p className="text-sm text-gray-600">Due: {task.due_date}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => task.id && onDelete(task.id)}
              className="text-red-600 hover:text-red-700 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {followups.length === 0 && (
          <p className="text-center text-gray-500 py-8">No follow-up tasks added yet</p>
        )}
      </div>
    </div>
  );
}