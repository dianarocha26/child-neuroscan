/*
  # Add ADHD Screening Questionnaire
  
  ## Overview
  Comprehensive ADHD screening based on DSM-5 criteria and evidence-based indicators
  for attention, hyperactivity, and impulsivity patterns.
  
  ## Questions Added
  15 evidence-based questions covering:
  - Attention and focus difficulties
  - Hyperactivity patterns
  - Impulsivity indicators
  - Academic and social impact
  - Age-appropriate behavioral patterns
  
  ## Functional Domains
  Questions mapped to:
  - Attention & Focus
  - Behavioral Regulation
  - Cognitive Development
  - Social Interaction
*/

DO $$
DECLARE
  adhd_condition_id uuid;
  attention_domain_id uuid;
  behavioral_domain_id uuid;
  cognitive_domain_id uuid;
  social_domain_id uuid;
  question_id uuid;
BEGIN
  SELECT id INTO adhd_condition_id FROM conditions WHERE code = 'adhd';
  SELECT id INTO attention_domain_id FROM functional_domains WHERE code = 'attention';
  SELECT id INTO behavioral_domain_id FROM functional_domains WHERE code = 'behavioral';
  SELECT id INTO cognitive_domain_id FROM functional_domains WHERE code = 'cognitive';
  SELECT id INTO social_domain_id FROM functional_domains WHERE code = 'social';

  -- Question 1: Difficulty sustaining attention
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child have difficulty sustaining attention during tasks or play activities?',
    '¿Su hijo tiene dificultad para mantener la atención durante tareas o actividades de juego?',
    1, 1.3, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, attention_domain_id);

  -- Question 2: Not listening
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child often not seem to listen when spoken to directly?',
    '¿Su hijo a menudo parece no escuchar cuando se le habla directamente?',
    2, 1.2, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, attention_domain_id), (question_id, social_domain_id);

  -- Question 3: Following instructions
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child fail to follow through on instructions and fail to finish tasks?',
    '¿Su hijo no sigue las instrucciones y no termina las tareas?',
    3, 1.2, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, attention_domain_id), (question_id, cognitive_domain_id);

  -- Question 4: Organization difficulties
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child have difficulty organizing tasks and activities?',
    '¿Su hijo tiene dificultad para organizar tareas y actividades?',
    4, 1.1, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, attention_domain_id);

  -- Question 5: Avoiding mental effort
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child avoid or dislike tasks that require sustained mental effort?',
    '¿Su hijo evita o le disgustan las tareas que requieren esfuerzo mental sostenido?',
    5, 1.1, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, attention_domain_id), (question_id, behavioral_domain_id);

  -- Question 6: Losing things
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child often lose things necessary for tasks or activities?',
    '¿Su hijo pierde frecuentemente cosas necesarias para tareas o actividades?',
    6, 1.0, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, attention_domain_id);

  -- Question 7: Easily distracted
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Is your child easily distracted by external stimuli or unrelated thoughts?',
    '¿Su hijo se distrae fácilmente con estímulos externos o pensamientos no relacionados?',
    7, 1.3, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, attention_domain_id);

  -- Question 8: Forgetful
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Is your child forgetful in daily activities?',
    '¿Su hijo es olvidadizo en las actividades diarias?',
    8, 1.0, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, attention_domain_id), (question_id, cognitive_domain_id);

  -- Question 9: Fidgeting
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child fidget with hands or feet or squirm in seat?',
    '¿Su hijo se mueve inquieto con las manos o pies o se retuerce en el asiento?',
    9, 1.2, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  -- Question 10: Leaving seat
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child leave their seat in situations where remaining seated is expected?',
    '¿Su hijo deja su asiento en situaciones donde se espera que permanezca sentado?',
    10, 1.2, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  -- Question 11: Running/climbing
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child run about or climb excessively in inappropriate situations?',
    '¿Su hijo corre o trepa excesivamente en situaciones inapropiadas?',
    11, 1.1, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  -- Question 12: Difficulty with quiet activities
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child have difficulty engaging in quiet leisure activities?',
    '¿Su hijo tiene dificultad para participar en actividades de ocio tranquilas?',
    12, 1.0, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  -- Question 13: On the go
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Is your child often "on the go" or acts as if "driven by a motor"?',
    '¿Su hijo está a menudo "en movimiento" o actúa como si estuviera "impulsado por un motor"?',
    13, 1.2, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  -- Question 14: Blurting out answers
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child blurt out answers before questions have been completed?',
    '¿Su hijo responde precipitadamente antes de que se completen las preguntas?',
    14, 1.1, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id), (question_id, social_domain_id);

  -- Question 15: Difficulty waiting turn
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (adhd_condition_id,
    'Does your child have difficulty waiting their turn in games or group situations?',
    '¿Su hijo tiene dificultad para esperar su turno en juegos o situaciones de grupo?',
    15, 1.2, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id), (question_id, social_domain_id);

END $$;
