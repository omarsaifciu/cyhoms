-- إصلاح مشكلة حذف العقارات - Foreign Key Constraint
-- Fix Property Delete Issue - Foreign Key Constraint
-- انسخ والصق هذا في Supabase SQL Editor

-- =====================================================
-- 1. تشخيص المشكلة / Diagnose the Issue
-- =====================================================

-- فحص جدول property_activities
SELECT 
    'فحص جدول property_activities / Check property_activities table:' as info,
    COUNT(*) as total_records
FROM public.property_activities;

-- فحص القيود الخارجية
SELECT 
    'القيود الخارجية / Foreign Key Constraints:' as info,
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table
FROM pg_constraint 
WHERE conname LIKE '%property_activities%' 
AND contype = 'f';

-- فحص العقار المحدد والأنشطة المرتبطة به
SELECT 
    'الأنشطة المرتبطة بالعقار / Activities for specific property:' as info,
    property_id,
    COUNT(*) as activity_count
FROM public.property_activities 
WHERE property_id = '26e68f8f-af55-46db-b885-39da9b2f076b'
GROUP BY property_id;

-- =====================================================
-- 2. الحل الأول: تعديل القيد ليكون CASCADE / Solution 1: Modify constraint to CASCADE
-- =====================================================

-- حذف القيد القديم
ALTER TABLE public.property_activities 
DROP CONSTRAINT IF EXISTS property_activities_property_id_fkey;

-- إضافة قيد جديد مع CASCADE DELETE
ALTER TABLE public.property_activities 
ADD CONSTRAINT property_activities_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- =====================================================
-- 3. الحل الثاني: إنشاء دالة لحذف العقار مع الأنشطة / Solution 2: Create function to delete property with activities
-- =====================================================

-- دالة لحذف العقار مع جميع الأنشطة المرتبطة
CREATE OR REPLACE FUNCTION public.delete_property_with_activities(property_id_param UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    property_exists boolean;
    user_can_delete boolean;
BEGIN
    -- التحقق من وجود العقار
    SELECT EXISTS(
        SELECT 1 FROM public.properties 
        WHERE id = property_id_param
    ) INTO property_exists;
    
    IF NOT property_exists THEN
        RAISE EXCEPTION 'Property not found';
    END IF;
    
    -- التحقق من صلاحية الحذف
    SELECT (
        public.is_admin() OR 
        (
            public.is_approved_seller() AND 
            EXISTS(
                SELECT 1 FROM public.properties 
                WHERE id = property_id_param 
                AND (created_by = auth.uid() OR user_id = auth.uid())
            )
        )
    ) INTO user_can_delete;
    
    IF NOT user_can_delete THEN
        RAISE EXCEPTION 'You do not have permission to delete this property';
    END IF;
    
    -- حذف الأنشطة المرتبطة أولاً
    DELETE FROM public.property_activities 
    WHERE property_id = property_id_param;
    
    -- حذف أي سجلات أخرى مرتبطة (إذا وجدت)
    -- يمكن إضافة المزيد حسب الحاجة
    
    -- حذف العقار
    DELETE FROM public.properties 
    WHERE id = property_id_param;
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error deleting property: %', SQLERRM;
END;
$$;

-- =====================================================
-- 4. إنشاء RPC للاستخدام من الواجهة الأمامية / Create RPC for frontend use
-- =====================================================

-- دالة RPC لحذف العقار
CREATE OR REPLACE FUNCTION public.rpc_delete_property(property_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    property_title text;
BEGIN
    -- جلب عنوان العقار للسجل
    SELECT COALESCE(title_ar, title_en, title_tr, 'Unknown') 
    INTO property_title
    FROM public.properties 
    WHERE id = property_id;
    
    -- محاولة حذف العقار
    PERFORM public.delete_property_with_activities(property_id);
    
    -- إرجاع نتيجة النجاح
    SELECT json_build_object(
        'success', true,
        'message', 'Property deleted successfully',
        'property_id', property_id,
        'property_title', property_title
    ) INTO result;
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- إرجاع نتيجة الخطأ
        SELECT json_build_object(
            'success', false,
            'error', SQLERRM,
            'property_id', property_id
        ) INTO result;
        
        RETURN result;
END;
$$;

-- =====================================================
-- 5. تحديث سياسات RLS / Update RLS Policies
-- =====================================================

-- التأكد من وجود سياسات الحذف الصحيحة
DROP POLICY IF EXISTS "Admins can delete all properties" ON public.properties;
DROP POLICY IF EXISTS "Approved sellers can delete own properties" ON public.properties;

CREATE POLICY "Admins can delete all properties"
ON public.properties 
FOR DELETE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Approved sellers can delete own properties"
ON public.properties 
FOR DELETE 
TO authenticated
USING (
    public.is_approved_seller() 
    AND (created_by = auth.uid() OR user_id = auth.uid())
);

-- سياسات لجدول property_activities
DROP POLICY IF EXISTS "Users can delete property activities" ON public.property_activities;

CREATE POLICY "Users can delete property activities"
ON public.property_activities 
FOR DELETE 
TO authenticated
USING (
    public.is_admin() OR 
    EXISTS(
        SELECT 1 FROM public.properties 
        WHERE id = property_activities.property_id 
        AND (created_by = auth.uid() OR user_id = auth.uid())
        AND public.is_approved_seller()
    )
);

-- =====================================================
-- 6. اختبار الحل / Test the Solution
-- =====================================================

-- اختبار دالة الحذف (بدون تنفيذ فعلي)
SELECT 
    'اختبار صلاحيات الحذف / Test Delete Permissions:' as test_name,
    CASE 
        WHEN public.is_admin() THEN '✅ مدير - يمكن حذف جميع العقارات'
        WHEN public.is_approved_seller() THEN '✅ بائع معتمد - يمكن حذف العقارات الخاصة'
        WHEN public.is_seller() THEN '⚠️ بائع غير معتمد - لا يمكن الحذف'
        ELSE '❌ لا يمكن الحذف'
    END as permission_status;

-- عرض معلومات المستخدم
SELECT 
    'معلومات المستخدم / User Info:' as section,
    user_type,
    is_approved,
    username
FROM public.profiles 
WHERE id = auth.uid();

-- =====================================================
-- 7. تعليمات الاستخدام / Usage Instructions
-- =====================================================

SELECT 
    'تعليمات الاستخدام / Usage Instructions:' as instructions,
    'يمكنك الآن استخدام الدالة rpc_delete_property من الواجهة الأمامية' as frontend_usage,
    'أو الاعتماد على CASCADE DELETE التلقائي' as automatic_cascade;

-- رسالة النجاح
SELECT 
    '🎉 النتيجة / Result:' as result_title,
    '✅ تم إصلاح مشكلة Foreign Key Constraint!' as status,
    'جرب الآن حذف العقار من الواجهة' as next_step;
