
-- إضافة جدول إعدادات الحظر
CREATE TABLE public.suspension_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  title_ar TEXT DEFAULT '',
  title_en TEXT DEFAULT '',
  title_tr TEXT DEFAULT '',
  message_ar TEXT DEFAULT '',
  message_en TEXT DEFAULT '',
  message_tr TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إضافة جدول تاريخ الحظر للمستخدمين
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS suspension_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES auth.users(id);

-- إضافة جدول سجل الحظر
CREATE TABLE public.suspension_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  suspended_by UUID NOT NULL REFERENCES auth.users(id),
  suspension_type TEXT NOT NULL CHECK (suspension_type IN ('temporary', 'permanent')),
  suspension_duration TEXT, -- '1_day', '1_week', '1_month', etc.
  suspension_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  suspension_end TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إدراج إعدادات الحظر الافتراضية
INSERT INTO public.suspension_settings (setting_key, title_ar, title_en, title_tr, message_ar, message_en, message_tr) VALUES
('permanent_suspension', 'تم إيقاف الحساب نهائياً', 'Account Permanently Suspended', 'Hesap Kalıcı Olarak Askıya Alındı', 'تم إيقاف حسابك نهائياً بسبب انتهاك شروط الخدمة. يرجى التواصل مع الدعم إذا كنت تعتقد أن هذا خطأ.', 'Your account has been permanently suspended due to violation of terms of service. Please contact support if you believe this is an error.', 'Hesabınız hizmet şartlarını ihlal ettiği için kalıcı olarak askıya alındı. Bunun bir hata olduğunu düşünüyorsanız lütfen destekle iletişime geçin.'),
('temporary_suspension', 'تم إيقاف الحساب مؤقتاً', 'Account Temporarily Suspended', 'Hesap Geçici Olarak Askıya Alındı', 'تم إيقاف حسابك مؤقتاً. سيتم إعادة تفعيل حسابك تلقائياً في التاريخ المحدد.', 'Your account has been temporarily suspended. Your account will be automatically reactivated on the specified date.', 'Hesabınız geçici olarak askıya alındı. Hesabınız belirtilen tarihte otomatik olarak yeniden etkinleştirilecek.');

-- تمكين RLS على الجداول
ALTER TABLE public.suspension_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspension_history ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS للإدارة
CREATE POLICY "Only admins can manage suspension settings" 
  ON public.suspension_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can view suspension history" 
  ON public.suspension_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage suspension history" 
  ON public.suspension_history 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- دالة للتحقق من انتهاء فترة الحظر المؤقت
CREATE OR REPLACE FUNCTION public.check_and_update_temporary_suspensions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- إلغاء الحظر المؤقت للمستخدمين الذين انتهت فترة حظرهم
  UPDATE public.profiles 
  SET 
    is_suspended = false,
    suspension_end_date = null,
    suspension_reason = null,
    suspended_by = null
  WHERE 
    is_suspended = true 
    AND suspension_end_date IS NOT NULL 
    AND suspension_end_date <= now();
    
  -- تحديث سجل الحظر
  UPDATE public.suspension_history
  SET is_active = false
  WHERE 
    is_active = true 
    AND suspension_end IS NOT NULL 
    AND suspension_end <= now();
END;
$$;

-- جدولة تشغيل الدالة كل دقيقة (يمكن تغييرها حسب الحاجة)
-- ملاحظة: هذا يتطلب تمكين pg_cron extension في Supabase
-- SELECT cron.schedule('check-suspensions', '* * * * *', 'SELECT public.check_and_update_temporary_suspensions();');
