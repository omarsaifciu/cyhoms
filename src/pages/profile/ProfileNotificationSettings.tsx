import { Loader2, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
interface Props {
  permission: NotificationPermission;
  isSubscribed: boolean;
  isProcessing: boolean;
  handleToggleNotifications: () => void;
  t: (k: string) => string;
}
const ProfileNotificationSettings = ({
  permission,
  isSubscribed,
  isProcessing,
  handleToggleNotifications,
  t
}: Props) => {
  const getNotificationButtonText = () => {
    if (permission === 'denied') return t('notificationsBlocked');
    if (isSubscribed) return t('disableNotifications');
    return t('enableNotifications');
  };
  return <div className="bg-white dark:bg-[#222636] dark:text-foreground p-6 rounded-2xl shadow-lg animate-fade-in transition-all duration-500">
      <div className="flex items-center mb-4">
        <div className="
            p-2 bg-brand-accent-light rounded-full flex-shrink-0
            rtl:ms-8 ltr:mr-5
            sm:rtl:ms-10 sm:ltr:mr-6
          ">
          <Bell className="w-6 h-6 text-brand-accent" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-[18px]">
          {t('notificationSettings')}
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
        {t('notificationSettingsDesc')}
      </p>
      <Button onClick={handleToggleNotifications} disabled={permission === 'denied' || isProcessing} className="w-full" variant={isSubscribed ? "destructive" : "default"}>
        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
            {isSubscribed ? <BellOff className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
            {getNotificationButtonText()}
          </>}
      </Button>
      {permission === 'denied' && <p className="text-red-500 text-xs mt-3 text-center">
          {t('notificationsBlockedDesc')}
        </p>}
      {permission === 'granted' && isSubscribed && <p className="text-green-600 text-xs mt-3 text-center">
          {t('notificationsSubscribed')}
        </p>}
    </div>;
};
export default ProfileNotificationSettings;