#!/bin/bash

# سكريبت إعداد SSL باستخدام Let's Encrypt
# Script to setup SSL using Let's Encrypt

echo "🔒 بدء إعداد SSL..."
echo "🔒 Starting SSL setup..."

# متغيرات
DOMAIN="your-domain.com"  # استبدل بالدومين الخاص بك
EMAIL="your-email@example.com"  # استبدل بالإيميل الخاص بك

# التحقق من المتغيرات
if [ "$DOMAIN" = "your-domain.com" ] || [ "$EMAIL" = "your-email@example.com" ]; then
    echo "⚠️  يرجى تحديث المتغيرات في السكريبت أولاً"
    echo "⚠️  Please update variables in the script first"
    echo "DOMAIN=$DOMAIN"
    echo "EMAIL=$EMAIL"
    exit 1
fi

# تثبيت Certbot
echo "📦 تثبيت Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
echo "🔐 الحصول على شهادة SSL..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --redirect

# التحقق من نجاح التثبيت
if [ $? -eq 0 ]; then
    echo "✅ تم تثبيت SSL بنجاح!"
    
    # إعداد التجديد التلقائي
    echo "🔄 إعداد التجديد التلقائي..."
    sudo crontab -l | grep -q certbot || (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
    
    # اختبار التجديد
    sudo certbot renew --dry-run
    
    echo ""
    echo "✅ تم إعداد SSL بنجاح!"
    echo "✅ SSL setup completed successfully!"
    echo ""
    echo "🌐 يمكنك الآن الوصول للموقع عبر:"
    echo "🌐 You can now access your site at:"
    echo "https://$DOMAIN"
    echo "https://www.$DOMAIN"
    
else
    echo "❌ فشل في تثبيت SSL"
    echo "❌ SSL installation failed"
    echo ""
    echo "🔍 تحقق من:"
    echo "🔍 Please check:"
    echo "1. الدومين يشير إلى IP السيرفر"
    echo "1. Domain points to server IP"
    echo "2. البورت 80 و 443 مفتوحان"
    echo "2. Ports 80 and 443 are open"
    echo "3. Nginx يعمل بشكل صحيح"
    echo "3. Nginx is running correctly"
fi

# إعادة تشغيل Nginx
echo "🔄 إعادة تشغيل Nginx..."
sudo systemctl restart nginx

# عرض حالة الخدمات
echo ""
echo "📊 حالة الخدمات:"
echo "📊 Services Status:"
echo "Nginx: $(sudo systemctl is-active nginx)"
echo "Certbot Timer: $(sudo systemctl is-active certbot.timer)"
