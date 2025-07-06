
-- إضافة ثلاث خانات منفصلة لرسائل الترحيب الخاصة بالواتساب لكل لغة
ALTER TABLE public.contact_settings
ADD COLUMN whatsapp_greeting_ar TEXT,
ADD COLUMN whatsapp_greeting_en TEXT,
ADD COLUMN whatsapp_greeting_tr TEXT;

-- اختيارياً: نقل البيانات القديمة الموجودة في whatsapp_greeting إلى الحقل العربي إن كانت موجودة
UPDATE public.contact_settings
SET whatsapp_greeting_ar = whatsapp_greeting
WHERE whatsapp_greeting IS NOT NULL;

-- يمكنك لاحقاً حذف حقل whatsapp_greeting القديم إذا رغبت بذلك بعد التأكد من الترحيل
