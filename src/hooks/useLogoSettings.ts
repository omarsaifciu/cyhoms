
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface LogoSettings {
  id: string;
  logo_type: 'text' | 'image' | 'svg';
  logo_text_ar?: string;
  logo_text_en?: string;
  logo_text_tr?: string;

  // روابط شعارات منفصلة لكل لغة/وضع
  logo_ar_light_url?: string | null;
  logo_ar_dark_url?: string | null;
  logo_en_light_url?: string | null;
  logo_en_dark_url?: string | null;
  logo_tr_light_url?: string | null;
  logo_tr_dark_url?: string | null;

  // للوراثة مع الإصدارة السابقة
  logo_image_url?: string;
  logo_svg_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLogoSettings = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [logoSettings, setLogoSettings] = useState<LogoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchLogoSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('logo_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setLogoSettings({
          ...data,
          logo_type: data.logo_type as 'text' | 'image' | 'svg',
        });
      } else {
        setLogoSettings(null);
      }
    } catch (error) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحميل إعدادات الشعار' : 'Failed to load logo settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // تحديث إعدادات الشعار
  const updateLogoSettings = async (newSettings: Partial<LogoSettings>) => {
    setSaving(true);
    try {
      // Disactivate old active settings (إن وُجدت)
      if (logoSettings?.id) {
        await supabase
          .from('logo_settings')
          .update({ is_active: false })
          .eq('id', logoSettings.id);
      }

      // Always set logo_type from newSettings or fallback to previous value
      const logoType: 'text' | 'image' | 'svg' =
        (newSettings.logo_type as 'text' | 'image' | 'svg') ??
        (logoSettings?.logo_type as 'text' | 'image' | 'svg');

      if (!logoType) {
        throw new Error('Logo type is required');
      }

      const insertData = {
        ...newSettings,
        logo_type: logoType,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      // تحديد كل الحقول الجديدة عند الإدخال (تسمح بالقيم null)
      const fieldList = [
        "logo_ar_light_url","logo_ar_dark_url",
        "logo_en_light_url","logo_en_dark_url",
        "logo_tr_light_url","logo_tr_dark_url"
      ];
      for (const field of fieldList) {
        if (!(field in insertData)) insertData[field] = null;
      }

      const { data, error } = await supabase
        .from('logo_settings')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setLogoSettings({
        ...data,
        logo_type: data.logo_type as 'text' | 'image' | 'svg',
      });

      toast({
        title: currentLanguage === 'ar' ? 'تم الحفظ' : 'Saved',
        description: currentLanguage === 'ar' ? 'تم حفظ إعدادات الشعار بنجاح' : 'Logo settings saved successfully',
      });

      return data;
    } catch (error) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في حفظ إعدادات الشعار' : 'Failed to save logo settings',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // رفع شعار (صورة أو svg)
  const uploadLogoFile = async (file: File, lang: string, mode: string, extType: string = "img"): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${lang}-${mode}-${Date.now()}.${fileExt}`;
      // ملاحظة: يجب تفعيل bucket باسم "logos" في supabase storage واستبداله حسب الحاجة
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) throw new Error("No public URL returned");

      return publicUrlData.publicUrl;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchLogoSettings();
    // eslint-disable-next-line
  }, []);

  // نفس دالة النص
  const getLogoText = (settings: LogoSettings | null, language: string) => {
    if (!settings || settings.logo_type !== 'text') return '';
    switch (language) {
      case 'ar': return settings.logo_text_ar || '';
      case 'tr': return settings.logo_text_tr || '';
      default: return settings.logo_text_en || '';
    }
  };

  return {
    logoSettings,
    loading,
    saving,
    updateLogoSettings,
    uploadLogoFile,
    getLogoText,
    fetchLogoSettings,
  };
};
