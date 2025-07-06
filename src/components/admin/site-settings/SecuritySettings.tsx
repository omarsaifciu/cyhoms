
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SiteSettings } from "@/types/siteSettings";
import { Shield } from "lucide-react";

interface SecuritySettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ settings, updateSetting, currentLanguage, t }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'إعدادات الأمان والخصوصية للموقع.' : 'Security and privacy settings for the site.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="checkbox"
            id="registrationEnabled"
            checked={settings.registrationEnabled}
            onChange={(e) => updateSetting('registrationEnabled', e.target.checked)}
            className="w-4 h-4 accent-brand-accent"
          />
          <Label htmlFor="registrationEnabled">
            {currentLanguage === 'ar' ? 'السماح بالتسجيل الجديد' : 'Allow New Registrations'}
          </Label>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
            className="w-4 h-4 accent-brand-accent"
          />
          <Label htmlFor="maintenanceMode">
            {currentLanguage === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}
          </Label>
        </div>
        {settings.maintenanceMode && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              {currentLanguage === 'ar' 
                ? 'تحذير: وضع الصيانة سيجعل الموقع غير متاح للمستخدمين العاديين.'
                : 'Warning: Maintenance mode will make the site unavailable to regular users.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
