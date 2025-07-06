-- إصلاح مشكلة حذف العقارات
-- Fix Property Delete Issue
-- انسخ والصق هذا في Supabase SQL Editor

-- =====================================================
-- إصلاح شامل لمشكلة حذف العقارات
-- Comprehensive Fix for Property Delete Issue
-- =====================================================

-- 1. تحديث دالة is_seller للتأكد من عملها مع agent
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

-- 2. تحديث دالة is_approved_seller
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

-- 3. حذف السياسات القديمة للحذف
DROP POLICY IF EXISTS "Sellers can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete all properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Property owners can delete" ON public.properties;

-- 4. إنشاء سياسة حذف جديدة للمديرين
CREATE POLICY "Admins can delete all properties"
ON public.properties 
FOR DELETE 
TO authenticated
USING (public.is_admin());

-- 5. إنشاء سياسة حذف جديدة للبائعين المعتمدين
CREATE POLICY "Approved sellers can delete own properties"
ON public.properties 
FOR DELETE 
TO authenticated
USING (
    public.is_approved_seller() 
    AND (created_by = auth.uid() OR user_id = auth.uid())
);

-- 6. التأكد من تحديث جميع السجلات من seller إلى agent
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- 7. اختبار الدوال
SELECT 
    'اختبار الدوال / Test Functions:' as test_name,
    public.is_seller() as is_seller,
    public.is_approved_seller() as is_approved_seller,
    public.is_admin() as is_admin;

-- 8. عرض معلومات المستخدم الحالي
SELECT 
    'معلومات المستخدم / User Info:' as section,
    user_type,
    is_approved,
    username
FROM public.profiles 
WHERE id = auth.uid();

-- 9. اختبار صلاحية الحذف
SELECT 
    'صلاحية الحذف / Delete Permission:' as test,
    CASE 
        WHEN public.is_admin() THEN '✅ يمكن حذف جميع العقارات (مدير)'
        WHEN public.is_approved_seller() THEN '✅ يمكن حذف العقارات الخاصة (بائع معتمد)'
        WHEN public.is_seller() AND NOT public.is_approved_seller() THEN '⚠️ بائع غير معتمد - لا يمكن حذف العقارات'
        ELSE '❌ لا يمكن حذف العقارات'
    END as permission_status;

-- 10. عرض السياسات الجديدة
SELECT 
    'السياسات الجديدة / New Policies:' as section,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'properties' 
AND cmd = 'DELETE';

-- رسالة النجاح
SELECT '✅ تم إصلاح مشكلة حذف العقارات! جرب الآن حذف عقار من الواجهة.' as message;
