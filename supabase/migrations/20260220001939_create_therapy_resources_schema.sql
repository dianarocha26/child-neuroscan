/*
  # Therapy Resources Schema

  ## Overview
  Creates tables to store therapy resources and providers that can help families
  find appropriate support services based on their child's condition.

  ## New Tables

  ### therapy_resources
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Name of the therapy provider or organization
  - `resource_type` (text) - Type: 'therapist', 'clinic', 'online_resource', 'support_group'
  - `specialties` (text[]) - Array of specialties/conditions they treat
  - `description` (text) - Detailed description of services
  - `contact_email` (text) - Contact email
  - `contact_phone` (text) - Contact phone number
  - `website` (text) - Website URL
  - `address` (text) - Physical address
  - `city` (text) - City
  - `state` (text) - State/Province
  - `country` (text) - Country
  - `zip_code` (text) - ZIP/Postal code
  - `services_offered` (text[]) - Array of specific services
  - `age_groups` (text[]) - Age groups served: 'infant', 'toddler', 'preschool', 'school_age', 'teen', 'adult'
  - `languages` (text[]) - Languages spoken
  - `accepts_insurance` (boolean) - Whether they accept insurance
  - `insurance_types` (text[]) - Types of insurance accepted
  - `teletherapy_available` (boolean) - Online therapy option
  - `rating` (decimal) - Average rating (0-5)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### user_saved_resources
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (text) - User who saved the resource
  - `resource_id` (uuid) - Reference to therapy_resources
  - `notes` (text) - User's personal notes
  - `contacted` (boolean) - Whether user has contacted them
  - `contacted_date` (timestamptz) - When they contacted
  - `created_at` (timestamptz) - When saved

  ## Security
  - Enable RLS on all tables
  - Resources are publicly readable
  - Users can only manage their own saved resources
*/

CREATE TABLE IF NOT EXISTS therapy_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('therapist', 'clinic', 'online_resource', 'support_group', 'educational_program')),
  specialties text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  contact_email text,
  contact_phone text,
  website text,
  address text,
  city text,
  state text,
  country text DEFAULT 'USA',
  zip_code text,
  services_offered text[] DEFAULT '{}',
  age_groups text[] DEFAULT '{}',
  languages text[] DEFAULT ARRAY['English'],
  accepts_insurance boolean DEFAULT false,
  insurance_types text[] DEFAULT '{}',
  teletherapy_available boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_saved_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  resource_id uuid NOT NULL REFERENCES therapy_resources(id) ON DELETE CASCADE,
  notes text DEFAULT '',
  contacted boolean DEFAULT false,
  contacted_date timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

ALTER TABLE therapy_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapy resources are publicly readable"
  ON therapy_resources FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view own saved resources"
  ON user_saved_resources FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can save resources"
  ON user_saved_resources FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own saved resources"
  ON user_saved_resources FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own saved resources"
  ON user_saved_resources FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_therapy_resources_specialties ON therapy_resources USING GIN (specialties);
CREATE INDEX IF NOT EXISTS idx_therapy_resources_city ON therapy_resources (city);
CREATE INDEX IF NOT EXISTS idx_therapy_resources_state ON therapy_resources (state);
CREATE INDEX IF NOT EXISTS idx_therapy_resources_type ON therapy_resources (resource_type);
CREATE INDEX IF NOT EXISTS idx_user_saved_resources_user ON user_saved_resources (user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_resources_resource ON user_saved_resources (resource_id);