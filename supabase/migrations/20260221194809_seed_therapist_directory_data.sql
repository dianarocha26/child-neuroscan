/*
  # Seed Therapist Directory Data

  Populate insurance providers and sample therapist profiles
*/

-- Insert insurance providers
INSERT INTO insurance_providers (provider_name, provider_type, website_url, phone_number)
VALUES
  ('Aetna', 'private', 'https://www.aetna.com', '1-800-872-3862'),
  ('Blue Cross Blue Shield', 'private', 'https://www.bcbs.com', '1-888-630-2583'),
  ('Cigna', 'private', 'https://www.cigna.com', '1-800-244-6224'),
  ('UnitedHealthcare', 'private', 'https://www.uhc.com', '1-866-414-1959'),
  ('Humana', 'private', 'https://www.humana.com', '1-800-448-6262'),
  ('Kaiser Permanente', 'hmo', 'https://www.kp.org', '1-800-464-4000'),
  ('Medicaid', 'government', 'https://www.medicaid.gov', '1-877-267-2323'),
  ('Medicare', 'government', 'https://www.medicare.gov', '1-800-633-4227'),
  ('Tricare', 'military', 'https://www.tricare.mil', '1-877-874-2273')
ON CONFLICT (provider_name) DO NOTHING;

-- Insert sample therapist profiles
INSERT INTO therapist_profiles (
  full_name, credentials, specialties, therapy_type, years_experience, biography,
  languages_spoken, city, state, phone_number, email, accepts_new_clients,
  offers_telehealth, age_groups_served, is_verified
)
VALUES
  (
    'Dr. Sarah Martinez',
    'PhD, BCBA-D',
    ARRAY['ASD', 'Behavioral Therapy', 'Early Intervention'],
    'ABA Therapist',
    12,
    'Board Certified Behavior Analyst specializing in autism spectrum disorders with extensive experience in early intervention programs.',
    ARRAY['English', 'Spanish'],
    'Los Angeles',
    'CA',
    '310-555-0123',
    'smartinez@example.com',
    true,
    true,
    ARRAY['Toddlers', 'Preschool', 'School Age'],
    true
  ),
  (
    'Jennifer Thompson',
    'MS, CCC-SLP',
    ARRAY['Speech Delay', 'Language Disorders', 'Apraxia'],
    'Speech Therapist',
    8,
    'Certified speech-language pathologist with focus on pediatric communication disorders and feeding therapy.',
    ARRAY['English'],
    'Austin',
    'TX',
    '512-555-0456',
    'jthompson@example.com',
    true,
    false,
    ARRAY['Infants', 'Toddlers', 'Preschool'],
    true
  ),
  (
    'Michael Chen',
    'OTR/L',
    ARRAY['Sensory Processing', 'Fine Motor', 'Self-Care Skills'],
    'Occupational Therapist',
    10,
    'Occupational therapist specializing in sensory integration and fine motor development for children with developmental delays.',
    ARRAY['English', 'Mandarin'],
    'Seattle',
    'WA',
    '206-555-0789',
    'mchen@example.com',
    true,
    true,
    ARRAY['Toddlers', 'Preschool', 'School Age'],
    true
  ),
  (
    'Dr. Emily Rodriguez',
    'PsyD',
    ARRAY['ADHD', 'Anxiety', 'Behavioral Issues'],
    'Clinical Psychologist',
    15,
    'Licensed clinical psychologist with expertise in neurodevelopmental disorders and evidence-based behavioral interventions.',
    ARRAY['English', 'Spanish'],
    'Miami',
    'FL',
    '305-555-0234',
    'erodriguez@example.com',
    false,
    true,
    ARRAY['Preschool', 'School Age', 'Adolescents'],
    true
  ),
  (
    'Amanda Williams',
    'PT, DPT',
    ARRAY['Gross Motor Delay', 'Coordination', 'Strength Training'],
    'Physical Therapist',
    7,
    'Pediatric physical therapist focused on helping children reach their gross motor milestones through play-based therapy.',
    ARRAY['English'],
    'Chicago',
    'IL',
    '312-555-0567',
    'awilliams@example.com',
    true,
    false,
    ARRAY['Infants', 'Toddlers', 'Preschool'],
    true
  );

-- Link therapists to specializations
INSERT INTO therapist_specializations (therapist_id, condition_name)
SELECT tp.id, unnest(ARRAY['Autism Spectrum Disorder (ASD)', 'Developmental Delay'])
FROM therapist_profiles tp
WHERE tp.full_name = 'Dr. Sarah Martinez';

INSERT INTO therapist_specializations (therapist_id, condition_name)
SELECT tp.id, unnest(ARRAY['Speech and Language Delay', 'Developmental Delay'])
FROM therapist_profiles tp
WHERE tp.full_name = 'Jennifer Thompson';

INSERT INTO therapist_specializations (therapist_id, condition_name)
SELECT tp.id, unnest(ARRAY['Sensory Processing Disorder', 'Fine Motor Delay'])
FROM therapist_profiles tp
WHERE tp.full_name = 'Michael Chen';

INSERT INTO therapist_specializations (therapist_id, condition_name)
SELECT tp.id, unnest(ARRAY['ADHD', 'Anxiety Disorders'])
FROM therapist_profiles tp
WHERE tp.full_name = 'Dr. Emily Rodriguez';

INSERT INTO therapist_specializations (therapist_id, condition_name)
SELECT tp.id, unnest(ARRAY['Gross Motor Delay', 'Developmental Delay'])
FROM therapist_profiles tp
WHERE tp.full_name = 'Amanda Williams';

-- Link therapists to insurance
INSERT INTO therapist_insurance (therapist_id, insurance_provider_id)
SELECT tp.id, ip.id
FROM therapist_profiles tp
CROSS JOIN insurance_providers ip
WHERE tp.full_name = 'Dr. Sarah Martinez'
AND ip.provider_name IN ('Aetna', 'Blue Cross Blue Shield', 'UnitedHealthcare', 'Medicaid');

INSERT INTO therapist_insurance (therapist_id, insurance_provider_id)
SELECT tp.id, ip.id
FROM therapist_profiles tp
CROSS JOIN insurance_providers ip
WHERE tp.full_name = 'Jennifer Thompson'
AND ip.provider_name IN ('Blue Cross Blue Shield', 'Cigna', 'Medicaid');

INSERT INTO therapist_insurance (therapist_id, insurance_provider_id)
SELECT tp.id, ip.id
FROM therapist_profiles tp
CROSS JOIN insurance_providers ip
WHERE tp.full_name = 'Michael Chen'
AND ip.provider_name IN ('Aetna', 'UnitedHealthcare', 'Kaiser Permanente');

INSERT INTO therapist_insurance (therapist_id, insurance_provider_id)
SELECT tp.id, ip.id
FROM therapist_profiles tp
CROSS JOIN insurance_providers ip
WHERE tp.full_name = 'Dr. Emily Rodriguez'
AND ip.provider_name IN ('All major insurance', 'Medicaid', 'Medicare');

INSERT INTO therapist_insurance (therapist_id, insurance_provider_id)
SELECT tp.id, ip.id
FROM therapist_profiles tp
CROSS JOIN insurance_providers ip
WHERE tp.full_name = 'Amanda Williams'
AND ip.provider_name IN ('Blue Cross Blue Shield', 'UnitedHealthcare', 'Tricare');