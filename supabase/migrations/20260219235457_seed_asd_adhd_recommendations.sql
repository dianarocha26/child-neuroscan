/*
  # Seed ASD and ADHD Recommendations
  
  ## Overview
  Comprehensive evidence-based recommendations for Autism Spectrum Disorder
  and ADHD including therapies, exercises, interventions, and support strategies.
*/

DO $$
DECLARE
  asd_id uuid;
  adhd_id uuid;
  therapy_cat_id uuid;
  exercises_cat_id uuid;
  education_cat_id uuid;
  nutrition_cat_id uuid;
  behavioral_cat_id uuid;
  social_cat_id uuid;
  technology_cat_id uuid;
  family_cat_id uuid;
BEGIN
  SELECT id INTO asd_id FROM conditions WHERE code = 'asd';
  SELECT id INTO adhd_id FROM conditions WHERE code = 'adhd';
  
  SELECT id INTO therapy_cat_id FROM recommendation_categories WHERE code = 'therapy';
  SELECT id INTO exercises_cat_id FROM recommendation_categories WHERE code = 'exercises';
  SELECT id INTO education_cat_id FROM recommendation_categories WHERE code = 'education';
  SELECT id INTO nutrition_cat_id FROM recommendation_categories WHERE code = 'nutrition';
  SELECT id INTO behavioral_cat_id FROM recommendation_categories WHERE code = 'behavioral';
  SELECT id INTO social_cat_id FROM recommendation_categories WHERE code = 'social';
  SELECT id INTO technology_cat_id FROM recommendation_categories WHERE code = 'technology';
  SELECT id INTO family_cat_id FROM recommendation_categories WHERE code = 'family';

  -- ASD RECOMMENDATIONS
  
  -- Therapies
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (asd_id, therapy_cat_id,
    'Applied Behavior Analysis (ABA)',
    'Análisis Conductual Aplicado (ABA)',
    'Evidence-based therapy focusing on improving specific behaviors through positive reinforcement. ABA can help develop communication, social, and learning skills. Typically involves 20-40 hours per week for intensive programs.',
    'Terapia basada en evidencia que se enfoca en mejorar comportamientos específicos mediante refuerzo positivo. ABA puede ayudar a desarrollar habilidades de comunicación, sociales y de aprendizaje. Típicamente involucra 20-40 horas por semana para programas intensivos.',
    1, ARRAY['moderate', 'high']),
    
  (asd_id, therapy_cat_id,
    'Speech-Language Therapy',
    'Terapia del Habla y Lenguaje',
    'Specialized therapy to improve communication skills including verbal and non-verbal communication, conversation skills, and understanding social cues. Sessions typically 2-3 times per week.',
    'Terapia especializada para mejorar habilidades de comunicación incluyendo comunicación verbal y no verbal, habilidades de conversación y comprensión de señales sociales. Sesiones típicamente 2-3 veces por semana.',
    1, ARRAY['moderate', 'high']),
    
  (asd_id, therapy_cat_id,
    'Occupational Therapy (OT)',
    'Terapia Ocupacional',
    'Helps develop fine motor skills, sensory integration, and daily living skills. OT addresses sensory sensitivities and helps with self-care activities. Recommended 1-3 times per week.',
    'Ayuda a desarrollar habilidades motoras finas, integración sensorial y habilidades de vida diaria. La TO aborda sensibilidades sensoriales y ayuda con actividades de cuidado personal. Recomendado 1-3 veces por semana.',
    1, ARRAY['moderate', 'high']),
    
  (asd_id, therapy_cat_id,
    'Social Skills Training',
    'Entrenamiento de Habilidades Sociales',
    'Structured group or individual therapy focusing on developing peer relationships, understanding emotions, turn-taking, and social communication. Often conducted in small group settings.',
    'Terapia grupal o individual estructurada enfocada en desarrollar relaciones con compañeros, comprender emociones, tomar turnos y comunicación social. A menudo se realiza en grupos pequeños.',
    1, ARRAY['low', 'moderate', 'high']);

  -- Exercises & Activities
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (asd_id, exercises_cat_id,
    'Visual Schedule Implementation',
    'Implementación de Horario Visual',
    'Create daily visual schedules using pictures or symbols to help your child understand routines and transitions. This reduces anxiety and increases independence.',
    'Cree horarios visuales diarios usando imágenes o símbolos para ayudar a su hijo a entender rutinas y transiciones. Esto reduce la ansiedad y aumenta la independencia.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (asd_id, exercises_cat_id,
    'Sensory Play Activities',
    'Actividades de Juego Sensorial',
    'Engage in sensory activities like play-dough, sand, water play, or textured materials. Start with 10-15 minutes daily to improve sensory tolerance and integration.',
    'Participe en actividades sensoriales como plastilina, arena, juego con agua o materiales texturizados. Comience con 10-15 minutos diarios para mejorar la tolerancia e integración sensorial.',
    2, ARRAY['low', 'moderate', 'high']),
    
  (asd_id, exercises_cat_id,
    'Joint Attention Practice',
    'Práctica de Atención Conjunta',
    'Practice sharing attention by pointing to objects, following gaze, and playing turn-taking games. Use favorite toys and activities to encourage engagement.',
    'Practique compartir atención señalando objetos, siguiendo la mirada y jugando juegos de tomar turnos. Use juguetes y actividades favoritas para fomentar el compromiso.',
    1, ARRAY['moderate', 'high']),
    
  (asd_id, exercises_cat_id,
    'Structured Playtime',
    'Tiempo de Juego Estructurado',
    'Set up predictable play sessions with clear beginnings and endings. Model appropriate play behaviors and gradually introduce pretend play scenarios.',
    'Establezca sesiones de juego predecibles con comienzos y finales claros. Modele comportamientos de juego apropiados e introduzca gradualmente escenarios de juego imaginativo.',
    2, ARRAY['low', 'moderate', 'high']);

  -- Nutrition
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (asd_id, nutrition_cat_id,
    'Omega-3 Fatty Acids',
    'Ácidos Grasos Omega-3',
    'Consider supplementing with omega-3 fatty acids (fish oil). Some studies suggest benefits for cognitive function and behavior. Consult pediatrician for appropriate dosage.',
    'Considere suplementar con ácidos grasos omega-3 (aceite de pescado). Algunos estudios sugieren beneficios para la función cognitiva y el comportamiento. Consulte al pediatra para la dosis apropiada.',
    2, ARRAY['low', 'moderate', 'high']),
    
  (asd_id, nutrition_cat_id,
    'Balanced Nutrition Despite Food Selectivity',
    'Nutrición Equilibrada a Pesar de la Selectividad Alimentaria',
    'Work with a nutritionist to ensure adequate nutrition despite limited food preferences. Gradually introduce new foods using systematic desensitization techniques.',
    'Trabaje con un nutricionista para asegurar una nutrición adecuada a pesar de las preferencias alimentarias limitadas. Introduzca gradualmente nuevos alimentos usando técnicas de desensibilización sistemática.',
    2, ARRAY['moderate', 'high']);

  -- Behavioral Strategies
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (asd_id, behavioral_cat_id,
    'Positive Reinforcement System',
    'Sistema de Refuerzo Positivo',
    'Implement a consistent reward system for desired behaviors. Use immediate, specific praise and tangible rewards that are meaningful to your child.',
    'Implemente un sistema de recompensas consistente para comportamientos deseados. Use elogios inmediatos y específicos y recompensas tangibles que sean significativas para su hijo.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (asd_id, behavioral_cat_id,
    'Managing Transitions',
    'Manejo de Transiciones',
    'Give advance warnings before transitions (5-minute, 2-minute warnings). Use visual timers and prepare your child for changes in routine.',
    'Dé advertencias previas antes de las transiciones (advertencias de 5 minutos, 2 minutos). Use temporizadores visuales y prepare a su hijo para cambios en la rutina.',
    1, ARRAY['moderate', 'high']);

  -- ADHD RECOMMENDATIONS
  
  -- Therapies
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (adhd_id, therapy_cat_id,
    'Behavioral Therapy',
    'Terapia Conductual',
    'Evidence-based therapy teaching strategies for managing impulsivity, improving organization, and developing coping skills. Parent training is a crucial component.',
    'Terapia basada en evidencia que enseña estrategias para manejar la impulsividad, mejorar la organización y desarrollar habilidades de afrontamiento. El entrenamiento de padres es un componente crucial.',
    1, ARRAY['moderate', 'high']),
    
  (adhd_id, therapy_cat_id,
    'Cognitive Behavioral Therapy (CBT)',
    'Terapia Cognitivo-Conductual (TCC)',
    'Helps older children and teens develop strategies for managing ADHD symptoms, including organization, time management, and emotional regulation.',
    'Ayuda a niños mayores y adolescentes a desarrollar estrategias para manejar síntomas de TDAH, incluyendo organización, manejo del tiempo y regulación emocional.',
    1, ARRAY['moderate', 'high']),
    
  (adhd_id, therapy_cat_id,
    'Parent Management Training',
    'Entrenamiento de Manejo Parental',
    'Evidence-based program teaching parents effective strategies for managing behavior, establishing routines, and improving parent-child interactions.',
    'Programa basado en evidencia que enseña a los padres estrategias efectivas para manejar el comportamiento, establecer rutinas y mejorar las interacciones padre-hijo.',
    1, ARRAY['moderate', 'high']);

  -- Exercises & Activities
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (adhd_id, exercises_cat_id,
    'Regular Physical Exercise',
    'Ejercicio Físico Regular',
    'Engage in at least 60 minutes of physical activity daily. Activities like swimming, martial arts, or team sports can improve focus and reduce hyperactivity.',
    'Participe en al menos 60 minutos de actividad física diaria. Actividades como natación, artes marciales o deportes de equipo pueden mejorar el enfoque y reducir la hiperactividad.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (adhd_id, exercises_cat_id,
    'Mindfulness and Breathing Exercises',
    'Ejercicios de Atención Plena y Respiración',
    'Practice daily mindfulness exercises (5-10 minutes) to improve attention and self-regulation. Start with simple breathing exercises and gradually increase complexity.',
    'Practique ejercicios diarios de atención plena (5-10 minutos) para mejorar la atención y autorregulación. Comience con ejercicios simples de respiración y aumente gradualmente la complejidad.',
    2, ARRAY['low', 'moderate', 'high']),
    
  (adhd_id, exercises_cat_id,
    'Working Memory Games',
    'Juegos de Memoria de Trabajo',
    'Play memory games, card matching, and puzzle activities to strengthen working memory. Apps like Cogmed or BrainHQ can provide structured training.',
    'Juegue juegos de memoria, emparejamiento de cartas y actividades de rompecabezas para fortalecer la memoria de trabajo. Aplicaciones como Cogmed o BrainHQ pueden proporcionar entrenamiento estructurado.',
    2, ARRAY['moderate', 'high']),
    
  (adhd_id, exercises_cat_id,
    'Break Tasks into Smaller Steps',
    'Dividir Tareas en Pasos Más Pequeños',
    'Teach your child to break large tasks into manageable chunks. Use checklists and celebrate completion of each step to maintain motivation.',
    'Enseñe a su hijo a dividir tareas grandes en partes manejables. Use listas de verificación y celebre la finalización de cada paso para mantener la motivación.',
    1, ARRAY['low', 'moderate', 'high']);

  -- Education
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (adhd_id, education_cat_id,
    'IEP or 504 Plan',
    'Plan IEP o 504',
    'Work with school to establish accommodations such as preferential seating, extended time on tests, frequent breaks, and modified assignments.',
    'Trabaje con la escuela para establecer adaptaciones como asientos preferenciales, tiempo extendido en exámenes, descansos frecuentes y tareas modificadas.',
    1, ARRAY['moderate', 'high']),
    
  (adhd_id, education_cat_id,
    'Structured Homework Routine',
    'Rutina de Tareas Estructurada',
    'Establish a consistent homework time and location. Minimize distractions, use timers for work periods, and incorporate frequent short breaks.',
    'Establezca un tiempo y lugar consistente para la tarea. Minimice las distracciones, use temporizadores para períodos de trabajo e incorpore descansos cortos frecuentes.',
    1, ARRAY['low', 'moderate', 'high']);

  -- Nutrition
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (adhd_id, nutrition_cat_id,
    'Protein-Rich Breakfast',
    'Desayuno Rico en Proteínas',
    'Start each day with a protein-rich breakfast to support sustained attention and energy levels. Avoid sugary cereals and opt for eggs, yogurt, or nut butter.',
    'Comience cada día con un desayuno rico en proteínas para apoyar la atención sostenida y los niveles de energía. Evite cereales azucarados y opte por huevos, yogur o mantequilla de nueces.',
    2, ARRAY['low', 'moderate', 'high']),
    
  (adhd_id, nutrition_cat_id,
    'Limit Sugar and Artificial Additives',
    'Limitar Azúcar y Aditivos Artificiales',
    'Reduce consumption of sugar, artificial colors, and preservatives. Some children show improved behavior with elimination of these substances.',
    'Reduzca el consumo de azúcar, colores artificiales y conservantes. Algunos niños muestran un comportamiento mejorado con la eliminación de estas sustancias.',
    2, ARRAY['moderate', 'high']),
    
  (adhd_id, nutrition_cat_id,
    'Omega-3 Supplementation',
    'Suplementación de Omega-3',
    'Consider omega-3 supplements (EPA and DHA) which have shown benefits for attention and executive function in some studies. Consult your pediatrician for dosing.',
    'Considere suplementos de omega-3 (EPA y DHA) que han mostrado beneficios para la atención y función ejecutiva en algunos estudios. Consulte a su pediatra para la dosificación.',
    2, ARRAY['moderate', 'high']);

  -- Behavioral Strategies
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (adhd_id, behavioral_cat_id,
    'Token Economy System',
    'Sistema de Economía de Fichas',
    'Implement a point or token system where children earn rewards for completing tasks and following rules. Make rewards immediate and meaningful.',
    'Implemente un sistema de puntos o fichas donde los niños ganan recompensas por completar tareas y seguir reglas. Haga que las recompensas sean inmediatas y significativas.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (adhd_id, behavioral_cat_id,
    'Clear Rules and Consequences',
    'Reglas y Consecuencias Claras',
    'Establish 3-5 simple, clear household rules. Post them visibly and ensure consequences are immediate, consistent, and logical.',
    'Establezca 3-5 reglas domésticas simples y claras. Publíquelas visiblemente y asegúrese de que las consecuencias sean inmediatas, consistentes y lógicas.',
    1, ARRAY['moderate', 'high']),
    
  (adhd_id, behavioral_cat_id,
    'Fidget Tools and Movement Breaks',
    'Herramientas para Inquietud y Pausas de Movimiento',
    'Allow appropriate fidget tools (stress balls, fidget spinners) and scheduled movement breaks to help manage hyperactivity constructively.',
    'Permita herramientas apropiadas para inquietud (bolas anti-estrés, spinners) y pausas de movimiento programadas para ayudar a manejar la hiperactividad de manera constructiva.',
    2, ARRAY['moderate', 'high']);

  -- Technology
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (adhd_id, technology_cat_id,
    'Organization Apps',
    'Aplicaciones de Organización',
    'Use apps like Todoist, Google Keep, or specialized ADHD apps to help with task management, reminders, and time tracking.',
    'Use aplicaciones como Todoist, Google Keep o aplicaciones especializadas de TDAH para ayudar con la gestión de tareas, recordatorios y seguimiento del tiempo.',
    2, ARRAY['moderate', 'high']),
    
  (adhd_id, technology_cat_id,
    'Visual Timers',
    'Temporizadores Visuales',
    'Use visual timer apps or physical timers to help with time awareness and task completion. Time Timer is a popular option.',
    'Use aplicaciones de temporizador visual o temporizadores físicos para ayudar con la conciencia del tiempo y la finalización de tareas. Time Timer es una opción popular.',
    2, ARRAY['low', 'moderate', 'high']);

END $$;
