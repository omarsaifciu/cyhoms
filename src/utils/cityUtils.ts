
import { City, District } from "@/types/city";

export const getCityNameByLanguage = (city: City, language: string): string => {
  switch (language) {
    case 'ar':
      return city.name_ar;
    case 'tr':
      return city.name_tr;
    default:
      return city.name_en;
  }
};

export const getDistrictNameByLanguage = (district: District, language: string): string => {
  switch (language) {
    case 'ar':
      return district.name_ar;
    case 'tr':
      return district.name_tr;
    default:
      return district.name_en;
  }
};

export const getDistrictsByCity = (cityId: string, districts: District[]): District[] => {
  return districts.filter(district => district.city_id === cityId);
};

export const getCityOptions = (cities: City[], language: string, includeAll: boolean = true, allText: string = 'All') => {
  const options = cities.map(city => ({
    value: city.id,
    label: getCityNameByLanguage(city, language)
  }));

  if (includeAll) {
    return [{ value: 'all', label: allText }, ...options];
  }

  return options;
};

export const getDistrictOptions = (districts: District[], language: string, includeAll: boolean = true, allText: string = 'All') => {
  const options = districts.map(district => ({
    value: district.id,
    label: getDistrictNameByLanguage(district, language)
  }));

  if (includeAll) {
    return [{ value: 'all', label: allText }, ...options];
  }

  return options;
};
