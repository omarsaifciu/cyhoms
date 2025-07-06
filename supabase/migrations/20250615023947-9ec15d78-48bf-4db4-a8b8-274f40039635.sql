
-- إضافة حقول رسائل الحظر لجدول site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS suspension_title_ar TEXT DEFAULT 'تم إيقاف الحساب',
ADD COLUMN IF NOT EXISTS suspension_title_en TEXT DEFAULT 'Account Suspended',
ADD COLUMN IF NOT EXISTS suspension_title_tr TEXT DEFAULT 'Hesap Askıya Alındı',
ADD COLUMN IF NOT EXISTS suspension_message_ar TEXT DEFAULT 'تم إيقاف حسابك. يرجى مراجعة شروط الاستخدام أو التواصل مع الدعم.',
ADD COLUMN IF NOT EXISTS suspension_message_en TEXT DEFAULT 'Your account has been suspended. Please review our terms of service or contact support.',
ADD COLUMN IF NOT EXISTS suspension_message_tr TEXT DEFAULT 'Hesabınız askıya alındı. Lütfen hizmet şartlarımızı inceleyin veya destek ile iletişime geçin.';
