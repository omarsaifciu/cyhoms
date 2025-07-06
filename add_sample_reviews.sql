-- إضافة تقييمات تجريبية للموقع
-- يجب تشغيل هذا في Supabase SQL Editor

-- أولاً، دعنا نحصل على بعض المستخدمين الموجودين
-- سنستخدم المستخدمين الموجودين في جدول profiles

-- إضافة تقييمات تجريبية
INSERT INTO public.site_reviews (user_id, rating, comment, is_approved, created_at) 
SELECT 
  p.id as user_id,
  (ARRAY[4, 5, 5, 4, 5, 3, 4, 5])[row_number() OVER ()] as rating,
  (ARRAY[
    'موقع ممتاز للبحث عن العقارات في قبرص. واجهة سهلة الاستخدام وخدمة عملاء رائعة.',
    'تجربة رائعة! وجدت العقار المناسب بسرعة والفريق كان متعاوناً جداً.',
    'خدمة احترافية ومعلومات دقيقة عن العقارات. أنصح بالموقع بشدة.',
    'موقع موثوق وسهل الاستخدام. ساعدني في العثور على منزل أحلامي.',
    'فريق محترف وخدمة ممتازة. الموقع يحتوي على خيارات متنوعة من العقارات.',
    'تجربة جيدة بشكل عام، لكن أتمنى المزيد من الخيارات في بعض المناطق.',
    'موقع رائع مع واجهة حديثة وسهلة. الدعم الفني سريع ومفيد.',
    'خدمة ممتازة ومعلومات شاملة عن كل عقار. تجربة مميزة حقاً.'
  ])[row_number() OVER ()] as comment,
  true as is_approved,
  NOW() - (random() * interval '30 days') as created_at
FROM (
  SELECT id, row_number() OVER () as rn
  FROM public.profiles 
  WHERE user_type IN ('client', 'agent', 'property_owner')
  LIMIT 8
) p
WHERE p.rn <= 8;

-- إضافة تقييم واحد غير معتمد للاختبار
INSERT INTO public.site_reviews (user_id, rating, comment, is_approved, created_at)
SELECT 
  p.id,
  4,
  'تقييم في انتظار الموافقة من الإدارة.',
  false,
  NOW()
FROM public.profiles 
WHERE user_type = 'client'
LIMIT 1;
