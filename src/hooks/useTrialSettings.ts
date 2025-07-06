
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrialSettings {
  id: string;
  is_trial_enabled: boolean;
  trial_days: number;
  created_at: string;
  updated_at: string;
}

export const useTrialSettings = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState<TrialSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      console.log('Fetching trial settings...');
      const { data, error } = await supabase
        .from('trial_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching trial settings:', error);
        return;
      }

      console.log('Trial settings fetched:', data);
      setSettings(data);
    } catch (error) {
      console.error('Error fetching trial settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<TrialSettings>) => {
    if (!settings) return false;

    try {
      console.log('Updating trial settings:', updates);
      
      const { error } = await supabase
        .from('trial_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) {
        console.error('Error updating trial settings:', error);
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'فشل في تحديث الإعدادات' : 'Failed to update settings',
          variant: 'destructive'
        });
        return false;
      }

      console.log('Trial settings updated successfully');
      
      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully'
      });

      // Update local state immediately
      setSettings(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
      
      return true;
    } catch (error) {
      console.error('Error updating trial settings:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};
