/*
  # Add Developmental Delay Questionnaire
  
  ## Overview
  Comprehensive screening for general developmental delays across
  multiple domains including motor, cognitive, social, and self-care skills.
  
  ## Questions Added
  14 evidence-based questions covering:
  - Gross motor development
  - Fine motor skills
  - Cognitive milestones
  - Social-emotional development
  - Self-care and adaptive skills
  
  ## Functional Domains
  Questions mapped to:
  - Motor Development
  - Cognitive Development
  - Social Interaction
  - Communication
*/

DO $$
DECLARE
  dev_condition_id uuid;
  motor_domain_id uuid;
  cognitive_domain_id uuid;
  social_domain_id uuid;
  comm_domain_id uuid;
  question_id uuid;
BEGIN
  SELECT id INTO dev_condition_id FROM conditions WHERE code = 'developmental_delay';
  SELECT id INTO motor_domain_id FROM functional_domains WHERE code = 'motor';
  SELECT id INTO cognitive_domain_id FROM functional_domains WHERE code = 'cognitive';
  SELECT id INTO social_domain_id FROM functional_domains WHERE code = 'social';
  SELECT id INTO comm_domain_id FROM functional_domains WHERE code = 'communication';

  -- Question 1: Not sitting independently
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Did your child not sit independently by 9 months or show significant delays in sitting?',
    '¿Su hijo no se sentó independientemente a los 9 meses o mostró retrasos significativos?',
    1, 1.5, true, 9, 18)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  -- Question 2: Not walking
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Did your child not walk independently by 18 months?',
    '¿Su hijo no caminó independientemente a los 18 meses?',
    2, 1.5, true, 18, 30)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  -- Question 3: Poor coordination
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child show poor coordination or clumsiness compared to peers?',
    '¿Su hijo muestra poca coordinación o torpeza en comparación con sus compañeros?',
    3, 1.2, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  -- Question 4: Difficulty with fine motor
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child have difficulty with fine motor tasks like holding a crayon, using utensils, or buttoning?',
    '¿Su hijo tiene dificultad con tareas motoras finas como sostener un crayón, usar utensilios o abotonarse?',
    4, 1.2, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  -- Question 5: Not playing pretend
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child not engage in pretend or imaginative play appropriate for their age?',
    '¿Su hijo no participa en juego imaginativo apropiado para su edad?',
    5, 1.3, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, social_domain_id);

  -- Question 6: Problem-solving difficulties
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child have difficulty with simple problem-solving or puzzles for their age?',
    '¿Su hijo tiene dificultad con la resolución simple de problemas o rompecabezas para su edad?',
    6, 1.2, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 7: Not recognizing shapes/colors
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child have difficulty learning or recognizing basic shapes, colors, or numbers?',
    '¿Su hijo tiene dificultad para aprender o reconocer formas básicas, colores o números?',
    7, 1.1, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 8: Limited social interest
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child show limited interest in other children or struggle with peer interactions?',
    '¿Su hijo muestra poco interés en otros niños o tiene dificultades con las interacciones entre compañeros?',
    8, 1.2, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, social_domain_id);

  -- Question 9: Not responding to emotions
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child not respond to others'' emotions or show empathy?',
    '¿Su hijo no responde a las emociones de otros o muestra empatía?',
    9, 1.1, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, social_domain_id);

  -- Question 10: Self-care delays
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child have significant delays in self-care skills like feeding, dressing, or toileting?',
    '¿Su hijo tiene retrasos significativos en habilidades de cuidado personal como alimentarse, vestirse o usar el baño?',
    10, 1.2, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id), (question_id, cognitive_domain_id);

  -- Question 11: Not following simple commands
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child have difficulty following simple one or two-step commands?',
    '¿Su hijo tiene dificultad para seguir comandos simples de uno o dos pasos?',
    11, 1.3, false, 18, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, comm_domain_id);

  -- Question 12: Limited attention span
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Does your child have an extremely limited attention span even for preferred activities?',
    '¿Su hijo tiene un período de atención extremadamente limitado incluso para actividades preferidas?',
    12, 1.1, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 13: Not making progress
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Is your child not making progress in learning new skills or reaching milestones?',
    '¿Su hijo no está progresando en el aprendizaje de nuevas habilidades o alcanzando hitos?',
    13, 1.4, true, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  -- Question 14: Regression
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (dev_condition_id,
    'Has your child lost skills they previously had in any developmental area?',
    '¿Su hijo ha perdido habilidades que tenía previamente en cualquier área del desarrollo?',
    14, 2.0, true, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, motor_domain_id);

END $$;
