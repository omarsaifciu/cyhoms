
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCityNameByLanguage } from "@/utils/cityUtils";

export const useAdminStats = () => {
  const { currentLanguage } = useLanguage();
  const [stats, setStats] = useState({
    totalProperties: 0,
    registeredUsers: 0,
    monthlyVisits: 0, // سيتم استبدالها بعدد المشاهدات الحقيقي
    rentedProperties: 0,
    previousMonthProperties: 0,
    previousMonthUsers: 0,
    previousMonthRented: 0
  });
  const [cityStats, setCityStats] = useState<Array<{
    city: string;
    properties: number;
    percentage: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [currentLanguage]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get all cities first
      const { data: cities, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true);
      
      if (citiesError) throw citiesError;

      // Get total properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, created_at, status, city');
      
      if (propertiesError) throw propertiesError;

      // Get total users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at');
      
      if (usersError) throw usersError;

      // Get TRUE view count from property_views for available and non-hidden properties only
      const { count: viewsCount, error: viewsError } = await supabase
        .from('property_views')
        .select('property_id, properties!inner(status, hidden_by_admin)', { count: 'exact', head: true })
        .eq('properties.status', 'available')
        .neq('properties.hidden_by_admin', true);
      if (viewsError) throw viewsError;

      // Calculate current month stats
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const totalProperties = properties?.length || 0;
      const totalUsers = users?.length || 0;
      
      // Rented properties (status = 'rented' or 'pending')
      const rentedProperties = properties?.filter(p => p.status === 'rented' || p.status === 'pending').length || 0;
      
      // Previous month stats for comparison
      const propertiesThisMonth = properties?.filter(p => 
        new Date(p.created_at) >= currentMonth
      ).length || 0;
      
      const propertiesLastMonth = properties?.filter(p => 
        new Date(p.created_at) >= previousMonth && new Date(p.created_at) < currentMonth
      ).length || 0;

      const usersThisMonth = users?.filter(u => 
        new Date(u.created_at) >= currentMonth
      ).length || 0;
      
      const usersLastMonth = users?.filter(u => 
        new Date(u.created_at) >= previousMonth && new Date(u.created_at) < currentMonth
      ).length || 0;

      // City statistics - map city IDs to actual city names
      const cityCounts: { [key: string]: number } = {};
      
      properties?.forEach(property => {
        if (property.city) {
          // Find the city in the cities array by ID
          const cityData = cities?.find(c => c.id === property.city);
          if (cityData) {
            const cityName = getCityNameByLanguage(cityData, currentLanguage);
            cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
          } else {
            // Fallback for old format where city might be stored as string
            cityCounts[property.city] = (cityCounts[property.city] || 0) + 1;
          }
        }
      });

      const cityStatsArray = Object.entries(cityCounts)
        .map(([city, count]) => ({
          city,
          properties: count,
          percentage: totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0
        }))
        .sort((a, b) => b.properties - a.properties)
        .slice(0, 6);

      setStats({
        totalProperties,
        registeredUsers: totalUsers,
        monthlyVisits: viewsCount || 0, // العدد الحقيقي للمشاهدات
        rentedProperties,
        previousMonthProperties: propertiesLastMonth,
        previousMonthUsers: usersLastMonth,
        previousMonthRented: rentedProperties // For now, same as current
      });

      setCityStats(cityStatsArray);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  return {
    stats,
    cityStats,
    loading,
    calculatePercentageChange,
    refreshStats: fetchStats
  };
};
