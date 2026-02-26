/*
  # Seed Data for Enhanced Features

  1. Seed Data
    - Default community groups
    - Parent support resources
    - Skill badges
    - Learning pathways

  2. Purpose
    - Provide immediate value to new users
    - Demonstrate platform capabilities
    - Enable engagement from day one
*/

-- Default Community Groups
INSERT INTO community_groups (name, description, group_type, condition_id, is_private, requires_approval) VALUES
  ('Autism Support Circle', 'Connect with parents navigating autism spectrum disorders. Share strategies, celebrate victories, and find support.', 'condition', 'asd', false, false),
  ('ADHD Parent Network', 'Supporting families managing ADHD. Discuss medications, school accommodations, and behavior strategies.', 'condition', 'adhd', false, false),
  ('Early Intervention (0-3)', 'For parents of infants and toddlers in early intervention. Discuss therapies, milestones, and developmental concerns.', 'age', null, false, false),
  ('School-Age Success (4-12)', 'Navigate school years together. IEP support, homework strategies, and social skills development.', 'age', null, false, false),
  ('Teen Transition Support', 'Preparing teens for independence. Discuss high school, vocational training, and life skills.', 'age', null, false, false),
  ('IEP Warriors', 'Master the IEP process together. Share templates, success stories, and advocacy strategies.', 'topic', null, false, false),
  ('Sensory Solutions', 'Sensory processing strategies and solutions. Product recommendations and environmental modifications.', 'topic', null, false, false),
  ('Speech & Language Success', 'Communication breakthroughs and strategies. AAC devices, articulation tips, and language development.', 'topic', null, false, false),
  ('Sibling Support', 'For parents supporting neurotypical siblings. Balancing family needs and addressing sibling concerns.', 'topic', null, false, false),
  ('Self-Care Sanctuary', 'Private space for parent emotional support. Share struggles, prevent burnout, and prioritize wellbeing.', 'topic', null, true, false)
ON CONFLICT DO NOTHING;

-- Parent Support Resources
INSERT INTO parent_support_resources (title, description, resource_type, url, phone_number, trigger_conditions, mood_range, stress_range, is_crisis, language) VALUES
  ('Crisis Text Line', 'Free 24/7 crisis support via text. Text HOME to 741741 to connect with a trained counselor.', 'hotline', 'https://www.crisistextline.org', '741741', '{"needs_support": true}', '{1,2}', '{4,5}', true, 'en'),
  ('National Parent Helpline', 'Emotional support for parents. Monday-Friday 1pm-10pm EST', 'hotline', 'https://www.nationalparenthelpline.org', '1-855-427-2736', '{"stress_level": [4,5]}', '{1,2,3}', '{4,5}', false, 'en'),
  ('Respite Care Finder', 'Find temporary childcare relief in your area. Essential for parent self-care and preventing burnout.', 'respite', 'https://archrespite.org/respitelocator', null, '{"needs_support": true}', '{1,2}', '{4,5}', false, 'en'),
  ('Parent Burnout Prevention', 'Recognize signs of burnout and strategies for self-care. Video guide for overwhelmed parents.', 'video', 'https://example.com/burnout-prevention', null, '{"stress_level": [4,5]}', '{1,2}', '{3,4,5}', false, 'en'),
  ('Mindfulness for Parents', 'Five-minute guided meditations designed for busy parents. Reduce stress and increase presence.', 'article', 'https://example.com/mindfulness', null, '{}', '{1,2,3}', '{3,4,5}', false, 'en'),
  ('Celebrating Small Wins', 'Why recognizing small victories matters. Shift perspective from challenges to progress.', 'article', 'https://example.com/small-wins', null, '{"mood_rating": [2,3]}', '{2,3}', '{1,2,3}', false, 'en'),
  ('Parent Support Groups Near You', 'Find local in-person support groups. Connection with parents who understand your journey.', 'community', 'https://example.com/local-groups', null, '{}', '{1,2,3,4,5}', '{1,2,3,4,5}', false, 'en'),
  ('Online Therapy Options', 'Affordable online therapy platforms accepting insurance. Professional support from home.', 'therapy', 'https://example.com/online-therapy', null, '{"needs_support": true}', '{1,2}', '{4,5}', false, 'en')
ON CONFLICT DO NOTHING;

-- Skill Badges
INSERT INTO parent_skill_badges (badge_name, badge_description, badge_category, badge_icon, unlock_criteria, points_value) VALUES
  ('First Steps', 'Completed your first child screening', 'tracking', '🎯', '{"screenings_completed": 1}', 10),
  ('Consistent Tracker', 'Logged data for 7 consecutive days', 'tracking', '📊', '{"consecutive_days": 7}', 25),
  ('Century Club', 'Logged data for 100 days', 'tracking', '💯', '{"total_days": 100}', 100),
  ('Progress Detective', 'Identified your first behavior pattern', 'tracking', '🔍', '{"patterns_found": 1}', 30),
  ('Knowledge Seeker', 'Completed your first learning module', 'education', '📚', '{"modules_completed": 1}', 15),
  ('Expert Learner', 'Completed an entire learning pathway', 'education', '🎓', '{"pathways_completed": 1}', 50),
  ('Community Builder', 'Made your first community post', 'community', '💬', '{"posts_created": 1}', 10),
  ('Helper Heart', 'Received 10 likes on helpful comments', 'community', '❤️', '{"helpful_likes": 10}', 35),
  ('Mentor Match', 'Connected with a parent mentor', 'community', '🤝', '{"mentorship_started": true}', 40),
  ('Victory Celebrator', 'Logged 10 victories in victory journal', 'milestone', '🎉', '{"victories_logged": 10}', 25),
  ('IEP Champion', 'Prepared for and attended an IEP meeting', 'advocacy', '⚖️', '{"iep_meetings": 1}', 45),
  ('Therapy Hero', 'Completed 30 days of home therapy exercises', 'therapy', '🌟', '{"therapy_days": 30}', 50)
ON CONFLICT (badge_name) DO NOTHING;

-- Learning Pathways
INSERT INTO learning_pathways (pathway_name, pathway_description, condition_id, difficulty_level, estimated_hours, modules) VALUES
  (
    'Understanding Autism Spectrum Disorder',
    'Comprehensive introduction to autism for newly diagnosed families. Learn about diagnosis, early intervention, and proven therapies.',
    'asd',
    'beginner',
    8,
    '[
      {"id": "m1", "title": "What is Autism?", "duration": 45, "type": "video"},
      {"id": "m2", "title": "Early Signs & Diagnosis", "duration": 60, "type": "interactive"},
      {"id": "m3", "title": "Evidence-Based Interventions", "duration": 90, "type": "article"},
      {"id": "m4", "title": "Communication Strategies", "duration": 75, "type": "video"},
      {"id": "m5", "title": "Sensory Processing", "duration": 60, "type": "interactive"},
      {"id": "m6", "title": "Building Your Support Team", "duration": 45, "type": "article"}
    ]'::jsonb
  ),
  (
    'ADHD Management Mastery',
    'From diagnosis to daily management. Understand ADHD, medication options, behavioral strategies, and school success.',
    'adhd',
    'beginner',
    6,
    '[
      {"id": "m1", "title": "ADHD Explained", "duration": 40, "type": "video"},
      {"id": "m2", "title": "Medication Decisions", "duration": 60, "type": "article"},
      {"id": "m3", "title": "Behavior Management at Home", "duration": 75, "type": "interactive"},
      {"id": "m4", "title": "School Accommodations", "duration": 50, "type": "video"},
      {"id": "m5", "title": "Executive Function Skills", "duration": 45, "type": "article"}
    ]'::jsonb
  ),
  (
    'IEP Advocacy Bootcamp',
    'Master the IEP process. Understand your rights, write effective goals, and advocate successfully for your child.',
    null,
    'intermediate',
    10,
    '[
      {"id": "m1", "title": "IEP Basics & Your Rights", "duration": 60, "type": "video"},
      {"id": "m2", "title": "Evaluation Process", "duration": 45, "type": "article"},
      {"id": "m3", "title": "Writing SMART Goals", "duration": 90, "type": "interactive"},
      {"id": "m4", "title": "Understanding Services", "duration": 60, "type": "video"},
      {"id": "m5", "title": "Meeting Preparation", "duration": 75, "type": "interactive"},
      {"id": "m6", "title": "When to Disagree", "duration": 50, "type": "article"},
      {"id": "m7", "title": "Progress Monitoring", "duration": 40, "type": "video"}
    ]'::jsonb
  ),
  (
    'Behavior Strategies Toolkit',
    'Practical strategies for challenging behaviors. Learn positive reinforcement, de-escalation, and prevention techniques.',
    null,
    'intermediate',
    7,
    '[
      {"id": "m1", "title": "Understanding Behavior Functions", "duration": 50, "type": "video"},
      {"id": "m2", "title": "Positive Reinforcement Systems", "duration": 60, "type": "interactive"},
      {"id": "m3", "title": "De-escalation Techniques", "duration": 75, "type": "video"},
      {"id": "m4", "title": "Environmental Modifications", "duration": 45, "type": "article"},
      {"id": "m5", "title": "Creating Visual Supports", "duration": 60, "type": "interactive"},
      {"id": "m6", "title": "Data Tracking for Patterns", "duration": 50, "type": "article"}
    ]'::jsonb
  ),
  (
    'Parent Self-Care Essentials',
    'Prevent burnout and prioritize your wellbeing. Essential self-care strategies for special needs parents.',
    null,
    'beginner',
    4,
    '[
      {"id": "m1", "title": "Recognizing Burnout Signs", "duration": 30, "type": "video"},
      {"id": "m2", "title": "Building Your Support Network", "duration": 45, "type": "interactive"},
      {"id": "m3", "title": "Quick Self-Care Strategies", "duration": 40, "type": "article"},
      {"id": "m4", "title": "Asking for Help", "duration": 35, "type": "video"},
      {"id": "m5", "title": "Mindfulness for Busy Parents", "duration": 30, "type": "interactive"}
    ]'::jsonb
  )
ON CONFLICT DO NOTHING;
