/*
  # Create Report Generation System

  ## Overview
  This migration creates tables to support PDF report generation for medical, educational,
  therapy, and crisis documentation. Parents can generate comprehensive reports to share
  with healthcare providers, schools, therapists, and insurance companies.

  ## New Tables
  
  ### `report_templates`
  Defines different report types and their configurations
  - `id` (uuid, primary key)
  - `name` (text) - e.g., 'Medical Report', 'Educational Report', 'Therapy Progress'
  - `description` (text)
  - `template_type` (text) - 'medical', 'educational', 'therapy', 'crisis'
  - `sections` (jsonb) - array of section configurations
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### `generated_reports`
  Stores metadata about generated reports
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `template_id` (uuid, references report_templates)
  - `report_type` (text)
  - `title` (text)
  - `date_range_start` (date)
  - `date_range_end` (date)
  - `generated_at` (timestamptz)
  - `report_data` (jsonb) - compiled data for the report
  - `notes` (text) - user's additional notes for the report

  ### `report_sections_config`
  Configuration for customizable report sections
  - `id` (uuid, primary key)
  - `template_id` (uuid, references report_templates)
  - `section_name` (text)
  - `section_order` (integer)
  - `data_sources` (jsonb) - which tables/queries to pull data from
  - `display_settings` (jsonb) - formatting and display options
  - `is_required` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all report tables
  - Users can only generate and view their own reports
  - Report templates are publicly readable but only admins can modify

  ## Notes
  - Reports compile data from behavior_diary, medication_tracker, goals, milestones, etc.
  - The report_data jsonb field stores pre-compiled data for fast PDF generation
  - Users can customize which sections to include in their reports
*/

-- Create report_templates table
CREATE TABLE IF NOT EXISTS report_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  template_type text NOT NULL,
  sections jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active report templates"
  ON report_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create generated_reports table
CREATE TABLE IF NOT EXISTS generated_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES report_templates(id) ON DELETE SET NULL,
  report_type text NOT NULL,
  title text NOT NULL,
  date_range_start date NOT NULL,
  date_range_end date NOT NULL,
  generated_at timestamptz DEFAULT now(),
  report_data jsonb DEFAULT '{}'::jsonb,
  notes text DEFAULT ''
);

ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generated reports"
  ON generated_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated reports"
  ON generated_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated reports"
  ON generated_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated reports"
  ON generated_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create report_sections_config table
CREATE TABLE IF NOT EXISTS report_sections_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES report_templates(id) ON DELETE CASCADE NOT NULL,
  section_name text NOT NULL,
  section_order integer DEFAULT 0,
  data_sources jsonb DEFAULT '[]'::jsonb,
  display_settings jsonb DEFAULT '{}'::jsonb,
  is_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE report_sections_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view report section configs"
  ON report_sections_config FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_generated_reports_user_id ON generated_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_reports_template_id ON generated_reports(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_reports_dates ON generated_reports(date_range_start, date_range_end);
CREATE INDEX IF NOT EXISTS idx_report_sections_template_id ON report_sections_config(template_id);