
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyLayoutFilter from "../PropertyLayoutFilter";

interface MobilePropertyTypeSectionProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedLayout?: string;
  setSelectedLayout?: (layout: string) => void;
  propertyTypes: string[];
  showLayoutFilter?: boolean;
}

const MobilePropertyTypeSection = ({
  selectedType,
  setSelectedType,
  selectedLayout = '',
  setSelectedLayout = () => {},
  propertyTypes,
  showLayoutFilter = true
}: MobilePropertyTypeSectionProps) => {
  const { t, currentLanguage } = useLanguage();

  const handleTypeChange = (type: string) => {
    console.log('Type changed to:', type);
    setSelectedType(type);
    setSelectedLayout(t('all'));
  };

  return (
    <>
      {/* Property Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 dark:text-neutral-100 flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <span>{t('propertyType')}</span>
        </label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger
            className={cn(
              "w-full bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-[#232535] outline-none rounded-lg shadow-none transition-colors",
              currentLanguage === 'ar' && "text-right"
            )}
          >
            <SelectValue placeholder={t('selectType')} className="dark:text-neutral-100" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-200 dark:border-[#232535] shadow-lg z-50 max-h-60 overflow-y-auto rounded-xl transition-all">
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-neutral-100">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Layout - Show only if enabled */}
      {showLayoutFilter && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-neutral-100 flex items-center gap-2">
            <span className="text-lg">🏗️</span>
            <span>{t('propertyLayout')}</span>
          </label>
          <PropertyLayoutFilter
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            selectedPropertyType={selectedType}
            className="w-full"
          />
        </div>
      )}
    </>
  );
};

export default MobilePropertyTypeSection;
