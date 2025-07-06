
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useUserActions = (refreshUsers: () => Promise<void>) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('Toggling approval for user:', userId, 'current status:', currentStatus);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_approved: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating approval:', error);
        throw error;
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث حالة الموافقة' : 'Approval status updated'
      });

      await refreshUsers();
    } catch (error) {
      console.error('Error in toggleApproval:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحديث الحالة' : 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const toggleSuspension = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('Toggling suspension for user:', userId, 'current status:', currentStatus);
      
      const confirmMessage =
        currentLanguage === 'ar' ? 'هل أنت متأكد من إيقاف هذا المستخدم؟' :
        currentLanguage === 'tr' ? 'Bu kullanıcıyı askıya almak istediğinizden emin misiniz?' :
        'Are you sure you want to suspend this user?';

      // إذا كان المستخدم غير محظور وسيتم حظره، اطلب تأكيد
      if (!currentStatus && !confirm(confirmMessage)) {
        return;
      }

      // تحديث حالة الإيقاف في قاعدة البيانات
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_suspended: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        console.error('Suspension update error:', error);
        throw error;
      }

      console.log('Suspension updated successfully:', data);

      // عرض رسالة نجاح
      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: !currentStatus
          ? (currentLanguage === 'ar' ? 'تم إيقاف المستخدم بنجاح' : currentLanguage === 'tr' ? 'Kullanıcı başarıyla askıya alındı' : 'User suspended successfully')
          : (currentLanguage === 'ar' ? 'تم إلغاء إيقاف المستخدم بنجاح' : currentLanguage === 'tr' ? 'Kullanıcı başarıyla aktifleştirildi' : 'User unsuspended successfully'),
      });

      // تحديث قائمة المستخدمين
      await refreshUsers();
    } catch (error: any) {
      console.error('Error in toggleSuspension:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (!currentStatus
          ? (currentLanguage === 'ar' ? 'فشل في إيقاف المستخدم' : currentLanguage === 'tr' ? 'Kullanıcı askıya alınamadı' : 'Failed to suspend user')
          : (currentLanguage === 'ar' ? 'فشل في إلغاء إيقاف المستخدم' : currentLanguage === 'tr' ? 'Kullanıcı aktifleştirilemedi' : 'Failed to unsuspend user')),
        variant: 'destructive',
      });
    }
  };

  const toggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      console.log('Toggling verification for user:', userId, 'current status:', currentStatus);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_verified: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating verification:', error);
        throw error;
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث حالة التوثيق' : 'Verification status updated'
      });

      await refreshUsers();
    } catch (error) {
      console.error('Error in toggleVerification:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحديث حالة التوثيق' : 'Failed to update verification status',
        variant: 'destructive'
      });
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      console.log('Rejecting user and resetting to client:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          user_type: 'client',
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error rejecting user:', error);
        throw error;
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم رفض الطلب وتحويل المستخدم إلى عميل' : 'Request rejected and user converted to client'
      });

      await refreshUsers();
    } catch (error) {
      console.error('Error in rejectUser:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في رفض الطلب' : 'Failed to reject request',
        variant: 'destructive'
      });
    }
  };

  const updateUserType = async (userId: string, newType: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support') => {
    try {
      console.log('Updating user type for:', userId, 'to:', newType);
      
      // Auto-approve clients and support, other roles need approval
      const isApproved = (newType === 'client' || newType === 'support') ? true : false;
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          user_type: newType,
          is_approved: isApproved,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user type:', error);
        throw error;
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم تحديث نوع المستخدم' : 'User type updated'
      });

      await refreshUsers();
    } catch (error) {
      console.error('Error in updateUserType:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في تحديث نوع المستخدم' : 'Failed to update user type',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    const confirmMessage = currentLanguage === 'ar' 
      ? `هل أنت متأكد من حذف المستخدم ${email}؟ سيتم حذف جميع بياناته نهائياً.`
      : `Are you sure you want to delete user ${email}? All their data will be permanently deleted.`;
      
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      console.log('Deleting user:', userId);

      // Delete user's favorites first
      const { error: favoritesError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId);
        
      if (favoritesError) {
        console.error('Error deleting favorites:', favoritesError);
      }

      // Delete user's properties
      const { error: propertiesError } = await supabase
        .from('properties')
        .delete()
        .eq('created_by', userId);
        
      if (propertiesError) {
        console.error('Error deleting properties:', propertiesError);
      }

      // Delete user's property views
      const { error: viewsError } = await supabase
        .from('property_views')
        .delete()
        .eq('viewer_user_id', userId);
        
      if (viewsError) {
        console.error('Error deleting property views:', viewsError);
      }

      // Finally delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

      // Try to delete from auth (this might fail if we don't have admin privileges)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.warn('Could not delete from auth, but profile deleted:', authError);
        }
      } catch (authError) {
        console.warn('Could not delete from auth, but profile deleted:', authError);
      }

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully'
      });

      await refreshUsers();
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error?.message || (currentLanguage === 'ar' ? 'فشل في حذف المستخدم' : 'Failed to delete user'),
        variant: 'destructive'
      });
    }
  };

  const approveAllPending = async (pendingUserIds: string[]) => {
    try {
      if (pendingUserIds.length === 0) {
        toast({
          title: currentLanguage === 'ar' ? 'تنبيه' : 'Notice',
          description: currentLanguage === 'ar' ? 'لا توجد طلبات معلقة' : 'No pending requests',
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .in('id', pendingUserIds);

      if (error) throw error;

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم الموافقة على جميع الطلبات' : 'All requests approved'
      });

      await refreshUsers();
    } catch (error) {
      console.error('Error approving all pending:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'فشل في الموافقة على الطلبات' : 'Failed to approve requests',
        variant: 'destructive'
      });
    }
  };

  return {
    toggleApproval,
    toggleVerification,
    rejectUser,
    updateUserType,
    deleteUser,
    approveAllPending,
    toggleSuspension
  };
};
