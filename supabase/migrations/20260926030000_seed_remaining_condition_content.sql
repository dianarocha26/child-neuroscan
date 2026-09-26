/*
  # Content for cerebral palsy, epilepsy, intellectual disability and Tourette

  These four conditions had questions but no explanations, recommendations or
  daily tips (PHASE3.md task 6). Same format and tables as
  20260220000218_add_condition_explanations_and_tips.sql,
  20260219235601_seed_remaining_condition_recommendations.sql and
  20260220000401_seed_daily_tips_all_conditions.sql.

  Safe to re-run: explanations only fill empty columns, and rows use fixed ids
  with ON CONFLICT (id) DO NOTHING. Content is general, non-diagnostic parent
  education; no clinical review yet (see PHASE3.md owner decisions).
*/

UPDATE public.conditions SET
  explanation_en = 'Cerebral Palsy (CP) is a group of conditions that affect movement, muscle tone and posture. It is caused by differences in the developing brain, usually before, during or soon after birth. CP does not get worse over time, but how it shows up can change as a child grows. Every child with CP is different: some walk on their own with small differences in balance, while others use a walker or wheelchair. Many children with CP learn and think like their peers, and therapy started early can make a real difference in comfort and independence.',
  explanation_es = 'La Parálisis Cerebral (PC) es un grupo de condiciones que afectan el movimiento, el tono muscular y la postura. Se debe a diferencias en el cerebro en desarrollo, generalmente antes, durante o poco después del nacimiento. La PC no empeora con el tiempo, pero la forma en que se manifiesta puede cambiar a medida que el niño crece. Cada niño con PC es diferente: algunos caminan solos con pequeñas diferencias en el equilibrio, mientras que otros usan un andador o silla de ruedas. Muchos niños con PC aprenden y piensan como sus compañeros, y la terapia temprana puede hacer una diferencia real en su comodidad e independencia.',
  what_parents_see_en = 'You might notice your baby feels very stiff or very floppy when you hold them, uses one hand much more than the other before age 1, reaches milestones like rolling, sitting or walking later than expected, walks on tiptoes, moves in a way that looks jerky or unsteady, or has trouble with sucking, swallowing or speaking clearly.',
  what_parents_see_es = 'Puede notar que su bebé se siente muy rígido o muy flácido al cargarlo, usa una mano mucho más que la otra antes del año, alcanza hitos como rodar, sentarse o caminar más tarde de lo esperado, camina de puntillas, se mueve de forma brusca o inestable, o tiene dificultad para succionar, tragar o hablar con claridad.',
  how_to_help_en = 'Ask your pediatrician about a referral to a specialist and to early intervention (free for ages 0-3 in the U.S.). Physical, occupational and speech therapists can show you daily stretches, positioning and play that fit your child. Practice skills in everyday routines, give your child extra time to move and respond, and focus on what they can do. Equipment like braces or seating supports can make daily life easier.',
  how_to_help_es = 'Pida a su pediatra una referencia a un especialista y a intervención temprana (gratuita para edades 0-3 en EE. UU.). Los terapeutas físicos, ocupacionales y del habla pueden enseñarle estiramientos, posiciones y juegos diarios adecuados para su hijo. Practique habilidades en las rutinas diarias, dé a su hijo tiempo extra para moverse y responder, y enfóquese en lo que sí puede hacer. Equipos como férulas o apoyos para sentarse pueden facilitar la vida diaria.'
WHERE code = 'cerebral_palsy' AND explanation_en IS NULL;

UPDATE public.conditions SET
  explanation_en = 'Epilepsy is a brain condition that causes repeated seizures. A seizure is a sudden burst of electrical activity in the brain that can change how a child moves, behaves, feels or how aware they are for a short time. Not every seizure involves shaking: some look like brief staring spells, sudden jerks or a child seeming confused. Many children with epilepsy have their seizures well controlled with treatment, and some outgrow it. Only a doctor can diagnose epilepsy, usually with tests like an EEG.',
  explanation_es = 'La Epilepsia es una condición del cerebro que causa convulsiones repetidas. Una convulsión es una descarga repentina de actividad eléctrica en el cerebro que puede cambiar por un momento cómo un niño se mueve, se comporta, se siente o qué tan consciente está. No todas las convulsiones incluyen sacudidas: algunas parecen episodios breves de mirada fija, sacudidas repentinas o un niño que parece confundido. Muchos niños con epilepsia tienen sus convulsiones bien controladas con tratamiento, y algunos la superan con el tiempo. Solo un médico puede diagnosticar la epilepsia, generalmente con pruebas como un EEG.',
  what_parents_see_en = 'You might notice staring spells where your child does not respond for a few seconds, sudden jerks of the arms or legs, stiffening or rhythmic shaking, unusual repeated movements like lip smacking or picking at clothes, sudden falls, or confusion and sleepiness after an episode. These episodes often happen the same way each time.',
  what_parents_see_es = 'Puede notar episodios de mirada fija en los que su hijo no responde por unos segundos, sacudidas repentinas de brazos o piernas, rigidez o sacudidas rítmicas, movimientos repetidos inusuales como chasquear los labios o tocar la ropa, caídas repentinas, o confusión y sueño después de un episodio. Estos episodios suelen ocurrir de la misma manera cada vez.',
  how_to_help_en = 'If you suspect seizures, talk to your pediatrician soon; a video of an episode can help the doctor. Learn seizure first aid, keep a simple seizure diary, give medicines exactly as prescribed, and protect sleep, since tiredness can trigger seizures. Make a seizure action plan with your doctor and share it with school and caregivers. Call emergency services if a seizure lasts more than 5 minutes, happens in water, or your child has trouble breathing.',
  how_to_help_es = 'Si sospecha convulsiones, hable pronto con su pediatra; un video de un episodio puede ayudar al médico. Aprenda primeros auxilios para convulsiones, lleve un diario sencillo de convulsiones, dé los medicamentos exactamente como se recetaron y proteja el sueño, ya que el cansancio puede provocar convulsiones. Haga un plan de acción para convulsiones con su médico y compártalo con la escuela y los cuidadores. Llame a emergencias si una convulsión dura más de 5 minutos, ocurre en el agua o su hijo tiene dificultad para respirar.'
WHERE code = 'epilepsy' AND explanation_en IS NULL;

UPDATE public.conditions SET
  explanation_en = 'Intellectual Disability means a child learns, reasons and solves problems more slowly than other children their age, and needs more support with everyday skills like communication, self-care and staying safe. It starts during childhood and can range from mild to more significant. Children with intellectual disability keep learning and growing throughout their lives, and they have their own personalities, strengths and interests. With the right support at home and school, many build real independence.',
  explanation_es = 'La Discapacidad Intelectual significa que un niño aprende, razona y resuelve problemas más lentamente que otros niños de su edad, y necesita más apoyo con habilidades diarias como la comunicación, el cuidado personal y mantenerse seguro. Comienza durante la infancia y puede ir de leve a más significativa. Los niños con discapacidad intelectual siguen aprendiendo y creciendo toda su vida, y tienen sus propias personalidades, fortalezas e intereses. Con el apoyo adecuado en casa y en la escuela, muchos logran una independencia real.',
  what_parents_see_en = 'You might notice your child reaches milestones like talking, dressing or toilet training later than other children, needs many repetitions to learn something new, has trouble remembering or following multi-step directions, finds it hard to understand rules or consequences, struggles with problem solving, or gets frustrated with schoolwork that peers find easy.',
  what_parents_see_es = 'Puede notar que su hijo alcanza hitos como hablar, vestirse o ir al baño más tarde que otros niños, necesita muchas repeticiones para aprender algo nuevo, tiene dificultad para recordar o seguir instrucciones de varios pasos, le cuesta entender reglas o consecuencias, tiene dificultades para resolver problemas o se frustra con tareas escolares que a sus compañeros les resultan fáciles.',
  how_to_help_en = 'Talk to your pediatrician about a developmental evaluation and early intervention (free for ages 0-3 in the U.S.); older children can be evaluated through their school. Teach one small step at a time, show rather than tell, repeat skills in daily routines, use pictures and simple words, and praise effort. Ask the school about an individualized education plan (IEP) and build on the things your child enjoys.',
  how_to_help_es = 'Hable con su pediatra sobre una evaluación del desarrollo e intervención temprana (gratuita para edades 0-3 en EE. UU.); los niños mayores pueden ser evaluados a través de su escuela. Enseñe un pequeño paso a la vez, muestre en lugar de solo explicar, repita habilidades en las rutinas diarias, use imágenes y palabras simples, y elogie el esfuerzo. Pregunte en la escuela por un plan de educación individualizado (IEP) y aproveche las cosas que su hijo disfruta.'
WHERE code = 'intellectual_disability' AND explanation_en IS NULL;

UPDATE public.conditions SET
  explanation_en = 'Tics are sudden, repeated movements or sounds that a child does not fully control, like blinking, shrugging, sniffing or throat clearing. Tics are common in childhood, usually start between ages 5 and 7, and many are mild and fade with time. Tourette Syndrome is one type of tic disorder, where a child has had several movement tics and at least one sound tic for more than a year. Tics often come and go and can get worse with stress, excitement or tiredness. Tics are not a behavior problem, and children with tics are as capable as their peers.',
  explanation_es = 'Los tics son movimientos o sonidos repentinos y repetidos que un niño no controla por completo, como parpadear, encoger los hombros, olfatear o carraspear. Los tics son comunes en la infancia, suelen comenzar entre los 5 y 7 años, y muchos son leves y desaparecen con el tiempo. El Síndrome de Tourette es un tipo de trastorno de tics en el que un niño ha tenido varios tics motores y al menos un tic vocal por más de un año. Los tics suelen ir y venir y pueden empeorar con el estrés, la emoción o el cansancio. Los tics no son un problema de conducta, y los niños con tics son tan capaces como sus compañeros.',
  what_parents_see_en = 'You might notice repeated blinking, eye rolling, facial grimacing, head jerking or shoulder shrugging, or sounds like sniffing, coughing, throat clearing, grunting or repeating words. Your child may say they feel an urge before a tic, may hold tics in at school and let them out at home, and the tics may change type over weeks or months.',
  what_parents_see_es = 'Puede notar parpadeo repetido, girar los ojos, muecas faciales, sacudidas de cabeza o encogimiento de hombros, o sonidos como olfatear, toser, carraspear, gruñir o repetir palabras. Su hijo puede decir que siente una urgencia antes de un tic, puede contener los tics en la escuela y soltarlos en casa, y los tics pueden cambiar de tipo con las semanas o meses.',
  how_to_help_en = 'Try not to point out tics or ask your child to stop, since this usually adds stress and makes tics stronger. Keep routines calm and predictable, protect sleep, and help your child explain tics to friends and teachers. Talk to your pediatrician, especially if tics cause pain, embarrassment, trouble at school, or come with attention or anxiety concerns. A therapy called CBIT can help some children manage tics.',
  how_to_help_es = 'Trate de no señalar los tics ni pedir a su hijo que se detenga, ya que esto suele aumentar el estrés y fortalecer los tics. Mantenga rutinas tranquilas y predecibles, proteja el sueño y ayude a su hijo a explicar los tics a amigos y maestros. Hable con su pediatra, especialmente si los tics causan dolor, vergüenza, problemas en la escuela, o vienen con preocupaciones de atención o ansiedad. Una terapia llamada CBIT puede ayudar a algunos niños a manejar sus tics.'
WHERE code = 'tourette' AND explanation_en IS NULL;

-- Recommendations: cerebral_palsy
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'd9735972-ec94-582a-b6d2-0cef9448869f', c.id, rc.id,
  'Talk to Your Pediatrician', 'Hable con su Pediatra',
  'Share what you have noticed about your child''s movement, muscle tone and milestones. Your pediatrician can check for other causes and refer you to a specialist such as a pediatric neurologist or developmental pediatrician.',
  'Comparta lo que ha notado sobre el movimiento, el tono muscular y los hitos de su hijo. Su pediatra puede descartar otras causas y referirlo a un especialista, como un neurólogo pediátrico o un pediatra del desarrollo.',
  1, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'cerebral_palsy' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '5e15b97f-49e7-5d20-b743-f91168585a6e', c.id, rc.id,
  'Physical Therapy', 'Terapia Física',
  'A physical therapist works on strength, balance, stretching and mobility skills like sitting, standing and walking, and shows you exercises to do at home.',
  'Un terapeuta físico trabaja la fuerza, el equilibrio, los estiramientos y habilidades de movilidad como sentarse, pararse y caminar, y le enseña ejercicios para hacer en casa.',
  1, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'cerebral_palsy' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'e591dc58-2719-5b9d-b738-07995ecc2314', c.id, rc.id,
  'Occupational Therapy', 'Terapia Ocupacional',
  'An occupational therapist helps with hand skills and daily tasks like eating, dressing, playing and writing, and can suggest tools that make these tasks easier.',
  'Un terapeuta ocupacional ayuda con las habilidades de las manos y tareas diarias como comer, vestirse, jugar y escribir, y puede sugerir herramientas que faciliten estas tareas.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'cerebral_palsy' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '0780b044-c8b6-556b-a498-fbc2cc6556ea', c.id, rc.id,
  'Speech and Feeding Support', 'Apoyo del Habla y la Alimentación',
  'If your child has trouble speaking clearly, chewing or swallowing, a speech-language pathologist can help with communication and safe eating.',
  'Si su hijo tiene dificultad para hablar con claridad, masticar o tragar, un patólogo del habla y lenguaje puede ayudar con la comunicación y la alimentación segura.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'cerebral_palsy' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'c2150ffa-b1fd-5a61-8a68-11e42ebab7cb', c.id, rc.id,
  'Active Play Every Day', 'Juego Activo Todos los Días',
  'Offer daily play that gets your child moving in ways that are safe for them, like tummy time, reaching for toys, crawling through tunnels, swimming or adapted bike riding.',
  'Ofrezca juego diario que ponga a su hijo en movimiento de forma segura para él, como tiempo boca abajo, alcanzar juguetes, gatear por túneles, nadar o andar en bicicleta adaptada.',
  2, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'cerebral_palsy' AND rc.code = 'exercises'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '0d80ae24-f47a-5b8e-82df-a15e0ca31082', c.id, rc.id,
  'Mobility and Positioning Equipment', 'Equipo de Movilidad y Posicionamiento',
  'Ask your child''s therapists whether braces, supportive seating, a walker or other equipment could help your child move and play more comfortably.',
  'Pregunte a los terapeutas de su hijo si férulas, asientos de apoyo, un andador u otro equipo podrían ayudar a su hijo a moverse y jugar con más comodidad.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'cerebral_palsy' AND rc.code = 'technology'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'aecbfd68-14c8-56ba-8ab9-d03633e61fc7', c.id, rc.id,
  'Early Intervention and School Support', 'Intervención Temprana y Apoyo Escolar',
  'Contact your local early intervention program (free for ages 0-3 in the U.S.). For school-age children, ask the school about an evaluation for an IEP or 504 plan.',
  'Contacte el programa local de intervención temprana (gratuito para edades 0-3 en EE. UU.). Para niños en edad escolar, pida a la escuela una evaluación para un plan IEP o 504.',
  1, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'cerebral_palsy' AND rc.code = 'family'
ON CONFLICT (id) DO NOTHING;

-- Recommendations: epilepsy
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'fa1603c1-b953-59e5-ac26-e1abbe2d286f', c.id, rc.id,
  'Talk to Your Pediatrician', 'Hable con su Pediatra',
  'Describe the episodes to your pediatrician soon and bring a video if you can. Your doctor can decide whether tests like an EEG or a visit to a pediatric neurologist are needed.',
  'Describa los episodios a su pediatra pronto y lleve un video si puede. Su médico puede decidir si se necesitan pruebas como un EEG o una visita a un neurólogo pediátrico.',
  1, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'epilepsy' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '361cdbe9-e9c0-5405-aa66-0c46a14dc16b', c.id, rc.id,
  'See a Pediatric Neurologist', 'Consulte a un Neurólogo Pediátrico',
  'A pediatric neurologist can find out whether the episodes are seizures, explain the type, and recommend treatment. Many children have their seizures well controlled with the right plan.',
  'Un neurólogo pediátrico puede determinar si los episodios son convulsiones, explicar el tipo y recomendar tratamiento. Muchos niños tienen sus convulsiones bien controladas con el plan adecuado.',
  1, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'epilepsy' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '7d6943eb-9238-523d-b925-5b2cfea4ea05', c.id, rc.id,
  'Learn Seizure First Aid', 'Aprenda Primeros Auxilios para Convulsiones',
  'Stay with your child, time the seizure, move hard objects away, turn them onto their side and put nothing in their mouth. Call emergency services if it lasts more than 5 minutes, happens in water, or your child has trouble breathing or is hurt.',
  'Quédese con su hijo, mida el tiempo de la convulsión, aleje objetos duros, póngalo de lado y no le ponga nada en la boca. Llame a emergencias si dura más de 5 minutos, ocurre en el agua, o su hijo tiene dificultad para respirar o se lastima.',
  1, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'epilepsy' AND rc.code = 'family'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '22fd8d63-ea83-55d9-aefc-d610b07621b8', c.id, rc.id,
  'Keep a Seizure Diary', 'Lleve un Diario de Convulsiones',
  'Write down the date, time, length and what each episode looked like, plus sleep, illness and missed medicines. This helps the doctor spot patterns and adjust treatment.',
  'Anote la fecha, hora, duración y cómo se vio cada episodio, además del sueño, enfermedades y medicamentos olvidados. Esto ayuda al médico a ver patrones y ajustar el tratamiento.',
  2, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'epilepsy' AND rc.code = 'behavioral'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '14ed5ae9-9b3e-5292-a5d2-d336f3a062e7', c.id, rc.id,
  'Protect Sleep and Routines', 'Proteja el Sueño y las Rutinas',
  'Lack of sleep, illness and missed medicines are common seizure triggers. Keep regular bedtimes and give medicines exactly as prescribed.',
  'La falta de sueño, las enfermedades y los medicamentos olvidados son desencadenantes comunes de convulsiones. Mantenga horarios regulares para dormir y dé los medicamentos exactamente como se recetaron.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'epilepsy' AND rc.code = 'behavioral'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '4086dd25-2c56-5c52-9af8-f375820fae99', c.id, rc.id,
  'Seizure Action Plan for School', 'Plan de Acción para Convulsiones en la Escuela',
  'Ask your doctor for a written seizure action plan and share it with teachers, caregivers and coaches. Ask the school whether your child needs a 504 plan or IEP.',
  'Pida a su médico un plan de acción escrito para convulsiones y compártalo con maestros, cuidadores y entrenadores. Pregunte en la escuela si su hijo necesita un plan 504 o IEP.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'epilepsy' AND rc.code = 'education'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '1cb23b8b-a0f0-589c-bfb2-630b1c1022ad', c.id, rc.id,
  'Water and Height Safety', 'Seguridad en el Agua y las Alturas',
  'Until your doctor says otherwise, always supervise baths and swimming closely, prefer showers for older children, and use helmets for biking and climbing.',
  'Hasta que su médico indique lo contrario, supervise siempre de cerca los baños y la natación, prefiera la ducha para niños mayores y use casco para andar en bicicleta y escalar.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'epilepsy' AND rc.code = 'family'
ON CONFLICT (id) DO NOTHING;

-- Recommendations: intellectual_disability
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '2a1da12d-eb99-587b-8f79-bff31d0f5602', c.id, rc.id,
  'Talk to Your Pediatrician', 'Hable con su Pediatra',
  'Share your concerns about how your child learns and manages daily skills. Your pediatrician can check hearing, vision and other health causes and refer you for a developmental evaluation.',
  'Comparta sus preocupaciones sobre cómo su hijo aprende y maneja las habilidades diarias. Su pediatra puede revisar la audición, la visión y otras causas de salud y referirlo a una evaluación del desarrollo.',
  1, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'intellectual_disability' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '4807ba41-9b20-5e76-8284-d7604932a954', c.id, rc.id,
  'Developmental Evaluation', 'Evaluación del Desarrollo',
  'A developmental pediatrician or psychologist can assess thinking, learning and daily living skills to understand your child''s strengths and needs and guide the right supports.',
  'Un pediatra del desarrollo o un psicólogo puede evaluar las habilidades de pensamiento, aprendizaje y vida diaria para entender las fortalezas y necesidades de su hijo y orientar los apoyos adecuados.',
  1, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'intellectual_disability' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '505643c6-0989-5cbe-879b-73eac07a76cd', c.id, rc.id,
  'Speech and Occupational Therapy', 'Terapia del Habla y Ocupacional',
  'Speech therapy supports communication, and occupational therapy supports self-care skills like dressing, eating and toileting. Therapists can give you activities for home.',
  'La terapia del habla apoya la comunicación, y la terapia ocupacional apoya habilidades de cuidado personal como vestirse, comer e ir al baño. Los terapeutas pueden darle actividades para casa.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'intellectual_disability' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '59c7e57d-3ae8-569c-b76e-4a1032512db4', c.id, rc.id,
  'Early Intervention and IEP', 'Intervención Temprana e IEP',
  'Contact early intervention for children under 3 (free in the U.S.). For older children, ask the school for an evaluation for special education services and an individualized education plan (IEP).',
  'Contacte la intervención temprana para niños menores de 3 años (gratuita en EE. UU.). Para niños mayores, pida a la escuela una evaluación para servicios de educación especial y un plan de educación individualizado (IEP).',
  1, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'intellectual_disability' AND rc.code = 'education'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'df335554-0910-5043-b5f7-b2878f481221', c.id, rc.id,
  'Learn Through Everyday Routines', 'Aprender en las Rutinas Diarias',
  'Practice skills during real routines like meals, dressing and shopping. Short, frequent practice in familiar places works better than long lessons.',
  'Practique habilidades durante rutinas reales como las comidas, vestirse e ir de compras. La práctica corta y frecuente en lugares conocidos funciona mejor que las lecciones largas.',
  2, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'intellectual_disability' AND rc.code = 'exercises'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '92e2dade-8634-5931-a379-c2ed64be634d', c.id, rc.id,
  'Break Skills Into Small Steps', 'Dividir Habilidades en Pasos Pequeños',
  'Teach one step at a time, show how to do it, use pictures, and praise each success right away. Add the next step only when the first one feels easy.',
  'Enseñe un paso a la vez, muestre cómo hacerlo, use imágenes y elogie cada logro de inmediato. Agregue el siguiente paso solo cuando el primero resulte fácil.',
  2, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'intellectual_disability' AND rc.code = 'behavioral'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '0b65f1bc-f43e-5676-8a52-97e366c2c833', c.id, rc.id,
  'Connect With Family Support', 'Conecte con Apoyo Familiar',
  'Parent groups and local disability organizations can help with services, rights at school and planning for the future. Taking care of yourself helps your child too.',
  'Los grupos de padres y las organizaciones locales de discapacidad pueden ayudar con servicios, derechos en la escuela y planificación para el futuro. Cuidarse a usted mismo también ayuda a su hijo.',
  3, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'intellectual_disability' AND rc.code = 'family'
ON CONFLICT (id) DO NOTHING;

-- Recommendations: tourette
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '1a910793-4a02-5fdb-bd37-5b452696bfdb', c.id, rc.id,
  'Talk to Your Pediatrician', 'Hable con su Pediatra',
  'Mention the tics at your next visit, or sooner if they are painful, frequent or upsetting. Your pediatrician can check for other causes and refer you to a neurologist if needed.',
  'Mencione los tics en su próxima visita, o antes si son dolorosos, frecuentes o angustiantes. Su pediatra puede descartar otras causas y referirlo a un neurólogo si es necesario.',
  1, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'tourette' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '1bffa487-01b5-5bce-b54b-2bd78b746811', c.id, rc.id,
  'Behavioral Therapy for Tics (CBIT)', 'Terapia Conductual para Tics (CBIT)',
  'Comprehensive Behavioral Intervention for Tics (CBIT) teaches children to notice the urge before a tic and use a competing response. Ask your doctor for a trained therapist.',
  'La Intervención Conductual Integral para Tics (CBIT) enseña a los niños a notar la urgencia antes de un tic y usar una respuesta alternativa. Pida a su médico un terapeuta capacitado.',
  1, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'tourette' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '66095f30-da28-5af0-94ca-dd2ddb2e9b3e', c.id, rc.id,
  'Check for Related Concerns', 'Revise Preocupaciones Relacionadas',
  'Many children with tics also have ADHD, anxiety or obsessive-compulsive behaviors, which can affect daily life more than the tics. Ask your doctor to check for these.',
  'Muchos niños con tics también tienen TDAH, ansiedad o conductas obsesivo-compulsivas, que pueden afectar la vida diaria más que los tics. Pida a su médico que las revise.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'tourette' AND rc.code = 'therapy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '4a707d97-c22f-5033-b8ff-f819b755f74f', c.id, rc.id,
  'Don''t Ask Your Child to Stop', 'No le Pida a su Hijo que se Detenga',
  'Holding tics in is tiring and often makes them stronger later. Try not to comment on tics, and ask family members to do the same.',
  'Contener los tics es agotador y a menudo los hace más fuertes después. Trate de no comentar los tics y pida a los familiares que hagan lo mismo.',
  1, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'tourette' AND rc.code = 'behavioral'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT '913c58e2-1b89-51b3-852a-5dbe5f7c7036', c.id, rc.id,
  'Lower Stress and Protect Sleep', 'Reduzca el Estrés y Proteja el Sueño',
  'Stress, excitement and tiredness often make tics worse. Keep calm, predictable routines and regular bedtimes.',
  'El estrés, la emoción y el cansancio suelen empeorar los tics. Mantenga rutinas tranquilas y predecibles y horarios regulares para dormir.',
  2, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'tourette' AND rc.code = 'behavioral'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'ce946c8d-59ab-5afa-a9fb-851f5a49d804', c.id, rc.id,
  'Talk With the School', 'Hable con la Escuela',
  'Share information about tics with teachers. Helpful supports can include a place to take a short break, extra test time, and a plan for handling teasing.',
  'Comparta información sobre los tics con los maestros. Los apoyos útiles pueden incluir un lugar para tomar un descanso corto, tiempo extra en los exámenes y un plan para manejar las burlas.',
  2, ARRAY['moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'tourette' AND rc.code = 'education'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.recommendations (id, condition_id, category_id, title_en, title_es, description_en, description_es, priority, risk_levels)
SELECT 'd0ec3ec0-0de3-536c-afc8-9c29d60d34a2', c.id, rc.id,
  'Help Your Child Explain Tics', 'Ayude a su Hijo a Explicar los Tics',
  'Practice a short, simple explanation your child can use with friends, like "I have tics. They are movements my body makes that I can''t always control."',
  'Practique una explicación corta y sencilla que su hijo pueda usar con amigos, como "Tengo tics. Son movimientos que hace mi cuerpo y que no siempre puedo controlar."',
  3, ARRAY['low', 'moderate', 'high']
FROM public.conditions c, public.recommendation_categories rc
WHERE c.code = 'tourette' AND rc.code = 'social'
ON CONFLICT (id) DO NOTHING;

-- Daily tips: cerebral_palsy
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '26924000-9c2b-57da-8ff7-f73d7ad5900c', c.id,
  'Stretch During Routines', 'Estirar Durante las Rutinas',
  'Add the gentle stretches your child''s therapist recommends to daily moments like bath time or getting dressed. Move slowly and stop if your child shows pain.',
  'Agregue los estiramientos suaves que recomienda el terapeuta de su hijo a momentos diarios como el baño o al vestirse. Muévase despacio y deténgase si su hijo muestra dolor.',
  10, 'easy', 'motor', 1
FROM public.conditions c WHERE c.code = 'cerebral_palsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '0bfcce7c-38eb-5670-a311-33eb9312753c', c.id,
  'Reach and Grab Play', 'Juego de Alcanzar y Agarrar',
  'Place favorite toys just out of reach on both sides so your child practices reaching, grasping and using both hands. Celebrate every try.',
  'Coloque juguetes favoritos un poco fuera de su alcance a ambos lados para que su hijo practique alcanzar, agarrar y usar ambas manos. Celebre cada intento.',
  10, 'easy', 'play', 2
FROM public.conditions c WHERE c.code = 'cerebral_palsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '5c7bb046-a8a7-5999-bc15-2fdc486b930a', c.id,
  'Change Positions Often', 'Cambiar de Posición con Frecuencia',
  'Help your child spend time in different positions during the day, like sitting with support, lying on their tummy or standing with support, as your therapist suggests.',
  'Ayude a su hijo a pasar tiempo en diferentes posiciones durante el día, como sentado con apoyo, boca abajo o de pie con apoyo, según sugiera su terapeuta.',
  5, 'easy', 'physical', 3
FROM public.conditions c WHERE c.code = 'cerebral_palsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '57be5070-765b-51c9-b855-9211353b190d', c.id,
  'Build Independence in Daily Tasks', 'Fomentar la Independencia en Tareas Diarias',
  'Let your child do one part of a daily task on their own, like holding the cup or pushing an arm through a sleeve. Give extra time instead of doing it for them.',
  'Deje que su hijo haga una parte de una tarea diaria por su cuenta, como sostener el vaso o pasar un brazo por la manga. Dé tiempo extra en lugar de hacerlo por él.',
  10, 'moderate', 'daily_living', 4
FROM public.conditions c WHERE c.code = 'cerebral_palsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'a035b41e-2452-54e0-9a99-eaa0b13e336b', c.id,
  'Give Time to Communicate', 'Dar Tiempo para Comunicarse',
  'Wait a little longer for your child to answer with words, sounds, gestures or pictures. Offering two choices, like "apple or banana?", makes it easier to respond.',
  'Espere un poco más a que su hijo responda con palabras, sonidos, gestos o imágenes. Ofrecer dos opciones, como "¿manzana o plátano?", facilita la respuesta.',
  5, 'easy', 'communication', 5
FROM public.conditions c WHERE c.code = 'cerebral_palsy'
ON CONFLICT (id) DO NOTHING;

-- Daily tips: epilepsy
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '374966c7-5de8-5358-9a46-254c351820e9', c.id,
  'Keep a Regular Sleep Schedule', 'Mantener un Horario de Sueño Regular',
  'Put your child to bed and wake them at about the same time every day, including weekends. Being overtired is a common seizure trigger.',
  'Acueste y despierte a su hijo aproximadamente a la misma hora todos los días, incluidos los fines de semana. El cansancio excesivo es un desencadenante común de convulsiones.',
  5, 'easy', 'routine', 1
FROM public.conditions c WHERE c.code = 'epilepsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '9bd63fce-3144-5681-b1e6-818e56af11f1', c.id,
  'Medicine Routine', 'Rutina de Medicamentos',
  'Give medicine at the same times each day, linked to routines like breakfast and bedtime. A pill box and phone reminder help avoid missed doses.',
  'Dé el medicamento a la misma hora cada día, vinculado a rutinas como el desayuno y la hora de dormir. Un pastillero y un recordatorio en el teléfono ayudan a no olvidar dosis.',
  5, 'easy', 'routine', 2
FROM public.conditions c WHERE c.code = 'epilepsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '43da4dca-0d07-5eff-a34e-81014061496d', c.id,
  'Update the Seizure Diary', 'Actualizar el Diario de Convulsiones',
  'After any episode, write down the time, how long it lasted, what it looked like and what happened before. Bring the diary to every doctor visit.',
  'Después de cualquier episodio, anote la hora, cuánto duró, cómo se vio y qué pasó antes. Lleve el diario a cada visita médica.',
  5, 'easy', 'organization', 3
FROM public.conditions c WHERE c.code = 'epilepsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '36da6d66-c31f-5b06-b5f7-0d318be4eacd', c.id,
  'Practice Seizure First Aid', 'Practicar Primeros Auxilios para Convulsiones',
  'Review the steps with everyone who cares for your child: stay calm, time it, turn them on their side, nothing in the mouth, and when to call emergency services.',
  'Repase los pasos con todos los que cuidan a su hijo: mantener la calma, medir el tiempo, ponerlo de lado, nada en la boca, y cuándo llamar a emergencias.',
  10, 'moderate', 'preparation', 4
FROM public.conditions c WHERE c.code = 'epilepsy'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'e5056d1e-33cd-53ec-963d-8c5ce8039a8f', c.id,
  'Talk About Seizures Simply', 'Hablar de las Convulsiones con Sencillez',
  'Explain seizures in simple, calm words your child understands, and let them ask questions. Knowing what happens can reduce fear for your child and their siblings.',
  'Explique las convulsiones con palabras simples y tranquilas que su hijo entienda, y déjele hacer preguntas. Saber qué pasa puede reducir el miedo de su hijo y de sus hermanos.',
  10, 'easy', 'communication', 5
FROM public.conditions c WHERE c.code = 'epilepsy'
ON CONFLICT (id) DO NOTHING;

-- Daily tips: intellectual_disability
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'd4525e1a-f014-59fa-85ba-a807280c3976', c.id,
  'Picture Steps for Routines', 'Pasos con Imágenes para Rutinas',
  'Make a simple picture chart for one routine, like brushing teeth or getting dressed. Point to each step as your child does it.',
  'Haga una tabla sencilla con imágenes para una rutina, como cepillarse los dientes o vestirse. Señale cada paso mientras su hijo lo hace.',
  15, 'moderate', 'daily_living', 1
FROM public.conditions c WHERE c.code = 'intellectual_disability'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'a1b33781-2301-51da-9dbe-0645e21f0be0', c.id,
  'Show, Then Do Together', 'Mostrar, Luego Hacer Juntos',
  'Show your child how to do a small task, do it together, then let them try on their own. Repeat the same way each day.',
  'Muestre a su hijo cómo hacer una tarea pequeña, háganla juntos y luego déjelo intentarlo solo. Repita de la misma manera cada día.',
  10, 'easy', 'skills', 2
FROM public.conditions c WHERE c.code = 'intellectual_disability'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '4fc5f2ed-763a-5a1f-ae34-199ff3ca860d', c.id,
  'One Direction at a Time', 'Una Instrucción a la Vez',
  'Give one short direction at a time, like "Get your shoes." Wait, help if needed, then praise before giving the next one.',
  'Dé una instrucción corta a la vez, como "Trae tus zapatos." Espere, ayude si es necesario y elogie antes de dar la siguiente.',
  5, 'easy', 'communication', 3
FROM public.conditions c WHERE c.code = 'intellectual_disability'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '7de17e41-c0d3-5485-ac7e-6b6115131e05', c.id,
  'Everyday Counting and Sorting', 'Contar y Clasificar en el Día a Día',
  'Count stairs, sort laundry by color, or match socks together. Everyday games build thinking skills without feeling like homework.',
  'Cuenten escalones, separen la ropa por colores o emparejen calcetines. Los juegos diarios desarrollan habilidades de pensamiento sin sentirse como tarea.',
  10, 'easy', 'cognitive', 4
FROM public.conditions c WHERE c.code = 'intellectual_disability'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '15a91233-20aa-5b87-8232-c969f5ecde4c', c.id,
  'Praise Effort Right Away', 'Elogiar el Esfuerzo de Inmediato',
  'Notice and praise specific efforts as soon as they happen, like "You put your cup away by yourself!" Quick, clear praise helps new skills stick.',
  'Note y elogie esfuerzos específicos en cuanto ocurran, como "¡Guardaste tu vaso tú solo!" Un elogio rápido y claro ayuda a que las nuevas habilidades se afiancen.',
  5, 'easy', 'motivation', 5
FROM public.conditions c WHERE c.code = 'intellectual_disability'
ON CONFLICT (id) DO NOTHING;

-- Daily tips: tourette
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'bc9389d9-694a-5e80-874b-5f8344d72105', c.id,
  'Ignore the Tic, Not the Child', 'Ignorar el Tic, No al Niño',
  'When a tic happens, keep talking and acting as usual. Calm, neutral reactions help your child feel accepted and can lower stress.',
  'Cuando ocurra un tic, siga hablando y actuando con normalidad. Las reacciones tranquilas y neutrales ayudan a su hijo a sentirse aceptado y pueden reducir el estrés.',
  5, 'easy', 'behavior', 1
FROM public.conditions c WHERE c.code = 'tourette'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'ba798422-e96a-5bef-979d-9d479df85799', c.id,
  'Daily Wind-Down Time', 'Tiempo Diario para Relajarse',
  'Plan a calm activity after school, like drawing, a walk or music, so your child has a relaxed place to release tics and reset.',
  'Planifique una actividad tranquila después de la escuela, como dibujar, caminar o escuchar música, para que su hijo tenga un espacio relajado para soltar los tics y recuperarse.',
  15, 'easy', 'regulation', 2
FROM public.conditions c WHERE c.code = 'tourette'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'be40163f-e7fa-5967-b709-581a4baf353f', c.id,
  'Notice Tic Patterns', 'Observar los Patrones de los Tics',
  'Jot down when tics seem stronger or milder, such as after screens, late nights or exciting events. Share the notes with your doctor.',
  'Anote cuándo los tics parecen más fuertes o más leves, por ejemplo después de pantallas, noches tardías o eventos emocionantes. Comparta las notas con su médico.',
  5, 'easy', 'organization', 3
FROM public.conditions c WHERE c.code = 'tourette'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT 'bc387d24-32b1-5986-b0de-b63f75afe7b5', c.id,
  'Practice a Calm Breathing Break', 'Practicar un Descanso de Respiración Tranquila',
  'Practice slow belly breathing together when your child is calm, so it is easier to use when they feel stressed.',
  'Practiquen juntos la respiración lenta con el abdomen cuando su hijo esté tranquilo, para que le sea más fácil usarla cuando se sienta estresado.',
  5, 'easy', 'regulation', 4
FROM public.conditions c WHERE c.code = 'tourette'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.daily_tips (id, condition_id, title_en, title_es, description_en, description_es, time_needed_minutes, difficulty, category, order_index)
SELECT '9e210212-b713-5691-bbba-04820d46f130', c.id,
  'Plan What to Say to Friends', 'Planear Qué Decir a los Amigos',
  'Role-play how your child can answer questions about tics. Having a simple answer ready builds confidence.',
  'Practiquen cómo su hijo puede responder preguntas sobre los tics. Tener una respuesta sencilla lista le da confianza.',
  10, 'moderate', 'social', 5
FROM public.conditions c WHERE c.code = 'tourette'
ON CONFLICT (id) DO NOTHING;
