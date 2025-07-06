
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LanguageSetting {
  id: string;
  language_code: string;
  language_name_ar: string;
  language_name_en: string;
  language_name_tr: string;
  is_enabled: boolean;
  is_default: boolean;
}

export const useLanguageSettings = () => {
  const [languageSettings, setLanguageSettings] = useState<LanguageSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLanguageSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('language_settings')
        .select('*')
        .order('language_code');

      if (error) throw error;
      setLanguageSettings(data || []);
    } catch (error) {
      console.error('Error fetching language settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguageSettings();
  }, []);

  const getEnabledLanguages = () => {
    return languageSettings.filter(lang => lang.is_enabled);
  };

  const getDefaultLanguage = () => {
    return languageSettings.find(lang => lang.is_default);
  };

  return {
    languageSettings,
    loading,
    fetchLanguageSettings,
    getEnabledLanguages,
    getDefaultLanguage
  };
};
