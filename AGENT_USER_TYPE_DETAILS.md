# نوع المستخدم: وسيط (Agent) - تفاصيل شاملة

## 🔄 **التغيير الأساسي / Main Change**

```sql
-- قديماً / Previously:
user_type = 'seller'

-- حالياً / Currently:
user_type = 'agent'
```

**السبب**: تحديث المصطلحات لتكون أكثر دقة ووضوحاً في السوق العقاري.

---

## 👤 **تعريف نوع المستخدم Agent**

### **الوصف**:
- **العربية**: وسيط عقاري مرخص يمكنه إدارة العقارات
- **English**: Licensed real estate agent who can manage properties
- **Türkçe**: Gayrimenkul acentesi (emlak uzmanı)

### **الصلاحيات الأساسية**:
```sql
-- يمكن للوسطاء (agents) القيام بما يلي:
✅ إضافة عقارات جديدة (بعد الموافقة)
✅ تعديل عقاراتهم الخاصة
✅ حذف عقاراتهم الخاصة
✅ عرض تقارير مبيعاتهم
✅ إدارة ملفهم الشخصي
✅ التواصل مع العملاء
```

---

## 🔧 **كيف يعمل في قاعدة البيانات**

### **1. في جدول profiles:**
```sql
-- مثال على سجل وسيط
INSERT INTO profiles (
    user_type,
    is_approved,
    full_name,
    email
) VALUES (
    'agent',           -- نوع المستخدم
    false,            -- يحتاج موافقة أولاً
    'أحمد محمد',       -- الاسم الكامل
    'agent@example.com'
);
```

### **2. في دالة is_seller():**
```sql
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN (
        'agent',                    -- ✅ الوسطاء
        'property_owner',           -- ✅ مالكو العقارات
        'real_estate_office',       -- ✅ المكاتب العقارية
        'partner_and_site_owner'    -- ✅ الشركاء
    )
  );
$$;
```

### **3. في دالة is_approved_seller():**
```sql
CREATE OR REPLACE FUNCTION public.is_approved_seller()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type IN ('agent', 'property_owner', 'real_estate_office', 'partner_and_site_owner')
    AND is_approved = true  -- ✅ يجب أن يكون معتمد
  );
$$;
```

---

## 📊 **حالات الوسيط (Agent States)**

### **1. وسيط جديد (غير معتمد)**
```sql
user_type = 'agent'
is_approved = false
```
**الصلاحيات**:
- ❌ لا يمكن إضافة عقارات
- ✅ يمكن عرض العقارات
- ✅ يمكن تعديل الملف الشخصي
- ⏳ في انتظار موافقة المدير

### **2. وسيط معتمد**
```sql
user_type = 'agent'
is_approved = true
```
**الصلاحيات**:
- ✅ يمكن إضافة عقارات
- ✅ يمكن تعديل/حذف عقاراته
- ✅ يمكن عرض تقارير المبيعات
- ✅ جميع صلاحيات الوسيط الكاملة

### **3. وسيط معلق**
```sql
user_type = 'agent'
is_approved = false
is_suspended = true
```
**الصلاحيات**:
- ❌ معلق مؤقتاً
- ❌ لا يمكن إضافة عقارات جديدة
- ✅ يمكن عرض عقاراته الحالية فقط

---

## 🔍 **كيفية التحقق من نوع Agent**

### **1. في SQL:**
```sql
-- التحقق من كون المستخدم وسيط
SELECT 
    user_type = 'agent' as is_agent,
    is_approved,
    public.is_seller() as can_sell,
    public.is_approved_seller() as can_add_properties
FROM profiles 
WHERE id = auth.uid();
```

### **2. في TypeScript/React:**
```typescript
// التحقق من نوع المستخدم
const checkUserType = async () => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type, is_approved')
    .eq('id', user.id)
    .single();
    
  const isAgent = profile?.user_type === 'agent';
  const isApprovedAgent = isAgent && profile?.is_approved;
  
  return { isAgent, isApprovedAgent };
};

// استخدام دالة is_seller
const { data: isSeller } = await supabase.rpc('is_seller');
const { data: isApprovedSeller } = await supabase.rpc('is_approved_seller');
```

---

## 🛠️ **عمليات إدارة الوسطاء**

### **1. تحويل عميل إلى وسيط:**
```sql
UPDATE profiles 
SET 
    user_type = 'agent',
    is_approved = false,  -- يحتاج موافقة
    updated_at = now()
WHERE id = 'user-uuid-here';
```

### **2. الموافقة على وسيط:**
```sql
UPDATE profiles 
SET 
    is_approved = true,
    approved_at = now(),
    updated_at = now()
WHERE id = 'agent-uuid-here' 
AND user_type = 'agent';
```

### **3. تعليق وسيط:**
```sql
UPDATE profiles 
SET 
    is_approved = false,
    suspension_reason = 'مخالفة الشروط',
    updated_at = now()
WHERE id = 'agent-uuid-here' 
AND user_type = 'agent';
```

---

## 📈 **إحصائيات الوسطاء**

### **عرض جميع الوسطاء:**
```sql
SELECT 
    username,
    full_name,
    email,
    is_approved,
    created_at,
    (SELECT COUNT(*) FROM properties WHERE created_by = profiles.id) as total_properties
FROM profiles 
WHERE user_type = 'agent'
ORDER BY created_at DESC;
```

### **الوسطاء المعتمدون فقط:**
```sql
SELECT 
    COUNT(*) as total_approved_agents,
    AVG((SELECT COUNT(*) FROM properties WHERE created_by = profiles.id)) as avg_properties_per_agent
FROM profiles 
WHERE user_type = 'agent' AND is_approved = true;
```

---

## 🔐 **سياسات الأمان للوسطاء**

### **سياسة إضافة العقارات:**
```sql
CREATE POLICY "Approved agents can add properties"
ON properties 
FOR INSERT 
TO authenticated
WITH CHECK (
    public.is_approved_seller() 
    AND user_type = 'agent'
);
```

### **سياسة إدارة العقارات الخاصة:**
```sql
CREATE POLICY "Agents manage own properties"
ON properties 
FOR UPDATE 
TO authenticated
USING (
    created_by = auth.uid() 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_type = 'agent' 
        AND is_approved = true
    )
);
```

---

## 🎯 **الاستخدام في الواجهة**

### **عرض حالة الوسيط:**
```typescript
const AgentStatus = ({ profile }) => {
  if (profile.user_type !== 'agent') return null;
  
  return (
    <div className="agent-status">
      {profile.is_approved ? (
        <span className="approved">✅ وسيط معتمد</span>
      ) : (
        <span className="pending">⏳ في انتظار الموافقة</span>
      )}
    </div>
  );
};
```

### **قائمة صلاحيات الوسيط:**
```typescript
const AgentPermissions = ({ profile }) => {
  const canAddProperties = profile.user_type === 'agent' && profile.is_approved;
  
  return (
    <ul>
      <li>{canAddProperties ? '✅' : '❌'} إضافة عقارات</li>
      <li>✅ عرض العقارات</li>
      <li>✅ تعديل الملف الشخصي</li>
      <li>{canAddProperties ? '✅' : '❌'} تقارير المبيعات</li>
    </ul>
  );
};
```

---

## 📝 **ملخص التغييرات**

### **ما تم تغييره:**
1. ✅ `seller` → `agent` في جدول profiles
2. ✅ تحديث جميع الدوال للتعامل مع `agent`
3. ✅ تحديث سياسات RLS
4. ✅ تحديث الواجهات والترجمات

### **ما لم يتغير:**
1. ✅ دالة `is_seller()` ما زالت تعمل (تتضمن agents الآن)
2. ✅ دالة `is_approved_seller()` ما زالت تعمل
3. ✅ جميع الصلاحيات والسياسات محفوظة

**النتيجة**: النظام يعمل بنفس الطريقة، لكن بمصطلحات أكثر دقة ووضوحاً! 🎉
