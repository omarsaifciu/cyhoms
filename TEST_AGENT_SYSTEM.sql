-- اختبار سريع لنظام الوسطاء المحدث
-- Quick Test for Updated Agent System
-- شغل هذا للتأكد من أن كل شيء يعمل بشكل صحيح

-- =====================================================
-- 1. اختبار سريع للنظام / Quick System Test
-- =====================================================

-- التحقق من عدم وجود seller
SELECT 
    '🔍 فحص السجلات القديمة / Check Old Records:' as test_name,
    COUNT(*) as seller_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCCESS: لا توجد سجلات seller'
        ELSE '❌ ERROR: توجد سجلات seller'
    END as result
FROM public.profiles 
WHERE user_type = 'seller';

-- التحقق من القيد
SELECT 
    '🔍 فحص القيد / Check Constraint:' as test_name,
    CASE 
        WHEN consrc LIKE '%agent%' AND consrc NOT LIKE '%seller%' 
        THEN '✅ SUCCESS: القيد محدث بشكل صحيح'
        ELSE '❌ ERROR: القيد يحتاج تحديث'
    END as result
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';

-- اختبار دالة is_seller
SELECT 
    '🔍 اختبار دالة is_seller / Test is_seller Function:' as test_name,
    CASE 
        WHEN routine_definition LIKE '%agent%' 
        THEN '✅ SUCCESS: دالة is_seller محدثة'
        ELSE '❌ ERROR: دالة is_seller تحتاج تحديث'
    END as result
FROM information_schema.routines 
WHERE routine_name = 'is_seller' AND routine_schema = 'public';

-- =====================================================
-- 2. اختبار الدوال للمستخدم الحالي / Test Functions for Current User
-- =====================================================

-- معلومات المستخدم الحالي
SELECT 
    '👤 معلومات المستخدم الحالي / Current User Info:' as section,
    COALESCE(user_type, 'غير محدد') as user_type,
    COALESCE(is_approved::text, 'غير محدد') as is_approved,
    COALESCE(username, 'غير محدد') as username
FROM public.profiles 
WHERE id = auth.uid();

-- اختبار جميع الدوال
SELECT 
    '🧪 اختبار الدوال / Functions Test:' as section,
    public.is_seller() as is_seller,
    public.is_approved_seller() as is_approved_seller,
    public.is_admin() as is_admin;

-- اختبار الدوال الجديدة إذا كانت موجودة
SELECT 
    '🆕 اختبار الدوال الجديدة / New Functions Test:' as section,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_agent')
        THEN public.is_agent()
        ELSE NULL
    END as is_agent,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_approved_agent')
        THEN public.is_approved_agent()
        ELSE NULL
    END as is_approved_agent;

-- =====================================================
-- 3. إحصائيات سريعة / Quick Statistics
-- =====================================================

-- توزيع أنواع المستخدمين
SELECT 
    '📊 توزيع أنواع المستخدمين / User Types Distribution:' as section,
    user_type,
    COUNT(*) as count
FROM public.profiles 
WHERE user_type IS NOT NULL
GROUP BY user_type
ORDER BY count DESC;

-- الوسطاء المعتمدون
SELECT 
    '✅ الوسطاء المعتمدون / Approved Agents:' as section,
    COUNT(*) as approved_agents_count
FROM public.profiles 
WHERE user_type = 'agent' AND is_approved = true;

-- =====================================================
-- 4. اختبار سياسات RLS / Test RLS Policies
-- =====================================================

-- عرض سياسات العقارات
SELECT 
    '🔐 سياسات العقارات / Properties Policies:' as section,
    policyname,
    cmd,
    CASE 
        WHEN qual LIKE '%is_seller%' OR qual LIKE '%is_approved_seller%' 
        THEN '✅ محدثة'
        ELSE '⚠️ قد تحتاج مراجعة'
    END as status
FROM pg_policies 
WHERE tablename = 'properties'
ORDER BY policyname;

-- =====================================================
-- 5. اختبار العقارات / Test Properties
-- =====================================================

-- عقارات الوسطاء
SELECT 
    '🏠 عقارات الوسطاء / Agent Properties:' as section,
    COUNT(*) as properties_by_agents
FROM public.properties p
JOIN public.profiles pr ON p.created_by = pr.id
WHERE pr.user_type = 'agent';

-- =====================================================
-- 6. تقرير شامل / Comprehensive Report
-- =====================================================

SELECT 
    '📋 تقرير شامل / Comprehensive Report:' as report_title,
    json_build_object(
        'system_status', CASE 
            WHEN NOT EXISTS(SELECT 1 FROM public.profiles WHERE user_type = 'seller')
            AND EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_type_check' AND consrc LIKE '%agent%')
            AND EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_seller' AND routine_definition LIKE '%agent%')
            THEN '✅ النظام يعمل بشكل صحيح / System working correctly'
            ELSE '⚠️ يحتاج مراجعة / Needs review'
        END,
        'total_users', (SELECT COUNT(*) FROM public.profiles),
        'total_agents', (SELECT COUNT(*) FROM public.profiles WHERE user_type = 'agent'),
        'approved_agents', (SELECT COUNT(*) FROM public.profiles WHERE user_type = 'agent' AND is_approved = true),
        'total_properties', (SELECT COUNT(*) FROM public.properties),
        'agent_properties', (
            SELECT COUNT(*) 
            FROM public.properties p 
            JOIN public.profiles pr ON p.created_by = pr.id 
            WHERE pr.user_type = 'agent'
        ),
        'functions_available', ARRAY[
            'is_seller()',
            'is_approved_seller()',
            'is_admin()'
        ] || CASE 
            WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_agent')
            THEN ARRAY['is_agent()']
            ELSE ARRAY[]::text[]
        END || CASE 
            WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_approved_agent')
            THEN ARRAY['is_approved_agent()']
            ELSE ARRAY[]::text[]
        END,
        'timestamp', now()
    ) as system_report;

-- =====================================================
-- 7. خطوات التالية / Next Steps
-- =====================================================

SELECT 
    '📝 الخطوات التالية / Next Steps:' as next_steps,
    CASE 
        WHEN NOT EXISTS(SELECT 1 FROM public.profiles WHERE user_type = 'seller')
        AND EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_type_check' AND consrc LIKE '%agent%')
        THEN '✅ قاعدة البيانات جاهزة! الآن حدث الكود الأمامي / Database ready! Now update frontend code'
        ELSE '❌ شغل سكريبت FIX_SELLER_TO_AGENT_CONFLICTS.sql أولاً / Run FIX_SELLER_TO_AGENT_CONFLICTS.sql first'
    END as recommendation;

-- رسالة نهائية
SELECT 
    '🎉 النتيجة النهائية / Final Result:' as final_message,
    CASE 
        WHEN NOT EXISTS(SELECT 1 FROM public.profiles WHERE user_type = 'seller')
        AND EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_type_check' AND consrc LIKE '%agent%')
        AND EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_seller' AND routine_definition LIKE '%agent%')
        THEN '🎉 SUCCESS: نظام الوسطاء يعمل بشكل مثالي! / Agent system working perfectly!'
        ELSE '⚠️ WARNING: يحتاج إصلاحات إضافية / Needs additional fixes'
    END as status;
