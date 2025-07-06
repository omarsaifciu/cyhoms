
-- إضافة حقول السبب بالثلاث لغات في جدول profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS suspension_reason_ar TEXT,
ADD COLUMN IF NOT EXISTS suspension_reason_en TEXT,
ADD COLUMN IF NOT EXISTS suspension_reason_tr TEXT;

-- تحديث جدول suspension_history لإضافة الأسباب بالثلاث لغات
ALTER TABLE public.suspension_history
ADD COLUMN IF NOT EXISTS reason_ar TEXT,
ADD COLUMN IF NOT EXISTS reason_en TEXT,
ADD COLUMN IF NOT EXISTS reason_tr TEXT;
