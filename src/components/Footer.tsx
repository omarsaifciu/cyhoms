import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageSquare,
  Pin,
  Link as LinkIcon,
  // X as XIcon  // تم إزالة X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import { City } from "@/types/city";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => {
  const { t, currentLanguage } = useLanguage();
  const { settings: siteSettings, loading: siteSettingsLoading } = useSiteSettings();
  const { cities, loading: citiesLoading } = useCitiesAndDistricts();

  // دالة جلب النص حسب اللغة وأولوية القيمة
  function getMultilang(setting: any, key: "ar" | "en" | "tr", fallback = "") {
    if (!setting) return fallback;
    if (key === "ar" && setting.ar) return setting.ar;
    if (key === "en" && setting.en) return setting.en;
    if (key === "tr" && setting.tr) return setting.tr;
    return fallback;
  }
  const getLocalizedContact = (key: "address" | "phone" | "email") => {
    if (!siteSettings) return "";
    
    const langKey = currentLanguage as 'ar' | 'en' | 'tr';

    const values = {
        address: {
            ar: siteSettings.addressAr,
            en: siteSettings.addressEn,
            tr: siteSettings.addressTr,
            fallback: siteSettings.address
        },
        phone: {
            ar: siteSettings.phoneNumberAr,
            en: siteSettings.phoneNumberEn,
            tr: siteSettings.phoneNumberTr,
            fallback: siteSettings.phoneNumber
        },
        email: {
            ar: siteSettings.siteEmailAddressAr,
            en: siteSettings.siteEmailAddressEn,
            tr: siteSettings.siteEmailAddressTr,
            fallback: siteSettings.siteEmailAddress
        }
    };

    const targetValues = values[key];
    const preferredValue = targetValues[langKey];

    if (preferredValue && preferredValue.trim()) {
        return preferredValue;
    }
    
    // Fallback logic: check other languages before generic fallback
    if (targetValues.en && targetValues.en.trim()) return targetValues.en;
    if (targetValues.ar && targetValues.ar.trim()) return targetValues.ar;
    if (targetValues.tr && targetValues.tr.trim()) return targetValues.tr;

    return targetValues.fallback || "";
  };

  // التحقق من تفعيل/إلغاء
  const isContactFieldVisible = (field: "address" | "phone" | "email") => {
    if (!siteSettings) return false;
    if (field === "address") return siteSettings.contactAddressEnabled !== false;
    if (field === "phone") return siteSettings.contactPhoneEnabled !== false;
    if (field === "email") return siteSettings.contactEmailEnabled !== false;
    return false;
  };

  // جلب اسم المدينة حسب اللغة الحالية
  const getLocalizedCityName = (city: City) => {
    if (currentLanguage === "ar") return city.name_ar;
    if (currentLanguage === "tr") return city.name_tr;
    return city.name_en;
  };

  // عند الضغط على مدينة يرسل ايفنت لخارج الفوتر 
  const handleCityClick = (cityId: string) => {
    const event = new CustomEvent('footer-city-select', { detail: cityId });
    window.dispatchEvent(event);
  };

  // استرجاع روابط السوشيال مع تويتر بشعاره الأصلي فقط
  const socialLinks = [
    { Icon: Facebook, href: siteSettings?.facebookUrl || "#", name: "Facebook", condition: !!siteSettings?.facebookUrl },
    { Icon: Youtube, href: siteSettings?.youtubeUrl || "#", name: "YouTube", condition: !!siteSettings?.youtubeUrl },
    { Icon: MessageSquare, href: siteSettings?.whatsappLink || "#", name: "WhatsApp", condition: !!siteSettings?.whatsappLink },
    { Icon: Instagram, href: siteSettings?.instagramUrl || "#", name: "Instagram", condition: !!siteSettings?.instagramUrl },
    { Icon: Twitter, href: siteSettings?.twitterUrl || "#", name: "Twitter", condition: !!siteSettings?.twitterUrl },
    { Icon: Linkedin, href: siteSettings?.linkedinUrl || "#", name: "LinkedIn", condition: !!siteSettings?.linkedinUrl },
    { Icon: LinkIcon, href: siteSettings?.tiktokUrl || "#", name: "TikTok", condition: !!siteSettings?.tiktokUrl },
    { Icon: LinkIcon, href: siteSettings?.snapchatUrl || "#", name: "Snapchat", condition: !!siteSettings?.snapchatUrl },
    { Icon: Pin, href: siteSettings?.pinterestUrl || "#", name: "Pinterest", condition: !!siteSettings?.pinterestUrl }
  ].filter(link => link.condition);

  // المدن الرئيسية: كل المدن الفعالة في النظام
  const mainCities = cities.filter(city => city.is_active);

  // Add this utility to get current language site description
  function getLocalizedSiteDescription() {
    if (!siteSettings) return "";
    if (currentLanguage === "ar" && siteSettings.siteDescriptionAr) return siteSettings.siteDescriptionAr;
    if (currentLanguage === "tr" && siteSettings.siteDescriptionTr) return siteSettings.siteDescriptionTr;
    if (currentLanguage === "en" && siteSettings.siteDescriptionEn) return siteSettings.siteDescriptionEn;
    return siteSettings.siteDescriptionEn || siteSettings.siteDescriptionAr || siteSettings.siteDescriptionTr || t("footerDescription");
  }

  return (
    <footer className="bg-white/80 dark:bg-[#181926]/95 dark:text-gray-200 backdrop-blur-md text-gray-800 border-t border-gray-200 dark:border-[#232433]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Site Info and Logo */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-500 dark:text-gray-300 mb-4 text-sm">
              {getLocalizedSiteDescription()}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4 rtl:space-x-reverse flex-wrap gap-y-2">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 dark:text-gray-300 hover:text-brand-accent"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                      <social.Icon className="w-5 h-5" />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-500 dark:text-gray-300 hover:text-brand-accent transition-colors">{t('home')}</a></li>
              <li><a href="/about" className="text-gray-500 dark:text-gray-300 hover:text-brand-accent transition-colors">{t('about')}</a></li>
              <li><a href="/contact" className="text-gray-500 dark:text-gray-300 hover:text-brand-accent transition-colors">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Main Cities (desktop & tablet only) */}
          <div className="lg:col-span-1 hidden md:block">
            <h3 className="text-lg font-semibold mb-4">{t('mainCities') || "Main Cities"}</h3>
            {citiesLoading ? (
              <div className="text-gray-400 dark:text-gray-400 text-sm">{t('loading') || "Loading..."}</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {mainCities.length === 0 ? (
                  <li className="text-gray-400 dark:text-gray-400 text-sm">{t('noCitiesFound') || "No cities found"}</li>
                ) : (
                  mainCities.map(city => (
                    <li key={city.id}>
                      <button
                        type="button"
                        onClick={() => handleCityClick(city.id)}
                        className="text-gray-500 dark:text-gray-300 hover:text-brand-accent transition-colors text-sm text-left px-0 bg-transparent focus:outline-none"
                      >
                        {getLocalizedCityName(city)}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t('contactUs')}</h3>
            <div className="space-y-3">
              {isContactFieldVisible("address") && (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{getLocalizedContact("address") || t('nicosiaLocation')}</span>
                </div>
              )}
              {isContactFieldVisible("phone") && (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Phone className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm text-left dir-ltr">{getLocalizedContact("phone") || "+90 555 123 4567"}</span>
                </div>
              )}
              {siteSettings?.supportEmail && (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Mail className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{siteSettings.supportEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-[#232433]/60 mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            © {new Date().getFullYear()} {siteSettingsLoading || !siteSettings ? t('cyprusRentals') : (currentLanguage === 'ar' ? siteSettings.siteNameAr : currentLanguage === 'tr' ? siteSettings.siteNameTr : siteSettings.siteNameEn) || t('cyprusRentals')}. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
