import { MapPin, Bed, Bath, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyInfoSectionProps {
  property: Property;
  getPropertyTitle: () => string;
  getPropertyDescription: () => string;
  getCityName: (cityId: string) => string;
  getDistrictName: (districtId: string) => string;
}

const PropertyInfoSection = ({
  property,
  getPropertyTitle,
  getPropertyDescription,
  getCityName,
  getDistrictName
}: PropertyInfoSectionProps) => {
  const { currentLanguage } = useLanguage();

  const getBedLabel = () => {
    if (currentLanguage === 'ar') return 'غرفة';
    if (currentLanguage === 'tr') return 'yatak odası';
    return 'beds';
  };
  const getBathLabel = () => {
    if (currentLanguage === 'ar') return 'حمام';
    if (currentLanguage === 'tr') return 'banyo';
    return 'baths';
  };
  const getAreaUnit = () => {
    if (currentLanguage === 'ar') return 'م²';
    if (currentLanguage === 'tr') return 'm²';
    return 'm²';
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{getPropertyTitle()}</h2>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{getCityName(property.city)}</span>
          {property.district && (
            <>
              <span> - </span>
              <span>{getDistrictName(property.district)}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-6 text-gray-600 mb-6">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} {getBedLabel()}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} {getBathLabel()}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.area}{getAreaUnit()}</span>
            </div>
          )}
        </div>
        {getPropertyDescription() && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {currentLanguage === 'ar' ? 'الوصف' : currentLanguage === 'tr' ? "Açıklama" : 'Description'}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {getPropertyDescription()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyInfoSection;
