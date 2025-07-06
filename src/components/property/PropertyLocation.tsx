
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCitiesData } from "@/hooks/useCitiesData";
import { useDistrictsData } from "@/hooks/useDistrictsData";

interface PropertyLocationProps {
  city: string;
  district: string;
}

const PropertyLocation = ({ city, district }: PropertyLocationProps) => {
  const { currentLanguage } = useLanguage();
  const { cities } = useCitiesData();
  const { districts } = useDistrictsData();

  function getCityNameById(cityId: string) {
    const cityData = cities.find(c => c.id === cityId);
    if (!cityData) return cityId;
    if (currentLanguage === 'ar') return cityData.name_ar;
    if (currentLanguage === 'tr') return cityData.name_tr;
    return cityData.name_en;
  }

  function getDistrictNameById(districtId: string) {
    const districtData = districts.find(d => d.id === districtId);
    if (!districtData) return districtId;
    if (currentLanguage === 'ar') return districtData.name_ar;
    if (currentLanguage === 'tr') return districtData.name_tr;
    return districtData.name_en;
  }

  return (
    <div className="flex items-center text-gray-500 mb-3">
      <MapPin className="w-4 h-4 ml-1" />
      <div>
        {cities.length === 0 ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          <>
            <span className="text-gray-500">{getCityNameById(city)}</span>
            {district && (
              <>
                <span> - </span>
                <span className="text-gray-500">{getDistrictNameById(district)}</span>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyLocation;
