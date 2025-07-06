import { supabase } from "@/integrations/supabase/client";

export const testAuth = async () => {
  console.log('🔍 بدء اختبار المصادقة...');
  
  try {
    // 1. اختبار الاتصال بـ Supabase
    console.log('1️⃣ اختبار الاتصال بـ Supabase...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ فشل الاتصال بـ Supabase:', connectionError);
      return { success: false, error: 'Connection failed' };
    }
    console.log('✅ الاتصال بـ Supabase يعمل');

    // 2. اختبار جلب المستخدمين
    console.log('2️⃣ اختبار جلب المستخدمين...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, user_type, is_approved')
      .limit(5);
    
    if (usersError) {
      console.error('❌ فشل جلب المستخدمين:', usersError);
    } else {
      console.log('✅ المستخدمون المتاحون:', users);
    }

    // 3. اختبار الجلسة الحالية
    console.log('3️⃣ اختبار الجلسة الحالية...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ فشل جلب الجلسة:', sessionError);
    } else {
      console.log('✅ الجلسة الحالية:', session?.session?.user?.email || 'لا توجد جلسة');
    }

    // 4. اختبار المستخدم الحالي
    console.log('4️⃣ اختبار المستخدم الحالي...');
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ فشل جلب المستخدم:', userError);
    } else {
      console.log('✅ المستخدم الحالي:', user?.user?.email || 'لا يوجد مستخدم');
    }

    return { 
      success: true, 
      data: { 
        connection: true, 
        users: users?.length || 0,
        currentSession: !!session?.session,
        currentUser: !!user?.user
      } 
    };

  } catch (error) {
    console.error('❌ خطأ في اختبار المصادقة:', error);
    return { success: false, error };
  }
};

export const testLogin = async (email: string, password: string) => {
  console.log('🔐 اختبار تسجيل الدخول...');
  console.log('📧 البريد الإلكتروني:', email);
  
  try {
    // محاولة تسجيل الدخول
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    console.log('📊 نتيجة تسجيل الدخول:');
    console.log('- النجاح:', !error);
    console.log('- المستخدم:', data?.user?.email);
    console.log('- الخطأ:', error?.message);
    console.log('- كود الخطأ:', error?.status);

    if (error) {
      // تحليل مفصل للخطأ
      console.log('🔍 تحليل الخطأ:');
      console.log('- الرسالة:', error.message);
      console.log('- الحالة:', error.status);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('❌ بيانات الاعتماد غير صحيحة');
        console.log('💡 تحقق من:');
        console.log('  - صحة البريد الإلكتروني');
        console.log('  - صحة كلمة المرور');
        console.log('  - تأكيد البريد الإلكتروني');
      }
    } else {
      console.log('✅ تم تسجيل الدخول بنجاح!');
    }

    return { data, error };

  } catch (error) {
    console.error('❌ خطأ في اختبار تسجيل الدخول:', error);
    return { data: null, error };
  }
};

export const checkUserInDatabase = async (email: string) => {
  console.log('👤 البحث عن المستخدم في قاعدة البيانات...');
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ خطأ في البحث:', error);
      return { found: false, error };
    }

    if (data) {
      console.log('✅ المستخدم موجود في قاعدة البيانات:');
      console.log('- الاسم:', data.full_name);
      console.log('- النوع:', data.user_type);
      console.log('- معتمد:', data.is_approved);
      console.log('- تاريخ الإنشاء:', data.created_at);
      return { found: true, user: data };
    } else {
      console.log('❌ المستخدم غير موجود في قاعدة البيانات');
      return { found: false };
    }

  } catch (error) {
    console.error('❌ خطأ في البحث عن المستخدم:', error);
    return { found: false, error };
  }
};
