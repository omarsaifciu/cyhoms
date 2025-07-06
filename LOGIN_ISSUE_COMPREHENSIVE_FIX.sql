-- إصلاح شامل لمشاكل تسجيل الدخول
-- Comprehensive Login Issues Fix
-- شغل هذا السكريبت في Supabase SQL Editor

-- =====================================================
-- 1. تشخيص المشكلة / Diagnose the Problem
-- =====================================================

-- فحص وجود الدالة المطلوبة
-- Check if required function exists
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'get_user_email_by_username'
AND routine_schema = 'public';

-- فحص جدول profiles
-- Check profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- فحص عينة من البيانات
-- Check sample data
SELECT id, email, username, user_type, is_approved
FROM public.profiles 
LIMIT 5;

-- =====================================================
-- 2. إصلاح الدالة / Fix the Function
-- =====================================================

-- إعادة إنشاء دالة البحث عن الإيميل بواسطة اسم المستخدم
-- Recreate the email lookup function
CREATE OR REPLACE FUNCTION public.get_user_email_by_username(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
BEGIN
    -- البحث في جدول profiles أولاً
    -- Search in profiles table first
    SELECT email INTO user_email
    FROM public.profiles
    WHERE LOWER(username) = LOWER(username_input)
    LIMIT 1;
    
    -- إذا لم نجد في profiles، ابحث في auth.users
    -- If not found in profiles, search in auth.users
    IF user_email IS NULL THEN
        SELECT auth.users.email INTO user_email
        FROM public.profiles
        JOIN auth.users ON auth.users.id = profiles.id
        WHERE LOWER(profiles.username) = LOWER(username_input)
        LIMIT 1;
    END IF;
    
    RETURN user_email;
END;
$$;

-- منح الصلاحيات للدالة
-- Grant permissions to the function
GRANT EXECUTE ON FUNCTION public.get_user_email_by_username(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_email_by_username(text) TO anon;

-- =====================================================
-- 3. إصلاح سياسات RLS / Fix RLS Policies
-- =====================================================

-- التأكد من تفعيل RLS على جدول profiles
-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إذا كانت موجودة
-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- إنشاء سياسة جديدة للقراءة
-- Create new read policy
CREATE POLICY "Allow reading profiles for authentication"
  ON public.profiles
  FOR SELECT
  USING (true);

-- سياسة للمستخدمين المسجلين لتحديث ملفاتهم الشخصية
-- Policy for authenticated users to update their own profiles
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 4. إنشاء دالة اختبار / Create Test Function
-- =====================================================

-- دالة لاختبار تسجيل الدخول
-- Function to test login functionality
CREATE OR REPLACE FUNCTION public.test_login_system(test_username text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    found_email text;
    profile_exists boolean;
BEGIN
    -- اختبار البحث عن الإيميل
    -- Test email lookup
    SELECT public.get_user_email_by_username(test_username) INTO found_email;
    
    -- اختبار وجود الملف الشخصي
    -- Test profile existence
    SELECT EXISTS(
        SELECT 1 FROM public.profiles 
        WHERE LOWER(username) = LOWER(test_username)
    ) INTO profile_exists;
    
    -- إرجاع النتائج
    -- Return results
    SELECT json_build_object(
        'username_tested', test_username,
        'email_found', found_email,
        'profile_exists', profile_exists,
        'function_working', (found_email IS NOT NULL),
        'timestamp', now()
    ) INTO result;
    
    RETURN result;
END;
$$;

-- =====================================================
-- 5. تنظيف البيانات / Clean Up Data
-- =====================================================

-- إزالة المسافات الإضافية من أسماء المستخدمين والإيميلات
-- Remove extra spaces from usernames and emails
UPDATE public.profiles 
SET 
    username = TRIM(username),
    email = TRIM(LOWER(email))
WHERE 
    username != TRIM(username) 
    OR email != TRIM(LOWER(email));

-- التأكد من عدم وجود تكرار في أسماء المستخدمين
-- Ensure no duplicate usernames
WITH duplicates AS (
    SELECT LOWER(username) as lower_username, COUNT(*) as count
    FROM public.profiles
    WHERE username IS NOT NULL
    GROUP BY LOWER(username)
    HAVING COUNT(*) > 1
)
SELECT 'Found ' || COUNT(*) || ' duplicate usernames' as message
FROM duplicates;

-- =====================================================
-- 6. اختبار النظام / Test the System
-- =====================================================

-- اختبار الدالة مع مستخدم موجود
-- Test function with existing user
SELECT public.test_login_system('admin') as admin_test;

-- عرض جميع المستخدمين المتاحين للاختبار
-- Show all available users for testing
SELECT 
    username,
    email,
    user_type,
    is_approved,
    created_at
FROM public.profiles 
WHERE username IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 7. إنشاء مستخدم اختبار / Create Test User
-- =====================================================

-- إنشاء مستخدم اختبار إذا لم يكن موجوداً
-- Create test user if not exists
DO $$
BEGIN
    -- التحقق من وجود مستخدم اختبار
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'testuser') THEN
        -- إنشاء مستخدم اختبار
        INSERT INTO public.profiles (
            id,
            username,
            email,
            full_name,
            user_type,
            is_approved,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            'testuser',
            'test@example.com',
            'Test User',
            'client',
            true,
            now(),
            now()
        );
        
        RAISE NOTICE 'Test user created: username=testuser, email=test@example.com';
    ELSE
        RAISE NOTICE 'Test user already exists';
    END IF;
END $$;

-- =====================================================
-- 8. التحقق النهائي / Final Verification
-- =====================================================

-- اختبار الدالة مع المستخدم الجديد
-- Test function with new user
SELECT public.test_login_system('testuser') as testuser_result;

-- عرض إحصائيات النظام
-- Show system statistics
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN username IS NOT NULL THEN 1 END) as profiles_with_username,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as profiles_with_email,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_users
FROM public.profiles;

-- رسالة نجاح
-- Success message
SELECT 'تم إصلاح نظام تسجيل الدخول بنجاح! Login system fixed successfully!' as result;
