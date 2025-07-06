
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

export const useLogin = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: '',
    password: ''
  });

  // تحميل البيانات المحفوظة عند تحميل المكون
  useState(() => {
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      const { emailOrUsername, password, rememberMe: savedRememberMe } = JSON.parse(savedCredentials);
      setFormData({ emailOrUsername, password });
      setRememberMe(savedRememberMe);
    }
  });

  const getEmailFromUsername = async (username: string): Promise<string | null> => {
    try {
      // Use the database function to get email by username (case-insensitive)
      const { data, error } = await supabase.rpc('get_user_email_by_username', {
        username_input: username // لا نحتاج لتحويل هنا لأن الدالة تتعامل مع الحالة
      });

      if (error) {
        console.error('RPC error:', error);
        return null;
      }

      // Convert the data to string if it exists
      return data ? String(data) : null;
    } catch (error) {
      console.error('Error getting email from username:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.emailOrUsername || !formData.password) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى ملء جميع الحقول' : 
                    currentLanguage === 'tr' ? 'Lütfen tüm alanları doldurun' : 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      let emailToUse = formData.emailOrUsername.trim(); // فقط إزالة المسافات الإضافية
      
      // Check if the input is a username (doesn't contain @)
      if (!formData.emailOrUsername.includes('@')) {
        const email = await getEmailFromUsername(formData.emailOrUsername.trim());
        
        if (!email) {
          toast({
            title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
            description: currentLanguage === 'ar' ? 'اسم المستخدم غير موجود' : 
                        currentLanguage === 'tr' ? 'Kullanıcı adı bulunamadı' : 'Username not found',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }
        
        emailToUse = email; // استخدام الإيميل كما هو مُخزن في قاعدة البيانات
      } else {
        // إذا كان إيميل، تحويل إلى أحرف صغيرة لأن Supabase Auth يخزن الإيميلات بأحرف صغيرة
        emailToUse = emailToUse.toLowerCase();
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: formData.password
      });

      if (error) {
        let errorMessage = currentLanguage === 'ar' ? 'البريد الإلكتروني أو اسم المستخدم أو كلمة المرور غير صحيحة' : 
                          currentLanguage === 'tr' ? 'E-posta, kullanıcı adı veya şifre yanlış' : 'Invalid email, username or password';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = currentLanguage === 'ar' ? 'بيانات تسجيل الدخول غير صحيحة' : 
                        currentLanguage === 'tr' ? 'Giriş bilgileri yanlış' : 'Invalid login credentials';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = currentLanguage === 'ar' ? 'يرجى تأكيد بريدك الإلكتروني أولاً' : 
                        currentLanguage === 'tr' ? 'Lütfen önce e-postanızı onaylayın' : 'Please confirm your email first';
        }

        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      } else {
        // حفظ البيانات إذا تم تفعيل "تذكرني"
        if (rememberMe) {
          localStorage.setItem('rememberedCredentials', JSON.stringify({
            emailOrUsername: formData.emailOrUsername,
            password: formData.password,
            rememberMe: true
          }));
        } else {
          // حذف البيانات المحفوظة إذا لم يتم تفعيل "تذكرني"
          localStorage.removeItem('rememberedCredentials');
        }

        toast({
          title: currentLanguage === 'ar' ? 'نجح تسجيل الدخول' : currentLanguage === 'tr' ? 'Giriş başarılı' : 'Login successful',
          description: currentLanguage === 'ar' ? 'مرحباً بعودتك' : 
                      currentLanguage === 'tr' ? 'Tekrar hoş geldiniz' : 'Welcome back'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ غير متوقع' : 
                    currentLanguage === 'tr' ? 'Beklenmeyen bir hata oluştu' : 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    handleSubmit
  };
};
