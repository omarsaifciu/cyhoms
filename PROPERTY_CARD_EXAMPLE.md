# مثال على استخدام PropertyCard المحسن
# Enhanced PropertyCard Usage Example

## 🎯 **كيفية استخدام PropertyCard المحسن**

### **1. الاستيراد:**
```typescript
import PropertyCard from "./PropertyCard";
```

### **2. مثال على البيانات:**
```typescript
const sampleProperty = {
  id: "123",
  title: "شقة فاخرة في نيقوسيا",
  title_ar: "شقة فاخرة في نيقوسيا",
  title_en: "Luxury Apartment in Nicosia",
  title_tr: "Lefkoşa'da Lüks Daire",
  
  // صورة الغلاف والصور
  cover_image: "https://example.com/cover.jpg",
  images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  
  // معلومات المالك
  owner_name: "أحمد محمد",
  owner_avatar_url: "https://example.com/avatar.jpg",
  created_by: "user-id-123",
  
  // تفاصيل العقار
  city: "نيقوسيا",
  district: "وسط المدينة",
  property_type: "apartment",
  listing_type: "for_rent",
  status: "available",
  price: 1200,
  currency: "EUR",
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  views_count: 45,
  
  // حالات خاصة
  is_featured: true,
  hidden_by_admin: false,
  
  created_at: "2024-01-15T10:30:00Z"
};
```

### **3. الاستخدام في المكون:**
```typescript
const PropertyManagement = () => {
  const handleToggleStatus = (id: string) => {
    console.log('Toggle status for property:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete property:', id);
  };

  const handleToggleFeatured = (id: string) => {
    console.log('Toggle featured for property:', id);
  };

  const handleOpenProperty = (id: string) => {
    window.open(`/property/${id}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <PropertyCard
        property={sampleProperty}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
        onOpenProperty={handleOpenProperty}
      />
    </div>
  );
};
```

## 🎨 **الميزات المرئية الجديدة**

### **1. صورة الغلاف:**
- عرض صورة الغلاف في أعلى البطاقة
- تأثير تكبير عند التمرير
- صورة افتراضية جميلة عند عدم التوفر

### **2. معلومات المالك:**
- صورة المالك مع أيقونة افتراضية
- اسم المالك قابل للضغط
- رابط لفتح ملف المالك

### **3. تخطيط محسن:**
- ترتيب منطقي للعناصر
- ألوان متناسقة
- تصميم متجاوب

## 🔧 **الحالات المختلفة**

### **1. عقار بدون صورة:**
```typescript
const propertyWithoutImage = {
  ...sampleProperty,
  cover_image: null,
  images: []
};
// سيعرض أيقونة افتراضية جميلة
```

### **2. عقار بدون معلومات مالك:**
```typescript
const propertyWithoutOwner = {
  ...sampleProperty,
  owner_name: null,
  owner_avatar_url: null,
  created_by: null
};
// سيعرض "مالك غير محدد" ولن يكون قابلاً للضغط
```

### **3. عقار مميز:**
```typescript
const featuredProperty = {
  ...sampleProperty,
  is_featured: true
};
// سيعرض badge ذهبي مع نجمة
```

### **4. عقار مخفي من الأدمن:**
```typescript
const hiddenProperty = {
  ...sampleProperty,
  hidden_by_admin: true
};
// سيعرض badge أحمر "مخفي من الأدمن"
```

## 🌐 **الدعم متعدد اللغات**

### **العربية:**
```typescript
// سيعرض النصوص بالعربية
"مالك العقار" // Property Owner
"فتح العقار" // Open Property
"مميز" // Featured
```

### **الإنجليزية:**
```typescript
// سيعرض النصوص بالإنجليزية
"Property Owner"
"Open Property"
"Featured"
```

### **التركية:**
```typescript
// سيعرض النصوص بالتركية
"Mülk Sahibi" // Property Owner
"Mülkü Aç" // Open Property
"Öne Çıkan" // Featured
```

## 📱 **التجاوب مع الأجهزة**

### **الهواتف المحمولة:**
- بطاقة واحدة في الصف
- أزرار كبيرة للمس
- نص مقروء

### **الأجهزة اللوحية:**
- بطاقتان في الصف
- تخطيط متوازن
- استغلال جيد للمساحة

### **أجهزة الكمبيوتر:**
- 3-4 بطاقات في الصف
- تفاصيل كاملة
- تأثيرات hover

## 🎯 **نصائح للاستخدام الأمثل**

### **1. تحسين الأداء:**
```typescript
// استخدم useMemo للبيانات المفلترة
const filteredProperties = useMemo(() => {
  return properties.filter(/* فلترة */);
}, [properties, filters]);
```

### **2. معالجة الأخطاء:**
```typescript
// تأكد من وجود البيانات المطلوبة
if (!property || !property.id) {
  return null;
}
```

### **3. تحسين الصور:**
```typescript
// استخدم صور محسنة للويب
const optimizedImage = property.cover_image + '?w=400&h=300&fit=crop';
```

## ✅ **الخلاصة**

PropertyCard المحسن يوفر:
- 🎨 **تصميم جذاب** مع صور وألوان
- 👤 **معلومات المالك** مع إمكانية التفاعل
- 🔗 **روابط سريعة** لفتح العقار والملف الشخصي
- 📱 **تجاوب ممتاز** مع جميع الأجهزة
- 🌐 **دعم متعدد اللغات** كامل
- 🛡️ **معالجة الأخطاء** والبيانات المفقودة

البطاقة الآن جاهزة للاستخدام في صفحة إدارة العقارات! 🎉
