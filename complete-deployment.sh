#!/bin/bash

# سكريبت النشر الشامل - Complete Deployment Script
# يقوم بتنفيذ جميع خطوات النشر تلقائياً

echo "🚀 بدء النشر الشامل لمشروع CyHoms..."
echo "🚀 Starting complete deployment of CyHoms project..."

# متغيرات المشروع
DOMAIN="your-domain.com"  # استبدل بالدومين الخاص بك
EMAIL="your-email@example.com"  # استبدل بالإيميل الخاص بك
GITHUB_USERNAME="your-github-username"  # استبدل باسم المستخدم
REPO_NAME="cyhoms-real-estate"

# التحقق من المتغيرات
if [ "$DOMAIN" = "your-domain.com" ] || [ "$EMAIL" = "your-email@example.com" ] || [ "$GITHUB_USERNAME" = "your-github-username" ]; then
    echo "⚠️  يرجى تحديث المتغيرات في السكريبت أولاً"
    echo "⚠️  Please update variables in the script first"
    echo "DOMAIN=$DOMAIN"
    echo "EMAIL=$EMAIL"
    echo "GITHUB_USERNAME=$GITHUB_USERNAME"
    exit 1
fi

# مصفوفة الخطوات
declare -a STEPS=(
    "إعداد البيئة الأساسية"
    "إنشاء مستودع Git"
    "رفع المشروع"
    "إعداد قاعدة البيانات"
    "تكوين خادم الويب"
    "إعداد SSL"
    "اختبار المشروع"
)

# دالة عرض التقدم
show_progress() {
    local step=$1
    local total=${#STEPS[@]}
    echo ""
    echo "📊 التقدم: $step/$total - ${STEPS[$((step-1))]}"
    echo "📊 Progress: $step/$total - ${STEPS[$((step-1))]}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# دالة التحقق من نجاح الخطوة
check_step() {
    if [ $? -eq 0 ]; then
        echo "✅ نجحت الخطوة: $1"
        echo "✅ Step completed: $1"
    else
        echo "❌ فشلت الخطوة: $1"
        echo "❌ Step failed: $1"
        echo "🛑 توقف النشر"
        echo "🛑 Deployment stopped"
        exit 1
    fi
}

# الخطوة 1: إعداد البيئة الأساسية
show_progress 1
echo "🔧 تشغيل إعداد البيئة..."
chmod +x deploy-setup.sh
./deploy-setup.sh
check_step "إعداد البيئة الأساسية"

# الخطوة 2: إنشاء مستودع Git
show_progress 2
echo "📦 إنشاء مستودع Git..."
chmod +x create-git-repo.sh

# تحديث متغيرات Git script
sed -i "s/your-github-username/$GITHUB_USERNAME/g" create-git-repo.sh

./create-git-repo.sh
check_step "إنشاء مستودع Git"

# طلب من المستخدم إنشاء repository على GitHub
echo ""
echo "⏸️  توقف مؤقت - Manual Step Required"
echo "⏸️  Temporary pause - Manual Step Required"
echo ""
echo "🔗 يرجى إنشاء repository على GitHub الآن:"
echo "🔗 Please create a repository on GitHub now:"
echo "   1. اذهب إلى: https://github.com/new"
echo "   2. اسم المستودع: $REPO_NAME"
echo "   3. اجعله private أو public"
echo "   4. لا تضف README أو .gitignore أو license"
echo ""
read -p "اضغط Enter بعد إنشاء المستودع... / Press Enter after creating repository..." -r

# ربط وإرسال إلى GitHub
echo "🔗 ربط المستودع بـ GitHub..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
git push -u origin main
check_step "رفع الكود إلى GitHub"

# الخطوة 3: رفع المشروع
show_progress 3
echo "📤 رفع المشروع..."
chmod +x deploy-project.sh

# تحديث متغيرات deploy script
sed -i "s/your-domain.com/$DOMAIN/g" deploy-project.sh
sed -i "s|https://github.com/your-username/your-repo.git|https://github.com/$GITHUB_USERNAME/$REPO_NAME.git|g" deploy-project.sh

./deploy-project.sh
check_step "رفع المشروع"

# الخطوة 4: إعداد قاعدة البيانات
show_progress 4
echo "🗄️ إعداد قاعدة البيانات..."
chmod +x setup-database.sh
./setup-database.sh
check_step "إعداد قاعدة البيانات"

# الخطوة 5: تكوين خادم الويب
show_progress 5
echo "🌐 تكوين Nginx..."
# تم تكوين Nginx في deploy-project.sh
echo "✅ تم تكوين Nginx مسبقاً"
check_step "تكوين خادم الويب"

# الخطوة 6: إعداد SSL
show_progress 6
echo "🔒 إعداد SSL..."
chmod +x setup-ssl.sh

# تحديث متغيرات SSL script
sed -i "s/your-domain.com/$DOMAIN/g" setup-ssl.sh
sed -i "s/your-email@example.com/$EMAIL/g" setup-ssl.sh

./setup-ssl.sh
check_step "إعداد SSL"

# الخطوة 7: اختبار المشروع
show_progress 7
echo "🧪 اختبار المشروع..."

# اختبار HTTP
echo "🔍 اختبار HTTP..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "✅ HTTP redirect يعمل بشكل صحيح"
else
    echo "⚠️ HTTP Status: $HTTP_STATUS"
fi

# اختبار HTTPS
echo "🔍 اختبار HTTPS..."
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "$HTTPS_STATUS" = "200" ]; then
    echo "✅ HTTPS يعمل بشكل صحيح"
else
    echo "⚠️ HTTPS Status: $HTTPS_STATUS"
fi

# اختبار Nginx
echo "🔍 اختبار Nginx..."
nginx -t
check_step "اختبار المشروع"

echo ""
echo "🎉 تم النشر بنجاح!"
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 ملخص النشر:"
echo "📋 Deployment Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 الموقع: https://$DOMAIN"
echo "🗄️ قاعدة البيانات: Supabase (cuznupufbtipnqluzgbp)"
echo "📦 المستودع: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "🔒 SSL: Let's Encrypt"
echo "⚙️ خادم الويب: Nginx"
echo "🚀 حالة المشروع: نشط ويعمل"
echo ""
echo "📝 ملاحظات مهمة:"
echo "📝 Important Notes:"
echo "• تأكد من أن DNS يشير إلى IP السيرفر"
echo "• راجع logs في حالة وجود مشاكل: /var/log/nginx/"
echo "• لتحديث المشروع: cd /var/www/cyhoms && git pull && npm run build"
echo "• مراقبة الموارد: htop, df -h, free -h"
echo ""
echo "🔧 أوامر مفيدة:"
echo "• إعادة تشغيل Nginx: sudo systemctl restart nginx"
echo "• مراجعة logs: sudo tail -f /var/log/nginx/error.log"
echo "• تجديد SSL: sudo certbot renew"
