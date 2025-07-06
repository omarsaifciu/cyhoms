
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteSettings } from "@/types/siteSettings";
import { Palette } from "lucide-react";

interface AppearanceSettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ settings, updateSetting, currentLanguage, t }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'إعدادات المظهر' : 'Appearance Settings'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'تخصيص ألوان الموقع الرئيسية والمتدرجة' : 'Customize main and gradient site colors'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="brandAccentColor" className="text-base font-semibold mb-2 block">
            {currentLanguage === 'ar' ? 'لون التمييز (Solid)' : 'Brand Accent Color (Solid)'}
          </Label>
          <div className="flex items-center gap-2">
            <Input 
              id="brandAccentColor"
              type="color"
              value={settings.brandAccentColor}
              onChange={(e) => updateSetting('brandAccentColor', e.target.value)}
              className="p-1 h-10 w-14 block border border-gray-300 cursor-pointer rounded-md"
            />
            <Input
              type="text"
              value={settings.brandAccentColor}
              onChange={(e) => updateSetting('brandAccentColor', e.target.value)}
              placeholder="#ec489a"
              className="max-w-xs"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {currentLanguage === 'ar' ? 'اختر اللون الرئيسي المستخدم في الأزرار والعناصر المميزة.' : 'Select the main accent color used for buttons and highlighted elements.'}
          </p>
        </div>

        <div className="border-t pt-6">
          <Label className="text-base font-semibold mb-2 block">
            {currentLanguage === 'ar' ? 'ألوان التدرج (Gradient)' : 'Gradient Colors'}
          </Label>
           <p className="text-xs text-gray-500 mt-1 mb-4">
            {currentLanguage === 'ar' ? 'اختر الألوان المستخدمة في الأزرار ذات الخلفية المتدرجة.' : 'Select colors for buttons with gradient backgrounds.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gradientFromColor" className="font-medium mb-2 block">
                {currentLanguage === 'ar' ? 'من لون' : 'From Color'}
              </Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="gradientFromColor"
                  type="color"
                  value={settings.gradientFromColor || ''}
                  onChange={(e) => updateSetting('gradientFromColor', e.target.value)}
                  className="p-1 h-10 w-14 block border border-gray-300 cursor-pointer rounded-md"
                />
                <Input
                  type="text"
                  value={settings.gradientFromColor || ''}
                  onChange={(e) => updateSetting('gradientFromColor', e.target.value)}
                  placeholder="#ec489a"
                  className="max-w-xs"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="gradientToColor" className="font-medium mb-2 block">
                {currentLanguage === 'ar' ? 'إلى لون' : 'To Color'}
              </Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="gradientToColor"
                  type="color"
                  value={settings.gradientToColor || ''}
                  onChange={(e) => updateSetting('gradientToColor', e.target.value)}
                  className="p-1 h-10 w-14 block border border-gray-300 cursor-pointer rounded-md"
                />
                <Input
                  type="text"
                  value={settings.gradientToColor || ''}
                  onChange={(e) => updateSetting('gradientToColor', e.target.value)}
                  placeholder="#f43f5e"
                  className="max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
