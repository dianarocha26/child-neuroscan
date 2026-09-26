import { supabase } from '../supabase';
import type { Tables, TablesInsert } from '../../types/supabase';
import { check, unwrap, unwrapList } from './client';

export type AppointmentType = Tables<'appointment_types'>;
export type Observation = Tables<'appointment_observations'>;
export type Question = Tables<'appointment_questions'>;
export type Document = Tables<'appointment_documents'>;
export type Followup = Tables<'appointment_followups'>;

export interface Appointment extends Tables<'appointments'> {
  appointment_type: AppointmentType | null;
  observations: Observation[];
  questions: Question[];
  documents: Document[];
  followups: Followup[];
}

// The child tables an appointment item can be deleted from.
export type AppointmentChildTable =
  | 'appointment_observations'
  | 'appointment_questions'
  | 'appointment_documents'
  | 'appointment_followups';

// Shapes used by the "add item" forms, before the row has an id/appointment_id/created_at.
export type NewObservation = Pick<Observation, 'category' | 'observation' | 'date_observed' | 'frequency' | 'concern_level'>;
export type NewQuestion = Pick<Question, 'question' | 'priority' | 'answered' | 'answer'>;
export type NewDocument = Pick<Document, 'document_type' | 'document_name' | 'notes'>;
export type NewFollowup = Pick<Followup, 'followup_item' | 'due_date' | 'completed'>;

/** Fields the appointment create/edit form collects. */
export type AppointmentFormInput = Pick<
  TablesInsert<'appointments'>,
  'child_name' | 'appointment_type_id' | 'appointment_date' | 'provider_name' | 'location' | 'notes'
>;

const APPOINTMENT_WITH_CHILDREN = `
  *,
  appointment_type:appointment_types(*),
  observations:appointment_observations(*),
  questions:appointment_questions(*),
  documents:appointment_documents(*),
  followups:appointment_followups(*)
`;

export async function listAppointmentTypes(): Promise<AppointmentType[]> {
  return unwrapList(await supabase.from('appointment_types').select('*').order('name'), 'load appointment types');
}

export async function listAppointments(userId: string): Promise<Appointment[]> {
  return unwrapList(
    await supabase
      .from('appointments')
      .select(APPOINTMENT_WITH_CHILDREN)
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true }),
    'load appointments'
  );
}

export async function createAppointment(userId: string, input: AppointmentFormInput): Promise<Appointment> {
  return unwrap(
    await supabase
      .from('appointments')
      .insert({ user_id: userId, ...input })
      .select(APPOINTMENT_WITH_CHILDREN)
      .single(),
    'create the appointment'
  );
}

export async function updateAppointment(id: string, input: AppointmentFormInput): Promise<Appointment> {
  return unwrap(
    await supabase
      .from('appointments')
      .update(input)
      .eq('id', id)
      .select(APPOINTMENT_WITH_CHILDREN)
      .single(),
    'update the appointment'
  );
}

export async function deleteAppointment(id: string): Promise<void> {
  check(await supabase.from('appointments').delete().eq('id', id), 'delete the appointment');
}

export async function addObservation(appointmentId: string, observation: NewObservation): Promise<Observation> {
  return unwrap(
    await supabase
      .from('appointment_observations')
      .insert({ appointment_id: appointmentId, ...observation })
      .select()
      .single(),
    'add the observation'
  );
}

export async function addQuestion(appointmentId: string, question: NewQuestion): Promise<Question> {
  return unwrap(
    await supabase
      .from('appointment_questions')
      .insert({ appointment_id: appointmentId, question: question.question, priority: question.priority })
      .select()
      .single(),
    'add the question'
  );
}

export async function addDocument(appointmentId: string, doc: NewDocument): Promise<Document> {
  return unwrap(
    await supabase
      .from('appointment_documents')
      .insert({ appointment_id: appointmentId, ...doc })
      .select()
      .single(),
    'add the document'
  );
}

export async function addFollowup(appointmentId: string, followup: NewFollowup): Promise<Followup> {
  return unwrap(
    await supabase
      .from('appointment_followups')
      .insert({ appointment_id: appointmentId, ...followup, due_date: followup.due_date || null })
      .select()
      .single(),
    'add the follow-up task'
  );
}

export async function deleteAppointmentItem(table: AppointmentChildTable, id: string): Promise<void> {
  check(await supabase.from(table).delete().eq('id', id), 'delete the item');
}
