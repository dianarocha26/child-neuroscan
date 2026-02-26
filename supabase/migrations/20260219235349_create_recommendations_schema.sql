/*
  # Create Recommendations Schema
  
  ## Overview
  Creates tables for storing comprehensive developmental recommendations including
  therapies, exercises, interventions, and nutritional guidance for each condition.
  
  ## New Tables
  
  ### 1. `recommendation_categories`
  Categories for organizing recommendations
  - `id` (uuid, primary key)
  - `code` (text, unique)
  - `name_en` (text)
  - `name_es` (text)
  - `icon` (text)
  - `order_index` (integer)
  - `created_at` (timestamptz)
  
  ### 2. `recommendations`
  Individual recommendations for conditions
  - `id` (uuid, primary key)
  - `condition_id` (uuid, foreign key)
  - `category_id` (uuid, foreign key)
  - `title_en` (text)
  - `title_es` (text)
  - `description_en` (text)
  - `description_es` (text)
  - `priority` (integer) - 1=high, 2=medium, 3=low
  - `risk_levels` (text[]) - which risk levels this applies to
  - `age_min_months` (integer)
  - `age_max_months` (integer)
  - `created_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Public read access for recommendations
*/

-- Create recommendation_categories table
CREATE TABLE IF NOT EXISTS recommendation_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_es text NOT NULL,
  icon text NOT NULL DEFAULT 'clipboard',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id uuid NOT NULL REFERENCES conditions(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES recommendation_categories(id) ON DELETE CASCADE,
  title_en text NOT NULL,
  title_es text NOT NULL,
  description_en text NOT NULL,
  description_es text NOT NULL,
  priority integer NOT NULL DEFAULT 2,
  risk_levels text[] NOT NULL DEFAULT '{"low","moderate","high"}',
  age_min_months integer DEFAULT 0,
  age_max_months integer DEFAULT 216,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_condition ON recommendations(condition_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON recommendations(category_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON recommendations(priority);

-- Enable RLS
ALTER TABLE recommendation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view recommendation categories"
  ON recommendation_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view recommendations"
  ON recommendations FOR SELECT
  TO public
  USING (true);

-- Insert recommendation categories
INSERT INTO recommendation_categories (code, name_en, name_es, icon, order_index) VALUES
('therapy', 'Professional Therapies', 'Terapias Profesionales', 'stethoscope', 1),
('exercises', 'Home Exercises & Activities', 'Ejercicios y Actividades en Casa', 'activity', 2),
('education', 'Educational Support', 'Apoyo Educativo', 'book-open', 3),
('nutrition', 'Nutrition & Diet', 'Nutrición y Dieta', 'apple', 4),
('behavioral', 'Behavioral Strategies', 'Estrategias de Comportamiento', 'brain', 5),
('social', 'Social Skills Development', 'Desarrollo de Habilidades Sociales', 'users', 6),
('technology', 'Assistive Technology', 'Tecnología de Asistencia', 'tablet', 7),
('family', 'Family Support & Resources', 'Apoyo Familiar y Recursos', 'heart', 8)
ON CONFLICT (code) DO NOTHING;
