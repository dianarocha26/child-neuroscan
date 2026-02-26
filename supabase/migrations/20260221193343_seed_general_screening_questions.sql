/*
  # Seed General Developmental Screening Questions

  Evidence-based questions covering 8 developmental domains
  Age-appropriate questions from 0-216 months (0-18 years)
  Ethical, supportive language focused on guidance not diagnosis
*/

INSERT INTO general_developmental_questions (
  question_number, question_text, question_text_es, domain,
  age_range_min, age_range_max, response_type, response_options,
  scoring_weight, explanation
) VALUES
  -- Social Communication (8 questions)
  (
    1,
    'Does your child make eye contact during conversations or when playing?',
    '¿Su hijo hace contacto visual durante conversaciones o mientras juega?',
    'social_communication',
    12, 216,
    'frequency',
    '[{"value": "always", "label": "Always/Most of the time", "score": 0}, {"value": "sometimes", "label": "Sometimes", "score": 1}, {"value": "rarely", "label": "Rarely", "score": 2}, {"value": "never", "label": "Never/Almost never", "score": 3}]'::jsonb,
    1.2,
    'Eye contact is an important social communication skill that typically develops early.'
  ),
  (
    2,
    'Does your child respond when you call their name?',
    '¿Su hijo responde cuando lo llama por su nombre?',
    'social_communication',
    6, 216,
    'frequency',
    '[{"value": "always", "label": "Always", "score": 0}, {"value": "usually", "label": "Usually", "score": 0.5}, {"value": "sometimes", "label": "Sometimes", "score": 1.5}, {"value": "rarely", "label": "Rarely or never", "score": 3}]'::jsonb,
    1.5,
    'Responding to name is a key social awareness milestone.'
  ),
  (
    3,
    'Does your child show interest in other children or try to play with them?',
    '¿Su hijo muestra interés en otros niños o intenta jugar con ellos?',
    'social_communication',
    18, 216,
    'frequency',
    '[{"value": "often", "label": "Often", "score": 0}, {"value": "sometimes", "label": "Sometimes", "score": 1}, {"value": "rarely", "label": "Rarely", "score": 2}, {"value": "no_interest", "label": "Shows no interest", "score": 3}]'::jsonb,
    1.3,
    'Social interest in peers develops throughout early childhood.'
  ),
  (
    4,
    'Does your child point to show you things they find interesting?',
    '¿Su hijo señala para mostrarle cosas que le parecen interesantes?',
    'social_communication',
    12, 60,
    'frequency',
    '[{"value": "yes_often", "label": "Yes, often", "score": 0}, {"value": "sometimes", "label": "Sometimes", "score": 1}, {"value": "rarely", "label": "Rarely", "score": 2.5}, {"value": "never", "label": "Never", "score": 3}]'::jsonb,
    1.4,
    'Joint attention (sharing interest) is a critical social communication skill.'
  ),
  
  -- Attention & Focus (6 questions)
  (
    5,
    'Can your child sit and focus on an activity (like a book or toy) for an age-appropriate amount of time?',
    '¿Puede su hijo sentarse y concentrarse en una actividad por una cantidad de tiempo apropiada para su edad?',
    'attention_focus',
    18, 216,
    'ability',
    '[{"value": "yes_easily", "label": "Yes, easily", "score": 0}, {"value": "with_effort", "label": "With some effort", "score": 1}, {"value": "difficult", "label": "Very difficult", "score": 2.5}, {"value": "cannot", "label": "Cannot focus", "score": 3}]'::jsonb,
    1.3,
    'Sustained attention increases with age and is necessary for learning.'
  ),
  (
    6,
    'Does your child get easily distracted by sounds, movements, or other things happening around them?',
    '¿Su hijo se distrae fácilmente con sonidos, movimientos u otras cosas que suceden a su alrededor?',
    'attention_focus',
    24, 216,
    'frequency',
    '[{"value": "rarely", "label": "Rarely", "score": 0}, {"value": "sometimes", "label": "Sometimes", "score": 1}, {"value": "often", "label": "Often", "score": 2}, {"value": "constantly", "label": "Constantly", "score": 3}]'::jsonb,
    1.2,
    'Distractibility can impact learning and daily functioning.'
  ),
  (
    7,
    'Does your child have difficulty waiting their turn or interrupts others frequently?',
    '¿Su hijo tiene dificultad para esperar su turno o interrumpe a otros frecuentemente?',
    'attention_focus',
    36, 216,
    'frequency',
    '[{"value": "rarely", "label": "Rarely", "score": 0}, {"value": "sometimes", "label": "Sometimes (age-appropriate)", "score": 0.5}, {"value": "often", "label": "Often", "score": 2}, {"value": "always", "label": "Almost always", "score": 3}]'::jsonb,
    1.1,
    'Impulse control and patience develop over time with maturation.'
  ),

  -- Motor Skills (5 questions)
  (
    8,
    'Does your child have difficulty with fine motor tasks like holding a pencil, using utensils, or buttoning clothes?',
    '¿Su hijo tiene dificultad con tareas motoras finas como sostener un lápiz, usar utensilios o abotonarse la ropa?',
    'motor_skills',
    36, 216,
    'severity',
    '[{"value": "no_difficulty", "label": "No difficulty", "score": 0}, {"value": "mild", "label": "Mild difficulty", "score": 1}, {"value": "moderate", "label": "Moderate difficulty", "score": 2}, {"value": "severe", "label": "Severe difficulty", "score": 3}]'::jsonb,
    1.1,
    'Fine motor skills are important for self-care and academic tasks.'
  ),
  (
    9,
    'Does your child seem clumsy, frequently bump into things, or have difficulty with balance?',
    '¿Su hijo parece torpe, choca frecuentemente con cosas o tiene dificultad con el equilibrio?',
    'motor_skills',
    24, 216,
    'frequency',
    '[{"value": "no", "label": "No", "score": 0}, {"value": "occasionally", "label": "Occasionally", "score": 0.5}, {"value": "often", "label": "Often", "score": 2}, {"value": "constantly", "label": "Constantly", "score": 3}]'::jsonb,
    1.0,
    'Gross motor coordination develops with practice and maturation.'
  ),

  -- Emotional Regulation (6 questions)
  (
    10,
    'How often does your child have meltdowns or emotional outbursts that seem intense compared to other children their age?',
    '¿Con qué frecuencia su hijo tiene colapsos o arrebatos emocionales que parecen intensos comparados con otros niños de su edad?',
    'emotional_regulation',
    24, 216,
    'frequency',
    '[{"value": "rarely", "label": "Rarely", "score": 0}, {"value": "weekly", "label": "Once a week", "score": 1}, {"value": "daily", "label": "Daily", "score": 2.5}, {"value": "multiple_daily", "label": "Multiple times per day", "score": 3}]'::jsonb,
    1.4,
    'Emotional regulation develops over time but significant difficulties may need support.'
  ),
  (
    11,
    'Does your child have difficulty calming down after getting upset?',
    '¿Su hijo tiene dificultad para calmarse después de molestarse?',
    'emotional_regulation',
    24, 216,
    'severity',
    '[{"value": "calms_quickly", "label": "Calms down quickly", "score": 0}, {"value": "needs_help", "label": "Needs help but can calm", "score": 1}, {"value": "very_difficult", "label": "Very difficult to calm", "score": 2.5}, {"value": "extreme", "label": "Extreme difficulty", "score": 3}]'::jsonb,
    1.3,
    'Self-soothing is an important developmental skill.'
  ),

  -- Learning & Cognition (6 questions)
  (
    12,
    'Does your child have difficulty following multi-step directions appropriate for their age?',
    '¿Su hijo tiene dificultad para seguir instrucciones de varios pasos apropiadas para su edad?',
    'learning_cognition',
    36, 216,
    'frequency',
    '[{"value": "no_difficulty", "label": "No difficulty", "score": 0}, {"value": "sometimes", "label": "Sometimes struggles", "score": 1}, {"value": "often", "label": "Often struggles", "score": 2}, {"value": "cannot", "label": "Cannot follow multi-step", "score": 3}]'::jsonb,
    1.2,
    'Following directions involves memory, attention, and processing skills.'
  ),
  (
    13,
    'Does your child struggle with learning new skills compared to peers?',
    '¿Su hijo tiene dificultades para aprender nuevas habilidades en comparación con sus compañeros?',
    'learning_cognition',
    24, 216,
    'severity',
    '[{"value": "learns_easily", "label": "Learns at expected pace", "score": 0}, {"value": "somewhat_slower", "label": "Somewhat slower", "score": 1.5}, {"value": "much_slower", "label": "Much slower", "score": 2.5}, {"value": "significant_delay", "label": "Significant delays", "score": 3}]'::jsonb,
    1.3,
    'Learning pace varies, but significant differences may benefit from support.'
  ),

  -- Sensory Processing (6 questions)
  (
    14,
    'Does your child overreact to certain sounds, lights, textures, or smells?',
    '¿Su hijo reacciona exageradamente a ciertos sonidos, luces, texturas u olores?',
    'sensory_processing',
    12, 216,
    'frequency',
    '[{"value": "no", "label": "No", "score": 0}, {"value": "occasionally", "label": "Occasionally", "score": 1}, {"value": "often", "label": "Often", "score": 2.5}, {"value": "constantly", "label": "Constantly/severely", "score": 3}]'::jsonb,
    1.3,
    'Sensory sensitivities can significantly impact daily functioning.'
  ),
  (
    15,
    'Does your child seek out intense sensory experiences (spinning, crashing, loud noises)?',
    '¿Su hijo busca experiencias sensoriales intensas (girar, chocar, ruidos fuertes)?',
    'sensory_processing',
    24, 216,
    'frequency',
    '[{"value": "no", "label": "No", "score": 0}, {"value": "sometimes", "label": "Sometimes", "score": 0.5}, {"value": "often", "label": "Often", "score": 1.5}, {"value": "constantly", "label": "Constantly", "score": 2}]'::jsonb,
    1.1,
    'Sensory seeking behavior can indicate sensory processing differences.'
  ),

  -- Behavior Patterns (5 questions)
  (
    16,
    'Does your child have very specific routines that cause distress if changed?',
    '¿Su hijo tiene rutinas muy específicas que causan angustia si se cambian?',
    'behavior_patterns',
    24, 216,
    'severity',
    '[{"value": "flexible", "label": "Generally flexible", "score": 0}, {"value": "prefers_routine", "label": "Prefers routine", "score": 0.5}, {"value": "upset_changes", "label": "Gets upset with changes", "score": 2}, {"value": "severe_distress", "label": "Severe distress", "score": 3}]'::jsonb,
    1.2,
    'Some routine preference is normal, but rigidity can be challenging.'
  ),
  (
    17,
    'Does your child engage in repetitive behaviors (hand flapping, rocking, lining up toys)?',
    '¿Su hijo realiza comportamientos repetitivos (agitar las manos, balancearse, alinear juguetes)?',
    'behavior_patterns',
    18, 216,
    'frequency',
    '[{"value": "no", "label": "No", "score": 0}, {"value": "occasionally", "label": "Occasionally", "score": 1}, {"value": "frequently", "label": "Frequently", "score": 2}, {"value": "constantly", "label": "Constantly", "score": 2.5}]'::jsonb,
    1.3,
    'Repetitive behaviors can serve different functions and vary in impact.'
  ),

  -- Speech & Language (6 questions)
  (
    18,
    'Does your child have difficulty being understood by family members or others?',
    '¿Su hijo tiene dificultad para ser entendido por miembros de la familia u otras personas?',
    'speech_language',
    24, 216,
    'severity',
    '[{"value": "understood", "label": "Easily understood", "score": 0}, {"value": "mostly_understood", "label": "Mostly understood", "score": 0.5}, {"value": "difficult", "label": "Difficult to understand", "score": 2}, {"value": "very_difficult", "label": "Very difficult", "score": 3}]'::jsonb,
    1.4,
    'Speech clarity typically improves with age.'
  ),
  (
    19,
    'Is your child using fewer words or shorter sentences than other children their age?',
    '¿Su hijo usa menos palabras o oraciones más cortas que otros niños de su edad?',
    'speech_language',
    24, 216,
    'severity',
    '[{"value": "age_appropriate", "label": "Age-appropriate", "score": 0}, {"value": "slightly_behind", "label": "Slightly behind", "score": 1}, {"value": "noticeably_behind", "label": "Noticeably behind", "score": 2.5}, {"value": "significant_delay", "label": "Significant delay", "score": 3}]'::jsonb,
    1.5,
    'Language development varies but should show steady progress.'
  ),
  (
    20,
    'Does your child have difficulty understanding what others say to them?',
    '¿Su hijo tiene dificultad para entender lo que otros le dicen?',
    'speech_language',
    24, 216,
    'frequency',
    '[{"value": "understands_well", "label": "Understands well", "score": 0}, {"value": "sometimes_confused", "label": "Sometimes confused", "score": 1}, {"value": "often_confused", "label": "Often confused", "score": 2.5}, {"value": "rarely_understands", "label": "Rarely understands", "score": 3}]'::jsonb,
    1.4,
    'Receptive language (understanding) is foundational for communication.'
  )
ON CONFLICT DO NOTHING;
