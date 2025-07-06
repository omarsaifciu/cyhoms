
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Upload, Image, Type, Eye } from "lucide-react";
import { useLogoSettings, LogoSettings } from "@/hooks/useLogoSettings";

const languageOptions = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' }
];
const modeOptions = [
  { code: 'light', label: 'فاتح', en: 'Light' },
  { code: 'dark', label: 'داكن', en: 'Dark' }
];
const logoFields: Record<string, { light: keyof LogoSettings; dark: keyof LogoSettings }> = {
  ar: { light: "logo_ar_light_url", dark: "logo_ar_dark_url" },
  en: { light: "logo_en_light_url", dark: "logo_en_dark_url" },
  tr: { light: "logo_tr_light_url", dark: "logo_tr_dark_url" }
};

const LogoManager = () => {
  const { currentLanguage } = useLanguage();
  const { logoSettings, loading, saving, updateLogoSettings, uploadLogoFile } = useLogoSettings();

  const [logoType, setLogoType] = useState<'text' | 'image' | 'svg'>(logoSettings?.logo_type || 'text');
  const [textSettings, setTextSettings] = useState({
    ar: logoSettings?.logo_text_ar || '',
    en: logoSettings?.logo_text_en || '',
    tr: logoSettings?.logo_text_tr || ''
  });
  // تخزين ملفات كل لغة/وضع
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string | null }>({});

  // handle file selection لكل خانة شعار معيّن
  const handleFileSelect = (lang: string, mode: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const key = `${lang}_${mode}`;
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [key]: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [key]: url }));
    }
  };

  const handleSave = async () => {
    try {
      let newSettings: Partial<LogoSettings> = {
        logo_type: logoType
      };

      if (logoType === 'text') {
        newSettings = {
          ...newSettings,
          logo_text_ar: textSettings.ar,
          logo_text_en: textSettings.en,
          logo_text_tr: textSettings.tr,
          logo_ar_light_url: null,
          logo_ar_dark_url: null,
          logo_en_light_url: null,
          logo_en_dark_url: null,
          logo_tr_light_url: null,
          logo_tr_dark_url: null
        };
      } else if (logoType === 'image' || logoType === 'svg') {
        // رفع كل ملف جديد للمكان الصحيح
        for (const langOpt of languageOptions) {
          for (const modeOpt of modeOptions) {
            const key = `${langOpt.code}_${modeOpt.code}`;
            let url = logoSettings?.[logoFields[langOpt.code][modeOpt.code]] || null;
            if (selectedFiles[key]) {
              url = await uploadLogoFile(selectedFiles[key]!, langOpt.code, modeOpt.code, logoType);
            }
            newSettings[logoFields[langOpt.code][modeOpt.code]] = url;
          }
        }
        newSettings = {
          ...newSettings,
          logo_text_ar: null,
          logo_text_en: null,
          logo_text_tr: null,
        };
      }

      await updateLogoSettings(newSettings);
    } catch (error) {
      // ... التعامل مع الأخطاء في الـ toast حاضر بالفعل
    }
  };

  const renderPreview = () => {
    if (logoType === 'text') {
      const text = textSettings[currentLanguage as keyof typeof textSettings] || textSettings.en;
      return text ? (
        <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{text}</span>
      ) : (
        <span className="text-gray-400">معاينة النص</span>
      );
    } else if (logoType === 'image' || logoType === 'svg') {
      return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {languageOptions.map(lang => (
            <div key={lang.code}>
              <div className="font-semibold mb-1 text-center">{lang.label}</div>
              <div className="flex gap-2">
                {modeOptions.map(mode => {
                  const key = `${lang.code}_${mode.code}`;
                  const value = previewUrls[key] || (logoSettings && logoSettings[logoFields[lang.code][mode.code]]) || null;
                  return (
                    <div key={mode.code} className="flex flex-col items-center">
                      <div className="text-xs mb-1">{mode.en}</div>
                      {value ? (
                        <img src={value} alt={`${lang.code} ${mode.code} logo`} className="max-h-10 max-w-[90px] border rounded bg-white" />
                      ) : (
                        <div className="w-20 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">—</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">
            {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'إدارة الشعار' : 'Logo Management'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar'
            ? 'قم بتخصيص شعار الموقع - يمكنك استخدام نص أو صورة أو ملف SVG، ولكل لغة شعار مستقل ولوضع الليل والنهار'
            : 'Customize the site logo - use text, images, or SVG. Each language and light/dark mode can have a separate logo.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* معاينة الشعار */}
        <div>
          <Label className="text-base font-semibold mb-4 block">
            <Eye className="w-4 h-4 inline mr-2" />
            {currentLanguage === 'ar' ? 'معاينة الشعار' : 'Logo Preview'}
          </Label>
          <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-center min-h-[80px]">
            {renderPreview()}
          </div>
        </div>

        {/* نوع الشعار */}
        <div>
          <Label className="text-base font-semibold mb-4 block">
            {currentLanguage === 'ar' ? 'نوع الشعار' : 'Logo Type'}
          </Label>
          <RadioGroup value={logoType} onValueChange={(v: any) => setLogoType(v)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="text" />
              <Label htmlFor="text" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'نص' : 'Text'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="image" />
              <Label htmlFor="image" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'صورة' : 'Image'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="svg" id="svg" />
              <Label htmlFor="svg" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'ملف SVG' : 'SVG File'}
              </Label>
            </div>
          </RadioGroup>
        </div>

        {logoType === 'text' && (
          <div>
            <Label className="text-base font-semibold mb-4 block">
              {currentLanguage === 'ar' ? 'نص الشعار بجميع اللغات' : 'Logo text for all languages'}
            </Label>
            <div className="grid grid-cols-1 gap-4">
              {languageOptions.map(lang => (
                <div key={lang.code}>
                  <Label htmlFor={`logo_text_${lang.code}`} className="text-sm">{lang.label}</Label>
                  <Input
                    id={`logo_text_${lang.code}`}
                    value={textSettings[lang.code as keyof typeof textSettings]}
                    onChange={e =>
                      setTextSettings(prev => ({
                        ...prev,
                        [lang.code]: e.target.value
                      }))
                    }
                    placeholder={lang.label}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {(logoType === 'image' || logoType === 'svg') && (
          <div>
            <Label className="text-base font-semibold mb-4 block">
              {currentLanguage === 'ar'
                ? 'رفع الشعارات لكل لغة ولوضع الليل/النهار'
                : 'Upload logo for each language and light/dark mode'}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {languageOptions.map(lang => (
                <div key={lang.code} className="border rounded p-2">
                  <div className="font-medium mb-2 text-center">{lang.label}</div>
                  {modeOptions.map(mode => {
                    const inputId = `file_${lang.code}_${mode.code}`;
                    const prev =
                      previewUrls[`${lang.code}_${mode.code}`] ||
                      (logoSettings && logoSettings[logoFields[lang.code][mode.code]]) ||
                      null;
                    return (
                      <div key={mode.code} className="mb-3 flex flex-col items-center">
                        <Label htmlFor={inputId} className="block text-xs mb-1">
                          {mode.en}
                        </Label>
                        <Input
                          id={inputId}
                          type="file"
                          accept={logoType === 'image' ? 'image/*' : '.svg,image/svg+xml'}
                          onChange={handleFileSelect(lang.code, mode.code)}
                          className="mb-2 cursor-pointer file:text-sm file:bg-brand-accent file:text-white"
                        />
                        {prev && (
                          <img src={prev} alt="" className="max-h-8 w-auto border rounded bg-white" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* زر الحفظ */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
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
                <Upload className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'حفظ الشعار' : 'Save Logo'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoManager;
