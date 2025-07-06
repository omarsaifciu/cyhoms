-- حل مؤقت بسيط لإظهار الإيميلات في واجهة الأدمن
-- Simple temporary solution to show emails in admin interface

-- إنشاء دالة بسيطة لجلب الإيميلات (بدون فحص الأدمن للاختبار)
-- Create simple function to get emails (without admin check for testing)
CREATE OR REPLACE FUNCTION public.get_all_user_emails()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- إرجاع جميع الإيميلات من جدول auth.users
  -- Return all emails from auth.users table
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email as user_email
  FROM auth.users au
  WHERE au.email IS NOT NULL
  ORDER BY au.created_at DESC;
END;
$$;

-- منح صلاحية التنفيذ للمستخدمين المصادق عليهم
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_user_emails() TO authenticated;

-- إنشاء view بسيط يجمع البيانات
-- Create simple view that combines data
CREATE OR REPLACE VIEW public.users_with_emails AS
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

-- منح صلاحية القراءة للمستخدمين المصادق عليهم
-- Grant select permission to authenticated users
GRANT SELECT ON public.users_with_emails TO authenticated;

-- اختبار الدوال والـ view
-- Test the functions and view
-- SELECT * FROM public.get_all_user_emails();
-- SELECT * FROM public.users_with_emails LIMIT 5;

-- إنشاء دالة للحصول على إيميل مستخدم واحد
-- Create function to get single user email
CREATE OR REPLACE FUNCTION public.get_user_email(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- جلب الإيميل من جدول auth.users
  -- Get email from auth.users table
  SELECT au.email INTO user_email
  FROM auth.users au
  WHERE au.id = target_user_id;
  
  -- إرجاع الإيميل أو قيمة افتراضية
  -- Return email or default value
  RETURN COALESCE(user_email, 'no-email@unknown.com');
END;
$$;

-- منح صلاحية التنفيذ للمستخدمين المصادق عليهم
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_email(UUID) TO authenticated;
