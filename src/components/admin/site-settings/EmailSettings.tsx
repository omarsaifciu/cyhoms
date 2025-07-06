
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteSettings } from "@/types/siteSettings";

interface EmailSettingsProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({
  settings,
  updateSetting,
  currentLanguage,
  t,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📧</span>
          {currentLanguage === "ar" ? "إيميل الدعم الفني" : "Support Email"}
        </CardTitle>
        <CardDescription>
          {currentLanguage === "ar"
            ? "سيظهر هذا البريد في فوتر الموقع وسيتم إرسال جميع رسائل التواصل إليه."
            : "This email will be displayed in the site footer and all contact form messages will be sent to it."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label htmlFor="supportEmail">
            {currentLanguage === "ar" ? "بريد الدعم الفني" : "Support Email"}
          </Label>
          <Input
            id="supportEmail"
            type="email"
            value={settings.supportEmail || ""}
            onChange={e => updateSetting("supportEmail", e.target.value)}
            placeholder="support@example.com"
            dir="ltr"
          />
          <p className="text-xs text-green-600 mt-1 font-medium">
            {currentLanguage === "ar"
              ? "✓ جميع رسائل نموذج التواصل ستُرسل إلى هذا البريد"
              : "✓ All contact form messages will be sent to this email"}
          </p>
        </div>
        <div>
          <Label htmlFor="phoneNumber">
            {currentLanguage === "ar" ? "رقم الدعم الفني" : "Support Phone"}
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={settings.phoneNumber || ""}
            onChange={e => updateSetting("phoneNumber", e.target.value)}
            placeholder="+1234567890"
            dir="ltr"
          />
          <p className="text-xs text-gray-500 mt-1">
            {currentLanguage === "ar"
              ? "سيظهر هذا الرقم في فوتر الموقع بجانب الاتصال."
              : "This phone number will be displayed in the site footer for visitors to call you."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
