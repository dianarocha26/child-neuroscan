/*
  # Seed Appointment Types

  1. Appointment Types
    - Pediatrician
    - Developmental Pediatrician
    - Neurologist
    - Psychologist
    - Speech-Language Pathologist
    - Occupational Therapist
    - Physical Therapist
    - Behavioral Therapist
    - School IEP Meeting
    - Therapy Evaluation
*/

INSERT INTO appointment_types (name, description, icon, typical_duration, preparation_tips) VALUES
  (
    'Pediatrician',
    'Regular checkup or consultation with your child''s primary care doctor',
    'stethoscope',
    30,
    ARRAY[
      'Bring current medication list and dosages',
      'Write down growth and development observations',
      'Prepare questions about health concerns',
      'Bring insurance card and identification',
      'List any new symptoms or behaviors'
    ]
  ),
  (
    'Developmental Pediatrician',
    'Specialist evaluation for developmental delays, autism, ADHD, and other neurodevelopmental conditions',
    'brain',
    90,
    ARRAY[
      'Complete any pre-appointment questionnaires',
      'Gather previous evaluation reports',
      'Document developmental milestones and concerns',
      'Bring examples of school work if applicable',
      'List all current therapies and interventions',
      'Prepare detailed developmental history',
      'Bring both parents if possible for comprehensive history'
    ]
  ),
  (
    'Neurologist',
    'Specialist for brain and nervous system conditions including seizures, headaches, and movement disorders',
    'brain-circuit',
    60,
    ARRAY[
      'Document any episodes or symptoms with dates and times',
      'Bring video recordings of concerning behaviors if available',
      'List current medications and supplements',
      'Prepare family medical history',
      'Bring previous brain imaging results if available',
      'Note triggers or patterns you''ve observed'
    ]
  ),
  (
    'Psychologist',
    'Evaluation and therapy for behavioral, emotional, and learning concerns',
    'user-check',
    60,
    ARRAY[
      'Complete any behavior rating scales or questionnaires',
      'Document specific behavioral concerns with examples',
      'Bring school reports and teacher observations',
      'List previous psychological evaluations',
      'Prepare questions about testing or therapy recommendations',
      'Note family stressors or recent changes'
    ]
  ),
  (
    'Speech-Language Pathologist',
    'Evaluation and therapy for speech, language, and communication skills',
    'message-circle',
    45,
    ARRAY[
      'Note specific speech or language concerns',
      'Bring examples of how child communicates',
      'Document vocabulary and sentence use',
      'List any hearing test results',
      'Prepare questions about home practice activities',
      'Note feeding or swallowing concerns if applicable'
    ]
  ),
  (
    'Occupational Therapist',
    'Evaluation and therapy for fine motor skills, sensory processing, and daily living skills',
    'hand',
    45,
    ARRAY[
      'Document fine motor skill challenges',
      'Note sensory sensitivities or seeking behaviors',
      'List difficulties with daily activities (dressing, eating, etc.)',
      'Bring examples of handwriting if school-age',
      'Prepare questions about adaptive equipment',
      'Document play and social participation challenges'
    ]
  ),
  (
    'Physical Therapist',
    'Evaluation and therapy for gross motor skills, strength, and physical development',
    'activity',
    45,
    ARRAY[
      'Document gross motor delays or concerns',
      'Note any pain or movement limitations',
      'List physical activities and participation levels',
      'Bring appropriate clothing and shoes',
      'Prepare questions about home exercises',
      'Document any falls or coordination issues'
    ]
  ),
  (
    'Behavioral Therapist (ABA)',
    'Applied Behavior Analysis therapy for autism and behavioral challenges',
    'target',
    60,
    ARRAY[
      'Document specific behaviors of concern',
      'Note frequency and intensity of behaviors',
      'List what seems to trigger or reduce behaviors',
      'Bring data from previous therapy if applicable',
      'Prepare questions about therapy goals and methods',
      'Discuss family priorities and routines'
    ]
  ),
  (
    'School IEP Meeting',
    'Individualized Education Program meeting to discuss special education services',
    'school',
    90,
    ARRAY[
      'Review current IEP and progress reports',
      'Document concerns and desired goals',
      'Bring recent evaluation reports',
      'Prepare questions about services and accommodations',
      'Know your parental rights under IDEA',
      'Consider bringing an advocate if needed',
      'Request draft IEP in advance if possible'
    ]
  ),
  (
    'Therapy Evaluation',
    'Initial assessment to determine therapy needs and establish baseline',
    'clipboard-check',
    90,
    ARRAY[
      'Complete intake forms thoroughly',
      'Bring previous therapy reports',
      'Document specific areas of concern',
      'List current strengths and challenges',
      'Bring insurance information',
      'Prepare questions about therapy frequency and duration',
      'Discuss family schedule and availability'
    ]
  )
ON CONFLICT DO NOTHING;