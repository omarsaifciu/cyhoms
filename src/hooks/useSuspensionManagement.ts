import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SuspensionReasons {
  ar: string;
  en: string;
  tr: string;
}

export const useSuspensionManagement = () => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const suspendUser = async (
    userId: string, 
    suspensionType: 'temporary' | 'permanent',
    duration?: string,
    reasons?: SuspensionReasons
  ) => {
    setLoading(true);
    try {
      const suspensionEndDate = suspensionType === 'temporary' && duration 
        ? calculateSuspensionEndDate(duration)
        : null;

      const currentUser = await supabase.auth.getUser();
      const suspendedBy = currentUser.data.user?.id;

      console.log('=== SUSPENSION DEBUG START ===');
      console.log('userId:', userId);
      console.log('suspensionType:', suspensionType);
      console.log('duration:', duration);
      console.log('calculated suspensionEndDate:', suspensionEndDate);
      console.log('is temporary?', suspensionType === 'temporary');
      console.log('=== SUSPENSION DEBUG END ===');

      // إعداد بيانات التحديث - تحسين الكود
      const updateData: {
        is_suspended: boolean;
        suspension_reason: string;
        suspension_reason_ar: string;
        suspension_reason_en: string;
        suspension_reason_tr: string;
        suspended_by: string | undefined;
        suspension_end_date?: string | null;
      } = {
        is_suspended: true,
        suspension_reason: reasons?.en || reasons?.ar || reasons?.tr || '',
        suspension_reason_ar: reasons?.ar || '',
        suspension_reason_en: reasons?.en || '',
        suspension_reason_tr: reasons?.tr || '',
        suspended_by: suspendedBy
      };

      // تعيين تاريخ انتهاء الحظر بوضوح
      if (suspensionType === 'temporary' && suspensionEndDate) {
        updateData.suspension_end_date = suspensionEndDate;
      } else {
        updateData.suspension_end_date = null;
      }

      console.log('=== UPDATE DATA DEBUG ===');
      console.log('Final update data:', JSON.stringify(updateData, null, 2));
      console.log('suspension_end_date value:', updateData.suspension_end_date);
      console.log('suspension_end_date type:', typeof updateData.suspension_end_date);

      // تحديث الملف الشخصي
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (profileError) {
        console.error('=== PROFILE UPDATE ERROR ===');
        console.error('Error:', profileError);
        throw profileError;
      }

      console.log('=== PROFILE UPDATE SUCCESS ===');

      // انتظار قصير للسماح للقاعدة بالتحديث
      await new Promise(resolve => setTimeout(resolve, 500));

      // التحقق من البيانات المحفوظة - جلب كافة البيانات المتعلقة بالحظر
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('id, is_suspended, suspension_end_date, suspension_reason, suspension_reason_ar, suspension_reason_en, suspension_reason_tr, suspended_by')
        .eq('id', userId)
        .single();

      if (verifyError) {
        console.error('=== VERIFICATION ERROR ===');
        console.error('Error:', verifyError);
      } else {
        console.log('=== VERIFICATION SUCCESS ===');
        console.log('Saved data in database:', JSON.stringify(verifyData, null, 2));
        console.log('suspension_end_date value:', verifyData?.suspension_end_date);
        console.log('suspension_end_date type:', typeof verifyData?.suspension_end_date);
        console.log('is_suspended:', verifyData?.is_suspended);
        
        // تحديد نوع الحظر بناءً على البيانات المحفوظة
        const isActuallyTemporary = verifyData?.suspension_end_date !== null && 
                                   verifyData?.suspension_end_date !== undefined && 
                                   verifyData?.suspension_end_date !== '';
        console.log('Is actually temporary (based on saved data):', isActuallyTemporary);
      }

      // إضافة سجل الحظر
      const { error: historyError } = await supabase
        .from('suspension_history')
        .insert({
          user_id: userId,
          suspended_by: suspendedBy,
          suspension_type: suspensionType,
          suspension_duration: duration || null,
          suspension_end: suspensionEndDate,
          reason: reasons?.en || reasons?.ar || reasons?.tr || '',
          reason_ar: reasons?.ar || '',
          reason_en: reasons?.en || '',
          reason_tr: reasons?.tr || ''
        });

      if (historyError) {
        console.error('=== HISTORY INSERT ERROR ===');
        console.error('Error:', historyError);
        throw historyError;
      }

      console.log('=== SUSPENSION COMPLETED SUCCESSFULLY ===');

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' 
          ? `تم ${suspensionType === 'permanent' ? 'حظر المستخدم نهائياً' : 'حظر المستخدم مؤقتاً'}`
          : `User ${suspensionType === 'permanent' ? 'permanently' : 'temporarily'} suspended`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('=== SUSPENSION ERROR ===');
      console.error('Error:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error.message || (currentLanguage === 'ar' ? 'فشل في حظر المستخدم' : 'Failed to suspend user'),
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const unsuspendUser = async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: false,
          suspension_end_date: null,
          suspension_reason: null,
          suspension_reason_ar: null,
          suspension_reason_en: null,
          suspension_reason_tr: null,
          suspended_by: null
        })
        .eq('id', userId);

      if (error) throw error;

      // تحديث سجل الحظر
      await supabase
        .from('suspension_history')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      toast({
        title: currentLanguage === 'ar' ? 'نجح' : 'Success',
        description: currentLanguage === 'ar' ? 'تم إلغاء حظر المستخدم' : 'User suspension removed',
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: error.message || (currentLanguage === 'ar' ? 'فشل في إلغاء الحظر' : 'Failed to remove suspension'),
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const calculateSuspensionEndDate = (duration: string): string => {
    const now = new Date();
    
    switch (duration) {
      case '1_day':
        now.setDate(now.getDate() + 1);
        break;
      case '1_week':
        now.setDate(now.getDate() + 7);
        break;
      case '1_month':
        now.setMonth(now.getMonth() + 1);
        break;
      case '3_months':
        now.setMonth(now.getMonth() + 3);
        break;
      case '6_months':
        now.setMonth(now.getMonth() + 6);
        break;
      case '1_year':
        now.setFullYear(now.getFullYear() + 1);
        break;
      default:
        now.setDate(now.getDate() + 1);
    }
    
    return now.toISOString();
  };

  return {
    suspendUser,
    unsuspendUser,
    loading
  };
};
