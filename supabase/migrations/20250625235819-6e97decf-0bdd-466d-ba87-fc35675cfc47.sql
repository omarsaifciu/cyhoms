
-- إنشاء جدول أنواع البلاغات للعقارات
CREATE TABLE public.property_report_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_tr TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- إنشاء جدول أنواع البلاغات للمستخدمين
CREATE TABLE public.user_report_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_tr TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- تفعيل RLS للجدولين
ALTER TABLE public.property_report_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_report_types ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للعقارات
CREATE POLICY "الجميع يمكنهم قراءة أنواع بلاغات العقارات النشطة" 
  ON public.property_report_types 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "الأدمن فقط يمكنهم إدارة أنواع بلاغات العقارات" 
  ON public.property_report_types 
  FOR ALL 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- سياسات الأمان للمستخدمين
CREATE POLICY "الجميع يمكنهم قراءة أنواع بلاغات المستخدمين النشطة" 
  ON public.user_report_types 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "الأدمن فقط يمكنهم إدارة أنواع بلاغات المستخدمين" 
  ON public.user_report_types 
  FOR ALL 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- إدراج بيانات افتراضية لأنواع بلاغات العقارات
INSERT INTO public.property_report_types (name_ar, name_en, name_tr, description_ar, description_en, description_tr, display_order) VALUES
('محتوى غير مناسب', 'Inappropriate Content', 'Uygunsuz İçerik', 'محتوى مخالف للقوانين أو الآداب', 'Content that violates rules or ethics', 'Kurallara veya ahlaka aykırı içerik', 1),
('معلومات خاطئة', 'False Information', 'Yanlış Bilgi', 'معلومات غير صحيحة عن العقار', 'Incorrect information about the property', 'Mülk hakkında yanlış bilgiler', 2),
('رسائل مزعجة', 'Spam', 'Spam', 'إعلانات متكررة أو مزعجة', 'Repetitive or annoying advertisements', 'Tekrarlayan veya rahatsız edici reklamlar', 3),
('احتيال', 'Fraud', 'Dolandırıcılık', 'محاولة خداع أو نصب', 'Attempt to deceive or scam', 'Aldatma veya dolandırıcılık girişimi', 4),
('إعلان مكرر', 'Duplicate Listing', 'Yinelenen İlan', 'نفس العقار معلن عنه مرات متعددة', 'Same property advertised multiple times', 'Aynı mülk birden fazla kez ilan edildi', 5),
('أخرى', 'Other', 'Diğer', 'أسباب أخرى', 'Other reasons', 'Diğer nedenler', 6);

-- إدراج بيانات افتراضية لأنواع بلاغات المستخدمين
INSERT INTO public.user_report_types (name_ar, name_en, name_tr, description_ar, description_en, description_tr, display_order) VALUES
('سلوك غير مناسب', 'Inappropriate Behavior', 'Uygunsuz Davranış', 'سلوك مخالف للآداب العامة', 'Behavior that violates public ethics', 'Genel ahlaka aykırı davranış', 1),
('إعلانات وهمية', 'Fake Listings', 'Sahte İlanlar', 'نشر إعلانات غير حقيقية', 'Publishing fake advertisements', 'Sahte reklamlar yayınlama', 2),
('نصب واحتيال', 'Scam', 'Dolandırıcılık', 'محاولة النصب على المستخدمين', 'Attempting to scam users', 'Kullanıcıları dolandırmaya çalışma', 3),
('مضايقة', 'Harassment', 'Taciz', 'مضايقة مستخدمين آخرين', 'Harassing other users', 'Diğer kullanıcıları taciz etme', 4),
('احتيال مالي', 'Financial Fraud', 'Mali Dolandırıcılık', 'محاولة الاحتيال المالي', 'Attempting financial fraud', 'Mali dolandırıcılık girişimi', 5),
('أخرى', 'Other', 'Diğer', 'أسباب أخرى', 'Other reasons', 'Diğer nedenler', 6);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_report_types_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ربط الدالة بالجدولين
CREATE TRIGGER property_report_types_updated_at
  BEFORE UPDATE ON public.property_report_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_report_types_updated_at();

CREATE TRIGGER user_report_types_updated_at
  BEFORE UPDATE ON public.user_report_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_report_types_updated_at();
