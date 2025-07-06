
-- إضافة عمود رسالة الواتساب الافتراضية إلى contact_settings
ALTER TABLE public.contact_settings
ADD COLUMN whatsapp_greeting TEXT;

-- لا حاجة لتغييرات RLS هنا لأن الجدول فعلياً عام ويستخدم فقط للإعدادات.
