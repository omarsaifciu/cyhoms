#!/bin/bash

# سكريبت إنشاء مستودع Git ورفع المشروع
# Script to create Git repository and upload project

echo "📦 إنشاء مستودع Git للمشروع..."
echo "📦 Creating Git repository for the project..."

# متغيرات
PROJECT_NAME="cyhoms"
GITHUB_USERNAME="your-github-username"  # استبدل باسم المستخدم الخاص بك
REPO_NAME="cyhoms-real-estate"

echo "⚠️  تأكد من تحديث GITHUB_USERNAME في السكريبت"
echo "⚠️  Make sure to update GITHUB_USERNAME in the script"

# التحقق من وجود Git
if ! command -v git &> /dev/null; then
    echo "❌ Git غير مثبت"
    echo "❌ Git is not installed"
    exit 1
fi

# إنشاء مستودع Git محلي
echo "🔧 إعداد Git repository..."
git init

# إضافة ملف .gitignore
echo "📝 إنشاء .gitignore..."
cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Supabase
.temp/
supabase/.temp/

# Local development
.local/
EOL

# إضافة جميع الملفات
echo "📁 إضافة الملفات إلى Git..."
git add .

# إنشاء commit أولي
echo "💾 إنشاء commit أولي..."
git commit -m "Initial commit: CyHoms Real Estate Platform

- React + TypeScript + Vite setup
- Supabase integration for database
- Firebase integration for notifications
- Multi-language support (Arabic, English, Turkish)
- Real estate property management system
- User authentication and authorization
- Admin dashboard and management
- Responsive design with Tailwind CSS"

# إعداد branch رئيسي
git branch -M main

echo ""
echo "✅ تم إنشاء Git repository بنجاح!"
echo "✅ Git repository created successfully!"
echo ""
echo "📋 الخطوات التالية:"
echo "📋 Next steps:"
echo ""
echo "1. إنشاء repository على GitHub:"
echo "   - اذهب إلى https://github.com/new"
echo "   - اسم المستودع: $REPO_NAME"
echo "   - اجعله private أو public حسب الحاجة"
echo ""
echo "2. ربط المستودع المحلي بـ GitHub:"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""
echo "3. رفع الكود إلى GitHub:"
echo "   git push -u origin main"
echo ""
echo "4. أو استخدم SSH (إذا كان معداً):"
echo "   git remote add origin git@github.com:$GITHUB_USERNAME/$REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "🔐 لإعداد SSH key (اختياري):"
echo "   ssh-keygen -t ed25519 -C \"your-email@example.com\""
echo "   cat ~/.ssh/id_ed25519.pub"
echo "   # انسخ المفتاح وأضفه في GitHub Settings > SSH Keys"
echo ""
echo "📝 ملاحظة: تأكد من تحديث GITHUB_USERNAME في السكريبت"
echo "📝 Note: Make sure to update GITHUB_USERNAME in the script"
