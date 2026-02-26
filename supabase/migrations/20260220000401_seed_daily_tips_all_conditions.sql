/*
  # Seed Daily Tips for All Conditions
  
  ## Overview
  Practical, actionable daily tips parents can implement at home
  to support their child's development across all conditions.
*/

DO $$
DECLARE
  asd_id uuid;
  adhd_id uuid;
  speech_id uuid;
  dev_delay_id uuid;
  learning_id uuid;
  sensory_id uuid;
BEGIN
  SELECT id INTO asd_id FROM conditions WHERE code = 'asd';
  SELECT id INTO adhd_id FROM conditions WHERE code = 'adhd';
  SELECT id INTO speech_id FROM conditions WHERE code = 'speech_delay';
  SELECT id INTO dev_delay_id FROM conditions WHERE code = 'developmental_delay';
  SELECT id INTO learning_id FROM conditions WHERE code = 'learning_disorders';
  SELECT id INTO sensory_id FROM conditions WHERE code = 'sensory_processing';

  -- ASD DAILY TIPS
  INSERT INTO daily_tips (condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index) VALUES
  (asd_id, 
    'Morning Visual Schedule',
    'Horario Visual Matutino',
    'Start each day by reviewing a visual schedule with pictures showing the day''s routine. Point to each activity and talk about it simply. This reduces anxiety and helps your child know what to expect.',
    'Comience cada día revisando un horario visual con imágenes que muestren la rutina del día. Señale cada actividad y hable sobre ella de manera simple. Esto reduce la ansiedad y ayuda a su hijo a saber qué esperar.',
    5, 'easy', 'routine', 1),
    
  (asd_id,
    'Turn-Taking Games',
    'Juegos de Tomar Turnos',
    'Play simple games that require taking turns, like rolling a ball back and forth or stacking blocks together. Say "my turn" and "your turn" clearly. This builds social skills and joint attention.',
    'Juegue juegos simples que requieran tomar turnos, como rodar una pelota de un lado a otro o apilar bloques juntos. Diga "mi turno" y "tu turno" claramente. Esto desarrolla habilidades sociales y atención conjunta.',
    10, 'easy', 'social', 2),
    
  (asd_id,
    'Sensory Break Time',
    'Tiempo de Descanso Sensorial',
    'Offer a 10-minute sensory break when your child seems overwhelmed. This could be quiet time in a dim room, listening to calming music, or using a weighted blanket. Watch for signs they need a break.',
    'Ofrezca un descanso sensorial de 10 minutos cuando su hijo parezca abrumado. Esto podría ser tiempo tranquilo en una habitación con poca luz, escuchar música relajante o usar una manta pesada. Observe señales de que necesita un descanso.',
    10, 'easy', 'sensory', 3),
    
  (asd_id,
    'Name and Point Activity',
    'Actividad de Nombrar y Señalar',
    'Throughout the day, point to objects and clearly name them. Then ask "where is the [object]?" and encourage pointing. This builds vocabulary and joint attention skills.',
    'Durante el día, señale objetos y nómbrelos claramente. Luego pregunte "¿dónde está el [objeto]?" y anime a señalar. Esto desarrolla vocabulario y habilidades de atención conjunta.',
    15, 'easy', 'communication', 4),
    
  (asd_id,
    'Practice Transitions with Warnings',
    'Practicar Transiciones con Advertencias',
    'Before any change in activity, give a 5-minute warning, then a 2-minute warning. You can use a timer your child can see. This helps them prepare for transitions mentally.',
    'Antes de cualquier cambio de actividad, dé una advertencia de 5 minutos, luego una advertencia de 2 minutos. Puede usar un temporizador que su hijo pueda ver. Esto les ayuda a prepararse mentalmente para las transiciones.',
    5, 'easy', 'behavior', 5),
    
  (asd_id,
    'Social Story Reading',
    'Lectura de Historia Social',
    'Read or create a simple social story about a situation your child finds challenging (like going to the store). Use pictures and simple sentences to explain what will happen and how to respond.',
    'Lea o cree una historia social simple sobre una situación que su hijo encuentre desafiante (como ir a la tienda). Use imágenes y oraciones simples para explicar qué sucederá y cómo responder.',
    15, 'moderate', 'social', 6),
    
  (asd_id,
    'Emotion Matching Game',
    'Juego de Emparejar Emociones',
    'Use flashcards or a mirror to practice identifying emotions. Make faces showing happy, sad, angry, surprised. Ask your child to match or name the emotion. Start with just 2-3 emotions.',
    'Use tarjetas didácticas o un espejo para practicar la identificación de emociones. Haga caras mostrando feliz, triste, enojado, sorprendido. Pida a su hijo que empareje o nombre la emoción. Comience con solo 2-3 emociones.',
    10, 'moderate', 'social', 7);

  -- ADHD DAILY TIPS
  INSERT INTO daily_tips (condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index) VALUES
  (adhd_id,
    'Morning Movement Routine',
    'Rutina de Movimiento Matutino',
    'Start the day with 10 minutes of physical activity: jumping jacks, dancing, running in place, or a quick walk. This helps burn energy and improves focus for the rest of the morning.',
    'Comience el día con 10 minutos de actividad física: saltos, bailar, correr en el lugar o una caminata rápida. Esto ayuda a quemar energía y mejora el enfoque para el resto de la mañana.',
    10, 'easy', 'physical', 1),
    
  (adhd_id,
    'Homework in Chunks',
    'Tarea en Fragmentos',
    'Break homework into 15-minute focused chunks with 5-minute movement breaks between. Set a timer for each chunk. Celebrate completing each section before moving to the next.',
    'Divida la tarea en fragmentos enfocados de 15 minutos con descansos de movimiento de 5 minutos entre ellos. Establezca un temporizador para cada fragmento. Celebre completar cada sección antes de pasar a la siguiente.',
    60, 'moderate', 'education', 2),
    
  (adhd_id,
    'Token Reward System',
    'Sistema de Recompensa con Fichas',
    'Create a simple chart where your child earns stickers or tokens for completing tasks or following rules. When they earn 5-10, trade for a small reward they chose in advance.',
    'Cree un gráfico simple donde su hijo gane calcomanías o fichas por completar tareas o seguir reglas. Cuando ganen 5-10, cámbielas por una pequeña recompensa que eligieron con anticipación.',
    5, 'easy', 'behavior', 3),
    
  (adhd_id,
    'One-Task-At-A-Time Practice',
    'Práctica de Una-Tarea-A-La-Vez',
    'Give only one instruction at a time. Wait for them to complete it before giving the next. For example: "Please put your shoes on" (wait), then "Now get your backpack" (wait).',
    'Dé solo una instrucción a la vez. Espere a que la completen antes de dar la siguiente. Por ejemplo: "Por favor ponte los zapatos" (espere), luego "Ahora toma tu mochila" (espere).',
    10, 'easy', 'behavior', 4),
    
  (adhd_id,
    'Fidget Tool Time',
    'Tiempo de Herramienta Inquieta',
    'Provide appropriate fidget tools (stress ball, fidget spinner, therapy putty) during focus activities like homework or reading. Let them squeeze, twist, or manipulate while working.',
    'Proporcione herramientas inquietas apropiadas (bola anti-estrés, spinner, masilla terapéutica) durante actividades de enfoque como la tarea o la lectura. Déjelos apretar, torcer o manipular mientras trabajan.',
    0, 'easy', 'focus', 5),
    
  (adhd_id,
    'Mindful Breathing Exercise',
    'Ejercicio de Respiración Consciente',
    'Practice simple breathing: breathe in for 4 counts, hold for 4, breathe out for 4. Do this 5 times when your child seems overwhelmed or before transitioning to focus work.',
    'Practique respiración simple: inhale durante 4 conteos, sostenga durante 4, exhale durante 4. Haga esto 5 veces cuando su hijo parezca abrumado o antes de hacer la transición a trabajo de enfoque.',
    5, 'easy', 'regulation', 6),
    
  (adhd_id,
    'Visual Organization System',
    'Sistema de Organización Visual',
    'Use color-coded folders or bins for different subjects or activities. Everything has a specific place with a visual label. Practice putting things in the right place daily.',
    'Use carpetas o contenedores codificados por colores para diferentes materias o actividades. Todo tiene un lugar específico con una etiqueta visual. Practique poner las cosas en el lugar correcto diariamente.',
    10, 'moderate', 'organization', 7);

  -- SPEECH DELAY DAILY TIPS
  INSERT INTO daily_tips (condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index) VALUES
  (speech_id,
    'Narrate Everything',
    'Narrar Todo',
    'Talk about everything you''re doing throughout the day using simple words. "I''m washing the dishes. The water is warm. Here''s a plate." Give your child time to respond or imitate.',
    'Hable sobre todo lo que está haciendo durante el día usando palabras simples. "Estoy lavando los platos. El agua está tibia. Aquí hay un plato." Dé a su hijo tiempo para responder o imitar.',
    30, 'easy', 'communication', 1),
    
  (speech_id,
    'Daily Book Time',
    'Tiempo Diario de Libro',
    'Read the same book repeatedly. Point to pictures and name them. Ask "What''s that?" and wait. Let your child turn pages. Repetition helps them learn and eventually say the words.',
    'Lea el mismo libro repetidamente. Señale imágenes y nómbrelas. Pregunte "¿Qué es eso?" y espere. Deje que su hijo voltee páginas. La repetición les ayuda a aprender y eventualmente decir las palabras.',
    15, 'easy', 'communication', 2),
    
  (speech_id,
    'Expand Their Words',
    'Expandir Sus Palabras',
    'When your child says a word, repeat it back adding one more word. If they say "car," you say "red car" or "big car." This models how to build longer phrases naturally.',
    'Cuando su hijo diga una palabra, repítala agregando una palabra más. Si dicen "carro," usted dice "carro rojo" o "carro grande." Esto modela cómo construir frases más largas naturalmente.',
    10, 'easy', 'communication', 3),
    
  (speech_id,
    'Bubble Play for Sounds',
    'Juego de Burbujas para Sonidos',
    'Blow bubbles together. Practice saying "pop" and "more." Blowing bubbles strengthens oral muscles needed for speech. Make it fun and repeat frequently.',
    'Soplen burbujas juntos. Practiquen decir "pop" y "más." Soplar burbujas fortalece los músculos orales necesarios para el habla. Hágalo divertido y repita frecuentemente.',
    10, 'easy', 'motor', 4),
    
  (speech_id,
    'Choice Offering',
    'Ofrecer Opciones',
    'Give choices that require verbal response: "Do you want apple or banana?" Hold both up and wait. Don''t give the item until they attempt to say the word, even if imperfect.',
    'Dé opciones que requieran respuesta verbal: "¿Quieres manzana o plátano?" Sostenga ambos y espere. No dé el artículo hasta que intenten decir la palabra, incluso si es imperfecta.',
    5, 'moderate', 'communication', 5),
    
  (speech_id,
    'Silly Sounds Game',
    'Juego de Sonidos Tontos',
    'Make animal sounds, car sounds, or silly sounds. Encourage your child to imitate. This is playful sound practice that doesn''t feel like work.',
    'Haga sonidos de animales, sonidos de autos o sonidos tontos. Anime a su hijo a imitar. Esta es práctica de sonidos juguetona que no se siente como trabajo.',
    10, 'easy', 'communication', 6);

  -- DEVELOPMENTAL DELAY DAILY TIPS
  INSERT INTO daily_tips (condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index) VALUES
  (dev_delay_id,
    'Tummy Time Play',
    'Juego en Tiempo Boca Abajo',
    'For babies and young toddlers, do supervised tummy time with engaging toys at eye level. This strengthens neck, shoulder, and core muscles needed for development.',
    'Para bebés y niños pequeños, haga tiempo boca abajo supervisado con juguetes atractivos a nivel de los ojos. Esto fortalece los músculos del cuello, hombros y núcleo necesarios para el desarrollo.',
    15, 'easy', 'motor', 1),
    
  (dev_delay_id,
    'Practice One Skill Daily',
    'Practicar Una Habilidad Diariamente',
    'Choose one skill just above your child''s current level (like stacking blocks or using a spoon). Practice for 10 minutes daily. Break it into smaller steps and celebrate each tiny progress.',
    'Elija una habilidad justo por encima del nivel actual de su hijo (como apilar bloques o usar una cuchara). Practique durante 10 minutos diarios. Divídalo en pasos más pequeños y celebre cada pequeño progreso.',
    10, 'moderate', 'skills', 2),
    
  (dev_delay_id,
    'Floor Play Time',
    'Tiempo de Juego en el Piso',
    'Get on the floor at your child''s level. Follow their lead in play but add new actions to expand their play skills. Model what to do with toys without taking over.',
    'Bájese al piso al nivel de su hijo. Siga su ejemplo en el juego pero agregue nuevas acciones para expandir sus habilidades de juego. Modele qué hacer con los juguetes sin tomar el control.',
    20, 'easy', 'play', 3),
    
  (dev_delay_id,
    'Self-Care Practice',
    'Práctica de Cuidado Personal',
    'Work on one self-care skill like washing hands, putting on shoes, or feeding. Use hand-over-hand guidance, then fade your help as they improve. Be patient - this takes time.',
    'Trabaje en una habilidad de cuidado personal como lavarse las manos, ponerse zapatos o alimentarse. Use guía mano sobre mano, luego reduzca su ayuda a medida que mejoren. Sea paciente - esto lleva tiempo.',
    10, 'moderate', 'daily_living', 4),
    
  (dev_delay_id,
    'Imitation Games',
    'Juegos de Imitación',
    'Play simple imitation games: clap hands, wave bye-bye, touch your nose. This builds important learning skills. Start with actions they can do, then add new ones.',
    'Juegue juegos simples de imitación: aplauda, salude adiós, toque su nariz. Esto desarrolla habilidades de aprendizaje importantes. Comience con acciones que puedan hacer, luego agregue nuevas.',
    10, 'easy', 'cognitive', 5);

  -- LEARNING DISORDERS DAILY TIPS
  INSERT INTO daily_tips (condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index) VALUES
  (learning_id,
    'Multisensory Reading',
    'Lectura Multisensorial',
    'When practicing reading, trace letters in sand or with finger paint while saying the sound. Use multiple senses (seeing, touching, hearing, saying) to reinforce learning.',
    'Al practicar lectura, trace letras en arena o con pintura de dedos mientras dice el sonido. Use múltiples sentidos (ver, tocar, oír, decir) para reforzar el aprendizaje.',
    15, 'moderate', 'reading', 1),
    
  (learning_id,
    'Celebrate Effort, Not Results',
    'Celebrar Esfuerzo, No Resultados',
    'Each day, point out specific effort you noticed: "I saw you kept trying on that hard problem." Focus praise on perseverance, not on whether they got the right answer.',
    'Cada día, señale el esfuerzo específico que notó: "Vi que seguiste intentándolo en ese problema difícil." Enfoque el elogio en la perseverancia, no en si obtuvieron la respuesta correcta.',
    5, 'easy', 'motivation', 2),
    
  (learning_id,
    'Math with Manipulatives',
    'Matemáticas con Manipulativos',
    'Use physical objects (blocks, beans, buttons) for math practice. Let them touch and move objects while counting or solving problems. This makes abstract concepts concrete.',
    'Use objetos físicos (bloques, frijoles, botones) para práctica matemática. Déjelos tocar y mover objetos mientras cuentan o resuelven problemas. Esto hace que los conceptos abstractos sean concretos.',
    15, 'easy', 'math', 3),
    
  (learning_id,
    'Audio Books Before Bed',
    'Audiolibros Antes de Dormir',
    'Listen to audio books together. This builds comprehension and love of stories without the struggle of decoding words. Discuss what happened in the story.',
    'Escuchen audiolibros juntos. Esto desarrolla comprensión y amor por las historias sin la lucha de decodificar palabras. Discutan qué sucedió en la historia.',
    20, 'easy', 'reading', 4),
    
  (learning_id,
    'Memory Strategy Practice',
    'Práctica de Estrategia de Memoria',
    'Teach one memory trick: making a rhyme, creating a picture in their mind, or connecting to something they know. Practice using it daily with homework or spelling words.',
    'Enseñe un truco de memoria: hacer una rima, crear una imagen en su mente o conectar con algo que conocen. Practique usarlo diariamente con la tarea o palabras de ortografía.',
    10, 'moderate', 'strategy', 5),
    
  (learning_id,
    'Break It Down',
    'Dividirlo',
    'For any task, help your child break it into steps. Write or draw each step. Check off each one as completed. This teaches planning and reduces overwhelm.',
    'Para cualquier tarea, ayude a su hijo a dividirla en pasos. Escriba o dibuje cada paso. Marque cada uno como completado. Esto enseña planificación y reduce el agobio.',
    10, 'easy', 'organization', 6);

  -- SENSORY PROCESSING DAILY TIPS
  INSERT INTO daily_tips (condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index) VALUES
  (sensory_id,
    'Morning Heavy Work',
    'Trabajo Pesado Matutino',
    'Start the day with heavy work activities: pushing a loaded laundry basket, carrying groceries, animal walks (bear crawl, crab walk), or wall pushes. This helps organize their nervous system.',
    'Comience el día con actividades de trabajo pesado: empujar una canasta de ropa cargada, cargar comestibles, caminatas de animales (gateo de oso, caminar de cangrejo) o empujones de pared. Esto ayuda a organizar su sistema nervioso.',
    10, 'easy', 'sensory', 1),
    
  (sensory_id,
    'Sensory Bin Exploration',
    'Exploración de Contenedor Sensorial',
    'Create a bin with rice, beans, or sand. Hide small toys inside. Let your child explore at their own pace. Start with less challenging textures if they''re sensitive.',
    'Cree un contenedor con arroz, frijoles o arena. Esconda juguetes pequeños dentro. Deje que su hijo explore a su propio ritmo. Comience con texturas menos desafiantes si son sensibles.',
    15, 'easy', 'sensory', 2),
    
  (sensory_id,
    'Calm Down Space',
    'Espacio para Calmarse',
    'Create a designated calm space with dim lights, soft textures, calming music, or noise-canceling headphones. When overwhelmed, guide your child to use this space.',
    'Cree un espacio designado para calmarse con luces tenues, texturas suaves, música relajante o auriculares con cancelación de ruido. Cuando estén abrumados, guíe a su hijo a usar este espacio.',
    10, 'moderate', 'regulation', 3),
    
  (sensory_id,
    'Oral Sensory Input',
    'Entrada Sensorial Oral',
    'Offer crunchy or chewy snacks (carrots, pretzels, dried fruit, gum if age-appropriate). Many sensory-seeking children benefit from oral input throughout the day.',
    'Ofrezca bocadillos crujientes o masticables (zanahorias, pretzels, fruta seca, chicle si es apropiado para la edad). Muchos niños que buscan sensaciones se benefician de entrada oral durante el día.',
    5, 'easy', 'sensory', 4),
    
  (sensory_id,
    'Compression Hugs',
    'Abrazos de Compresión',
    'Give firm, squeezing hugs or "sandwich" your child between cushions. Many sensory-sensitive children find deep pressure calming. Ask first if they want a "squeeze."',
    'Dé abrazos firmes y apretados o haga "sándwich" a su hijo entre cojines. Muchos niños sensibles sensorialmente encuentran la presión profunda calmante. Pregunte primero si quieren un "apretón."',
    5, 'easy', 'sensory', 5),
    
  (sensory_id,
    'Gradual New Foods',
    'Nuevos Alimentos Graduales',
    'Introduce one new food weekly. Let them touch, smell, and explore it without pressure to eat. Celebrate even small steps like licking or taking a tiny bite.',
    'Introduzca un nuevo alimento semanalmente. Déjelos tocar, oler y explorarlo sin presión para comer. Celebre incluso pequeños pasos como lamer o tomar un bocado pequeño.',
    10, 'moderate', 'feeding', 6),
    
  (sensory_id,
    'Transition Warnings',
    'Advertencias de Transición',
    'Before any sensory-challenging situation (like a busy store), talk about what to expect. Bring comfort items like headphones or a fidget. Have an exit plan if overwhelmed.',
    'Antes de cualquier situación sensorial desafiante (como una tienda concurrida), hable sobre qué esperar. Traiga artículos de confort como auriculares o un juguete inquieto. Tenga un plan de salida si están abrumados.',
    5, 'moderate', 'preparation', 7);

END $$;
