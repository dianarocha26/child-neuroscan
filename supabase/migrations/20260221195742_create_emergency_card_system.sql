/*
  # Emergency Information Card System

  Generate printable/shareable emergency cards for caregivers, schools, babysitters

  1. New Tables
    - emergency_cards: Main card information
    - emergency_protocols: Specific protocols for different situations

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS emergency_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  child_name text NOT NULL,
  child_photo_url text,
  date_of_birth date NOT NULL,
  
  -- Medical Information
  primary_diagnosis text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  medications text[] DEFAULT '{}',
  medical_conditions text[] DEFAULT '{}',
  dietary_restrictions text[] DEFAULT '{}',
  
  -- Communication
  communication_level text NOT NULL,
  communication_methods text[] DEFAULT '{}',
  can_state_name boolean DEFAULT false,
  can_state_address boolean DEFAULT false,
  can_call_for_help boolean DEFAULT false,
  communication_notes text,
  
  -- Behavioral Information
  common_triggers text[] DEFAULT '{}',
  calming_techniques text[] DEFAULT '{}',
  warning_signs text[] DEFAULT '{}',
  sensory_sensitivities text[] DEFAULT '{}',
  
  -- Emergency Contacts
  parent1_name text,
  parent1_phone text,
  parent1_relationship text,
  parent2_name text,
  parent2_phone text,
  parent2_relationship text,
  emergency_contact1_name text,
  emergency_contact1_phone text,
  emergency_contact1_relationship text,
  emergency_contact2_name text,
  emergency_contact2_phone text,
  emergency_contact2_relationship text,
  
  -- Medical Providers
  primary_doctor_name text,
  primary_doctor_phone text,
  therapist_name text,
  therapist_phone text,
  hospital_preference text,
  
  -- Additional Information
  special_instructions text,
  safe_spaces text[] DEFAULT '{}',
  favorite_items text[] DEFAULT '{}',
  things_to_avoid text[] DEFAULT '{}',
  
  -- Card Settings
  card_version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emergency_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES emergency_cards ON DELETE CASCADE NOT NULL,
  situation_type text NOT NULL,
  protocol_title text NOT NULL,
  steps text[] NOT NULL,
  when_to_call_911 text[] DEFAULT '{}',
  important_notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emergency_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_protocols ENABLE ROW LEVEL SECURITY;

-- Policies for emergency_cards
CREATE POLICY "Users can view own emergency cards"
  ON emergency_cards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own emergency cards"
  ON emergency_cards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency cards"
  ON emergency_cards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency cards"
  ON emergency_cards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for emergency_protocols
CREATE POLICY "Users can view own emergency protocols"
  ON emergency_protocols FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM emergency_cards
    WHERE emergency_cards.id = emergency_protocols.card_id
    AND emergency_cards.user_id = auth.uid()
  ));

CREATE POLICY "Users can create own emergency protocols"
  ON emergency_protocols FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM emergency_cards
    WHERE emergency_cards.id = emergency_protocols.card_id
    AND emergency_cards.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own emergency protocols"
  ON emergency_protocols FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM emergency_cards
    WHERE emergency_cards.id = emergency_protocols.card_id
    AND emergency_cards.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM emergency_cards
    WHERE emergency_cards.id = emergency_protocols.card_id
    AND emergency_cards.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own emergency protocols"
  ON emergency_protocols FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM emergency_cards
    WHERE emergency_cards.id = emergency_protocols.card_id
    AND emergency_cards.user_id = auth.uid()
  ));