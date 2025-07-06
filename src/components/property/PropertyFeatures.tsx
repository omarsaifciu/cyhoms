
import { Bed, Bath, Square } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFeaturesProps {
  beds: number;
  baths: number;
  area: number;
}

const PropertyFeatures = ({ beds, baths, area }: PropertyFeaturesProps) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 h-12 min-w-0">
        <Bed className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {beds} {getBedLabel()}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl px-3 py-2 h-12 min-w-0">
        <Bath className="w-4 h-4 text-purple-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {baths} {getBathLabel()}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2 h-12 min-w-0">
        <Square className="w-4 h-4 text-green-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {area}{getAreaUnit()}
        </span>
      </div>
    </div>
  );
};

export default PropertyFeatures;
