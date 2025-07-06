
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const ForgotPasswordLink = () => {
  const { currentLanguage } = useLanguage();

  return (
    <Link 
      to="/forgot-password" 
      className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
      style={{
        color: 'var(--brand-gradient-from-color, #ec489a)'
      }}
    >
      {currentLanguage === 'ar' ? 'نسيت كلمة المرور؟' : 
       currentLanguage === 'tr' ? 'Şifremi Unuttum?' : 'Forgot Password?'}
    </Link>
  );
};
