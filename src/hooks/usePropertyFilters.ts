
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { City } from '@/types/city'; // Assuming District is also in city.ts or similar
import { District } from '@/types/city';

interface UsePropertyFiltersProps {
  initialCities: City[];
  initialDistricts: District[];
  citiesAndDistrictsLoading: boolean;
}

export const usePropertyFilters = ({ initialCities, initialDistricts, citiesAndDistrictsLoading }: UsePropertyFiltersProps) => {
  const { t, currentLanguage } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize states from URL or defaults
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || t('all'));
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || t('all'));
  const [selectedType, setSelectedType] = useState(t('all'));
  const [selectedLayout, setSelectedLayout] = useState(t('all'));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

  // New: Track "last requested city" to prevent incorrect resetting during loading
  const [lastRequestedCity, setLastRequestedCity] = useState<string | null>(searchParams.get('city'));

  // Effect to sync URL search parameters to local state
  useEffect(() => {
    if (citiesAndDistrictsLoading) return;

    const cityParam = searchParams.get('city');
    const districtParam = searchParams.get('district');
    const searchParam = searchParams.get('search');

    setSearchQuery(searchParam || "");

    // تعديل: إذا كانت هناك مدينة مختارة وصالحة ابقِ عليها ولا تعيدها إلى All
    if (cityParam) {
      const isValidCity = initialCities.some(c => c.id === cityParam);
      if (isValidCity) {
        setSelectedCity(cityParam);
      } else {
        // فقط إذا لم تكن المدينة صالحة ارجع إلى All
        setSelectedCity(t('all'));
      }
      setLastRequestedCity(cityParam);
    } else if (selectedCity && selectedCity !== t('all')) {
      // لا نعيد القيم للـ all إذا هناك اختيار مسبق
      // لا تفعل شيء (أي حافظ على selectedCity)
    } else {
      setSelectedCity(t('all'));
      setLastRequestedCity(null);
    }

    // Sync District (dependent on city)
    const currentEffectiveCityId = cityParam || (selectedCity !== t('all') && initialCities.find(c => c.id === selectedCity) ? selectedCity : null);

    if (districtParam) {
      const isValidDistrict = initialDistricts.some(d => d.id === districtParam);
      const isCompatibleWithCity = currentEffectiveCityId
        ? initialDistricts.some(d => d.id === districtParam && d.city_id === currentEffectiveCityId)
        : isValidDistrict;
      if (isValidDistrict && isCompatibleWithCity) {
        setSelectedDistrict(districtParam);
      } else {
        setSelectedDistrict(t('all'));
      }
    } else {
      setSelectedDistrict(t('all'));
    }
  // add lastRequestedCity to dependencies to stay in sync
  }, [searchParams, initialCities, initialDistricts, citiesAndDistrictsLoading, t, selectedCity]);

  // Effect to reset filters on language change, prioritizing URL params
  useEffect(() => {
    if (citiesAndDistrictsLoading) return;

    const cityParam = searchParams.get('city');
    const districtParam = searchParams.get('district');

    // تحديث: فقط إذا هناك تغيير حقيقي أو في حالة عدم وجود مدينة محددة
    setSelectedCity(cityParam && initialCities.some(c => c.id === cityParam) ? cityParam : selectedCity || t('all'));
    setSelectedDistrict(districtParam && initialDistricts.some(d => d.id === districtParam) ? districtParam : t('all'));
    setSelectedType(t('all'));
    setSelectedLayout(t('all'));
    // لا تعيد price/search
  }, [currentLanguage, t, initialCities, initialDistricts, searchParams, citiesAndDistrictsLoading]);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCity(cityId);
    setSelectedDistrict(t('all')); // Reset district when city changes
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (cityId === t('all') || !initialCities.some(c => c.id === cityId)) { // also check if cityId is a valid one
        newParams.delete('city');
      } else {
        newParams.set('city', cityId);
      }
      newParams.delete('district'); // Always remove district when city changes
      return newParams;
    }, { replace: true });
    setLastRequestedCity(cityId); // keep in sync for robustness
  }, [t, setSearchParams, initialCities]);

  const handleDistrictChange = useCallback((districtId: string) => {
    setSelectedDistrict(districtId);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (districtId === t('all') || !initialDistricts.some(d => d.id === districtId)) { // also check if districtId is valid
        newParams.delete('district');
      } else {
        newParams.set('district', districtId);
      }
      return newParams;
    }, { replace: true });
  }, [t, setSearchParams, initialDistricts]);
  
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query); // Local state updates immediately
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (query.trim()) {
        newParams.set('search', query.trim());
      } else {
        newParams.delete('search');
      }
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);


  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('search');
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  return {
    selectedCity,
    handleCityChange,
    selectedDistrict,
    handleDistrictChange,
    selectedType,
    setSelectedType,
    selectedLayout,
    setSelectedLayout,
    priceRange,
    setPriceRange,
    searchQuery,
    handleSearchQueryChange,
    clearSearch,
  };
};
