
-- إضافة الحقول الجديدة الخاصة بروابط الشعار لجميع اللغات والأوضاع (منفصل لكل لغة ووضع)
ALTER TABLE public.logo_settings
  ADD COLUMN logo_ar_light_url TEXT,
  ADD COLUMN logo_ar_dark_url TEXT,
  ADD COLUMN logo_en_light_url TEXT,
  ADD COLUMN logo_en_dark_url TEXT,
  ADD COLUMN logo_tr_light_url TEXT,
  ADD COLUMN logo_tr_dark_url TEXT;
