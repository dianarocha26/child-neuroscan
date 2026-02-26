/*
  # Fix Activity Templates to Support Public Templates

  Make user_id nullable for system-wide public templates
*/

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own and public activity templates" ON activity_templates;
DROP POLICY IF EXISTS "Users can create own activity templates" ON activity_templates;
DROP POLICY IF EXISTS "Users can update own activity templates" ON activity_templates;
DROP POLICY IF EXISTS "Users can delete own activity templates" ON activity_templates;

-- Modify the table to allow NULL user_id for public templates
ALTER TABLE activity_templates ALTER COLUMN user_id DROP NOT NULL;

-- Recreate policies with updated logic
CREATE POLICY "Anyone can view public activity templates"
  ON activity_templates FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own activity templates"
  ON activity_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity templates"
  ON activity_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity templates"
  ON activity_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Now insert public templates with NULL user_id
INSERT INTO activity_templates (user_id, template_name, template_description, icon_name, icon_color, category, typical_duration_minutes, is_public)
VALUES
  -- Morning Routine
  (NULL, 'Wake Up', 'Start the day', 'Sunrise', '#F59E0B', 'Morning', 10, true),
  (NULL, 'Brush Teeth', 'Morning dental hygiene', 'Smile', '#10B981', 'Morning', 5, true),
  (NULL, 'Get Dressed', 'Put on clothes', 'Shirt', '#3B82F6', 'Morning', 15, true),
  (NULL, 'Eat Breakfast', 'Morning meal', 'Utensils', '#EF4444', 'Morning', 20, true),
  (NULL, 'Pack Backpack', 'Prepare school items', 'Backpack', '#8B5CF6', 'Morning', 10, true),
  
  -- School/Learning
  (NULL, 'Go to School', 'Travel to school', 'School', '#6366F1', 'School', 30, true),
  (NULL, 'Homework Time', 'Complete assignments', 'BookOpen', '#0EA5E9', 'School', 45, true),
  (NULL, 'Reading Time', 'Independent reading', 'Book', '#8B5CF6', 'School', 30, true),
  
  -- Therapy/Activities
  (NULL, 'Speech Therapy', 'Communication practice', 'MessageCircle', '#10B981', 'Therapy', 60, true),
  (NULL, 'Occupational Therapy', 'OT session', 'Activity', '#F59E0B', 'Therapy', 60, true),
  (NULL, 'Physical Therapy', 'PT exercises', 'Zap', '#EF4444', 'Therapy', 60, true),
  (NULL, 'Play Time', 'Free play', 'Gamepad2', '#EC4899', 'Activities', 30, true),
  (NULL, 'Outside Time', 'Outdoor activities', 'Sun', '#F59E0B', 'Activities', 30, true),
  
  -- Meals
  (NULL, 'Lunch', 'Midday meal', 'UtensilsCrossed', '#EF4444', 'Meals', 30, true),
  (NULL, 'Snack Time', 'Small snack', 'Cookie', '#F59E0B', 'Meals', 10, true),
  (NULL, 'Dinner', 'Evening meal', 'UtensilsCrossed', '#EF4444', 'Meals', 40, true),
  
  -- Evening Routine
  (NULL, 'Bath Time', 'Personal hygiene', 'Bath', '#0EA5E9', 'Evening', 20, true),
  (NULL, 'Brush Teeth Evening', 'Evening dental hygiene', 'Smile', '#10B981', 'Evening', 5, true),
  (NULL, 'Pajamas', 'Change into sleepwear', 'Moon', '#8B5CF6', 'Evening', 10, true),
  (NULL, 'Bedtime Story', 'Reading before sleep', 'BookOpen', '#6366F1', 'Evening', 15, true),
  (NULL, 'Sleep', 'Bedtime', 'Moon', '#1F2937', 'Evening', 600, true),
  
  -- Self-Care
  (NULL, 'Medication', 'Take prescribed medicine', 'Pill', '#DC2626', 'Self-Care', 5, true),
  (NULL, 'Calm Down Time', 'Sensory break', 'Heart', '#EC4899', 'Self-Care', 15, true),
  (NULL, 'Exercise', 'Physical activity', 'Dumbbell', '#059669', 'Self-Care', 30, true),
  
  -- Transitions
  (NULL, 'Transition Time', 'Moving to next activity', 'ArrowRight', '#6B7280', 'Transition', 5, true),
  (NULL, 'Clean Up', 'Tidy up space', 'Trash2', '#10B981', 'Transition', 10, true)
ON CONFLICT DO NOTHING;