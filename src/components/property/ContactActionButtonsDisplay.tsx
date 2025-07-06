
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Share2 } from "lucide-react";
import { City } from '@/types/city';

// تحديث الواجهة لإضافة district info
interface ContactInfoForDisplay {
  ownerName: string;
  ownerAvatar: string | null;
  userType?: string;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  showContactButtons: boolean;
  city?: string;    // cityId
  district?: string; // districtId
}

interface ContactSettingsForDisplay {
  whatsapp_greeting_ar?: string;
  whatsapp_greeting_en?: string;
  whatsapp_greeting_tr?: string;
}

interface ContactActionButtonsDisplayProps {
  contactInfo: ContactInfoForDisplay;
  currentLanguage: 'ar' | 'en' | 'tr';
  settings: ContactSettingsForDisplay | null;
  cities: City[];
  citiesLoading: boolean;
  getCityNameById: (cityId: string) => string | null;
  getDistrictNameById?: (districtId: string) => string | null; // مضافة جديد!
}

const ContactActionButtonsDisplay: React.FC<ContactActionButtonsDisplayProps> = ({
  contactInfo,
  currentLanguage,
  settings,
  cities,
  citiesLoading,
  getCityNameById,
  getDistrictNameById,
}) => {

  const handleWhatsApp = () => {
    if (contactInfo.whatsapp) {
      let propertyPageTitle = "";
      try {
        propertyPageTitle = document.querySelector('title')?.textContent || "";
      } catch {
        propertyPageTitle = "";
      }

      let cityId = contactInfo.city ?? "";
      let districtId = contactInfo.district ?? "";

      // === بناء الرسالة متضمنة المدينة والحي بشكل صحيح ===
      let cityName = "";
      let districtName = "";

      // جلب اسم المدينة إذا متوفر
      if (cityId) {
        const cityLabel = getCityNameById(cityId);
        if (cityLabel) cityName = cityLabel;
      }
      // جلب اسم الحي إذا متوفر والدالة متاحة
      if (districtId && typeof getDistrictNameById === "function") {
        const districtLabel = getDistrictNameById(districtId);
        if (districtLabel) districtName = districtLabel;
      }

      // ===== تحديد نص التحية =====
      let greeting = "";
      if (currentLanguage === "ar" && settings?.whatsapp_greeting_ar?.trim()) {
        greeting = settings.whatsapp_greeting_ar;
      } else if (currentLanguage === "en" && settings?.whatsapp_greeting_en?.trim()) {
        greeting = settings.whatsapp_greeting_en;
      } else if (currentLanguage === "tr" && settings?.whatsapp_greeting_tr?.trim()) {
        greeting = settings.whatsapp_greeting_tr;
      } else {
        greeting =
          currentLanguage === "ar"
            ? "السلام عليكم، أرغب في الاستفسار حول هذا العقار"
            : currentLanguage === "tr"
            ? "Merhaba, bu gayrimenkul hakkında bilgi almak istiyorum"
            : "Hello, I would like to inquire about this property";
      }

      // =========== معالجة سطر الموقع ============
      let cityDistrictLine = ""; // يبدأ فارغًا

      if (cityName && districtName) {
        cityDistrictLine = `🎯 ${cityName} - ${districtName}`;
      } else if (cityName) {
        cityDistrictLine = `🎯 ${cityName}`;
      }
      // إذا لا مدينة ولا حي، يبقى السطر فارغًا (أي لا يضاف)

      // ============= بناء الرسالة النهائية =============
      const messageParts: string[] = [
        greeting,
        "",
        propertyPageTitle,
      ];
      if (cityDistrictLine) {
        messageParts.push("", cityDistrictLine);
      }
      messageParts.push("", window.location.href);

      const message = messageParts.join("\n");

      window.open(
        `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    }
  };

  const handlePhone = () => {
    if (contactInfo.phone) {
      window.open(`tel:${contactInfo.phone}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (contactInfo.email) {
      const subject = currentLanguage === 'ar' 
        ? 'استفسار عن العقار'
        : currentLanguage === 'tr'
        ? 'Emlak Sorgusu'
        : 'Property Inquiry';
      const body = currentLanguage === 'ar' 
        ? `مرحباً، أنا مهتم بهذا العقار: ${window.location.href}`
        : currentLanguage === 'tr'
        ? `Merhaba, bu mülkle ilgileniyorum: ${window.location.href}`
        : `Hello, I'm interested in this property: ${window.location.href}`;
      window.open(`mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: contactInfo.ownerName || (currentLanguage === 'ar' ? 'عقار' : currentLanguage === 'tr' ? 'Emlak' : 'Property'),
        text: currentLanguage === 'ar' ? 'شاهد هذا العقار!' : currentLanguage === 'tr' ? 'Bu mülke göz atın!' : 'Check out this property!',
        url: window.location.href,
      }).catch(error => console.log('Error sharing:', error));
    } else {
      try {
        navigator.clipboard.writeText(window.location.href);
        alert(currentLanguage === 'ar' ? 'تم نسخ الرابط!' : currentLanguage === 'tr' ? 'Bağlantı kopyalandı!' : 'Link copied!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  if (!contactInfo.showContactButtons) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {contactInfo.phone && (
        <Button
          onClick={handlePhone}
          className="w-full h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:brightness-95 flex items-center justify-center gap-2"
          size="lg"
          style={{
            background: 'linear-gradient(135deg, var(--brand-gradient-from-color, #ec489a) 0%, var(--brand-gradient-to-color, #f43f5e) 100%)'
          }}
        >
          <Phone className="w-5 h-5" />
          <span>
            {currentLanguage === 'ar' ? 'اتصل الآن' : currentLanguage === 'tr' ? 'Şimdi Ara' : 'Call Now'}
          </span>
        </Button>
      )}

      {contactInfo.email && (
        <button
          type="button"
          onClick={handleEmail}
          className="w-full bg-white border-2 border-gray-200 text-gray-800 font-medium text-base py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
        >
          <Mail className="w-5 h-5 text-brand-accent" />
          <span>
            {currentLanguage === 'ar' ? 'إرسال رسالة' : currentLanguage === 'tr' ? 'Mesaj Gönder' : 'Send Message'}
          </span>
        </button>
      )}

      {contactInfo.whatsapp && (
        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white font-semibold text-base py-3 rounded-xl flex items-center justify-center gap-2 hover:from-green-500 hover:to-emerald-500 transition-all border-0"
        >
          <MessageCircle className="w-5 h-5" />
          <span>
            {currentLanguage === 'ar' ? 'واتساب' : 'WhatsApp'}
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={handleShare}
        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-700 font-medium text-base py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
      >
        <Share2 className="w-5 h-5" />
        <span>
          {currentLanguage === 'ar' ? 'مشاركة العقار' : currentLanguage === 'tr' ? 'Mülkü Paylaş' : 'Share Property'}
        </span>
      </button>
    </div>
  );
};

export default ContactActionButtonsDisplay;
