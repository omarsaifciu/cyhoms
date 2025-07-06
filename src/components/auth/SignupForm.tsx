
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTermsManagement } from "@/hooks/useTermsManagement";
import { useSignupValidation, FormData } from "@/hooks/useSignupValidation";
import SignupFormFields from "./SignupFormFields";
import TermsDialog from "./TermsDialog";

interface SignupFormProps {
  onSuccess?: () => void; // Made optional
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { fetchActiveTerms } = useTermsManagement();
  const { errors, validateForm, clearFieldError } = useSignupValidation();
  
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const [termsTitle, setTermsTitle] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsappNumber: '',
    userType: 'client'
  });

  // Load active terms on component mount
  useEffect(() => {
    const loadTerms = async () => {
      const activeTerms = await fetchActiveTerms();
      if (activeTerms) {
        let content = '';
        let title = '';
        
        if (currentLanguage === 'ar') {
          content = activeTerms.content_ar || activeTerms.content_en || 'لا توجد سياسة خصوصية أو أحكام وشروط متاحة حالياً.';
          title = activeTerms.title_ar || activeTerms.title_en || 'سياسة الخصوصية والأحكام والشروط';
        } else if (currentLanguage === 'tr') {
          content = activeTerms.content_tr || activeTerms.content_en || 'Şu anda kullanılabilir gizlilik politikası veya şartlar yok.';
          title = activeTerms.title_tr || activeTerms.title_en || 'Gizlilik Politikası ve Şartlar';
        } else {
          content = activeTerms.content_en || activeTerms.content_ar || 'No privacy policy or terms and conditions are currently available.';
          title = activeTerms.title_en || activeTerms.title_ar || 'Privacy Policy & Terms and Conditions';
        }
        
        setTermsContent(content);
        setTermsTitle(title);
      } else {
        // Default content when no terms are available
        if (currentLanguage === 'ar') {
          setTermsContent('لا توجد سياسة خصوصية أو أحكام وشروط متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.');
          setTermsTitle('سياسة الخصوصية والأحكام والشروط');
        } else if (currentLanguage === 'tr') {
          setTermsContent('Şu anda kullanılabilir gizlilik politikası veya şartlar yok. Lütfen daha sonra tekrar deneyin.');
          setTermsTitle('Gizlilik Politikası ve Şartlar');
        } else {
          setTermsContent('No privacy policy or terms and conditions are currently available. Please try again later.');
          setTermsTitle('Privacy Policy & Terms and Conditions');
        }
      }
    };

    loadTerms();
  }, [currentLanguage, fetchActiveTerms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = await validateForm(formData, acceptTerms);
    
    if (!isValid) {
      setLoading(false);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
        description: currentLanguage === 'ar' ? 'يرجى تصحيح الأخطاء أدناه' : 
                    currentLanguage === 'tr' ? 'Lütfen aşağıdaki hataları düzeltin' : 'Please correct the errors below',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
            phone: formData.phone,
            whatsapp_number: formData.whatsappNumber,
            user_type: formData.userType
          }
        }
      });

      if (error) {
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : currentLanguage === 'tr' ? 'Hata' : 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: currentLanguage === 'ar' ? 'نجح التسجيل' : currentLanguage === 'tr' ? 'Kayıt başarılı' : 'Registration successful',
          description: currentLanguage === 'ar' ? 'تم إنشاء حسابك بنجاح' : 
                      currentLanguage === 'tr' ? 'Hesabınız başarıyla oluşturuldu' : 'Your account has been created successfully'
        });
        onSuccess?.(); // Call onSuccess if provided
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTermsDialog(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field as keyof typeof errors);
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    if (checked) {
      clearFieldError('terms');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SignupFormFields
          formData={formData}
          errors={errors}
          acceptTerms={acceptTerms}
          onInputChange={handleInputChange}
          onTermsChange={handleTermsChange}
          onTermsClick={handleTermsClick}
        />
        
        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:brightness-95"
          style={{
            background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          {currentLanguage === 'ar' ? 'إنشاء حساب' : 
           currentLanguage === 'tr' ? 'Kayıt Ol' : 'Sign Up'}
        </Button>
      </form>

      <TermsDialog 
        open={showTermsDialog} 
        onOpenChange={setShowTermsDialog}
        termsContent={termsContent}
        termsTitle={termsTitle}
      />
    </>
  );
};

export default SignupForm;
