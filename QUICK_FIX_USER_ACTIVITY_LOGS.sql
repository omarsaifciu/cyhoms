-- Quick Fix for User Activity Logs Table
-- Run this in Supabase SQL Editor to fix the user_activity_logs table issues
-- This will ensure the table exists with the correct structure and permissions

-- 1. Drop existing table if it has issues (be careful with this in production!)
-- DROP TABLE IF EXISTS public.user_activity_logs CASCADE;

-- 2. Create the table with correct structure
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- 4. Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs for any user" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activities" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activity_logs;
DROP POLICY IF EXISTS "admin_insert_all" ON public.user_activity_logs;

-- 5. Create simple and working policies
CREATE POLICY "Users can view their own activities"
  ON public.user_activity_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON public.user_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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

-- 7. Test the table by inserting a sample record (optional)
-- Replace 'YOUR_USER_ID' with an actual user ID from auth.users
/*
INSERT INTO public.user_activity_logs (user_id, action_type, action_details) 
VALUES (
  'YOUR_USER_ID',
  'test_action',
  '{"message": "Test activity log entry"}'
);
*/

-- 8. Verify the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_activity_logs'
ORDER BY ordinal_position;

-- 9. Check if policies are created correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_activity_logs';
