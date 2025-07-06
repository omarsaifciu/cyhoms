
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Languages, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LanguageSetting {
  id: string;
  language_code: string;
  language_name_ar: string;
  language_name_en: string;
  language_name_tr: string;
  is_enabled: boolean;
  is_default: boolean;
}

const LanguageManagement = () => {
  const { currentLanguage } = useLanguage();
  const [languages, setLanguages] = useState<LanguageSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('language_settings')
        .select('*')
        .order('language_code');

      if (error) throw error;
      setLanguages(data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error(currentLanguage === 'ar' ? 'خطأ في تحميل اللغات' : 'Error loading languages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const toggleLanguage = async (languageId: string, isEnabled: boolean) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('language_settings')
        .update({ 
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', languageId);

      if (error) throw error;

      setLanguages(prev => 
        prev.map(lang => 
          lang.id === languageId 
            ? { ...lang, is_enabled: isEnabled }
            : lang
        )
      );

      toast.success(
        currentLanguage === 'ar' 
          ? 'تم تحديث إعدادات اللغة بنجاح' 
          : 'Language settings updated successfully'
      );
    } catch (error) {
      console.error('Error updating language:', error);
      toast.error(
        currentLanguage === 'ar' 
          ? 'خطأ في تحديث إعدادات اللغة' 
          : 'Error updating language settings'
      );
    } finally {
      setSaving(false);
    }
  };

  const setDefaultLanguage = async (languageId: string) => {
    try {
      setSaving(true);
      
      // First, remove default from all languages
      const { error: removeDefaultError } = await supabase
        .from('language_settings')
        .update({ 
          is_default: false,
          updated_at: new Date().toISOString()
        })
        .neq('id', languageId);

      if (removeDefaultError) throw removeDefaultError;

      // Then set the new default
      const { error: setDefaultError } = await supabase
        .from('language_settings')
        .update({ 
          is_default: true,
          is_enabled: true, // Default language must be enabled
          updated_at: new Date().toISOString()
        })
        .eq('id', languageId);

      if (setDefaultError) throw setDefaultError;

      setLanguages(prev => 
        prev.map(lang => ({
          ...lang,
          is_default: lang.id === languageId,
          is_enabled: lang.id === languageId ? true : lang.is_enabled
        }))
      );

      toast.success(
        currentLanguage === 'ar' 
          ? 'تم تعيين اللغة الافتراضية بنجاح' 
          : 'Default language set successfully'
      );
    } catch (error) {
      console.error('Error setting default language:', error);
      toast.error(
        currentLanguage === 'ar' 
          ? 'خطأ في تعيين اللغة الافتراضية' 
          : 'Error setting default language'
      );
    } finally {
      setSaving(false);
    }
  };

  const getLanguageName = (lang: LanguageSetting) => {
    switch (currentLanguage) {
      case 'ar': return lang.language_name_ar;
      case 'tr': return lang.language_name_tr;
      default: return lang.language_name_en;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentLanguage === 'ar' ? 'إدارة اللغات' : 'Language Management'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === 'ar' 
              ? 'إدارة اللغات المتاحة في الموقع وتحديد اللغة الافتراضية' 
              : 'Manage available languages on the website and set default language'
            }
          </p>
        </div>
        <Button
          onClick={fetchLanguages}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {currentLanguage === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {currentLanguage === 'ar' ? 'إعدادات اللغات' : 'Language Settings'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' 
              ? 'تفعيل أو إلغاء تفعيل اللغات المتاحة في الموقع' 
              : 'Enable or disable available languages on the website'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-500">
                {currentLanguage === 'ar' ? 'جارٍ تحميل اللغات...' : 'Loading languages...'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {languages.map((language) => (
                <div 
                  key={language.id} 
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">
                          {getLanguageName(language)}
                        </span>
                        <span className="text-sm text-gray-500 uppercase">
                          ({language.language_code})
                        </span>
                        {language.is_default && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                            {currentLanguage === 'ar' ? 'افتراضي' : 'Default'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {currentLanguage === 'ar' ? 'الاسم بجميع اللغات:' : 'Names:'} 
                        <span className="ml-1">
                          {language.language_name_ar} • {language.language_name_en} • {language.language_name_tr}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentLanguage === 'ar' ? 'مفعل' : 'Enabled'}
                      </span>
                      <Switch
                        checked={language.is_enabled}
                        onCheckedChange={(checked) => toggleLanguage(language.id, checked)}
                        disabled={saving || language.is_default} // Can't disable default language
                      />
                    </div>
                    
                    {!language.is_default && language.is_enabled && (
                      <Button
                        onClick={() => setDefaultLanguage(language.id)}
                        disabled={saving}
                        variant="outline"
                        size="sm"
                      >
                        {currentLanguage === 'ar' ? 'جعل افتراضي' : 'Set Default'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
              <span className="text-blue-600 dark:text-blue-400 text-sm">ℹ</span>
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">
                {currentLanguage === 'ar' ? 'ملاحظات مهمة:' : 'Important Notes:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>
                  {currentLanguage === 'ar' 
                    ? 'لا يمكن إلغاء تفعيل اللغة الافتراضية' 
                    : 'The default language cannot be disabled'
                  }
                </li>
                <li>
                  {currentLanguage === 'ar' 
                    ? 'عند تعيين لغة كافتراضية سيتم تفعيلها تلقائياً' 
                    : 'Setting a language as default will automatically enable it'
                  }
                </li>
                <li>
                  {currentLanguage === 'ar' 
                    ? 'تأثير تغيير إعدادات اللغات يظهر فوراً في محدد اللغة' 
                    : 'Language setting changes are immediately reflected in the language selector'
                  }
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageManagement;
