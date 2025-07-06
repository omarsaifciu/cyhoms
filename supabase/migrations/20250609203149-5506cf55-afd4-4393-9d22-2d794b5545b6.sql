
-- إضافة عمود property_type_id إلى جدول property_layouts
ALTER TABLE public.property_layouts 
ADD COLUMN property_type_id UUID REFERENCES public.property_types(id);

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX idx_property_layouts_type ON public.property_layouts(property_type_id);

-- حذف أعمدة الوصف من جدول property_layouts
ALTER TABLE public.property_layouts 
DROP COLUMN description_ar,
DROP COLUMN description_en,
DROP COLUMN description_tr;
