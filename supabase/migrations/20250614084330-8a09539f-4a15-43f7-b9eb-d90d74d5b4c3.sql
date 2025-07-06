
-- إضافة مفتاح خارجي من user_id في property_comments إلى id في profiles
ALTER TABLE public.property_comments
ADD CONSTRAINT fk_property_comments_user_id
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- إعادة تفعيل السياسة إذا تطلب الأمر
-- (ليس ضروريًا عادةً إذا لم تتغير السياسات)
