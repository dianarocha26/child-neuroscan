/*
  # Seed Video Categories

  1. Categories
    - Speech & Language Therapy
    - Occupational Therapy
    - Physical Therapy
    - Behavioral Therapy
    - Social Skills
    - Parent Education
    - Home Activities
    - Sensory Integration
*/

INSERT INTO video_categories (name, description, icon) VALUES
  ('Speech & Language Therapy', 'Videos focused on communication development, articulation, and language skills', 'message-circle'),
  ('Occupational Therapy', 'Activities for fine motor skills, daily living skills, and hand-eye coordination', 'hand'),
  ('Physical Therapy', 'Gross motor skills, strength building, and physical development exercises', 'activity'),
  ('Behavioral Therapy', 'Strategies for managing behaviors, ABA techniques, and positive reinforcement', 'brain'),
  ('Social Skills', 'Learning social interaction, turn-taking, eye contact, and peer engagement', 'users'),
  ('Parent Education', 'Educational content for parents about child development and therapy approaches', 'book-open'),
  ('Home Activities', 'Simple activities parents can do at home to support development', 'home'),
  ('Sensory Integration', 'Sensory processing activities and strategies for sensory challenges', 'sparkles')
ON CONFLICT DO NOTHING;