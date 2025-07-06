# دليل أنواع المستخدمين والدوال - User Types & Functions Reference

## 👥 **أنواع المستخدمين المتاحة / Available User Types**

### **1. العملاء / Clients**
```sql
user_type = 'client'
```
- **الوصف**: المستخدمون العاديون الذين يبحثون عن العقارات
- **الصلاحيات**: عرض العقارات، إضافة للمفضلة، التعليق
- **الموافقة**: لا تحتاج موافقة (`is_approved` غير مطلوب)

### **2. الوسطاء / Agents** *(كان seller سابقاً)*
```sql
user_type = 'agent'
```
- **الوصف**: وسطاء عقاريون يمكنهم إضافة وإدارة العقارات
- **الصلاحيات**: جميع صلاحيات العميل + إضافة/تعديل/حذف العقارات
- **الموافقة**: تحتاج موافقة (`is_approved = true`)

### **3. مالكو العقارات / Property Owners**
```sql
user_type = 'property_owner'
```
- **الوصف**: أصحاب العقارات الذين يريدون عرض عقاراتهم
- **الصلاحيات**: إضافة وإدارة عقاراتهم الخاصة
- **الموافقة**: تحتاج موافقة (`is_approved = true`)

### **4. المكاتب العقارية / Real Estate Offices**
```sql
user_type = 'real_estate_office'
```
- **الوصف**: مكاتب عقارية مرخصة
- **الصلاحيات**: إدارة متقدمة للعقارات، تقارير مفصلة
- **الموافقة**: تحتاج موافقة (`is_approved = true`)

### **5. الشركاء ومالكو الموقع / Partners & Site Owners**
```sql
user_type = 'partner_and_site_owner'
```
- **الوصف**: شركاء في الموقع أو مالكون مشاركون
- **الصلاحيات**: صلاحيات متقدمة، إدارة المحتوى
- **الموافقة**: تحتاج موافقة (`is_approved = true`)

### **6. المديرون / Administrators**
```sql
user_type = 'admin'
```
- **الوصف**: مديرو النظام
- **الصلاحيات**: جميع الصلاحيات، إدارة المستخدمين، الموافقات
- **الموافقة**: معتمد تلقائياً (`is_approved = true`)

### **7. الدعم الفني / Support**
```sql
user_type = 'support'
```
- **الوصف**: فريق الدعم الفني
- **الصلاحيات**: عرض التقارير، مساعدة المستخدمين
- **الموافقة**: معتمد تلقائياً (`is_approved = true`)

---

## 🔧 **دوال التحقق من الصلاحيات / Permission Check Functions**

### **1. دالة `is_seller()`**
```sql
SELECT public.is_seller();
```
**الغرض**: التحقق من كون المستخدم "بائع" (وسيط أو مالك عقار)
**ترجع**: `true` إذا كان المستخدم من الأنواع:
- `agent`
- `property_owner` 
- `real_estate_office`
- `partner_and_site_owner`

**الاستخدام في RLS**:
```sql
-- مثال: السماح للبائعين بإضافة العقارات
CREATE POLICY "Sellers can insert properties" 
ON properties FOR INSERT 
USING (public.is_seller());
```

### **2. دالة `is_approved_seller()`**
```sql
SELECT public.is_approved_seller();
```
**الغرض**: التحقق من كون المستخدم بائع معتمد
**ترجع**: `true` إذا كان المستخدم بائع AND `is_approved = true`

**الاستخدام**:
```sql
-- السماح للبائعين المعتمدين فقط بنشر العقارات
CREATE POLICY "Approved sellers can publish" 
ON properties FOR INSERT 
USING (public.is_approved_seller());
```

### **3. دالة `is_admin()`**
```sql
SELECT public.is_admin();
```
**الغرض**: التحقق من كون المستخدم مدير
**ترجع**: `true` إذا كان `user_type = 'admin'`

### **4. دالة `can_user_add_property(user_id)`**
```sql
SELECT public.can_user_add_property(auth.uid());
```
**الغرض**: التحقق من إمكانية المستخدم إضافة عقار جديد
**تتحقق من**: حدود العقارات، نوع المستخدم، الموافقة

### **5. دالة `is_trial_expired()`**
```sql
SELECT public.is_trial_expired();
```
**الغرض**: التحقق من انتهاء فترة التجربة للمستخدم

---

## 📊 **أمثلة عملية / Practical Examples**

### **التحقق من نوع المستخدم الحالي:**
```sql
SELECT 
    user_type,
    is_approved,
    public.is_seller() as can_sell,
    public.is_approved_seller() as can_publish,
    public.is_admin() as is_admin
FROM profiles 
WHERE id = auth.uid();
```

### **عرض إحصائيات المستخدمين:**
```sql
SELECT 
    user_type,
    COUNT(*) as total,
    COUNT(CASE WHEN is_approved THEN 1 END) as approved
FROM profiles 
GROUP BY user_type;
```

### **البحث عن مستخدمين معينين:**
```sql
-- جميع الوسطاء المعتمدين
SELECT username, email, full_name 
FROM profiles 
WHERE user_type = 'agent' AND is_approved = true;

-- جميع المديرين
SELECT username, email, full_name 
FROM profiles 
WHERE user_type = 'admin';
```

---

## 🛡️ **سياسات الأمان / Security Policies**

### **مثال على سياسة RLS:**
```sql
-- السماح للبائعين المعتمدين بإدارة عقاراتهم
CREATE POLICY "Approved sellers manage own properties"
ON properties 
FOR ALL
TO authenticated
USING (
    public.is_approved_seller() 
    AND (created_by = auth.uid() OR user_id = auth.uid())
);

-- السماح للمديرين بإدارة جميع العقارات
CREATE POLICY "Admins manage all properties"
ON properties 
FOR ALL
TO authenticated
USING (public.is_admin());
```

---

## 🔄 **تحديث نوع المستخدم / Update User Type**

### **تغيير نوع مستخدم:**
```sql
-- تحويل عميل إلى وسيط
UPDATE profiles 
SET user_type = 'agent', is_approved = false 
WHERE id = 'user-uuid-here';

-- الموافقة على وسيط
UPDATE profiles 
SET is_approved = true 
WHERE id = 'user-uuid-here' AND user_type = 'agent';
```

### **إضافة مدير جديد:**
```sql
UPDATE profiles 
SET user_type = 'admin', is_approved = true 
WHERE email = 'admin@example.com';
```

---

## 🧪 **اختبار النظام / System Testing**

### **تشغيل الاختبارات:**
```sql
-- شغل هذا السكريبت لرؤية جميع المعلومات
\i USER_TYPES_AND_FUNCTIONS_OVERVIEW.sql
```

### **اختبار سريع:**
```sql
-- معلومات المستخدم الحالي
SELECT public.get_current_user_permissions();

-- نوع المستخدم الحالي
SELECT public.get_current_user_type();
```

---

## 📝 **ملاحظات مهمة / Important Notes**

1. **تم تغيير `seller` إلى `agent`** في جميع أنحاء النظام
2. **المديرون معتمدون تلقائياً** (`is_approved = true`)
3. **العملاء لا يحتاجون موافقة** للاستخدام العادي
4. **البائعون يحتاجون موافقة** لإضافة العقارات
5. **جميع الدوال تستخدم `auth.uid()`** للمستخدم الحالي

---

## 🎯 **الاستخدام العملي / Practical Usage**

في الكود TypeScript/React:
```typescript
// التحقق من نوع المستخدم
const { data: userType } = await supabase.rpc('get_current_user_type');

// التحقق من الصلاحيات
const { data: permissions } = await supabase.rpc('get_current_user_permissions');

// التحقق من كون المستخدم بائع
const { data: isSeller } = await supabase.rpc('is_seller');
```

هذا النظام يوفر مرونة كاملة في إدارة أنواع المستخدمين وصلاحياتهم! 🚀
