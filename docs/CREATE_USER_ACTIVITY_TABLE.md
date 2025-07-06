# إنشاء جدول user_activity_logs في Supabase

## الخطوات:

### 1. الذهاب إلى Supabase Dashboard
- اذهب إلى [supabase.com](https://supabase.com)
- سجل دخول إلى حسابك
- اختر مشروعك

### 2. فتح SQL Editor
- من القائمة الجانبية، اضغط على "SQL Editor"
- اضغط على "New Query"

### 3. تشغيل الكود التالي:

```sql
-- Create user_activity_logs table
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON user_activity_logs(action_type);

-- Enable RLS (Row Level Security)
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (Fixed version)
-- Allow admins to view all activity logs
CREATE POLICY "Allow admins to view all activity logs" ON user_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Allow admins to insert activity logs for any user
CREATE POLICY "Allow admins to insert activity logs" ON user_activity_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Allow users to view their own activity logs
CREATE POLICY "Allow users to view own activity logs" ON user_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own activity logs
CREATE POLICY "Allow users to insert own activity logs" ON user_activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add some sample data for testing
INSERT INTO user_activity_logs (user_id, action_type, action_details) 
SELECT 
  id,
  'property_created',
  '{"property_title": "عقار تجريبي", "property_type": "apartment", "price": 1200, "currency": "EUR"}'
FROM auth.users 
WHERE email IS NOT NULL 
LIMIT 3;

INSERT INTO user_activity_logs (user_id, action_type, action_details) 
SELECT 
  id,
  'property_updated',
  '{"property_title": "عقار محدث", "property_type": "villa"}'
FROM auth.users 
WHERE email IS NOT NULL 
LIMIT 2;

INSERT INTO user_activity_logs (user_id, action_type, action_details) 
SELECT 
  id,
  'property_hidden',
  '{"property_title": "عقار مخفي", "is_hidden": true}'
FROM auth.users 
WHERE email IS NOT NULL 
LIMIT 1;
```

### 4. تشغيل الكود
- اضغط على "Run" أو Ctrl+Enter
- تأكد من عدم وجود أخطاء

### 5. التحقق من إنشاء الجدول
- اذهب إلى "Table Editor" من القائمة الجانبية
- يجب أن ترى جدول `user_activity_logs`

## البيانات المتوقعة:

الجدول سيحتوي على الأعمدة التالية:
- `id`: معرف فريد للنشاط
- `user_id`: معرف المستخدم
- `action_type`: نوع النشاط (property_created, property_updated, إلخ)
- `action_details`: تفاصيل النشاط بصيغة JSON
- `created_at`: تاريخ ووقت النشاط

## الاختبار:

بعد إنشاء الجدول:
1. اذهب إلى صفحة أي ناشر كمدير
2. اضغط على زر "سجل الأنشطة (مدير)"
3. يجب أن ترى الأنشطة التجريبية
4. يمكنك إضافة المزيد باستخدام زر "إضافة بيانات تجريبية"
