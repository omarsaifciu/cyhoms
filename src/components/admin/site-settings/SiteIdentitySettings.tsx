
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteSettings } from "@/types/siteSettings";
import { Globe, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";


interface SiteIdentitySettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const SiteIdentitySettings: React.FC<SiteIdentitySettingsProps> = ({ settings, updateSetting, currentLanguage, t }) => {
  const { toast } = useToast();
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);
    try {
      // Use a unique name to avoid caching issues
      const fileName = `favicon-${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `public-assets/${fileName}`;

      // Remove old favicon if it exists to save space (optional)
      if (settings.faviconUrl) {
        const oldFileKey = settings.faviconUrl.substring(settings.faviconUrl.lastIndexOf('public-assets/'));
        if (oldFileKey) {
          await supabase.storage.from('public-assets').remove([oldFileKey]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);
      
      if (publicUrl) {
        updateSetting('faviconUrl', publicUrl);
        toast({ title: currentLanguage === 'ar' ? 'نجح الرفع' : 'Upload Successful', description: currentLanguage === 'ar' ? 'تم تحديث أيقونة الموقع.' : 'Favicon has been updated.' });
      } else {
        throw new Error('Could not get public URL for favicon.');
      }
    } catch (error) {
      console.error("Error uploading favicon:", error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ في الرفع' : 'Upload Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsUploadingFavicon(false);
      // Reset file input to allow re-uploading the same file
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'هوية الموقع' : 'Site Identity'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'إعدادات اسم الموقع ووصفه بجميع اللغات والحد الأقصى للعقارات.' : 'Site name, description (all languages), and max properties settings.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Site Name Section */}
        <div>
          <Label className="text-base font-semibold mb-4 block">
            {currentLanguage === 'ar' ? 'اسم الموقع' : 'Site Name'}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="siteNameAr" className="text-sm">العربية</Label>
              <Input 
                id="siteNameAr"
                value={settings.siteNameAr}
                onChange={(e) => updateSetting('siteNameAr', e.target.value)}
                placeholder="اسم الموقع بالعربية"
              />
            </div>
            <div>
              <Label htmlFor="siteNameEn" className="text-sm">English</Label>
              <Input 
                id="siteNameEn"
                value={settings.siteNameEn}
                onChange={(e) => updateSetting('siteNameEn', e.target.value)}
                placeholder="Site name in English"
              />
            </div>
            <div>
              <Label htmlFor="siteNameTr" className="text-sm">Türkçe</Label>
              <Input 
                id="siteNameTr"
                value={settings.siteNameTr}
                onChange={(e) => updateSetting('siteNameTr', e.target.value)}
                placeholder="Türkçe site adı"
              />
            </div>
          </div>
        </div>

        {/* Site Description Section */}
        <div>
          <Label className="text-base font-semibold mb-4 block">
            {currentLanguage === 'ar' ? 'وصف الموقع' : 'Site Description'}
          </Label>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="siteDescriptionAr" className="text-sm">العربية</Label>
              <Textarea 
                id="siteDescriptionAr"
                value={settings.siteDescriptionAr}
                onChange={(e) => updateSetting('siteDescriptionAr', e.target.value)}
                placeholder="وصف الموقع بالعربية"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="siteDescriptionEn" className="text-sm">English</Label>
              <Textarea 
                id="siteDescriptionEn"
                value={settings.siteDescriptionEn}
                onChange={(e) => updateSetting('siteDescriptionEn', e.target.value)}
                placeholder="Site description in English"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="siteDescriptionTr" className="text-sm">Türkçe</Label>
              <Textarea 
                id="siteDescriptionTr"
                value={settings.siteDescriptionTr}
                onChange={(e) => updateSetting('siteDescriptionTr', e.target.value)}
                placeholder="Türkçe site açıklaması"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Max Properties */}
        <div>
          <Label htmlFor="maxProperties">{currentLanguage === 'ar' ? 'الحد الأقصى للعقارات' : 'Max Properties'}</Label>
          <Input 
            id="maxProperties"
            type="number"
            value={settings.maxProperties}
            onChange={(e) => updateSetting('maxProperties', e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Favicon Section */}
        <div>
          <Label className="text-base font-semibold mb-4 block">
            {currentLanguage === 'ar' ? 'أيقونة الموقع (Favicon)' : 'Favicon'}
          </Label>
          <div className="flex items-center gap-4">
            {settings.faviconUrl && (
              <img src={settings.faviconUrl} alt="Favicon preview" className="w-10 h-10 rounded-md object-contain border p-1" />
            )}
            <div className="flex-1">
              <Input 
                id="favicon-upload" 
                type="file" 
                accept="image/png, image/jpeg, image/svg+xml, image/x-icon"
                onChange={handleFaviconUpload}
                disabled={isUploadingFavicon}
                className="hidden"
              />
              <Button asChild variant="outline" disabled={isUploadingFavicon}>
                <label htmlFor="favicon-upload" className="cursor-pointer flex items-center">
                  {isUploadingFavicon ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentLanguage === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {currentLanguage === 'ar' ? 'رفع أيقونة جديدة' : 'Upload New Favicon'}
                    </>
                  )}
                </label>
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                {currentLanguage === 'ar' ? 'مستحسن: 32x32 أو 64x64 بيكسل (PNG, ICO, SVG).' : 'Recommended: 32x32 or 64x64 pixels (PNG, ICO, SVG).'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteIdentitySettings;
