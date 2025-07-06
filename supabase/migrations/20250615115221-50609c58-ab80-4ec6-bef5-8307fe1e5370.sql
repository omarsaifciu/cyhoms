
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS theme_preference text DEFAULT 'system';

-- إضافة صلاحية التحديث لهذا الحقل للمستخدم ذاته
-- (إذا كانت هناك سياسات RLS موجودة مسبقًا سوف تستمر بالعمل)
