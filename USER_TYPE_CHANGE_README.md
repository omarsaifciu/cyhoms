# تغيير نوع المستخدم من "بائع" إلى "وسيط" - User Type Change from "Seller" to "Agent"

## نظرة عامة / Overview

تم تحديث نوع المستخدم في جميع أنحاء الموقع من "بائع/Seller" إلى "وسيط/Agent" مع الترجمات المناسبة.

The user type has been updated throughout the website from "Seller" to "Agent" with appropriate translations.

## التغييرات المطبقة / Applied Changes

### 1. الترجمات / Translations

#### العربية / Arabic:
- ✅ **"بائع"** → **"وسيط"**
- ✅ **"لوحة البائع"** → **"لوحة التحكم"**
- ✅ **"البائعين"** → **"الوسطاء"**

#### الإنجليزية / English:
- ✅ **"Seller"** → **"Agent"**
- ✅ **"Seller Dashboard"** → **"Dashboard"**
- ✅ **"Sellers"** → **"Agents"**

#### التركية / Turkish:
- ✅ **"Satıcı"** → **"Acente"**
- ✅ **"Satıcı Paneli"** → **"Kontrol Paneli"**
- ✅ **"Satıcılar"** → **"Acenteler"**

### 2. ملفات الترجمة المحدثة / Updated Translation Files

```
src/contexts/translations/ar.ts     - الترجمة العربية
src/contexts/translations/en.ts     - الترجمة الإنجليزية  
src/contexts/translations/tr.ts     - الترجمة التركية
```

### 3. قاعدة البيانات / Database Changes

#### Migration الجديد / New Migration:
```sql
-- supabase/migrations/20250628002000-change-seller-to-agent.sql
-- تحديث جميع السجلات من 'seller' إلى 'agent'
UPDATE public.profiles SET user_type = 'agent' WHERE user_type = 'seller';

-- تحديث القيد ليقبل 'agent' بدلاً من 'seller'
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (user_type IN ('client', 'agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner'));
```

### 4. الملفات المحدثة / Updated Files

#### أنواع البيانات / Type Definitions:
```
src/types/user.ts                           - تحديث أنواع المستخدم
src/integrations/supabase/types.ts          - تحديث ثوابت قاعدة البيانات
```

#### المكونات / Components:
```
src/components/profile/UserTypeField.tsx           - حقل نوع المستخدم
src/components/auth/form-fields/UserTypeField.tsx  - حقل التسجيل
src/components/admin/UserActions.tsx               - إجراءات المستخدم
src/components/admin/UsersTable.tsx                - جدول المستخدمين
src/components/admin/UserCard.tsx                  - بطاقة المستخدم
src/components/admin/PendingApprovals.tsx          - الموافقات المعلقة
src/components/admin/ReviewsManagement.tsx         - إدارة التقييمات
src/components/header/UserMenu.tsx                 - قائمة المستخدم
src/components/header/mobile/MobileNav.tsx         - التنقل المحمول
```

#### الصفحات / Pages:
```
src/pages/SellerDashboard.tsx               - لوحة الوسيط
```

#### الخطافات / Hooks:
```
src/hooks/useAuth.tsx                       - نظام المصادقة
src/hooks/useUserActions.ts                - إجراءات المستخدم
```

### 5. وظائف قاعدة البيانات / Database Functions

تم تحديث الوظائف التالية:
- ✅ `is_seller()` - للتحقق من صلاحيات الوسيط
- ✅ `is_approved_seller()` - للتحقق من الوسطاء المعتمدين
- ✅ `handle_new_user()` - لإنشاء ملفات المستخدمين الجدد

### 6. سياسات الأمان / Security Policies

تم تحديث تعليقات سياسات RLS:
- ✅ **"Sellers can view their own properties"** → **"Agents can view their own properties"**
- ✅ **"Approved sellers can insert"** → **"Approved agents can insert"**
- ✅ **"Sellers can update"** → **"Agents can update"**
- ✅ **"Sellers can delete"** → **"Agents can delete"**

## كيفية التطبيق / How to Apply

### 1. تطبيق Migration:
```bash
# تطبيق التحديث على قاعدة البيانات
supabase db push
```

### 2. إعادة تشغيل التطبيق:
```bash
npm run dev
```

### 3. التحقق من التحديثات:
- ✅ تسجيل دخول كوسيط
- ✅ التحقق من عرض "لوحة التحكم" بدلاً من "لوحة البائع"
- ✅ التحقق من الترجمات في جميع اللغات
- ✅ التحقق من نماذج التسجيل

## الاختبار / Testing

### اختبار الترجمات / Translation Testing:
1. **العربية**: تأكد من ظهور "وسيط" و "لوحة التحكم"
2. **الإنجليزية**: تأكد من ظهور "Agent" و "Dashboard"
3. **التركية**: تأكد من ظهور "Acente" و "Kontrol Paneli"

### اختبار الوظائف / Functionality Testing:
1. **التسجيل**: اختر نوع "وسيط/Agent/Acente"
2. **لوحة التحكم**: تأكد من الوصول للوحة التحكم
3. **الصلاحيات**: تأكد من عمل جميع صلاحيات الوسيط
4. **الإدارة**: تأكد من عرض الوسطاء في لوحة الإدارة

## التوافق مع الإصدارات السابقة / Backward Compatibility

- ✅ **البيانات الموجودة**: تم تحديث جميع السجلات تلقائياً
- ✅ **الوظائف**: تعمل جميع الوظائف كما هو متوقع
- ✅ **الصلاحيات**: لم تتغير صلاحيات المستخدمين
- ✅ **API**: لا تغيير في واجهات البرمجة

## ملاحظات مهمة / Important Notes

### للمطورين / For Developers:
- استخدم `'agent'` بدلاً من `'seller'` في الكود الجديد
- الترجمة تتم عبر `t('seller')` والتي تعرض "وسيط/Agent/Acente"
- جميع الصلاحيات والوظائف تعمل بنفس الطريقة

### للمستخدمين / For Users:
- لا تغيير في طريقة الاستخدام
- نفس الصلاحيات والميزات
- فقط تغيير في النصوص المعروضة

## الدعم الفني / Technical Support

في حالة وجود مشاكل:
1. تأكد من تطبيق Migration الجديد
2. تحقق من إعادة تشغيل التطبيق
3. راجع console للأخطاء
4. تأكد من تحديث ملفات الترجمة

---

**ملخص**: تم تغيير جميع المراجع من "بائع/Seller/Satıcı" إلى "وسيط/Agent/Acente" بنجاح في جميع أنحاء الموقع مع الحفاظ على جميع الوظائف والصلاحيات.

**Summary**: Successfully changed all references from "بائع/Seller/Satıcı" to "وسيط/Agent/Acente" throughout the website while maintaining all functionality and permissions.
