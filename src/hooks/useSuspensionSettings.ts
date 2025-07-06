
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SuspensionSettings {
  id: string;
  setting_key: string;
  title_ar: string;
  title_en: string;
  title_tr: string;
  message_ar: string;
  message_en: string;
  message_tr: string;
}

export const useSuspensionSettings = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, SuspensionSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('suspension_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;

      const settingsMap: Record<string, SuspensionSettings> = {};
      data?.forEach(setting => {
        settingsMap[setting.setting_key] = setting;
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching suspension settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, updates: Partial<SuspensionSettings>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('suspension_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        [settingKey]: { ...prev[settingKey], ...updates }
      }));

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث الإعدادات' : 'Settings updated successfully'
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error.message || (currentLanguage === 'ar' ? 'فشل في تحديث الإعدادات' : 'Failed to update settings'),
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    updateSetting,
    fetchSettings
  };
};
