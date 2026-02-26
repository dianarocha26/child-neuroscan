/*
  # Screening Recommendation Algorithm Rules

  Evidence-based rules for suggesting condition-specific screenings
*/

INSERT INTO screening_recommendation_rules (
  condition_id, condition_name, primary_domains, secondary_domains,
  threshold_rules, recommendation_message, recommendation_message_es,
  educational_summary, next_steps, professional_types
) VALUES
  (
    'asd',
    'Autism Spectrum Disorder',
    ARRAY['social_communication', 'behavior_patterns'],
    ARRAY['sensory_processing', 'speech_language'],
    '{"primary_threshold": 2.0, "secondary_threshold": 1.5, "min_primary_domains": 2, "min_elevated_questions": 4}'::jsonb,
    'Based on your responses, we recommend exploring our Autism Spectrum Disorder screening. Your answers show patterns in social communication and behavioral areas that are worth discussing with a professional.',
    'Según sus respuestas, recomendamos explorar nuestra evaluación del Trastorno del Espectro Autista.',
    'Autism Spectrum Disorder (ASD) affects how people communicate, interact socially, and process sensory information. Early identification and intervention can make a significant positive difference.',
    'Complete the detailed ASD screening questionnaire. Regardless of results, we recommend consulting with a developmental pediatrician or child psychologist for a comprehensive evaluation.',
    ARRAY['Developmental Pediatrician', 'Child Psychologist', 'Developmental Behavioral Specialist']
  ),
  (
    'adhd',
    'ADHD',
    ARRAY['attention_focus', 'emotional_regulation'],
    ARRAY['behavior_patterns', 'learning_cognition'],
    '{"primary_threshold": 2.0, "secondary_threshold": 1.5, "min_primary_domains": 2, "min_elevated_questions": 4}'::jsonb,
    'Your responses suggest exploring our ADHD screening. We noticed patterns related to attention, focus, and impulse control that are worth evaluating further.',
    'Sus respuestas sugieren explorar nuestra evaluación de TDAH.',
    'ADHD affects attention, impulse control, and activity levels. It is one of the most common neurodevelopmental conditions and responds well to treatment.',
    'Complete the detailed ADHD screening questionnaire. Consider scheduling an evaluation with a pediatrician, child psychiatrist, or psychologist who specializes in ADHD.',
    ARRAY['Pediatrician', 'Child Psychiatrist', 'Child Psychologist', 'Neuropsychologist']
  ),
  (
    'speech_language_delay',
    'Speech & Language Delay',
    ARRAY['speech_language'],
    ARRAY['social_communication', 'learning_cognition'],
    '{"primary_threshold": 2.0, "secondary_threshold": 1.5, "min_primary_domains": 1, "min_elevated_questions": 2}'::jsonb,
    'We recommend our Speech & Language Delay screening based on your responses about communication. Early support for speech and language can lead to excellent outcomes.',
    'Recomendamos nuestra evaluación de Retraso del Habla y Lenguaje.',
    'Speech and language skills develop at different rates, but delays can impact learning and social connections. Speech-language therapy is highly effective.',
    'Complete the Speech & Language screening. Contact a speech-language pathologist for evaluation. Many areas offer early intervention services at no cost for children under 3.',
    ARRAY['Speech-Language Pathologist', 'Early Intervention Specialist', 'Developmental Pediatrician']
  ),
  (
    'developmental_delay',
    'Developmental Delay',
    ARRAY['learning_cognition', 'motor_skills'],
    ARRAY['speech_language', 'social_communication'],
    '{"primary_threshold": 2.0, "secondary_threshold": 1.5, "min_primary_domains": 1, "min_elevated_questions": 3}'::jsonb,
    'Your responses suggest exploring our Developmental Delay screening. We noticed patterns in learning or motor skills that could benefit from professional guidance.',
    'Sus respuestas sugieren explorar nuestra evaluación de Retraso del Desarrollo.',
    'Developmental delays mean a child is progressing more slowly in one or more areas. Early identification and support can help children catch up or develop compensatory skills.',
    'Complete the Developmental Delay screening. Request an evaluation through your pediatrician or local early intervention program.',
    ARRAY['Developmental Pediatrician', 'Early Intervention Team', 'Occupational Therapist', 'Physical Therapist']
  ),
  (
    'sensory_processing_disorder',
    'Sensory Processing Disorder',
    ARRAY['sensory_processing'],
    ARRAY['emotional_regulation', 'behavior_patterns'],
    '{"primary_threshold": 2.0, "secondary_threshold": 1.5, "min_primary_domains": 1, "min_elevated_questions": 2}'::jsonb,
    'We recommend our Sensory Processing screening. Your responses indicate your child may experience the world differently through their senses.',
    'Recomendamos nuestra evaluación de Procesamiento Sensorial.',
    'Sensory Processing Disorder affects how the brain processes sensory information. Occupational therapy can teach coping strategies and regulation skills.',
    'Complete the Sensory Processing screening. An occupational therapist specializing in sensory integration can evaluate and create a sensory diet.',
    ARRAY['Occupational Therapist', 'Developmental Pediatrician']
  ),
  (
    'learning_disorders',
    'Learning Disorders',
    ARRAY['learning_cognition'],
    ARRAY['attention_focus', 'speech_language'],
    '{"primary_threshold": 2.0, "secondary_threshold": 1.5, "min_primary_domains": 1, "min_elevated_questions": 3, "age_minimum": 48}'::jsonb,
    'Your responses suggest exploring our Learning Disorders screening. Patterns in learning and academic skills warrant further evaluation.',
    'Sus respuestas sugieren explorar nuestra evaluación de Trastornos del Aprendizaje.',
    'Learning disorders affect how the brain processes and uses information. With proper identification and support, children with learning disorders can absolutely succeed academically.',
    'Complete the Learning Disorders screening. Request a psychoeducational evaluation through your school or privately.',
    ARRAY['Educational Psychologist', 'Neuropsychologist', 'School Psychologist', 'Learning Specialist']
  )
ON CONFLICT DO NOTHING;
