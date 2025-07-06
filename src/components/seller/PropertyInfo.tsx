import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { Property } from "@/types/property";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { getFullPropertyTypeName } from "@/utils/propertyUtils";

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const { currentLanguage, t } = useLanguage();
  const { propertyTypes, loading } = usePropertyTypes();

  const propertyTypeLabel = getFullPropertyTypeName(property, propertyTypes, currentLanguage, loading);

  const propertyTitleRaw = currentLanguage === 'ar' && property.title_ar ? property.title_ar :
         currentLanguage === 'tr' && property.title_tr ? property.title_tr :
         property.title_en || property.title;
  
  const listingTypeText = property.listing_type ? (property.listing_type === 'rent' ? t('forRent') : t('forSale')) : '';

  const forSaleText = t('forSale');
  const forRentText = t('forRent');
  let propertyTitle = propertyTitleRaw;

  if (property.listing_type === 'sale') {
    try {
      propertyTitle = propertyTitle.replace(new RegExp(forSaleText, 'ig'), '');
    } catch (e) {
      console.error(e);
    }
  } else if (property.listing_type === 'rent') {
    try {
      propertyTitle = propertyTitle.replace(new RegExp(forRentText, 'ig'), '');
    } catch (e) {
      console.error(e);
    }
  }
  propertyTitle = propertyTitle.replace(/-\s*$/, '').trim();

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg line-clamp-2">
        {propertyTitle}
        {property.listing_type && (
          <span className="text-gray-600 font-normal">
            {' - '}
            {listingTypeText}
          </span>
        )}
      </h3>
      
      <div className="flex items-center text-gray-600">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="text-sm">{property.city}</span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-gray-600">
        {property.bedrooms && (
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.bedrooms}
          </div>
        )}
        {property.bathrooms && (
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms}
          </div>
        )}
        {property.area && (
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            {property.area}m²
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-blue-600">
            {property.price.toLocaleString()} {property.currency || 'EUR'}
          </p>
          {property.listing_type === 'rent' && (
            <p className="text-xs text-gray-500">
              {currentLanguage === 'ar' ? 'شهرياً' : 'per month'}
            </p>
          )}
        </div>
        <Badge variant="outline">
          {propertyTypeLabel}
        </Badge>
      </div>
    </div>
  );
};

export default PropertyInfo;
