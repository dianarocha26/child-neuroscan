/*
  # Add Condition Explanations and Home Program Tips
  
  ## Overview
  Adds parent-friendly explanations and practical daily tips for each condition
  to help parents understand and support their children at home.
  
  ## Changes
  
  ### 1. Add explanation fields to conditions table
  - `explanation_en` (text) - Clear explanation in English
  - `explanation_es` (text) - Clear explanation in Spanish
  - `what_parents_see_en` (text) - What behaviors/signs parents typically observe
  - `what_parents_see_es` (text) - Spanish version
  - `how_to_help_en` (text) - Quick summary of how parents can help
  - `how_to_help_es` (text) - Spanish version
  
  ### 2. Create daily_tips table
  Individual actionable tips parents can implement daily
  - `id` (uuid, primary key)
  - `condition_id` (uuid, foreign key)
  - `title_en` (text)
  - `title_es` (text)
  - `description_en` (text)
  - `description_es` (text)
  - `time_needed_minutes` (integer)
  - `difficulty` (text) - easy, moderate, challenging
  - `category` (text) - communication, behavior, motor, social, etc.
  - `order_index` (integer)
  
  ## Security
  - Public read access for educational content
*/

-- Add explanation columns to conditions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conditions' AND column_name = 'explanation_en'
  ) THEN
    ALTER TABLE conditions ADD COLUMN explanation_en text;
    ALTER TABLE conditions ADD COLUMN explanation_es text;
    ALTER TABLE conditions ADD COLUMN what_parents_see_en text;
    ALTER TABLE conditions ADD COLUMN what_parents_see_es text;
    ALTER TABLE conditions ADD COLUMN how_to_help_en text;
    ALTER TABLE conditions ADD COLUMN how_to_help_es text;
  END IF;
END $$;

-- Create daily_tips table
CREATE TABLE IF NOT EXISTS daily_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id uuid NOT NULL REFERENCES conditions(id) ON DELETE CASCADE,
  title_en text NOT NULL,
  title_es text NOT NULL,
  description_en text NOT NULL,
  description_es text NOT NULL,
  time_needed_minutes integer DEFAULT 10,
  difficulty text NOT NULL DEFAULT 'easy',
  category text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_tips_condition ON daily_tips(condition_id);
CREATE INDEX IF NOT EXISTS idx_daily_tips_category ON daily_tips(category);
CREATE INDEX IF NOT EXISTS idx_daily_tips_difficulty ON daily_tips(difficulty);

-- Enable RLS
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Public can view daily tips"
  ON daily_tips FOR SELECT
  TO public
  USING (true);

-- Update ASD explanations
UPDATE conditions SET
  explanation_en = 'Autism Spectrum Disorder (ASD) is a developmental condition that affects how a child communicates, interacts with others, and experiences the world around them. Every child with autism is unique, with their own strengths and challenges. Some children may have difficulty with social communication, prefer routines, or process sensory information differently. The word "spectrum" means that autism affects each child differently - some may need significant support in daily life, while others may need less.',
  explanation_es = 'El Trastorno del Espectro Autista (TEA) es una condición del desarrollo que afecta cómo un niño se comunica, interactúa con otros y experimenta el mundo que lo rodea. Cada niño con autismo es único, con sus propias fortalezas y desafíos. Algunos niños pueden tener dificultad con la comunicación social, preferir rutinas o procesar información sensorial de manera diferente. La palabra "espectro" significa que el autismo afecta a cada niño de manera diferente - algunos pueden necesitar apoyo significativo en la vida diaria, mientras que otros pueden necesitar menos.',
  what_parents_see_en = 'You might notice your child prefers to play alone, has difficulty making eye contact, repeats words or phrases, gets upset by changes in routine, has intense interests in specific topics, is sensitive to sounds or textures, or shows unique ways of moving their body (like hand flapping or spinning).',
  what_parents_see_es = 'Puede notar que su hijo prefiere jugar solo, tiene dificultad para hacer contacto visual, repite palabras o frases, se molesta por cambios en la rutina, tiene intereses intensos en temas específicos, es sensible a sonidos o texturas, o muestra formas únicas de mover su cuerpo (como aleteo de manos o giros).',
  how_to_help_en = 'Create predictable routines, use visual schedules, give clear and simple instructions, celebrate small achievements, provide sensory breaks when needed, and connect with therapists who specialize in autism. Most importantly, learn about your child''s unique way of experiencing the world and build on their strengths.',
  how_to_help_es = 'Cree rutinas predecibles, use horarios visuales, dé instrucciones claras y simples, celebre pequeños logros, proporcione descansos sensoriales cuando sea necesario y conéctese con terapeutas especializados en autismo. Lo más importante, aprenda sobre la forma única en que su hijo experimenta el mundo y construya sobre sus fortalezas.'
WHERE code = 'asd';

-- Update ADHD explanations
UPDATE conditions SET
  explanation_en = 'Attention-Deficit/Hyperactivity Disorder (ADHD) is a neurodevelopmental condition that affects a child''s ability to pay attention, control impulsive behaviors, and manage their energy levels. Children with ADHD often have wonderful creativity, enthusiasm, and energy, but may struggle with staying focused on tasks, sitting still, or thinking before acting. ADHD is not about being "bad" or "lazy" - it''s about how their brain is wired differently.',
  explanation_es = 'El Trastorno por Déficit de Atención e Hiperactividad (TDAH) es una condición del neurodesarrollo que afecta la capacidad de un niño para prestar atención, controlar comportamientos impulsivos y manejar sus niveles de energía. Los niños con TDAH a menudo tienen una creatividad, entusiasmo y energía maravillosos, pero pueden tener dificultades para mantener el enfoque en tareas, quedarse quietos o pensar antes de actuar. El TDAH no se trata de ser "malo" o "perezoso" - se trata de cómo su cerebro está conectado de manera diferente.',
  what_parents_see_en = 'Your child might have trouble finishing homework or chores, seem not to listen when spoken to directly, lose things frequently, fidget or squirm constantly, interrupt conversations, have difficulty waiting their turn, make careless mistakes, or struggle to organize tasks.',
  what_parents_see_es = 'Su hijo puede tener problemas para terminar la tarea o los quehaceres, parecer no escuchar cuando se le habla directamente, perder cosas con frecuencia, moverse o retorcerse constantemente, interrumpir conversaciones, tener dificultad para esperar su turno, cometer errores por descuido o tener dificultad para organizar tareas.',
  how_to_help_en = 'Break tasks into smaller steps, create structured routines with visual reminders, provide frequent movement breaks, use positive reinforcement immediately, minimize distractions during focus time, and work with teachers to implement classroom accommodations. Physical activity and consistent sleep schedules are especially important.',
  how_to_help_es = 'Divida las tareas en pasos más pequeños, cree rutinas estructuradas con recordatorios visuales, proporcione descansos de movimiento frecuentes, use refuerzo positivo inmediatamente, minimice las distracciones durante el tiempo de enfoque y trabaje con los maestros para implementar adaptaciones en el aula. La actividad física y los horarios de sueño consistentes son especialmente importantes.'
WHERE code = 'adhd';

-- Update Speech Delay explanations
UPDATE conditions SET
  explanation_en = 'Speech and Language Delay means a child is developing communication skills more slowly than expected for their age. This might involve difficulty saying sounds or words clearly (speech), understanding what others say, or expressing thoughts and needs (language). Many children with speech delays catch up with the right support. It''s important to know that late talking doesn''t mean a child isn''t intelligent - their brain just needs extra help learning to communicate.',
  explanation_es = 'El Retraso del Habla y Lenguaje significa que un niño está desarrollando habilidades de comunicación más lentamente de lo esperado para su edad. Esto puede involucrar dificultad para decir sonidos o palabras claramente (habla), entender lo que otros dicen o expresar pensamientos y necesidades (lenguaje). Muchos niños con retrasos del habla se ponen al día con el apoyo adecuado. Es importante saber que hablar tarde no significa que un niño no sea inteligente - su cerebro solo necesita ayuda adicional para aprender a comunicarse.',
  what_parents_see_en = 'Your child might use fewer words than other children their age, have trouble pronouncing certain sounds, communicate more with gestures than words, struggle to follow directions, or become frustrated when trying to express themselves.',
  what_parents_see_es = 'Su hijo puede usar menos palabras que otros niños de su edad, tener problemas para pronunciar ciertos sonidos, comunicarse más con gestos que con palabras, tener dificultad para seguir instrucciones o frustrarse al tratar de expresarse.',
  how_to_help_en = 'Talk to your child constantly throughout the day, read books together daily, give them time to respond without rushing, repeat and expand on what they say, use simple and clear language, and work with a speech therapist. Make communication fun through songs, games, and playful interactions.',
  how_to_help_es = 'Hable con su hijo constantemente durante el día, lean libros juntos diariamente, déle tiempo para responder sin apresurarse, repita y expanda lo que dicen, use lenguaje simple y claro y trabaje con un terapeuta del habla. Haga que la comunicación sea divertida a través de canciones, juegos e interacciones juguetonas.'
WHERE code = 'speech_delay';

-- Update Developmental Delay explanations
UPDATE conditions SET
  explanation_en = 'Developmental Delay means a child is progressing more slowly in one or more areas of development - such as physical skills (sitting, walking), thinking skills, communication, social abilities, or daily living skills. This doesn''t mean they won''t learn these skills, but rather that they need more time and support. Early intervention can make a significant difference in helping children reach their full potential.',
  explanation_es = 'El Retraso del Desarrollo significa que un niño está progresando más lentamente en una o más áreas del desarrollo - como habilidades físicas (sentarse, caminar), habilidades de pensamiento, comunicación, habilidades sociales o habilidades de vida diaria. Esto no significa que no aprenderán estas habilidades, sino que necesitan más tiempo y apoyo. La intervención temprana puede hacer una diferencia significativa para ayudar a los niños a alcanzar su máximo potencial.',
  what_parents_see_en = 'You might notice your child reached milestones like sitting, crawling, or walking later than expected, has difficulty with coordination or balance, struggles with self-care tasks like feeding or dressing, plays differently than peers, or has trouble understanding or following instructions.',
  what_parents_see_es = 'Puede notar que su hijo alcanzó hitos como sentarse, gatear o caminar más tarde de lo esperado, tiene dificultad con la coordinación o el equilibrio, tiene dificultades con tareas de cuidado personal como alimentarse o vestirse, juega de manera diferente a sus compañeros o tiene problemas para entender o seguir instrucciones.',
  how_to_help_en = 'Contact your state''s early intervention program (free for ages 0-3), provide lots of floor time and play opportunities, break skills into smaller steps, practice daily living skills consistently, celebrate every small progress, and work with therapists to implement activities at home.',
  how_to_help_es = 'Contacte el programa de intervención temprana de su estado (gratuito para edades 0-3), proporcione mucho tiempo en el piso y oportunidades de juego, divida las habilidades en pasos más pequeños, practique habilidades de vida diaria consistentemente, celebre cada pequeño progreso y trabaje con terapeutas para implementar actividades en casa.'
WHERE code = 'developmental_delay';

-- Update Learning Disorders explanations
UPDATE conditions SET
  explanation_en = 'Learning Disorders (also called Learning Disabilities) are neurological differences that affect how a child''s brain processes information. Common types include dyslexia (reading difficulties), dyscalculia (math difficulties), and dysgraphia (writing difficulties). Children with learning disorders are just as intelligent as their peers - their brains simply process certain types of information differently. With the right strategies and support, they can be very successful.',
  explanation_es = 'Los Trastornos del Aprendizaje (también llamados Discapacidades de Aprendizaje) son diferencias neurológicas que afectan cómo el cerebro de un niño procesa la información. Los tipos comunes incluyen dislexia (dificultades de lectura), discalculia (dificultades matemáticas) y disgrafía (dificultades de escritura). Los niños con trastornos del aprendizaje son tan inteligentes como sus compañeros - sus cerebros simplemente procesan ciertos tipos de información de manera diferente. Con las estrategias y el apoyo adecuados, pueden tener mucho éxito.',
  what_parents_see_en = 'Your child might struggle with reading despite trying hard, avoid homework or reading, have difficulty remembering facts, mix up letters or numbers, take much longer than peers to complete assignments, have messy handwriting, or show anxiety about school.',
  what_parents_see_es = 'Su hijo puede tener dificultades con la lectura a pesar de esforzarse, evitar la tarea o la lectura, tener dificultad para recordar hechos, mezclar letras o números, tardar mucho más que sus compañeros en completar tareas, tener letra desordenada o mostrar ansiedad por la escuela.',
  how_to_help_en = 'Get a comprehensive evaluation to understand your child''s specific needs, work with the school to create an IEP or 504 plan, use multisensory learning approaches, break study sessions into short focused periods, focus on effort rather than grades, provide assistive technology, and help your child discover their strengths.',
  how_to_help_es = 'Obtenga una evaluación integral para entender las necesidades específicas de su hijo, trabaje con la escuela para crear un plan IEP o 504, use enfoques de aprendizaje multisensorial, divida las sesiones de estudio en períodos cortos y enfocados, enfóquese en el esfuerzo en lugar de las calificaciones, proporcione tecnología de asistencia y ayude a su hijo a descubrir sus fortalezas.'
WHERE code = 'learning_disorders';

-- Update Sensory Processing explanations
UPDATE conditions SET
  explanation_en = 'Sensory Processing Disorder (SPD) occurs when the brain has difficulty receiving and responding to information from the senses. Children with SPD might be overly sensitive to sensations (sounds, textures, lights) or under-sensitive and seek more sensory input. This isn''t about being "difficult" or "picky" - their nervous system genuinely experiences sensations differently, which can be overwhelming or underwhelming.',
  explanation_es = 'El Trastorno de Procesamiento Sensorial (TPS) ocurre cuando el cerebro tiene dificultad para recibir y responder a la información de los sentidos. Los niños con TPS pueden ser demasiado sensibles a las sensaciones (sonidos, texturas, luces) o poco sensibles y buscar más entrada sensorial. Esto no se trata de ser "difícil" o "quisquilloso" - su sistema nervioso genuinamente experimenta las sensaciones de manera diferente, lo que puede ser abrumador o insuficiente.',
  what_parents_see_en = 'Your child might cover their ears at normal sounds, refuse to wear certain clothing, be a picky eater due to textures, avoid getting messy, seem unaware of pain, crash into things constantly, have meltdowns in busy environments, or seek intense physical activity.',
  what_parents_see_es = 'Su hijo puede cubrirse los oídos ante sonidos normales, negarse a usar cierta ropa, ser un comedor quisquilloso debido a las texturas, evitar ensuciarse, parecer inconsciente del dolor, chocar constantemente con cosas, tener colapsos en ambientes concurridos o buscar actividad física intensa.',
  how_to_help_en = 'Work with an occupational therapist to create a "sensory diet", provide sensory tools (fidgets, weighted blankets, noise-canceling headphones), create a calm space at home, warn about sensory experiences in advance, respect their sensory needs, and gradually introduce challenging sensations in a supportive way.',
  how_to_help_es = 'Trabaje con un terapeuta ocupacional para crear una "dieta sensorial", proporcione herramientas sensoriales (juguetes inquietos, mantas pesadas, auriculares con cancelación de ruido), cree un espacio tranquilo en casa, advierta sobre experiencias sensoriales con anticipación, respete sus necesidades sensoriales e introduzca gradualmente sensaciones desafiantes de manera solidaria.'
WHERE code = 'sensory_processing';
