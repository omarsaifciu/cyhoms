
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Database, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import AnnouncementBarSettings from "./site-settings/AnnouncementBarSettings";

const AnnouncementBarManagement = () => {
  const { settings, loading, saving, updateSetting, saveSettings } = useSiteSettings();
  const { currentLanguage } = useLanguage();

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {currentLanguage === 'ar' ? 'إدارة شريط الإعلانات' : 'Announcement Bar Management'}
        </h2>
        <p className="text-gray-600">
          {currentLanguage === 'ar' ? 'تفعيل وتخصيص شريط الإعلانات العلوي.' : 'Enable and customize the top announcement bar.'}
        </p>
      </div>

      <AnnouncementBarSettings
        settings={settings}
        updateSetting={updateSetting}
      />

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
              {currentLanguage === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBarManagement;
