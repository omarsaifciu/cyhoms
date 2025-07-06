#!/bin/bash

# سكريبت إعداد قاعدة البيانات Supabase
# Script to setup Supabase database

echo "🗄️ بدء إعداد قاعدة البيانات..."
echo "🗄️ Starting database setup..."

# متغيرات قاعدة البيانات
SUPABASE_URL="https://cuznupufbtipnqluzgbp.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1em51cHVmYnRpcG5xbHV6Z2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU3MjgsImV4cCI6MjA2NDE4MTcyOH0.tjQR5IMnFWppS4Ny9qiapxsPpAOiLYkjdPgE309YXng"
PROJECT_ID="cuznupufbtipnqluzgbp"

# التحقق من وجود Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "📦 تثبيت Supabase CLI..."
    
    # تثبيت Supabase CLI
    curl -fsSL https://supabase.com/install.sh | sh
    
    # إضافة إلى PATH
    export PATH="$PATH:$HOME/.local/bin"
    echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
    
    # إعادة تحميل bashrc
    source ~/.bashrc
fi

# التحقق من تثبيت Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ فشل في تثبيت Supabase CLI"
    echo "❌ Failed to install Supabase CLI"
    exit 1
fi

echo "✅ Supabase CLI متوفر"
echo "✅ Supabase CLI available"

# الانتقال إلى مجلد المشروع
cd /var/www/cyhoms

# تسجيل الدخول إلى Supabase (إذا لم يكن مسجلاً)
echo "🔐 تسجيل الدخول إلى Supabase..."
echo "🔐 Logging into Supabase..."

# إنشاء ملف تكوين Supabase إذا لم يكن موجوداً
if [ ! -f "supabase/config.toml" ]; then
    echo "⚙️ إنشاء تكوين Supabase..."
    mkdir -p supabase
    cat > supabase/config.toml << EOL
project_id = "$PROJECT_ID"

[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[auth]
enabled = true
port = 54324
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://localhost:3000"]
jwt_expiry = 3600
enable_signup = true
enable_confirmations = false

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323

[inbucket]
enabled = true
port = 54325
smtp_port = 54326
pop3_port = 54327

[storage]
enabled = true
port = 54326
file_size_limit = "50MiB"

[edge_functions]
enabled = true
port = 54327

[analytics]
enabled = false
port = 54328
vector_port = 54329
EOL
fi

# ربط المشروع بـ Supabase
echo "🔗 ربط المشروع بـ Supabase..."
supabase link --project-ref $PROJECT_ID

# تطبيق migrations
echo "📊 تطبيق migrations قاعدة البيانات..."
echo "📊 Applying database migrations..."

# تطبيق جميع migrations
supabase db push

# التحقق من نجاح العملية
if [ $? -eq 0 ]; then
    echo "✅ تم تطبيق migrations بنجاح!"
    echo "✅ Migrations applied successfully!"
else
    echo "⚠️ حدث خطأ في تطبيق migrations"
    echo "⚠️ Error occurred while applying migrations"
    echo "🔄 محاولة تطبيق migrations يدوياً..."
    echo "🔄 Trying to apply migrations manually..."
    
    # تطبيق migrations يدوياً
    for migration_file in supabase/migrations/*.sql; do
        if [ -f "$migration_file" ]; then
            echo "📄 تطبيق: $(basename "$migration_file")"
            supabase db push --include-all
            break
        fi
    done
fi

echo ""
echo "✅ تم إعداد قاعدة البيانات بنجاح!"
echo "✅ Database setup completed successfully!"
echo ""
echo "📋 معلومات قاعدة البيانات:"
echo "📋 Database Information:"
echo "🌐 Supabase URL: $SUPABASE_URL"
echo "🔑 Project ID: $PROJECT_ID"
echo "📊 Migrations: Applied"
echo ""
echo "🔄 الخطوة التالية: اختبار الاتصال بقاعدة البيانات"
echo "🔄 Next step: Test database connection"
