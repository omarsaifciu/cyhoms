
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { District } from "@/types/city";

export const useDistrictsData = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      console.log('Fetching districts...');
      
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Error fetching districts:', error);
        // إذا كان الجدول غير موجود، استخدم بيانات افتراضية
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('Districts table does not exist, using fallback data');
          const fallbackDistricts = [
            { id: '1', city_id: '1', name_ar: 'وسط المدينة', name_en: 'City Center', name_tr: 'Şehir Merkezi', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '2', city_id: '1', name_ar: 'أكروبوليس', name_en: 'Acropolis', name_tr: 'Akropolis', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '3', city_id: '1', name_ar: 'إنجومي', name_en: 'Engomi', name_tr: 'Engomi', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '4', city_id: '2', name_ar: 'المارينا', name_en: 'Marina', name_tr: 'Marina', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '5', city_id: '2', name_ar: 'جيرماسويا', name_en: 'Germasogeia', name_tr: 'Germasogeia', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '6', city_id: '3', name_ar: 'فينيكودس', name_en: 'Finikoudes', name_tr: 'Finikoudes', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '7', city_id: '4', name_ar: 'كاتو بافوس', name_en: 'Kato Paphos', name_tr: 'Kato Baf', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          ];
          setDistricts(fallbackDistricts);
          return;
        }
        throw error;
      }

      console.log('Districts fetched successfully:', data?.length || 0, data);
      setDistricts(data || []);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحميل الأحياء' : 'Failed to load districts',
        variant: 'destructive'
      });
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadDistricts = async () => {
      if (!isMounted) return;
      await fetchDistricts();
    };

    // تحميل المناطق مرة واحدة فقط
    if (districts.length === 0) {
      loadDistricts();
    }

    return () => {
      isMounted = false;
    };
  }, []); // بدون dependencies لتجنب الحلقة اللا نهائية

  return {
    districts,
    loading,
    fetchDistricts
  };
};
