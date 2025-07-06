import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { City, District } from '@/types/city';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  cities: City[];
  districts: District[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // بيانات احتياطية للمدن
  const fallbackCities: City[] = [
    { id: '1', name_ar: 'نيقوسيا', name_en: 'Nicosia', name_tr: 'Lefkoşa', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '2', name_ar: 'ليماسول', name_en: 'Limassol', name_tr: 'Limasol', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '3', name_ar: 'لارنكا', name_en: 'Larnaca', name_tr: 'Larnaka', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '4', name_ar: 'بافوس', name_en: 'Paphos', name_tr: 'Baf', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '5', name_ar: 'فاماغوستا', name_en: 'Famagusta', name_tr: 'Mağusa', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '6', name_ar: 'كيرينيا', name_en: 'Kyrenia', name_tr: 'Girne', is_active: true, created_at: new Date().toISOString(), created_by: '' },
  ];

  // بيانات احتياطية للمناطق
  const fallbackDistricts: District[] = [
    { id: '1', city_id: '1', name_ar: 'وسط المدينة', name_en: 'City Center', name_tr: 'Şehir Merkezi', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '2', city_id: '1', name_ar: 'أكروبوليس', name_en: 'Acropolis', name_tr: 'Akropolis', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '3', city_id: '1', name_ar: 'إنجومي', name_en: 'Engomi', name_tr: 'Engomi', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '4', city_id: '1', name_ar: 'ستروفولوس', name_en: 'Strovolos', name_tr: 'Strovolos', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '5', city_id: '2', name_ar: 'المارينا', name_en: 'Marina', name_tr: 'Marina', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '6', city_id: '2', name_ar: 'جيرماسويا', name_en: 'Germasogeia', name_tr: 'Germasogeia', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '7', city_id: '2', name_ar: 'أيوس تيخوناس', name_en: 'Ayios Tychonas', name_tr: 'Ayios Tychonas', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '8', city_id: '3', name_ar: 'فينيكودس', name_en: 'Finikoudes', name_tr: 'Finikoudes', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '9', city_id: '3', name_ar: 'أرادبيو', name_en: 'Aradippou', name_tr: 'Aradippou', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '10', city_id: '4', name_ar: 'كاتو بافوس', name_en: 'Kato Paphos', name_tr: 'Kato Baf', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '11', city_id: '4', name_ar: 'كورال باي', name_en: 'Coral Bay', name_tr: 'Coral Bay', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '12', city_id: '5', name_ar: 'وسط فاماغوستا', name_en: 'Famagusta Center', name_tr: 'Mağusa Merkez', is_active: true, created_at: new Date().toISOString(), created_by: '' },
    { id: '13', city_id: '6', name_ar: 'وسط كيرينيا', name_en: 'Kyrenia Center', name_tr: 'Girne Merkez', is_active: true, created_at: new Date().toISOString(), created_by: '' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // محاولة تحميل المدن
      const { data: citiesData, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .order('name_en', { ascending: true });

      // محاولة تحميل المناطق
      const { data: districtsData, error: districtsError } = await supabase
        .from('districts')
        .select('*')
        .order('name_en', { ascending: true });

      // التحقق من أخطاء المدن
      if (citiesError) {
        console.warn('Cities table not found, using fallback data:', citiesError);
        setCities(fallbackCities);
      } else {
        setCities(citiesData || fallbackCities);
      }

      // التحقق من أخطاء المناطق
      if (districtsError) {
        console.warn('Districts table not found, using fallback data:', districtsError);
        setDistricts(fallbackDistricts);
      } else {
        setDistricts(districtsData || fallbackDistricts);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
      // استخدام البيانات الاحتياطية في حالة الخطأ
      setCities(fallbackCities);
      setDistricts(fallbackDistricts);
    } finally {
      setLoading(false);
    }
  };

  const refetchData = async () => {
    await fetchData();
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;
      await fetchData();
    };

    // تحميل البيانات مرة واحدة فقط عند تشغيل التطبيق
    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // بدون dependencies لتجنب الحلقة اللا نهائية

  const value: DataContextType = {
    cities,
    districts,
    loading,
    error,
    refetchData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
