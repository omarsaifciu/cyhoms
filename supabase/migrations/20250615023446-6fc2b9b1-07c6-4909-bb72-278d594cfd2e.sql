
-- سيقوم هذا المشغل بتحديث عدد المشاهدات في جدول العقارات
-- في كل مرة يتم فيها إدراج مشاهدة جديدة في جدول مشاهدات العقار.
CREATE TRIGGER on_property_view_insert
AFTER INSERT ON public.property_views
FOR EACH ROW
EXECUTE FUNCTION public.update_property_views_count();

-- سيقوم هذا الاستعلام بتحديث العقارات الحالية بعدد المشاهدات الصحيح.
-- هذه عملية لمرة واحدة لإصلاح البيانات التاريخية.
UPDATE public.properties p
SET views_count = (
    SELECT COUNT(*)
    FROM public.property_views pv
    WHERE pv.property_id = p.id
);
