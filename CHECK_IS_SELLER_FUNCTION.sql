-- فحص دالة is_seller في قاعدة البيانات
-- Check is_seller function in database
-- شغل هذا في Supabase SQL Editor للتحقق من الحالة الحالية

-- =====================================================
-- 1. فحص دالة is_seller الحالية / Check Current is_seller Function
-- =====================================================

-- عرض تعريف دالة is_seller
SELECT 
    'تعريف دالة is_seller الحالية / Current is_seller Function Definition:' as info,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- التحقق من محتوى الدالة
SELECT 
    'فحص محتوى الدالة / Function Content Check:' as check_type,
    CASE 
        WHEN routine_definition LIKE '%seller%' AND routine_definition NOT LIKE '%agent%' 
        THEN '❌ ERROR: الدالة تبحث عن seller وليس agent'
        WHEN routine_definition LIKE '%agent%' 
        THEN '✅ SUCCESS: الدالة محدثة لتتضمن agent'
        ELSE '⚠️ WARNING: محتوى الدالة غير واضح'
    END as status,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- =====================================================
-- 2. فحص أنواع المستخدمين في قاعدة البيانات / Check User Types in Database
-- =====================================================

-- عرض جميع أنواع المستخدمين الموجودة
SELECT 
    'أنواع المستخدمين الموجودة / Existing User Types:' as info,
    user_type,
    COUNT(*) as count
FROM public.profiles 
WHERE user_type IS NOT NULL
GROUP BY user_type
ORDER BY count DESC;

-- التحقق من وجود seller
SELECT 
    'فحص وجود seller / Check for seller records:' as check_type,
    COUNT(*) as seller_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCCESS: لا توجد سجلات seller'
        ELSE '❌ ERROR: توجد سجلات seller تحتاج تحديث'
    END as status
FROM public.profiles 
WHERE user_type = 'seller';

-- =====================================================
-- 3. اختبار دالة is_seller للمستخدم الحالي / Test is_seller for Current User
-- =====================================================

-- معلومات المستخدم الحالي
SELECT 
    'معلومات المستخدم الحالي / Current User Info:' as section,
    id,
    user_type,
    is_approved,
    username,
    email
FROM public.profiles 
WHERE id = auth.uid();

-- اختبار دالة is_seller
SELECT 
    'اختبار دالة is_seller / Test is_seller Function:' as test_name,
    public.is_seller() as result,
    CASE 
        WHEN public.is_seller() = true THEN '✅ المستخدم معرف كـ seller'
        WHEN public.is_seller() = false THEN '❌ المستخدم ليس seller'
        ELSE '⚠️ نتيجة غير متوقعة'
    END as interpretation
FROM public.profiles 
WHERE id = auth.uid()
LIMIT 1;

-- =====================================================
-- 4. إصلاح دالة is_seller نهائياً / Final Fix for is_seller Function
-- =====================================================

-- إعادة إنشاء دالة is_seller بشكل صحيح
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- ✅ الوسطاء (كان seller سابقاً)
        'property_owner',           -- ✅ مالكو العقارات
        'real_estate_office',       -- ✅ المكاتب العقارية
        'partner_and_site_owner'    -- ✅ الشركاء ومالكو الموقع
    )
  );
$$;

-- إضافة تعليق للدالة
COMMENT ON FUNCTION public.is_seller() IS 'التحقق من كون المستخدم بائع (وسيط، مالك عقار، مكتب عقاري، أو شريك) - تم تحديثها لتستخدم agent بدلاً من seller';

-- =====================================================
-- 5. إنشاء دالة is_approved_seller محدثة / Create Updated is_approved_seller
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_approved_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- ✅ الوسطاء المعتمدون
        'property_owner',           -- ✅ مالكو العقارات المعتمدون
        'real_estate_office',       -- ✅ المكاتب العقارية المعتمدة
        'partner_and_site_owner'    -- ✅ الشركاء المعتمدون
    )
    AND is_approved = true
  );
$$;

-- إضافة تعليق للدالة
COMMENT ON FUNCTION public.is_approved_seller() IS 'التحقق من كون المستخدم بائع معتمد - تم تحديثها لتستخدم agent بدلاً من seller';

-- =====================================================
-- 6. اختبار الدوال المحدثة / Test Updated Functions
-- =====================================================

-- اختبار دالة is_seller المحدثة
SELECT 
    'اختبار دالة is_seller المحدثة / Test Updated is_seller:' as test_name,
    public.is_seller() as is_seller_result;

-- اختبار دالة is_approved_seller المحدثة
SELECT 
    'اختبار دالة is_approved_seller المحدثة / Test Updated is_approved_seller:' as test_name,
    public.is_approved_seller() as is_approved_seller_result;

-- =====================================================
-- 7. التحقق من التحديث / Verify Update
-- =====================================================

-- التحقق من أن الدالة محدثة
SELECT 
    'التحقق من التحديث / Verify Update:' as verification,
    CASE 
        WHEN routine_definition LIKE '%agent%' AND routine_definition NOT LIKE '%seller%'
        THEN '✅ SUCCESS: دالة is_seller محدثة بنجاح'
        WHEN routine_definition LIKE '%agent%' AND routine_definition LIKE '%seller%'
        THEN '⚠️ WARNING: الدالة تحتوي على agent و seller معاً'
        ELSE '❌ ERROR: الدالة لم تُحدث بشكل صحيح'
    END as status
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- عرض التعريف الجديد للدالة
SELECT 
    'التعريف الجديد لدالة is_seller / New is_seller Definition:' as info,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- =====================================================
-- 8. اختبار شامل للنظام / Comprehensive System Test
-- =====================================================

-- اختبار مع مستخدم agent
SELECT 
    'اختبار مع مستخدم agent / Test with agent user:' as test_section,
    user_type,
    is_approved,
    public.is_seller() as should_be_true_for_agent,
    public.is_approved_seller() as depends_on_approval
FROM public.profiles 
WHERE user_type = 'agent' 
AND id = auth.uid();

-- اختبار مع مستخدم client
SELECT 
    'اختبار مع مستخدم client / Test with client user:' as test_section,
    user_type,
    public.is_seller() as should_be_false_for_client
FROM public.profiles 
WHERE user_type = 'client' 
AND id = auth.uid();

-- =====================================================
-- 9. رسالة النجاح / Success Message
-- =====================================================

SELECT 
    '🎉 النتيجة النهائية / Final Result:' as final_result,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'is_seller' 
            AND routine_schema = 'public'
            AND routine_definition LIKE '%agent%'
            AND routine_definition NOT LIKE '%seller%'
        )
        THEN '✅ SUCCESS: دالة is_seller تم إصلاحها وتعمل مع agent الآن!'
        ELSE '❌ ERROR: دالة is_seller تحتاج مراجعة إضافية'
    END as status;

-- عرض ملخص الدوال المتاحة
SELECT 
    'الدوال المتاحة / Available Functions:' as summary,
    routine_name,
    'متاحة / Available' as status
FROM information_schema.routines 
WHERE routine_name IN ('is_seller', 'is_approved_seller', 'is_admin')
AND routine_schema = 'public'
ORDER BY routine_name;
