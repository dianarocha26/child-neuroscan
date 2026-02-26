/*
  # Seed Therapy Resources

  ## Overview
  Populates the therapy_resources table with sample data covering various
  types of therapy providers, clinics, online resources, and support groups
  for different conditions.

  ## Data Included
  - Autism specialists and ABA therapy centers
  - ADHD coaches and clinics
  - Speech-language pathologists
  - Occupational therapy clinics
  - Developmental pediatricians
  - Learning disorder specialists
  - Online therapy platforms
  - Parent support groups
  - Educational resources
*/

INSERT INTO therapy_resources (name, resource_type, specialties, description, contact_email, contact_phone, website, address, city, state, country, zip_code, services_offered, age_groups, languages, accepts_insurance, insurance_types, teletherapy_available, rating) VALUES

-- Autism Resources
('Bright Horizons ABA Therapy', 'clinic', ARRAY['asd'], 'Comprehensive ABA therapy center specializing in early intervention and school-age programs. Board-certified behavior analysts provide individualized treatment plans.', 'info@brighthorizonsaba.com', '(555) 123-4567', 'https://brighthorizonsaba.com', '123 Therapy Lane', 'Los Angeles', 'CA', 'USA', '90001', ARRAY['ABA Therapy', 'Early Intervention', 'Social Skills Training', 'Parent Training'], ARRAY['infant', 'toddler', 'preschool', 'school_age'], ARRAY['English', 'Spanish'], true, ARRAY['Blue Cross', 'Aetna', 'United Healthcare'], true, 4.8),

('Autism Speaks Resource Network', 'online_resource', ARRAY['asd'], 'National organization providing comprehensive autism resources, toolkits, and community connections. Free resource database and 24/7 helpline.', 'resources@autismspeaks.org', '(888) 288-4762', 'https://autismspeaks.org', NULL, 'New York', 'NY', 'USA', NULL, ARRAY['Resource Database', 'Family Support', 'Advocacy', 'Research Updates'], ARRAY['infant', 'toddler', 'preschool', 'school_age', 'teen', 'adult'], ARRAY['English', 'Spanish'], false, ARRAY[]::text[], true, 4.5),

('Spectrum Support Group', 'support_group', ARRAY['asd'], 'Monthly parent support group for families with children on the autism spectrum. Share experiences, strategies, and emotional support in a welcoming environment.', 'contact@spectrumsupport.org', '(555) 234-5678', 'https://spectrumsupport.org', '456 Community Center Dr', 'Chicago', 'IL', 'USA', '60601', ARRAY['Parent Support', 'Sibling Support', 'Family Events'], ARRAY['infant', 'toddler', 'preschool', 'school_age', 'teen'], ARRAY['English'], false, ARRAY[]::text[], false, 4.7),

-- ADHD Resources
('Focus Forward ADHD Center', 'clinic', ARRAY['adhd'], 'Specialized ADHD assessment and treatment center offering medication management, behavioral therapy, and executive function coaching for children and teens.', 'hello@focusforward.com', '(555) 345-6789', 'https://focusforward.com', '789 Medical Plaza', 'Boston', 'MA', 'USA', '02101', ARRAY['ADHD Assessment', 'Medication Management', 'Behavioral Therapy', 'Executive Function Coaching'], ARRAY['preschool', 'school_age', 'teen'], ARRAY['English'], true, ARRAY['Blue Cross', 'Cigna', 'Harvard Pilgrim'], true, 4.6),

('ADHD Coaches Online', 'online_resource', ARRAY['adhd'], 'Virtual ADHD coaching platform connecting families with certified coaches. Flexible scheduling and evidence-based strategies for managing ADHD symptoms.', 'support@adhdcoaches.com', '(555) 456-7890', 'https://adhdcoachesonline.com', NULL, 'Seattle', 'WA', 'USA', NULL, ARRAY['Individual Coaching', 'Parent Training', 'School Advocacy', 'Organization Skills'], ARRAY['school_age', 'teen', 'adult'], ARRAY['English', 'Spanish', 'Mandarin'], true, ARRAY['Most Major Insurance'], true, 4.4),

('CHADD Local Chapter', 'support_group', ARRAY['adhd'], 'Children and Adults with Attention-Deficit/Hyperactivity Disorder support group. Monthly meetings with expert speakers and peer support.', 'chapter@chadd.org', '(555) 567-8901', 'https://chadd.org/chapters', '321 Learning Center', 'Austin', 'TX', 'USA', '78701', ARRAY['Parent Education', 'Peer Support', 'Resource Sharing'], ARRAY['toddler', 'preschool', 'school_age', 'teen', 'adult'], ARRAY['English'], false, ARRAY[]::text[], false, 4.5),

-- Speech & Language Resources
('Clear Speech Therapy Center', 'clinic', ARRAY['speech'], 'Full-service speech-language pathology clinic treating articulation disorders, language delays, stuttering, and feeding difficulties.', 'appointments@clearspeech.com', '(555) 678-9012', 'https://clearspeech.com', '555 Healthcare Blvd', 'Miami', 'FL', 'USA', '33101', ARRAY['Speech Therapy', 'Language Therapy', 'Articulation', 'Feeding Therapy', 'Stuttering Treatment'], ARRAY['infant', 'toddler', 'preschool', 'school_age'], ARRAY['English', 'Spanish', 'French'], true, ARRAY['Blue Cross', 'Aetna', 'United Healthcare', 'Medicaid'], true, 4.9),

('Talk Path Therapy', 'online_resource', ARRAY['speech'], 'Teletherapy platform connecting families with licensed speech-language pathologists. Convenient online sessions with progress tracking.', 'info@talkpaththerapy.com', '(555) 789-0123', 'https://talkpaththerapy.com', NULL, 'San Francisco', 'CA', 'USA', NULL, ARRAY['Online Speech Therapy', 'Language Development', 'Parent Coaching'], ARRAY['toddler', 'preschool', 'school_age'], ARRAY['English', 'Spanish'], true, ARRAY['Most Major Insurance'], true, 4.3),

-- Developmental Delay Resources
('Milestone Developmental Center', 'clinic', ARRAY['developmental'], 'Multidisciplinary clinic providing comprehensive developmental assessments and interventions. Team includes pediatricians, therapists, and psychologists.', 'contact@milestonecenter.org', '(555) 890-1234', 'https://milestonecenter.org', '777 Child Development Way', 'Denver', 'CO', 'USA', '80201', ARRAY['Developmental Assessment', 'Physical Therapy', 'Occupational Therapy', 'Early Intervention'], ARRAY['infant', 'toddler', 'preschool'], ARRAY['English', 'Spanish'], true, ARRAY['Blue Cross', 'Cigna', 'United Healthcare', 'Medicaid'], false, 4.7),

('Early Intervention Alliance', 'educational_program', ARRAY['developmental'], 'State-funded early intervention program for children under 3 with developmental delays. Free or low-cost services in home or community settings.', 'intake@earlyintervention.gov', '(555) 901-2345', 'https://earlyintervention.state.gov', '123 Government Plaza', 'Phoenix', 'AZ', 'USA', '85001', ARRAY['Developmental Screening', 'Home Visits', 'Family Support', 'Service Coordination'], ARRAY['infant', 'toddler'], ARRAY['English', 'Spanish'], false, ARRAY[]::text[], false, 4.6),

-- Learning Disorders Resources
('Learning Success Institute', 'clinic', ARRAY['learning'], 'Specialized assessment and tutoring for children with dyslexia, dyscalculia, dysgraphia, and other learning differences. Evidence-based interventions.', 'info@learningsuccessinstitute.com', '(555) 012-3456', 'https://learningsuccessinstitute.com', '888 Education Center', 'Portland', 'OR', 'USA', '97201', ARRAY['Educational Assessment', 'Orton-Gillingham Reading', 'Math Tutoring', 'Writing Support', 'Study Skills'], ARRAY['school_age', 'teen'], ARRAY['English'], true, ARRAY['Blue Cross', 'Aetna'], true, 4.8),

('Understood.org', 'online_resource', ARRAY['learning'], 'Free comprehensive online resource for learning and thinking differences. Articles, tools, and community support for parents and educators.', 'support@understood.org', NULL, 'https://understood.org', NULL, 'New York', 'NY', 'USA', NULL, ARRAY['Educational Resources', 'Parent Articles', 'Expert Advice', 'Community Forums'], ARRAY['preschool', 'school_age', 'teen', 'adult'], ARRAY['English', 'Spanish'], false, ARRAY[]::text[], true, 4.7),

-- Sensory Processing Resources
('Sensory Solutions OT', 'clinic', ARRAY['sensory'], 'Occupational therapy clinic specializing in sensory processing disorders. Sensory gym and individualized sensory integration therapy.', 'hello@sensorysolutions.com', '(555) 123-7890', 'https://sensorysolutions.com', '999 Therapy Court', 'Minneapolis', 'MN', 'USA', '55401', ARRAY['Sensory Integration Therapy', 'Occupational Therapy', 'Feeding Therapy', 'Handwriting Support'], ARRAY['toddler', 'preschool', 'school_age'], ARRAY['English', 'Spanish'], true, ARRAY['Blue Cross', 'Cigna', 'United Healthcare'], false, 4.9),

('SPD Foundation', 'online_resource', ARRAY['sensory'], 'Sensory Processing Disorder Foundation providing education, research updates, and therapist directory. Comprehensive resource library.', 'info@spdfoundation.net', '(555) 234-8901', 'https://spdfoundation.net', NULL, 'Denver', 'CO', 'USA', NULL, ARRAY['Therapist Directory', 'Educational Materials', 'Research Updates', 'Parent Support'], ARRAY['infant', 'toddler', 'preschool', 'school_age', 'teen', 'adult'], ARRAY['English'], false, ARRAY[]::text[], true, 4.5),

-- Multi-Specialty Resources
('Children''s Therapy Network', 'clinic', ARRAY['asd', 'adhd', 'speech', 'developmental', 'sensory'], 'Comprehensive pediatric therapy center offering multiple specialties under one roof. Coordinated care approach for complex needs.', 'intake@childrenstherapy.net', '(555) 345-9012', 'https://childrenstherapy.net', '1234 Medical Center Dr', 'Philadelphia', 'PA', 'USA', '19101', ARRAY['Speech Therapy', 'Occupational Therapy', 'Physical Therapy', 'ABA Therapy', 'Psychological Services'], ARRAY['infant', 'toddler', 'preschool', 'school_age', 'teen'], ARRAY['English', 'Spanish', 'Mandarin'], true, ARRAY['Most Major Insurance', 'Medicaid'], true, 4.8),

('BetterHelp for Families', 'online_resource', ARRAY['adhd', 'learning', 'asd'], 'Online therapy platform with therapists specializing in child development and family support. Flexible scheduling and affordable rates.', 'support@betterhelp.com', NULL, 'https://betterhelp.com/families', NULL, 'Mountain View', 'CA', 'USA', NULL, ARRAY['Individual Therapy', 'Family Therapy', 'Parent Coaching', 'Behavioral Support'], ARRAY['toddler', 'preschool', 'school_age', 'teen', 'adult'], ARRAY['English', 'Spanish', 'French', 'German'], true, ARRAY['Some Insurance Plans'], true, 4.4),

('Parent to Parent Support', 'support_group', ARRAY['asd', 'adhd', 'speech', 'developmental', 'learning', 'sensory'], 'Peer-led support network matching families with experienced parents who have similar challenges. Emotional support and practical guidance.', 'connect@parenttoparent.org', '(555) 456-0123', 'https://parenttoparent.org', '567 Community Way', 'Atlanta', 'GA', 'USA', '30301', ARRAY['Peer Matching', 'Phone Support', 'Monthly Meetings', 'Resource Sharing'], ARRAY['infant', 'toddler', 'preschool', 'school_age', 'teen', 'adult'], ARRAY['English', 'Spanish'], false, ARRAY[]::text[], false, 4.6);