/*
  # Make the video view counter work

  `videos` has RLS with no UPDATE policy, so the app's direct
  `update({ views })` matched zero rows and silently did nothing.

  This adds a SECURITY DEFINER function that bumps only the `views`
  column of one video, atomically. Callers cannot change any other
  column, and `videos` stays read-only to clients.
*/

CREATE OR REPLACE FUNCTION public.increment_video_views(p_video_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE videos SET views = COALESCE(views, 0) + 1 WHERE id = p_video_id;
$$;

REVOKE ALL ON FUNCTION public.increment_video_views(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_video_views(uuid) TO anon, authenticated;
