-- Migration to change user_type from 'seller' to 'agent'
-- This migration will:
-- 1. Update all existing 'seller' records to 'agent'
-- 2. Update the constraint to use 'agent' instead of 'seller'
-- 3. Update RLS policies and functions

-- First, update all existing 'seller' records to 'agent'
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- Update the user_type constraint to use 'agent' instead of 'seller'
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (
    user_type IN (
      'client', 
      'agent', 
      'property_owner', 
      'real_estate_office', 
      'partner_and_site_owner'
    )
  );

-- Update the user_role enum in the constants if it exists
-- Note: This might need to be done manually in the types file

-- Update RLS functions to use 'agent' instead of 'seller'
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

-- Update the approved seller function
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

-- Update any triggers that might reference 'seller'
-- Update the profile creation trigger to handle 'agent' type
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
    -- استخراج الاسم الكامل من البيانات الوصفية
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    
    -- استخراج نوع المستخدم من البيانات الوصفية
    user_type_val := COALESCE(NEW.raw_user_meta_data->>'user_type', 'client');
    
    -- إنشاء اسم مستخدم فريد
    generated_username := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8));
    
    -- إدراج ملف تعريف جديد
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

-- Update any comments or documentation
COMMENT ON FUNCTION public.is_seller() IS 'Check if current user is an agent, property owner, real estate office, or partner';
COMMENT ON FUNCTION public.is_approved_seller() IS 'Check if current user is an approved agent, property owner, real estate office, or partner';

-- Update RLS policy comments
COMMENT ON POLICY "Approved sellers can insert their own properties" ON public.properties IS 'Approved agents can insert their own properties';
COMMENT ON POLICY "Sellers can view their own properties" ON public.properties IS 'Agents can view their own properties';
COMMENT ON POLICY "Sellers can update their own properties" ON public.properties IS 'Agents can update their own properties';
COMMENT ON POLICY "Sellers can delete their own properties" ON public.properties IS 'Agents can delete their own properties';
