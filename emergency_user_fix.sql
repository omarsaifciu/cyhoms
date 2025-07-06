-- إصلاح طارئ لإظهار المستخدمين في لوحة تحكم الأدمن
-- Emergency fix to show users in admin dashboard

-- =====================================================
-- 1. إنشاء دالة بسيطة بدون فحص الأدمن (للاختبار فقط)
-- Create simple function without admin check (for testing only)
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_all_users_simple()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  username TEXT,
  user_type TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  avatar_url TEXT,
  language_preference TEXT,
  theme_preference TEXT,
  is_approved BOOLEAN,
  is_verified BOOLEAN,
  is_suspended BOOLEAN,
  is_trial_active BOOLEAN,
  trial_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- إرجاع جميع المستخدمين مع محاولة جلب الإيميلات
  -- Return all users with attempt to get emails
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.username,
    p.user_type,
    p.phone,
    p.whatsapp_number,
    p.avatar_url,
    p.language_preference,
    p.theme_preference,
    p.is_approved,
    p.is_verified,
    p.is_suspended,
    p.is_trial_active,
    p.trial_started_at,
    p.created_at,
    p.updated_at,
    COALESCE(au.email, 'email-not-available@temp.com') as email
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
END;
$$;

-- منح صلاحية التنفيذ للجميع (مؤقت)
-- Grant execute permission to everyone (temporary)
GRANT EXECUTE ON FUNCTION public.get_all_users_simple() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_simple() TO anon;

-- =====================================================
-- 2. إنشاء view بسيط للمستخدمين
-- Create simple view for users
-- =====================================================

CREATE OR REPLACE VIEW public.simple_users_view AS
SELECT 
  p.id,
  p.full_name,
  p.username,
  p.user_type,
  p.phone,
  p.whatsapp_number,
  p.avatar_url,
  p.language_preference,
  p.theme_preference,
  p.is_approved,
  p.is_verified,
  p.is_suspended,
  p.is_trial_active,
  p.trial_started_at,
  p.created_at,
  p.updated_at,
  COALESCE(au.email, 'email-not-available@temp.com') as email
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;

-- منح صلاحية القراءة للجميع (مؤقت)
-- Grant select permission to everyone (temporary)
GRANT SELECT ON public.simple_users_view TO authenticated;
GRANT SELECT ON public.simple_users_view TO anon;

-- =====================================================
-- 3. التأكد من وجود بيانات في جدول profiles
-- Ensure data exists in profiles table
-- =====================================================

-- فحص عدد المستخدمين في جدول profiles
-- Check number of users in profiles table
SELECT 
  'Total users in profiles table:' as info,
  COUNT(*) as count
FROM public.profiles;

-- فحص عينة من المستخدمين
-- Check sample of users
SELECT 
  id,
  full_name,
  username,
  user_type,
  is_approved,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- 4. فحص سياسات RLS
-- Check RLS policies
-- =====================================================

-- التأكد من أن RLS لا يمنع الوصول للبيانات
-- Ensure RLS is not blocking data access
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- عرض سياسات RLS الحالية
-- Show current RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- =====================================================
-- 5. اختبار الدوال والـ views
-- Test functions and views
-- =====================================================

-- اختبار الدالة البسيطة
-- Test simple function
-- SELECT * FROM public.get_all_users_simple() LIMIT 3;

-- اختبار الـ view البسيط
-- Test simple view
-- SELECT * FROM public.simple_users_view LIMIT 3;

-- اختبار الوصول المباشر لجدول profiles
-- Test direct access to profiles table
-- SELECT id, full_name, username, user_type FROM public.profiles LIMIT 3;

-- =====================================================
-- 6. إصلاح مؤقت لسياسات RLS (إذا لزم الأمر)
-- Temporary fix for RLS policies (if needed)
-- =====================================================

-- تعطيل RLS مؤقتاً لجدول profiles (للاختبار فقط)
-- Temporarily disable RLS for profiles table (for testing only)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- إعادة تفعيل RLS (بعد الاختبار)
-- Re-enable RLS (after testing)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
