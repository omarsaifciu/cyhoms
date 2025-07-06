
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PriceRangeSlider from "../PriceRangeSlider";

interface MobileAdvancedFiltersSectionProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  dynamicPriceRange: { min: number; max: number };
  properties: any[];
}

const MobileAdvancedFiltersSection = ({
  priceRange,
  setPriceRange,
  dynamicPriceRange,
  properties
}: MobileAdvancedFiltersSectionProps) => {
  const { t } = useLanguage();
  const { theme, resolvedTheme } = useTheme();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const isDarkMode = resolvedTheme === 'dark' || theme === 'dark';

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `€${(price / 1000).toFixed(0)}K`;
    }
    return `€${price}`;
  };

  return (
    <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="
            w-full justify-between
            bg-white dark:bg-[#181c23]
            text-gray-900 dark:text-white
            border border-gray-300 dark:border-[#232535] 
            rounded-lg
            shadow-none
            transition-colors
            hover:bg-gray-100
            dark:hover:bg-[#181c23]
            focus:bg-gray-100
            dark:focus:bg-[#181c23]
            active:bg-gray-200
            dark:active:bg-[#232535]
          "
        >
          <span className="flex items-center gap-2">
            💰 {t('priceRange')}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        <div className="
          space-y-2 
          px-1 py-1
          rounded-xl
          bg-white dark:bg-[#181c23]
          border border-gray-200 dark:border-[#232535]
          shadow-lg
        ">
          <label className="text-xs font-semibold text-gray-700 dark:text-neutral-200 flex items-center gap-2 mt-2">
            💰 {t('priceRange')}
          </label>
          <div className="px-3 py-3">
            <div className="text-center text-sm font-medium text-gray-800 dark:text-white">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MobileAdvancedFiltersSection;
