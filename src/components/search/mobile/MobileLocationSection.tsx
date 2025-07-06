
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileLocationSectionProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  cityOptions: Array<{ value: string; label: string }>;
  districtOptions: Array<{ value: string; label: string }>;
}

const MobileLocationSection = ({
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  cityOptions,
  districtOptions
}: MobileLocationSectionProps) => {
  const { t, currentLanguage } = useLanguage();

  const handleCityChange = (cityId: string) => {
    console.log('City changed to:', cityId);
    setSelectedCity(cityId);
    setSelectedDistrict(t('all'));
  };

  const handleDistrictChange = (districtId: string) => {
    console.log('District changed to:', districtId);
    setSelectedDistrict(districtId);
  };

  return (
    <>
      {/* Location */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 dark:text-neutral-100 flex items-center gap-2">
          <span className="text-lg">📍</span> {/* أيقونة الموقع */}
          <span>{t('location')}</span>
        </label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger
            className={cn(
              "w-full bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-[#232535] outline-none rounded-lg shadow-none transition-colors",
              currentLanguage === 'ar' && "text-right"
            )}
          >
            <SelectValue placeholder={t('selectCity')} className="dark:text-neutral-100" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-200 dark:border-[#232535] shadow-lg z-50 max-h-60 overflow-y-auto rounded-xl transition-all">
            {cityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-neutral-100">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700 dark:text-neutral-100 flex items-center gap-2">
          <span className="text-lg">📍</span>
          <span>{t('district')}</span>
        </label>
        <Select 
          value={selectedDistrict} 
          onValueChange={handleDistrictChange}
          disabled={selectedCity === t('all') || districtOptions.length <= 1}
        >
          <SelectTrigger
            className={cn(
              "w-full bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-300 dark:border-[#232535] outline-none rounded-lg shadow-none transition-colors",
              currentLanguage === 'ar' && "text-right"
            )}
          >
            <SelectValue 
              placeholder={
                selectedCity === t('all') 
                  ? t('selectCityFirst')
                  : t('selectDistrict')
              }
              className="dark:text-neutral-100" 
            />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#181c23] text-gray-900 dark:text-neutral-100 border border-gray-200 dark:border-[#232535] shadow-lg z-50 max-h-60 overflow-y-auto rounded-xl transition-all">
            {districtOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-neutral-100">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default MobileLocationSection;
