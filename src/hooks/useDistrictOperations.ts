
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewDistrictForm } from "@/types/city";

export const useDistrictOperations = (isAdmin: boolean, fetchDistricts: () => Promise<void>) => {
  const { currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const addDistrict = async (newDistrict: NewDistrictForm) => {
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
        .from('districts')
        .insert([{
          ...newDistrict,
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم إضافة الحي بنجاح' : 'District added successfully'
      });

      fetchDistricts();
      return true;
    } catch (error: any) {
      console.error('Error adding district:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في إضافة الحي' : 'Failed to add district'),
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteDistrict = async (id: string) => {
    if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا الحي؟' : 'Are you sure you want to delete this district?')) {
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
        .from('districts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم حذف الحي بنجاح' : 'District deleted successfully'
      });

      fetchDistricts();
    } catch (error: any) {
      console.error('Error deleting district:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في حذف الحي' : 'Failed to delete district'),
        variant: 'destructive'
      });
    }
  };

  return {
    addDistrict,
    deleteDistrict
  };
};
