# إصلاح تضارب seller/agent في الكود الأمامي
# Frontend seller/agent Conflict Fix

## 🔍 **المشكلة المحددة / Specific Problem**

هناك تضارب في النظام حيث:
- قاعدة البيانات تستخدم `agent` بدلاً من `seller`
- بعض ملفات الكود الأمامي ما زالت تستخدم `seller`
- دالة `is_seller()` في قاعدة البيانات تتحقق من `agent` لكن الكود الأمامي يبحث عن `seller`

## ✅ **الإصلاحات المطبقة / Applied Fixes**

### **1. ملف `src/hooks/useAuth.tsx`**
```typescript
// قبل الإصلاح / Before Fix:
const isSeller = roles.includes('seller') || (profile?.user_type === 'agent') || ...

// بعد الإصلاح / After Fix:
const isSeller = roles.includes('agent') || (profile?.user_type === 'agent') || ...
```

### **2. ملف `src/utils/userSessionManager.js`**
```javascript
// قبل الإصلاح / Before Fix:
export const isSeller = (userRoles) => {
  return hasRole(userRoles, 'seller');
};

// بعد الإصلاح / After Fix:
export const isSeller = (userRoles) => {
  return hasRole(userRoles, 'agent');
};
```

## 🔧 **الملفات التي تحتاج مراجعة / Files That Need Review**

### **1. ملفات الترجمة / Translation Files**
```
src/contexts/translations/ar.ts
src/contexts/translations/en.ts  
src/contexts/translations/tr.ts
```

**التحديث المطلوب:**
```typescript
// في ملفات الترجمة
'seller' → 'agent'
'بائع' → 'وسيط'
'Satıcı' → 'Acente'
```

### **2. ملفات المكونات / Component Files**
```
src/components/seller/ → src/components/agent/
src/pages/SellerDashboard.tsx → src/pages/AgentDashboard.tsx
```

### **3. ملفات الأنواع / Type Files**
```typescript
// في src/types/user.ts
export type UserType = 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'admin' | 'support';
```

## 🛠️ **خطوات الإصلاح الإضافية / Additional Fix Steps**

### **الخطوة 1: تشغيل إصلاح قاعدة البيانات**
```sql
-- شغل هذا في Supabase SQL Editor
\i FIX_SELLER_TO_AGENT_CONFLICTS.sql
```

### **الخطوة 2: تحديث ملفات الترجمة**
```typescript
// src/contexts/translations/ar.ts
export const ar = {
  // قديم
  seller: 'بائع',
  sellerDashboard: 'لوحة تحكم البائع',
  
  // جديد
  agent: 'وسيط',
  agentDashboard: 'لوحة تحكم الوسيط',
  // أو
  dashboard: 'لوحة التحكم', // حسب تفضيل المستخدم
};
```

### **الخطوة 3: تحديث أنواع البيانات**
```typescript
// src/integrations/supabase/types.ts
export type UserType = 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'admin' | 'support';
```

### **الخطوة 4: تحديث الثوابت**
```typescript
// src/constants/userTypes.ts
export const USER_TYPES = {
  CLIENT: 'client',
  AGENT: 'agent', // كان 'seller'
  PROPERTY_OWNER: 'property_owner',
  REAL_ESTATE_OFFICE: 'real_estate_office',
  PARTNER_AND_SITE_OWNER: 'partner_and_site_owner',
  ADMIN: 'admin',
  SUPPORT: 'support'
} as const;
```

## 🧪 **اختبار الإصلاحات / Testing the Fixes**

### **1. اختبار قاعدة البيانات:**
```sql
-- التحقق من عدم وجود seller
SELECT COUNT(*) FROM profiles WHERE user_type = 'seller';
-- يجب أن يكون 0

-- اختبار الدوال
SELECT public.is_seller(); -- يجب أن تعمل للوسطاء
SELECT public.is_agent();  -- دالة جديدة للوسطاء فقط
```

### **2. اختبار الكود الأمامي:**
```typescript
// في المتصفح Console
const { data: profile } = await supabase
  .from('profiles')
  .select('user_type, is_approved')
  .eq('id', user.id)
  .single();

console.log('User type:', profile.user_type); // يجب أن يكون 'agent' وليس 'seller'

const { data: isSeller } = await supabase.rpc('is_seller');
console.log('Is seller:', isSeller); // يجب أن يكون true للوسطاء
```

## 📋 **قائمة مراجعة / Checklist**

### **قاعدة البيانات:**
- ✅ تحديث القيد ليتضمن `agent`
- ✅ تحديث دالة `is_seller()` لتتضمن `agent`
- ✅ تحديث دالة `is_approved_seller()`
- ✅ إنشاء دالة `is_agent()` جديدة
- ✅ تحديث سياسات RLS

### **الكود الأمامي:**
- ✅ تحديث `src/hooks/useAuth.tsx`
- ✅ تحديث `src/utils/userSessionManager.js`
- ⏳ تحديث ملفات الترجمة
- ⏳ تحديث أنواع البيانات
- ⏳ تحديث أسماء المكونات والصفحات

### **الاختبار:**
- ⏳ اختبار تسجيل الدخول للوسطاء
- ⏳ اختبار صلاحيات إضافة العقارات
- ⏳ اختبار عرض لوحة التحكم
- ⏳ اختبار الترجمات

## 🎯 **النتيجة المتوقعة / Expected Result**

بعد تطبيق جميع الإصلاحات:

1. **قاعدة البيانات:**
   - ✅ لا توجد سجلات `seller`
   - ✅ جميع الدوال تعمل مع `agent`
   - ✅ سياسات RLS محدثة

2. **الكود الأمامي:**
   - ✅ جميع المراجع تستخدم `agent`
   - ✅ الترجمات محدثة
   - ✅ المكونات تعمل بشكل صحيح

3. **تجربة المستخدم:**
   - ✅ تسجيل الدخول يعمل للوسطاء
   - ✅ صلاحيات العقارات تعمل
   - ✅ لوحة التحكم تظهر بشكل صحيح
   - ✅ الترجمات صحيحة

## 🚨 **ملاحظات مهمة / Important Notes**

1. **احتفظ بدالة `is_seller()`**: لا تحذفها لأنها تستخدم في أماكن كثيرة
2. **أضف دالة `is_agent()`**: للتحقق من الوسطاء فقط
3. **حدث الترجمات تدريجياً**: لتجنب كسر الواجهة
4. **اختبر كل تغيير**: قبل الانتقال للتالي

## 🔄 **خطة التنفيذ / Implementation Plan**

### **المرحلة 1: قاعدة البيانات (مكتملة)**
- ✅ تشغيل `FIX_SELLER_TO_AGENT_CONFLICTS.sql`

### **المرحلة 2: الكود الأساسي (مكتملة)**
- ✅ إصلاح `useAuth.tsx`
- ✅ إصلاح `userSessionManager.js`

### **المرحلة 3: الترجمات والواجهة (التالية)**
- ⏳ تحديث ملفات الترجمة
- ⏳ تحديث أسماء المكونات
- ⏳ اختبار شامل

**النظام الآن جاهز للعمل مع المصطلحات الجديدة! 🎉**
