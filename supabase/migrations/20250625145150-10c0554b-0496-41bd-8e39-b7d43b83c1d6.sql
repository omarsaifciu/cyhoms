
-- Create table for user property limits
CREATE TABLE public.user_property_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_limit INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(user_id)
);

-- Add Row Level Security
ALTER TABLE public.user_property_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all limits
CREATE POLICY "Admins can manage all property limits" 
  ON public.user_property_limits 
  FOR ALL 
  USING (public.is_admin());

-- Create policy for users to view their own limits
CREATE POLICY "Users can view their own property limits" 
  ON public.user_property_limits 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to get user property limit (with default of 10)
CREATE OR REPLACE FUNCTION public.get_user_property_limit(user_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    user_limit INTEGER;
BEGIN
    SELECT property_limit INTO user_limit
    FROM public.user_property_limits
    WHERE user_id = user_id_param;
    
    -- Return default limit if no custom limit is set
    RETURN COALESCE(user_limit, 10);
END;
$$;

-- Function to get user's current property count
CREATE OR REPLACE FUNCTION public.get_user_property_count(user_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    property_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO property_count
    FROM public.properties
    WHERE created_by = user_id_param
    AND status != 'deleted';
    
    RETURN COALESCE(property_count, 0);
END;
$$;

-- Function to check if user can add more properties
CREATE OR REPLACE FUNCTION public.can_user_add_property(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    current_count INTEGER;
    user_limit INTEGER;
BEGIN
    -- Get current property count
    current_count := public.get_user_property_count(user_id_param);
    
    -- Get user limit
    user_limit := public.get_user_property_limit(user_id_param);
    
    -- Return true if user can add more properties
    RETURN current_count < user_limit;
END;
$$;

-- Add default limits for existing users
INSERT INTO public.user_property_limits (user_id, property_limit)
SELECT id, 10 
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_property_limits)
ON CONFLICT (user_id) DO NOTHING;
