
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactSettings {
  phone_number: string;
  email: string;
  whatsapp_number: string;
  whatsapp_greeting_ar?: string;
  whatsapp_greeting_en?: string;
  whatsapp_greeting_tr?: string;
}

export const useContactSettings = () => {
  const [settings, setSettings] = useState<ContactSettings>({
    phone_number: '',
    email: '',
    whatsapp_number: '',
    whatsapp_greeting_ar: '',
    whatsapp_greeting_en: '',
    whatsapp_greeting_tr: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .eq('setting_key', 'default_contact')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching contact settings:', error);
        return;
      }

      if (data) {
        setSettings({
          phone_number: data.phone_number || '',
          email: data.email || '',
          whatsapp_number: data.whatsapp_number || '',
          whatsapp_greeting_ar: data.whatsapp_greeting_ar || '',
          whatsapp_greeting_en: data.whatsapp_greeting_en || '',
          whatsapp_greeting_tr: data.whatsapp_greeting_tr || '',
        });
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof ContactSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_settings')
        .update({
          phone_number: settings.phone_number,
          email: settings.email,
          whatsapp_number: settings.whatsapp_number,
          whatsapp_greeting_ar: settings.whatsapp_greeting_ar,
          whatsapp_greeting_en: settings.whatsapp_greeting_en,
          whatsapp_greeting_tr: settings.whatsapp_greeting_tr,
          updated_at: new Date().toISOString(),
        })
        .eq('setting_key', 'default_contact');

      if (error) {
        console.error('Error saving contact settings:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حفظ إعدادات التواصل",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات التواصل بنجاح",
      });
    } catch (error) {
      console.error('Error saving contact settings:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ إعدادات التواصل",
        variant: "destructive",
      });
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
    saveSettings
  };
};
