
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteSettings } from "@/types/siteSettings";
import { Clock } from "lucide-react";

interface PendingApprovalSettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const PendingApprovalSettings: React.FC<PendingApprovalSettingsProps> = ({ 
  settings, 
  updateSetting, 
  currentLanguage 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'إعدادات حساب قيد المراجعة' : 
           currentLanguage === 'tr' ? 'İnceleme Bekleyen Hesap Ayarları' : 
           'Pending Approval Settings'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'رسائل تظهر للمستخدمين عندما تكون حساباتهم قيد المراجعة.' : 
           currentLanguage === 'tr' ? 'Hesapları inceleme beklerken kullanıcılara gösterilen mesajlar.' :
           'Messages shown to users when their accounts are pending approval.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {currentLanguage === 'ar' ? 'عنوان الرسالة' : 
             currentLanguage === 'tr' ? 'Mesaj Başlığı' : 
             'Message Title'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pendingApprovalTitleAr" className="text-sm font-medium">
                العربية
              </Label>
              <Input
                id="pendingApprovalTitleAr"
                value={settings.pendingApprovalTitleAr || ''}
                onChange={(e) => updateSetting('pendingApprovalTitleAr', e.target.value)}
                placeholder="حسابك قيد المراجعة"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="pendingApprovalTitleEn" className="text-sm font-medium">
                English
              </Label>
              <Input
                id="pendingApprovalTitleEn"
                value={settings.pendingApprovalTitleEn || ''}
                onChange={(e) => updateSetting('pendingApprovalTitleEn', e.target.value)}
                placeholder="Account Under Review"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="pendingApprovalTitleTr" className="text-sm font-medium">
                Türkçe
              </Label>
              <Input
                id="pendingApprovalTitleTr"
                value={settings.pendingApprovalTitleTr || ''}
                onChange={(e) => updateSetting('pendingApprovalTitleTr', e.target.value)}
                placeholder="Hesabınız İnceleniyor"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Message Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {currentLanguage === 'ar' ? 'نص الرسالة' : 
             currentLanguage === 'tr' ? 'Mesaj Metni' : 
             'Message Text'}
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="pendingApprovalMessageAr" className="text-sm font-medium">
                العربية
              </Label>
              <Textarea
                id="pendingApprovalMessageAr"
                value={settings.pendingApprovalMessageAr || ''}
                onChange={(e) => updateSetting('pendingApprovalMessageAr', e.target.value)}
                placeholder="شكراً لتسجيلك في منصتنا! حسابك الآن قيد المراجعة من قبل الإدارة..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="pendingApprovalMessageEn" className="text-sm font-medium">
                English
              </Label>
              <Textarea
                id="pendingApprovalMessageEn"
                value={settings.pendingApprovalMessageEn || ''}
                onChange={(e) => updateSetting('pendingApprovalMessageEn', e.target.value)}
                placeholder="Thank you for registering on our platform! Your account is now under review..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="pendingApprovalMessageTr" className="text-sm font-medium">
                Türkçe
              </Label>
              <Textarea
                id="pendingApprovalMessageTr"
                value={settings.pendingApprovalMessageTr || ''}
                onChange={(e) => updateSetting('pendingApprovalMessageTr', e.target.value)}
                placeholder="Platformumuza kaydolduğunuz için teşekkür ederiz! Hesabınız şu anda inceleniyor..."
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className="font-medium mb-2 text-gray-900 dark:text-white">
            {currentLanguage === 'ar' ? 'معاينة' : 
             currentLanguage === 'tr' ? 'Önizleme' : 
             'Preview'}
          </h5>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <strong>
              {currentLanguage === 'ar' ? settings.pendingApprovalTitleAr : 
               currentLanguage === 'tr' ? settings.pendingApprovalTitleTr : 
               settings.pendingApprovalTitleEn}
            </strong>
            <p className="mt-2">
              {currentLanguage === 'ar' ? settings.pendingApprovalMessageAr : 
               currentLanguage === 'tr' ? settings.pendingApprovalMessageTr : 
               settings.pendingApprovalMessageEn}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingApprovalSettings;
