
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Database, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import AboutPageSettings from "./site-settings/AboutPageSettings";

const AboutPageManagement = () => {
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
      <AboutPageSettings
        settings={settings}
        updateSetting={updateSetting}
        currentLanguage={currentLanguage}
        t={t}
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
              {currentLanguage === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AboutPageManagement;

