import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrialActions } from '@/hooks/useTrialActions';
import { Clock, Gift, StopCircle, ChevronDown, Infinity, Loader2 } from 'lucide-react';

interface UserTrialActionsProps {
  userId: string;
  userName: string;
  userType: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support';
  isTrialActive: boolean;
  trialStartedAt?: string;
  onTrialUpdated: () => void;
}

const UserTrialActions = ({ 
  userId, 
  userName, 
  userType, 
  isTrialActive, 
  trialStartedAt,
  onTrialUpdated 
}: UserTrialActionsProps) => {
  const { currentLanguage } = useLanguage();
  const { grantTrial, endTrial, isProcessing } = useTrialActions(onTrialUpdated);
  const [actionType, setActionType] = useState<'grant' | 'permanent' | 'end' | null>(null);

  // فقط البائعين ومالكي العقارات والمكاتب العقارية يمكنهم الحصول على تجربة مجانية
  if (userType === 'client') {
    return null;
  }
  // التحقق من كون التجربة دائمة (تاريخ بداية قديم)
  const isPermanentTrial = trialStartedAt && new Date(trialStartedAt) < new Date('2010-01-01');

  const handleAction = async () => {
    if (!actionType) return;

    if (actionType === 'grant') {
      await grantTrial(userId, userName, false);
    } else if (actionType === 'permanent') {
      await grantTrial(userId, userName, true);
    } else if (actionType === 'end') {
      await endTrial(userId, userName);
    }

    setActionType(null);
  };

  return (
    <div className="flex items-center gap-2">
      {/* حالة التجربة */}
      {isTrialActive && (
        <Badge variant={isPermanentTrial ? "default" : "secondary"} className="text-xs">
          {isPermanentTrial ? (
            <>
              <Infinity className="w-3 h-3 mr-1" />
              {currentLanguage === 'ar' ? 'دائمة' : 'Permanent'}
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 mr-1" />
              {currentLanguage === 'ar' ? 'نشطة' : 'Active'}
            </>
          )}
        </Badge>
      )}

      {/* أزرار الإجراءات */}
      {!isTrialActive ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Gift className="w-4 h-4 mr-1" />
              )}
              {currentLanguage === 'ar' ? 'منح تجربة' : 'Grant Trial'}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setActionType('grant')}>
              <Clock className="w-4 h-4 mr-2" />
              {currentLanguage === 'ar' ? 'تجربة مجانية عادية' : 'Normal Free Trial'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActionType('permanent')}>
              <Infinity className="w-4 h-4 mr-2" />
              {currentLanguage === 'ar' ? 'تجربة مجانية دائمة' : 'Permanent Free Trial'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => setActionType('end')}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <StopCircle className="w-4 h-4 mr-1" />
          )}
          {currentLanguage === 'ar' ? 'إنهاء التجربة' : 'End Trial'}
        </Button>
      )}

      {/* نافذة التأكيد */}
      <AlertDialog open={actionType !== null} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'grant' && (currentLanguage === 'ar' ? 'منح تجربة مجانية؟' : 'Grant Free Trial?')}
              {actionType === 'permanent' && (currentLanguage === 'ar' ? 'منح تجربة مجانية دائمة؟' : 'Grant Permanent Free Trial?')}
              {actionType === 'end' && (currentLanguage === 'ar' ? 'إنهاء التجربة المجانية؟' : 'End Free Trial?')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'grant' && (
                currentLanguage === 'ar' 
                  ? `هل أنت متأكد من أنك تريد منح تجربة مجانية عادية للمستخدم "${userName}"؟`
                  : `Are you sure you want to grant a normal free trial to user "${userName}"?`
              )}
              {actionType === 'permanent' && (
                currentLanguage === 'ar' 
                  ? `هل أنت متأكد من أنك تريد منح تجربة مجانية دائمة للمستخدم "${userName}"؟ ستبقى نشطة حتى تقوم بإغلاقها يدوياً.`
                  : `Are you sure you want to grant a permanent free trial to user "${userName}"? It will remain active until you manually close it.`
              )}
              {actionType === 'end' && (
                currentLanguage === 'ar' 
                  ? `هل أنت متأكد من أنك تريد إنهاء التجربة المجانية للمستخدم "${userName}"؟`
                  : `Are you sure you want to end the free trial for user "${userName}"?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className={actionType === 'end' ? "bg-red-600 hover:bg-red-700" : ""}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {currentLanguage === 'ar' ? 'جارٍ العملية...' : 'Processing...'}
                </>
              ) : (
                <>
                  {actionType === 'grant' && (currentLanguage === 'ar' ? 'منح تجربة' : 'Grant Trial')}
                  {actionType === 'permanent' && (currentLanguage === 'ar' ? 'منح تجربة دائمة' : 'Grant Permanent')}
                  {actionType === 'end' && (currentLanguage === 'ar' ? 'إنهاء التجربة' : 'End Trial')}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserTrialActions;
