-- تشخيص مشكلة حذف العقارات
-- Diagnose Property Delete Issue
-- شغل هذا في Supabase SQL Editor لتشخيص المشكلة

-- =====================================================
-- 1. فحص سياسات RLS للعقارات / Check Properties RLS Policies
-- =====================================================

-- عرض جميع سياسات العقارات
SELECT 
    'سياسات العقارات / Properties Policies:' as section,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'properties'
ORDER BY cmd, policyname;

-- =====================================================
-- 2. فحص دالة is_seller الحالية / Check Current is_seller Function
-- =====================================================

-- عرض تعريف دالة is_seller
SELECT 
    'دالة is_seller الحالية / Current is_seller Function:' as info,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'is_seller' 
AND routine_schema = 'public';

-- اختبار دالة is_seller للمستخدم الحالي
SELECT 
    'اختبار دالة is_seller / Test is_seller Function:' as test,
    public.is_seller() as is_seller_result,
    public.is_approved_seller() as is_approved_seller_result,
    public.is_admin() as is_admin_result;

-- =====================================================
-- 3. فحص معلومات المستخدم الحالي / Check Current User Info
-- =====================================================

-- معلومات المستخدم الحالي
SELECT 
    'معلومات المستخدم الحالي / Current User Info:' as section,
    id as user_id,
    user_type,
    is_approved,
    username,
    email,
    created_at
FROM public.profiles 
WHERE id = auth.uid();

-- =====================================================
-- 4. فحص العقارات المملوكة للمستخدم / Check User's Properties
-- =====================================================

-- عقارات المستخدم الحالي
SELECT 
    'عقارات المستخدم الحالي / Current User Properties:' as section,
    id,
    title_ar,
    title_en,
    created_by,
    user_id,
    status,
    created_at
FROM public.properties 
WHERE created_by = auth.uid() OR user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- 5. اختبار صلاحيات الحذف / Test Delete Permissions
-- =====================================================

-- محاولة فهم سياسة الحذف
SELECT 
    'سياسات الحذف / Delete Policies:' as section,
    policyname,
    qual as policy_condition
FROM pg_policies 
WHERE tablename = 'properties' 
AND cmd = 'DELETE';

-- =====================================================
-- 6. إنشاء/إصلاح سياسة حذف العقارات / Create/Fix Property Delete Policy
-- =====================================================

-- حذف السياسات القديمة للحذف
DROP POLICY IF EXISTS "Sellers can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete all properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON public.properties;

-- إنشاء سياسة حذف جديدة للمديرين
CREATE POLICY "Admins can delete all properties"
ON public.properties 
FOR DELETE 
TO authenticated
USING (public.is_admin());

-- إنشاء سياسة حذف جديدة للبائعين (عقاراتهم الخاصة فقط)
CREATE POLICY "Sellers can delete own properties"
ON public.properties 
FOR DELETE 
TO authenticated
USING (
    public.is_seller() 
    AND (created_by = auth.uid() OR user_id = auth.uid())
);

-- =====================================================
-- 7. إصلاح دالة is_seller إذا لم تكن محدثة / Fix is_seller if not updated
-- =====================================================

-- تحديث دالة is_seller للتأكد من أنها تعمل مع agent
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- الوسطاء
        'property_owner',           -- مالكو العقارات
        'real_estate_office',       -- المكاتب العقارية
        'partner_and_site_owner'    -- الشركاء
    )
  );
$$;

-- تحديث دالة is_approved_seller
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

-- =====================================================
-- 8. اختبار الصلاحيات بعد الإصلاح / Test Permissions After Fix
-- =====================================================

-- اختبار الدوال المحدثة
SELECT 
    'اختبار الدوال بعد الإصلاح / Test Functions After Fix:' as test_section,
    public.is_seller() as is_seller_result,
    public.is_approved_seller() as is_approved_seller_result,
    public.is_admin() as is_admin_result;

-- اختبار إمكانية الحذف (محاكاة)
SELECT 
    'اختبار صلاحية الحذف / Test Delete Permission:' as test_section,
    CASE 
        WHEN public.is_admin() THEN '✅ يمكن حذف جميع العقارات (مدير)'
        WHEN public.is_seller() THEN '✅ يمكن حذف العقارات الخاصة (بائع)'
        ELSE '❌ لا يمكن حذف العقارات'
    END as delete_permission;

-- =====================================================
-- 9. عرض السياسات الجديدة / Show New Policies
-- =====================================================

-- عرض سياسات الحذف الجديدة
SELECT 
    'السياسات الجديدة / New Policies:' as section,
    policyname,
    cmd,
    qual as condition
FROM pg_policies 
WHERE tablename = 'properties' 
AND cmd = 'DELETE'
ORDER BY policyname;

-- =====================================================
-- 10. تعليمات الاختبار / Testing Instructions
-- =====================================================

SELECT 
    'تعليمات الاختبار / Testing Instructions:' as instructions,
    'الآن جرب حذف عقار من الواجهة الأمامية / Now try deleting a property from the frontend' as next_step;

-- رسالة النجاح
SELECT 
    '🎉 النتيجة / Result:' as result_title,
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND cmd = 'DELETE' AND policyname LIKE '%Sellers can delete own properties%')
        AND EXISTS(SELECT 1 FROM pg_policies WHERE tablename = 'properties' AND cmd = 'DELETE' AND policyname LIKE '%Admins can delete all properties%')
        THEN '✅ SUCCESS: تم إصلاح سياسات حذف العقارات!'
        ELSE '⚠️ WARNING: قد تحتاج مراجعة إضافية'
    END as status;
