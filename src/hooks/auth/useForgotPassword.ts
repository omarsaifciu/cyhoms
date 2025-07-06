
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useForgotPassword = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 
                    currentLanguage === 'tr' ? 'Lütfen e-postanızı girin' : 'Please enter your email',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password?lang=${currentLanguage}`;
      console.log('Forgot Password - Sending reset email with redirect URL:', redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
        captchaToken: undefined // Disable captcha for now
      });

      if (error) {
        console.error('Reset password error:', error);
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
          description: currentLanguage === 'ar' ? 'حدث خطأ أثناء إرسال رسالة إعادة التعيين. تأكد من صحة البريد الإلكتروني.' : 
                      currentLanguage === 'tr' ? 'Şifre sıfırlama e-postası gönderilirken hata oluştu. E-posta adresinizi kontrol edin.' : 'Error sending password reset email. Please check your email address.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: currentLanguage === 'ar' ? 'تم الإرسال بنجاح' : currentLanguage === 'tr' ? 'Başarıyla Gönderildi' : 'Email Sent',
          description: currentLanguage === 'ar' ? 'تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تحقق من صندوق الوارد والرسائل المهملة.' : 
                      currentLanguage === 'tr' ? 'Şifre sıfırlama e-postası gönderildi. Gelen kutusu ve spam klasörünü kontrol edin.' : 'Password reset email has been sent. Check your inbox and spam folder.'
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
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
    email,
    setEmail,
    loading,
    handleForgotPassword
  };
};
