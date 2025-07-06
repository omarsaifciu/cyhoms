
-- حذف القيد الحالي أولاً لتجنب أي تعارض
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- إضافة قيد جديد يسمح بجميع أنواع الحسابات المطلوبة
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('client', 'seller', 'property_owner', 'real_estate_office'));
