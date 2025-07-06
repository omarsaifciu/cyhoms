
import { useMemo } from "react";
import { PropertyForCard } from "@/types/property";
import { useAuth } from "@/contexts/AuthContext";

interface UseFilteredPropertiesProps {
  properties: PropertyForCard[];
  searchQuery: {
    selectedCity: string;
    selectedDistrict: string;
    selectedType: string;
    selectedLayout: string;
    priceRange: number[];
  };
  selectedCity: string;
  selectedDistrict: string;
  selectedType: string;
  selectedLayout: string;
  priceRange: number[];
  cities: any[];
  districts: any[];
  currentLanguage: string;
  t: (key: string) => string;
}

export const useFilteredProperties = ({
  properties,
  searchQuery,
  selectedCity,
  selectedDistrict,
  selectedType,
  selectedLayout,
  priceRange,
  cities,
  districts,
  currentLanguage,
  t,
}: UseFilteredPropertiesProps): PropertyForCard[] => {
  const { isAdmin } = useAuth();

  return useMemo(() => {
    let filtered = [...properties];

    // First, exclude hidden properties for non-admin users
    if (!isAdmin) {
      filtered = filtered.filter(property =>
        property.status === 'available' && !property.hidden_by_admin
      );
    }

    // Filter by city
    if (selectedCity && selectedCity !== t('all')) {
      const selectedCityObj = cities.find(city => city.id === selectedCity);
      if (selectedCityObj) {
        filtered = filtered.filter(property => property.city === selectedCity);
      }
    }

    // Filter by district
    if (selectedDistrict && selectedDistrict !== t('all')) {
      const selectedDistrictObj = districts.find(district => district.id === selectedDistrict);
      if (selectedDistrictObj) {
        filtered = filtered.filter(property => property.district === selectedDistrict);
      }
    }

    // Filter by property type
    if (selectedType && selectedType !== t('all')) {
      filtered = filtered.filter(property => {
        if (!property.type) return false;
        
        const typeMapping: { [key: string]: string[] } = {
          [t('apartment')]: ['apartment', 'شقة', 'daire'],
          [t('villa')]: ['villa', 'فيلا', 'villa'],
          [t('studio')]: ['studio', 'استوديو', 'stüdyo'],
          [t('house')]: ['house', 'بيت', 'ev']
        };

        const selectedTypeVariants = typeMapping[selectedType] || [selectedType.toLowerCase()];
        return selectedTypeVariants.some(variant => 
          property.type?.toLowerCase().includes(variant.toLowerCase())
        );
      });
    }

    // Filter by price range
    if (priceRange && priceRange.length === 2) {
      filtered = filtered.filter(property =>
        property.price >= priceRange[0] && property.price <= priceRange[1]
      );
    }

    // Sort properties: Featured properties first, then by creation date (newest first)
    filtered.sort((a, b) => {
      // First priority: Featured properties
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Second priority: Creation date (newest first)
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [properties, selectedCity, selectedDistrict, selectedType, selectedLayout, priceRange, cities, districts, currentLanguage, t, isAdmin]);
};
