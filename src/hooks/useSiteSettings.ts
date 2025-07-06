
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { SiteSettings, defaultSiteSettings } from "@/types/siteSettings";
import { fetchSiteSettingsFromDB, saveSiteSettingsToDB } from "@/services/siteSettingsApiService";
import { useSiteSettingsRealtime } from "./useSiteSettingsRealtime";

// The theme-applying hooks that caused the flash have been removed.

export const useSiteSettings = () => {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const {
    settings: remoteSettings,
    loading,
    fetchSettings, // for manual refresh if needed
  } = useSiteSettingsRealtime();

  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [saving, setSaving] = useState(false);

  // Sync local state with remote when remoteSettings change
  useEffect(() => {
    setSettings(remoteSettings);
  }, [remoteSettings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await saveSiteSettingsToDB(settings);
      toast({
        title: currentLanguage === 'ar' ? 'نجح الحفظ' : 'Settings Saved',
        description: currentLanguage === 'ar' ? 'تم حفظ الإعدادات. سيتم تحديث الصفحة الآن لتطبيق التغييرات.' : 'Settings saved. The page will now refresh to apply changes.'
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ في الحفظ' : 'Save Error',
        description: currentLanguage === 'ar' ? 'فشل في حفظ الإعدادات' : 'Failed to save settings',
        variant: 'destructive'
      });
      setSaving(false);
    }
  };

  // Update the local copy of settings, for the admin UI
  const updateSetting = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev: SiteSettings) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    settings,
    loading,
    saving,
    updateSetting,
    saveSettings,
    fetchSettings
  };
};
