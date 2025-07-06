
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Image as ImageIcon } from "lucide-react";
import BackgroundUploadSection from "./hero/BackgroundUploadSection";
import BackgroundGrid from "./hero/BackgroundGrid";
import { useHeroBackgroundManager } from "@/hooks/useHeroBackgroundManager";
import { SiteSettings } from "@/types/siteSettings";

interface HeroBackgroundManagerProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
}

const HeroBackgroundManager = ({ settings, updateSetting }: HeroBackgroundManagerProps) => {
  const { currentLanguage } = useLanguage();
  const {
    backgrounds,
    uploading,
    loading,
    handleFileUpload,
    setActiveBackground,
    deleteBackground
  } = useHeroBackgroundManager(settings.heroSlideshowEnabled);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'خلفيات الصفحة الرئيسية' : 'Hero Section Backgrounds'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' 
            ? 'إدارة الصور المستخدمة كخلفية للصفحة الرئيسية.'
            : 'Manage images for the hero section background.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BackgroundUploadSection 
          uploading={uploading}
          onFileUpload={handleFileUpload}
        />
        
        <BackgroundGrid 
          backgrounds={backgrounds}
          onSetActive={setActiveBackground}
          onDelete={deleteBackground}
        />
      </CardContent>
    </Card>
  );
};

export default HeroBackgroundManager;

