-- Fix Property Limits Constraint Error
-- This script fixes the unique constraint violation in user_property_limits table

-- 1. First, let's see what duplicate records exist
SELECT user_id, COUNT(*) as count
FROM public.user_property_limits
GROUP BY user_id
HAVING COUNT(*) > 1;

-- 2. Remove duplicate records, keeping only the most recent one
WITH ranked_limits AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC, created_at DESC) as rn
  FROM public.user_property_limits
)
DELETE FROM public.user_property_limits
WHERE id IN (
  SELECT id 
  FROM ranked_limits 
  WHERE rn > 1
);

-- 3. Verify no duplicates remain
SELECT user_id, COUNT(*) as count
FROM public.user_property_limits
GROUP BY user_id
HAVING COUNT(*) > 1;

-- 4. Add default limits for users who don't have any limits set
INSERT INTO public.user_property_limits (user_id, property_limit, created_at, updated_at)
SELECT 
  p.id as user_id,
  10 as property_limit,
  NOW() as created_at,
  NOW() as updated_at
FROM public.profiles p
WHERE p.id NOT IN (
  SELECT user_id 
  FROM public.user_property_limits 
  WHERE user_id IS NOT NULL
)
AND p.user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
ON CONFLICT (user_id) DO NOTHING;

-- 5. Update the function to handle upserts better
CREATE OR REPLACE FUNCTION public.set_user_property_limit(
  user_id_param UUID,
  new_limit INTEGER,
  notes_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Try to update existing record first
  UPDATE public.user_property_limits
  SET 
    property_limit = new_limit,
    notes = notes_param,
    updated_at = NOW()
  WHERE user_id = user_id_param;
  
  -- If no record was updated, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.user_property_limits (user_id, property_limit, notes, created_at, updated_at)
    VALUES (user_id_param, new_limit, notes_param, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      property_limit = EXCLUDED.property_limit,
      notes = EXCLUDED.notes,
      updated_at = EXCLUDED.updated_at;
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- 6. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.set_user_property_limit(UUID, INTEGER, TEXT) TO authenticated;

-- 7. Create a policy for the new function if needed
CREATE POLICY "Admins can manage property limits via function" 
  ON public.user_property_limits 
  FOR ALL 
  USING (public.is_admin());

-- 8. Verify the table structure and constraints
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.user_property_limits'::regclass;

-- 9. Test the function
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get a test user ID (first admin or agent)
  SELECT id INTO test_user_id 
  FROM public.profiles 
  WHERE user_type IN ('admin', 'agent') 
  LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Test the function
    PERFORM public.set_user_property_limit(test_user_id, 15, 'Test limit update');
    RAISE NOTICE 'Function test completed for user: %', test_user_id;
  ELSE
    RAISE NOTICE 'No test user found';
  END IF;
END $$;

-- 10. Show final state
SELECT 
  upl.user_id,
  p.full_name,
  p.user_type,
  upl.property_limit,
  upl.notes,
  upl.created_at,
  upl.updated_at
FROM public.user_property_limits upl
JOIN public.profiles p ON p.id = upl.user_id
ORDER BY upl.updated_at DESC
LIMIT 10;
