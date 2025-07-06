
import { Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import PriceRangeSlider from "./PriceRangeSlider";

interface AdvancedFiltersPopoverProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  dynamicPriceRange: { min: number; max: number };
  properties: any[];
}

const AdvancedFiltersPopover = ({
  priceRange,
  setPriceRange,
  dynamicPriceRange,
  properties
}: AdvancedFiltersPopoverProps) => {
  const { t, currentLanguage } = useLanguage();
  const { theme, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === 'dark' || theme === 'dark';

  return (
    <div className="flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`
              rounded-full px-6 py-3 text-base transition-colors
              ${isDarkMode 
                ? 'border-gray-600 hover:border-gray-500 bg-[#232535] text-white hover:bg-[#181c23]' 
                : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
              }
            `}
          >
            <Sliders className="w-4 h-4 mr-2" />
            {currentLanguage === 'ar' ? 'فلاتر متقدمة' : 
             currentLanguage === 'tr' ? 'Gelişmiş Filtreler' : 
             'More Filters'}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`
            w-[95vw] max-w-md p-6
            ${isDarkMode 
              ? 'bg-[#111726] border-[#232535]' 
              : 'bg-white border-gray-200'
            }
            rounded-2xl shadow-2xl mx-4
            transition-colors
            z-30
          `}
          align="center"
        >
          <div className="space-y-6">
            <h3 className={`
              font-semibold text-lg text-center
              ${isDarkMode ? 'text-white' : 'text-gray-800'}
            `}>
              {currentLanguage === 'ar' ? 'فلاتر متقدمة' : 
               currentLanguage === 'tr' ? 'Gelişmiş Filtreler' : 
               'Advanced Filters'}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className={`
                  text-sm font-medium
                  ${isDarkMode ? 'text-neutral-200' : 'text-gray-700'}
                `}>
                  {t('priceRange')}
                </label>
              </div>
              <PriceRangeSlider
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                dynamicPriceRange={dynamicPriceRange}
                properties={properties}
                showQuickButtons={true}
                darkMode={isDarkMode}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AdvancedFiltersPopover;
