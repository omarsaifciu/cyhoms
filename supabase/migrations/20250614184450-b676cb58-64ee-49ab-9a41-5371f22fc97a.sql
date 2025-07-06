
-- أولاً: إزالة القيد الحالي (اسم القيد كما في سجلات الخطأ: profiles_user_type_check)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- ثانياً: إعادة إضافة القيد ليشمل كل القيم المسموحة الآن
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (
    user_type IN (
      'client', 
      'seller', 
      'property_owner', 
      'real_estate_office', 
      'partner_and_site_owner'
    )
  );
