
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroStats {
  totalProperties: number;
  totalCities: number; // Note: This will hold the count of districts for compatibility
  totalViews: number;
  loading: boolean;
}

export const useHeroStats = () => {
  const { currentLanguage } = useLanguage();
  const [stats, setStats] = useState<HeroStats>({
    totalProperties: 0,
    totalCities: 0, // Will hold districts count
    totalViews: 0,
    loading: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // جلب عدد العقارات المتاحة
      const { count: propertiesCount, error: propertiesError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      if (propertiesError) throw propertiesError;

      // جلب عدد الأحياء النشطة
      const { count: districtsCount, error: districtsError } = await supabase
        .from('districts')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (districtsError) throw districtsError;

      // حساب إجمالي المشاهدات للعقارات المتاحة وغير المخفية فقط
      const { count: totalViewsCount, error: viewsError } = await supabase
        .from('property_views')
        .select('property_id, properties!inner(status, hidden_by_admin)', { count: 'exact', head: true })
        .eq('properties.status', 'available')
        .neq('properties.hidden_by_admin', true);

      if (viewsError) throw viewsError;


      setStats({
        totalProperties: propertiesCount || 0,
        totalCities: districtsCount || 0, // Now represents total districts
        totalViews: totalViewsCount || 0,
        loading: false
      });

    } catch (error) {
      console.error('Error fetching hero stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return { ...stats, refreshStats: fetchStats };
};
