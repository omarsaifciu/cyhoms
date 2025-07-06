-- Fix user_activity_logs table and add sample data
-- This migration ensures the table exists and has proper permissions

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can insert activity logs for any user" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Admins can view all activities" ON public.user_activity_logs;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activity_logs;

-- Ensure the table exists with correct structure
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'property_created', 'property_updated', 'property_hidden', 'property_shown', 'property_deleted', 'property_sold'
  action_details JSONB DEFAULT '{}', -- Store additional details about the action
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for users to view their own activities
CREATE POLICY "Users can view their own activities"
  ON public.user_activity_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for admins to view all activities
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

-- Create policy for users to insert their own activities
CREATE POLICY "Users can insert their own activities"
  ON public.user_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to insert activities for any user
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

-- Create indexes for better performance (if not exist)
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_property_id ON public.user_activity_logs(property_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON public.user_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at DESC);

-- Function to add sample data for a specific user
CREATE OR REPLACE FUNCTION public.add_sample_activity_data(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sample_property_id UUID;
BEGIN
  -- Get a sample property from the user or create sample activities without property_id
  SELECT id INTO sample_property_id 
  FROM public.properties 
  WHERE user_id = target_user_id 
  LIMIT 1;
  
  -- Insert sample activities
  INSERT INTO public.user_activity_logs (user_id, property_id, action_type, action_details, created_at) VALUES
  (target_user_id, sample_property_id, 'property_created', 
   jsonb_build_object(
     'property_title', 'شقة تجريبية في نيقوسيا',
     'property_type', 'apartment',
     'price', 1200,
     'currency', 'EUR'
   ), 
   now() - interval '5 days'),
   
  (target_user_id, sample_property_id, 'property_updated', 
   jsonb_build_object(
     'property_title', 'شقة محدثة في نيقوسيا',
     'property_type', 'apartment'
   ), 
   now() - interval '3 days'),
   
  (target_user_id, sample_property_id, 'property_hidden', 
   jsonb_build_object(
     'property_title', 'شقة مخفية مؤقتاً',
     'is_hidden', true
   ), 
   now() - interval '2 days'),
   
  (target_user_id, sample_property_id, 'property_shown', 
   jsonb_build_object(
     'property_title', 'شقة ظاهرة مرة أخرى',
     'is_hidden', false
   ), 
   now() - interval '1 day'),
   
  (target_user_id, sample_property_id, 'property_sold', 
   jsonb_build_object(
     'property_title', 'شقة تم بيعها',
     'old_status', 'available',
     'new_status', 'sold'
   ), 
   now() - interval '12 hours'),
   
  (target_user_id, NULL, 'profile_updated', 
   jsonb_build_object(
     'action', 'تحديث الملف الشخصي',
     'details', 'تم تحديث معلومات الاتصال'
   ), 
   now() - interval '6 hours'),
   
  (target_user_id, NULL, 'login', 
   jsonb_build_object(
     'action', 'تسجيل دخول',
     'ip_address', '192.168.1.1'
   ), 
   now() - interval '2 hours');
   
  RAISE NOTICE 'Sample activity data added for user %', target_user_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.add_sample_activity_data(UUID) TO authenticated;
