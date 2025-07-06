# دليل رفع مشروع React على Hostinger VPS
# React Project Deployment Guide for Hostinger VPS

## معلومات السيرفر / Server Information
- **IP**: 69.62.111.115
- **OS**: Ubuntu 24.04 LTS
- **SSH User**: root

## الخطوات المطلوبة / Required Steps

### الطريقة الأولى: النشر التلقائي الشامل / Method 1: Complete Automatic Deployment

#### 1. الاتصال بالسيرفر / Connect to Server
```bash
ssh root@69.62.111.115
```

#### 2. رفع ملفات النشر / Upload Deployment Files
```bash
# رفع جميع ملفات النشر
scp deploy-setup.sh root@69.62.111.115:/root/
scp deploy-project.sh root@69.62.111.115:/root/
scp nginx-config.conf root@69.62.111.115:/root/
scp setup-ssl.sh root@69.62.111.115:/root/
scp setup-database.sh root@69.62.111.115:/root/
scp create-git-repo.sh root@69.62.111.115:/root/
scp complete-deployment.sh root@69.62.111.115:/root/
scp backup-and-monitor.sh root@69.62.111.115:/root/
```

#### 3. تحديث المتغيرات في complete-deployment.sh
```bash
nano complete-deployment.sh
```
قم بتحديث:
- `DOMAIN="your-domain.com"` → اسم النطاق الخاص بك
- `EMAIL="your-email@example.com"` → عنوان البريد الإلكتروني
- `GITHUB_USERNAME="your-github-username"` → اسم المستخدم في GitHub

#### 4. تشغيل النشر الشامل
```bash
chmod +x complete-deployment.sh
./complete-deployment.sh
```

### الطريقة الثانية: النشر اليدوي خطوة بخطوة / Method 2: Manual Step-by-Step Deployment

#### 1. إعداد البيئة / Environment Setup
```bash
chmod +x deploy-setup.sh
./deploy-setup.sh
```

#### 2. إنشاء مستودع Git / Create Git Repository
```bash
chmod +x create-git-repo.sh
# تحديث GITHUB_USERNAME في السكريبت أولاً
nano create-git-repo.sh
./create-git-repo.sh
```

#### 3. رفع المشروع / Deploy Project
```bash
chmod +x deploy-project.sh
# تحديث REPO_URL و DOMAIN في السكريبت
nano deploy-project.sh
./deploy-project.sh
```

#### 4. إعداد قاعدة البيانات / Setup Database
```bash
chmod +x setup-database.sh
./setup-database.sh
```

#### 5. إعداد SSL / Setup SSL
```bash
chmod +x setup-ssl.sh
# تحديث DOMAIN و EMAIL في السكريبت
nano setup-ssl.sh
./setup-ssl.sh
```

#### 6. إعداد النسخ الاحتياطي والمراقبة / Setup Backup and Monitoring
```bash
chmod +x backup-and-monitor.sh
./backup-and-monitor.sh
```

## إعدادات DNS / DNS Settings

تأكد من أن النطاق الخاص بك يشير إلى IP السيرفر:

### A Records:
- `@` → `69.62.111.115`
- `www` → `69.62.111.115`

## اختبار المشروع / Testing

### 1. اختبار HTTP:
```bash
curl -I http://your-domain.com
```

### 2. اختبار HTTPS:
```bash
curl -I https://your-domain.com
```

### 3. اختبار Nginx:
```bash
sudo nginx -t
sudo systemctl status nginx
```

## إدارة المشروع / Project Management

### تحديث المشروع / Update Project:
```bash
cd /var/www/cyhoms
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

### مراقبة الـ Logs / Monitor Logs:
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### إعادة تشغيل الخدمات / Restart Services:
```bash
sudo systemctl restart nginx
```

## استكشاف الأخطاء / Troubleshooting

### مشاكل شائعة / Common Issues:

1. **خطأ 502 Bad Gateway**:
   - تحقق من تشغيل Nginx: `sudo systemctl status nginx`
   - تحقق من تكوين Nginx: `sudo nginx -t`

2. **خطأ 404 Not Found**:
   - تحقق من مسار الملفات في `/var/www/cyhoms/dist`
   - تحقق من صلاحيات الملفات

3. **مشاكل SSL**:
   - تحقق من إعدادات DNS
   - تحقق من فتح البورتات 80 و 443

### أوامر مفيدة / Useful Commands:
```bash
# حالة الخدمات
sudo systemctl status nginx

# إعادة تحميل Nginx
sudo systemctl reload nginx

# اختبار تكوين Nginx
sudo nginx -t

# مراقبة استخدام الموارد
htop
df -h
free -h
```

## الأمان / Security

### تحديثات النظام / System Updates:
```bash
sudo apt update && sudo apt upgrade -y
```

### إعدادات Firewall:
```bash
sudo ufw status
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## النسخ الاحتياطي / Backup

### نسخ احتياطي للمشروع / Project Backup:
```bash
tar -czf cyhoms-backup-$(date +%Y%m%d).tar.gz /var/www/cyhoms
```

### نسخ احتياطي لتكوين Nginx / Nginx Config Backup:
```bash
sudo cp /etc/nginx/sites-available/cyhoms /root/nginx-cyhoms-backup.conf
```
