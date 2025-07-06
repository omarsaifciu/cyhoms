
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogin } from "@/hooks/auth/useLogin";
import { EmailUsernameField } from "./form-fields/EmailUsernameField";
import { PasswordField } from "./form-fields/PasswordField";
import { RememberMeField } from "./form-fields/RememberMeField";
import { ForgotPasswordLink } from "./form-fields/ForgotPasswordLink";

const LoginForm = () => {
  const { currentLanguage } = useLanguage();
  const {
    formData,
    setFormData,
    loading,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    handleSubmit
  } = useLogin();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmailUsernameField
        value={formData.emailOrUsername}
        onChange={(value) => setFormData(prev => ({ ...prev, emailOrUsername: value }))}
      />
      
      <PasswordField
        value={formData.password}
        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      {/* Remember me and Forgot Password on the same level */}
      <div className="flex items-center justify-between">
        <RememberMeField
          checked={rememberMe}
          onChange={setRememberMe}
        />
        <ForgotPasswordLink />
      </div>
      
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
        {currentLanguage === 'ar' ? 'تسجيل الدخول' : 
         currentLanguage === 'tr' ? 'Giriş Yap' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;
