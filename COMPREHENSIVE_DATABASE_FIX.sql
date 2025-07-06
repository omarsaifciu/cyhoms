-- COMPREHENSIVE DATABASE FIX
-- This script fixes all the major database issues causing property fetching and deletion problems
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. FIX FOREIGN KEY RELATIONSHIPS AND CONSTRAINTS
-- =====================================================

-- First, let's check what tables exist
DO $$
BEGIN
    RAISE NOTICE 'Starting comprehensive database fix...';
END $$;

-- Fix properties table relationships
-- Add missing foreign key to cities if it doesn't exist
DO $$
BEGIN
    -- Check if city column exists and add foreign key if cities table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cities' AND table_schema = 'public') THEN
        -- Add foreign key constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'properties_city_fkey' 
            AND table_name = 'properties'
        ) THEN
            -- First, ensure city column exists
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'properties' 
                AND column_name = 'city' 
                AND table_schema = 'public'
            ) THEN
                ALTER TABLE public.properties 
                ADD CONSTRAINT properties_city_fkey 
                FOREIGN KEY (city) REFERENCES public.cities(name_en);
                RAISE NOTICE 'Added foreign key constraint for properties.city';
            END IF;
        END IF;
    ELSE
        RAISE NOTICE 'Cities table does not exist - skipping city foreign key';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not add city foreign key: %', SQLERRM;
END $$;

-- Fix districts relationship
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'districts' AND table_schema = 'public') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'properties_district_fkey' 
            AND table_name = 'properties'
        ) THEN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'properties' 
                AND column_name = 'district' 
                AND table_schema = 'public'
            ) THEN
                ALTER TABLE public.properties 
                ADD CONSTRAINT properties_district_fkey 
                FOREIGN KEY (district) REFERENCES public.districts(name_en);
                RAISE NOTICE 'Added foreign key constraint for properties.district';
            END IF;
        END IF;
    ELSE
        RAISE NOTICE 'Districts table does not exist - skipping district foreign key';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not add district foreign key: %', SQLERRM;
END $$;

-- =====================================================
-- 2. FIX CASCADE DELETE CONSTRAINTS
-- =====================================================

-- Fix property_activities foreign key constraint
DO $$
BEGIN
    -- Drop existing constraint if it exists
    ALTER TABLE public.property_activities 
    DROP CONSTRAINT IF EXISTS property_activities_property_id_fkey;
    
    -- Add new constraint with CASCADE DELETE
    ALTER TABLE public.property_activities 
    ADD CONSTRAINT property_activities_property_id_fkey 
    FOREIGN KEY (property_id) 
    REFERENCES public.properties(id) 
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Fixed property_activities foreign key constraint';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not fix property_activities constraint: %', SQLERRM;
END $$;

-- Fix property_views foreign key constraint
DO $$
BEGIN
    ALTER TABLE public.property_views 
    DROP CONSTRAINT IF EXISTS property_views_property_id_fkey;
    
    ALTER TABLE public.property_views 
    ADD CONSTRAINT property_views_property_id_fkey 
    FOREIGN KEY (property_id) 
    REFERENCES public.properties(id) 
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Fixed property_views foreign key constraint';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not fix property_views constraint: %', SQLERRM;
END $$;

-- Fix favorites foreign key constraint
DO $$
BEGIN
    ALTER TABLE public.favorites 
    DROP CONSTRAINT IF EXISTS favorites_property_id_fkey;
    
    ALTER TABLE public.favorites 
    ADD CONSTRAINT favorites_property_id_fkey 
    FOREIGN KEY (property_id) 
    REFERENCES public.properties(id) 
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Fixed favorites foreign key constraint';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not fix favorites constraint: %', SQLERRM;
END $$;

-- Fix property_reports foreign key constraint
DO $$
BEGIN
    ALTER TABLE public.property_reports 
    DROP CONSTRAINT IF EXISTS property_reports_property_id_fkey;
    
    ALTER TABLE public.property_reports 
    ADD CONSTRAINT property_reports_property_id_fkey 
    FOREIGN KEY (property_id) 
    REFERENCES public.properties(id) 
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Fixed property_reports foreign key constraint';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not fix property_reports constraint: %', SQLERRM;
END $$;

-- Fix property_comments foreign key constraint
DO $$
BEGIN
    ALTER TABLE public.property_comments 
    DROP CONSTRAINT IF EXISTS property_comments_property_id_fkey;
    
    ALTER TABLE public.property_comments 
    ADD CONSTRAINT property_comments_property_id_fkey 
    FOREIGN KEY (property_id) 
    REFERENCES public.properties(id) 
    ON DELETE CASCADE;
    
    RAISE NOTICE 'Fixed property_comments foreign key constraint';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not fix property_comments constraint: %', SQLERRM;
END $$;

-- =====================================================
-- 3. FIX USER_ACTIVITY_LOGS TABLE
-- =====================================================

-- Ensure user_activity_logs table exists with correct structure
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add property_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_activity_logs' 
        AND column_name = 'property_id' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.user_activity_logs 
        ADD COLUMN property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added property_id column to user_activity_logs';
    END IF;
END $$;

-- Enable RLS on user_activity_logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CLEAN UP ORPHANED RECORDS
-- =====================================================

-- Delete orphaned property_activities records
DELETE FROM public.property_activities 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- Delete orphaned property_views records
DELETE FROM public.property_views 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- Delete orphaned favorites records
DELETE FROM public.favorites 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- Delete orphaned property_reports records
DELETE FROM public.property_reports 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- Delete orphaned property_comments records
DELETE FROM public.property_comments 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- Delete orphaned user_activity_logs records
DELETE FROM public.user_activity_logs 
WHERE property_id IS NOT NULL 
AND property_id NOT IN (SELECT id FROM public.properties);

-- =====================================================
-- 5. VERIFY THE FIX
-- =====================================================

-- Show current foreign key constraints
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND ccu.table_name = 'properties'
ORDER BY tc.table_name;

RAISE NOTICE 'Comprehensive database fix completed successfully!';
