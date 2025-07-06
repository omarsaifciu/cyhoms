# دليل حل مشاكل تسجيل الدخول - Login Troubleshooting Guide

## 🚨 **المشكلة المحددة / Specific Problem**

**الخطأ:** `400 (Bad Request)` من `https://cuznupufbtipnqluzgbp.supabase.co/auth/v1/token?grant_type=password`
**الرسالة:** "Invalid login credentials"

## 🔍 **التشخيص المكثف / Intensive Diagnosis**

### **1. الأسباب المحتملة / Potential Causes:**

1. **مشكلة في دالة RPC**: `get_user_email_by_username` قد لا تعمل بشكل صحيح
2. **مشكلة في قاعدة البيانات**: جدول `profiles` قد يحتوي على بيانات غير صحيحة
3. **مشكلة في الاتصال**: Supabase client configuration
4. **مشكلة في الصلاحيات**: RLS policies تمنع الوصول للبيانات
5. **مشكلة في البيانات**: أسماء المستخدمين أو الإيميلات بها مشاكل

### **2. خطوات التشخيص / Diagnosis Steps:**

## ✅ **الحلول المطبقة / Applied Solutions**

### **1. إصلاح دالة RPC**
- ✅ تحسين دالة `get_user_email_by_username`
- ✅ إضافة fallback method للبحث المباشر في جدول profiles
- ✅ تحسين معالجة الأخطاء

### **2. تحسين معالجة الأخطاء**
- ✅ إضافة logging مفصل لكل خطوة
- ✅ تحسين رسائل الخطأ
- ✅ إضافة معالجة لحالات خاصة (Too many requests, etc.)

### **3. إنشاء أدوات التشخيص**
- ✅ سكريبت SQL شامل لإصلاح قاعدة البيانات
- ✅ مكون React للاختبار والتشخيص
- ✅ دوال اختبار في قاعدة البيانات

## 🛠️ **خطوات الإصلاح / Fix Steps**

### **الخطوة 1: تشغيل إصلاح قاعدة البيانات**

1. اذهب إلى **Supabase Dashboard**
2. افتح **SQL Editor**
3. انسخ والصق محتوى ملف `LOGIN_ISSUE_COMPREHENSIVE_FIX.sql`
4. اضغط **Run**
5. تأكد من ظهور رسالة "تم إصلاح نظام تسجيل الدخول بنجاح!"

### **الخطوة 2: اختبار النظام**

1. افتح **Developer Console** في المتصفح
2. حاول تسجيل الدخول
3. راقب الرسائل في Console:
   ```
   ✅ "Looking up email for username: [username]"
   ✅ "Email lookup result: [email]"
   ✅ "Attempting authentication with email: [email]"
   ✅ "Authentication response: {success: true, user: [email]}"
   ```

### **الخطوة 3: استخدام أداة التشخيص**

إذا استمرت المشكلة، استخدم مكون `LoginDebugger`:

1. أضف المكون إلى صفحة مؤقتة:
```tsx
import LoginDebugger from '@/components/debug/LoginDebugger';

// في أي صفحة
<LoginDebugger />
```

2. اختبر كل وظيفة على حدة:
   - **اختبار RPC**: للتأكد من عمل دالة البحث
   - **اختبار الدخول المباشر**: للتأكد من عمل المصادقة
   - **اختبار الاتصال**: للتأكد من الاتصال بقاعدة البيانات

## 🔧 **الإصلاحات المحددة / Specific Fixes**

### **1. في ملف `useLogin.ts`:**
```typescript
// ✅ تحسين دالة البحث عن الإيميل
const getEmailFromUsername = async (username: string) => {
  // محاولة RPC أولاً
  // إذا فشلت، استخدام البحث المباشر
  // إضافة logging مفصل
}

// ✅ تحسين معالجة الأخطاء
const handleSubmit = async (e: React.FormEvent) => {
  // إضافة logging لكل خطوة
  // معالجة أفضل للأخطاء
  // رسائل خطأ أوضح
}
```

### **2. في قاعدة البيانات:**
```sql
-- ✅ إصلاح دالة RPC
CREATE OR REPLACE FUNCTION get_user_email_by_username(username_input text)
-- ✅ إصلاح سياسات RLS
CREATE POLICY "Allow reading profiles for authentication"
-- ✅ تنظيف البيانات
UPDATE profiles SET username = TRIM(username), email = TRIM(LOWER(email))
```

## 📊 **اختبار النجاح / Success Testing**

### **في Console المتصفح:**
```javascript
// رسائل النجاح المتوقعة:
✅ "Starting login process for: [input]"
✅ "Input appears to be username, looking up email..."
✅ "Found email for username: [email]"
✅ "Attempting authentication with email: [email]"
✅ "Authentication response: {success: true, user: [email]}"
```

### **في قاعدة البيانات:**
```sql
-- اختبار الدالة
SELECT public.test_login_system('testuser');
-- النتيجة المتوقعة: function_working: true
```

## 🚨 **إذا استمرت المشكلة / If Issues Persist**

### **1. تحقق من بيانات الاعتماد:**
- تأكد من صحة اسم المستخدم/الإيميل
- تأكد من صحة كلمة المرور
- جرب مع مستخدم آخر

### **2. تحقق من قاعدة البيانات:**
```sql
-- عرض المستخدمين المتاحين
SELECT username, email, user_type, is_approved 
FROM profiles 
WHERE username IS NOT NULL 
LIMIT 10;
```

### **3. تحقق من Supabase Dashboard:**
- **Authentication > Users**: تأكد من وجود المستخدم
- **Authentication > Settings**: تأكد من إعدادات المصادقة
- **Database > Tables**: تأكد من وجود جدول profiles

### **4. إنشاء مستخدم اختبار:**
```sql
-- إنشاء مستخدم جديد للاختبار
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('test@example.com', crypt('password123', gen_salt('bf')), now());
```

## 📞 **الدعم الإضافي / Additional Support**

### **معلومات مفيدة للدعم:**
1. **Supabase Project ID**: `cuznupufbtipnqluzgbp`
2. **Error Code**: `400 Bad Request`
3. **Endpoint**: `/auth/v1/token?grant_type=password`
4. **Browser Console Logs**: [انسخ الرسائل من Console]

### **ملفات الإصلاح:**
- `LOGIN_ISSUE_COMPREHENSIVE_FIX.sql` - إصلاح قاعدة البيانات
- `src/hooks/auth/useLogin.ts` - تحسين معالجة تسجيل الدخول
- `src/components/debug/LoginDebugger.tsx` - أداة التشخيص

## 🎉 **النتيجة المتوقعة / Expected Outcome**

بعد تطبيق جميع الإصلاحات:
- ✅ تسجيل الدخول يعمل بسلاسة
- ✅ رسائل خطأ واضحة ومفيدة
- ✅ دعم تسجيل الدخول بالإيميل أو اسم المستخدم
- ✅ معالجة أفضل للأخطاء
- ✅ logging مفصل للتشخيص

**تسجيل الدخول سيعمل بنجاح! 🚀**
