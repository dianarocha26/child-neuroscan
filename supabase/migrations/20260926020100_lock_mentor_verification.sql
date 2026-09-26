/*
  # Stop users from self-verifying as mentors

  RLS on parent_mentor_profiles lets owners insert/update their whole row,
  including verified_at, rating and mentee counters. Same pattern as
  community_posts in 20260925000000: clients may only write profile content
  columns; verification, ratings and counters are service-role only.

  Also covered (same gap): parent_mentorship_matches (score/counters),
  community_shared_resources (is_verified/rating/review_count),
  resource_reviews (helpful_count), therapist_reviews (is_verified_patient).
  No app code writes these tables, so nothing depends on this migration.
*/

-- Mentor profiles
REVOKE ALL ON parent_mentor_profiles FROM anon;
REVOKE INSERT, UPDATE ON parent_mentor_profiles FROM authenticated;

GRANT INSERT (user_id, is_available, expertise_areas, child_conditions, child_age_ranges,
              years_experience, bio, languages, max_mentees)
  ON parent_mentor_profiles TO authenticated;
GRANT UPDATE (is_available, expertise_areas, child_conditions, child_age_ranges,
              years_experience, bio, languages, max_mentees)
  ON parent_mentor_profiles TO authenticated;

-- Mentorship matches: mentees request, either side updates status/contact times.
REVOKE ALL ON parent_mentorship_matches FROM anon;
REVOKE INSERT, UPDATE ON parent_mentorship_matches FROM authenticated;

GRANT INSERT (mentor_id, mentee_id, condition_focus, mentee_needs, mentor_expertise)
  ON parent_mentorship_matches TO authenticated;
GRANT UPDATE (match_status, first_contact_at, last_contact_at)
  ON parent_mentorship_matches TO authenticated;

-- Shared resources and reviews
REVOKE ALL ON community_shared_resources, resource_reviews FROM anon;
REVOKE INSERT, UPDATE ON community_shared_resources, resource_reviews FROM authenticated;

GRANT INSERT (user_id, resource_type, title, description, url, location, phone_number,
              email, condition_tags, age_appropriate, cost_info)
  ON community_shared_resources TO authenticated;
GRANT INSERT (resource_id, user_id, rating, review_text)
  ON resource_reviews TO authenticated;

-- Therapist reviews: users could mark themselves as verified patients.
REVOKE ALL ON therapist_reviews FROM anon;
REVOKE INSERT, UPDATE ON therapist_reviews FROM authenticated;

GRANT INSERT (therapist_id, user_id, rating, review_title, review_text, would_recommend)
  ON therapist_reviews TO authenticated;
GRANT UPDATE (rating, review_title, review_text, would_recommend)
  ON therapist_reviews TO authenticated;

REVOKE TRUNCATE, REFERENCES, TRIGGER
  ON parent_mentor_profiles, parent_mentorship_matches, community_shared_resources,
     resource_reviews, therapist_reviews
  FROM authenticated;
