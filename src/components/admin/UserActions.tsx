
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, XCircle, Trash2, BadgeCheck, X, Ban, ShieldCheck } from "lucide-react";
import UserTrialActions from "./UserTrialActions";
import SuspensionDialog from "./SuspensionDialog";
import { useSuspensionManagement } from "@/hooks/useSuspensionManagement";

interface UserActionsProps {
  user: {
    id: string;
    email: string;
    user_type: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner';
    is_approved: boolean;
    is_verified?: boolean;
    is_suspended?: boolean;
    suspension_end_date?: string;
    is_trial_active?: boolean;
    trial_started_at?: string;
    full_name?: string;
  };
  onToggleApproval: (userId: string, currentStatus: boolean) => void;
  onToggleVerification: (userId: string, currentStatus: boolean) => void;
  onUpdateUserType: (userId: string, newType: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support') => void;
  onDeleteUser: (userId: string, email: string) => void;
  onTrialUpdated?: () => void;
  onToggleSuspension: (userId: string, currentStatus: boolean) => void;
}

const UserActions = ({ user, onToggleApproval, onUpdateUserType, onDeleteUser, onTrialUpdated, onToggleVerification, onToggleSuspension }: UserActionsProps) => {
  const { currentLanguage } = useLanguage();
  const { unsuspendUser } = useSuspensionManagement();

  const showApprovalAndTrial =
    user.user_type === 'agent' ||
    user.user_type === 'property_owner' ||
    user.user_type === 'real_estate_office' ||
    user.user_type === 'partner_and_site_owner';

  const handleUnsuspend = async () => {
    const result = await unsuspendUser(user.id);
    if (result.success && onTrialUpdated) {
      onTrialUpdated();
    }
  };

  const isTemporarilySuspended = user.is_suspended && user.suspension_end_date;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select
        value={user.user_type}
        onValueChange={(value: 'client' | 'agent' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner' | 'support') =>
          onUpdateUserType(user.id, value)
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="client">{currentLanguage === 'ar' ? 'عميل' : 'Client'}</SelectItem>
          <SelectItem value="agent">{currentLanguage === 'ar' ? 'وسيط' : currentLanguage === 'tr' ? 'Acente' : 'Agent'}</SelectItem>
          <SelectItem value="property_owner">{currentLanguage === 'ar' ? 'مالك عقار' : 'Property Owner'}</SelectItem>
          <SelectItem value="real_estate_office">{currentLanguage === 'ar' ? 'مكتب عقارات' : 'Real Estate Office'}</SelectItem>
          <SelectItem value="partner_and_site_owner">{currentLanguage === 'ar' ? 'شريك ومالك الموقع' : 'Partner & Site Owner'}</SelectItem>
          <SelectItem value="support">{currentLanguage === 'ar' ? 'دعم فني' : currentLanguage === 'tr' ? 'Destek' : 'Support'}</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        size="sm"
        variant={user.is_verified ? "outline" : "default"}
        onClick={() => onToggleVerification(user.id, user.is_verified || false)}
        className="text-xs bg-amber-500 hover:bg-amber-600"
      >
        {user.is_verified ? (
          <>
            <X className="w-3 h-3 mr-1" />
            {currentLanguage === 'ar' ? 'إلغاء التوثيق' : 'Unverify'}
          </>
        ) : (
          <>
            <BadgeCheck className="w-3 h-3 mr-1" />
            {currentLanguage === 'ar' ? 'توثيق' : 'Verify'}
          </>
        )}
      </Button>

      {/* أزرار الحظر المحسنة */}
      {user.is_suspended ? (
        <Button
          size="sm"
          variant="outline"
          onClick={handleUnsuspend}
          className="text-xs text-green-600 border-green-600 hover:bg-green-50"
        >
          <ShieldCheck className="w-3 h-3 mr-1" />
          {currentLanguage === 'ar' ? 'إلغاء الحظر' : (currentLanguage === 'tr' ? 'Aktif Et' : 'Unsuspend')}
          {isTemporarilySuspended && (
            <span className="ml-1 text-xs text-gray-500">
              ({currentLanguage === 'ar' ? 'مؤقت' : 'Temp'})
            </span>
          )}
        </Button>
      ) : (
        <SuspensionDialog
          userId={user.id}
          userName={user.full_name || user.email}
          onSuspensionUpdated={onTrialUpdated || (() => {})}
          trigger={
            <Button
              size="sm"
              variant="outline"
              className="text-xs text-red-600 border-red-600 hover:bg-red-50"
            >
              <Ban className="w-3 h-3 mr-1" />
              {currentLanguage === 'ar' ? 'حظر' : (currentLanguage === 'tr' ? 'Askıya Al' : 'Suspend')}
            </Button>
          }
        />
      )}

      {showApprovalAndTrial && (
        <>
          <Button
            size="sm"
            variant={user.is_approved ? "outline" : "default"}
            onClick={() => onToggleApproval(user.id, user.is_approved)}
            className="text-xs"
          >
            {user.is_approved ? (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                {currentLanguage === 'ar' ? 'إلغاء' : 'Reject'}
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                {currentLanguage === 'ar' ? 'موافقة' : 'Approve'}
              </>
            )}
          </Button>

          <UserTrialActions
            userId={user.id}
            userName={user.full_name || user.email}
            userType={user.user_type}
            isTrialActive={user.is_trial_active || false}
            trialStartedAt={user.trial_started_at}
            onTrialUpdated={onTrialUpdated || (() => {})}
          />
        </>
      )}
      
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDeleteUser(user.id, user.email)}
        className="text-xs"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default UserActions;
