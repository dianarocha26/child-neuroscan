/*
  # Seed Remaining Condition Recommendations
  
  ## Overview
  Comprehensive recommendations for Speech Delay, Developmental Delay,
  Learning Disorders, Sensory Processing, and other conditions.
*/

DO $$
DECLARE
  speech_id uuid;
  dev_delay_id uuid;
  learning_id uuid;
  sensory_id uuid;
  therapy_cat_id uuid;
  exercises_cat_id uuid;
  education_cat_id uuid;
  nutrition_cat_id uuid;
  behavioral_cat_id uuid;
  family_cat_id uuid;
BEGIN
  SELECT id INTO speech_id FROM conditions WHERE code = 'speech_delay';
  SELECT id INTO dev_delay_id FROM conditions WHERE code = 'developmental_delay';
  SELECT id INTO learning_id FROM conditions WHERE code = 'learning_disorders';
  SELECT id INTO sensory_id FROM conditions WHERE code = 'sensory_processing';
  
  SELECT id INTO therapy_cat_id FROM recommendation_categories WHERE code = 'therapy';
  SELECT id INTO exercises_cat_id FROM recommendation_categories WHERE code = 'exercises';
  SELECT id INTO education_cat_id FROM recommendation_categories WHERE code = 'education';
  SELECT id INTO nutrition_cat_id FROM recommendation_categories WHERE code = 'nutrition';
  SELECT id INTO behavioral_cat_id FROM recommendation_categories WHERE code = 'behavioral';
  SELECT id INTO family_cat_id FROM recommendation_categories WHERE code = 'family';

  -- SPEECH DELAY RECOMMENDATIONS
  
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (speech_id, therapy_cat_id,
    'Speech-Language Therapy',
    'Terapia del Habla y Lenguaje',
    'Essential intervention with a licensed speech-language pathologist. Frequency typically 2-3 sessions per week, focusing on articulation, language comprehension, and expression.',
    'Intervención esencial con un patólogo del habla y lenguaje licenciado. Frecuencia típicamente 2-3 sesiones por semana, enfocándose en articulación, comprensión del lenguaje y expresión.',
    1, ARRAY['moderate', 'high']),
    
  (speech_id, exercises_cat_id,
    'Daily Reading Aloud',
    'Lectura en Voz Alta Diaria',
    'Read to your child for 20-30 minutes daily. Point to pictures, ask questions, and encourage them to repeat words and phrases.',
    'Lea a su hijo durante 20-30 minutos diarios. Señale imágenes, haga preguntas y anímelo a repetir palabras y frases.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (speech_id, exercises_cat_id,
    'Oral Motor Exercises',
    'Ejercicios Orales Motores',
    'Practice blowing bubbles, using straws, making silly faces in mirror. These strengthen oral muscles needed for speech production.',
    'Practique hacer burbujas, usar pajitas, hacer caras divertidas en el espejo. Estos fortalecen los músculos orales necesarios para la producción del habla.',
    2, ARRAY['moderate', 'high']),
    
  (speech_id, exercises_cat_id,
    'Narrate Daily Activities',
    'Narrar Actividades Diarias',
    'Talk through everything you do together. Use simple sentences and emphasize key words. Wait for your child to respond before continuing.',
    'Hable sobre todo lo que hacen juntos. Use oraciones simples y enfatice palabras clave. Espere a que su hijo responda antes de continuar.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (speech_id, nutrition_cat_id,
    'Varied Food Textures',
    'Texturas de Alimentos Variadas',
    'Offer foods with different textures to promote oral motor development. Consult with SLP if child has feeding difficulties.',
    'Ofrezca alimentos con diferentes texturas para promover el desarrollo motor oral. Consulte con un patólogo del habla si el niño tiene dificultades de alimentación.',
    2, ARRAY['moderate', 'high']);

  -- DEVELOPMENTAL DELAY RECOMMENDATIONS
  
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (dev_delay_id, therapy_cat_id,
    'Early Intervention Services',
    'Servicios de Intervención Temprana',
    'Comprehensive program addressing all developmental areas. Contact your state''s early intervention program for evaluation and services (ages 0-3).',
    'Programa integral que aborda todas las áreas del desarrollo. Contacte el programa de intervención temprana de su estado para evaluación y servicios (edades 0-3).',
    1, ARRAY['moderate', 'high']),
    
  (dev_delay_id, therapy_cat_id,
    'Physical Therapy',
    'Terapia Física',
    'For motor delays, PT helps develop strength, coordination, and gross motor skills. Typically 1-3 sessions per week.',
    'Para retrasos motores, la TF ayuda a desarrollar fuerza, coordinación y habilidades motoras gruesas. Típicamente 1-3 sesiones por semana.',
    1, ARRAY['moderate', 'high']),
    
  (dev_delay_id, therapy_cat_id,
    'Occupational Therapy',
    'Terapia Ocupacional',
    'Addresses fine motor skills, sensory processing, and daily living skills. Essential for developing independence.',
    'Aborda habilidades motoras finas, procesamiento sensorial y habilidades de vida diaria. Esencial para desarrollar independencia.',
    1, ARRAY['moderate', 'high']),
    
  (dev_delay_id, exercises_cat_id,
    'Tummy Time and Floor Play',
    'Tiempo Boca Abajo y Juego en el Suelo',
    'For infants and toddlers, increase supervised tummy time and floor play to strengthen muscles and promote motor development.',
    'Para bebés y niños pequeños, aumente el tiempo supervisado boca abajo y el juego en el suelo para fortalecer los músculos y promover el desarrollo motor.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (dev_delay_id, exercises_cat_id,
    'Milestone-Based Play Activities',
    'Actividades de Juego Basadas en Hitos',
    'Focus on activities just above current skill level. Practice stacking, sorting, pretend play, and problem-solving games.',
    'Enfóquese en actividades justo por encima del nivel de habilidad actual. Practique apilar, clasificar, juego imaginativo y juegos de resolución de problemas.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (dev_delay_id, nutrition_cat_id,
    'Nutrient-Rich Diet',
    'Dieta Rica en Nutrientes',
    'Ensure adequate intake of iron, zinc, vitamin D, and B vitamins which support brain development. Consult pediatrician about supplementation if needed.',
    'Asegure una ingesta adecuada de hierro, zinc, vitamina D y vitaminas B que apoyan el desarrollo cerebral. Consulte al pediatra sobre suplementación si es necesario.',
    2, ARRAY['moderate', 'high']);

  -- LEARNING DISORDERS RECOMMENDATIONS
  
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (learning_id, therapy_cat_id,
    'Educational Therapy',
    'Terapia Educativa',
    'Specialized instruction addressing specific learning difficulties. Programs like Wilson Reading, Orton-Gillingham for dyslexia, or TouchMath for dyscalculia.',
    'Instrucción especializada que aborda dificultades de aprendizaje específicas. Programas como Wilson Reading, Orton-Gillingham para dislexia, o TouchMath para discalculia.',
    1, ARRAY['moderate', 'high']),
    
  (learning_id, therapy_cat_id,
    'Cognitive Training',
    'Entrenamiento Cognitivo',
    'Programs focusing on working memory, processing speed, and executive functions. Options include Cogmed, LearningRx, or similar evidence-based programs.',
    'Programas enfocados en memoria de trabajo, velocidad de procesamiento y funciones ejecutivas. Opciones incluyen Cogmed, LearningRx o programas similares basados en evidencia.',
    2, ARRAY['moderate', 'high']),
    
  (learning_id, education_cat_id,
    'IEP with Specific Accommodations',
    'IEP con Adaptaciones Específicas',
    'Secure an IEP or 504 plan including extended time, assistive technology, modified assignments, preferential seating, and alternative testing formats.',
    'Asegure un plan IEP o 504 incluyendo tiempo extendido, tecnología de asistencia, tareas modificadas, asientos preferenciales y formatos de prueba alternativos.',
    1, ARRAY['moderate', 'high']),
    
  (learning_id, exercises_cat_id,
    'Multisensory Learning',
    'Aprendizaje Multisensorial',
    'Use visual, auditory, and kinesthetic approaches simultaneously. For reading: trace letters while saying sounds, use colored overlays, or audio books.',
    'Use enfoques visuales, auditivos y kinestésicos simultáneamente. Para lectura: trace letras mientras dice sonidos, use superposiciones de color o audiolibros.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (learning_id, exercises_cat_id,
    'Daily Practice in Short Sessions',
    'Práctica Diaria en Sesiones Cortas',
    'Practice reading, math, or writing in 15-20 minute focused sessions rather than long, frustrating sessions. Use games and apps to make practice engaging.',
    'Practique lectura, matemáticas o escritura en sesiones enfocadas de 15-20 minutos en lugar de sesiones largas y frustrantes. Use juegos y aplicaciones para hacer la práctica atractiva.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (learning_id, nutrition_cat_id,
    'Brain-Supporting Nutrients',
    'Nutrientes que Apoyan el Cerebro',
    'Emphasize omega-3 fatty acids, complex carbohydrates, and protein for sustained energy and cognitive function. Consider B-complex vitamins.',
    'Enfatice ácidos grasos omega-3, carbohidratos complejos y proteínas para energía sostenida y función cognitiva. Considere vitaminas del complejo B.',
    2, ARRAY['moderate', 'high']);

  -- SENSORY PROCESSING RECOMMENDATIONS
  
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (sensory_id, therapy_cat_id,
    'Occupational Therapy with Sensory Integration',
    'Terapia Ocupacional con Integración Sensorial',
    'Specialized OT using sensory integration techniques. Therapist creates sensory diet tailored to child''s specific needs. Sessions typically 1-3 times weekly.',
    'TO especializada usando técnicas de integración sensorial. El terapeuta crea una dieta sensorial adaptada a las necesidades específicas del niño. Sesiones típicamente 1-3 veces por semana.',
    1, ARRAY['moderate', 'high']),
    
  (sensory_id, exercises_cat_id,
    'Sensory Diet Implementation',
    'Implementación de Dieta Sensorial',
    'Create a personalized sensory diet with activities throughout the day: heavy work (pushing, pulling), vestibular input (swinging), and calming activities.',
    'Cree una dieta sensorial personalizada con actividades durante el día: trabajo pesado (empujar, jalar), entrada vestibular (columpiarse) y actividades calmantes.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (sensory_id, exercises_cat_id,
    'Deep Pressure Activities',
    'Actividades de Presión Profunda',
    'Use weighted blankets, compression clothing, bear hugs, or sandwich activities. Deep pressure is calming for many sensory-sensitive children.',
    'Use mantas pesadas, ropa de compresión, abrazos de oso o actividades de sándwich. La presión profunda es calmante para muchos niños sensibles sensorialmente.',
    2, ARRAY['moderate', 'high']),
    
  (sensory_id, exercises_cat_id,
    'Gradual Sensory Exposure',
    'Exposición Sensorial Gradual',
    'Slowly introduce challenging sensory experiences in controlled, positive contexts. Start with brief exposure and gradually increase tolerance.',
    'Introduzca lentamente experiencias sensoriales desafiantes en contextos controlados y positivos. Comience con exposición breve y aumente gradualmente la tolerancia.',
    1, ARRAY['moderate', 'high']),
    
  (sensory_id, behavioral_cat_id,
    'Sensory-Friendly Environment',
    'Ambiente Amigable Sensorialmente',
    'Modify home environment: use soft lighting, reduce auditory clutter, provide quiet spaces, offer choice in clothing textures.',
    'Modifique el ambiente del hogar: use iluminación suave, reduzca el desorden auditivo, proporcione espacios tranquilos, ofrezca opciones en texturas de ropa.',
    1, ARRAY['low', 'moderate', 'high']),
    
  (sensory_id, exercises_cat_id,
    'Proprioceptive Activities',
    'Actividades Propioceptivas',
    'Heavy work activities like animal walks, pushing weighted cart, carrying groceries, jumping, or wall pushes. These help with body awareness.',
    'Actividades de trabajo pesado como caminatas de animales, empujar carrito pesado, llevar comestibles, saltar o empujar paredes. Estos ayudan con la conciencia corporal.',
    2, ARRAY['low', 'moderate', 'high']);

  -- FAMILY SUPPORT (applies to multiple conditions)
  INSERT INTO recommendations (condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels) VALUES
  (speech_id, family_cat_id,
    'Join Parent Support Groups',
    'Únase a Grupos de Apoyo para Padres',
    'Connect with other families facing similar challenges. Online forums, local support groups, and advocacy organizations provide emotional support and practical advice.',
    'Conéctese con otras familias que enfrentan desafíos similares. Foros en línea, grupos de apoyo local y organizaciones de defensa proporcionan apoyo emocional y consejos prácticos.',
    2, ARRAY['low', 'moderate', 'high']),
    
  (dev_delay_id, family_cat_id,
    'Respite Care Services',
    'Servicios de Cuidado de Respiro',
    'Arrange regular respite care to prevent caregiver burnout. Self-care is essential for providing consistent, quality support to your child.',
    'Organice cuidado de respiro regular para prevenir el agotamiento del cuidador. El autocuidado es esencial para proporcionar apoyo constante y de calidad a su hijo.',
    2, ARRAY['moderate', 'high']),
    
  (learning_id, family_cat_id,
    'Celebrate Effort Over Results',
    'Celebre el Esfuerzo Sobre los Resultados',
    'Focus praise on effort, perseverance, and improvement rather than grades. Build confidence by acknowledging progress in all forms.',
    'Enfoque el elogio en el esfuerzo, la perseverancia y la mejora en lugar de las calificaciones. Construya confianza reconociendo el progreso en todas sus formas.',
    1, ARRAY['low', 'moderate', 'high']);

END $$;
