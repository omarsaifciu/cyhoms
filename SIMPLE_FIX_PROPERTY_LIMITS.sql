-- Simple Fix for Property Limits Management
-- This script fixes the constraint issues without complex functions

-- 1. Remove any duplicate records in user_property_limits table
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

-- 2. Remove property limits for users who shouldn't have them (clients, support, admin)
DELETE FROM public.user_property_limits
WHERE user_id IN (
  SELECT p.id
  FROM public.profiles p
  WHERE p.user_type IN ('client', 'support', 'admin')
);

-- 3. Add default property limits for users who don't have any (only seller types)
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

-- 4. Verify the table structure
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.user_property_limits'::regclass;

-- 5. Check current data (only seller types)
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
WHERE p.user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
ORDER BY p.full_name ASC;

-- 6. Verify no duplicates exist
SELECT user_id, COUNT(*) as count
FROM public.user_property_limits
GROUP BY user_id
HAVING COUNT(*) > 1;
