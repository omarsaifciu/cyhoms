
-- إضافة جدول لإدارة إعدادات فترة التجربة المجانية
CREATE TABLE public.trial_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_trial_enabled BOOLEAN NOT NULL DEFAULT true,
  trial_days INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إدراج الإعدادات الافتراضية
INSERT INTO public.trial_settings (is_trial_enabled, trial_days) VALUES (true, 7);

-- إضافة أعمدة جديدة لجدول profiles
ALTER TABLE public.profiles 
ADD COLUMN whatsapp_number TEXT,
ADD COLUMN trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN is_trial_active BOOLEAN DEFAULT true;

-- إنشاء فهرس فريد على اسم المستخدم
CREATE UNIQUE INDEX idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;

-- تحديث دالة handle_new_user لتضمين فترة التجربة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    user_full_name TEXT;
    generated_username TEXT;
    user_type_val TEXT;
BEGIN
    -- Get the full name from metadata or use email prefix
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));
    user_type_val := COALESCE(NEW.raw_user_meta_data->>'user_type', 'client');
    
    -- Generate unique username
    generated_username := public.generate_unique_username(user_full_name);
    
    INSERT INTO public.profiles (
        id, 
        full_name, 
        phone, 
        user_type, 
        username,
        whatsapp_number,
        trial_started_at,
        is_trial_active
    )
    VALUES (
        NEW.id,
        user_full_name,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        user_type_val,
        generated_username,
        COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', ''),
        now(),
        CASE WHEN user_type_val IN ('seller', 'property_owner') THEN true ELSE false END
    );
    RETURN NEW;
END;
$$;

-- دالة للتحقق من انتهاء فترة التجربة
CREATE OR REPLACE FUNCTION public.is_trial_expired(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_record RECORD;
    trial_settings_record RECORD;
BEGIN
    -- الحصول على إعدادات التجربة
    SELECT * INTO trial_settings_record FROM public.trial_settings ORDER BY created_at DESC LIMIT 1;
    
    -- إذا كانت التجربة معطلة، إرجاع true (منتهية)
    IF NOT trial_settings_record.is_trial_enabled THEN
        RETURN true;
    END IF;
    
    -- الحصول على بيانات المستخدم
    SELECT * INTO profile_record FROM public.profiles WHERE id = user_id;
    
    -- إذا لم تكن التجربة نشطة، إرجاع true (منتهية)
    IF NOT profile_record.is_trial_active THEN
        RETURN true;
    END IF;
    
    -- التحقق من انتهاء فترة التجربة
    IF profile_record.trial_started_at + INTERVAL '1 day' * trial_settings_record.trial_days < now() THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$;

-- تحديث جدول properties لإضافة معلومات المالك
ALTER TABLE public.properties 
ADD COLUMN owner_name TEXT,
ADD COLUMN owner_avatar_url TEXT,
ADD COLUMN owner_whatsapp TEXT,
ADD COLUMN owner_email TEXT;

-- دالة لتحديث معلومات المالك في العقارات
CREATE OR REPLACE FUNCTION public.update_property_owner_info()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    owner_profile RECORD;
    auth_user RECORD;
BEGIN
    -- الحصول على بيانات المالك من جدول profiles
    SELECT * INTO owner_profile FROM public.profiles WHERE id = NEW.created_by;
    
    -- الحصول على الإيميل من جدول auth.users
    SELECT email INTO auth_user FROM auth.users WHERE id = NEW.created_by;
    
    -- تحديث معلومات المالك في العقار
    NEW.owner_name := owner_profile.full_name;
    NEW.owner_avatar_url := owner_profile.avatar_url;
    NEW.owner_whatsapp := owner_profile.whatsapp_number;
    NEW.owner_email := auth_user.email;
    
    RETURN NEW;
END;
$$;

-- إنشاء trigger لتحديث معلومات المالك عند إدراج عقار جديد
CREATE TRIGGER update_property_owner_trigger
    BEFORE INSERT ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_property_owner_info();
