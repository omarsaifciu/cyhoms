-- إصلاح شامل لتضارب seller/agent في النظام
-- Comprehensive Fix for seller/agent Conflicts in System
-- شغل هذا السكريبت في Supabase SQL Editor لحل جميع التضاربات

-- =====================================================
-- 1. تشخيص التضارب الحالي / Diagnose Current Conflicts
-- =====================================================

-- فحص القيد الحالي
-- Check current constraint
SELECT 
    'فحص القيد الحالي / Current Constraint Check:' as info,
    conname as constraint_name,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';

-- فحص وجود سجلات seller قديمة
-- Check for old seller records
SELECT 
    'فحص السجلات القديمة / Old Records Check:' as info,
    COUNT(*) as seller_records_count
FROM public.profiles 
WHERE user_type = 'seller';

-- فحص الدوال الحالية
-- Check current functions
SELECT 
    'فحص الدوال / Functions Check:' as info,
    routine_name,
    CASE 
        WHEN routine_definition LIKE '%agent%' THEN '✅ محدث / Updated'
        WHEN routine_definition LIKE '%seller%' THEN '⚠️ يحتاج تحديث / Needs Update'
        ELSE '❓ غير واضح / Unclear'
    END as status
FROM information_schema.routines 
WHERE routine_name IN ('is_seller', 'is_approved_seller')
AND routine_schema = 'public';

-- =====================================================
-- 2. إصلاح شامل للقيد / Comprehensive Constraint Fix
-- =====================================================

-- تحديث جميع السجلات القديمة
-- Update all old records
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- حذف القيد القديم
-- Drop old constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- إضافة القيد الجديد مع جميع الأنواع المطلوبة
-- Add new constraint with all required types
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (
    user_type IN (
      'client',                    -- عميل
      'agent',                     -- وسيط (كان seller)
      'property_owner',            -- مالك عقار
      'real_estate_office',        -- مكتب عقاري
      'partner_and_site_owner',    -- شريك ومالك الموقع
      'admin',                     -- مدير
      'support'                    -- دعم فني
    )
  );

-- =====================================================
-- 3. إصلاح الدوال بشكل نهائي / Final Functions Fix
-- =====================================================

-- دالة is_seller محدثة
-- Updated is_seller function
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- ✅ الوسطاء
        'property_owner',           -- ✅ مالكو العقارات
        'real_estate_office',       -- ✅ المكاتب العقارية
        'partner_and_site_owner'    -- ✅ الشركاء
    )
  );
$$;

-- دالة is_approved_seller محدثة
-- Updated is_approved_seller function
CREATE OR REPLACE FUNCTION public.is_approved_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- ✅ الوسطاء
        'property_owner',           -- ✅ مالكو العقارات
        'real_estate_office',       -- ✅ المكاتب العقارية
        'partner_and_site_owner'    -- ✅ الشركاء
    )
    AND is_approved = true
  );
$$;

-- دالة is_admin محدثة
-- Updated is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
  );
$$;

-- =====================================================
-- 4. إنشاء دالة جديدة للوسطاء / New Agent Function
-- =====================================================

-- دالة للتحقق من كون المستخدم وسيط فقط
-- Function to check if user is specifically an agent
CREATE OR REPLACE FUNCTION public.is_agent()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'agent'
  );
$$;

-- دالة للتحقق من كون المستخدم وسيط معتمد
-- Function to check if user is approved agent
CREATE OR REPLACE FUNCTION public.is_approved_agent()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'agent'
    AND is_approved = true
  );
$$;

-- =====================================================
-- 5. تحديث التعليقات والوصف / Update Comments
-- =====================================================

-- تحديث تعليقات الدوال
-- Update function comments
COMMENT ON FUNCTION public.is_seller() IS 'التحقق من كون المستخدم بائع (وسيط، مالك عقار، مكتب عقاري، أو شريك) / Check if user is seller (agent, property owner, real estate office, or partner)';

COMMENT ON FUNCTION public.is_approved_seller() IS 'التحقق من كون المستخدم بائع معتمد / Check if user is approved seller';

COMMENT ON FUNCTION public.is_agent() IS 'التحقق من كون المستخدم وسيط فقط / Check if user is specifically an agent';

COMMENT ON FUNCTION public.is_approved_agent() IS 'التحقق من كون المستخدم وسيط معتمد / Check if user is approved agent';

COMMENT ON FUNCTION public.is_admin() IS 'التحقق من كون المستخدم مدير / Check if user is admin';

-- =====================================================
-- 6. إصلاح سياسات RLS / Fix RLS Policies
-- =====================================================

-- حذف السياسات القديمة التي قد تحتوي على seller
-- Drop old policies that might contain seller references
DROP POLICY IF EXISTS "Sellers can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Approved sellers can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Sellers can update own properties" ON public.properties;

-- إنشاء سياسات جديدة محدثة
-- Create new updated policies
CREATE POLICY "Approved sellers can insert properties"
ON public.properties 
FOR INSERT 
TO authenticated
WITH CHECK (
    public.is_approved_seller() 
    AND public.can_user_add_property(auth.uid())
);

CREATE POLICY "Sellers can update own properties"
ON public.properties 
FOR UPDATE 
TO authenticated
USING (
    (created_by = auth.uid() OR user_id = auth.uid())
    AND public.is_seller()
);

CREATE POLICY "Sellers can delete own properties"
ON public.properties 
FOR DELETE 
TO authenticated
USING (
    (created_by = auth.uid() OR user_id = auth.uid())
    AND public.is_seller()
);

-- =====================================================
-- 7. اختبار النظام المحدث / Test Updated System
-- =====================================================

-- اختبار الدوال الجديدة
-- Test new functions
SELECT 
    'اختبار الدوال / Functions Test:' as test_section,
    public.is_seller() as is_seller_result,
    public.is_approved_seller() as is_approved_seller_result,
    public.is_agent() as is_agent_result,
    public.is_approved_agent() as is_approved_agent_result,
    public.is_admin() as is_admin_result;

-- عرض معلومات المستخدم الحالي
-- Show current user info
SELECT 
    'معلومات المستخدم الحالي / Current User Info:' as info_section,
    id,
    user_type,
    is_approved,
    username,
    email,
    created_at
FROM public.profiles 
WHERE id = auth.uid();

-- =====================================================
-- 8. إحصائيات النظام المحدث / Updated System Stats
-- =====================================================

-- إحصائيات أنواع المستخدمين
-- User types statistics
SELECT 
    'إحصائيات أنواع المستخدمين / User Types Statistics:' as stats_section,
    user_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_count,
    COUNT(CASE WHEN is_approved = false THEN 1 END) as pending_count
FROM public.profiles 
WHERE user_type IS NOT NULL
GROUP BY user_type
ORDER BY total_count DESC;

-- التحقق من عدم وجود seller
-- Verify no seller records remain
SELECT 
    'التحقق من عدم وجود seller / Verify No Seller Records:' as verification,
    COUNT(*) as seller_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCCESS: لا توجد سجلات seller / No seller records found'
        ELSE '❌ ERROR: ما زالت توجد سجلات seller / Seller records still exist'
    END as status
FROM public.profiles 
WHERE user_type = 'seller';

-- =====================================================
-- 9. إنشاء دالة شاملة للتحقق / Comprehensive Check Function
-- =====================================================

-- دالة شاملة للتحقق من حالة المستخدم
-- Comprehensive user status check function
CREATE OR REPLACE FUNCTION public.get_user_comprehensive_status(user_id UUID DEFAULT auth.uid())
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
    WHERE id = user_id;
    
    -- إنشاء JSON شامل
    SELECT json_build_object(
        'user_id', user_id,
        'user_type', user_info.user_type,
        'is_approved', user_info.is_approved,
        'username', user_info.username,
        'full_name', user_info.full_name,
        'email', user_info.email,
        'created_at', user_info.created_at,
        'permissions', json_build_object(
            'is_seller', (user_info.user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')),
            'is_approved_seller', (user_info.user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner') AND user_info.is_approved = true),
            'is_agent', (user_info.user_type = 'agent'),
            'is_approved_agent', (user_info.user_type = 'agent' AND user_info.is_approved = true),
            'is_admin', (user_info.user_type = 'admin'),
            'is_support', (user_info.user_type = 'support'),
            'is_client', (user_info.user_type = 'client')
        ),
        'status_description', CASE 
            WHEN user_info.user_type = 'admin' THEN 'مدير النظام / System Administrator'
            WHEN user_info.user_type = 'support' THEN 'دعم فني / Technical Support'
            WHEN user_info.user_type = 'agent' AND user_info.is_approved = true THEN 'وسيط معتمد / Approved Agent'
            WHEN user_info.user_type = 'agent' AND user_info.is_approved = false THEN 'وسيط في انتظار الموافقة / Pending Agent'
            WHEN user_info.user_type = 'property_owner' AND user_info.is_approved = true THEN 'مالك عقار معتمد / Approved Property Owner'
            WHEN user_info.user_type = 'property_owner' AND user_info.is_approved = false THEN 'مالك عقار في انتظار الموافقة / Pending Property Owner'
            WHEN user_info.user_type = 'real_estate_office' THEN 'مكتب عقاري / Real Estate Office'
            WHEN user_info.user_type = 'partner_and_site_owner' THEN 'شريك ومالك الموقع / Partner and Site Owner'
            WHEN user_info.user_type = 'client' THEN 'عميل / Client'
            ELSE 'غير محدد / Undefined'
        END
    ) INTO result;
    
    RETURN result;
END;
$$;

-- =====================================================
-- 10. اختبار نهائي وتأكيد / Final Test and Confirmation
-- =====================================================

-- اختبار الدالة الشاملة
-- Test comprehensive function
SELECT 
    'اختبار الدالة الشاملة / Comprehensive Function Test:' as final_test,
    public.get_user_comprehensive_status() as user_status;

-- رسالة النجاح النهائية
-- Final success message
SELECT 
    CASE 
        WHEN NOT EXISTS(SELECT 1 FROM public.profiles WHERE user_type = 'seller')
        AND EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_type_check' AND consrc LIKE '%agent%')
        AND EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'is_seller' AND routine_definition LIKE '%agent%')
        THEN '🎉 SUCCESS: تم إصلاح جميع تضاربات seller/agent بنجاح! / All seller/agent conflicts fixed successfully!'
        ELSE '⚠️ WARNING: قد تحتاج لمراجعة إضافية / May need additional review'
    END as final_result;
