/*
  # Add Speech and Language Delay Questionnaire
  
  ## Overview
  Comprehensive screening for speech and language development delays
  covering expressive language, receptive language, articulation, and
  pragmatic language skills.
  
  ## Questions Added
  12 evidence-based questions covering:
  - Expressive language milestones
  - Receptive language understanding
  - Articulation and pronunciation
  - Vocabulary development
  - Sentence structure
  - Social communication
  
  ## Functional Domains
  Questions mapped to:
  - Communication
  - Social Interaction
  - Cognitive Development
*/

DO $$
DECLARE
  speech_condition_id uuid;
  comm_domain_id uuid;
  social_domain_id uuid;
  cognitive_domain_id uuid;
  question_id uuid;
BEGIN
  SELECT id INTO speech_condition_id FROM conditions WHERE code = 'speech_delay';
  SELECT id INTO comm_domain_id FROM functional_domains WHERE code = 'communication';
  SELECT id INTO social_domain_id FROM functional_domains WHERE code = 'social';
  SELECT id INTO cognitive_domain_id FROM functional_domains WHERE code = 'cognitive';

  -- Question 1: Limited vocabulary
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child have a very limited vocabulary for their age?',
    '¿Su hijo tiene un vocabulario muy limitado para su edad?',
    1, 1.3, false, 18, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id);

  -- Question 2: No words by 18 months
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Did your child not say any words by 18 months or use very few words?',
    '¿Su hijo no dijo ninguna palabra a los 18 meses o usa muy pocas palabras?',
    2, 1.8, true, 18, 30)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id);

  -- Question 3: No two-word phrases
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child not use two-word phrases by age 2 or struggles with simple sentences?',
    '¿Su hijo no usa frases de dos palabras a los 2 años o tiene dificultades con oraciones simples?',
    3, 1.5, true, 24, 42)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id);

  -- Question 4: Difficulty understanding
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child have difficulty understanding simple directions or questions?',
    '¿Su hijo tiene dificultad para entender instrucciones o preguntas simples?',
    4, 1.4, false, 18, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id), (question_id, cognitive_domain_id);

  -- Question 5: Unclear speech
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Is your child''s speech unclear or difficult for others to understand?',
    '¿El habla de su hijo es poco clara o difícil de entender para otros?',
    5, 1.2, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id);

  -- Question 6: Difficulty with sounds
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child have difficulty pronouncing certain sounds or letters?',
    '¿Su hijo tiene dificultad para pronunciar ciertos sonidos o letras?',
    6, 1.1, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id);

  -- Question 7: Not following conversations
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child have trouble following or participating in conversations?',
    '¿Su hijo tiene problemas para seguir o participar en conversaciones?',
    7, 1.3, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id), (question_id, social_domain_id);

  -- Question 8: Repeating instead of responding
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child repeat what you say instead of responding appropriately?',
    '¿Su hijo repite lo que usted dice en lugar de responder apropiadamente?',
    8, 1.2, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id);

  -- Question 9: Difficulty expressing needs
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child have difficulty expressing their needs, wants, or thoughts?',
    '¿Su hijo tiene dificultad para expresar sus necesidades, deseos o pensamientos?',
    9, 1.4, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id);

  -- Question 10: Frustration with communication
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child become frustrated when trying to communicate?',
    '¿Su hijo se frustra cuando intenta comunicarse?',
    10, 1.2, false, 18, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id), (question_id, social_domain_id);

  -- Question 11: Limited sentence structure
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child use very simple or grammatically incorrect sentences for their age?',
    '¿Su hijo usa oraciones muy simples o gramaticalmente incorrectas para su edad?',
    11, 1.1, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id), (question_id, cognitive_domain_id);

  -- Question 12: Not asking questions
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (speech_condition_id,
    'Does your child rarely ask questions or show curiosity through language?',
    '¿Su hijo rara vez hace preguntas o muestra curiosidad a través del lenguaje?',
    12, 1.2, false, 30, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, comm_domain_id), (question_id, cognitive_domain_id);

END $$;
