
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactDetails = () => {
    const { settings, loading } = useSiteSettings();
    const { currentLanguage, t } = useLanguage();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 h-full">
                <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
            </div>
        );
    }
    
    const getSettingByLang = (ar?: string, en?: string, tr?: string, fallbackValue?: string) => {
        const byLang: { [key: string]: string | undefined } = {
            ar: ar,
            en: en,
            tr: tr
        };
        const langKey = currentLanguage as 'ar' | 'en' | 'tr';
    
        if (byLang[langKey] && byLang[langKey]?.trim()) {
            return byLang[langKey];
        }
    
        // Fallback to any available language if the current one is empty, with English preference
        if (en && en.trim()) return en;
        if (ar && ar.trim()) return ar;
        if (tr && tr.trim()) return tr;

        // Finally, use the generic fallback
        return fallbackValue;
    }

    const addressValue = settings.contactAddressEnabled ? getSettingByLang(settings.addressAr, settings.addressEn, settings.addressTr, settings.address) : null;
    const phoneValue = settings.contactPhoneEnabled ? getSettingByLang(settings.phoneNumberAr, settings.phoneNumberEn, settings.phoneNumberTr, settings.phoneNumber) : null;
    const emailValue = settings.contactEmailEnabled 
        ? (getSettingByLang(settings.siteEmailAddressAr, settings.siteEmailAddressEn, settings.siteEmailAddressTr, settings.siteEmailAddress) || settings.supportEmail)
        : null;

    const contactInfo = [
        {
            key: 'address',
            icon: MapPin,
            title: t('address'),
            value: addressValue,
            href: undefined,
        },
        {
            key: 'phone',
            icon: Phone,
            title: t('phone'),
            value: phoneValue,
            href: phoneValue ? `tel:${phoneValue.replace(/\s/g, '')}` : undefined
        },
        {
            key: 'email',
            icon: Mail,
            title: t('email'),
            value: emailValue,
            href: emailValue ? `mailto:${emailValue}` : undefined
        },
    ].filter(info => info.value);


    return (
        <div className="bg-white dark:bg-[#181c23] rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-[#232535] h-full transition-colors duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-cairo">{t('contactInfoTitle')}</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{t('contactInfoSubtitle')}</p>
            <div className="mt-10 space-y-8">
                {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-brand-accent text-white dark:bg-brand-accent dark:text-white shadow-md shadow-brand-accent/30">
                                <item.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="ms-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                            {item.href ? (
                                <a 
                                    href={item.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-1 text-gray-600 dark:text-gray-200 hover:text-brand-accent transition-colors"
                                    dir={item.key === 'phone' || item.key === 'email' ? 'ltr' : 'auto'}
                                >
                                    {item.value}
                                </a>
                            ) : (
                                <p className="mt-1 text-gray-600 dark:text-gray-200" dir={item.key === 'phone' || item.key === 'email' ? 'ltr' : 'auto'}>{item.value}</p>
                            )}
                        </div>
                    </div>
                ))}
                
                {settings.contactWhatsappEnabled && settings.whatsappLink && (
                     <div className="border-t border-gray-100 dark:border-[#232535] pt-8">
                        <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white text-base py-6">
                            <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" dir="ltr">
                                <MessageCircle className="h-5 w-5" />
                                <span>{t('contactViaWhatsapp')}</span>
                            </a>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactDetails;
