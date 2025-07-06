
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, MessageCircle, Loader2 } from "lucide-react";
import { useContactSettings } from "@/hooks/useContactSettings";
import { Textarea } from "@/components/ui/textarea";

const ContactSettings = () => {
  const { currentLanguage } = useLanguage();
  const { settings, loading, saving, updateSetting, saveSettings } = useContactSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">
          {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {currentLanguage === 'ar' ? 'إعدادات التواصل' : 'Contact Settings'}
        </h2>
        <p className="text-gray-600">
          {currentLanguage === 'ar' 
            ? 'إدارة معلومات التواصل المعروضة في تفاصيل العقارات'
            : 'Manage contact information displayed in property details'
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {currentLanguage === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
          </CardTitle>
          <CardDescription>
            {currentLanguage === 'ar' 
              ? 'هذه المعلومات ستظهر في أزرار التواصل بتفاصيل العقارات'
              : 'This information will be displayed in contact buttons on property details'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الهاتف */}
            <div>
              <Label htmlFor="phone_number" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </Label>
              <Input 
                id="phone_number"
                value={settings.phone_number}
                onChange={(e) => updateSetting('phone_number', e.target.value)}
                placeholder={currentLanguage === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentLanguage === 'ar' 
                  ? 'سيتم استخدامه في زر "اتصل الآن"'
                  : 'Will be used for "Call Now" button'
                }
              </p>
            </div>
            {/* البريد */}
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input 
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
                placeholder={currentLanguage === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentLanguage === 'ar' 
                  ? 'سيتم استخدامه في زر "أرسل رسالة"'
                  : 'Will be used for "Send Message" button'
                }
              </p>
            </div>
          </div>
          {/* واتساب */}
          <div>
            <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}
            </Label>
            <Input 
              id="whatsapp_number"
              value={settings.whatsapp_number}
              onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
              placeholder={currentLanguage === 'ar' ? 'أدخل رقم الواتساب (مع رمز البلد)' : 'Enter WhatsApp number (with country code)'}
              dir="ltr"
            />
            <p className="text-xs text-gray-500 mt-1">
              {currentLanguage === 'ar' 
                ? 'مثال: 966501234567 (بدون علامة +)'
                : 'Example: 966501234567 (without + sign)'
              }
            </p>
          </div>
          {/* رسائل الترحيب باللغات الثلاث */}
          <div>
            <Label className="flex items-center gap-2 font-semibold">
              <MessageCircle className="w-4 h-4" />
              {currentLanguage === 'ar' ? 'نص رسالة الواتساب الافتراضية لكل لغة' : 'WhatsApp Default Greeting for Each Language'}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="whatsapp_greeting_ar" className="text-xs font-bold">العربية</Label>
                <Textarea
                  id="whatsapp_greeting_ar"
                  value={settings.whatsapp_greeting_ar ?? ""}
                  onChange={(e) => updateSetting('whatsapp_greeting_ar', e.target.value)}
                  placeholder="مثال: السلام عليكم، أرغب في الاستفسار حول هذا العقار"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp_greeting_en" className="text-xs font-bold">English</Label>
                <Textarea
                  id="whatsapp_greeting_en"
                  value={settings.whatsapp_greeting_en ?? ""}
                  onChange={(e) => updateSetting('whatsapp_greeting_en', e.target.value)}
                  placeholder="Example: Hello, I would like to inquire about this property"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp_greeting_tr" className="text-xs font-bold">Türkçe</Label>
                <Textarea
                  id="whatsapp_greeting_tr"
                  value={settings.whatsapp_greeting_tr ?? ""}
                  onChange={(e) => updateSetting('whatsapp_greeting_tr', e.target.value)}
                  placeholder="Örnek: Merhaba, bu gayrimenkul hakkında bilgi almak istiyorum"
                  rows={2}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentLanguage === 'ar'
                ? 'ستظهر رسالة الترحيب في بداية رسالة الواتساب حسب لغة الزائر'
                : 'Greeting will appear at the top of the WhatsApp message depending on user language'
              }
            </p>
          </div>
          <div className="pt-4 border-t">
            <Button 
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {currentLanguage === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  {currentLanguage === 'ar' ? 'حفظ إعدادات التواصل' : 'Save Contact Settings'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSettings;
