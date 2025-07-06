
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSuspensionSettings } from "@/hooks/useSuspensionSettings";
import { Ban, Loader2, Clock, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EnhancedSuspensionSettings = () => {
  const { currentLanguage } = useLanguage();
  const { settings, loading, saving, updateSetting } = useSuspensionSettings();

  const t = {
    ar: {
      title: "إعدادات رسائل الحظر المحسنة",
      description: "تخصيص الرسائل التي تظهر للمستخدمين المحظورين مؤقتاً أو دائماً",
      permanent: "الحظر الدائم",
      temporary: "الحظر المؤقت",
      messageTitle: "عنوان الرسالة",
      messageContent: "محتوى الرسالة",
      inArabic: "بالعربية",
      inEnglish: "بالإنجليزية",
      inTurkish: "بالتركية",
      save: "حفظ التغييرات",
      saving: "جارٍ الحفظ...",
      loading: "جاري تحميل الإعدادات...",
    },
    en: {
      title: "Enhanced Suspension Message Settings",
      description: "Customize messages shown to temporarily or permanently suspended users",
      permanent: "Permanent Suspension",
      temporary: "Temporary Suspension",
      messageTitle: "Message Title",
      messageContent: "Message Content",
      inArabic: "In Arabic",
      inEnglish: "In English",
      inTurkish: "In Turkish",
      save: "Save Changes",
      saving: "Saving...",
      loading: "Loading settings...",
    },
    tr: {
      title: "Gelişmiş Askıya Alma Mesajı Ayarları",
      description: "Geçici veya kalıcı olarak askıya alınmış kullanıcılara gösterilen mesajları özelleştirin",
      permanent: "Kalıcı Askıya Alma",
      temporary: "Geçici Askıya Alma",
      messageTitle: "Mesaj Başlığı",
      messageContent: "Mesaj İçeriği",
      inArabic: "Arapça",
      inEnglish: "İngilizce",
      inTurkish: "Türkçe",
      save: "Değişiklikleri Kaydet",
      saving: "Kaydediliyor...",
      loading: "Ayarlar yükleniyor...",
    }
  };
  const translations = t[currentLanguage];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>{translations.loading}</span>
      </div>
    );
  }

  const handleSave = async (settingKey: string) => {
    await updateSetting(settingKey, settings[settingKey]);
  };

  const updateField = (settingKey: string, field: string, value: string) => {
    // تحديث الحالة المحلية فقط، سيتم الحفظ عند الضغط على زر الحفظ
    const updatedSettings = {
      ...settings,
      [settingKey]: {
        ...settings[settingKey],
        [field]: value
      }
    };
    // تحديث الحالة محلياً (يجب إضافة setState في الهوك)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {translations.title}
        </CardTitle>
        <CardDescription>{translations.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="permanent_suspension" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="permanent_suspension" className="flex items-center gap-2">
              <Ban className="w-4 h-4" />
              {translations.permanent}
            </TabsTrigger>
            <TabsTrigger value="temporary_suspension" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {translations.temporary}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="permanent_suspension" className="space-y-6">
            {settings.permanent_suspension && (
              <>
                <div className="space-y-4">
                  <h3 className="font-medium">{translations.messageTitle}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="perm-title-ar">{translations.inArabic}</Label>
                      <Input 
                        id="perm-title-ar" 
                        value={settings.permanent_suspension.title_ar || ''} 
                        onChange={(e) => updateField('permanent_suspension', 'title_ar', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perm-title-en">{translations.inEnglish}</Label>
                      <Input 
                        id="perm-title-en" 
                        value={settings.permanent_suspension.title_en || ''} 
                        onChange={(e) => updateField('permanent_suspension', 'title_en', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perm-title-tr">{translations.inTurkish}</Label>
                      <Input 
                        id="perm-title-tr" 
                        value={settings.permanent_suspension.title_tr || ''} 
                        onChange={(e) => updateField('permanent_suspension', 'title_tr', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">{translations.messageContent}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="perm-message-ar">{translations.inArabic}</Label>
                      <Textarea 
                        id="perm-message-ar" 
                        value={settings.permanent_suspension.message_ar || ''} 
                        onChange={(e) => updateField('permanent_suspension', 'message_ar', e.target.value)}
                        className="min-h-[120px]" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="perm-message-en">{translations.inEnglish}</Label>
                      <Textarea 
                        id="perm-message-en" 
                        value={settings.permanent_suspension.message_en || ''} 
                        onChange={(e) => updateField('permanent_suspension', 'message_en', e.target.value)}
                        className="min-h-[120px]" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="perm-message-tr">{translations.inTurkish}</Label>
                      <Textarea 
                        id="perm-message-tr" 
                        value={settings.permanent_suspension.message_tr || ''} 
                        onChange={(e) => updateField('permanent_suspension', 'message_tr', e.target.value)}
                        className="min-h-[120px]" 
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('permanent_suspension')} disabled={saving}>
                  {saving ? translations.saving : translations.save}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="temporary_suspension" className="space-y-6">
            {settings.temporary_suspension && (
              <>
                <div className="space-y-4">
                  <h3 className="font-medium">{translations.messageTitle}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="temp-title-ar">{translations.inArabic}</Label>
                      <Input 
                        id="temp-title-ar" 
                        value={settings.temporary_suspension.title_ar || ''} 
                        onChange={(e) => updateField('temporary_suspension', 'title_ar', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="temp-title-en">{translations.inEnglish}</Label>
                      <Input 
                        id="temp-title-en" 
                        value={settings.temporary_suspension.title_en || ''} 
                        onChange={(e) => updateField('temporary_suspension', 'title_en', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="temp-title-tr">{translations.inTurkish}</Label>
                      <Input 
                        id="temp-title-tr" 
                        value={settings.temporary_suspension.title_tr || ''} 
                        onChange={(e) => updateField('temporary_suspension', 'title_tr', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">{translations.messageContent}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="temp-message-ar">{translations.inArabic}</Label>
                      <Textarea 
                        id="temp-message-ar" 
                        value={settings.temporary_suspension.message_ar || ''} 
                        onChange={(e) => updateField('temporary_suspension', 'message_ar', e.target.value)}
                        className="min-h-[120px]" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="temp-message-en">{translations.inEnglish}</Label>
                      <Textarea 
                        id="temp-message-en" 
                        value={settings.temporary_suspension.message_en || ''} 
                        onChange={(e) => updateField('temporary_suspension', 'message_en', e.target.value)}
                        className="min-h-[120px]" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="temp-message-tr">{translations.inTurkish}</Label>
                      <Textarea 
                        id="temp-message-tr" 
                        value={settings.temporary_suspension.message_tr || ''} 
                        onChange={(e) => updateField('temporary_suspension', 'message_tr', e.target.value)}
                        className="min-h-[120px]" 
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('temporary_suspension')} disabled={saving}>
                  {saving ? translations.saving : translations.save}
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedSuspensionSettings;
