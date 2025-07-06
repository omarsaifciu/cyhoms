# 🌟 دليل العقارات المميزة - Featured Properties Guide

## 📋 نظرة عامة - Overview

تم إضافة قسم العقارات المميزة إلى الصفحة الرئيسية للموقع. هذا القسم يعرض العقارات التي تم تحديدها كمميزة من قبل الإدارة.

The Featured Properties section has been added to the homepage. This section displays properties that have been marked as featured by the administration.

## 🎯 الميزات - Features

### ✨ العرض التلقائي - Automatic Display
- يظهر قسم العقارات المميزة في الصفحة الرئيسية تلقائياً
- يختفي عند استخدام فلاتر البحث أو البحث النصي
- يعرض رسالة توضيحية عند عدم وجود عقارات مميزة

### 🎨 التصميم - Design
- تصميم جذاب مع أيقونات التاج والنجوم
- خلفية متدرجة مع تأثيرات بصرية
- متجاوب مع جميع أحجام الشاشات
- دعم الوضع الداكن والفاتح

### 🌐 الدعم متعدد اللغات - Multi-language Support
- العربية: "العقارات المميزة"
- التركية: "Öne Çıkan Mülkler"  
- الإنجليزية: "Featured Properties"

## 🔧 كيفية تعيين العقارات كمميزة - How to Set Properties as Featured

### 1. من لوحة الإدارة - From Admin Panel
1. اذهب إلى `/admin`
2. انتقل إلى قسم "إدارة العقارات"
3. اضغط على زر النجمة الذهبية بجانب العقار المطلوب
4. سيتم تحديث حالة العقار فوراً

### 2. من قاعدة البيانات مباشرة - Direct Database Update
```sql
-- تعيين عقار كمميز
UPDATE properties 
SET is_featured = true 
WHERE id = 'property-id-here';

-- إزالة العقار من المميزة
UPDATE properties 
SET is_featured = false 
WHERE id = 'property-id-here';
```

### 3. استخدام السكريبت المرفق - Using Provided Script
```sql
-- تشغيل السكريبت لتعيين أول 3 عقارات كمميزة
-- Run the script to set first 3 properties as featured
\i scripts/set-featured-properties.sql
```

## 📊 منطق العرض - Display Logic

### متى يظهر القسم - When Section Appears
- الصفحة الرئيسية فقط
- عدم وجود بحث نصي نشط
- جميع الفلاتر في وضع "الكل"
- يظهر حتى لو لم تكن هناك عقارات مميزة (مع رسالة توضيحية)

### ترتيب العقارات - Property Ordering
- العقارات المميزة تظهر أولاً
- مرتبة حسب تاريخ الإنشاء (الأحدث أولاً)
- فقط العقارات المتاحة (status = 'available')

## 🔍 الفلترة والبحث - Filtering and Search

### شروط الإخفاء - Hide Conditions
القسم يختفي عند:
- وجود نص بحث
- اختيار مدينة محددة
- اختيار منطقة محددة  
- اختيار نوع عقار محدد

### العودة للعرض - Return to Display
القسم يظهر مرة أخرى عند:
- مسح البحث
- إعادة تعيين جميع الفلاتر إلى "الكل"

## 🎛️ إعدادات المطورين - Developer Settings

### ملفات الكود الرئيسية - Main Code Files
- `src/components/FeaturedPropertiesSection.tsx` - المكون الرئيسي
- `src/pages/Index.tsx` - تضمين القسم في الصفحة الرئيسية
- `src/types/property.ts` - تعريف النوع `is_featured`

### قاعدة البيانات - Database
- العمود: `is_featured` (boolean)
- الجدول: `properties`
- القيمة الافتراضية: `false`

## 🚀 التحسينات المستقبلية - Future Enhancements

### مقترحات للتطوير - Development Suggestions
1. إضافة حد أقصى لعدد العقارات المميزة
2. ترتيب العقارات المميزة حسب الأولوية
3. إضافة تاريخ انتهاء للعقارات المميزة
4. إحصائيات العقارات المميزة في لوحة الإدارة

### تحسينات الأداء - Performance Improvements
1. تخزين مؤقت للعقارات المميزة
2. تحميل تدريجي للصور
3. تحسين استعلامات قاعدة البيانات

## 📝 ملاحظات مهمة - Important Notes

⚠️ **تنبيهات:**
- العقارات المخفية من الإدارة لا تظهر في القسم
- العقارات غير المتاحة لا تظهر في القسم
- يجب أن يكون للمستخدم صلاحيات إدارية لتعيين العقارات كمميزة

✅ **نصائح:**
- استخدم العقارات المميزة بحكمة لجذب الانتباه
- تأكد من جودة الصور للعقارات المميزة
- راجع العقارات المميزة بانتظام وحدثها
