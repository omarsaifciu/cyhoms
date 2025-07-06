
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ban, Loader2 } from "lucide-react";

const SuspensionSettings = () => {
  const { settings, updateSetting, saveSettings, saving, loading } = useSiteSettings();
  const { currentLanguage } = useLanguage();

  const t = {
    ar: {
      title: "إعدادات رسائل الحظر",
      description: "تخصيص الرسائل التي تظهر للمستخدمين الذين تم إيقاف حساباتهم.",
      suspensionTitle: "عنوان رسالة الحظر",
      suspensionMessage: "محتوى رسالة الحظر",
      inArabic: "بالعربية",
      inEnglish: "بالإنجليزية",
      inTurkish: "بالتركية",
      save: "حفظ التغييرات",
      saving: "جارٍ الحفظ...",
      loading: "جاري تحميل الإعدادات...",
    },
    en: {
      title: "Suspension Message Settings",
      description: "Customize the messages shown to users whose accounts have been suspended.",
      suspensionTitle: "Suspension Message Title",
      suspensionMessage: "Suspension Message Content",
      inArabic: "In Arabic",
      inEnglish: "In English",
      inTurkish: "In Turkish",
      save: "Save Changes",
      saving: "Saving...",
      loading: "Loading settings...",
    },
    tr: {
      title: "Askıya Alma Mesajı Ayarları",
      description: "Hesapları askıya alınmış kullanıcılara gösterilen mesajları özelleştirin.",
      suspensionTitle: "Askıya Alma Mesajı Başlığı",
      suspensionMessage: "Askıya Alma Mesajı İçeriği",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ban className="w-5 h-5" />
          {translations.title}
        </CardTitle>
        <CardDescription>{translations.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">{translations.suspensionTitle}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="suspensionTitleAr">{translations.inArabic}</Label>
              <Input id="suspensionTitleAr" value={settings.suspensionTitleAr || ''} onChange={(e) => updateSetting('suspensionTitleAr', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="suspensionTitleEn">{translations.inEnglish}</Label>
              <Input id="suspensionTitleEn" value={settings.suspensionTitleEn || ''} onChange={(e) => updateSetting('suspensionTitleEn', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="suspensionTitleTr">{translations.inTurkish}</Label>
              <Input id="suspensionTitleTr" value={settings.suspensionTitleTr || ''} onChange={(e) => updateSetting('suspensionTitleTr', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">{translations.suspensionMessage}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="suspensionMessageAr">{translations.inArabic}</Label>
              <Textarea id="suspensionMessageAr" value={settings.suspensionMessageAr || ''} onChange={(e) => updateSetting('suspensionMessageAr', e.target.value)} className="min-h-[120px]" />
            </div>
            <div>
              <Label htmlFor="suspensionMessageEn">{translations.inEnglish}</Label>
              <Textarea id="suspensionMessageEn" value={settings.suspensionMessageEn || ''} onChange={(e) => updateSetting('suspensionMessageEn', e.target.value)} className="min-h-[120px]" />
            </div>
            <div>
              <Label htmlFor="suspensionMessageTr">{translations.inTurkish}</Label>
              <Textarea id="suspensionMessageTr" value={settings.suspensionMessageTr || ''} onChange={(e) => updateSetting('suspensionMessageTr', e.target.value)} className="min-h-[120px]" />
            </div>
          </div>
        </div>

        <div>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? translations.saving : translations.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuspensionSettings;
