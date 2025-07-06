import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteSettings } from "@/types/siteSettings";
import { Home, Trash2, EyeOff, Eye, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface GeneralContactSettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const languages = [
  { key: "ar", label: "العربية" },
  { key: "en", label: "English" },
  { key: "tr", label: "Türkçe" },
];

const enableKeys: Record<string, keyof SiteSettings> = {
  address: "contactAddressEnabled",
  phone: "contactPhoneEnabled",
  email: "contactEmailEnabled",
  whatsapp: "contactWhatsappEnabled",
};

const GeneralContactSettings: React.FC<GeneralContactSettingsProps> = ({ settings, updateSetting, currentLanguage, t }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          {currentLanguage === 'ar' ? 'معلومات الاتصال العامة (للفوتر وصفحة التواصل)' : 'General Contact Information (for Footer & Contact Page)'}
        </CardTitle>
        <CardDescription>
          {currentLanguage === 'ar' ? 'العنوان ورقم الهاتف والبريد الإلكتروني وروابط التواصل التي تظهر في الموقع.' : 'Site address, phone number, general email and contact links shown on the site.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {["address", "phoneNumber", "siteEmailAddress"].map((field, idx) => {
          let fieldLabel = "";
          let fieldPlace = "";
          if (field === "address") {
            fieldLabel = currentLanguage === "ar" ? "العنوان" : "Address";
            fieldPlace = currentLanguage === "ar" ? "أدخل عنوان الموقع" : "Enter site address";
          }
          if (field === "phoneNumber") {
            fieldLabel = currentLanguage === "ar" ? "رقم الهاتف" : "Phone Number";
            fieldPlace = currentLanguage === "ar" ? "أدخل رقم الهاتف" : "Enter phone number";
          }
          if (field === "siteEmailAddress") {
            fieldLabel = currentLanguage === "ar" ? "البريد الإلكتروني للموقع" : "Site Email Address";
            fieldPlace = currentLanguage === "ar" ? "أدخل بريد الموقع" : "Enter site email address";
          }

          // لربط حقول اللغات
          const perLangProps = {
            ar: field === "address" ? "addressAr" : field === "phoneNumber" ? "phoneNumberAr" : "siteEmailAddressAr",
            en: field === "address" ? "addressEn" : field === "phoneNumber" ? "phoneNumberEn" : "siteEmailAddressEn",
            tr: field === "address" ? "addressTr" : field === "phoneNumber" ? "phoneNumberTr" : "siteEmailAddressTr",
          };

          const enableKeys: Record<string, keyof SiteSettings> = {
            address: "contactAddressEnabled",
            phone: "contactPhoneEnabled",
            email: "contactEmailEnabled",
          };

          const isEnabled = settings[enableKeys[field === "address" ? "address" : field === "phoneNumber" ? "phone" : "email"]] !== false;

          return (
            <div key={field} className="border p-4 rounded-md shadow-sm relative bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Label className="font-semibold">{fieldLabel}</Label>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={val => updateSetting(enableKeys[field === "address" ? "address" : field === "phoneNumber" ? "phone" : "email"], val)}
                  className="ml-2 rtl:mr-2 rtl:ml-0"
                />
                <span className="text-xs text-gray-400">{isEnabled ? <Eye className="inline w-4 h-4" /> : <EyeOff className="inline w-4 h-4" />}</span>
                <span className="text-xs text-gray-400 ml-2 rtl:mr-2 rtl:ml-0">{isEnabled ? (currentLanguage === "ar" ? "ظاهر" : "Visible") : (currentLanguage === "ar" ? "مخفي" : "Hidden")}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {languages.map(lang => (
                  <div key={lang.key}>
                    <Label htmlFor={`${field}_${lang.key}`} className="text-xs font-bold">{lang.label}</Label>
                    <Input
                      id={`${field}_${lang.key}`}
                      type={field === "siteEmailAddress" ? "email" : "text"}
                      value={
                        typeof settings[perLangProps[lang.key] as keyof SiteSettings] === "string"
                          ? (settings[perLangProps[lang.key] as keyof SiteSettings] as string)
                          : ""
                      }
                      onChange={e => updateSetting(perLangProps[lang.key] as keyof SiteSettings, e.target.value)}
                      placeholder={fieldPlace + (lang.label ? ` (${lang.label})` : "")}
                      dir={lang.key === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* New WhatsApp Field */}
        <div className="border p-4 rounded-md shadow-sm relative bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5" />
                <Label className="font-semibold">{currentLanguage === 'ar' ? 'واتساب' : 'WhatsApp'}</Label>
                <Switch
                    checked={settings.contactWhatsappEnabled !== false}
                    onCheckedChange={val => updateSetting("contactWhatsappEnabled", val)}
                    className="ml-2 rtl:mr-2 rtl:ml-0"
                />
                <span className="text-xs text-gray-400">{settings.contactWhatsappEnabled !== false ? <Eye className="inline w-4 h-4" /> : <EyeOff className="inline w-4 h-4" />}</span>
                <span className="text-xs text-gray-400 ml-2 rtl:mr-2 rtl:ml-0">{settings.contactWhatsappEnabled !== false ? (currentLanguage === "ar" ? "ظاهر" : "Visible") : (currentLanguage === "ar" ? "مخفي" : "Hidden")}</span>
            </div>
            <div>
                <Label htmlFor="whatsappLink" className="text-xs font-bold">
                    {currentLanguage === 'ar' ? 'رابط واتساب' : 'WhatsApp Link'}
                </Label>
                <Input
                    id="whatsappLink"
                    value={settings.whatsappLink || ""}
                    onChange={e => updateSetting("whatsappLink", e.target.value)}
                    placeholder={'e.g., https://wa.me/1234567890'}
                    dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {currentLanguage === 'ar' ? 'سيظهر في صفحة "تواصل معنا".' : 'Will be displayed on the "Contact Us" page.'}
                </p>
            </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default GeneralContactSettings;
