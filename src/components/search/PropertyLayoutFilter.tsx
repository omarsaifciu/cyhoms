import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePropertyLayouts, getPropertyLayoutNameByLanguage } from "@/hooks/usePropertyLayouts";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { getPropertyTypeNameByLanguage } from "@/utils/propertyUtils";
import { Label } from "@/components/ui/label";

interface PropertyLayoutFilterProps {
  selectedLayout?: string;
  setSelectedLayout?: (layout: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  selectedPropertyType?: string;
  showAsFilterButton?: boolean;
}

const PropertyLayoutFilter = ({
  selectedLayout,
  setSelectedLayout,
  value,
  onChange,
  label,
  placeholder,
  className = "",
  selectedPropertyType,
  showAsFilterButton = false
}: PropertyLayoutFilterProps) => {
  const { t, currentLanguage } = useLanguage();
  const { propertyLayouts, loading } = usePropertyLayouts();
  const { propertyTypes } = usePropertyTypes();

  // Use either the new props (value/onChange) or the old props (selectedLayout/setSelectedLayout)
  const currentValue = value !== undefined ? value : selectedLayout;
  const handleChange = onChange || setSelectedLayout;

  console.log('Property layouts in filter:', propertyLayouts);
  console.log('Selected property type:', selectedPropertyType);
  console.log('Property types available:', propertyTypes);

  // Helper function to get property type ID from the translated name
  const getPropertyTypeIdFromName = (typeName: string) => {
    if (!typeName || typeName === t('all')) return null;
    
    const propertyType = propertyTypes.find(type => {
      const nameAr = getPropertyTypeNameByLanguage(type, 'ar');
      const nameEn = getPropertyTypeNameByLanguage(type, 'en');
      const nameTr = getPropertyTypeNameByLanguage(type, 'tr');
      
      return nameAr === typeName || nameEn === typeName || nameTr === typeName;
    });
    
    console.log('Found property type for name', typeName, ':', propertyType);
    return propertyType?.id || null;
  };

  // Get the actual property type ID to filter by
  const selectedPropertyTypeId = getPropertyTypeIdFromName(selectedPropertyType || '');
  
  console.log('Selected property type ID:', selectedPropertyTypeId);

  // Filter layouts based on selected property type ID
  const filteredLayouts = selectedPropertyTypeId
    ? propertyLayouts.filter(layout => layout.property_type_id === selectedPropertyTypeId)
    : propertyLayouts;

  console.log('Filtered layouts:', filteredLayouts);

  // Check if property type is selected (for enabling/disabling)
  const isPropertyTypeSelected = selectedPropertyType && selectedPropertyType !== t('all');

  if (loading) {
    return (
      <div className={`animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] h-12 rounded ${className}`}></div>
    );
  }

  const displayLabel = label || (currentLanguage === 'ar' ? 'تقسيم العقار' : 
                                 currentLanguage === 'tr' ? 'Emlak Düzeni' : 
                                 'Property Layout');

  const displayPlaceholder = placeholder || (
    !isPropertyTypeSelected 
      ? (currentLanguage === 'ar' ? 'اختر نوع العقار أولاً' : currentLanguage === 'tr' ? 'Önce mülk türünü seçin' : 'Select property type first')
      : (currentLanguage === 'ar' ? 'اختر التقسيم' : currentLanguage === 'tr' ? 'Düzen seçin' : 'Select layout')
  );

  // التعديل هنا: إضافة خيار "الكل" أول القائمة بشكل دائم (ومُترجم)
  const allLabel = t('all');
  const allValue = t('all');

  if (showAsFilterButton) {
    return (
      <Select 
        value={currentValue || ""} 
        onValueChange={handleChange}
        disabled={!isPropertyTypeSelected}
      >
        <SelectTrigger className="flex items-center justify-between border border-input text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 rtl:text-right rtl:[&>span]:text-right w-full bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-[#232535] outline-none rounded-lg shadow-none transition-colors p-4 hover:bg-gray-50 dark:hover:bg-[#232535] rounded-full cursor-pointer focus:ring-0 h-auto min-h-[80px]">
          <div className="flex items-center space-x-3 rtl:space-x-reverse w-full">
            <div className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0">📐</div>
            <div className="flex-1 text-left rtl:text-right">
              <label className="text-xs font-semibold text-gray-700 dark:text-neutral-100 block">
                {displayLabel}
              </label>
              <SelectValue 
                placeholder={displayPlaceholder}
                className="text-gray-800 dark:text-neutral-100 text-sm font-medium mt-1 block cursor-pointer"
              />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent
          className="bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-200 dark:border-[#232535] shadow-lg z-50 max-h-60 overflow-y-auto rounded-xl transition-all"
        >
          <SelectItem value={allValue} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-neutral-100">
            {allLabel}
          </SelectItem>
          {filteredLayouts.map((layout) => (
            <SelectItem key={layout.id} value={layout.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-neutral-100">
              {getPropertyLayoutNameByLanguage(layout, currentLanguage)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={className}>
      <Select 
        value={currentValue || ""} 
        onValueChange={handleChange}
        disabled={!isPropertyTypeSelected}
      >
        <SelectTrigger className="w-full h-10 px-3 py-2 bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-[#232535] rounded-md cursor-pointer hover:bg-accent dark:hover:bg-[#232535] transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <SelectValue 
            placeholder={displayPlaceholder}
            className="text-gray-800 dark:text-neutral-100"
          />
        </SelectTrigger>
        <SelectContent
          className="bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-200 dark:border-[#232535] shadow-lg z-50 max-h-60 overflow-y-auto rounded-xl transition-all"
        >
          <SelectItem value={allValue} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-neutral-100">
            {allLabel}
          </SelectItem>
          {filteredLayouts.map((layout) => (
            <SelectItem key={layout.id} value={layout.id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-neutral-100">
              {getPropertyLayoutNameByLanguage(layout, currentLanguage)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertyLayoutFilter;
