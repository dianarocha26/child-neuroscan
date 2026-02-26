/*
  # Seed Community Sample Data

  ## Overview
  Populates the community with sample posts, comments, and user profiles
  to demonstrate the community features and provide initial content.

  ## Data Included
  - Sample user profiles
  - Sample posts across different categories and conditions
  - Sample comments and discussions
  - Sample likes for engagement
*/

INSERT INTO user_profiles (user_id, display_name, bio, child_conditions) VALUES
('sample_user_1', 'Sarah M.', 'Mom of a wonderful 5-year-old on the autism spectrum. Learning every day!', ARRAY['asd']),
('sample_user_2', 'Michael K.', 'Father of two, one with ADHD. Happy to share what we''ve learned.', ARRAY['adhd']),
('sample_user_3', 'Jennifer L.', 'Speech therapist and mom. My son has a speech delay.', ARRAY['speech']),
('sample_user_4', 'David R.', 'Dad of twins with developmental delays. Always looking for advice.', ARRAY['developmental']),
('sample_user_5', 'Lisa P.', 'Teacher and parent of a child with dyslexia. Advocate for learning differences.', ARRAY['learning']),
('sample_user_6', 'Amanda T.', 'OT mom with a sensory-sensitive kiddo. Love connecting with other parents!', ARRAY['sensory']),
('sample_user_7', 'Robert H.', 'Single dad navigating autism and ADHD. We''re doing great!', ARRAY['asd', 'adhd']);

INSERT INTO community_posts (user_id, author_name, title, content, category, condition_tags, likes_count, comments_count) VALUES
('sample_user_1', 'Sarah M.', 'First day of ABA therapy - what to expect?', 'Hi everyone! My son starts ABA therapy next week and I''m feeling nervous. For those who have been through this, what should I expect on the first day? Any tips to help him feel comfortable? Thank you!', 'question', ARRAY['asd'], 12, 8),

('sample_user_2', 'Michael K.', 'ADHD medication journey - our experience', 'After 6 months of trying different medications, we finally found one that works well for our son with minimal side effects. It''s been a game-changer for his focus at school. Happy to answer questions about our experience. Remember, what works for one child may not work for another, but don''t give up!', 'experience', ARRAY['adhd'], 24, 15),

('sample_user_3', 'Jennifer L.', 'Speech therapy activities you can do at home', 'As both a therapist and a parent, I wanted to share some simple activities that really help with language development:\n\n1. Narrate everything you do\n2. Read the same books repeatedly\n3. Use silly sounds and exaggerated expressions\n4. Give choices (this or that?)\n5. Wait for responses - silence is okay!\n\nThese small things make a big difference. What activities work for your family?', 'advice', ARRAY['speech'], 45, 22),

('sample_user_7', 'Robert H.', 'He said "I love you" for the first time!', 'I''m crying happy tears right now. My 6-year-old son, who was diagnosed with autism at age 3 and has been mostly nonverbal, just said "I love you, Dad" completely unprompted. We''ve worked so hard in speech therapy and I had moments where I worried I''d never hear those words. To every parent out there struggling - keep going. These moments make everything worth it. ❤️', 'celebration', ARRAY['asd', 'speech'], 156, 43),

('sample_user_4', 'David R.', 'How do you handle meltdowns in public?', 'My twins (age 4) both have developmental delays and sometimes have meltdowns in stores or restaurants. I try to stay calm but I feel judged by other people. How do you all handle these situations? Any strategies that work for you?', 'question', ARRAY['developmental'], 18, 27),

('sample_user_5', 'Lisa P.', 'IEP meeting tips - what I wish I knew earlier', 'I''ve been through several IEP meetings now and learned a lot. Here are my top tips:\n\n1. Bring a support person\n2. Take notes or record (with permission)\n3. Don''t sign anything on the spot - take it home to review\n4. Ask questions if you don''t understand\n5. You are an equal member of the team\n6. Request specific, measurable goals\n\nYou are your child''s best advocate. Don''t be afraid to speak up!', 'advice', ARRAY['learning'], 67, 31),

('sample_user_6', 'Amanda T.', 'Sensory-friendly clothing brands?', 'Looking for recommendations for sensory-friendly clothing. My daughter hates tags, seams, and anything tight. We''ve been cutting tags out of everything but there must be better options. What brands do you love?', 'question', ARRAY['sensory'], 15, 19),

('sample_user_3', 'Jennifer L.', 'The power of visual schedules', 'We started using a visual schedule at home 3 months ago and it has reduced anxiety and meltdowns SO much. My son knows what to expect throughout the day. We use actual photos of him doing each activity. Made a huge difference for us!', 'experience', ARRAY['asd', 'developmental'], 38, 12),

('sample_user_2', 'Michael K.', 'Finding the right after-school activities', 'Does anyone have suggestions for after-school activities that work well for kids with ADHD? We tried soccer but it was too chaotic. Looking for something that provides structure but also lets him move and burn energy.', 'question', ARRAY['adhd'], 9, 14),

('sample_user_1', 'Sarah M.', 'Small victory: eye contact!', 'My son has been working on eye contact in therapy and today at dinner he looked right at me while telling me about his day. It might seem small but it felt huge to me. Celebrating these wins!', 'celebration', ARRAY['asd'], 52, 18);

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count) 
SELECT 
  p.id,
  'sample_user_3',
  'Jennifer L.',
  'The first day is usually just getting to know each other! They''ll assess what motivates your child and start building rapport. Bring his favorite toys or snacks. It''s totally normal to feel nervous!',
  8
FROM community_posts p WHERE p.title = 'First day of ABA therapy - what to expect?' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_6',
  'Amanda T.',
  'We also started recently! The therapists were so patient and kind. My daughter warmed up quickly. Don''t worry!',
  4
FROM community_posts p WHERE p.title = 'First day of ABA therapy - what to expect?' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_4',
  'David R.',
  'Thanks for sharing! Can I ask which medication worked? Our doctor mentioned a few options.',
  3
FROM community_posts p WHERE p.title = 'ADHD medication journey - our experience' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_7',
  'Robert H.',
  'This is SO helpful! We do #1 and #2 but I hadn''t thought about using silly sounds. Going to try that!',
  6
FROM community_posts p WHERE p.title = 'Speech therapy activities you can do at home' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_1',
  'Sarah M.',
  'I''m crying reading this! What an amazing moment. Congratulations! ❤️',
  15
FROM community_posts p WHERE p.title = 'He said "I love you" for the first time!' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_5',
  'Lisa P.',
  'This made my day! So happy for you both!',
  12
FROM community_posts p WHERE p.title = 'He said "I love you" for the first time!' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_6',
  'Amanda T.',
  'I carry "autism awareness" cards that I can hand to people who stare. They explain briefly about autism and meltdowns. It helps me feel less anxious about judgment.',
  9
FROM community_posts p WHERE p.title = 'How do you handle meltdowns in public?' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_3',
  'Jennifer L.',
  'Try martial arts! The structure and discipline work well for many kids with ADHD, plus it''s great for self-regulation.',
  7
FROM community_posts p WHERE p.title = 'Finding the right after-school activities' LIMIT 1;

INSERT INTO community_comments (post_id, user_id, author_name, content, likes_count)
SELECT 
  p.id,
  'sample_user_2',
  'Michael K.',
  'That''s wonderful! These moments are so precious. Celebrate every win!',
  5
FROM community_posts p WHERE p.title = 'Small victory: eye contact!' LIMIT 1;