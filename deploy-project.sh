#!/bin/bash

# سكريبت رفع وبناء مشروع React
# Script to deploy and build React project

echo "🚀 بدء رفع المشروع..."
echo "🚀 Starting project deployment..."

# متغيرات المشروع
PROJECT_DIR="/var/www/cyhoms"
REPO_URL="https://github.com/your-username/your-repo.git"  # استبدل برابط المستودع الخاص بك
DOMAIN="your-domain.com"  # استبدل بالدومين الخاص بك

# التحقق من وجود Git
if ! command -v git &> /dev/null; then
    echo "❌ Git غير مثبت. يرجى تثبيته أولاً."
    exit 1
fi

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيته أولاً."
    exit 1
fi

# الانتقال إلى مجلد المشروع
cd $PROJECT_DIR

# استنساخ المشروع من Git (إذا لم يكن موجوداً)
if [ ! -d ".git" ]; then
    echo "📥 استنساخ المشروع من Git..."
    git clone $REPO_URL .
else
    echo "🔄 تحديث المشروع من Git..."
    git pull origin main
fi

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
npm install

# إنشاء ملف متغيرات البيئة
echo "⚙️ إعداد متغيرات البيئة..."
if [ ! -f ".env" ]; then
    cat > .env << EOL
# Supabase Configuration
VITE_SUPABASE_URL=https://cuznupufbtipnqluzgbp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1em51cHVmYnRpcG5xbHV6Z2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU3MjgsImV4cCI6MjA2NDE4MTcyOH0.tjQR5IMnFWppS4Ny9qiapxsPpAOiLYkjdPgE309YXng

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDi0SSHkvPw_M1GZgCCcHK6mXuxzKLOdHs
VITE_FIREBASE_AUTH_DOMAIN=cyhome-b363b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cyhome-b363b
VITE_FIREBASE_STORAGE_BUCKET=cyhome-b363b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=197469415376
VITE_FIREBASE_APP_ID=1:197469415376:web:37e8dc9636e5751fe83bd5
VITE_FIREBASE_MEASUREMENT_ID=G-XC3K4JJTHP
VITE_FIREBASE_VAPID_KEY=U-DWutNIxTh01upquslllJO5rpT9uIg23liWInfupq4

# Other Environment Variables
VITE_APP_ENV=production
VITE_APP_URL=https://$DOMAIN
EOL
    echo "✅ تم إنشاء ملف .env بالقيم الصحيحة"
    echo "✅ .env file created with correct values"
fi

# بناء المشروع للإنتاج
echo "🔨 بناء المشروع للإنتاج..."
npm run build

# التحقق من نجاح البناء
if [ ! -d "dist" ]; then
    echo "❌ فشل في بناء المشروع"
    exit 1
fi

# إعداد الصلاحيات
echo "🔒 إعداد الصلاحيات..."
sudo chown -R www-data:www-data $PROJECT_DIR/dist
sudo chmod -R 755 $PROJECT_DIR/dist

# نسخ تكوين Nginx
echo "⚙️ تكوين Nginx..."
sudo cp nginx-config.conf /etc/nginx/sites-available/cyhoms

# تحديث الدومين في تكوين Nginx
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/cyhoms

# تفعيل الموقع
sudo ln -sf /etc/nginx/sites-available/cyhoms /etc/nginx/sites-enabled/

# إزالة التكوين الافتراضي
sudo rm -f /etc/nginx/sites-enabled/default

# اختبار تكوين Nginx
echo "🧪 اختبار تكوين Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ تكوين Nginx صحيح"
    sudo systemctl reload nginx
else
    echo "❌ خطأ في تكوين Nginx"
    exit 1
fi

echo ""
echo "✅ تم رفع المشروع بنجاح!"
echo "✅ Project deployed successfully!"
echo ""
echo "📋 معلومات المشروع:"
echo "📋 Project Information:"
echo "📁 مجلد المشروع: $PROJECT_DIR"
echo "🌐 الدومين: $DOMAIN"
echo "📂 ملفات الإنتاج: $PROJECT_DIR/dist"
echo ""
echo "🔄 الخطوة التالية: إعداد SSL"
echo "🔄 Next step: Setup SSL certificate"
