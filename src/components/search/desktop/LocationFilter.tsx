
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationFilterProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
  cityOptions: Array<{ value: string; label: string }>;
}

const LocationFilter = ({
  selectedCity,
  onCityChange,
  cityOptions
}: LocationFilterProps) => {
  const { t } = useLanguage();

  return (
    <div className="group cursor-pointer">
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-full bg-transparent border-none outline-none p-4 hover:bg-gray-50 dark:hover:bg-[#222636] rounded-full transition-colors cursor-pointer focus:ring-0 h-auto min-h-[80px]">
          <div className="flex items-center space-x-3 rtl:space-x-reverse w-full">
            <MapPin className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors flex-shrink-0" />
            <div className="flex-1 text-left rtl:text-right">
              <label className="text-xs font-semibold text-gray-700 dark:text-white block">
                {t('location')}
              </label>
              <SelectValue 
                placeholder={t('selectCity')} 
                className="text-gray-800 dark:text-white text-sm font-medium mt-1 block cursor-pointer"
              />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent
          className="bg-white dark:bg-[#111726] border dark:border-[#232535] shadow-lg z-50 max-h-60 overflow-y-auto rounded-xl transition-all"
        >
          {cityOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#232535] dark:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilter;
