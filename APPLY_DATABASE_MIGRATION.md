# تطبيق Migration قاعدة البيانات - Apply Database Migration

## ⚠️ مهم جداً - Very Important

يجب تطبيق migration قاعدة البيانات لتحديث نوع المستخدم من "seller" إلى "agent".

The database migration must be applied to update user type from "seller" to "agent".

## خطوات التطبيق / Application Steps

### 1. تطبيق Migration:
```bash
# في مجلد المشروع / In project folder
supabase db push
```

### 2. أو تطبيق Migration يدوياً / Or apply manually:
```sql
-- تشغيل هذا الكود في Supabase SQL Editor
-- Run this code in Supabase SQL Editor

-- تحديث جميع السجلات الموجودة / Update all existing records
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- تحديث القيد / Update constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (
    user_type IN (
      'client', 
      'agent', 
      'property_owner', 
      'real_estate_office', 
      'partner_and_site_owner'
    )
  );

-- تحديث الوظائف / Update functions
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_approved_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
    AND is_approved = true
  );
$$;
```

## التحقق من التطبيق / Verification

### 1. تحقق من تحديث البيانات:
```sql
-- تحقق من عدم وجود 'seller' في قاعدة البيانات
SELECT COUNT(*) FROM public.profiles WHERE user_type = 'seller';
-- يجب أن يكون الناتج 0

-- تحقق من وجود 'agent' 
SELECT COUNT(*) FROM public.profiles WHERE user_type = 'agent';
-- يجب أن يكون الناتج > 0 إذا كان هناك مستخدمين من نوع بائع سابقاً
```

### 2. تحقق من القيد:
```sql
-- تحقق من القيد الجديد
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';
```

### 3. تحقق من الوظائف:
```sql
-- تحقق من وظيفة is_seller
SELECT prosrc FROM pg_proc WHERE proname = 'is_seller';

-- تحقق من وظيفة is_approved_seller  
SELECT prosrc FROM pg_proc WHERE proname = 'is_approved_seller';
```

## اختبار التطبيق / Application Testing

بعد تطبيق Migration:

### 1. اختبار التسجيل:
- ✅ سجل مستخدم جديد واختر نوع "وسيط/Agent/Acente"
- ✅ تأكد من حفظ النوع كـ "agent" في قاعدة البيانات

### 2. اختبار الترجمات:
- ✅ **العربية**: يجب ظهور "وسيط" و "لوحة التحكم"
- ✅ **الإنجليزية**: يجب ظهور "Agent" و "Dashboard"
- ✅ **التركية**: يجب ظهور "Acente" و "Kontrol Paneli"

### 3. اختبار الوظائف:
- ✅ تسجيل دخول كوسيط والوصول للوحة التحكم
- ✅ إنشاء وتحديث العقارات
- ✅ عرض الأنشطة في سجل الأنشطة

### 4. اختبار الإدارة:
- ✅ عرض المستخدمين في لوحة الإدارة
- ✅ تغيير نوع المستخدم إلى "وسيط"
- ✅ الموافقة على طلبات الوسطاء

## في حالة وجود مشاكل / Troubleshooting

### مشكلة: لا يمكن تطبيق Migration
```bash
# تحقق من حالة قاعدة البيانات
supabase db status

# إعادة تعيين قاعدة البيانات (احذر: سيحذف البيانات)
supabase db reset
```

### مشكلة: خطأ في القيد
```sql
-- احذف القيد القديم أولاً
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- أضف القيد الجديد
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (user_type IN ('client', 'agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner'));
```

### مشكلة: الوظائف لا تعمل
```sql
-- احذف الوظائف القديمة
DROP FUNCTION IF EXISTS public.is_seller();
DROP FUNCTION IF EXISTS public.is_approved_seller();

-- أعد إنشاءها (استخدم الكود أعلاه)
```

## ملاحظات مهمة / Important Notes

1. **النسخ الاحتياطي**: تأكد من عمل نسخة احتياطية قبل التطبيق
2. **البيئة**: طبق على بيئة التطوير أولاً
3. **المستخدمين**: أعلم المستخدمين بالتغيير
4. **الاختبار**: اختبر جميع الوظائف بعد التطبيق

---

**تذكير**: هذا Migration ضروري لعمل التطبيق بشكل صحيح مع التغييرات الجديدة.

**Reminder**: This migration is essential for the application to work correctly with the new changes.
