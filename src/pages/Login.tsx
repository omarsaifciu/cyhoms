
import { useState, useEffect } from "react";
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!loading && user) {
      console.log('User already logged in, redirecting to home');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with email:', loginForm.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });

      console.log('Login response:', { user: data.user?.email, error });

      if (error) {
        console.error('Login error:', error);
        let errorMessage = "حدث خطأ أثناء تسجيل الدخول";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "يرجى تأكيد بريدك الإلكتروني أولاً";
        }

        toast({
          title: "خطأ في تسجيل الدخول",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.email);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك مرة أخرى!",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login catch error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting registration with email:', registerForm.email);
      
      // Set redirect URL for email confirmation
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: registerForm.email.trim(),
        password: registerForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: registerForm.name.trim(),
          }
        }
      });

      console.log('Registration response:', { user: data.user?.email, error });

      if (error) {
        console.error('Registration error:', error);
        let errorMessage = "حدث خطأ أثناء إنشاء الحساب";
        
        if (error.message.includes("User already registered")) {
          errorMessage = "هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.";
        } else if (error.message.includes("Password should be at least 6 characters")) {
          errorMessage = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        }

        toast({
          title: "خطأ في التسجيل",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log('Registration successful for user:', data.user.email);
        
        if (data.user.email_confirmed_at) {
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: "مرحباً بك! تم تسجيل دخولك تلقائياً.",
          });
          navigate('/');
        } else {
          toast({
            title: "تم إنشاء الحساب",
            description: "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.",
          });
        }
      }
    } catch (error) {
      console.error('Registration catch error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-24 relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* زر الرجوع - مرئي جداً في أعلى اليسار */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/')} 
        className="fixed top-6 left-6 z-[9999] bg-red-600 hover:bg-red-700 border-red-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl flex items-center gap-3 transition-all duration-300 backdrop-blur-sm text-lg font-bold"
        style={{
          minWidth: '140px',
          height: '60px'
        }}
      >
        <ArrowRight className="w-6 h-6" />
        <span className="text-lg font-bold">رجوع للرئيسية</span>
      </Button>

      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating house icons */}
        <div className="absolute top-20 left-20 animate-pulse pointer-events-none opacity-10">
          <House className="w-8 h-8 text-blue-500" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce pointer-events-none opacity-10">
          <House className="w-6 h-6 text-blue-500" />
        </div>
        <div className="absolute top-40 right-40 animate-pulse pointer-events-none opacity-10">
          <House className="w-10 h-10 text-blue-500" />
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-md mt-16">
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/50 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="text-center pt-12 pb-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-blue-500/10 dark:ring-blue-400/20 bg-gradient-to-r from-blue-500 to-purple-600">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              سجل دخولك أو أنشئ حساب جديد
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-12">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger value="login" className="flex items-center gap-2 rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                  <LogIn className="w-4 h-4" />
                  تسجيل دخول
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2 rounded-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                  <UserPlus className="w-4 h-4" />
                  حساب جديد
                </TabsTrigger>
              </TabsList>

              {/* تسجيل الدخول */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        className="pl-10 pr-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:brightness-95" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <LogIn className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "جار تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                </form>
              </TabsContent>

              {/* التسجيل */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="أدخل بريدك الإلكتروني"
                        className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="أعد إدخال كلمة المرور"
                        className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:brightness-95" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "جار إنشاء الحساب..." : "إنشاء حساب"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
