
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { City } from "@/types/city";

export const useCitiesData = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = async () => {
    try {
      setLoading(true);
      console.log('Fetching cities...');
      
      // محاولة جلب المدن بدون فلتر is_active أولاً
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }

      console.log('Cities fetched successfully:', data?.length || 0, data);
      setCities(data || []);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحميل المدن' : 'Failed to load cities',
        variant: 'destructive'
      });
      setCities([]); // تعيين مصفوفة فارغة في حالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCities = async () => {
      if (!isMounted) return;
      await fetchCities();
    };

    // تحميل المدن مرة واحدة فقط
    if (cities.length === 0) {
      loadCities();
    }

    return () => {
      isMounted = false;
    };
  }, []); // بدون dependencies لتجنب الحلقة اللا نهائية

  return {
    cities,
    loading,
    fetchCities
  };
};
