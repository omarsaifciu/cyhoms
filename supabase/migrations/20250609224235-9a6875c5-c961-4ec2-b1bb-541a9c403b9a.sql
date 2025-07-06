
-- إنشاء جدول إعدادات الشعار
CREATE TABLE IF NOT EXISTS public.logo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_type TEXT NOT NULL CHECK (logo_type IN ('text', 'image', 'svg')),
  logo_text_ar TEXT,
  logo_text_en TEXT,
  logo_text_tr TEXT,
  logo_image_url TEXT,
  logo_svg_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين RLS للحماية
ALTER TABLE public.logo_settings ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة - يمكن للجميع قراءة الشعار النشط
CREATE POLICY "Anyone can view active logo" 
  ON public.logo_settings 
  FOR SELECT 
  USING (is_active = true);

-- سياسة للإدراج والتحديث - الأدمن فقط
CREATE POLICY "Admins can manage logo" 
  ON public.logo_settings 
  FOR ALL 
  USING (is_admin());

-- إضافة بيانات افتراضية للشعار النصي
INSERT INTO public.logo_settings (logo_type, logo_text_ar, logo_text_en, logo_text_tr, is_active)
VALUES ('text', 'إيجار قبرص', 'Cyprus Rentals', 'Kıbrıs Kiralama', true)
ON CONFLICT DO NOTHING;

-- إنشاء bucket للشعارات إذا لم يكن موجوداً
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات bucket الشعارات
CREATE POLICY "Public can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Admins can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND is_admin());

CREATE POLICY "Admins can update logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND is_admin());

CREATE POLICY "Admins can delete logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'logos' AND is_admin());
