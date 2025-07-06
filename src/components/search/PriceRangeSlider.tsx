
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

interface PriceRangeSliderProps {
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  dynamicPriceRange: { min: number; max: number };
  properties: any[];
  showQuickButtons?: boolean;
  darkMode?: boolean;
}

const PriceRangeSlider = ({
  priceRange,
  setPriceRange,
  dynamicPriceRange,
  properties,
  showQuickButtons = false,
  darkMode
}: PriceRangeSliderProps) => {
  const { currentLanguage } = useLanguage();
  const { theme, resolvedTheme } = useTheme();

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `€${(price / 1000).toFixed(0)}K`;
    }
    return `€${price}`;
  };

  const handlePriceChange = (newPriceRange: number[]) => {
    setPriceRange(newPriceRange);
  };

  // تحديد الوضع المظلم تلقائياً إذا لم يتم تمريره
  const isDarkMode = darkMode !== undefined ? darkMode : (resolvedTheme === 'dark' || theme === 'dark');

  // تحسين ألوان الأزرار حسب الثيم
  const getButtonClasses = (selected: boolean) => {
    if (isDarkMode) {
      return selected
        ? "bg-brand-accent text-white border-brand-accent hover:bg-brand-accent/90 shadow-lg"
        : "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-200";
    } else {
      return selected
        ? "bg-brand-accent text-white border border-brand-accent shadow-md hover:bg-brand-accent/90"
        : "bg-white text-gray-900 border border-gray-200 hover:border-brand-accent hover:text-brand-accent hover:shadow-md transition-all duration-200";
    }
  };

  return (
    <div className={`
      space-y-4 
      ${isDarkMode 
        ? 'bg-gray-900 border border-gray-800' 
        : 'bg-white border border-gray-200 shadow-2xl'} 
      p-4 rounded-2xl
      transition-all duration-200
      `}
      style={{ boxShadow: !isDarkMode ? '0 12px 34px rgba(44, 50, 129, 0.07)' : '0 12px 34px rgba(0, 0, 0, 0.3)' }}
    >
      <div className="flex justify-between items-center">
        <div className={`text-base font-semibold ${isDarkMode ? "text-brand-accent" : "text-brand-accent"}`}>
          {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </div>
        {isDarkMode && (
          <div className="text-xs font-semibold text-brand-accent hidden md:block">
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </div>
        )}
      </div>
      
      <div className="relative px-2 py-3">
        <Slider
          value={priceRange}
          onValueChange={handlePriceChange}
          max={dynamicPriceRange.max}
          min={dynamicPriceRange.min}
          step={Math.max(1, Math.floor(dynamicPriceRange.max / 100))}
          className="w-full"
        />
      </div>
      
      <div className={`flex justify-between text-xs px-2 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
        <span>{formatPrice(dynamicPriceRange.min)}</span>
        {showQuickButtons && (
          <span className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}>
            {properties.length} {currentLanguage === 'ar' ? 'عقار' : currentLanguage === 'tr' ? 'mülk' : 'properties'}
          </span>
        )}
        <span>{formatPrice(dynamicPriceRange.max)}</span>
      </div>
      
      {showQuickButtons && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { label: currentLanguage === 'ar' ? 'الكل' : currentLanguage === 'tr' ? 'Tümü' : 'All', value: [dynamicPriceRange.min, dynamicPriceRange.max] },
            { label: '< 1K', value: [dynamicPriceRange.min, Math.min(1000, dynamicPriceRange.max)] },
            { label: '1K-3K', value: [1000, Math.min(3000, dynamicPriceRange.max)] },
            { label: '3K+', value: [3000, dynamicPriceRange.max] }
          ].map((preset, index) => {
            const selected = priceRange[0] === preset.value[0] && priceRange[1] === preset.value[1];
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`
                  text-xs rounded-xl h-10
                  ${getButtonClasses(selected)}
                `}
                onClick={() => handlePriceChange(preset.value)}
                type="button"
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PriceRangeSlider;
