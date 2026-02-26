/*
  # Seed Video Library with Educational Content

  1. Sample Videos
    - Educational videos for each condition type
    - Various age groups and difficulty levels
    - Multiple categories represented
    - Associated tags for searching
*/

-- Insert sample videos for ASD
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, condition_type, age_group, category_id, difficulty_level) VALUES
  (
    'Early Signs of Autism in Toddlers',
    'Learn to recognize early developmental signs of autism spectrum disorder in children ages 18-36 months. Covers social communication, repetitive behaviors, and when to seek evaluation.',
    'https://www.youtube.com/embed/fLEq0gG-RdE',
    'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=800',
    720,
    'asd',
    '0-3',
    (SELECT id FROM video_categories WHERE name = 'Parent Education' LIMIT 1),
    'beginner'
  ),
  (
    'ABA Therapy Basics for Parents',
    'Introduction to Applied Behavior Analysis (ABA) therapy techniques that parents can implement at home. Includes positive reinforcement, prompting, and data collection.',
    'https://www.youtube.com/embed/MXlbMjQfNhI',
    'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800',
    900,
    'asd',
    '3-5',
    (SELECT id FROM video_categories WHERE name = 'Behavioral Therapy' LIMIT 1),
    'intermediate'
  ),
  (
    'Social Skills Activities for Autism',
    'Fun and engaging activities to help children with autism develop social skills like turn-taking, sharing, and conversation skills.',
    'https://www.youtube.com/embed/wKlMcLTqRLs',
    'https://images.pexels.com/photos/8612997/pexels-photo-8612997.jpeg?auto=compress&cs=tinysrgb&w=800',
    600,
    'asd',
    '5-12',
    (SELECT id FROM video_categories WHERE name = 'Social Skills' LIMIT 1),
    'beginner'
  );

-- Insert sample videos for ADHD
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, condition_type, age_group, category_id, difficulty_level) VALUES
  (
    'Understanding ADHD in Children',
    'Comprehensive overview of ADHD symptoms, diagnosis process, and treatment options for parents and caregivers.',
    'https://www.youtube.com/embed/xMWtGozn5jU',
    'https://images.pexels.com/photos/8363030/pexels-photo-8363030.jpeg?auto=compress&cs=tinysrgb&w=800',
    840,
    'adhd',
    'all',
    (SELECT id FROM video_categories WHERE name = 'Parent Education' LIMIT 1),
    'beginner'
  ),
  (
    'Home Organization Strategies for ADHD',
    'Practical tips for creating an ADHD-friendly home environment with visual schedules, organization systems, and routines.',
    'https://www.youtube.com/embed/3dRaT8hZvsI',
    'https://images.pexels.com/photos/6663989/pexels-photo-6663989.jpeg?auto=compress&cs=tinysrgb&w=800',
    720,
    'adhd',
    '5-12',
    (SELECT id FROM video_categories WHERE name = 'Home Activities' LIMIT 1),
    'intermediate'
  ),
  (
    'Focus and Attention Building Exercises',
    'Games and activities designed to improve focus, attention span, and impulse control in children with ADHD.',
    'https://www.youtube.com/embed/4YJkeZX_REY',
    'https://images.pexels.com/photos/8613257/pexels-photo-8613257.jpeg?auto=compress&cs=tinysrgb&w=800',
    540,
    'adhd',
    '3-5',
    (SELECT id FROM video_categories WHERE name = 'Home Activities' LIMIT 1),
    'beginner'
  );

-- Insert sample videos for Speech & Language
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, condition_type, age_group, category_id, difficulty_level) VALUES
  (
    'Speech Sound Development Milestones',
    'Learn what speech sounds children should master at different ages and how to support articulation development at home.',
    'https://www.youtube.com/embed/6nZa8CEwBrA',
    'https://images.pexels.com/photos/8613319/pexels-photo-8613319.jpeg?auto=compress&cs=tinysrgb&w=800',
    600,
    'speech',
    '0-3',
    (SELECT id FROM video_categories WHERE name = 'Parent Education' LIMIT 1),
    'beginner'
  ),
  (
    'Building Vocabulary Through Play',
    'Fun play-based activities to expand your child''s vocabulary and language comprehension during daily routines.',
    'https://www.youtube.com/embed/L93oLkaBs-U',
    'https://images.pexels.com/photos/8613325/pexels-photo-8613325.jpeg?auto=compress&cs=tinysrgb&w=800',
    480,
    'speech',
    '3-5',
    (SELECT id FROM video_categories WHERE name = 'Speech & Language Therapy' LIMIT 1),
    'beginner'
  ),
  (
    'Articulation Exercises at Home',
    'Step-by-step articulation exercises parents can practice with their child to improve speech clarity.',
    'https://www.youtube.com/embed/CW9g36HjaCw',
    'https://images.pexels.com/photos/8363102/pexels-photo-8363102.jpeg?auto=compress&cs=tinysrgb&w=800',
    720,
    'speech',
    '5-12',
    (SELECT id FROM video_categories WHERE name = 'Speech & Language Therapy' LIMIT 1),
    'intermediate'
  );

-- Insert sample videos for Developmental Delay
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, condition_type, age_group, category_id, difficulty_level) VALUES
  (
    'Understanding Developmental Milestones',
    'Overview of typical developmental milestones and red flags that may indicate developmental delays.',
    'https://www.youtube.com/embed/45Wj8uMgP0w',
    'https://images.pexels.com/photos/8612988/pexels-photo-8612988.jpeg?auto=compress&cs=tinysrgb&w=800',
    780,
    'developmental',
    '0-3',
    (SELECT id FROM video_categories WHERE name = 'Parent Education' LIMIT 1),
    'beginner'
  ),
  (
    'Gross Motor Activities for Toddlers',
    'Fun activities to support gross motor development including crawling, walking, jumping, and climbing skills.',
    'https://www.youtube.com/embed/G7e3h7LpBTY',
    'https://images.pexels.com/photos/8613308/pexels-photo-8613308.jpeg?auto=compress&cs=tinysrgb&w=800',
    540,
    'developmental',
    '0-3',
    (SELECT id FROM video_categories WHERE name = 'Physical Therapy' LIMIT 1),
    'beginner'
  ),
  (
    'Fine Motor Skills Development',
    'Activities to strengthen fine motor skills like grasping, pinching, and hand-eye coordination.',
    'https://www.youtube.com/embed/ZSgaDL8BEo4',
    'https://images.pexels.com/photos/8613314/pexels-photo-8613314.jpeg?auto=compress&cs=tinysrgb&w=800',
    600,
    'developmental',
    '3-5',
    (SELECT id FROM video_categories WHERE name = 'Occupational Therapy' LIMIT 1),
    'beginner'
  );

-- Insert sample videos for Learning Disorders
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, condition_type, age_group, category_id, difficulty_level) VALUES
  (
    'Understanding Dyslexia in Children',
    'Learn about dyslexia signs, diagnosis, and evidence-based interventions to support reading development.',
    'https://www.youtube.com/embed/zafiGBrFg7e',
    'https://images.pexels.com/photos/8613286/pexels-photo-8613286.jpeg?auto=compress&cs=tinysrgb&w=800',
    900,
    'learning',
    '5-12',
    (SELECT id FROM video_categories WHERE name = 'Parent Education' LIMIT 1),
    'beginner'
  ),
  (
    'Multisensory Reading Techniques',
    'Multisensory approaches to teaching reading including phonics activities and visual aids.',
    'https://www.youtube.com/embed/TzWlzUMZtmY',
    'https://images.pexels.com/photos/8613360/pexels-photo-8613360.jpeg?auto=compress&cs=tinysrgb&w=800',
    720,
    'learning',
    '5-12',
    (SELECT id FROM video_categories WHERE name = 'Home Activities' LIMIT 1),
    'intermediate'
  ),
  (
    'Math Support Strategies',
    'Visual and hands-on strategies to help children struggling with math concepts and number sense.',
    'https://www.youtube.com/embed/qZAvYGFB1xE',
    'https://images.pexels.com/photos/8613369/pexels-photo-8613369.jpeg?auto=compress&cs=tinysrgb&w=800',
    660,
    'learning',
    '5-12',
    (SELECT id FROM video_categories WHERE name = 'Home Activities' LIMIT 1),
    'intermediate'
  );

-- Insert sample videos for Sensory Processing
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, condition_type, age_group, category_id, difficulty_level) VALUES
  (
    'Introduction to Sensory Processing Disorder',
    'Understanding sensory processing challenges and how they affect daily life and learning.',
    'https://www.youtube.com/embed/Lx_5c1f_xQ8',
    'https://images.pexels.com/photos/8613232/pexels-photo-8613232.jpeg?auto=compress&cs=tinysrgb&w=800',
    780,
    'sensory',
    'all',
    (SELECT id FROM video_categories WHERE name = 'Parent Education' LIMIT 1),
    'beginner'
  ),
  (
    'Creating a Sensory Diet',
    'How to design a personalized sensory diet with activities to regulate your child''s sensory system throughout the day.',
    'https://www.youtube.com/embed/SEeJ2qPqZO0',
    'https://images.pexels.com/photos/8613083/pexels-photo-8613083.jpeg?auto=compress&cs=tinysrgb&w=800',
    840,
    'sensory',
    '3-5',
    (SELECT id FROM video_categories WHERE name = 'Sensory Integration' LIMIT 1),
    'intermediate'
  ),
  (
    'Calming Sensory Activities',
    'Practical sensory activities to help calm and regulate children who are overstimulated or anxious.',
    'https://www.youtube.com/embed/IXxKXLAiHW8',
    'https://images.pexels.com/photos/8613224/pexels-photo-8613224.jpeg?auto=compress&cs=tinysrgb&w=800',
    600,
    'sensory',
    'all',
    (SELECT id FROM video_categories WHERE name = 'Sensory Integration' LIMIT 1),
    'beginner'
  );

-- Insert tags for better searchability
INSERT INTO video_tags (video_id, tag)
SELECT v.id, t.tag
FROM videos v
CROSS JOIN (
  VALUES 
    ('autism'), ('early intervention'), ('developmental screening'),
    ('ABA'), ('behavior management'), ('positive reinforcement'),
    ('social skills'), ('peer interaction'), ('communication'),
    ('ADHD'), ('attention'), ('focus'), ('executive function'),
    ('organization'), ('routine'), ('visual schedule'),
    ('impulse control'), ('self-regulation'),
    ('speech therapy'), ('language development'), ('articulation'),
    ('vocabulary'), ('play-based learning'), ('communication skills'),
    ('milestones'), ('gross motor'), ('fine motor'),
    ('physical development'), ('coordination'), ('strength'),
    ('dyslexia'), ('reading support'), ('phonics'),
    ('math skills'), ('learning strategies'), ('homework help'),
    ('sensory processing'), ('sensory diet'), ('regulation'),
    ('calming techniques'), ('sensory activities')
) AS t(tag)
WHERE 
  (v.condition_type = 'asd' AND t.tag IN ('autism', 'early intervention', 'ABA', 'behavior management', 'social skills', 'communication'))
  OR (v.condition_type = 'adhd' AND t.tag IN ('ADHD', 'attention', 'focus', 'organization', 'routine', 'impulse control', 'self-regulation'))
  OR (v.condition_type = 'speech' AND t.tag IN ('speech therapy', 'language development', 'articulation', 'vocabulary', 'communication skills'))
  OR (v.condition_type = 'developmental' AND t.tag IN ('milestones', 'gross motor', 'fine motor', 'physical development', 'coordination'))
  OR (v.condition_type = 'learning' AND t.tag IN ('dyslexia', 'reading support', 'phonics', 'math skills', 'learning strategies'))
  OR (v.condition_type = 'sensory' AND t.tag IN ('sensory processing', 'sensory diet', 'regulation', 'calming techniques', 'sensory activities'));