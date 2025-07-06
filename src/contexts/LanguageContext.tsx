
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useLanguageSettings } from '@/hooks/useLanguageSettings';

// Language translation imports
import ar from './translations/ar';
import en from './translations/en';
import tr from './translations/tr';

type Language = 'ar' | 'en' | 'tr';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  availableLanguages: Array<{
    code: Language;
    nameAr: string;
    nameEn: string;
    nameTr: string;
  }>;
}

const translations: Record<Language, Record<string, string>> = { ar, en, tr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, updateProfile } = useUserProfile();
  const { languageSettings, loading: languageSettingsLoading } = useLanguageSettings();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Get available languages from database settings
  const availableLanguages = languageSettings
    .filter(lang => lang.is_enabled)
    .map(lang => ({
      code: lang.language_code as Language,
      nameAr: lang.language_name_ar,
      nameEn: lang.language_name_en,
      nameTr: lang.language_name_tr,
    }));

  // Function to get saved language with priority order
  const getSavedLanguage = (): Language => {
    // 1. First priority: User profile language preference (if logged in)
    if (profile?.language_preference) {
      // Check if the preferred language is enabled
      const isLanguageEnabled = languageSettings.some(
        lang => lang.language_code === profile.language_preference && lang.is_enabled
      );
      if (isLanguageEnabled) {
        return profile.language_preference as Language;
      }
    }
    
    // 2. Second priority: localStorage saved language
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ar', 'en', 'tr'].includes(savedLanguage)) {
      // Check if the saved language is enabled
      const isLanguageEnabled = languageSettings.some(
        lang => lang.language_code === savedLanguage && lang.is_enabled
      );
      if (isLanguageEnabled) {
        return savedLanguage;
      }
    }
    
    // 3. Third priority: Default language from database
    const defaultLanguage = languageSettings.find(lang => lang.is_default);
    if (defaultLanguage) {
      return defaultLanguage.language_code as Language;
    }
    
    // 4. Fourth priority: Browser language detection (only if enabled)
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('ar')) {
      const isArabicEnabled = languageSettings.some(
        lang => lang.language_code === 'ar' && lang.is_enabled
      );
      if (isArabicEnabled) return 'ar';
    } else if (browserLanguage.startsWith('tr')) {
      const isTurkishEnabled = languageSettings.some(
        lang => lang.language_code === 'tr' && lang.is_enabled
      );
      if (isTurkishEnabled) return 'tr';
    }
    
    // 5. Final fallback: First enabled language or English
    const firstEnabledLanguage = languageSettings.find(lang => lang.is_enabled);
    return firstEnabledLanguage ? (firstEnabledLanguage.language_code as Language) : 'en';
  };

  // Initialize language on mount and when profile/language settings change
  useEffect(() => {
    if (!languageSettingsLoading && languageSettings.length > 0) {
      const savedLanguage = getSavedLanguage();
      console.log('Setting initial language:', savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, [profile, languageSettings, languageSettingsLoading]);

  // Apply RTL/LTR direction to document
  useEffect(() => {
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = async (lang: Language) => {
    // Check if the language is enabled before setting it
    const isLanguageEnabled = languageSettings.some(
      langSetting => langSetting.language_code === lang && langSetting.is_enabled
    );
    
    if (!isLanguageEnabled) {
      console.warn(`Language ${lang} is not enabled`);
      return;
    }

    console.log('Changing language to:', lang);
    setCurrentLanguage(lang);
    
    // Always save to localStorage for immediate persistence
    localStorage.setItem('language', lang);
    
    // If user is logged in, also save to profile
    if (profile && updateProfile) {
      try {
        await updateProfile({ language_preference: lang });
        console.log('Language preference saved to profile:', lang);
      } catch (error) {
        console.error('Failed to save language preference to profile:', error);
      }
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      isRTL: currentLanguage === 'ar',
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
