import { supabase } from '../supabase';
import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { check, requireUserId, unwrapList } from './client';

// Allowed values match the CHECK constraints in
// 20260220024526_create_medication_tracker_schema.sql.
export type MedicationType = 'medication' | 'supplement' | 'vitamin';
export type MedicationLogStatus = 'taken' | 'missed' | 'skipped';

export type Medication = Omit<Tables<'medications'>, 'type'> & { type: MedicationType };
export type MedicationLog = Omit<Tables<'medication_logs'>, 'status'> & { status: MedicationLogStatus };

/** Medication fields the user edits; user_id is added here. */
export type MedicationInput = Omit<TablesInsert<'medications'>, 'user_id' | 'id' | 'created_at' | 'type'> & {
  type: MedicationType;
};

export type MedicationChanges = Omit<TablesUpdate<'medications'>, 'type'> & Partial<Pick<Medication, 'type'>>;

/** Log fields the user edits; medication_id and user_id are added here. */
export type MedicationLogInput = Omit<
  TablesInsert<'medication_logs'>,
  'user_id' | 'id' | 'medication_id' | 'logged_at' | 'status' | 'taken_at' | 'scheduled_time'
> & { status: MedicationLogStatus };

const toMedication = (row: Tables<'medications'>): Medication => ({
  ...row,
  type: row.type as MedicationType
});

const toMedicationLog = (row: Tables<'medication_logs'>): MedicationLog => ({
  ...row,
  status: row.status as MedicationLogStatus
});

export async function listMedications(): Promise<Medication[]> {
  const userId = await requireUserId();
  const rows = unwrapList(
    await supabase.from('medications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    'load medications'
  );
  return rows.map(toMedication);
}

export async function listMedicationLogs(medicationId: string): Promise<MedicationLog[]> {
  const rows = unwrapList(
    await supabase
      .from('medication_logs')
      .select('*')
      .eq('medication_id', medicationId)
      .order('taken_at', { ascending: false })
      .limit(30),
    'load dose logs'
  );
  return rows.map(toMedicationLog);
}

export async function createMedication(input: MedicationInput): Promise<void> {
  const userId = await requireUserId();
  check(await supabase.from('medications').insert({ ...input, user_id: userId }), 'save the medication');
}

export async function updateMedication(id: string, changes: MedicationChanges): Promise<void> {
  check(await supabase.from('medications').update(changes).eq('id', id), 'save the medication');
}

export async function setMedicationActive(id: string, active: boolean): Promise<void> {
  check(await supabase.from('medications').update({ active }).eq('id', id), 'update the medication status');
}

export async function deleteMedication(id: string): Promise<void> {
  check(await supabase.from('medications').delete().eq('id', id), 'delete the medication');
}

export async function logMedicationDose(medicationId: string, input: MedicationLogInput): Promise<void> {
  const userId = await requireUserId();
  check(
    await supabase.from('medication_logs').insert({
      medication_id: medicationId,
      user_id: userId,
      taken_at: new Date().toISOString(),
      scheduled_time: new Date().toTimeString().slice(0, 5),
      ...input
    }),
    'log the dose'
  );
}
