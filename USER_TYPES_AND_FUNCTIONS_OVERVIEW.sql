-- عرض شامل لأنواع المستخدمين والدوال في قاعدة البيانات
-- Comprehensive Overview of User Types and Functions in Database
-- شغل هذا السكريبت في Supabase SQL Editor لرؤية جميع أنواع المستخدمين

-- =====================================================
-- 1. أنواع المستخدمين المتاحة / Available User Types
-- =====================================================

-- عرض القيد الحالي لأنواع المستخدمين
-- Show current user type constraint
SELECT 
    conname as constraint_name,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';

-- عرض جميع أنواع المستخدمين المسموحة
-- Show all allowed user types
SELECT 
    'أنواع المستخدمين المسموحة / Allowed User Types:' as info,
    unnest(ARRAY[
        'client - عميل',
        'agent - وسيط (كان seller سابقاً)',
        'property_owner - مالك عقار',
        'real_estate_office - مكتب عقاري',
        'partner_and_site_owner - شريك ومالك الموقع',
        'admin - مدير',
        'support - دعم فني'
    ]) as user_types;

-- =====================================================
-- 2. إحصائيات المستخدمين الحاليين / Current User Statistics
-- =====================================================

-- عرض توزيع المستخدمين حسب النوع
-- Show user distribution by type
SELECT 
    user_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM public.profiles 
WHERE user_type IS NOT NULL
GROUP BY user_type
ORDER BY count DESC;

-- عرض المستخدمين المعتمدين حسب النوع
-- Show approved users by type
SELECT 
    user_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_users,
    COUNT(CASE WHEN is_approved = false THEN 1 END) as pending_users
FROM public.profiles 
WHERE user_type IS NOT NULL
GROUP BY user_type
ORDER BY total_users DESC;

-- =====================================================
-- 3. الدوال المتعلقة بأنواع المستخدمين / User Type Functions
-- =====================================================

-- عرض جميع الدوال المتعلقة بالمستخدمين
-- Show all user-related functions
SELECT 
    routine_name as function_name,
    routine_type,
    data_type as return_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%' 
OR routine_name LIKE '%admin%' 
OR routine_name LIKE '%seller%'
OR routine_name LIKE '%agent%'
ORDER BY routine_name;

-- =====================================================
-- 4. دوال التحقق من الصلاحيات / Permission Check Functions
-- =====================================================

-- دالة is_seller() - للتحقق من كون المستخدم بائع/وسيط
-- is_seller() function - Check if user is seller/agent
SELECT 'is_seller() Function Definition:' as info;
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'is_seller' AND routine_schema = 'public';

-- دالة is_approved_seller() - للتحقق من كون المستخدم بائع معتمد
-- is_approved_seller() function - Check if user is approved seller
SELECT 'is_approved_seller() Function Definition:' as info;
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'is_approved_seller' AND routine_schema = 'public';

-- دالة is_admin() - للتحقق من كون المستخدم مدير
-- is_admin() function - Check if user is admin
SELECT 'is_admin() Function Definition:' as info;
SELECT routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'is_admin' AND routine_schema = 'public';

-- =====================================================
-- 5. اختبار الدوال / Test Functions
-- =====================================================

-- اختبار دالة is_seller للمستخدم الحالي
-- Test is_seller function for current user
SELECT 
    'Current User is_seller Test:' as test_name,
    public.is_seller() as result,
    auth.uid() as current_user_id;

-- اختبار دالة is_approved_seller للمستخدم الحالي
-- Test is_approved_seller function for current user
SELECT 
    'Current User is_approved_seller Test:' as test_name,
    public.is_approved_seller() as result,
    auth.uid() as current_user_id;

-- اختبار دالة is_admin للمستخدم الحالي
-- Test is_admin function for current user
SELECT 
    'Current User is_admin Test:' as test_name,
    public.is_admin() as result,
    auth.uid() as current_user_id;

-- =====================================================
-- 6. معلومات المستخدم الحالي / Current User Information
-- =====================================================

-- عرض معلومات المستخدم الحالي
-- Show current user information
SELECT 
    id,
    email,
    username,
    full_name,
    user_type,
    is_approved,
    created_at,
    -- اختبار الصلاحيات
    public.is_seller() as is_seller,
    public.is_approved_seller() as is_approved_seller,
    public.is_admin() as is_admin
FROM public.profiles 
WHERE id = auth.uid();

-- =====================================================
-- 7. دوال إضافية متاحة / Additional Available Functions
-- =====================================================

-- عرض جميع الدوال المخصصة في قاعدة البيانات
-- Show all custom functions in database
SELECT 
    routine_name,
    routine_type,
    data_type as return_type,
    CASE 
        WHEN routine_name LIKE '%admin%' THEN 'إدارة - Admin'
        WHEN routine_name LIKE '%seller%' THEN 'بائع/وسيط - Seller/Agent'
        WHEN routine_name LIKE '%user%' THEN 'مستخدم - User'
        WHEN routine_name LIKE '%property%' THEN 'عقار - Property'
        ELSE 'أخرى - Other'
    END as category
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name NOT LIKE 'pg_%'
ORDER BY category, routine_name;

-- =====================================================
-- 8. إنشاء دوال اختبار جديدة / Create New Test Functions
-- =====================================================

-- دالة للتحقق من نوع المستخدم الحالي
-- Function to check current user type
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_type_result text;
BEGIN
    SELECT user_type INTO user_type_result
    FROM public.profiles
    WHERE id = auth.uid();
    
    RETURN COALESCE(user_type_result, 'غير محدد - Not Defined');
END;
$$;

-- دالة للتحقق من جميع صلاحيات المستخدم الحالي
-- Function to check all current user permissions
CREATE OR REPLACE FUNCTION public.get_current_user_permissions()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    user_info record;
BEGIN
    -- جلب معلومات المستخدم
    SELECT * INTO user_info
    FROM public.profiles
    WHERE id = auth.uid();
    
    -- إنشاء JSON مع جميع الصلاحيات
    SELECT json_build_object(
        'user_id', auth.uid(),
        'user_type', user_info.user_type,
        'is_approved', user_info.is_approved,
        'permissions', json_build_object(
            'is_seller', public.is_seller(),
            'is_approved_seller', public.is_approved_seller(),
            'is_admin', public.is_admin(),
            'can_add_property', public.can_user_add_property(auth.uid()),
            'is_trial_expired', public.is_trial_expired()
        ),
        'profile_info', json_build_object(
            'username', user_info.username,
            'full_name', user_info.full_name,
            'email', user_info.email,
            'created_at', user_info.created_at
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- =====================================================
-- 9. اختبار الدوال الجديدة / Test New Functions
-- =====================================================

-- اختبار دالة نوع المستخدم
-- Test user type function
SELECT 
    'Current User Type:' as info,
    public.get_current_user_type() as user_type;

-- اختبار دالة الصلاحيات الشاملة
-- Test comprehensive permissions function
SELECT 
    'Current User Permissions:' as info,
    public.get_current_user_permissions() as permissions;

-- =====================================================
-- 10. ملخص النظام / System Summary
-- =====================================================

SELECT 
    'ملخص نظام أنواع المستخدمين / User Types System Summary' as title,
    json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.profiles),
        'user_types_available', ARRAY[
            'client', 'agent', 'property_owner', 
            'real_estate_office', 'partner_and_site_owner', 
            'admin', 'support'
        ],
        'permission_functions', ARRAY[
            'is_seller()', 'is_approved_seller()', 'is_admin()',
            'can_user_add_property()', 'is_trial_expired()'
        ],
        'current_user_type', public.get_current_user_type(),
        'timestamp', now()
    ) as system_info;
