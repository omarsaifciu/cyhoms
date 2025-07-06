# دليل البدء السريع - CyHoms Deployment
# Quick Start Guide - CyHoms Deployment

## 🚀 النشر السريع في 5 دقائق / Quick Deployment in 5 Minutes

### المتطلبات / Requirements
- ✅ سيرفر VPS (Hostinger) - IP: 69.62.111.115
- ✅ اسم نطاق (Domain) يشير إلى IP السيرفر
- ✅ حساب GitHub
- ✅ عنوان بريد إلكتروني

### الخطوات / Steps

#### 1. رفع الملفات إلى السيرفر / Upload Files to Server
```bash
# رفع جميع ملفات النشر دفعة واحدة
scp *.sh *.conf *.md root@69.62.111.115:/root/
```

#### 2. الاتصال بالسيرفر / Connect to Server
```bash
ssh root@69.62.111.115
```

#### 3. تحديث المتغيرات / Update Variables
```bash
nano complete-deployment.sh
```

**قم بتغيير هذه القيم:**
```bash
DOMAIN="your-domain.com"          # → اسم النطاق الخاص بك
EMAIL="your-email@example.com"    # → عنوان البريد الإلكتروني
GITHUB_USERNAME="your-username"   # → اسم المستخدم في GitHub
```

#### 4. تشغيل النشر التلقائي / Run Automatic Deployment
```bash
chmod +x complete-deployment.sh
./complete-deployment.sh
```

#### 5. إنشاء مستودع GitHub / Create GitHub Repository
عندما يطلب منك السكريبت:
1. اذهب إلى: https://github.com/new
2. اسم المستودع: `cyhoms-real-estate`
3. اجعله `Private` أو `Public`
4. **لا تضف** README أو .gitignore
5. اضغط "Create repository"
6. ارجع للسيرفر واضغط Enter

### 🎉 انتهى! / Done!

موقعك الآن متاح على: `https://your-domain.com`

---

## 📋 ما يحدث تلقائياً / What Happens Automatically

### ✅ إعداد البيئة / Environment Setup
- تثبيت Node.js 18 LTS
- تثبيت npm و PM2
- تثبيت Nginx
- تثبيت Git
- إعداد Firewall

### ✅ إعداد المشروع / Project Setup
- إنشاء مستودع Git
- رفع الكود إلى GitHub
- تثبيت التبعيات
- بناء المشروع للإنتاج
- تكوين متغيرات البيئة

### ✅ إعداد قاعدة البيانات / Database Setup
- تثبيت Supabase CLI
- ربط المشروع بـ Supabase
- تطبيق جميع migrations
- تكوين الاتصال

### ✅ إعداد خادم الويب / Web Server Setup
- تكوين Nginx
- إعداد SSL مع Let's Encrypt
- تفعيل HTTPS
- إعداد redirects

### ✅ إعداد النسخ الاحتياطي / Backup Setup
- نسخ احتياطي يومي تلقائي
- مراقبة النظام كل 5 دقائق
- سكريبت تحديث المشروع

---

## 🔧 أوامر مفيدة بعد النشر / Useful Commands After Deployment

### تحديث المشروع / Update Project
```bash
/usr/local/bin/cyhoms-update.sh
```

### نسخة احتياطية يدوية / Manual Backup
```bash
/usr/local/bin/cyhoms-backup.sh
```

### فحص النظام / System Check
```bash
/usr/local/bin/cyhoms-monitor.sh
```

### مراجعة الـ Logs / Check Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/error.log

# Project logs
tail -f /var/log/cyhoms/monitor.log
tail -f /var/log/cyhoms/backup.log
```

### إعادة تشغيل الخدمات / Restart Services
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## 🆘 استكشاف الأخطاء / Troubleshooting

### المشكلة: الموقع لا يعمل / Site Not Working
```bash
# فحص حالة Nginx
sudo systemctl status nginx

# فحص تكوين Nginx
sudo nginx -t

# مراجعة logs
sudo tail -f /var/log/nginx/error.log
```

### المشكلة: SSL لا يعمل / SSL Not Working
```bash
# تجديد SSL
sudo certbot renew

# فحص شهادة SSL
sudo certbot certificates
```

### المشكلة: قاعدة البيانات لا تعمل / Database Not Working
```bash
# إعادة تطبيق migrations
cd /var/www/cyhoms
supabase db push
```

---

## 📞 الدعم / Support

### ملفات مهمة / Important Files
- **المشروع**: `/var/www/cyhoms/`
- **تكوين Nginx**: `/etc/nginx/sites-available/cyhoms`
- **متغيرات البيئة**: `/var/www/cyhoms/.env`
- **Logs**: `/var/log/cyhoms/`

### معلومات النظام / System Information
- **OS**: Ubuntu 24.04 LTS
- **Web Server**: Nginx
- **Database**: Supabase
- **SSL**: Let's Encrypt
- **Process Manager**: PM2

### روابط مفيدة / Useful Links
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repository**: https://github.com/[username]/cyhoms-real-estate
- **SSL Check**: https://www.ssllabs.com/ssltest/

---

## 🔄 تحديثات مستقبلية / Future Updates

لتحديث المشروع مستقبلاً:

1. **تحديث الكود محلياً**
2. **رفع التحديثات إلى GitHub**
3. **تشغيل سكريبت التحديث على السيرفر**:
   ```bash
   /usr/local/bin/cyhoms-update.sh
   ```

---

**🎉 مبروك! موقعك الآن يعمل بكامل طاقته!**
**🎉 Congratulations! Your website is now fully operational!**
