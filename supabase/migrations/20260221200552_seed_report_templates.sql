/*
  # Seed Report Templates

  ## Overview
  Seeds initial report templates for Medical, Educational, Therapy, and Crisis reports.

  ## Templates Created
  1. Medical Report - For doctor appointments and medical records
  2. Educational Report - For IEP meetings and school documentation
  3. Therapy Progress Report - For therapy sessions and progress tracking
  4. Crisis Management Report - For documenting crisis incidents
*/

-- Insert Medical Report Template
INSERT INTO report_templates (name, description, template_type, sections, is_active)
VALUES (
  'Medical Report',
  'Comprehensive medical report for doctor appointments, specialists, and medical records',
  'medical',
  '[
    {"name": "Patient Information", "order": 1, "required": true},
    {"name": "Medication History", "order": 2, "required": true},
    {"name": "Behavioral Observations", "order": 3, "required": false},
    {"name": "Symptom Tracking", "order": 4, "required": false},
    {"name": "Therapy Sessions Attended", "order": 5, "required": false},
    {"name": "Goals Progress", "order": 6, "required": false},
    {"name": "Parent Concerns", "order": 7, "required": false}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Insert Educational Report Template
INSERT INTO report_templates (name, description, template_type, sections, is_active)
VALUES (
  'Educational Report',
  'Comprehensive report for IEP meetings, school documentation, and educational planning',
  'educational',
  '[
    {"name": "Student Information", "order": 1, "required": true},
    {"name": "Academic Goals Progress", "order": 2, "required": true},
    {"name": "Behavioral Observations in Learning", "order": 3, "required": false},
    {"name": "Social Skills Development", "order": 4, "required": false},
    {"name": "Accommodations Effectiveness", "order": 5, "required": false},
    {"name": "Milestone Achievements", "order": 6, "required": false},
    {"name": "Recommendations for School", "order": 7, "required": false}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Insert Therapy Progress Report Template
INSERT INTO report_templates (name, description, template_type, sections, is_active)
VALUES (
  'Therapy Progress Report',
  'Progress tracking report for therapists (OT, PT, Speech, ABA, etc.)',
  'therapy',
  '[
    {"name": "Client Information", "order": 1, "required": true},
    {"name": "Therapy Goals Status", "order": 2, "required": true},
    {"name": "Session Attendance", "order": 3, "required": true},
    {"name": "Skill Development Progress", "order": 4, "required": false},
    {"name": "Home Program Compliance", "order": 5, "required": false},
    {"name": "Behavioral Patterns", "order": 6, "required": false},
    {"name": "Parent Observations", "order": 7, "required": false},
    {"name": "Next Steps", "order": 8, "required": false}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Insert Crisis Management Report Template
INSERT INTO report_templates (name, description, template_type, sections, is_active)
VALUES (
  'Crisis Management Report',
  'Detailed documentation of crisis incidents, triggers, and effective interventions',
  'crisis',
  '[
    {"name": "Incident Overview", "order": 1, "required": true},
    {"name": "Crisis Events Timeline", "order": 2, "required": true},
    {"name": "Identified Triggers", "order": 3, "required": true},
    {"name": "Interventions Used", "order": 4, "required": true},
    {"name": "Effectiveness of Strategies", "order": 5, "required": false},
    {"name": "Safety Measures", "order": 6, "required": false},
    {"name": "Follow-up Actions", "order": 7, "required": false}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;