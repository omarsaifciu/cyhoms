
-- إضافة حقول عنوان ووصف الهيرو سيكشن بكل لغة في جدول إعدادات الموقع
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title_ar TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title_en TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_title_tr TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_description_ar TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_description_en TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_description_tr TEXT;
