
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTermsManagement } from "@/hooks/useTermsManagement";
import { TermsAndConditions } from "@/types/terms";

const Terms = () => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { fetchActiveTerms } = useTermsManagement();
  const [activeTerms, setActiveTerms] = useState<TermsAndConditions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveTerms = async () => {
      setLoading(true);
      const terms = await fetchActiveTerms();
      setActiveTerms(terms);
      setLoading(false);
    };

    loadActiveTerms();
  }, []);

  const getTitle = () => {
    if (!activeTerms) {
      return currentLanguage === 'ar' ? 'سياسة الخصوصية والأحكام والشروط' : 
             currentLanguage === 'tr' ? 'Gizlilik Politikası ve Şartlar' : 
             'Privacy Policy & Terms and Conditions';
    }
    
    if (currentLanguage === 'ar' && activeTerms.title_ar) return activeTerms.title_ar;
    if (currentLanguage === 'tr' && activeTerms.title_tr) return activeTerms.title_tr;
    if (currentLanguage === 'en' && activeTerms.title_en) return activeTerms.title_en;
    
    return activeTerms.title_en || activeTerms.title_ar || activeTerms.title_tr || 
           (currentLanguage === 'ar' ? 'سياسة الخصوصية والأحكام والشروط' : 
            currentLanguage === 'tr' ? 'Gizlilik Politikası ve Şartlar' : 
            'Privacy Policy & Terms and Conditions');
  };

  const getContent = () => {
    if (!activeTerms) {
      return currentLanguage === 'ar' ? 'لا توجد سياسة خصوصية أو أحكام وشروط متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.' : 
             currentLanguage === 'tr' ? 'Şu anda kullanılabilir gizlilik politikası veya şartlar yok. Lütfen daha sonra tekrar deneyin.' : 
             'No privacy policy or terms and conditions are currently available. Please try again later.';
    }
    
    if (currentLanguage === 'ar' && activeTerms.content_ar) return activeTerms.content_ar;
    if (currentLanguage === 'tr' && activeTerms.content_tr) return activeTerms.content_tr;
    if (currentLanguage === 'en' && activeTerms.content_en) return activeTerms.content_en;
    
    return activeTerms.content_en || activeTerms.content_ar || activeTerms.content_tr || 
           (currentLanguage === 'ar' ? 'لا توجد سياسة خصوصية أو أحكام وشروط متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.' : 
            currentLanguage === 'tr' ? 'Şu anda kullanılabilir gizlilik politikası veya şartlar yok. Lütfen daha sonra tekrar deneyin.' : 
            'No privacy policy or terms and conditions are currently available. Please try again later.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            {currentLanguage === 'ar' ? 'جاري التحميل...' : 
             currentLanguage === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 relative" 
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation */}
        <div className="mb-8 flex flex-wrap gap-4 animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-lg hover:bg-white hover:shadow-lg transition-all duration-300 rounded-2xl px-6 py-3"
          >
            {currentLanguage === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {currentLanguage === 'ar' ? 'العودة للرئيسية' : currentLanguage === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-lg hover:bg-white hover:shadow-lg transition-all duration-300 rounded-2xl px-6 py-3 border-gray-200"
          >
            {currentLanguage === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {currentLanguage === 'ar' ? 'العودة لتسجيل الدخول' : currentLanguage === 'tr' ? 'Giriş Sayfasına Dön' : 'Back to Login'}
          </Button>
        </div>

        {/* Main Content */}
        <Card className="max-w-5xl mx-auto backdrop-blur-lg bg-white/95 border-0 shadow-2xl rounded-3xl animate-scale-in">
          <CardHeader className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {getTitle()}
            </CardTitle>
            
            {/* Features */}
            <div className="flex justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm">
                  {currentLanguage === 'ar' ? 'محمي وآمن' : 
                   currentLanguage === 'tr' ? 'Güvenli ve Korumalı' : 'Secure & Protected'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm">
                  {currentLanguage === 'ar' ? 'محدث دائماً' : 
                   currentLanguage === 'tr' ? 'Her Zaman Güncel' : 'Always Updated'}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            <div className="prose prose-lg max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {getContent()}
              </div>
            </div>
            
            {activeTerms && (
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-6 py-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {currentLanguage === 'ar' ? 'آخر تحديث: ' : currentLanguage === 'tr' ? 'Son güncelleme: ' : 'Last updated: '}
                    <span className="font-semibold">
                      {new Date(activeTerms.updated_at).toLocaleDateString(
                        currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          calendar: 'gregory' // Force Gregorian calendar for Arabic
                        }
                      )}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
