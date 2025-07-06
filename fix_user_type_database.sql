-- Fix user_type constraint to allow 'agent' instead of 'seller'
-- Run this in Supabase SQL Editor

-- 1. Update all existing 'seller' records to 'agent'
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- 2. Drop the old constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- 3. Add the new constraint that includes 'agent'
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (
    user_type IN (
      'client', 
      'agent', 
      'property_owner', 
      'real_estate_office', 
      'partner_and_site_owner',
      'admin'
    )
  );

-- 4. Update RLS functions to use 'agent' instead of 'seller'
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

-- 5. Update the approved seller function
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

-- 6. Update the profile creation trigger to handle 'agent' type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_full_name text;
    user_type_val text;
    generated_username text;
BEGIN
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    user_type_val := COALESCE(NEW.raw_user_meta_data->>'user_type', 'client');
    generated_username := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8));
    
    INSERT INTO public.profiles (
        id, 
        full_name, 
        phone, 
        user_type, 
        username, 
        whatsapp_number, 
        created_at,
        is_trial_active
    )
    VALUES (
        NEW.id,
        user_full_name,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        user_type_val,
        generated_username,
        COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', ''),
        now(),
        CASE WHEN user_type_val IN ('agent', 'property_owner') THEN true ELSE false END
    );
    RETURN NEW;
END;
$$;

-- 7. Verify the changes
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';

-- 8. Test the constraint by checking allowed values
SELECT 
  CASE 
    WHEN consrc LIKE '%agent%' 
    THEN 'SUCCESS: agent is allowed' 
    ELSE 'ERROR: agent is not allowed' 
  END as constraint_check
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';
