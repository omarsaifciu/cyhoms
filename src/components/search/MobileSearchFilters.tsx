
import MobileLocationSection from "./mobile/MobileLocationSection";
import MobilePropertyTypeSection from "./mobile/MobilePropertyTypeSection";
import MobileAdvancedFiltersSection from "./mobile/MobileAdvancedFiltersSection";
import MobileSearchButton from "./mobile/MobileSearchButton";

interface MobileSearchFiltersProps {
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

const MobileSearchFilters = ({
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
}: MobileSearchFiltersProps) => {
  return (
    <div className="lg:hidden space-y-4">
      {/* Quick Search Row */}
      <div className="grid grid-cols-1 gap-3">
        <MobileLocationSection
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          cityOptions={cityOptions}
          districtOptions={districtOptions}
        />

        <MobilePropertyTypeSection
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
          propertyTypes={propertyTypes}
          showLayoutFilter={showLayoutFilter}
        />
      </div>

      {/* Advanced Filters Toggle */}
      <MobileAdvancedFiltersSection
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        dynamicPriceRange={dynamicPriceRange}
        properties={properties}
      />

      {/* Search Button */}
      <MobileSearchButton onSearch={onSearch} />
    </div>
  );
};

export default MobileSearchFilters;
