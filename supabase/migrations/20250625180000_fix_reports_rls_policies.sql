
-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can create property reports" ON public.property_reports;
DROP POLICY IF EXISTS "Users can view their own property reports" ON public.property_reports;
DROP POLICY IF EXISTS "Admins can view all property reports" ON public.property_reports;
DROP POLICY IF EXISTS "Admins can update property reports" ON public.property_reports;

DROP POLICY IF EXISTS "Users can create user reports" ON public.user_reports;
DROP POLICY IF EXISTS "Users can view their own user reports" ON public.user_reports;
DROP POLICY IF EXISTS "Admins can view all user reports" ON public.user_reports;
DROP POLICY IF EXISTS "Admins can update user reports" ON public.user_reports;

-- Create corrected RLS policies for property_reports
CREATE POLICY "Anyone can create property reports" 
  ON public.property_reports 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own property reports" 
  ON public.property_reports 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = reporter_user_id);

CREATE POLICY "Admins can view all property reports" 
  ON public.property_reports 
  FOR SELECT 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update property reports" 
  ON public.property_reports 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Create corrected RLS policies for user_reports
CREATE POLICY "Anyone can create user reports" 
  ON public.user_reports 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own user reports" 
  ON public.user_reports 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = reporter_user_id);

CREATE POLICY "Admins can view all user reports" 
  ON public.user_reports 
  FOR SELECT 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update user reports" 
  ON public.user_reports 
  FOR UPDATE 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
