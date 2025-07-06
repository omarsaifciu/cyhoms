-- تنظيف السجلات المعطلة في قاعدة البيانات
-- Cleanup Orphaned Records in Database
-- شغل هذا السكريبت في Supabase SQL Editor لحل مشاكل حذف العقارات

-- =====================================================
-- 1. تشخيص المشكلة / Diagnose the Problem
-- =====================================================

-- عرض السجلات المعطلة في property_activities
-- Show orphaned records in property_activities
SELECT 
    'property_activities' as table_name,
    COUNT(*) as orphaned_count
FROM public.property_activities pa
WHERE pa.property_id NOT IN (SELECT id FROM public.properties);

-- عرض السجلات المعطلة في property_views
-- Show orphaned records in property_views
SELECT 
    'property_views' as table_name,
    COUNT(*) as orphaned_count
FROM public.property_views pv
WHERE pv.property_id NOT IN (SELECT id FROM public.properties);

-- عرض السجلات المعطلة في favorites
-- Show orphaned records in favorites
SELECT 
    'favorites' as table_name,
    COUNT(*) as orphaned_count
FROM public.favorites f
WHERE f.property_id NOT IN (SELECT id FROM public.properties);

-- عرض السجلات المعطلة في property_reports
-- Show orphaned records in property_reports
SELECT 
    'property_reports' as table_name,
    COUNT(*) as orphaned_count
FROM public.property_reports pr
WHERE pr.property_id NOT IN (SELECT id FROM public.properties);

-- عرض السجلات المعطلة في property_comments
-- Show orphaned records in property_comments
SELECT 
    'property_comments' as table_name,
    COUNT(*) as orphaned_count
FROM public.property_comments pc
WHERE pc.property_id NOT IN (SELECT id FROM public.properties);

-- =====================================================
-- 2. حذف السجلات المعطلة / Delete Orphaned Records
-- =====================================================

-- حذف السجلات المعطلة من property_activities
-- Delete orphaned records from property_activities
DELETE FROM public.property_activities 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- حذف السجلات المعطلة من property_views
-- Delete orphaned records from property_views
DELETE FROM public.property_views 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- حذف السجلات المعطلة من favorites
-- Delete orphaned records from favorites
DELETE FROM public.favorites 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- حذف السجلات المعطلة من property_reports
-- Delete orphaned records from property_reports
DELETE FROM public.property_reports 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- حذف السجلات المعطلة من property_comments
-- Delete orphaned records from property_comments
DELETE FROM public.property_comments 
WHERE property_id NOT IN (SELECT id FROM public.properties);

-- حذف السجلات المعطلة من user_activity_logs
-- Delete orphaned records from user_activity_logs
DELETE FROM public.user_activity_logs 
WHERE property_id IS NOT NULL 
AND property_id NOT IN (SELECT id FROM public.properties);

-- =====================================================
-- 3. إصلاح قيود المفاتيح الخارجية / Fix Foreign Key Constraints
-- =====================================================

-- إصلاح قيد property_activities
-- Fix property_activities constraint
ALTER TABLE public.property_activities 
DROP CONSTRAINT IF EXISTS property_activities_property_id_fkey;

ALTER TABLE public.property_activities 
ADD CONSTRAINT property_activities_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- إصلاح قيد property_views
-- Fix property_views constraint
ALTER TABLE public.property_views 
DROP CONSTRAINT IF EXISTS property_views_property_id_fkey;

ALTER TABLE public.property_views 
ADD CONSTRAINT property_views_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- إصلاح قيد favorites
-- Fix favorites constraint
ALTER TABLE public.favorites 
DROP CONSTRAINT IF EXISTS favorites_property_id_fkey;

ALTER TABLE public.favorites 
ADD CONSTRAINT favorites_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- إصلاح قيد property_reports
-- Fix property_reports constraint
ALTER TABLE public.property_reports 
DROP CONSTRAINT IF EXISTS property_reports_property_id_fkey;

ALTER TABLE public.property_reports 
ADD CONSTRAINT property_reports_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- إصلاح قيد property_comments
-- Fix property_comments constraint
ALTER TABLE public.property_comments 
DROP CONSTRAINT IF EXISTS property_comments_property_id_fkey;

ALTER TABLE public.property_comments 
ADD CONSTRAINT property_comments_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE CASCADE;

-- إصلاح قيد user_activity_logs
-- Fix user_activity_logs constraint
ALTER TABLE public.user_activity_logs 
DROP CONSTRAINT IF EXISTS user_activity_logs_property_id_fkey;

ALTER TABLE public.user_activity_logs 
ADD CONSTRAINT user_activity_logs_property_id_fkey 
FOREIGN KEY (property_id) 
REFERENCES public.properties(id) 
ON DELETE SET NULL;

-- =====================================================
-- 4. التحقق من النتائج / Verify Results
-- =====================================================

-- التحقق من عدم وجود سجلات معطلة بعد التنظيف
-- Verify no orphaned records remain after cleanup
SELECT 
    'property_activities' as table_name,
    COUNT(*) as remaining_orphaned
FROM public.property_activities pa
WHERE pa.property_id NOT IN (SELECT id FROM public.properties)

UNION ALL

SELECT 
    'property_views' as table_name,
    COUNT(*) as remaining_orphaned
FROM public.property_views pv
WHERE pv.property_id NOT IN (SELECT id FROM public.properties)

UNION ALL

SELECT 
    'favorites' as table_name,
    COUNT(*) as remaining_orphaned
FROM public.favorites f
WHERE f.property_id NOT IN (SELECT id FROM public.properties)

UNION ALL

SELECT 
    'property_reports' as table_name,
    COUNT(*) as remaining_orphaned
FROM public.property_reports pr
WHERE pr.property_id NOT IN (SELECT id FROM public.properties)

UNION ALL

SELECT 
    'property_comments' as table_name,
    COUNT(*) as remaining_orphaned
FROM public.property_comments pc
WHERE pc.property_id NOT IN (SELECT id FROM public.properties);

-- عرض قيود المفاتيح الخارجية المحدثة
-- Show updated foreign key constraints
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND ccu.table_name = 'properties'
ORDER BY tc.table_name;

-- رسالة نجاح
-- Success message
SELECT 'تم تنظيف قاعدة البيانات بنجاح! Database cleanup completed successfully!' as result;
