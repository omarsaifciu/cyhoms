# تعليمات إعداد قاعدة البيانات - Database Setup Instructions

## المشكلة / Problem

لا يظهر سجل الأنشطة في صفحة الناشر بسبب عدم وجود جدول `user_activity_logs` أو مشاكل في الصلاحيات.

The activity log doesn't show in the publisher page due to missing `user_activity_logs` table or permission issues.

## الحل / Solution

### الطريقة الأولى: تشغيل SQL مباشرة / Method 1: Run SQL Directly

1. **اذهب إلى Supabase Dashboard**
   - افتح [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - اختر مشروعك

2. **افتح SQL Editor**
   - من القائمة الجانبية، اضغط على "SQL Editor"
   - اضغط على "New query"

3. **انسخ والصق الكود**
   - افتح ملف `MANUAL_DATABASE_SETUP.sql`
   - انسخ كامل المحتوى
   - الصقه في SQL Editor

4. **شغل الكود**
   - اضغط على "Run" أو Ctrl+Enter
   - انتظر حتى يكتمل التنفيذ

### الطريقة الثانية: استخدام Supabase CLI / Method 2: Using Supabase CLI

```bash
# تأكد من أن Docker يعمل
# Make sure Docker is running

# ابدأ Supabase المحلي
supabase start

# طبق migrations
supabase db push

# أو طبق migration محدد
supabase db push --include-all
```

## التحقق من النجاح / Verify Success

### 1. تحقق من وجود الجدول / Check Table Exists
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_activity_logs';
```

### 2. تحقق من الصلاحيات / Check Permissions
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_activity_logs';
```

### 3. تحقق من الوظائف / Check Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'add_sample_activity_data';
```

## اختبار الوظيفة / Test Functionality

### 1. إضافة بيانات تجريبية / Add Sample Data
```sql
-- استبدل USER_ID بمعرف المستخدم الفعلي
-- Replace USER_ID with actual user ID
SELECT add_sample_activity_data('USER_ID');
```

### 2. عرض البيانات / View Data
```sql
SELECT * FROM user_activity_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

## استكشاف الأخطاء / Troubleshooting

### خطأ: "relation does not exist"
```sql
-- تأكد من إنشاء الجدول
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### خطأ: "permission denied"
```sql
-- تأكد من تفعيل RLS وإنشاء السياسات
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities"
  ON public.user_activity_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### خطأ: "function does not exist"
```sql
-- أعد إنشاء الوظيفة
CREATE OR REPLACE FUNCTION public.add_sample_activity_data(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- ... (see MANUAL_DATABASE_SETUP.sql for full function)
$$;
```

## الخطوات التالية / Next Steps

1. **شغل الكود SQL** في Supabase Dashboard
2. **أعد تحميل الصفحة** في المتصفح
3. **اضغط على زر "Add Sample Data"** في صفحة سجل الأنشطة
4. **تحقق من ظهور البيانات** في السجل

## ملاحظات مهمة / Important Notes

- ✅ **الأمان**: جميع السياسات تحمي البيانات بشكل صحيح
- ✅ **الأداء**: تم إنشاء فهارس لتحسين الأداء
- ✅ **التوافق**: يعمل مع جميع أنواع المستخدمين
- ✅ **المرونة**: يدعم إضافة أنواع أنشطة جديدة

## الدعم / Support

إذا واجهت مشاكل:
1. تأكد من أن المستخدم لديه صلاحيات admin أو owner في Supabase
2. تحقق من أن جميع migrations تم تطبيقها
3. راجع console في المتصفح للأخطاء
4. تحقق من Supabase logs في Dashboard

---

**ملخص**: بعد تشغيل الكود SQL، ستعمل صفحة سجل الأنشطة بشكل طبيعي مع إمكانية إضافة بيانات تجريبية.

**Summary**: After running the SQL code, the activity log page will work normally with the ability to add sample data.
