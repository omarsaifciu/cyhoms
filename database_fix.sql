-- Fix user_type constraint to allow agent instead of seller

-- Step 1: Update existing seller records to agent
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- Step 2: Drop old constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Step 3: Add new constraint with agent
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('client', 'agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner', 'admin'));

-- Step 4: Update functions
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
);
$$;

CREATE OR REPLACE FUNCTION public.is_approved_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
  AND is_approved = true
);
$$;
