
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewCityForm } from "@/types/city";

export const useCityOperations = (isAdmin: boolean, fetchCities: () => Promise<void>, fetchDistricts: () => Promise<void>) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const addCity = async (newCity: NewCityForm) => {
    if (!user) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first',
        variant: 'destructive'
      });
      return false;
    }

    if (!isAdmin) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'لا تملك صلاحيات الإدارة' : 'You do not have admin privileges',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('cities')
        .insert([{
          ...newCity,
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم إضافة المدينة بنجاح' : 'City added successfully'
      });

      fetchCities();
      return true;
    } catch (error: any) {
      console.error('Error adding city:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في إضافة المدينة' : 'Failed to add city'),
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteCity = async (id: string) => {
    if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذه المدينة؟' : 'Are you sure you want to delete this city?')) {
      return;
    }

    if (!isAdmin) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'لا تملك صلاحيات الإدارة' : 'You do not have admin privileges',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cities')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم حذف المدينة بنجاح' : 'City deleted successfully'
      });

      fetchCities();
      fetchDistricts();
    } catch (error: any) {
      console.error('Error deleting city:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في حذف المدينة' : 'Failed to delete city'),
        variant: 'destructive'
      });
    }
  };

  return {
    addCity,
    deleteCity
  };
};
