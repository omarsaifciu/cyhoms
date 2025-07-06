-- إصلاح مباشر لدالة is_seller
-- Direct Fix for is_seller Function
-- انسخ والصق هذا في Supabase SQL Editor وشغله

-- =====================================================
-- إصلاح دالة is_seller نهائياً
-- Final Fix for is_seller Function
-- =====================================================

-- حذف الدالة القديمة إذا كانت موجودة
DROP FUNCTION IF EXISTS public.is_seller();

-- إنشاء دالة is_seller جديدة ومحدثة
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

-- إصلاح دالة is_approved_seller أيضاً
DROP FUNCTION IF EXISTS public.is_approved_seller();

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

-- التأكد من أن جميع السجلات محدثة من seller إلى agent
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- اختبار سريع
SELECT 
    'اختبار دالة is_seller / Test is_seller:' as test,
    public.is_seller() as result,
    user_type,
    is_approved
FROM public.profiles 
WHERE id = auth.uid();

-- رسالة نجاح
SELECT '✅ تم إصلاح دالة is_seller بنجاح! / is_seller function fixed successfully!' as message;
