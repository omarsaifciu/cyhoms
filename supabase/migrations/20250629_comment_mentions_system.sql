-- Comment Mentions System Migration
-- This migration adds support for modern social media style comments with mentions

-- Add mentions table to track @username mentions in comments
CREATE TABLE IF NOT EXISTS public.comment_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.property_comments(id) ON DELETE CASCADE NOT NULL,
  mentioned_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mentioned_username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique mentions per comment
  UNIQUE(comment_id, mentioned_user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_comment_mentions_comment_id ON public.comment_mentions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_mentions_user_id ON public.comment_mentions(mentioned_user_id);
CREATE INDEX IF NOT EXISTS idx_comment_mentions_username ON public.comment_mentions(mentioned_username);

-- Add RLS policies for comment mentions
ALTER TABLE public.comment_mentions ENABLE ROW LEVEL SECURITY;

-- Anyone can view mentions
CREATE POLICY "Anyone can view comment mentions"
  ON public.comment_mentions
  FOR SELECT
  USING (true);

-- Only authenticated users can create mentions
CREATE POLICY "Authenticated users can create mentions"
  ON public.comment_mentions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only comment author can delete mentions from their comments
CREATE POLICY "Comment author can delete mentions"
  ON public.comment_mentions
  FOR DELETE
  USING (
    comment_id IN (
      SELECT id FROM public.property_comments 
      WHERE user_id = auth.uid()
    )
  );

-- Add a function to extract mentions from comment text
CREATE OR REPLACE FUNCTION extract_mentions_from_comment(comment_text TEXT)
RETURNS TEXT[] AS $$
DECLARE
  mentions TEXT[];
BEGIN
  -- Extract @username patterns from comment text
  SELECT array_agg(DISTINCT substring(match FROM 2)) INTO mentions
  FROM regexp_split_to_table(comment_text, '\s+') AS match
  WHERE match ~ '^@[a-zA-Z0-9_]+$';
  
  RETURN COALESCE(mentions, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

-- Add a function to process mentions when a comment is created/updated
CREATE OR REPLACE FUNCTION process_comment_mentions()
RETURNS TRIGGER AS $$
DECLARE
  mention_username TEXT;
  mentioned_user_id UUID;
  mentions TEXT[];
BEGIN
  -- Extract mentions from the comment text
  mentions := extract_mentions_from_comment(NEW.comment);
  
  -- Delete existing mentions for this comment (in case of update)
  DELETE FROM public.comment_mentions WHERE comment_id = NEW.id;
  
  -- Process each mention
  FOREACH mention_username IN ARRAY mentions
  LOOP
    -- Find the user by username
    SELECT id INTO mentioned_user_id
    FROM public.profiles
    WHERE username = mention_username;
    
    -- If user exists, create mention record
    IF mentioned_user_id IS NOT NULL THEN
      INSERT INTO public.comment_mentions (comment_id, mentioned_user_id, mentioned_username)
      VALUES (NEW.id, mentioned_user_id, mention_username)
      ON CONFLICT (comment_id, mentioned_user_id) DO NOTHING;
      
      -- Create notification for mentioned user (if not mentioning themselves)
      IF mentioned_user_id != NEW.user_id THEN
        INSERT INTO public.notifications (
          user_id,
          type,
          message,
          related_property_id,
          related_comment_id
        ) VALUES (
          mentioned_user_id,
          'comment_mention',
          'تم ذكرك في تعليق على عقار',
          NEW.property_id,
          NEW.id
        );
      END IF;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to process mentions automatically
DROP TRIGGER IF EXISTS process_mentions_trigger ON public.property_comments;
CREATE TRIGGER process_mentions_trigger
  AFTER INSERT OR UPDATE OF comment ON public.property_comments
  FOR EACH ROW
  EXECUTE FUNCTION process_comment_mentions();

-- Add a view to get comments with mention information
CREATE OR REPLACE VIEW public.comments_with_mentions AS
SELECT 
  pc.*,
  p.username,
  p.full_name,
  p.avatar_url,
  COALESCE(
    json_agg(
      json_build_object(
        'username', cm.mentioned_username,
        'user_id', cm.mentioned_user_id
      )
    ) FILTER (WHERE cm.mentioned_user_id IS NOT NULL),
    '[]'::json
  ) as mentions
FROM public.property_comments pc
LEFT JOIN public.profiles p ON pc.user_id = p.id
LEFT JOIN public.comment_mentions cm ON pc.id = cm.comment_id
GROUP BY pc.id, p.username, p.full_name, p.avatar_url
ORDER BY pc.created_at ASC;

-- Grant necessary permissions
GRANT SELECT ON public.comment_mentions TO authenticated;
GRANT INSERT ON public.comment_mentions TO authenticated;
GRANT DELETE ON public.comment_mentions TO authenticated;
GRANT SELECT ON public.comments_with_mentions TO authenticated;
