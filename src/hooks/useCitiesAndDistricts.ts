
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { City, District } from "@/types/city";

export const useCitiesAndDistricts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // التحقق من صلاحيات الأدمن
  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      // التحقق من الأدمن الأساسي أولاً
      if (user.email === 'omar122540@gmail.com') {
        console.log('Primary admin detected:', user.email);
        setIsAdmin(true);
        return true;
      }

      // التحقق من جدول admin_management باستخدام type assertion
      const { data, error } = await supabase
        .from('admin_management' as any)
        .select('*')
        .eq('admin_email', user.email)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }

      const adminStatus = !!data;
      console.log('Admin status determined:', adminStatus, 'for email:', user.email);
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
      return false;
    }
  };

  // تحميل المدن
  const fetchCities = async () => {
    try {
      console.log('useCitiesAndDistricts - Fetching cities...');

      // إزالة فلتر is_active للحصول على جميع المدن
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('useCitiesAndDistricts - Error fetching cities:', error);
        // إذا كان الجدول غير موجود، استخدم بيانات افتراضية
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('useCitiesAndDistricts - Cities table does not exist, using fallback data');
          const fallbackCities = [
            { id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'نيقوسيا', name_en: 'Nicosia', name_tr: 'Lefkoşa', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '2', name_ar: 'ليماسول', name_en: 'Limassol', name_tr: 'Limasol', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '3', name_ar: 'لارنكا', name_en: 'Larnaca', name_tr: 'Larnaka', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '4', name_ar: 'بافوس', name_en: 'Paphos', name_tr: 'Baf', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          ];
          setCities(fallbackCities);
          return fallbackCities;
        }
        // في حالة أخطاء أخرى، استخدم البيانات الاحتياطية أيضاً
        console.log('useCitiesAndDistricts - Using fallback cities due to error');
        const fallbackCities = [
          { id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'نيقوسيا', name_en: 'Nicosia', name_tr: 'Lefkoşa', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          { id: '2', name_ar: 'ليماسول', name_en: 'Limassol', name_tr: 'Limasol', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          { id: '3', name_ar: 'لارنكا', name_en: 'Larnaca', name_tr: 'Larnaka', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          { id: '4', name_ar: 'بافوس', name_en: 'Paphos', name_tr: 'Baf', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        ];
        setCities(fallbackCities);
        return fallbackCities;
      }

      console.log('useCitiesAndDistricts - Cities fetched successfully:', data?.length || 0);
      setCities(data || []);
      return data || [];
    } catch (error) {
      console.error('useCitiesAndDistricts - Failed to fetch cities:', error);
      // استخدم البيانات الاحتياطية في حالة الخطأ
      const fallbackCities = [
        { id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'نيقوسيا', name_en: 'Nicosia', name_tr: 'Lefkoşa', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        { id: '2', name_ar: 'ليماسول', name_en: 'Limassol', name_tr: 'Limasol', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        { id: '3', name_ar: 'لارنكا', name_en: 'Larnaca', name_tr: 'Larnaka', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        { id: '4', name_ar: 'بافوس', name_en: 'Paphos', name_tr: 'Baf', is_active: true, created_at: new Date().toISOString(), created_by: '' },
      ];
      setCities(fallbackCities);
      return fallbackCities;
    }
  };

  // تحميل المناطق
  const fetchDistricts = async () => {
    try {
      console.log('useCitiesAndDistricts - Fetching districts...');

      // إزالة فلتر is_active للحصول على جميع المناطق
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('useCitiesAndDistricts - Error fetching districts:', error);
        // إذا كان الجدول غير موجود، استخدم بيانات افتراضية
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('useCitiesAndDistricts - Districts table does not exist, using fallback data');
          const fallbackDistricts = [
            { id: '2c3bf1f0-8dcd-4ba3-bb82-7f3f9f273bab', city_id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'وسط المدينة', name_en: 'City Center', name_tr: 'Şehir Merkezi', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '2', city_id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'أكروبوليس', name_en: 'Acropolis', name_tr: 'Akropolis', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '3', city_id: '2', name_ar: 'المارينا', name_en: 'Marina', name_tr: 'Marina', is_active: true, created_at: new Date().toISOString(), created_by: '' },
            { id: '4', city_id: '2', name_ar: 'جيرماسويا', name_en: 'Germasogeia', name_tr: 'Germasogeia', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          ];
          setDistricts(fallbackDistricts);
          return fallbackDistricts;
        }
        // في حالة أخطاء أخرى، استخدم البيانات الاحتياطية أيضاً
        console.log('useCitiesAndDistricts - Using fallback districts due to error');
        const fallbackDistricts = [
          { id: '2c3bf1f0-8dcd-4ba3-bb82-7f3f9f273bab', city_id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'وسط المدينة', name_en: 'City Center', name_tr: 'Şehir Merkezi', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          { id: '2', city_id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'أكروبوليس', name_en: 'Acropolis', name_tr: 'Akropolis', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          { id: '3', city_id: '2', name_ar: 'المارينا', name_en: 'Marina', name_tr: 'Marina', is_active: true, created_at: new Date().toISOString(), created_by: '' },
          { id: '4', city_id: '2', name_ar: 'جيرماسويا', name_en: 'Germasogeia', name_tr: 'Germasogeia', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        ];
        setDistricts(fallbackDistricts);
        return fallbackDistricts;
      }

      console.log('useCitiesAndDistricts - Districts fetched successfully:', data?.length || 0);
      setDistricts(data || []);
      return data || [];
    } catch (error) {
      console.error('useCitiesAndDistricts - Failed to fetch districts:', error);
      // استخدم البيانات الاحتياطية في حالة الخطأ
      const fallbackDistricts = [
        { id: '2c3bf1f0-8dcd-4ba3-bb82-7f3f9f273bab', city_id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'وسط المدينة', name_en: 'City Center', name_tr: 'Şehir Merkezi', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        { id: '2', city_id: '016f3b13-88f6-48f7-90a3-ab7b3bcd00a8', name_ar: 'أكروبوليس', name_en: 'Acropolis', name_tr: 'Akropolis', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        { id: '3', city_id: '2', name_ar: 'المارينا', name_en: 'Marina', name_tr: 'Marina', is_active: true, created_at: new Date().toISOString(), created_by: '' },
        { id: '4', city_id: '2', name_ar: 'جيرماسويا', name_en: 'Germasogeia', name_tr: 'Germasogeia', is_active: true, created_at: new Date().toISOString(), created_by: '' },
      ];
      setDistricts(fallbackDistricts);
      return fallbackDistricts;
    }
  };

  // تحميل البيانات عند تشغيل المكون
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;

      console.log('useCitiesAndDistricts - Starting to load data...');
      setLoading(true);

      try {
        // تحميل المدن والمناطق بشكل متوازي بدون انتظار checkAdminStatus
        console.log('useCitiesAndDistricts - Loading cities and districts...');
        await Promise.all([
          fetchCities(),
          fetchDistricts()
        ]);

        // التحقق من صلاحيات الأدمن في الخلفية
        checkAdminStatus().catch(error => {
          console.warn('Admin status check failed:', error);
        });

      } catch (error) {
        console.error('Error loading cities and districts data:', error);
      } finally {
        if (isMounted) {
          console.log('useCitiesAndDistricts - Loading completed');
          setLoading(false);
        }
      }
    };

    // تحميل البيانات دائماً عند أول تشغيل
    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // تحميل مرة واحدة فقط

  // إضافة مدينة جديدة
  const addCity = async (cityData: Omit<City, 'id' | 'created_at' | 'created_by' | 'is_active'>) => {
    if (!isAdmin) {
      toast({
        title: 'خطأ',
        description: 'ليس لديك صلاحيات لإضافة مدن',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('cities')
        .insert({
          ...cityData,
          created_by: user!.id,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setCities(prev => [...prev, data]);
      toast({
        title: 'نجح',
        description: 'تم إضافة المدينة بنجاح',
      });
      return true;
    } catch (error) {
      console.error('Error adding city:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إضافة المدينة',
        variant: 'destructive'
      });
      return false;
    }
  };

  // إضافة منطقة جديدة
  const addDistrict = async (districtData: Omit<District, 'id' | 'created_at' | 'created_by' | 'is_active'>) => {
    if (!isAdmin) {
      toast({
        title: 'خطأ',
        description: 'ليس لديك صلاحيات لإضافة مناطق',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('districts')
        .insert({
          ...districtData,
          created_by: user!.id,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setDistricts(prev => [...prev, data]);
      toast({
        title: 'نجح',
        description: 'تم إضافة المنطقة بنجاح',
      });
      return true;
    } catch (error) {
      console.error('Error adding district:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إضافة المنطقة',
        variant: 'destructive'
      });
      return false;
    }
  };

  // حذف مدينة
  const deleteCity = async (cityId: string) => {
    if (!isAdmin) {
      toast({
        title: 'خطأ',
        description: 'ليس لديك صلاحيات لحذف المدن',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('cities')
        .update({ is_active: false })
        .eq('id', cityId);

      if (error) throw error;

      setCities(prev => prev.filter(city => city.id !== cityId));
      toast({
        title: 'نجح',
        description: 'تم حذف المدينة بنجاح',
      });
      return true;
    } catch (error) {
      console.error('Error deleting city:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف المدينة',
        variant: 'destructive'
      });
      return false;
    }
  };

  // حذف منطقة
  const deleteDistrict = async (districtId: string) => {
    if (!isAdmin) {
      toast({
        title: 'خطأ',
        description: 'ليس لديك صلاحيات لحذف المناطق',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('districts')
        .update({ is_active: false })
        .eq('id', districtId);

      if (error) throw error;

      setDistricts(prev => prev.filter(district => district.id !== districtId));
      toast({
        title: 'نجح',
        description: 'تم حذف المنطقة بنجاح',
      });
      return true;
    } catch (error) {
      console.error('Error deleting district:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في حذف المنطقة',
        variant: 'destructive'
      });
      return false;
    }
  };

  // إزالة console.log لتجنب الطباعة المستمرة
  // console.log('useCitiesAndDistricts:', {
  //   citiesCount: cities.length,
  //   districtsCount: districts.length,
  //   loading,
  //   isAdmin,
  //   userEmail: user?.email
  // });

  return {
    cities,
    districts,
    loading,
    isAdmin,
    addCity,
    addDistrict,
    deleteCity,
    deleteDistrict,
    fetchCities,
    fetchDistricts,
    checkAdminStatus
  };
};
