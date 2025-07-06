
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useTrialActions = (onTrialUpdated: () => void) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const grantTrial = async (userId: string, userName: string, isPermanent: boolean = false) => {
    setIsProcessing(true);
    try {
      const updateData: any = {
        is_trial_active: true,
        trial_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // إذا كانت التجربة دائمة، نضع تاريخ بعيد جداً
      if (isPermanent) {
        updateData.trial_started_at = '2000-01-01T00:00:00.000Z'; // تاريخ قديم لجعل التجربة لا تنتهي
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Error granting trial:', error);
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'فشل في منح التجربة المجانية' : 'Failed to grant free trial',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: currentLanguage === 'ar' ? 'تم بنجاح' : 'Success',
        description: currentLanguage === 'ar' 
          ? `تم منح ${isPermanent ? 'تجربة مجانية دائمة' : 'تجربة مجانية'} للمستخدم ${userName}`
          : `${isPermanent ? 'Permanent free trial' : 'Free trial'} granted to user ${userName}`,
      });

      onTrialUpdated();
    } catch (error) {
      console.error('Error granting trial:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const endTrial = async (userId: string, userName: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_trial_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error ending trial:', error);
        toast({
          title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
          description: currentLanguage === 'ar' ? 'فشل في إنهاء التجربة المجانية' : 'Failed to end free trial',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: currentLanguage === 'ar' ? 'تم بنجاح' : 'Success',
        description: currentLanguage === 'ar' 
          ? `تم إنهاء التجربة المجانية للمستخدم ${userName}`
          : `Free trial ended for user ${userName}`,
      });

      onTrialUpdated();
    } catch (error) {
      console.error('Error ending trial:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    grantTrial,
    endTrial,
    isProcessing
  };
};
