

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate, useLocation } from "react-router-dom";
import SignUp from "@/components/auth/SignUp";
import SignIn from "@/components/auth/SignIn";
import { useLanguage } from "@/contexts/LanguageContext";
import SuspensionMessage from "@/components/auth/SuspensionMessage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { House, ArrowLeft, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const { user, loading } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Redirect authenticated users
    if (user) {
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-brand-accent/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  // التحقق من حالة الحظر
  if (user && profile?.is_suspended) {
    return <SuspensionMessage userId={user.id} />;
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
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-full p-2 md:p-3 shrink-0 px-[16px] py-[8px] bg-white/95 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border-gray-200/50 dark:border-slate-600/50 text-gray-800 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {currentLanguage === 'ar' ? (
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex-1 text-gray-900 dark:text-white truncate">
            {currentLanguage === 'ar' ? 'تسجيل الدخول' : currentLanguage === 'tr' ? 'Giriş Yap' : 'Sign In'}
          </h1>
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
              {currentLanguage === "ar" ? "مرحباً بعودتك" : 
               currentLanguage === "tr" ? "Tekrar Hoş Geldiniz" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {currentLanguage === "ar" ? "ادخل إلى عالم العقارات المميزة" : 
               currentLanguage === "tr" ? "Premium emlak dünyasına girin" : "Enter the world of premium real estate"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-12">
            {/* Compact Tabs Section */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100/90 dark:bg-slate-700/60 backdrop-blur-sm rounded-full p-1 border border-slate-200/50 dark:border-slate-600/50 shadow-sm">
                <TabsTrigger
                  value="login"
                  className="text-xs font-medium rounded-full py-2 px-4 transition-all duration-300 ease-in-out data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-md data-[state=active]:text-slate-800 dark:data-[state=active]:text-white text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white data-[state=active]:scale-[1.02] hover:bg-slate-50 dark:hover:bg-slate-600/30"
                >
                  {currentLanguage === "ar" ? "تسجيل الدخول" :
                   currentLanguage === "tr" ? "Giriş" : "Login"}
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-xs font-medium rounded-full py-2 px-4 transition-all duration-300 ease-in-out data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:shadow-md data-[state=active]:text-slate-800 dark:data-[state=active]:text-white text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white data-[state=active]:scale-[1.02] hover:bg-slate-50 dark:hover:bg-slate-600/30"
                >
                  {currentLanguage === "ar" ? "إنشاء حساب" :
                   currentLanguage === "tr" ? "Kayıt Ol" : "Sign Up"}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="login"
                className="mt-0 animate-in fade-in-0 slide-in-from-right-2 duration-300 ease-in-out"
              >
                <SignIn />
              </TabsContent>

              <TabsContent
                value="signup"
                className="mt-0 animate-in fade-in-0 slide-in-from-left-2 duration-300 ease-in-out"
              >
                <SignUp />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

