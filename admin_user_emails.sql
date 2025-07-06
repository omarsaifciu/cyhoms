-- دالة لجلب إيميلات المستخدمين للأدمن
-- Function to get user emails for admin users

-- إنشاء دالة مبسطة لجلب الإيميلات
-- Create simplified function to get emails
CREATE OR REPLACE FUNCTION public.get_admin_user_emails()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- التحقق من أن المستخدم الحالي هو أدمن
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- إرجاع الإيميلات من جدول auth.users
  -- Return emails from auth.users table
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
GRANT EXECUTE ON FUNCTION public.get_admin_user_emails() TO authenticated;

-- إنشاء view مبسط للأدمن فقط
-- Create simplified view for admin only
CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
  p.id,
  p.full_name,
  p.username,
  p.user_type,
  p.phone,
  p.whatsapp_number,
  p.is_approved,
  p.is_verified,
  p.is_suspended,
  p.created_at,
  au.email
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;

-- منح صلاحية القراءة للمستخدمين المصادق عليهم
-- Grant select permission to authenticated users
GRANT SELECT ON public.admin_users_view TO authenticated;

-- إنشاء سياسة RLS للـ view (إذا كان مدعوماً)
-- Create RLS policy for the view (if supported)
-- Note: Views don't directly support RLS, so we handle this in application logic

-- دالة بديلة لجلب بيانات المستخدم مع الإيميل
-- Alternative function to get user data with email
CREATE OR REPLACE FUNCTION public.get_user_profile_with_email(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  username TEXT,
  user_type TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  is_approved BOOLEAN,
  is_verified BOOLEAN,
  is_suspended BOOLEAN,
  created_at TIMESTAMPTZ,
  email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- التحقق من أن المستخدم الحالي هو أدمن أو نفس المستخدم
  -- Check if current user is admin or the same user
  IF NOT (public.is_admin() OR auth.uid() = target_user_id) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges or own profile required.';
  END IF;

  -- إرجاع بيانات المستخدم مع الإيميل
  -- Return user data with email
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.username,
    p.user_type,
    p.phone,
    p.whatsapp_number,
    p.is_approved,
    p.is_verified,
    p.is_suspended,
    p.created_at,
    au.email
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  WHERE p.id = target_user_id;
END;
$$;

-- منح صلاحية التنفيذ للمستخدمين المصادق عليهم
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_profile_with_email(UUID) TO authenticated;

-- اختبار الدوال
-- Test the functions
-- SELECT * FROM public.get_admin_user_emails();
-- SELECT * FROM public.admin_users_view;
-- SELECT * FROM public.get_user_profile_with_email('your-user-id-here');
