
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactDisplay } from "@/hooks/useContactDisplay";
import { useContactSettings } from "@/hooks/useContactSettings";
import { useCitiesAndDistricts } from "@/hooks/useCitiesAndDistricts";
import ContactActionButtonsDisplay from "./ContactActionButtonsDisplay";
import { City, District } from '@/types/city';

interface PropertyContactButtonsProps {
  propertyId: string;
  ownerId: string;
}

const PropertyContactButtons = ({ propertyId, ownerId }: PropertyContactButtonsProps) => {
  const { currentLanguage } = useLanguage();
  const { contactInfo, loading: contactInfoLoading } = useContactDisplay(propertyId, ownerId);
  const { cities, districts, loading: citiesLoading } = useCitiesAndDistricts();
  const { settings } = useContactSettings();

  if (contactInfoLoading) {
    return (
      <Card className="bg-white dark:bg-[#111726] shadow-lg rounded-2xl transition-colors">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-xl mt-3"></div>
            <div className="h-10 bg-gray-200 rounded-xl mt-3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contactInfo) {
    return null;
  }

  function getCityNameById(cityId: string): string | null {
    const city = cities.find((c: City) => c.id === cityId);
    if (!city) return null;
    if (currentLanguage === "ar") return city.name_ar;
    if (currentLanguage === "tr") return city.name_tr;
    return city.name_en;
  }

  function getDistrictNameById(districtId: string): string | null {
    if (!districts) return null;
    const district = districts.find((d: District) => d.id === districtId);
    if (!district) return null;
    if (currentLanguage === "ar") return district.name_ar;
    if (currentLanguage === "tr") return district.name_tr;
    return district.name_en;
  }

  return (
    <Card className="bg-white dark:bg-[#111726] shadow-lg rounded-2xl transition-colors">
      <CardContent className="p-4 space-y-4">
        {/* Contact Action Buttons */}
        {contactInfo.showContactButtons && (
          <ContactActionButtonsDisplay
            contactInfo={{
              ownerName: contactInfo.ownerName,
              ownerAvatar: contactInfo.ownerAvatar,
              userType: contactInfo.userType,
              phone: contactInfo.phone,
              email: contactInfo.email,
              whatsapp: contactInfo.whatsapp,
              showContactButtons: contactInfo.showContactButtons,
              city: (contactInfo as any).city,
              district: (contactInfo as any).district,
            }}
            currentLanguage={currentLanguage}
            settings={settings as any}
            cities={cities}
            citiesLoading={citiesLoading}
            getCityNameById={getCityNameById}
            getDistrictNameById={getDistrictNameById}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyContactButtons;
