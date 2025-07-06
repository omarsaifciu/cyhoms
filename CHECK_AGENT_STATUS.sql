-- فحص حالة الوسطاء (Agents) في قاعدة البيانات
-- Check Agent Status in Database
-- شغل هذا السكريبت في Supabase SQL Editor

-- =====================================================
-- 1. التحقق من وجود نوع المستخدم agent
-- =====================================================

-- فحص القيد الحالي لأنواع المستخدمين
SELECT 
    'فحص القيد الحالي / Current Constraint Check:' as info,
    conname as constraint_name,
    consrc as allowed_types
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';

-- التحقق من وجود agent في القيد
SELECT 
    CASE 
        WHEN consrc LIKE '%agent%' 
        THEN '✅ SUCCESS: agent مسموح / agent is allowed' 
        ELSE '❌ ERROR: agent غير مسموح / agent is not allowed' 
    END as agent_check
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';

-- =====================================================
-- 2. إحصائيات الوسطاء الحاليين
-- =====================================================

-- عدد الوسطاء الإجمالي
SELECT 
    'إحصائيات الوسطاء / Agent Statistics:' as info,
    COUNT(*) as total_agents,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_agents,
    COUNT(CASE WHEN is_approved = false THEN 1 END) as pending_agents
FROM profiles 
WHERE user_type = 'agent';

-- تفاصيل الوسطاء
SELECT 
    'تفاصيل الوسطاء / Agent Details:' as section,
    username,
    full_name,
    email,
    is_approved,
    created_at,
    (SELECT COUNT(*) FROM properties WHERE created_by = profiles.id) as total_properties
FROM profiles 
WHERE user_type = 'agent'
ORDER BY created_at DESC;

-- =====================================================
-- 3. فحص الدوال المتعلقة بالوسطاء
-- =====================================================

-- فحص دالة is_seller
SELECT 
    'فحص دالة is_seller / is_seller Function Check:' as info,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- التحقق من تضمين agent في دالة is_seller
SELECT 
    CASE 
        WHEN routine_definition LIKE '%agent%' 
        THEN '✅ SUCCESS: دالة is_seller تتضمن agent / is_seller includes agent' 
        ELSE '❌ ERROR: دالة is_seller لا تتضمن agent / is_seller does not include agent' 
    END as function_check
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- فحص دالة is_approved_seller
SELECT 
    'فحص دالة is_approved_seller / is_approved_seller Function Check:' as info,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'is_approved_seller' 
AND routine_schema = 'public';

-- =====================================================
-- 4. اختبار الدوال للمستخدم الحالي
-- =====================================================

-- معلومات المستخدم الحالي
SELECT 
    'معلومات المستخدم الحالي / Current User Info:' as info,
    id,
    user_type,
    is_approved,
    username,
    email
FROM profiles 
WHERE id = auth.uid();

-- اختبار دوال الصلاحيات
SELECT 
    'اختبار الصلاحيات / Permissions Test:' as info,
    public.is_seller() as is_seller_result,
    public.is_approved_seller() as is_approved_seller_result,
    public.is_admin() as is_admin_result;

-- =====================================================
-- 5. فحص العقارات المرتبطة بالوسطاء
-- =====================================================

-- عقارات الوسطاء
SELECT 
    'عقارات الوسطاء / Agent Properties:' as section,
    p.username as agent_username,
    p.full_name as agent_name,
    COUNT(pr.id) as total_properties,
    COUNT(CASE WHEN pr.status = 'available' THEN 1 END) as available_properties,
    COUNT(CASE WHEN pr.status = 'sold' THEN 1 END) as sold_properties
FROM profiles p
LEFT JOIN properties pr ON pr.created_by = p.id
WHERE p.user_type = 'agent'
GROUP BY p.id, p.username, p.full_name
ORDER BY total_properties DESC;

-- =====================================================
-- 6. فحص سياسات RLS للوسطاء
-- =====================================================

-- عرض سياسات properties المتعلقة بالوسطاء
SELECT 
    'سياسات RLS للعقارات / Properties RLS Policies:' as info,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'properties' 
AND (qual LIKE '%seller%' OR qual LIKE '%agent%')
ORDER BY policyname;

-- =====================================================
-- 7. إنشاء دالة اختبار للوسطاء
-- =====================================================

-- دالة للتحقق من حالة الوسيط
CREATE OR REPLACE FUNCTION public.check_agent_status(agent_id UUID DEFAULT auth.uid())
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    agent_info record;
    property_count integer;
BEGIN
    -- جلب معلومات الوسيط
    SELECT * INTO agent_info
    FROM public.profiles
    WHERE id = agent_id;
    
    -- عدد العقارات
    SELECT COUNT(*) INTO property_count
    FROM public.properties
    WHERE created_by = agent_id;
    
    -- إنشاء JSON مع النتائج
    SELECT json_build_object(
        'agent_id', agent_id,
        'is_agent', (agent_info.user_type = 'agent'),
        'is_approved', agent_info.is_approved,
        'username', agent_info.username,
        'full_name', agent_info.full_name,
        'email', agent_info.email,
        'created_at', agent_info.created_at,
        'total_properties', property_count,
        'permissions', json_build_object(
            'can_sell', (agent_info.user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')),
            'can_add_properties', (agent_info.user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner') AND agent_info.is_approved = true),
            'is_admin', (agent_info.user_type = 'admin')
        ),
        'status', CASE 
            WHEN agent_info.user_type != 'agent' THEN 'ليس وسيط / Not an agent'
            WHEN agent_info.is_approved = true THEN 'معتمد / Approved'
            WHEN agent_info.is_approved = false THEN 'في انتظار الموافقة / Pending approval'
            ELSE 'غير محدد / Unknown'
        END
    ) INTO result;
    
    RETURN result;
END;
$$;

-- =====================================================
-- 8. اختبار الدالة الجديدة
-- =====================================================

-- اختبار للمستخدم الحالي
SELECT 
    'اختبار حالة الوسيط / Agent Status Test:' as info,
    public.check_agent_status() as current_user_status;

-- اختبار لجميع الوسطاء
SELECT 
    'حالة جميع الوسطاء / All Agents Status:' as section,
    username,
    public.check_agent_status(id) as agent_status
FROM profiles 
WHERE user_type = 'agent'
ORDER BY username;

-- =====================================================
-- 9. إحصائيات شاملة
-- =====================================================

-- ملخص شامل للنظام
SELECT 
    'ملخص النظام / System Summary:' as title,
    json_build_object(
        'total_users', (SELECT COUNT(*) FROM profiles),
        'total_agents', (SELECT COUNT(*) FROM profiles WHERE user_type = 'agent'),
        'approved_agents', (SELECT COUNT(*) FROM profiles WHERE user_type = 'agent' AND is_approved = true),
        'pending_agents', (SELECT COUNT(*) FROM profiles WHERE user_type = 'agent' AND is_approved = false),
        'total_properties_by_agents', (
            SELECT COUNT(*) 
            FROM properties p 
            JOIN profiles pr ON p.created_by = pr.id 
            WHERE pr.user_type = 'agent'
        ),
        'agent_constraint_exists', EXISTS(
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'profiles_user_type_check' 
            AND consrc LIKE '%agent%'
        ),
        'is_seller_function_includes_agent', EXISTS(
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'is_seller' 
            AND routine_schema = 'public'
            AND routine_definition LIKE '%agent%'
        ),
        'timestamp', now()
    ) as system_summary;

-- =====================================================
-- 10. رسالة النتيجة
-- =====================================================

SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_type_check' AND consrc LIKE '%agent%')
        AND EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_seller' AND routine_definition LIKE '%agent%')
        THEN '✅ SUCCESS: نظام الوسطاء يعمل بشكل صحيح / Agent system is working correctly!'
        ELSE '❌ WARNING: قد تحتاج لتشغيل سكريبت الإصلاح / You may need to run the fix script'
    END as final_result;
