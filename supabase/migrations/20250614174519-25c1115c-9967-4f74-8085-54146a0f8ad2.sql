
-- Add an 'is_verified' column to the profiles table to track user verification status.
ALTER TABLE public.profiles
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
