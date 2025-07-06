
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Database, Loader2 } from "lucide-react";
import HeroBackgroundManager from "./HeroBackgroundManager";
import LogoManager from "./LogoManager";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import SuspensionSettings from "./SuspensionSettings";

// Import the new sub-components
import SiteIdentitySettings from "./site-settings/SiteIdentitySettings";
import AppearanceSettings from "./site-settings/AppearanceSettings";
import GeneralContactSettings from "./site-settings/GeneralContactSettings";
import SocialMediaSettings from "./site-settings/SocialMediaSettings";
import EmailSettings from "./site-settings/EmailSettings";
import SecuritySettings from "./site-settings/SecuritySettings";
import HeroSectionSettings from "./site-settings/HeroSectionSettings";
import NotFoundPageSettings from "./site-settings/NotFoundPageSettings";
import PendingApprovalSettings from "./site-settings/PendingApprovalSettings";

const SiteSettings = () => {
  const { currentLanguage, t } = useLanguage();
  const { settings, loading, saving, updateSetting, saveSettings } = useSiteSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">
          {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('siteSettings.title')}
        </h2>
        <p className="text-gray-600">
          {t('siteSettings.description')}
        </p>
      </div>

      {/* Logo Manager */}
      <LogoManager />

      {/* Site Identity Settings */}
      <SiteIdentitySettings 
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />

      {/* Hero Section Settings (العنوان والوصف) */}
      <HeroSectionSettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />

      {/* Appearance Settings Card */}
      <AppearanceSettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />
      
      {/* Hero Background Manager */}
      <HeroBackgroundManager
        settings={settings}
        updateSetting={updateSetting}
      />

      {/* General Contact Information Card (for Footer) */}
      <GeneralContactSettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />

      {/* Social Media Links Card */}
      <SocialMediaSettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />
      
      {/* Email Settings */}
      <EmailSettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />

      {/* Security Settings */}
      <SecuritySettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />

      {/* Pending Approval Settings */}
      <PendingApprovalSettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
      />

      {/* Not Found (404) Page Settings */}
      <NotFoundPageSettings
        settings={settings}
        updateSetting={updateSetting}
        t={t}
      />

      {/* Suspension Settings */}
      <SuspensionSettings />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent/90 text-brand-accent-foreground"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'حفظ جميع الإعدادات' : 'Save All Settings'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SiteSettings;
