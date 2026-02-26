/*
  # Enhanced Therapist Directory

  1. New Tables
    - therapist_profiles: Detailed therapist information
    - therapist_reviews: User reviews and ratings
    - therapist_availability: Schedule and availability slots
    - therapist_specializations: Link therapists to conditions they treat
    - insurance_providers: List of insurance companies
    - therapist_insurance: Link therapists to accepted insurance

  2. Security
    - Therapist profiles are publicly viewable
    - Only authenticated users can leave reviews
    - Therapists can manage their own profiles (future enhancement)
*/

CREATE TABLE IF NOT EXISTS insurance_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL UNIQUE,
  provider_type text NOT NULL,
  website_url text,
  phone_number text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS therapist_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  credentials text NOT NULL,
  specialties text[] DEFAULT '{}',
  therapy_type text NOT NULL,
  years_experience integer NOT NULL,
  biography text,
  languages_spoken text[] DEFAULT ARRAY['English'],
  office_address text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  phone_number text,
  email text,
  website_url text,
  accepts_new_clients boolean DEFAULT true,
  offers_telehealth boolean DEFAULT false,
  age_groups_served text[] DEFAULT '{}',
  average_rating numeric(3, 2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  profile_image_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS therapist_specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES therapist_profiles ON DELETE CASCADE NOT NULL,
  condition_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(therapist_id, condition_name)
);

CREATE TABLE IF NOT EXISTS therapist_insurance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES therapist_profiles ON DELETE CASCADE NOT NULL,
  insurance_provider_id uuid REFERENCES insurance_providers ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(therapist_id, insurance_provider_id)
);

CREATE TABLE IF NOT EXISTS therapist_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES therapist_profiles ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title text,
  review_text text,
  would_recommend boolean DEFAULT true,
  is_verified_patient boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(therapist_id, user_id)
);

CREATE TABLE IF NOT EXISTS therapist_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES therapist_profiles ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_availability ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view insurance providers"
  ON insurance_providers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view therapist profiles"
  ON therapist_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view therapist specializations"
  ON therapist_specializations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view therapist insurance"
  ON therapist_insurance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view therapist reviews"
  ON therapist_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view therapist availability"
  ON therapist_availability FOR SELECT
  TO authenticated
  USING (true);

-- Review policies
CREATE POLICY "Users can create own reviews"
  ON therapist_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON therapist_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON therapist_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update average rating
CREATE OR REPLACE FUNCTION update_therapist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE therapist_profiles
  SET 
    average_rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM therapist_reviews
      WHERE therapist_id = COALESCE(NEW.therapist_id, OLD.therapist_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM therapist_reviews
      WHERE therapist_id = COALESCE(NEW.therapist_id, OLD.therapist_id)
    )
  WHERE id = COALESCE(NEW.therapist_id, OLD.therapist_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ratings
DROP TRIGGER IF EXISTS update_therapist_rating_trigger ON therapist_reviews;
CREATE TRIGGER update_therapist_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON therapist_reviews
FOR EACH ROW
EXECUTE FUNCTION update_therapist_rating();