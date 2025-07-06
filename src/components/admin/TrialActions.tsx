
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StopCircle, Loader2 } from 'lucide-react';

interface TrialActionsProps {
  userId: string;
  userName: string;
  onTrialEnded: () => void;
}

const TrialActions = ({ userId, userName, onTrialEnded }: TrialActionsProps) => {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [isEnding, setIsEnding] = useState(false);

  const handleEndTrial = async () => {
    setIsEnding(true);
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
        description: currentLanguage === 'ar' ? 'تم إنهاء التجربة المجانية' : 'Free trial ended successfully'
      });

      onTrialEnded();
    } catch (error) {
      console.error('Error ending trial:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ' : 'Error',
        description: currentLanguage === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={isEnding}
        >
          {isEnding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <StopCircle className="w-4 h-4" />
          )}
          {currentLanguage === 'ar' ? 'إنهاء التجربة' : 'End Trial'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentLanguage === 'ar' ? 'إنهاء التجربة المجانية؟' : 'End Free Trial?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentLanguage === 'ar' 
              ? `هل أنت متأكد من أنك تريد إنهاء التجربة المجانية للمستخدم "${userName}"؟ لن يتمكن من استعادة التجربة المجانية مرة أخرى.`
              : `Are you sure you want to end the free trial for user "${userName}"? They will not be able to restore the free trial again.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleEndTrial}
            className="bg-red-600 hover:bg-red-700"
            disabled={isEnding}
          >
            {isEnding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {currentLanguage === 'ar' ? 'جارٍ الإنهاء...' : 'Ending...'}
              </>
            ) : (
              currentLanguage === 'ar' ? 'إنهاء التجربة' : 'End Trial'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrialActions;
