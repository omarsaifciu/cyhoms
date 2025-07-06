-- Fix RLS policies for user_activity_logs table
-- Run this in Supabase SQL Editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Users can insert own activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs for any user" ON user_activity_logs;
DROP POLICY IF EXISTS "Allow admins to view all activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Allow admins to insert activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Allow users to view own activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Allow users to insert own activity logs" ON user_activity_logs;

-- Create new working policies
-- Allow admins to view all activity logs
CREATE POLICY "admin_select_all" ON user_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Allow admins to insert activity logs for any user
CREATE POLICY "admin_insert_all" ON user_activity_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Allow users to view their own activity logs
CREATE POLICY "user_select_own" ON user_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own activity logs  
CREATE POLICY "user_insert_own" ON user_activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_activity_logs' 
ORDER BY ordinal_position;

-- Check if policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_activity_logs';
