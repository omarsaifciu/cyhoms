
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { House, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import ResetPasswordDebug from "@/components/debug/ResetPasswordDebug";

const ResetPassword = () => {
  const { currentLanguage } = useLanguage();
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    isValidSession,
    handleResetPassword
  } = useResetPassword();

  const getTitle = () => {
    return currentLanguage === 'ar' ? 'إعادة تعيين كلمة المرور' : 
           currentLanguage === 'tr' ? 'Şifre Sıfırla' : 'Reset Password';
  };

  const getDescription = () => {
    return currentLanguage === 'ar' ? 'أدخل كلمة المرور الجديدة الخاصة بك' :
           currentLanguage === 'tr' ? 'Yeni şifrenizi girin' :
           'Enter your new password';
  };

  // Show debug info only when explicitly requested
  const showDebug = window.location.search.includes('debug=true');

  if (!isValidSession) {
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

          {/* Floating house icons */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-16 animate-float opacity-15 dark:opacity-25">
              <House className="w-8 h-8" style={{ color: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 40%, transparent)' }} />
            </div>
            <div className="absolute bottom-24 right-32 animate-float-delayed opacity-12 dark:opacity-20">
              <House className="w-6 h-6" style={{ color: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 35%, transparent)' }} />
            </div>
          </div>
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <Card className="backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 border border-white/40 dark:border-slate-700/60 shadow-xl rounded-3xl transition-all duration-300">
            <CardContent className="px-8 py-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--brand-gradient-from-color, #ec489a)' }} />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {currentLanguage === 'ar' ? 'جاري التحقق من الرابط...' : 
                 currentLanguage === 'tr' ? 'Bağlantı doğrulanıyor...' : 'Verifying link...'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {currentLanguage === 'ar' ? 'يرجى الانتظار' : 
                 currentLanguage === 'tr' ? 'Lütfen bekleyin' : 'Please wait'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 left-16 animate-float opacity-15 dark:opacity-25">
            <House className="w-8 h-8" style={{ color: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 40%, transparent)' }} />
          </div>
          <div className="absolute top-32 right-24 animate-float-delayed opacity-12 dark:opacity-20">
            <House className="w-6 h-6" style={{ color: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 35%, transparent)' }} />
          </div>
          <div className="absolute bottom-24 left-32 animate-float-slow opacity-10 dark:opacity-18">
            <House className="w-10 h-10" style={{ color: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 30%, transparent)' }} />
          </div>
          <div className="absolute bottom-40 right-16 animate-float-delayed-slow opacity-8 dark:opacity-15">
            <House className="w-7 h-7" style={{ color: 'color-mix(in srgb, var(--brand-gradient-to-color, #f43f5e) 25%, transparent)' }} />
          </div>
          <div className="absolute top-1/2 right-1/4 animate-float opacity-6 dark:opacity-12">
            <House className="w-5 h-5" style={{ color: 'color-mix(in srgb, var(--brand-gradient-from-color, #ec489a) 20%, transparent)' }} />
          </div>
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
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currentLanguage === 'ar' ? 'كلمة المرور الجديدة' : 
                   currentLanguage === 'tr' ? 'Yeni Şifre' : 'New Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={currentLanguage === 'ar' ? 'أدخل كلمة المرور الجديدة' : 
                                currentLanguage === 'tr' ? 'Yeni şifrenizi girin' : 'Enter your new password'}
                    className="pl-10 pr-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currentLanguage === 'ar' ? 'تأكيد كلمة المرور' : 
                   currentLanguage === 'tr' ? 'Şifreyi Onayla' : 'Confirm Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={currentLanguage === 'ar' ? 'أعد إدخال كلمة المرور' : 
                                currentLanguage === 'tr' ? 'Şifrenizi tekrar girin' : 'Confirm your password'}
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {currentLanguage === 'ar' ? 'إعادة تعيين كلمة المرور' : 
                 currentLanguage === 'tr' ? 'Şifreyi Sıfırla' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Debug component for development */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 max-w-md z-50">
          <ResetPasswordDebug />
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
