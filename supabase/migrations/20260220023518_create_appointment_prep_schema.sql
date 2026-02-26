/*
  # Create Appointment Preparation Schema

  1. New Tables
    - `appointment_types`
      - `id` (uuid, primary key)
      - `name` (text) - Type of appointment (Pediatrician, Developmental Pediatrician, etc.)
      - `description` (text) - Description of this appointment type
      - `icon` (text) - Icon identifier
      - `typical_duration` (integer) - Typical duration in minutes
      - `preparation_tips` (text[]) - Array of preparation tips
      - `created_at` (timestamptz)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User who created the appointment
      - `child_name` (text) - Name of child
      - `appointment_type_id` (uuid, foreign key to appointment_types)
      - `appointment_date` (timestamptz) - Date and time of appointment
      - `provider_name` (text) - Name of doctor/therapist
      - `location` (text) - Appointment location
      - `notes` (text) - General notes
      - `completed` (boolean) - Whether appointment is completed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `appointment_observations`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `category` (text) - Category (behavior, communication, motor skills, etc.)
      - `observation` (text) - The observation text
      - `date_observed` (date) - When this was observed
      - `frequency` (text) - How often (daily, weekly, occasionally, rarely)
      - `concern_level` (text) - mild, moderate, high
      - `created_at` (timestamptz)
    
    - `appointment_questions`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `question` (text) - Question to ask
      - `priority` (text) - high, medium, low
      - `answered` (boolean) - Whether question was answered
      - `answer` (text) - Answer received
      - `created_at` (timestamptz)
    
    - `appointment_documents`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `document_type` (text) - Type of document (previous_report, insurance, etc.)
      - `document_name` (text) - Name of document
      - `notes` (text) - Notes about this document
      - `created_at` (timestamptz)
    
    - `appointment_followups`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `followup_item` (text) - What needs to be followed up
      - `due_date` (date) - When this should be done by
      - `completed` (boolean) - Whether completed
      - `completed_at` (timestamptz) - When completed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own appointments and related data
    - Public read access to appointment_types
*/

-- Create appointment_types table
CREATE TABLE IF NOT EXISTS appointment_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'calendar',
  typical_duration integer DEFAULT 60,
  preparation_tips text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view appointment types"
  ON appointment_types FOR SELECT
  TO public
  USING (true);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  child_name text NOT NULL,
  appointment_type_id uuid REFERENCES appointment_types(id) ON DELETE SET NULL,
  appointment_date timestamptz NOT NULL,
  provider_name text DEFAULT '',
  location text DEFAULT '',
  notes text DEFAULT '',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create appointment_observations table
CREATE TABLE IF NOT EXISTS appointment_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  category text NOT NULL,
  observation text NOT NULL,
  date_observed date DEFAULT CURRENT_DATE,
  frequency text DEFAULT 'occasionally',
  concern_level text DEFAULT 'mild',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view observations for own appointments"
  ON appointment_observations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_observations.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert observations for own appointments"
  ON appointment_observations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_observations.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update observations for own appointments"
  ON appointment_observations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_observations.appointment_id
      AND appointments.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_observations.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete observations for own appointments"
  ON appointment_observations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_observations.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

-- Create appointment_questions table
CREATE TABLE IF NOT EXISTS appointment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  question text NOT NULL,
  priority text DEFAULT 'medium',
  answered boolean DEFAULT false,
  answer text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view questions for own appointments"
  ON appointment_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_questions.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert questions for own appointments"
  ON appointment_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_questions.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions for own appointments"
  ON appointment_questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_questions.appointment_id
      AND appointments.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_questions.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions for own appointments"
  ON appointment_questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_questions.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

-- Create appointment_documents table
CREATE TABLE IF NOT EXISTS appointment_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_name text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents for own appointments"
  ON appointment_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_documents.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents for own appointments"
  ON appointment_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_documents.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents for own appointments"
  ON appointment_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_documents.appointment_id
      AND appointments.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_documents.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents for own appointments"
  ON appointment_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_documents.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

-- Create appointment_followups table
CREATE TABLE IF NOT EXISTS appointment_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  followup_item text NOT NULL,
  due_date date,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view followups for own appointments"
  ON appointment_followups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_followups.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert followups for own appointments"
  ON appointment_followups FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_followups.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update followups for own appointments"
  ON appointment_followups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_followups.appointment_id
      AND appointments.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_followups.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete followups for own appointments"
  ON appointment_followups FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_followups.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointment_observations_appointment_id ON appointment_observations(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_questions_appointment_id ON appointment_questions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_documents_appointment_id ON appointment_documents(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_followups_appointment_id ON appointment_followups(appointment_id);