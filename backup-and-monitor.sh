#!/bin/bash

# سكريبت النسخ الاحتياطي والمراقبة
# Backup and Monitoring Script

echo "💾 إعداد النسخ الاحتياطي والمراقبة..."
echo "💾 Setting up backup and monitoring..."

# متغيرات
PROJECT_DIR="/var/www/cyhoms"
BACKUP_DIR="/var/backups/cyhoms"
LOG_DIR="/var/log/cyhoms"

# إنشاء مجلدات النسخ الاحتياطي
echo "📁 إنشاء مجلدات النسخ الاحتياطي..."
sudo mkdir -p $BACKUP_DIR
sudo mkdir -p $LOG_DIR
sudo chown -R $USER:$USER $BACKUP_DIR
sudo chown -R $USER:$USER $LOG_DIR

# دالة النسخ الاحتياطي
create_backup() {
    local backup_type=$1
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/cyhoms_${backup_type}_${timestamp}.tar.gz"
    
    echo "💾 إنشاء نسخة احتياطية: $backup_type"
    
    case $backup_type in
        "full")
            tar -czf $backup_file -C /var/www cyhoms
            ;;
        "code")
            tar -czf $backup_file -C $PROJECT_DIR --exclude=node_modules --exclude=dist .
            ;;
        "config")
            tar -czf $backup_file /etc/nginx/sites-available/cyhoms $PROJECT_DIR/.env
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        echo "✅ تم إنشاء النسخة الاحتياطية: $backup_file"
        
        # حذف النسخ القديمة (أكثر من 7 أيام)
        find $BACKUP_DIR -name "cyhoms_${backup_type}_*.tar.gz" -mtime +7 -delete
    else
        echo "❌ فشل في إنشاء النسخة الاحتياطية"
    fi
}

# إنشاء سكريبت النسخ الاحتياطي اليومي
echo "📝 إنشاء سكريبت النسخ الاحتياطي اليومي..."
cat > /usr/local/bin/cyhoms-backup.sh << 'EOL'
#!/bin/bash
# سكريبت النسخ الاحتياطي اليومي لـ CyHoms

BACKUP_DIR="/var/backups/cyhoms"
PROJECT_DIR="/var/www/cyhoms"
LOG_FILE="/var/log/cyhoms/backup.log"

# دالة الكتابة في log
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

log_message "بدء النسخ الاحتياطي اليومي"

# نسخة احتياطية للكود
cd $PROJECT_DIR
if git status > /dev/null 2>&1; then
    git add . && git commit -m "Auto backup $(date '+%Y-%m-%d %H:%M:%S')" && git push
    log_message "تم رفع الكود إلى Git"
fi

# نسخة احتياطية محلية
timestamp=$(date +%Y%m%d_%H%M%S)
backup_file="$BACKUP_DIR/cyhoms_daily_${timestamp}.tar.gz"

tar -czf $backup_file -C /var/www cyhoms --exclude=node_modules
if [ $? -eq 0 ]; then
    log_message "تم إنشاء النسخة الاحتياطية: $backup_file"
else
    log_message "فشل في إنشاء النسخة الاحتياطية"
fi

# حذف النسخ القديمة
find $BACKUP_DIR -name "cyhoms_daily_*.tar.gz" -mtime +7 -delete
log_message "تم حذف النسخ القديمة"

log_message "انتهى النسخ الاحتياطي اليومي"
EOL

# جعل السكريبت قابل للتنفيذ
sudo chmod +x /usr/local/bin/cyhoms-backup.sh

# إضافة مهمة cron للنسخ الاحتياطي اليومي
echo "⏰ إعداد النسخ الاحتياطي التلقائي..."
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/cyhoms-backup.sh") | crontab -

# إنشاء سكريبت المراقبة
echo "📊 إنشاء سكريبت المراقبة..."
cat > /usr/local/bin/cyhoms-monitor.sh << 'EOL'
#!/bin/bash
# سكريبت مراقبة CyHoms

LOG_FILE="/var/log/cyhoms/monitor.log"
PROJECT_DIR="/var/www/cyhoms"

# دالة الكتابة في log
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# فحص حالة Nginx
if ! systemctl is-active --quiet nginx; then
    log_message "تحذير: Nginx متوقف - محاولة إعادة التشغيل"
    sudo systemctl restart nginx
    if systemctl is-active --quiet nginx; then
        log_message "تم إعادة تشغيل Nginx بنجاح"
    else
        log_message "خطأ: فشل في إعادة تشغيل Nginx"
    fi
fi

# فحص مساحة القرص
disk_usage=$(df /var/www | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 80 ]; then
    log_message "تحذير: مساحة القرص ممتلئة ${disk_usage}%"
fi

# فحص استخدام الذاكرة
memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $memory_usage -gt 80 ]; then
    log_message "تحذير: استخدام الذاكرة مرتفع ${memory_usage}%"
fi

# فحص حالة الموقع
response_code=$(curl -s -o /dev/null -w "%{http_code}" https://$(hostname -f) 2>/dev/null)
if [ "$response_code" != "200" ]; then
    log_message "تحذير: الموقع لا يستجيب - كود الاستجابة: $response_code"
fi

# فحص حجم ملفات log
nginx_error_size=$(stat -c%s /var/log/nginx/error.log 2>/dev/null || echo 0)
if [ $nginx_error_size -gt 10485760 ]; then  # 10MB
    log_message "تحذير: ملف nginx error.log كبير الحجم"
fi
EOL

# جعل سكريبت المراقبة قابل للتنفيذ
sudo chmod +x /usr/local/bin/cyhoms-monitor.sh

# إضافة مهمة cron للمراقبة كل 5 دقائق
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/cyhoms-monitor.sh") | crontab -

# إنشاء سكريبت تحديث المشروع
echo "🔄 إنشاء سكريبت التحديث..."
cat > /usr/local/bin/cyhoms-update.sh << 'EOL'
#!/bin/bash
# سكريبت تحديث CyHoms

PROJECT_DIR="/var/www/cyhoms"
LOG_FILE="/var/log/cyhoms/update.log"

# دالة الكتابة في log
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

log_message "بدء تحديث المشروع"

cd $PROJECT_DIR

# سحب آخر التحديثات
git pull origin main
if [ $? -eq 0 ]; then
    log_message "تم سحب التحديثات من Git"
else
    log_message "فشل في سحب التحديثات من Git"
    exit 1
fi

# تثبيت التبعيات الجديدة
npm install
if [ $? -eq 0 ]; then
    log_message "تم تثبيت التبعيات"
else
    log_message "فشل في تثبيت التبعيات"
    exit 1
fi

# بناء المشروع
npm run build
if [ $? -eq 0 ]; then
    log_message "تم بناء المشروع"
else
    log_message "فشل في بناء المشروع"
    exit 1
fi

# إعادة تحميل Nginx
sudo systemctl reload nginx
if [ $? -eq 0 ]; then
    log_message "تم إعادة تحميل Nginx"
else
    log_message "فشل في إعادة تحميل Nginx"
fi

log_message "انتهى تحديث المشروع بنجاح"
EOL

# جعل سكريبت التحديث قابل للتنفيذ
sudo chmod +x /usr/local/bin/cyhoms-update.sh

# إنشاء نسخة احتياطية أولية
echo "💾 إنشاء نسخة احتياطية أولية..."
create_backup "full"

echo ""
echo "✅ تم إعداد النسخ الاحتياطي والمراقبة بنجاح!"
echo "✅ Backup and monitoring setup completed successfully!"
echo ""
echo "📋 الأوامر المتاحة:"
echo "📋 Available Commands:"
echo "• النسخ الاحتياطي اليدوي: /usr/local/bin/cyhoms-backup.sh"
echo "• فحص النظام: /usr/local/bin/cyhoms-monitor.sh"
echo "• تحديث المشروع: /usr/local/bin/cyhoms-update.sh"
echo ""
echo "📊 ملفات المراقبة:"
echo "📊 Monitoring Files:"
echo "• سجل النسخ الاحتياطي: /var/log/cyhoms/backup.log"
echo "• سجل المراقبة: /var/log/cyhoms/monitor.log"
echo "• سجل التحديثات: /var/log/cyhoms/update.log"
echo ""
echo "⏰ المهام المجدولة:"
echo "⏰ Scheduled Tasks:"
echo "• نسخ احتياطي يومي: 2:00 صباحاً"
echo "• مراقبة النظام: كل 5 دقائق"
