
import { useLanguage } from "@/contexts/LanguageContext";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { getPropertyTypeNameByLanguage } from "@/utils/propertyUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PropertyTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const PropertyTypeSelector = ({ 
  value, 
  onChange, 
  required = false, 
  className = "" 
}: PropertyTypeSelectorProps) => {
  const { currentLanguage } = useLanguage();
  const { propertyTypes, loading } = usePropertyTypes();

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label>
          {currentLanguage === 'ar' ? 'نوع العقار' : 
           currentLanguage === 'tr' ? 'Emlak Türü' : 
           'Property Type'}
          {required && ' *'}
        </Label>
        <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] h-10 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="property-type">
        {currentLanguage === 'ar' ? 'نوع العقار' : 
         currentLanguage === 'tr' ? 'Emlak Türü' : 
         'Property Type'}
        {required && ' *'}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger id="property-type">
          <SelectValue 
            placeholder={
              currentLanguage === 'ar' ? 'اختر نوع العقار' : 
              currentLanguage === 'tr' ? 'Emlak türünü seçin' : 
              'Select property type'
            } 
          />
        </SelectTrigger>
        <SelectContent>
          {propertyTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {getPropertyTypeNameByLanguage(type, currentLanguage)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertyTypeSelector;
