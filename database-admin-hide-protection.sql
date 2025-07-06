-- Database trigger to prevent sellers from reactivating admin-hidden properties
-- Run this in Supabase SQL Editor

-- Create function to prevent seller from unhiding admin-hidden properties
CREATE OR REPLACE FUNCTION public.prevent_seller_unhide_admin_hidden()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
  is_property_owner BOOLEAN;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();

  -- Check if current user owns this property (either created_by or user_id)
  is_property_owner := (OLD.created_by = current_user_id OR OLD.user_id = current_user_id);

  -- Only apply restrictions to property owners who are not admins
  IF is_property_owner AND NOT public.is_admin() THEN
    -- Check if the property was hidden by admin and seller is trying to make it available
    IF OLD.hidden_by_admin = true
       AND (OLD.status = 'pending' OR OLD.status = 'hidden')
       AND NEW.status = 'available' THEN

      RAISE EXCEPTION 'You cannot reactivate a property that was hidden by admin. Contact admin for assistance.'
        USING ERRCODE = 'P0001';
    END IF;

    -- Also prevent seller from changing hidden_by_admin flag
    IF OLD.hidden_by_admin = true AND NEW.hidden_by_admin = false THEN
      RAISE EXCEPTION 'You cannot modify the admin hide flag. Contact admin for assistance.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS prevent_seller_unhide_admin_hidden_trigger ON public.properties;

-- Create trigger
CREATE TRIGGER prevent_seller_unhide_admin_hidden_trigger
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_seller_unhide_admin_hidden();

-- Test the trigger (optional - remove these lines after testing)
-- This will help verify the trigger works correctly

-- Example test case (run as seller, not admin):
-- UPDATE public.properties 
-- SET status = 'available' 
-- WHERE id = 'some-property-id' 
-- AND hidden_by_admin = true 
-- AND status = 'pending';
-- Expected result: Should raise an exception

COMMENT ON FUNCTION public.prevent_seller_unhide_admin_hidden() IS 
'Prevents sellers from reactivating properties that were hidden by admin';

COMMENT ON TRIGGER prevent_seller_unhide_admin_hidden_trigger ON public.properties IS 
'Enforces admin hide override at database level';
