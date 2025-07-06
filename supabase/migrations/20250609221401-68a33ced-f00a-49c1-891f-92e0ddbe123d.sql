
-- Update the function to handle case-insensitive comparison properly
CREATE OR REPLACE FUNCTION public.get_user_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
BEGIN
    -- Get the user email from profiles table (case-insensitive search)
    SELECT auth.users.email INTO user_email
    FROM public.profiles
    JOIN auth.users ON auth.users.id = profiles.id
    WHERE LOWER(profiles.username) = LOWER(username_input);
    
    RETURN user_email;
END;
$$;
