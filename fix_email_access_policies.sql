-- إصلاح سياسات قاعدة البيانات لإظهار الإيميلات في واجهة الأدمن
-- Fix database policies to show emails in admin interface

-- =====================================================
-- 1. إنشاء دالة للتحقق من صلاحيات الأدمن المحسنة
-- Create enhanced admin check function
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_admin_enhanced()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- التحقق من وجود المستخدم أولاً
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- التحقق من نوع المستخدم في جدول profiles
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('admin', 'support')
    AND is_approved = true
  );
END;
$$;

-- =====================================================
-- 2. إنشاء دالة آمنة لجلب الإيميلات للأدمن
-- Create secure function to get emails for admin
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_users_with_emails_secure()
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
  -- التحقق من صلاحيات الأدمن
  IF NOT public.is_admin_enhanced() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- إرجاع بيانات المستخدمين مع الإيميلات
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
    COALESCE(au.email, 'no-email@unknown.com') as email
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
END;
$$;

-- منح صلاحية التنفيذ
GRANT EXECUTE ON FUNCTION public.get_users_with_emails_secure() TO authenticated;

-- =====================================================
-- 3. إنشاء دالة لجلب إيميل مستخدم واحد
-- Create function to get single user email
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_single_user_email(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- التحقق من الصلاحيات: أدمن أو نفس المستخدم
  IF NOT (public.is_admin_enhanced() OR auth.uid() = target_user_id) THEN
    RETURN 'access-denied@privacy.com';
  END IF;

  -- جلب الإيميل
  SELECT au.email INTO user_email
  FROM auth.users au
  WHERE au.id = target_user_id;
  
  RETURN COALESCE(user_email, 'no-email@unknown.com');
END;
$$;

-- منح صلاحية التنفيذ
GRANT EXECUTE ON FUNCTION public.get_single_user_email(UUID) TO authenticated;

-- =====================================================
-- 4. إنشاء view محمي للأدمن
-- Create protected view for admin
-- =====================================================

-- حذف الـ view القديم إذا كان موجوداً
DROP VIEW IF EXISTS public.admin_users_with_emails;

-- إنشاء view جديد محمي
CREATE VIEW public.admin_users_with_emails AS
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
  CASE 
    WHEN public.is_admin_enhanced() THEN COALESCE(au.email, 'no-email@unknown.com')
    WHEN auth.uid() = p.id THEN COALESCE(au.email, 'no-email@unknown.com')
    ELSE 'access-denied@privacy.com'
  END as email
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;

-- منح صلاحية القراءة
GRANT SELECT ON public.admin_users_with_emails TO authenticated;

-- =====================================================
-- 5. تحديث سياسات RLS لجدول profiles (إذا لزم الأمر)
-- Update RLS policies for profiles table (if needed)
-- =====================================================

-- التأكد من تفعيل RLS على جدول profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للأدمن لرؤية جميع الملفات الشخصية
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin_enhanced());

-- =====================================================
-- 6. اختبار الدوال
-- Test the functions
-- =====================================================

-- اختبار دالة التحقق من الأدمن
-- SELECT public.is_admin_enhanced();

-- اختبار جلب المستخدمين مع الإيميلات (للأدمن فقط)
-- SELECT * FROM public.get_users_with_emails_secure() LIMIT 5;

-- اختبار الـ view
-- SELECT * FROM public.admin_users_with_emails LIMIT 5;

-- اختبار جلب إيميل مستخدم واحد
-- SELECT public.get_single_user_email('your-user-id-here');

-- =====================================================
-- 7. تنظيف الدوال القديمة (اختياري)
-- Cleanup old functions (optional)
-- =====================================================

-- حذف الدوال القديمة إذا لم تعد مطلوبة
-- DROP FUNCTION IF EXISTS public.get_all_user_emails();
-- DROP FUNCTION IF EXISTS public.get_user_email(UUID);
-- DROP VIEW IF EXISTS public.users_with_emails;
