
-- حذف القيد الحالي الذي يمنع إضافة حالة جديدة
ALTER TABLE public.properties
DROP CONSTRAINT IF EXISTS properties_status_check;

-- إضافة قيد جديد يسمح بإضافة حالة 'hidden'
ALTER TABLE public.properties
ADD CONSTRAINT properties_status_check
CHECK (status IN ('available', 'pending', 'rented', 'sold', 'hidden'));
