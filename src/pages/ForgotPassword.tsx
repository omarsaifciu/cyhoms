
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { House, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { currentLanguage } = useLanguage();
  const { email, setEmail, loading, handleForgotPassword } = useForgotPassword();
  const navigate = useNavigate();

  const getTitle = () => {
    return currentLanguage === 'ar' ? 'نسيت كلمة المرور؟' : 
           currentLanguage === 'tr' ? 'Şifremi Unuttum?' : 'Forgot Password?';
  };

  const getDescription = () => {
    return currentLanguage === 'ar' ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور' : 
           currentLanguage === 'tr' ? 'E-posta adresinizi girin, şifre sıfırlama bağlantısını göndereceğiz' : 
           'Enter your email address and we\'ll send you a password reset link';
  };

  const getBackText = () => {
    return currentLanguage === 'ar' ? 'رجوع' : 
           currentLanguage === 'tr' ? 'Geri' : 'Back';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 py-24 relative overflow-hidden transition-all duration-500"
      style={{
        background: `
          linear-gradient(135deg, 
            color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent), 
            color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 2%, transparent)
          ),
          linear-gradient(to bottom right, 
            #fafbff 0%, 
            #f1f5f9 50%, 
            #e2e8f0 100%
          )
        `,
        // Dark mode background
        ...(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') && {
          background: `
            linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent), 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent)
            ),
            linear-gradient(to bottom right, 
              #0f172a 0%, 
              #1e293b 50%, 
              #334155 100%
            )
          `
        })
      }}
    >
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient overlays */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent) 0%, 
              transparent 50%, 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent) 100%
            )`
          }}
        />
        
        {/* Floating orbs */}
        <div 
          className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-10 dark:opacity-15"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 8%, transparent), 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent)
            )`
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 opacity-8 dark:opacity-12"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 6%, transparent), 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent)
            )`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full blur-2xl animate-pulse delay-500 opacity-8 dark:opacity-12"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 6%, transparent), 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 5%, transparent)
            )`
          }}
        />
        
        {/* Floating house icons with hero animations */}
        <div className="absolute top-20 left-20 hero-float hero-delay-100 pointer-events-none">
          <House className="w-8 h-8 text-brand-accent dark:text-brand-accent-foreground opacity-60" />
        </div>
        <div className="absolute bottom-32 left-32 hero-bounce-subtle hero-delay-500 pointer-events-none">
          <House className="w-6 h-6 text-brand-accent dark:text-brand-accent-foreground opacity-50" />
        </div>
        <div className="absolute top-40 right-40 hero-pulse-soft hero-delay-300 pointer-events-none">
          <House className="w-10 h-10 text-brand-accent dark:text-brand-accent-foreground opacity-45" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 hero-twinkle hero-delay-700 pointer-events-none">
          <House className="w-7 h-7 text-brand-accent dark:text-brand-accent-foreground opacity-55" />
        </div>
        <div className="absolute top-1/3 left-1/6 hero-drift hero-delay-1000 pointer-events-none">
          <House className="w-5 h-5 text-brand-accent dark:text-brand-accent-foreground opacity-40" />
        </div>
        <div className="absolute top-1/4 right-1/3 hero-float hero-delay-200 pointer-events-none">
          <House className="w-6 h-6 text-brand-accent dark:text-brand-accent-foreground opacity-35" />
        </div>
        <div className="absolute bottom-40 left-1/5 hero-bounce-subtle hero-delay-800 pointer-events-none">
          <House className="w-8 h-8 text-brand-accent dark:text-brand-accent-foreground opacity-50" />
        </div>
        
        {/* Subtle floating particles */}
        <div 
          className="absolute top-32 right-1/4 w-3 h-3 rounded-full animate-bounce opacity-20 dark:opacity-30"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 25%, transparent)' }}
        />
        <div 
          className="absolute bottom-40 left-1/3 w-2 h-2 rounded-full animate-bounce delay-300 opacity-15 dark:opacity-25"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 20%, transparent)' }}
        />
        <div 
          className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full animate-ping delay-700 opacity-25 dark:opacity-35"
          style={{ background: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 30%, transparent)' }}
        />
        
        {/* Additional atmospheric elements */}
        <div 
          className="absolute top-10 right-10 w-32 h-32 rounded-full blur-2xl animate-pulse delay-200 opacity-5 dark:opacity-8"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 5%, transparent), 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent)
            )`
          }}
        />
        <div 
          className="absolute bottom-32 left-10 w-40 h-40 rounded-full blur-3xl animate-pulse delay-800 opacity-4 dark:opacity-6"
          style={{
            background: `linear-gradient(135deg, 
              color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 4%, transparent), 
              color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 3%, transparent)
            )`
          }}
        />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border-white/30 dark:border-slate-600/50 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 px-4 py-2 rounded-full shadow-sm hover:shadow-lg backdrop-blur-sm flex items-center gap-2 transition-all duration-300"
          >
            {currentLanguage === 'ar' ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{getBackText()}</span>
          </Button>
        </div>
        
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="text-center pt-12 pb-8">
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-blue-500/10 dark:ring-blue-400/20"
              style={{
                background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
              }}
            >
              <House className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-12">
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currentLanguage === 'ar' ? 'البريد الإلكتروني' : 
                   currentLanguage === 'tr' ? 'E-posta' : 'Email'}
                </Label>
                <div className="relative">
                  <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-10 5L2 7"/>
                  </svg>
                  <Input
                    id="email"
                    type="email"
                    placeholder={currentLanguage === 'ar' ? 'أدخل بريدك الإلكتروني' : 
                                currentLanguage === 'tr' ? 'E-postanızı girin' : 'Enter your email'}
                    className="pl-12 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:brightness-95" 
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
                }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                {currentLanguage === 'ar' ? 'إرسال رابط الإعادة' : 
                 currentLanguage === 'tr' ? 'Sıfırlama Bağlantısı Gönder' : 'Send Reset Link'}
              </Button>

              <div className="text-center pt-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm transition-colors duration-300 group hover:opacity-80"
                  style={{
                    color: 'var(--brand-gradient-from-color, #ec489a)'
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                  {currentLanguage === 'ar' ? 'العودة لتسجيل الدخول' : 
                   currentLanguage === 'tr' ? 'Giriş sayfasına dön' : 'Back to Login'}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
