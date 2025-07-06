-- Create function to get user emails for admin interface
-- This function allows admin users to retrieve email addresses for user management

-- First, create a function that returns user profiles with emails
CREATE OR REPLACE FUNCTION public.get_users_with_emails_for_admin()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  username TEXT,
  user_type TEXT,
  is_approved BOOLEAN,
  is_verified BOOLEAN,
  is_suspended BOOLEAN,
  phone TEXT,
  whatsapp_number TEXT,
  avatar_url TEXT,
  language_preference TEXT,
  theme_preference TEXT,
  is_trial_active BOOLEAN,
  trial_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return user profiles with emails from auth.users table
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.username,
    p.user_type,
    p.is_approved,
    p.is_verified,
    p.is_suspended,
    p.phone,
    p.whatsapp_number,
    p.avatar_url,
    p.language_preference,
    p.theme_preference,
    p.is_trial_active,
    p.trial_started_at,
    p.created_at,
    p.updated_at,
    COALESCE(au.email, 'no-email@unknown.com') as email
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users (admin check is done inside function)
GRANT EXECUTE ON FUNCTION public.get_users_with_emails_for_admin() TO authenticated;

-- Alternative simpler approach: Create a view that joins profiles with auth users
-- This view will only be accessible to admin users
CREATE OR REPLACE VIEW public.admin_user_emails AS
SELECT 
  p.id,
  p.full_name,
  p.username,
  p.user_type,
  p.is_approved,
  p.is_verified,
  p.is_suspended,
  p.created_at,
  au.email
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.email IS NOT NULL;

-- Create RLS policy for the view (only admins can access)
ALTER VIEW public.admin_user_emails OWNER TO postgres;

-- Grant select permission to authenticated users
GRANT SELECT ON public.admin_user_emails TO authenticated;

-- Create RLS policy to restrict access to admins only
CREATE POLICY "Admin users can view user emails" ON public.admin_user_emails
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Enable RLS on the view (if supported)
-- Note: Views don't support RLS directly, so we'll handle this in the function
