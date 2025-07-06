
-- Drop the trigger if it exists to avoid errors on re-run
DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;

-- Function to update owner's info in properties table when profile changes
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if full_name, avatar_url, or whatsapp_number was updated
  IF OLD.full_name IS DISTINCT FROM NEW.full_name
     OR OLD.avatar_url IS DISTINCT FROM NEW.avatar_url
     OR OLD.whatsapp_number IS DISTINCT FROM NEW.whatsapp_number THEN
    UPDATE public.properties
    SET
      owner_name = NEW.full_name,
      owner_avatar_url = NEW.avatar_url,
      owner_whatsapp = NEW.whatsapp_number
    WHERE created_by = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a profile is updated
CREATE TRIGGER on_profile_update
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_profile_update();
