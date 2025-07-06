-- تشخيص وإصلاح مشاكل حذف العقارات
-- Diagnose and Fix Property Deletion Issues

-- 1. تشخيص المشكلة / Diagnose the Issue
-- ===================================

-- فحص RLS policies الحالية / Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'properties' 
ORDER BY cmd, policyname;

-- فحص foreign key constraints / Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND ccu.table_name = 'properties';

-- فحص الوظائف المستخدمة في RLS / Check RLS functions
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name IN ('is_seller', 'is_admin', 'is_approved_seller')
AND routine_schema = 'public';

-- 2. إصلاح المشاكل / Fix the Issues
-- ================================

-- إعادة إنشاء وظيفة is_seller / Recreate is_seller function
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
  );
$$;

-- إعادة إنشاء وظيفة is_approved_seller / Recreate is_approved_seller function
CREATE OR REPLACE FUNCTION public.is_approved_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
    AND is_approved = true
  );
$$;

-- حذف وإعادة إنشاء سياسات الحذف / Drop and recreate DELETE policies
DROP POLICY IF EXISTS "Sellers can delete their own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete all properties" ON public.properties;

-- سياسة حذف محسنة للأدمن / Improved admin delete policy
CREATE POLICY "Admins can delete all properties" 
ON public.properties 
FOR DELETE 
TO authenticated
USING (public.is_admin());

-- سياسة حذف محسنة للناشرين / Improved seller delete policy
CREATE POLICY "Sellers can delete their own properties" 
ON public.properties 
FOR DELETE 
TO authenticated
USING (
  public.is_seller() AND 
  (
    created_by = auth.uid() OR 
    user_id = auth.uid() OR
    id IN (
      SELECT p.id FROM public.properties p
      JOIN public.profiles pr ON pr.id = auth.uid()
      WHERE p.created_by = auth.uid() OR p.user_id = auth.uid()
    )
  )
);

-- 3. إصلاح foreign key constraints / Fix foreign key constraints
-- ============================================================

-- تحديث constraint لجدول property_activities / Update property_activities constraint
ALTER TABLE public.property_activities 
DROP CONSTRAINT IF EXISTS property_activities_property_id_fkey;

ALTER TABLE public.property_activities 
ADD CONSTRAINT property_activities_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- تحديث constraint لجدول property_views / Update property_views constraint
ALTER TABLE public.property_views 
DROP CONSTRAINT IF EXISTS property_views_property_id_fkey;

ALTER TABLE public.property_views 
ADD CONSTRAINT property_views_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- تحديث constraint لجدول favorites / Update favorites constraint
ALTER TABLE public.favorites 
DROP CONSTRAINT IF EXISTS favorites_property_id_fkey;

ALTER TABLE public.favorites 
ADD CONSTRAINT favorites_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- تحديث constraint لجدول property_reports / Update property_reports constraint
ALTER TABLE public.property_reports 
DROP CONSTRAINT IF EXISTS property_reports_property_id_fkey;

ALTER TABLE public.property_reports 
ADD CONSTRAINT property_reports_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- تحديث constraint لجدول property_comments / Update property_comments constraint
ALTER TABLE public.property_comments 
DROP CONSTRAINT IF EXISTS property_comments_property_id_fkey;

ALTER TABLE public.property_comments 
ADD CONSTRAINT property_comments_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- 4. اختبار الحل / Test the Solution
-- ================================

-- اختبار وظائف RLS / Test RLS functions
SELECT 
  'is_seller()' as function_name,
  public.is_seller() as result;

SELECT 
  'is_approved_seller()' as function_name,
  public.is_approved_seller() as result;

-- عرض السياسات المحدثة / Show updated policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'properties' 
AND cmd = 'DELETE';

-- عرض foreign key constraints المحدثة / Show updated foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND ccu.table_name = 'properties'
ORDER BY tc.table_name;

-- رسالة النجاح / Success message
SELECT 'Property deletion issues have been diagnosed and fixed!' as status;
