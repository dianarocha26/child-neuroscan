/*
  # Add Learning Disorders Questionnaire
  
  ## Overview
  Screening for learning disorders including dyslexia, dyscalculia,
  dysgraphia, and general learning difficulties in academic settings.
  
  ## Questions Added
  13 evidence-based questions covering:
  - Reading difficulties (dyslexia indicators)
  - Math difficulties (dyscalculia indicators)
  - Writing difficulties (dysgraphia indicators)
  - Processing and memory challenges
  - Academic performance patterns
  
  ## Functional Domains
  Questions mapped to:
  - Cognitive Development
  - Communication
  - Attention & Focus
*/

DO $$
DECLARE
  learning_condition_id uuid;
  cognitive_domain_id uuid;
  comm_domain_id uuid;
  attention_domain_id uuid;
  question_id uuid;
BEGIN
  SELECT id INTO learning_condition_id FROM conditions WHERE code = 'learning_disorders';
  SELECT id INTO cognitive_domain_id FROM functional_domains WHERE code = 'cognitive';
  SELECT id INTO comm_domain_id FROM functional_domains WHERE code = 'communication';
  SELECT id INTO attention_domain_id FROM functional_domains WHERE code = 'attention';

  -- Question 1: Reading difficulties
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child have significant difficulty learning to read or reading at grade level?',
    '¿Su hijo tiene dificultad significativa para aprender a leer o leer al nivel de grado?',
    1, 1.4, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, comm_domain_id);

  -- Question 2: Letter/sound confusion
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child confuse letters or have trouble connecting letters to sounds?',
    '¿Su hijo confunde letras o tiene problemas para conectar letras con sonidos?',
    2, 1.3, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 3: Spelling difficulties
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child have persistent spelling difficulties even with common words?',
    '¿Su hijo tiene dificultades persistentes de ortografía incluso con palabras comunes?',
    3, 1.2, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 4: Math struggles
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child struggle significantly with math concepts, number sense, or calculations?',
    '¿Su hijo tiene dificultades significativas con conceptos matemáticos, sentido numérico o cálculos?',
    4, 1.4, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 5: Writing difficulties
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child have difficulty with handwriting, letter formation, or written expression?',
    '¿Su hijo tiene dificultad con la escritura a mano, formación de letras o expresión escrita?',
    5, 1.3, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 6: Slow reading
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child read much slower than peers or avoid reading activities?',
    '¿Su hijo lee mucho más lento que sus compañeros o evita actividades de lectura?',
    6, 1.2, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 7: Comprehension issues
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child have difficulty understanding what they read even if they can decode words?',
    '¿Su hijo tiene dificultad para entender lo que lee incluso si puede decodificar palabras?',
    7, 1.3, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, comm_domain_id);

  -- Question 8: Memory challenges
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child have difficulty remembering information, facts, or sequences?',
    '¿Su hijo tiene dificultad para recordar información, hechos o secuencias?',
    8, 1.2, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 9: Following multi-step instructions
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child struggle to follow multi-step instructions or directions?',
    '¿Su hijo tiene dificultades para seguir instrucciones o direcciones de varios pasos?',
    9, 1.1, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, attention_domain_id);

  -- Question 10: Time concepts
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child have difficulty with time concepts, telling time, or understanding sequences?',
    '¿Su hijo tiene dificultad con conceptos de tiempo, decir la hora o entender secuencias?',
    10, 1.1, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 11: Inconsistent performance
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child show inconsistent academic performance, knowing something one day but not the next?',
    '¿Su hijo muestra un rendimiento académico inconsistente, sabiendo algo un día pero no al siguiente?',
    11, 1.2, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 12: Homework struggles
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child take much longer than expected to complete homework or schoolwork?',
    '¿Su hijo tarda mucho más de lo esperado en completar la tarea o el trabajo escolar?',
    12, 1.2, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, attention_domain_id);

  -- Question 13: Effort-achievement gap
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (learning_condition_id,
    'Does your child work very hard but still struggle to achieve grade-level expectations?',
    '¿Su hijo trabaja muy duro pero aún tiene dificultades para alcanzar las expectativas del nivel de grado?',
    13, 1.3, false, 72, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

END $$;
