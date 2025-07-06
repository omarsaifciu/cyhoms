
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyLayoutFilter from "./PropertyLayoutFilter";
import LocationFilter from "./desktop/LocationFilter";
import DistrictFilter from "./desktop/DistrictFilter";
import PropertyTypeFilter from "./desktop/PropertyTypeFilter";
import PriceRangeFilter from "./desktop/PriceRangeFilter";
import SearchButton from "./desktop/SearchButton";

interface DesktopSearchFiltersProps {
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
  cityOptions: Array<{ value: string; label: string }>;
  districtOptions: Array<{ value: string; label: string }>;
  propertyTypes: string[];
  dynamicPriceRange: { min: number; max: number };
  properties: any[];
  onSearch: () => void;
  showLayoutFilter?: boolean;
}

const DesktopSearchFilters = ({
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
  cityOptions,
  districtOptions,
  propertyTypes,
  dynamicPriceRange,
  properties,
  onSearch,
  showLayoutFilter = true
}: DesktopSearchFiltersProps) => {
  const { t } = useLanguage();

  const handleCityChange = (cityId: string) => {
    console.log('City changed to:', cityId);
    setSelectedCity(cityId);
    setSelectedDistrict(t('all'));
  };

  const handleDistrictChange = (districtId: string) => {
    console.log('District changed to:', districtId);
    setSelectedDistrict(districtId);
  };

  const handleTypeChange = (type: string) => {
    console.log('Type changed to:', type);
    setSelectedType(type);
    // Reset layout when property type changes
    setSelectedLayout(t('all'));
  };

  const gridCols = showLayoutFilter ? "lg:grid-cols-6" : "lg:grid-cols-5";

  return (
    <div className={`hidden lg:grid ${gridCols} gap-0 items-center`}>
      
      <LocationFilter
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        cityOptions={cityOptions}
      />

      <DistrictFilter
        selectedCity={selectedCity}
        selectedDistrict={selectedDistrict}
        onDistrictChange={handleDistrictChange}
        districtOptions={districtOptions}
      />

      <PropertyTypeFilter
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        propertyTypes={propertyTypes}
      />

      {/* Property Layout - Show only if enabled */}
      {showLayoutFilter && (
        <div className="group cursor-pointer lg:border-l border-gray-200">
          <div className="">
            <PropertyLayoutFilter
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
              selectedPropertyType={selectedType}
              showAsFilterButton={true}
            />
          </div>
        </div>
      )}

      <PriceRangeFilter
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        dynamicPriceRange={dynamicPriceRange}
        properties={properties}
      />

      <SearchButton onSearch={onSearch} />
    </div>
  );
};

export default DesktopSearchFilters;
