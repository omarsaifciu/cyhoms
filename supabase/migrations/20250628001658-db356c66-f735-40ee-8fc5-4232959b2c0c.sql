
-- Enable RLS on properties table if not already enabled
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all properties" ON public.properties;
DROP POLICY IF EXISTS "Sellers can view their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Sellers can insert their own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can update all properties" ON public.properties;
DROP POLICY IF EXISTS "Sellers can update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete all properties" ON public.properties;
DROP POLICY IF EXISTS "Sellers can delete their own properties" ON public.properties;

-- Create comprehensive RLS policies for properties table

-- SELECT policies
CREATE POLICY "Admins can view all properties" 
ON public.properties 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Sellers can view their own properties" 
ON public.properties 
FOR SELECT 
TO authenticated
USING (
  public.is_seller() AND 
  (created_by = auth.uid() OR user_id = auth.uid())
);

CREATE POLICY "Users can view available properties" 
ON public.properties 
FOR SELECT 
TO authenticated
USING (status = 'available');

CREATE POLICY "Anonymous users can view available properties" 
ON public.properties 
FOR SELECT 
TO anon
USING (status = 'available');

-- INSERT policies
CREATE POLICY "Admins can insert properties" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Approved sellers can insert their own properties" 
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (
  public.is_seller() AND 
  public.is_approved_seller() AND
  (created_by = auth.uid() OR user_id = auth.uid())
);

-- UPDATE policies
CREATE POLICY "Admins can update all properties" 
ON public.properties 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Sellers can update their own properties" 
ON public.properties 
FOR UPDATE 
TO authenticated
USING (
  public.is_seller() AND 
  (created_by = auth.uid() OR user_id = auth.uid())
);

-- DELETE policies
CREATE POLICY "Admins can delete all properties" 
ON public.properties 
FOR DELETE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Sellers can delete their own properties" 
ON public.properties 
FOR DELETE 
TO authenticated
USING (
  public.is_seller() AND 
  (created_by = auth.uid() OR user_id = auth.uid())
);
