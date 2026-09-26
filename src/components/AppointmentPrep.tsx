import React, { useState, useEffect } from 'react';
import {
  Calendar, Plus, ArrowLeft, FileText, Save, Trash2, Edit2,
  AlertCircle, CheckCircle2, Clock, MapPin, User,
  ClipboardList, MessageSquare, FolderOpen, ListTodo,
  Download, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { logger } from '../lib/logger';
import { localToday, toLocalDateString, toDateTimeLocalInput, fromDateTimeLocalInput } from '../lib/dates';
import { PageHeader } from './PageHeader';
import {
  listAppointmentTypes, listAppointments, createAppointment, updateAppointment, deleteAppointment,
  addObservation, addQuestion, addDocument, addFollowup, deleteAppointmentItem,
  type AppointmentType, type Observation, type Question, type Document, type Followup,
  type Appointment, type AppointmentChildTable,
  type NewObservation, type NewQuestion, type NewDocument, type NewFollowup
} from '../lib/api/appointments';
import { ChildPicker } from './ChildPicker';

interface AppointmentPrepProps {
  userId: string;
  onBack: () => void;
}

export default function AppointmentPrep({ userId, onBack }: AppointmentPrepProps) {
  const { t } = useLanguage();
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

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

    const [apptsResult, typesResult] = await Promise.allSettled([
      listAppointments(userId),
      listAppointmentTypes()
    ]);

    if (apptsResult.status === 'rejected') {
      logger.error('Error loading appointments:', apptsResult.reason);
    } else {
      setAppointments(apptsResult.value);
    }

    if (typesResult.status === 'rejected') {
      logger.error('Error loading appointment types:', typesResult.reason);
    } else {
      setAppointmentTypes(typesResult.value);
    }

    setLoading(false);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    // datetime-local values are zone-less local times; send an explicit instant
    const payload = {
      ...formData,
      appointment_date: fromDateTimeLocalInput(formData.appointment_date)
    };

    if (editingApt) {
      // Update existing appointment
      let data: Appointment;
      try {
        data = await updateAppointment(editingApt.id, payload);
      } catch (error) {
        logger.error('Error updating appointment:', error);
        alert(t('Failed to update appointment. Please try again.', 'No se pudo actualizar la cita. Inténtelo de nuevo.'));
        return;
      }

      updateAppointmentInList(data);
      setSelectedAppointment(data);
      setEditingApt(null);
      setFormData({ child_name: '', appointment_type_id: '', appointment_date: '', provider_name: '', location: '', notes: '' });
      setView('detail');
    } else {
      // Create new appointment
      let data: Appointment;
      try {
        data = await createAppointment(userId, payload);
      } catch (error) {
        logger.error('Error creating appointment:', error);
        alert(t('Failed to create appointment. Please try again.', 'No se pudo crear la cita. Inténtelo de nuevo.'));
        return;
      }

      setAppointments([...appointments, data]);
      setSelectedAppointment(data);
      setView('detail');
      setFormData({ child_name: '', appointment_type_id: '', appointment_date: '', provider_name: '', location: '', notes: '' });
    }
  };

  const handleEditAppointment = (apt: Appointment) => {
    setEditingApt(apt);
    setFormData({
      child_name: apt.child_name,
      appointment_type_id: apt.appointment_type?.id || '',
      appointment_date: toDateTimeLocalInput(apt.appointment_date),
      provider_name: apt.provider_name || '',
      location: apt.location || '',
      notes: apt.notes || ''
    });
    setView('create');
  };

  const handleDeleteAppointment = async (aptId: string) => {
    if (!confirm('Delete this appointment and all its data?')) return;
    try {
      await deleteAppointment(aptId);
    } catch (error) {
      logger.error('Error deleting appointment:', error);
      alert(t('Failed to delete appointment. Please try again.', 'No se pudo eliminar la cita. Inténtelo de nuevo.'));
      return;
    }
    setAppointments(appointments.filter(a => a.id !== aptId));
    setView('list');
  };

  const handleAddObservation = async (observation: NewObservation): Promise<boolean> => {
    if (!selectedAppointment) return false;

    let data: Observation;
    try {
      data = await addObservation(selectedAppointment.id, observation);
    } catch (error) {
      logger.error('Error adding observation:', error);
      alert(t('Failed to add observation. Please try again.', 'No se pudo agregar la observación. Inténtelo de nuevo.'));
      return false;
    }

    const updated = {
      ...selectedAppointment,
      observations: [...selectedAppointment.observations, data]
    };
    setSelectedAppointment(updated);
    updateAppointmentInList(updated);
    return true;
  };

  const handleAddQuestion = async (question: NewQuestion): Promise<boolean> => {
    if (!selectedAppointment) return false;

    let data: Question;
    try {
      data = await addQuestion(selectedAppointment.id, question);
    } catch (error) {
      logger.error('Error adding question:', error);
      alert(t('Failed to add question. Please try again.', 'No se pudo agregar la pregunta. Inténtelo de nuevo.'));
      return false;
    }

    const updated = {
      ...selectedAppointment,
      questions: [...selectedAppointment.questions, data]
    };
    setSelectedAppointment(updated);
    updateAppointmentInList(updated);
    return true;
  };

  const handleAddDocument = async (doc: NewDocument): Promise<boolean> => {
    if (!selectedAppointment) return false;

    let data: Document;
    try {
      data = await addDocument(selectedAppointment.id, doc);
    } catch (error) {
      logger.error('Error adding document:', error);
      alert(t('Failed to add document. Please try again.', 'No se pudo agregar el documento. Inténtelo de nuevo.'));
      return false;
    }

    const updated = {
      ...selectedAppointment,
      documents: [...selectedAppointment.documents, data]
    };
    setSelectedAppointment(updated);
    updateAppointmentInList(updated);
    return true;
  };

  const handleAddFollowup = async (followup: NewFollowup): Promise<boolean> => {
    if (!selectedAppointment) return false;

    let data: Followup;
    try {
      data = await addFollowup(selectedAppointment.id, followup);
    } catch (error) {
      logger.error('Error adding follow-up task:', error);
      alert(t('Failed to add follow-up task. Please try again.', 'No se pudo agregar la tarea de seguimiento. Inténtelo de nuevo.'));
      return false;
    }

    const updated = {
      ...selectedAppointment,
      followups: [...selectedAppointment.followups, data]
    };
    setSelectedAppointment(updated);
    updateAppointmentInList(updated);
    return true;
  };

  const handleDeleteItem = async (table: AppointmentChildTable, id: string, field: keyof Appointment) => {
    if (!confirm(t('Delete this item?', '¿Eliminar este elemento?'))) return;

    try {
      await deleteAppointmentItem(table, id);
    } catch (error) {
      logger.error('Error deleting item:', error);
      alert(t('Failed to delete item. Please try again.', 'No se pudo eliminar el elemento. Inténtelo de nuevo.'));
      return;
    }

    if (selectedAppointment) {
      const updated = {
        ...selectedAppointment,
        [field]: (selectedAppointment[field] as { id?: string }[]).filter((item) => item.id !== id)
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
    a.download = `appointment-prep-${selectedAppointment.child_name}-${toLocalDateString(new Date(selectedAppointment.appointment_date))}.txt`;
    a.click();
  };

  const generateAppointmentSummary = (apt: Appointment): string => {
    const date = new Date(apt.appointment_date).toLocaleString();
    let summary = `APPOINTMENT PREPARATION SUMMARY\n`;
    summary += `${'='.repeat(50)}\n\n`;
    summary += `Child: ${apt.child_name}\n`;
    summary += `Appointment Type: ${apt.appointment_type?.name ?? 'N/A'}\n`;
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
        summary += `${idx + 1}. [${(q.priority ?? '').toUpperCase()}] ${q.question}\n`;
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

    const prepTips = apt.appointment_type?.preparation_tips ?? [];
    if (prepTips.length > 0) {
      summary += `\nPREPARATION TIPS\n`;
      summary += `${'-'.repeat(50)}\n`;
      prepTips.forEach((tip, idx) => {
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
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
          <button
            onClick={() => { setView(editingApt ? 'detail' : 'list'); setEditingApt(null); }}
            className="no-print inline-flex items-center gap-1.5 -ml-2 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mb-2 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t('Back to Appointments', 'Volver a Citas')}
          </button>

          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {editingApt ? t('Edit Appointment', 'Editar Cita') : t('Create New Appointment', 'Crear Nueva Cita')}
            </h2>

            <form onSubmit={handleCreateAppointment} className="space-y-6">
              <div>
                <label htmlFor="appointment-prep-child-name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Child Name', 'Nombre del Niño')}
                </label>
                <ChildPicker id="appointment-prep-child-name" required value={formData.child_name} onChange={(name) => setFormData({ ...formData, child_name: name })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              <div>
                <label htmlFor="appointment-prep-appointment-type" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Appointment Type', 'Tipo de Cita')}
                </label>
                <select id="appointment-prep-appointment-type"
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
                <label htmlFor="appointment-prep-date-and-time" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Date and Time', 'Fecha y Hora')}
                </label>
                <input id="appointment-prep-date-and-time"
                  type="datetime-local"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="appointment-prep-provider-name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Provider Name', 'Nombre del Proveedor')}
                </label>
                <input id="appointment-prep-provider-name"
                  type="text"
                  value={formData.provider_name}
                  onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('Dr. Smith', 'Dr. García')}
                />
              </div>

              <div>
                <label htmlFor="appointment-prep-location" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Location', 'Ubicación')}
                </label>
                <input id="appointment-prep-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('Clinic address', 'Dirección de la clínica')}
                />
              </div>

              <div>
                <label htmlFor="appointment-prep-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Notes', 'Notas')}
                </label>
                <textarea id="appointment-prep-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('Any additional notes...', 'Notas adicionales...')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 text-white py-3 rounded-lg font-medium hover:bg-teal-800 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {editingApt ? t('Update Appointment', 'Actualizar Cita') : t('Create Appointment', 'Crear Cita')}
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
        onEditAppointment={handleEditAppointment}
        onDeleteAppointment={handleDeleteAppointment}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
        <button
          onClick={onBack}
          className="no-print inline-flex items-center gap-1.5 -ml-2 mb-2 sm:mb-4 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t('Back to Home', 'Volver al inicio')}
        </button>

        <PageHeader
          icon={Calendar}
          tone="blue"
          title={t('Appointments', 'Citas')}
          subtitle={t('Organize observations, questions, and documents for doctor visits',
             'Organice observaciones, preguntas y documentos para visitas médicas')}
          action={{ label: t('New Appointment', 'Nueva Cita'), icon: Plus, onClick: () => setView('create') }}
        />

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 text-center">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium"
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
  const { t } = useLanguage();
  const date = new Date(appointment.appointment_date);
  const isUpcoming = date > new Date();
  const isPast = date < new Date();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      <div className={`h-2 ${isUpcoming ? 'bg-blue-600' : isPast ? 'bg-gray-400' : 'bg-green-600'}`}></div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {appointment.appointment_type?.name ?? t('Appointment', 'Cita')}
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
  onGenerateSummary,
  onEditAppointment,
  onDeleteAppointment
}: {
  appointment: Appointment;
  onBack: () => void;
  onAddObservation: (obs: NewObservation) => Promise<boolean>;
  onAddQuestion: (q: NewQuestion) => Promise<boolean>;
  onAddDocument: (doc: NewDocument) => Promise<boolean>;
  onAddFollowup: (f: NewFollowup) => Promise<boolean>;
  onDeleteItem: (table: AppointmentChildTable, id: string, field: keyof Appointment) => void;
  onGenerateSummary: () => void;
  onEditAppointment: (apt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'observations' | 'questions' | 'documents' | 'followup'>('overview');

  const date = new Date(appointment.appointment_date);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={onBack}
            className="no-print inline-flex items-center gap-1.5 -ml-2 px-2 min-h-[44px] rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t('Back to Appointments', 'Volver a Citas')}
          </button>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onEditAppointment(appointment)}
              className="flex items-center gap-2 px-4 py-2 border border-teal-700 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              {t('Edit', 'Editar')}
            </button>
            <button
              onClick={() => onDeleteAppointment(appointment.id)}
              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t('Delete', 'Eliminar')}
            </button>
            <button
              onClick={onGenerateSummary}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              {t('Download Summary', 'Descargar Resumen')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {appointment.appointment_type?.name ?? t('Appointment', 'Cita')}
              </h1>
              <p className="sm:text-lg text-gray-600">{appointment.child_name}</p>
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
            <div className="flex overflow-x-auto scroll-fade-x">
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

          <div className="p-4 sm:p-8">
            {activeTab === 'overview' && (
              <OverviewTab appointment={appointment} />
            )}
            {activeTab === 'observations' && (
              <ObservationsTab
                observations={appointment.observations}
                onAdd={onAddObservation}
                onDelete={(id: string) => onDeleteItem('appointment_observations', id, 'observations')}
              />
            )}
            {activeTab === 'questions' && (
              <QuestionsTab
                questions={appointment.questions}
                onAdd={onAddQuestion}
                onDelete={(id: string) => onDeleteItem('appointment_questions', id, 'questions')}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentsTab
                documents={appointment.documents}
                onAdd={onAddDocument}
                onDelete={(id: string) => onDeleteItem('appointment_documents', id, 'documents')}
              />
            )}
            {activeTab === 'followup' && (
              <FollowupTab
                followups={appointment.followups}
                onAdd={onAddFollowup}
                onDelete={(id: string) => onDeleteItem('appointment_followups', id, 'followups')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 sm:px-6 py-4 font-medium transition-colors whitespace-nowrap ${
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
        <p className="text-gray-700">{appointment.appointment_type?.description}</p>
      </div>

      {appointment.notes && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{appointment.notes}</p>
        </div>
      )}

      {(appointment.appointment_type?.preparation_tips?.length ?? 0) > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Preparation Tips</h3>
          <ul className="space-y-2">
            {(appointment.appointment_type?.preparation_tips ?? []).map((tip, idx) => (
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
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

interface ObservationsTabProps {
  observations: Observation[];
  onAdd: (item: NewObservation) => Promise<boolean>;
  onDelete: (id: string) => void;
}

function ObservationsTab({ observations, onAdd, onDelete }: ObservationsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NewObservation>({
    category: 'behavior',
    observation: '',
    date_observed: localToday(),
    frequency: 'occasionally',
    concern_level: 'mild'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Keep the form (and what was typed) if saving failed
    if (!(await onAdd(formData))) return;
    setFormData({
      category: 'behavior',
      observation: '',
      date_observed: localToday(),
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
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Observation'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointment-prep-category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select id="appointment-prep-category"
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
              <label htmlFor="appointment-prep-date-observed" className="block text-sm font-medium text-gray-700 mb-2">Date Observed</label>
              <input id="appointment-prep-date-observed"
                type="date"
                value={formData.date_observed ?? ""}
                onChange={(e) => setFormData({ ...formData, date_observed: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="appointment-prep-observation" className="block text-sm font-medium text-gray-700 mb-2">Observation</label>
            <textarea id="appointment-prep-observation"
              value={formData.observation}
              onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what you observed..."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointment-prep-frequency" className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select id="appointment-prep-frequency"
                value={formData.frequency ?? ""}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="appointment-prep-concern-level" className="block text-sm font-medium text-gray-700 mb-2">Concern Level</label>
              <select id="appointment-prep-concern-level"
                value={formData.concern_level ?? ""}
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
            className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors"
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
                aria-label="Delete observation"
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

interface QuestionsTabProps {
  questions: Question[];
  onAdd: (item: NewQuestion) => Promise<boolean>;
  onDelete: (id: string) => void;
}

function QuestionsTab({ questions, onAdd, onDelete }: QuestionsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NewQuestion>({
    question: '',
    priority: 'medium',
    answered: false,
    answer: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Keep the form (and what was typed) if saving failed
    if (!(await onAdd(formData))) return;
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
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Question'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label htmlFor="appointment-prep-question" className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea id="appointment-prep-question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="What do you want to ask?"
              required
            />
          </div>
          <div>
            <label htmlFor="appointment-prep-priority" className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select id="appointment-prep-priority"
              value={formData.priority ?? ""}
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
            className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors"
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
                aria-label="Delete question"
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

interface DocumentsTabProps {
  documents: Document[];
  onAdd: (item: NewDocument) => Promise<boolean>;
  onDelete: (id: string) => void;
}

function DocumentsTab({ documents, onAdd, onDelete }: DocumentsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NewDocument>({
    document_type: 'medical_records',
    document_name: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Keep the form (and what was typed) if saving failed
    if (!(await onAdd(formData))) return;
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
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Document'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label htmlFor="appointment-prep-document-type" className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select id="appointment-prep-document-type"
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
            <label htmlFor="appointment-prep-document-name" className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
            <input id="appointment-prep-document-name"
              type="text"
              value={formData.document_name}
              onChange={(e) => setFormData({ ...formData, document_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Speech evaluation from Dr. Smith"
              required
            />
          </div>
          <div>
            <label htmlFor="appointment-prep-notes-2" className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea id="appointment-prep-notes-2"
              value={formData.notes ?? ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors"
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
              aria-label="Delete document"
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

interface FollowupTabProps {
  followups: Followup[];
  onAdd: (item: NewFollowup) => Promise<boolean>;
  onDelete: (id: string) => void;
}

function FollowupTab({ followups, onAdd, onDelete }: FollowupTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NewFollowup>({
    followup_item: '',
    due_date: '',
    completed: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Keep the form (and what was typed) if saving failed
    if (!(await onAdd(formData))) return;
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
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <label htmlFor="appointment-prep-task" className="block text-sm font-medium text-gray-700 mb-2">Task</label>
            <input id="appointment-prep-task"
              type="text"
              value={formData.followup_item}
              onChange={(e) => setFormData({ ...formData, followup_item: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Schedule follow-up appointment"
              required
            />
          </div>
          <div>
            <label htmlFor="appointment-prep-due-date" className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input id="appointment-prep-due-date"
              type="date"
              value={formData.due_date ?? ""}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors"
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
              aria-label="Delete task"
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