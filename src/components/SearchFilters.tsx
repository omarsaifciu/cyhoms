import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useData } from "@/contexts/DataContext";
import { usePropertyTypes } from "@/hooks/usePropertyTypes";
import { getPropertyTypeNameByLanguage } from "@/utils/propertyUtils";
import { getCityNameByLanguage, getDistrictNameByLanguage, getDistrictsByCity } from "@/utils/cityUtils";
import { Card, CardContent } from "@/components/ui/card";
import MobileSearchFilters from "./search/MobileSearchFilters";
import DesktopSearchFilters from "./search/DesktopSearchFilters";
import AdvancedFiltersPopover from "./search/AdvancedFiltersPopover";

interface SearchFiltersProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedLayout?: string;
  setSelectedLayout?: (layout: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  properties?: any[];
  showLayoutFilter?: boolean;
}

const SearchFilters = ({
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  selectedType,
  setSelectedType,
  selectedLayout = '',
  setSelectedLayout = () => {},
  priceRange,
  setPriceRange,
  properties = [],
  showLayoutFilter = true
}: SearchFiltersProps) => {
  const { t, currentLanguage } = useLanguage();
  const { cities, districts, loading: citiesLoading } = useData();
  const { propertyTypes, loading: typesLoading } = usePropertyTypes();
  const [dynamicPriceRange, setDynamicPriceRange] = useState({ min: 0, max: 5000 });

  const availableDistricts = selectedCity !== t('all') && selectedCity !== '' 
    ? getDistrictsByCity(selectedCity, districts)
    : [];

  // تحويل أنواع العقارات إلى قائمة بالأسماء المناسبة للغة الحالية
  const propertyTypeOptions = [
    t('all'),
    ...propertyTypes.map(type => getPropertyTypeNameByLanguage(type, currentLanguage))
  ];

  // حساب النطاق السعري بناءً على العقارات الموجودة
  useEffect(() => {
    if (properties && properties.length > 0) {
      const prices = properties.map(p => p.price || 0).filter(price => price > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // إضافة هامش 10% للحد الأقصى
        const adjustedMax = Math.ceil(maxPrice * 1.1);
        const adjustedMin = Math.max(0, Math.floor(minPrice * 0.9));
        
        setDynamicPriceRange({ min: adjustedMin, max: adjustedMax });
        
        // تحديث نطاق السعر المحدد إذا كان خارج النطاق الجديد
        if (priceRange[0] < adjustedMin || priceRange[1] > adjustedMax) {
          setPriceRange([adjustedMin, adjustedMax]);
        }
      }
    }
  }, [properties]);

  // 🚩 حذف الـ useEffect أدناه نهائياً، لأنه يضبط الفلاتر إلى All فيتعارض مع السلوك المطلوب 👇
  // useEffect(() => {
  //   const allText = t('all');
  //   setSelectedCity(allText);
  //   setSelectedDistrict(allText);
  //   if (setSelectedLayout) {
  //     setSelectedLayout(allText);
  //   }
  // }, [currentLanguage, setSelectedCity, setSelectedDistrict, setSelectedLayout, t]);

  const handleSearch = () => {
    console.log('Search clicked with filters:', {
      city: selectedCity,
      district: selectedDistrict,
      type: selectedType,
      layout: selectedLayout,
      priceRange
    });
    // يمكن إضافة منطق البحث هنا إذا لزم الأمر
  };

  const cityOptions = [
    { value: t('all'), label: t('all') },
    ...cities.map(city => ({
      value: city.id,
      label: getCityNameByLanguage(city, currentLanguage)
    }))
  ];

  const districtOptions = [
    { value: t('all'), label: t('all') },
    ...availableDistricts.map(district => ({
      value: district.id,
      label: getDistrictNameByLanguage(district, currentLanguage)
    }))
  ];

  if (citiesLoading || typesLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 border">
          <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] h-32 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-4">
      {/* Main Search Card */}
      <Card className="bg-white dark:bg-[#181c23] rounded-3xl shadow-2xl border-0 overflow-hidden hover:shadow-3xl transition-all duration-300">
        <CardContent className="p-4 lg:p-6">
          <MobileSearchFilters
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            cityOptions={cityOptions}
            districtOptions={districtOptions}
            propertyTypes={propertyTypeOptions}
            dynamicPriceRange={dynamicPriceRange}
            properties={properties}
            onSearch={handleSearch}
            showLayoutFilter={showLayoutFilter}
          />

          <DesktopSearchFilters
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            cityOptions={cityOptions}
            districtOptions={districtOptions}
            propertyTypes={propertyTypeOptions}
            dynamicPriceRange={dynamicPriceRange}
            properties={properties}
            onSearch={handleSearch}
            showLayoutFilter={showLayoutFilter}
          />
        </CardContent>
      </Card>
      <AdvancedFiltersPopover
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        dynamicPriceRange={dynamicPriceRange}
        properties={properties}
      />
    </div>
  );
};

export default SearchFilters;
