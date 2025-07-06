
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface PropertyLayout {
  id: string;
  name_ar: string;
  name_en: string;
  name_tr: string;
  property_type_id?: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export const usePropertyLayouts = (refreshKey?: number) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [propertyLayouts, setPropertyLayouts] = useState<PropertyLayout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyLayouts = async () => {
    setLoading(true);
    try {
      console.log('Fetching property layouts...');
      
      const { data, error } = await supabase
        .from('property_layouts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Raw property layouts data:', data);
      console.log('Number of layouts found:', data?.length || 0);
      
      // تسجيل كل تقسيم منفرداً لسهولة المراجعة
      data?.forEach((layout, index) => {
        console.log(`Layout ${index + 1}:`, {
          id: layout.id,
          name_ar: layout.name_ar,
          name_en: layout.name_en,
          name_tr: layout.name_tr,
          property_type_id: layout.property_type_id,
          is_active: layout.is_active
        });
      });
      
      setPropertyLayouts(data || []);
    } catch (error) {
      console.error('Error fetching property layouts:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحميل تقسيمات العقارات' : 'Failed to load property layouts',
        variant: 'destructive'
      });
      setPropertyLayouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyLayouts();
  }, [refreshKey]);

  // إضافة listener للتحديثات المباشرة
  useEffect(() => {
    const channel = supabase
      .channel('property_layouts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'property_layouts' },
        (payload) => {
          console.log('Property layout changed:', payload);
          fetchPropertyLayouts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    propertyLayouts,
    loading,
    fetchPropertyLayouts
  };
};

export const getPropertyLayoutNameByLanguage = (propertyLayout: PropertyLayout, language: string) => {
  switch (language) {
    case 'ar':
      return propertyLayout.name_ar;
    case 'tr':
      return propertyLayout.name_tr;
    default:
      return propertyLayout.name_en;
  }
};
