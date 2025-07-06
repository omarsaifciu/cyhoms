# إصلاح عاجل لخطأ قاعدة البيانات - URGENT DATABASE FIX

## المشكلة / Problem
عند تغيير نوع المستخدم إلى "وسيط/agent" يظهر خطأ:
```
Error updating user type: 
new row for relation "profiles" violates check constraint "profiles_user_type_check"
```

## السبب / Cause
قاعدة البيانات لا تزال تحتوي على القيد القديم الذي لا يسمح بقيمة 'agent' ويسمح فقط بـ 'seller'.

## الحل العاجل / Urgent Solution

### الطريقة 1: استخدام Supabase Dashboard
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **SQL Editor**
4. انسخ والصق الكود التالي وشغله:

```sql
-- إصلاح عاجل لقيد user_type
-- Urgent fix for user_type constraint

-- 1. تحديث جميع السجلات من 'seller' إلى 'agent'
-- Update all 'seller' records to 'agent'
UPDATE public.profiles 
SET user_type = 'agent' 
WHERE user_type = 'seller';

-- 2. حذف القيد القديم
-- Drop old constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- 3. إضافة القيد الجديد الذي يدعم 'agent'
-- Add new constraint that supports 'agent'
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (
    user_type IN (
      'client', 
      'agent', 
      'property_owner', 
      'real_estate_office', 
      'partner_and_site_owner',
      'admin'
    )
  );

-- 4. تحديث الوظائف
-- Update functions
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

-- 5. التحقق من النجاح
-- Verify success
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';
```

### الطريقة 2: استخدام Supabase CLI (إذا كان متاحاً)
```bash
# في terminal
supabase db push
```

## التحقق من الإصلاح / Verify Fix

بعد تشغيل الكود أعلاه:

1. **اختبر تغيير نوع المستخدم**:
   - اذهب إلى لوحة الإدارة
   - جرب تغيير نوع مستخدم إلى "وسيط"
   - يجب أن يعمل بدون أخطاء

2. **تحقق من القيد**:
```sql
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'profiles_user_type_check';
```

يجب أن ترى أن القيد يحتوي على 'agent' بدلاً من 'seller'.

## ملاحظات مهمة / Important Notes

- ✅ **تم إصلاح جميع ملفات الكود** لتستخدم 'agent' بدلاً من 'seller'
- ✅ **الترجمات محدثة** في جميع اللغات
- ⚠️ **قاعدة البيانات تحتاج الإصلاح العاجل** باستخدام الكود أعلاه

## بعد الإصلاح / After Fix

بمجرد تطبيق الإصلاح:
- ✅ تغيير نوع المستخدم إلى "وسيط" سيعمل
- ✅ جميع الوظائف ستعمل بشكل طبيعي
- ✅ الترجمات ستظهر بشكل صحيح

## الدعم / Support

إذا واجهت مشاكل:
1. تأكد من تشغيل الكود في SQL Editor
2. تحقق من عدم وجود أخطاء في console
3. جرب إعادة تحميل الصفحة بعد الإصلاح
