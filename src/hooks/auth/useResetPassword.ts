
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useResetPassword = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // Get tokens from URL hash (Supabase sends tokens in URL fragment)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = searchParams;

      // Try to get tokens from hash first, then from query params
      const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
      const type = hashParams.get('type') || queryParams.get('type');
      const langParam = queryParams.get('lang');

      console.log('Reset Password - URL params:', {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        type,
        langParam,
        fullUrl: window.location.href,
        hash: window.location.hash,
        search: window.location.search
      });
      
      if (type === 'recovery' && accessToken && refreshToken) {
        try {
          console.log('Setting session with tokens...');

          // Set the session with the tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Session error:', error);

            // Check if it's a token expiry issue
            if (error.message?.includes('expired') || error.message?.includes('invalid')) {
              toast({
                title: currentLanguage === 'ar' ? 'انتهت صلاحية الرابط' : currentLanguage === 'tr' ? 'Bağlantı Süresi Doldu' : 'Link Expired',
                description: currentLanguage === 'ar' ? 'انتهت صلاحية رابط إعادة التعيين. يرجى طلب رابط جديد.' :
                            currentLanguage === 'tr' ? 'Sıfırlama bağlantısının süresi doldu. Lütfen yeni bir bağlantı isteyin.' : 'Reset link has expired. Please request a new one.',
                variant: 'destructive'
              });
            } else {
              toast({
                title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
                description: currentLanguage === 'ar' ? 'رابط إعادة التعيين غير صالح' :
                            currentLanguage === 'tr' ? 'Geçersiz sıfırlama bağlantısı' : 'Invalid reset link',
                variant: 'destructive'
              });
            }

            setTimeout(() => navigate('/forgot-password'), 3000);
          } else {
            console.log('Session set successfully:', data);

            // Verify the session is actually valid
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user.user) {
              console.error('User verification failed:', userError);
              toast({
                title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
                description: currentLanguage === 'ar' ? 'فشل في التحقق من الجلسة' :
                            currentLanguage === 'tr' ? 'Oturum doğrulaması başarısız' : 'Session verification failed',
                variant: 'destructive'
              });
              setTimeout(() => navigate('/forgot-password'), 3000);
            } else {
              console.log('User verified successfully:', user.user.email);
              setIsValidSession(true);

              // Clear the URL hash to clean up the interface
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }
          }
        } catch (error) {
          console.error('Error setting session:', error);
          toast({
            title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
            description: currentLanguage === 'ar' ? 'حدث خطأ في معالجة الرابط' :
                        currentLanguage === 'tr' ? 'Bağlantı işlenirken hata oluştu' : 'Error processing the link',
            variant: 'destructive'
          });
          setTimeout(() => navigate('/forgot-password'), 3000);
        }
      } else {
        console.log('Reset Password - Missing or invalid URL parameters:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type,
          expectedType: 'recovery'
        });

        // Check if user is already authenticated (maybe they're already logged in)
        const { data: currentUser } = await supabase.auth.getUser();
        if (currentUser.user) {
          console.log('User is already authenticated, allowing password reset');
          setIsValidSession(true);
          return;
        }

        toast({
          title: currentLanguage === 'ar' ? 'رابط غير صالح' : currentLanguage === 'tr' ? 'Geçersiz Bağlantı' : 'Invalid Link',
          description: currentLanguage === 'ar' ? 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.' :
                      currentLanguage === 'tr' ? 'Sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı isteyin.' : 'Reset link is invalid or expired. Please request a new one.',
          variant: 'destructive'
        });

        // Add a longer delay to ensure user reads the message
        setTimeout(() => {
          navigate('/forgot-password');
        }, 4000);
      }
    };

    checkSession();
  }, [searchParams, navigate, toast, currentLanguage]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidSession) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'جلسة غير صالحة' : 
                    currentLanguage === 'tr' ? 'Geçersiz oturum' : 'Invalid session',
        variant: 'destructive'
      });
      return;
    }
    
    if (!password || !confirmPassword) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى ملء جميع الحقول' : 
                    currentLanguage === 'tr' ? 'Lütfen tüm alanları doldurun' : 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'كلمات المرور غير متطابقة' : 
                    currentLanguage === 'tr' ? 'Şifreler eşleşmiyor' : 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' :
                    currentLanguage === 'tr' ? 'Şifre en az 8 karakter olmalıdır' : 'Password must be at least 8 characters',
        variant: 'destructive'
      });
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام' :
                    currentLanguage === 'tr' ? 'Şifre büyük harf, küçük harf ve rakam içermelidir' : 'Password must contain uppercase, lowercase letters and numbers',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Update password error:', error);
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
          description: currentLanguage === 'ar' ? 'حدث خطأ أثناء إعادة تعيين كلمة المرور' : 
                      currentLanguage === 'tr' ? 'Şifre sıfırlanırken hata oluştu' : 'Error resetting password',
          variant: 'destructive'
        });
      } else {
        toast({
          title: currentLanguage === 'ar' ? 'تم بنجاح' : currentLanguage === 'tr' ? 'Başarılı' : 'Success',
          description: currentLanguage === 'ar' ? 'تم إعادة تعيين كلمة المرور بنجاح' : 
                      currentLanguage === 'tr' ? 'Şifre başarıyla sıfırlandı' : 'Password reset successfully'
        });
        // Navigate to login page after successful reset
        navigate('/login');
      }
    } catch (error) {
      console.error('Reset password error:', error);
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
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    isValidSession,
    handleResetPassword
  };
};
