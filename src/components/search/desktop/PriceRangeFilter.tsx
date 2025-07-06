
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PriceRangeSlider from "../PriceRangeSlider";

interface PriceRangeFilterProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  dynamicPriceRange: { min: number; max: number };
  properties: any[];
}

const PriceRangeFilter = ({
  priceRange,
  setPriceRange,
  dynamicPriceRange,
  properties
}: PriceRangeFilterProps) => {
  const { t } = useLanguage();
  const { theme, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === 'dark' || theme === 'dark';

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `€${(price / 1000).toFixed(0)}K`;
    }
    return `€${price}`;
  };

  return (
    <div className="group cursor-pointer lg:border-l border-gray-200 dark:border-gray-700">
      <Popover>
        <PopoverTrigger className="w-full bg-transparent border-none outline-none p-4 hover:bg-gray-50 dark:hover:bg-[#222636] rounded-full transition-colors cursor-pointer focus:ring-0 h-auto min-h-[80px]">
          <div className="flex items-center space-x-3 rtl:space-x-reverse w-full">
            <div className="w-5 h-5 text-gray-400 group-hover:text-brand-accent transition-colors flex-shrink-0">💰</div>
            <div className="flex-1 text-left rtl:text-right">
              <label className="text-xs font-semibold text-gray-700 dark:text-neutral-100 block">
                {t('priceRange')}
              </label>
              <div className="text-sm font-medium text-gray-800 dark:text-white mt-1">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className={`
            w-80 p-6 rounded-2xl shadow-2xl border-0 transition-colors z-30
            ${isDarkMode 
              ? 'bg-gray-900 border border-gray-800' 
              : 'bg-white border border-gray-200'
            }
          `} 
          align="center"
          style={{ 
            boxShadow: !isDarkMode 
              ? '0 12px 34px rgba(44, 50, 129, 0.07)' 
              : '0 12px 34px rgba(0, 0, 0, 0.3)' 
          }}
        >
          <div className="space-y-4">
            <h3 className={`
              font-semibold text-lg text-center
              ${isDarkMode ? 'text-white' : 'text-gray-800'}
            `}>
              {t('priceRange')}
            </h3>
            <PriceRangeSlider
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              dynamicPriceRange={dynamicPriceRange}
              properties={properties}
              showQuickButtons={true}
              darkMode={isDarkMode}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PriceRangeFilter;
