-- إصلاح دالة is_seller مع مراعاة السياسات المعتمدة عليها
-- Fix is_seller function while considering dependent policies
-- انسخ والصق هذا في Supabase SQL Editor

-- =====================================================
-- الطريقة الصحيحة: تحديث الدالة بدون حذفها
-- Correct Method: Update function without dropping it
-- =====================================================

-- تحديث دالة is_seller مباشرة (بدون حذف)
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- الوسطاء (كان seller سابقاً)
        'property_owner',           -- مالكو العقارات
        'real_estate_office',       -- المكاتب العقارية
        'partner_and_site_owner'    -- الشركاء ومالكو الموقع
    )
  );
$$;

-- تحديث دالة is_approved_seller مباشرة (بدون حذف)
CREATE OR REPLACE FUNCTION public.is_approved_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- الوسطاء المعتمدون
        'property_owner',           -- مالكو العقارات المعتمدون
        'real_estate_office',       -- المكاتب العقارية المعتمدة
        'partner_and_site_owner'    -- الشركاء المعتمدون
    )
    AND is_approved = true
  );
$$;

-- التأكد من تحديث جميع السجلات من seller إلى agent
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- =====================================================
-- اختبار الدوال المحدثة
-- Test Updated Functions
-- =====================================================

-- اختبار دالة is_seller
SELECT 
    'اختبار دالة is_seller المحدثة / Test Updated is_seller:' as test_name,
    public.is_seller() as result;

-- اختبار دالة is_approved_seller
SELECT 
    'اختبار دالة is_approved_seller المحدثة / Test Updated is_approved_seller:' as test_name,
    public.is_approved_seller() as result;

-- عرض معلومات المستخدم الحالي
SELECT 
    'معلومات المستخدم الحالي / Current User Info:' as info,
    user_type,
    is_approved,
    username,
    email
FROM public.profiles 
WHERE id = auth.uid();

-- =====================================================
-- التحقق من التحديث
-- Verify Update
-- =====================================================

-- التحقق من أن الدالة تحتوي على agent
SELECT 
    'التحقق من محتوى الدالة / Verify Function Content:' as check_name,
    CASE 
        WHEN routine_definition LIKE '%agent%' 
        THEN '✅ SUCCESS: الدالة تحتوي على agent'
        ELSE '❌ ERROR: الدالة لا تحتوي على agent'
    END as status
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- التحقق من عدم وجود سجلات seller
SELECT 
    'التحقق من عدم وجود seller / Check No Seller Records:' as check_name,
    COUNT(*) as seller_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCCESS: لا توجد سجلات seller'
        ELSE '❌ ERROR: توجد سجلات seller'
    END as status
FROM public.profiles 
WHERE user_type = 'seller';

-- =====================================================
-- رسالة النجاح النهائية
-- Final Success Message
-- =====================================================

SELECT 
    '🎉 النتيجة النهائية / Final Result:' as result_title,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'is_seller' 
            AND routine_schema = 'public'
            AND routine_definition LIKE '%agent%'
        )
        AND NOT EXISTS(SELECT 1 FROM public.profiles WHERE user_type = 'seller')
        THEN '✅ SUCCESS: تم إصلاح دالة is_seller بنجاح! الآن تعمل مع agent'
        ELSE '⚠️ WARNING: قد تحتاج مراجعة إضافية'
    END as status;
