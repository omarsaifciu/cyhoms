import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, RefreshCw, Bell, BellOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import ProfileDetailsCard from "@/components/profile/ProfileDetailsCard";
import { useWebPushNotifications } from "@/hooks/useWebPushNotifications";
import { useTheme } from "next-themes";
import ThemePreferenceField from "@/components/profile/ThemePreferenceField";
import ThemePreferenceCard from "@/components/profile/ThemePreferenceCard";
import ProfileLoading from "./profile/ProfileLoading";
import ProfileError from "./profile/ProfileError";
import ProfileNotFound from "./profile/ProfileNotFound";
import ProfileNotificationSettings from "./profile/ProfileNotificationSettings";
import { applyThemeAndDispatchEvent } from "@/utils/themeUtils";
import { UserProfile } from "@/types/user";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { t, currentLanguage } = useLanguage();
  const { profile, loading, error, updateProfile } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSubscribed, permission, setupPushNotifications, disablePushNotifications, isProcessing } = useWebPushNotifications();
  const { theme, setTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{
    full_name: string;
    username: string;
    phone: string;
    whatsapp_number: string;
    user_type: 'client' | 'seller' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner';
    language_preference: 'ar' | 'en' | 'tr';
    theme_preference: 'dark' | 'light' | 'system';
  }>({
    full_name: profile?.full_name || "",
    username: profile?.username || "",
    phone: profile?.phone || "",
    whatsapp_number: profile?.whatsapp_number || "",
    user_type: (profile?.user_type as 'client' | 'seller' | 'property_owner' | 'real_estate_office' | 'partner_and_site_owner') || "client",
    language_preference: (profile?.language_preference as 'ar' | 'en' | 'tr') || "ar",
    theme_preference: (profile?.theme_preference === "dark" ? "dark" : profile?.theme_preference === "light" ? "light" : "system"),
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [hasSetThemeFromProfile, setHasSetThemeFromProfile] = useState(false);
  const [didApplyThemeFromProfile, setDidApplyThemeFromProfile] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        whatsapp_number: profile.whatsapp_number || '',
        user_type: profile.user_type,
        language_preference: profile.language_preference,
        theme_preference:
          profile.theme_preference === "dark"
            ? "dark"
            : profile.theme_preference === "light"
            ? "light"
            : "system"
      });

      if (!didApplyThemeFromProfile && profile.theme_preference) {
        const desiredTheme =
          profile.theme_preference === "dark"
            ? "dark"
            : profile.theme_preference === "light"
            ? "light"
            : "system";
        if (theme !== desiredTheme) {
          setTheme(desiredTheme);
        }
        setDidApplyThemeFromProfile(true);
      }
    }
  }, [profile, theme, setTheme, didApplyThemeFromProfile]);

  const handleThemeToggle = async (value: "light" | "dark") => {
    setFormData((prev) => ({
      ...prev,
      theme_preference: value as "light" | "dark",
    }));
    applyThemeAndDispatchEvent(setTheme, value);

    const success = await updateProfile({ theme_preference: value });
    if (success) {
      toast({
        title: t('success') || 'نجح',
        description: t('themeUpdated') || 'تم تحديث الوضع بنجاح',
      });
    } else {
      toast({
        title: t('error') || 'خطأ',
        description: t('themeUpdateError') || 'حصل خطأ أثناء حفظ الثيم',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!formData.full_name || !formData.username || !formData.phone) {
        toast({
          title: t('error') || 'خطأ',
          description: t('required_fields_missing') || 'يرجى ملء جميع الحقول المطلوبة',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }

      const updateData: any = {
        full_name: formData.full_name,
        username: formData.username,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp_number,
        user_type: formData.user_type,
        language_preference: formData.language_preference,
        theme_preference: formData.theme_preference === "dark" ? "dark" : "light",
      };

      if (formData.user_type !== "client") {
        updateData.is_approved = false;
      }

      console.log('Updating profile with data:', updateData);
      
      const success = await updateProfile(updateData);
      if (success) {
        toast({
          title: t('success') || 'نجح',
          description: t('profileUpdated') || 'تم تحديث الملف الشخصي بنجاح'
        });
        setIsEditing(false);
        setTheme(
          formData.theme_preference === "dark"
            ? "dark"
            : formData.theme_preference === "light"
            ? "light"
            : "system"
        );
      } else {
        toast({
          title: t('error') || 'خطأ',
          description: t('profileUpdateError') || 'فشل في تحديث الملف الشخصي',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t('error') || 'خطأ',
        description: t('profileUpdateError') || 'فشل في تحديث الملف الشخصي',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      phone: profile?.phone || '',
      whatsapp_number: profile?.whatsapp_number || '',
      user_type: profile?.user_type || 'client',
      language_preference: profile?.language_preference || 'en',
      theme_preference: (profile?.theme_preference as 'dark' | 'light' | 'system') || "system"
    });
    setTheme(profile?.theme_preference || "system");
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (profile) {
      updateProfile({ avatar_url: newAvatarUrl });
    }
  };

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await disablePushNotifications();
    } else {
      await setupPushNotifications();
    }
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (error) {
    return <ProfileError error={error} />;
  }

  if (!profile) {
    return <ProfileNotFound />;
  }

  const getNotificationButtonText = () => {
    if (permission === 'denied') return t('notificationsBlocked');
    if (isSubscribed) return t('disableNotifications');
    return t('enableNotifications');
  };

  // Create a properly typed profile object for components
  const profileForCards: UserProfile = {
    ...profile,
    created_at: profile.created_at || new Date().toISOString(),
    updated_at: profile.updated_at || new Date().toISOString(),
    full_name: profile.full_name || '',
    user_type: profile.user_type,
    language_preference: profile.language_preference,
    theme_preference: profile.theme_preference,
    username: profile.username || '',
    phone: profile.phone || '',
    is_approved: profile.is_approved ?? false
  };

  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br to-brand-gradient-to-light dark:bg-[#222636] py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-full p-2 md:p-3 shrink-0 px-[16px] py-[8px]">
            {currentLanguage === 'ar' ? (
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex-1 text-gray-900 dark:text-white truncate">
            {t('profile')}
          </h1>
        </div>

        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#222636] dark:text-foreground rounded-2xl shadow-lg p-4 transition-colors duration-300">
              <ProfileSummaryCard
                profile={profileForCards}
                user={user!}
                onAvatarUpdate={handleAvatarUpdate}
              />
              <div className="mt-16">
                <ThemePreferenceCard
                  value={formData.theme_preference === "dark" ? "dark" : "light"}
                  onChange={handleThemeToggle}
                  isEditing={true}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            {profileForCards.user_type === "partner_and_site_owner" && profileForCards.is_approved === false && (
              <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900 rounded-xl px-4 py-3 mb-2 flex items-center gap-3 shadow">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span>
                  {t('approvalPending_partner') ||
                    "طلبك للتحويل إلى شريك ومالك الموقع قيد المراجعة من الأدمن. سيتم إشعارك فور الموافقة."}
                </span>
              </div>
            )}
            <div className="bg-white dark:bg-[#222636] dark:text-foreground rounded-2xl shadow-lg p-6 transition-colors duration-300">
              <ProfileDetailsCard
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isSaving={isSaving}
                formData={formData}
                setFormData={setFormData}
                profile={profileForCards}
                user={user!}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
            <ProfileNotificationSettings
              permission={permission}
              isSubscribed={isSubscribed}
              isProcessing={isProcessing}
              handleToggleNotifications={handleToggleNotifications}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
