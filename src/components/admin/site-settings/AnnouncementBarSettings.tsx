
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SiteSettings } from "@/types/siteSettings";

interface AnnouncementBarSettingsProps {
  settings: Partial<SiteSettings>;
  updateSetting: (key: keyof SiteSettings, value: any) => void;
}

const AnnouncementBarSettings = ({ settings, updateSetting }: AnnouncementBarSettingsProps) => {
  const isEnabled = !!settings.announcementBarEnabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle>شريط الإعلانات / Announcement Bar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="announcementBarEnabled" className="font-semibold cursor-pointer">
            تفعيل شريط الإعلانات / Enable Announcement Bar
          </Label>
          <Switch
            id="announcementBarEnabled"
            checked={isEnabled}
            onCheckedChange={(value) => updateSetting('announcementBarEnabled', value)}
          />
        </div>
        
        <div className={`space-y-4 pt-4 border-t transition-opacity ${isEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="space-y-2">
            <Label htmlFor="announcementBarTextAr">النص باللغة العربية</Label>
            <Textarea
              id="announcementBarTextAr"
              dir="rtl"
              value={settings.announcementBarTextAr || ''}
              onChange={(e) => updateSetting('announcementBarTextAr', e.target.value)}
              placeholder="أدخل نص الإعلان باللغة العربية"
              disabled={!isEnabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementBarTextEn">النص باللغة الإنجليزية</Label>
            <Textarea
              id="announcementBarTextEn"
              value={settings.announcementBarTextEn || ''}
              onChange={(e) => updateSetting('announcementBarTextEn', e.target.value)}
              placeholder="Enter announcement text in English"
              disabled={!isEnabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementBarTextTr">النص باللغة التركية</Label>
            <Textarea
              id="announcementBarTextTr"
              value={settings.announcementBarTextTr || ''}
              onChange={(e) => updateSetting('announcementBarTextTr', e.target.value)}
              placeholder="Duyuru metnini Türkçe girin"
              disabled={!isEnabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementBarLink">الرابط (اختياري)</Label>
            <Input
              id="announcementBarLink"
              type="url"
              value={settings.announcementBarLink || ''}
              onChange={(e) => updateSetting('announcementBarLink', e.target.value)}
              placeholder="https://example.com"
              disabled={!isEnabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="announcementBarBackgroundColor">لون الخلفية / Background Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="announcementBarBackgroundColor"
                  type="color"
                  value={settings.announcementBarBackgroundColor || '#3b82f6'}
                  onChange={(e) => updateSetting('announcementBarBackgroundColor', e.target.value)}
                  className="p-1 h-10 w-14 cursor-pointer"
                  disabled={!isEnabled}
                />
                <Input
                  type="text"
                  value={settings.announcementBarBackgroundColor || ''}
                  onChange={(e) => updateSetting('announcementBarBackgroundColor', e.target.value)}
                  placeholder="#3b82f6"
                  disabled={!isEnabled}
                  className="max-w-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementBarTextColor">لون النص / Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="announcementBarTextColor"
                  type="color"
                  value={settings.announcementBarTextColor || '#ffffff'}
                  onChange={(e) => updateSetting('announcementBarTextColor', e.target.value)}
                  className="p-1 h-10 w-14 cursor-pointer"
                  disabled={!isEnabled}
                />
                <Input
                  type="text"
                  value={settings.announcementBarTextColor || ''}
                  onChange={(e) => updateSetting('announcementBarTextColor', e.target.value)}
                  placeholder="#ffffff"
                  disabled={!isEnabled}
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

export default AnnouncementBarSettings;
