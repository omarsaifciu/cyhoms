#!/bin/bash

# سكريبت إعداد البيئة لرفع مشروع React على Hostinger VPS
# Script to setup environment for deploying React project on Hostinger VPS

echo "🚀 بدء إعداد البيئة على السيرفر..."
echo "🚀 Starting server environment setup..."

# تحديث النظام
echo "📦 تحديث النظام..."
sudo apt update && sudo apt upgrade -y

# تثبيت الأدوات الأساسية
echo "🔧 تثبيت الأدوات الأساسية..."
sudo apt install -y curl wget git unzip software-properties-common

# تثبيت Node.js 18 LTS
echo "📦 تثبيت Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# التحقق من تثبيت Node.js
echo "✅ التحقق من Node.js..."
node --version
npm --version

# تثبيت PM2
echo "📦 تثبيت PM2..."
sudo npm install -g pm2

# تثبيت Nginx
echo "📦 تثبيت Nginx..."
sudo apt install -y nginx

# بدء تشغيل Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# إنشاء مجلد المشروع
echo "📁 إنشاء مجلد المشروع..."
sudo mkdir -p /var/www/cyhoms
sudo chown -R $USER:$USER /var/www/cyhoms
sudo chmod -R 755 /var/www/cyhoms

# إنشاء مجلد للـ logs
sudo mkdir -p /var/log/cyhoms
sudo chown -R $USER:$USER /var/log/cyhoms

# تكوين Firewall
echo "🔒 تكوين Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ تم إعداد البيئة بنجاح!"
echo "✅ Environment setup completed successfully!"

echo ""
echo "📋 معلومات النظام:"
echo "📋 System Information:"
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo ""
echo "📁 مجلد المشروع: /var/www/cyhoms"
echo "📁 Project directory: /var/www/cyhoms"
echo ""
echo "🔄 الخطوة التالية: رفع ملفات المشروع"
echo "🔄 Next step: Upload project files"
