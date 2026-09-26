-- 15 questions for "asd"
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'e171ddf6-a07c-44bd-aad8-b915ceba6712', c.id, 'Does your child avoid making eye contact or rarely look at you when you talk to them?', '¿Su hijo evita hacer contacto visual o rara vez lo mira cuando le habla?', 1, 1.2, false, 6, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'e171ddf6-a07c-44bd-aad8-b915ceba6712', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'fe4b5480-2219-4835-a25e-0f7c4e2c8a9b', c.id, 'Does your child fail to respond when you call their name, even when their hearing is normal?', '¿Su hijo no responde cuando lo llama por su nombre, incluso cuando su audición es normal?', 2, 1.5, true, 12, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'fe4b5480-2219-4835-a25e-0f7c4e2c8a9b', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'fe4b5480-2219-4835-a25e-0f7c4e2c8a9b', d.id FROM public.functional_domains d WHERE d.code = 'communication'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT '04bde107-8abe-463b-8e90-df675ed92607', c.id, 'Does your child rarely point at objects or things to show interest or share attention with you?', '¿Su hijo rara vez señala objetos o cosas para mostrar interés o compartir atención con usted?', 3, 1.3, false, 12, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '04bde107-8abe-463b-8e90-df675ed92607', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '04bde107-8abe-463b-8e90-df675ed92607', d.id FROM public.functional_domains d WHERE d.code = 'communication'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT '85c2a052-e5b5-485e-8475-80deed761f2a', c.id, 'Does your child have delayed speech development or loss of previously acquired language skills?', '¿Su hijo tiene un desarrollo del habla retrasado o pérdida de habilidades lingüísticas previamente adquiridas?', 4, 1.5, true, 24, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '85c2a052-e5b5-485e-8475-80deed761f2a', d.id FROM public.functional_domains d WHERE d.code = 'communication'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'b9f2c974-7cae-4612-a65b-8892fd55ff5a', c.id, 'Does your child engage in repetitive movements like hand-flapping, rocking, or spinning?', '¿Su hijo realiza movimientos repetitivos como aletear las manos, mecerse o girar?', 5, 1.2, false, 12, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'b9f2c974-7cae-4612-a65b-8892fd55ff5a', d.id FROM public.functional_domains d WHERE d.code = 'behavioral'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'dc9119bb-0210-4003-b468-38f7b360afb0', c.id, 'Does your child become extremely upset with changes in routine or have very rigid behavioral patterns?', '¿Su hijo se molesta extremadamente con cambios en la rutina o tiene patrones de comportamiento muy rígidos?', 6, 1.1, false, 18, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'dc9119bb-0210-4003-b468-38f7b360afb0', d.id FROM public.functional_domains d WHERE d.code = 'behavioral'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT '4073b249-0c77-4275-82e8-04fb4010575b', c.id, 'Does your child show unusual reactions to sounds, textures, lights, or other sensory input?', '¿Su hijo muestra reacciones inusuales a sonidos, texturas, luces u otros estímulos sensoriales?', 7, 1, false, 12, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '4073b249-0c77-4275-82e8-04fb4010575b', d.id FROM public.functional_domains d WHERE d.code = 'sensory'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'c2dbe341-a6ea-48fa-8348-83794ce92e08', c.id, 'Does your child show little interest in other children or prefer to play alone?', '¿Su hijo muestra poco interés en otros niños o prefiere jugar solo?', 8, 1.2, false, 24, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'c2dbe341-a6ea-48fa-8348-83794ce92e08', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'b4619b3a-5889-4a11-ae69-0514c286ce41', c.id, 'Does your child rarely imitate others or engage in pretend play?', '¿Su hijo rara vez imita a otros o participa en juego imaginativo?', 9, 1.2, false, 18, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'b4619b3a-5889-4a11-ae69-0514c286ce41', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'b4619b3a-5889-4a11-ae69-0514c286ce41', d.id FROM public.functional_domains d WHERE d.code = 'cognitive'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT '68efbb9f-8f65-4c53-94c4-2d3bba0d4b3a', c.id, 'Does your child have intense, narrow interests or become fixated on specific objects or topics?', '¿Su hijo tiene intereses intensos y limitados o se fija en objetos o temas específicos?', 10, 1, false, 24, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '68efbb9f-8f65-4c53-94c4-2d3bba0d4b3a', d.id FROM public.functional_domains d WHERE d.code = 'behavioral'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '68efbb9f-8f65-4c53-94c4-2d3bba0d4b3a', d.id FROM public.functional_domains d WHERE d.code = 'cognitive'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT '490a5b3a-c4f2-41d4-bdfd-ae8340c981a5', c.id, 'Does your child have limited facial expressions or difficulty expressing emotions?', '¿Su hijo tiene expresiones faciales limitadas o dificultad para expresar emociones?', 11, 1.1, false, 18, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '490a5b3a-c4f2-41d4-bdfd-ae8340c981a5', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '490a5b3a-c4f2-41d4-bdfd-ae8340c981a5', d.id FROM public.functional_domains d WHERE d.code = 'communication'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'ed532c58-1624-4389-aa3c-36b13dde357b', c.id, 'Does your child repeat words or phrases over and over (echolalia)?', '¿Su hijo repite palabras o frases una y otra vez (ecolalia)?', 12, 1, false, 24, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'ed532c58-1624-4389-aa3c-36b13dde357b', d.id FROM public.functional_domains d WHERE d.code = 'communication'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'ed532c58-1624-4389-aa3c-36b13dde357b', d.id FROM public.functional_domains d WHERE d.code = 'behavioral'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT 'd0ff90d8-e8ab-47c7-82c1-701f5fe62e04', c.id, 'Does your child have difficulty following your gaze or sharing focus on the same object?', '¿Su hijo tiene dificultad para seguir su mirada o compartir el enfoque en el mismo objeto?', 13, 1.3, false, 12, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'd0ff90d8-e8ab-47c7-82c1-701f5fe62e04', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT 'd0ff90d8-e8ab-47c7-82c1-701f5fe62e04', d.id FROM public.functional_domains d WHERE d.code = 'communication'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT '018cd740-b2b0-413c-b212-013e39b16a0e', c.id, 'Does your child have difficulty understanding other people''s feelings or perspectives?', '¿Su hijo tiene dificultad para entender los sentimientos o perspectivas de otras personas?', 14, 1.1, false, 36, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '018cd740-b2b0-413c-b212-013e39b16a0e', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '018cd740-b2b0-413c-b212-013e39b16a0e', d.id FROM public.functional_domains d WHERE d.code = 'cognitive'
ON CONFLICT DO NOTHING;
INSERT INTO public.questions (id, condition_id, question_en, question_es, order_index, weight, is_red_flag, age_min_months, age_max_months)
SELECT '9e91926a-a7fd-4dc2-9f39-9d09369682bd', c.id, 'Has your child lost social or communication skills they previously had?', '¿Su hijo ha perdido habilidades sociales o de comunicación que tenía anteriormente?', 15, 2, true, 12, 216
FROM public.conditions c WHERE c.code = 'asd'
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '9e91926a-a7fd-4dc2-9f39-9d09369682bd', d.id FROM public.functional_domains d WHERE d.code = 'social'
ON CONFLICT DO NOTHING;
INSERT INTO public.question_domains (question_id, domain_id)
SELECT '9e91926a-a7fd-4dc2-9f39-9d09369682bd', d.id FROM public.functional_domains d WHERE d.code = 'communication'
ON CONFLICT DO NOTHING;
