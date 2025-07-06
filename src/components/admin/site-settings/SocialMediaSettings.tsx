
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteSettings } from "@/types/siteSettings";
import { Link as LinkIcon } from "lucide-react"; // LinkIcon is already imported as Link

interface SocialMediaSettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const SocialMediaSettings: React.FC<SocialMediaSettingsProps> = ({ settings, updateSetting, currentLanguage, t }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'روابط التواصل الاجتماعي (للفوتر)' : 'Social Media Links (for Footer)'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'إدارة روابط التواصل الاجتماعي التي تظهر في الفوتر.' : 'Manage social media links shown in the footer.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input 
            id="facebookUrl"
            value={settings.facebookUrl || ''}
            onChange={(e) => updateSetting('facebookUrl', e.target.value)}
            placeholder="https://facebook.com/yourpage"
          />
        </div>
        <div>
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input 
            id="instagramUrl"
            value={settings.instagramUrl || ''}
            onChange={(e) => updateSetting('instagramUrl', e.target.value)}
            placeholder="https://instagram.com/yourprofile"
          />
        </div>
        <div>
          <Label htmlFor="twitterUrl">Twitter (X) URL</Label>
          <Input 
            id="twitterUrl"
            value={settings.twitterUrl || ''}
            onChange={(e) => updateSetting('twitterUrl', e.target.value)}
            placeholder="https://twitter.com/yourhandle"
          />
        </div>
        <div>
          <Label htmlFor="youtubeUrl">{currentLanguage === 'ar' ? 'رابط يوتيوب' : 'YouTube URL'}</Label>
          <Input 
            id="youtubeUrl"
            value={settings.youtubeUrl || ''}
            onChange={(e) => updateSetting('youtubeUrl', e.target.value)}
            placeholder="https://youtube.com/yourchannel"
          />
        </div>
        <div>
          <Label htmlFor="whatsappLink">{currentLanguage === 'ar' ? 'رابط واتساب' : 'WhatsApp Link'}</Label>
          <Input 
            id="whatsappLink"
            value={settings.whatsappLink || ''}
            onChange={(e) => updateSetting('whatsappLink', e.target.value)}
            placeholder="https://wa.me/yourphonenumber"
          />
        </div>
        <div>
          <Label htmlFor="linkedinUrl">{currentLanguage === 'ar' ? 'رابط لينكدإن' : 'LinkedIn URL'}</Label>
          <Input 
            id="linkedinUrl"
            value={settings.linkedinUrl || ''}
            onChange={(e) => updateSetting('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <Label htmlFor="tiktokUrl">{currentLanguage === 'ar' ? 'رابط تيك توك' : 'TikTok URL'}</Label>
          <Input 
            id="tiktokUrl"
            value={settings.tiktokUrl || ''}
            onChange={(e) => updateSetting('tiktokUrl', e.target.value)}
            placeholder="https://tiktok.com/@yourusername"
          />
        </div>
        <div>
          <Label htmlFor="snapchatUrl">{currentLanguage === 'ar' ? 'رابط سناب شات' : 'Snapchat URL'}</Label>
          <Input 
            id="snapchatUrl"
            value={settings.snapchatUrl || ''}
            onChange={(e) => updateSetting('snapchatUrl', e.target.value)}
            placeholder="https://snapchat.com/add/yourusername"
          />
        </div>
        <div>
          <Label htmlFor="pinterestUrl">{currentLanguage === 'ar' ? 'رابط بينتريست' : 'Pinterest URL'}</Label>
          <Input 
            id="pinterestUrl"
            value={settings.pinterestUrl || ''}
            onChange={(e) => updateSetting('pinterestUrl', e.target.value)}
            placeholder="https://pinterest.com/yourusername"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettings;
