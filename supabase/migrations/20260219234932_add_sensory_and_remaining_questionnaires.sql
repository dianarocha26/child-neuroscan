/*
  # Add Sensory Processing and Remaining Condition Questionnaires
  
  ## Overview
  Comprehensive screenings for:
  - Sensory Processing Disorder
  - Tourette Syndrome
  - Epilepsy (neurological red flags)
  - Cerebral Palsy indicators
  - Intellectual Developmental Disorder
  
  ## Questions Added
  Multiple questionnaires with evidence-based indicators for each condition
  
  ## Functional Domains
  Questions mapped to appropriate functional domains for each condition
*/

DO $$
DECLARE
  sensory_condition_id uuid;
  tourette_condition_id uuid;
  epilepsy_condition_id uuid;
  cp_condition_id uuid;
  idd_condition_id uuid;
  sensory_domain_id uuid;
  behavioral_domain_id uuid;
  motor_domain_id uuid;
  cognitive_domain_id uuid;
  attention_domain_id uuid;
  social_domain_id uuid;
  sleep_domain_id uuid;
  question_id uuid;
BEGIN
  SELECT id INTO sensory_condition_id FROM conditions WHERE code = 'sensory_processing';
  SELECT id INTO tourette_condition_id FROM conditions WHERE code = 'tourette';
  SELECT id INTO epilepsy_condition_id FROM conditions WHERE code = 'epilepsy';
  SELECT id INTO cp_condition_id FROM conditions WHERE code = 'cerebral_palsy';
  SELECT id INTO idd_condition_id FROM conditions WHERE code = 'intellectual_disability';
  
  SELECT id INTO sensory_domain_id FROM functional_domains WHERE code = 'sensory';
  SELECT id INTO behavioral_domain_id FROM functional_domains WHERE code = 'behavioral';
  SELECT id INTO motor_domain_id FROM functional_domains WHERE code = 'motor';
  SELECT id INTO cognitive_domain_id FROM functional_domains WHERE code = 'cognitive';
  SELECT id INTO attention_domain_id FROM functional_domains WHERE code = 'attention';
  SELECT id INTO social_domain_id FROM functional_domains WHERE code = 'social';
  SELECT id INTO sleep_domain_id FROM functional_domains WHERE code = 'sleep';

  -- SENSORY PROCESSING DISORDER QUESTIONS
  
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Is your child overly sensitive to textures, clothing tags, or certain fabrics?',
    '¿Su hijo es excesivamente sensible a texturas, etiquetas de ropa o ciertas telas?',
    1, 1.2, false, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Does your child have extreme reactions to sounds that don''t bother others?',
    '¿Su hijo tiene reacciones extremas a sonidos que no molestan a otros?',
    2, 1.3, false, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Does your child avoid certain foods based on texture rather than taste?',
    '¿Su hijo evita ciertos alimentos basándose en la textura en lugar del sabor?',
    3, 1.1, false, 18, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Does your child seek or avoid movement experiences (spinning, swinging, jumping)?',
    '¿Su hijo busca o evita experiencias de movimiento (girar, columpiarse, saltar)?',
    4, 1.2, false, 18, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id), (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Does your child have difficulty with personal space or touching others too much/too little?',
    '¿Su hijo tiene dificultad con el espacio personal o toca a otros demasiado/muy poco?',
    5, 1.1, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id), (question_id, social_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Does your child become overwhelmed in busy environments like stores or parties?',
    '¿Su hijo se siente abrumado en entornos concurridos como tiendas o fiestas?',
    6, 1.3, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id), (question_id, behavioral_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Does your child have unusual responses to pain (under or over-responsive)?',
    '¿Su hijo tiene respuestas inusuales al dolor (poco o muy sensible)?',
    7, 1.2, false, 18, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (sensory_condition_id,
    'Does your child have difficulty with activities like brushing teeth, hair washing, or nail cutting?',
    '¿Su hijo tiene dificultad con actividades como cepillarse los dientes, lavar el cabello o cortar uñas?',
    8, 1.1, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id);

  -- TOURETTE SYNDROME QUESTIONS
  
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (tourette_condition_id,
    'Does your child have repetitive, involuntary movements (motor tics) like eye blinking, head jerking, or shoulder shrugging?',
    '¿Su hijo tiene movimientos repetitivos e involuntarios (tics motores) como parpadeo de ojos, sacudidas de cabeza o encogimiento de hombros?',
    1, 1.5, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id), (question_id, behavioral_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (tourette_condition_id,
    'Does your child make repetitive sounds or noises (vocal tics) like throat clearing, grunting, or repeating words?',
    '¿Su hijo hace sonidos o ruidos repetitivos (tics vocales) como aclarar la garganta, gruñir o repetir palabras?',
    2, 1.5, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (tourette_condition_id,
    'Do these tics occur multiple times a day, nearly every day, for more than a year?',
    '¿Estos tics ocurren varias veces al día, casi todos los días, durante más de un año?',
    3, 1.4, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (tourette_condition_id,
    'Do the tics get worse with stress, excitement, or anxiety?',
    '¿Los tics empeoran con el estrés, la emoción o la ansiedad?',
    4, 1.2, false, 60, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, behavioral_domain_id);

  -- EPILEPSY QUESTIONS
  
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (epilepsy_condition_id,
    'Has your child had episodes of staring spells where they seem unaware of their surroundings?',
    '¿Su hijo ha tenido episodios de mirada fija donde parece no darse cuenta de su entorno?',
    1, 1.5, true, 6, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, attention_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (epilepsy_condition_id,
    'Has your child experienced sudden jerking movements or muscle spasms?',
    '¿Su hijo ha experimentado movimientos bruscos repentinos o espasmos musculares?',
    2, 1.8, true, 6, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (epilepsy_condition_id,
    'Has your child had episodes of temporary confusion, loss of awareness, or memory gaps?',
    '¿Su hijo ha tenido episodios de confusión temporal, pérdida de conciencia o lagunas de memoria?',
    3, 1.7, true, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (epilepsy_condition_id,
    'Has your child experienced sudden falls or loss of muscle tone?',
    '¿Su hijo ha experimentado caídas repentinas o pérdida del tono muscular?',
    4, 1.8, true, 6, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (epilepsy_condition_id,
    'Does your child have unusual sensations, fear, or déjà vu feelings before episodes?',
    '¿Su hijo tiene sensaciones inusuales, miedo o sentimientos de déjà vu antes de los episodios?',
    5, 1.4, true, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, sensory_domain_id), (question_id, behavioral_domain_id);

  -- CEREBRAL PALSY QUESTIONS
  
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (cp_condition_id,
    'Does your child have stiff or rigid muscles, especially in the legs or arms?',
    '¿Su hijo tiene músculos rígidos o tensos, especialmente en las piernas o brazos?',
    1, 1.6, true, 6, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (cp_condition_id,
    'Does your child have poor muscle tone (floppy or weak muscles)?',
    '¿Su hijo tiene tono muscular pobre (músculos flácidos o débiles)?',
    2, 1.6, true, 6, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (cp_condition_id,
    'Does your child have difficulty with coordinated movements or balance?',
    '¿Su hijo tiene dificultad con movimientos coordinados o equilibrio?',
    3, 1.4, false, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (cp_condition_id,
    'Does your child favor one side of their body over the other significantly?',
    '¿Su hijo favorece significativamente un lado de su cuerpo sobre el otro?',
    4, 1.5, true, 6, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (cp_condition_id,
    'Does your child have tremors or involuntary movements?',
    '¿Su hijo tiene temblores o movimientos involuntarios?',
    5, 1.4, false, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (cp_condition_id,
    'Does your child have difficulty with swallowing, drooling, or feeding?',
    '¿Su hijo tiene dificultad para tragar, babear o alimentarse?',
    6, 1.3, false, 12, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, motor_domain_id);

  -- INTELLECTUAL DEVELOPMENTAL DISORDER QUESTIONS
  
  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (idd_condition_id,
    'Does your child have significant difficulty learning new skills compared to peers?',
    '¿Su hijo tiene dificultad significativa para aprender nuevas habilidades en comparación con sus compañeros?',
    1, 1.4, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (idd_condition_id,
    'Does your child have difficulty with reasoning, problem-solving, or planning?',
    '¿Su hijo tiene dificultad con el razonamiento, la resolución de problemas o la planificación?',
    2, 1.4, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (idd_condition_id,
    'Does your child have significant delays in language and communication skills?',
    '¿Su hijo tiene retrasos significativos en las habilidades de lenguaje y comunicación?',
    3, 1.3, false, 24, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (idd_condition_id,
    'Does your child struggle with adaptive skills like self-care, safety awareness, or social rules?',
    '¿Su hijo tiene dificultades con habilidades adaptativas como el cuidado personal, conciencia de seguridad o reglas sociales?',
    4, 1.4, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id), (question_id, social_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (idd_condition_id,
    'Does your child have difficulty understanding consequences or cause-and-effect?',
    '¿Su hijo tiene dificultad para entender consecuencias o causa y efecto?',
    5, 1.3, false, 48, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

  INSERT INTO questions (condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
  VALUES (idd_condition_id,
    'Does your child need more support than peers to complete daily activities?',
    '¿Su hijo necesita más apoyo que sus compañeros para completar actividades diarias?',
    6, 1.3, false, 36, 216)
  RETURNING id INTO question_id;
  INSERT INTO question_domains (question_id, domain_id) VALUES (question_id, cognitive_domain_id);

END $$;
