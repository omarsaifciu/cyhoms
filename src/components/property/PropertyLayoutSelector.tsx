
import { useLanguage } from "@/contexts/LanguageContext";
import { usePropertyLayouts, getPropertyLayoutNameByLanguage } from "@/hooks/usePropertyLayouts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PropertyLayoutSelectorProps {
  value: string;
  onChange: (value: string) => void;
  propertyTypeId?: string;
  required?: boolean;
  className?: string;
}

const PropertyLayoutSelector = ({ 
  value, 
  onChange, 
  propertyTypeId,
  required = false, 
  className = "" 
}: PropertyLayoutSelectorProps) => {
  const { currentLanguage } = useLanguage();
  const { propertyLayouts, loading } = usePropertyLayouts();

  // Filter layouts based on selected property type
  const filteredLayouts = propertyTypeId 
    ? propertyLayouts.filter(layout => layout.property_type_id === propertyTypeId)
    : propertyLayouts;

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label>
          {currentLanguage === 'ar' ? 'تقسيم العقار' : 
           currentLanguage === 'tr' ? 'Emlak Düzeni' : 
           'Property Layout'}
          {required && ' *'}
        </Label>
        <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] h-10 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="property-layout">
        {currentLanguage === 'ar' ? 'تقسيم العقار' : 
         currentLanguage === 'tr' ? 'Emlak Düzeni' : 
         'Property Layout'}
        {required && ' *'}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger id="property-layout" disabled={!propertyTypeId}>
          <SelectValue 
            placeholder={
              !propertyTypeId 
                ? (currentLanguage === 'ar' ? 'اختر نوع العقار أولاً' : 'Select property type first')
                : (currentLanguage === 'ar' ? 'اختر تقسيم العقار' : 'Select property layout')
            } 
          />
        </SelectTrigger>
        <SelectContent>
          {filteredLayouts.map((layout) => (
            <SelectItem key={layout.id} value={layout.id}>
              {getPropertyLayoutNameByLanguage(layout, currentLanguage)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!propertyTypeId && (
        <p className="text-sm text-gray-500">
          {currentLanguage === 'ar' ? 'يجب اختيار نوع العقار أولاً' : 'Please select property type first'}
        </p>
      )}
    </div>
  );
};

export default PropertyLayoutSelector;
