/*
  # Seed Milestone Reference Data

  Populate milestone categories and typical developmental milestones
*/

-- Insert milestone categories
INSERT INTO milestone_categories (category_name, category_description, display_order, icon_name, color_code)
VALUES
  ('Gross Motor', 'Large muscle movements like walking, running, jumping', 1, 'Activity', '#3B82F6'),
  ('Fine Motor', 'Small muscle movements like grasping, drawing, writing', 2, 'Hand', '#8B5CF6'),
  ('Language', 'Communication, speech, and understanding', 3, 'MessageCircle', '#10B981'),
  ('Cognitive', 'Thinking, learning, and problem-solving', 4, 'Brain', '#F59E0B'),
  ('Social-Emotional', 'Interacting with others and managing emotions', 5, 'Heart', '#EF4444'),
  ('Self-Care', 'Independence in daily activities', 6, 'User', '#06B6D4')
ON CONFLICT (category_name) DO NOTHING;

-- Insert typical milestones (0-6 months)
INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Gross Motor'),
  'Lifts head when on tummy',
  'Baby can lift and hold their head up while lying on their stomach',
  1, 3, 'essential',
  ARRAY['Provide tummy time several times daily', 'Place colorful toys at eye level', 'Get down to their level and talk'],
  ARRAY['No attempt to lift head by 3 months', 'Head flops back when pulled to sitting at 4 months']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Lifts head when on tummy'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Language'),
  'Coos and babbles',
  'Makes cooing sounds and begins to babble',
  2, 4, 'essential',
  ARRAY['Talk to baby frequently', 'Respond to their sounds', 'Sing songs and read books'],
  ARRAY['No cooing or babbling by 4 months', 'No response to loud sounds']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Coos and babbles'
);

-- Insert milestones (6-12 months)
INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Gross Motor'),
  'Sits without support',
  'Can sit independently without falling over',
  6, 8, 'essential',
  ARRAY['Practice sitting with pillow support', 'Place toys within reach while sitting', 'Gradually reduce support'],
  ARRAY['Cannot sit with support by 9 months', 'Very stiff or very floppy when sitting']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Sits without support'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Fine Motor'),
  'Transfers objects hand to hand',
  'Passes toys from one hand to the other',
  6, 8, 'important',
  ARRAY['Offer small safe toys', 'Practice with different textures', 'Encourage reaching across body'],
  ARRAY['No interest in reaching for toys by 8 months', 'Uses only one hand consistently']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Transfers objects hand to hand'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Language'),
  'Says mama or dada',
  'Uses mama or dada with meaning',
  9, 12, 'essential',
  ARRAY['Repeat mama and dada frequently', 'Point to parents and say the words', 'Celebrate attempts'],
  ARRAY['No babbling by 12 months', 'No gestures like pointing or waving by 12 months']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Says mama or dada'
);

-- Insert milestones (12-24 months)
INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Gross Motor'),
  'Walks independently',
  'Takes several steps without support',
  12, 15, 'essential',
  ARRAY['Hold hands and practice walking', 'Use push toys', 'Create safe walking space', 'Cheer them on'],
  ARRAY['Not walking by 18 months', 'Walks only on toes', 'One side of body seems stronger']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Walks independently'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Language'),
  'Says 10+ words',
  'Uses at least 10 recognizable words',
  15, 18, 'essential',
  ARRAY['Name objects throughout the day', 'Read picture books together', 'Expand on their words'],
  ARRAY['Fewer than 10 words by 18 months', 'Loss of previously acquired language']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Says 10+ words'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Social-Emotional'),
  'Shows affection',
  'Hugs, kisses, or shows affection to familiar people',
  12, 18, 'important',
  ARRAY['Model affectionate behavior', 'Praise affectionate gestures', 'Read books about emotions'],
  ARRAY['No interest in social games by 18 months', 'Avoids eye contact consistently']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Shows affection'
);

-- Insert milestones (24-36 months)
INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Gross Motor'),
  'Runs and jumps',
  'Runs smoothly and jumps with both feet',
  24, 30, 'important',
  ARRAY['Play chase games', 'Create obstacle courses', 'Practice jumping over small objects'],
  ARRAY['Frequent falling or clumsiness', 'Cannot run by 30 months']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Runs and jumps'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Language'),
  'Uses 2-3 word phrases',
  'Combines words into simple sentences',
  24, 30, 'essential',
  ARRAY['Model short sentences', 'Expand on their phrases', 'Ask simple questions'],
  ARRAY['Not combining words by 24 months', 'Speech is mostly unintelligible to parents']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Uses 2-3 word phrases'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Cognitive'),
  'Completes simple puzzles',
  'Can complete 3-4 piece puzzles',
  24, 36, 'important',
  ARRAY['Start with 2-3 piece puzzles', 'Help guide their hand', 'Celebrate completion'],
  ARRAY['No interest in toys by 30 months', 'Cannot do simple shape sorting']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Completes simple puzzles'
);

INSERT INTO typical_milestones (category_id, milestone_name, milestone_description, age_range_start_months, age_range_end_months, importance_level, tips_for_encouraging, warning_signs)
SELECT 
  (SELECT id FROM milestone_categories WHERE category_name = 'Self-Care'),
  'Uses spoon and fork',
  'Feeds self with utensils with some spilling',
  18, 24, 'important',
  ARRAY['Offer child-sized utensils', 'Let them practice at every meal', 'Be patient with messes'],
  ARRAY['No interest in self-feeding by 24 months', 'Extremely resistant to trying']
WHERE NOT EXISTS (
  SELECT 1 FROM typical_milestones WHERE milestone_name = 'Uses spoon and fork'
);