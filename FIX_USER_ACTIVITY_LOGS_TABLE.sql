-- Fix user_activity_logs table structure
-- Run this in Supabase SQL Editor to fix the missing property_id column

-- 1. Check if property_id column exists
DO $$
BEGIN
    -- Try to add property_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_activity_logs' 
        AND column_name = 'property_id'
    ) THEN
        -- Add the missing property_id column
        ALTER TABLE public.user_activity_logs 
        ADD COLUMN property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL;
        
        -- Create index for the new column
        CREATE INDEX IF NOT EXISTS idx_user_activity_logs_property_id 
        ON public.user_activity_logs(property_id);
        
        RAISE NOTICE 'Added property_id column to user_activity_logs table';
    ELSE
        RAISE NOTICE 'property_id column already exists in user_activity_logs table';
    END IF;
END $$;

-- 2. Ensure the table has the correct structure
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable RLS if not already enabled
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- 4. Drop old policies that might conflict
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs for any user" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activities" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activity_logs;

-- 5. Create new policies
CREATE POLICY "Users can view their own activities"
  ON public.user_activity_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities"
  ON public.user_activity_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Users can insert their own activities"
  ON public.user_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can insert activities for any user"
  ON public.user_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_property_id ON public.user_activity_logs(property_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON public.user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);

-- 7. Verify the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_activity_logs'
ORDER BY ordinal_position;

-- 8. Show current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'user_activity_logs';
