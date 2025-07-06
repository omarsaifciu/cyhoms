
-- إضافة حقل web_push_token لجدول profiles لتخزين توكن إشعارات الويب
ALTER TABLE public.profiles
ADD COLUMN web_push_token TEXT;
