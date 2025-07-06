import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import { transformPropertyForCard } from "@/utils/propertyUtils";
import { Home, GraduationCap } from "lucide-react";

interface SuggestedPropertiesProps {
  currentProperty: Property;
}

const SuggestedProperties = ({ currentProperty }: SuggestedPropertiesProps) => {
  const { currentLanguage } = useLanguage();
  const [suggestedProperties, setSuggestedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedProperties();
  }, [currentProperty.id]);

  const fetchSuggestedProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .neq('hidden_by_admin', true)
        .neq('id', currentProperty.id)
        .eq('city', currentProperty.city)
        .order('created_at', { ascending: false });

      if (currentProperty.is_student_housing) {
        query = query.eq('is_student_housing', true);
      } else {
        query = query.eq('is_student_housing', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Type cast to handle Json vs string[] mismatch
      const typedProperties = (data || []).map(property => ({
        ...property,
        images: Array.isArray(property.images) ? property.images : 
                typeof property.images === 'string' ? [property.images] : []
      })) as Property[];
      
      setSuggestedProperties(typedProperties);
    } catch (error) {
      console.error('Error fetching suggested properties:', error);
      setSuggestedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-[#151826]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (suggestedProperties.length === 0) {
    return null;
  }

  const getSectionTitle = () => {
    if (currentProperty.is_student_housing) {
      return currentLanguage === 'ar' ? 'سكنات طلابية مقترحة' :
             currentLanguage === 'tr' ? 'Önerilen Öğrenci Konutları' :
             'Suggested Student Housing';
    } else {
      return currentLanguage === 'ar' ? 'عقارات مقترحة' :
             currentLanguage === 'tr' ? 'Önerilen Mülkler' :
             'Suggested Properties';
    }
  };

  const getSectionDescription = () => {
    if (currentProperty.is_student_housing) {
      return currentLanguage === 'ar' ? 'جميع السكنات الطلابية المتاحة في نفس المدينة' :
             currentLanguage === 'tr' ? 'Aynı şehirde mevcut tüm öğrenci konutları' :
             'All available student housing in the same city';
    } else {
      return currentLanguage === 'ar' ? 'جميع العقارات المتاحة في نفس المدينة' :
             currentLanguage === 'tr' ? 'Aynı şehirde mevcut tüm mülkler' :
             'All available properties in the same city';
    }
  };

  return (
    <section
      className="
        py-16 px-4 
        bg-gradient-to-br from-blue-50 via-white to-orange-50
        dark:bg-[#151826] dark:bg-none
        transition-colors
      "
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            {currentProperty.is_student_housing ? (
              <GraduationCap className="w-8 h-8 text-orange-500" />
            ) : (
              <Home className="w-8 h-8 text-blue-500" />
            )}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {getSectionTitle()}
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {getSectionDescription()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestedProperties.map((property, index) => (
            <div 
              key={property.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PropertyCard 
                property={transformPropertyForCard(property, currentLanguage)} 
              />
            </div>
          ))}
        </div>

        {/* عرض عدد العقارات المقترحة */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-300">
            {currentLanguage === 'ar' ? 
              `يتم عرض ${suggestedProperties.length} ${currentProperty.is_student_housing ? 'سكن طلابي' : 'عقار'} متاح في هذه المدينة` :
              currentLanguage === 'tr' ?
              `Bu şehirde ${suggestedProperties.length} ${currentProperty.is_student_housing ? 'öğrenci konutu' : 'mülk'} gösteriliyor` :
              `Showing ${suggestedProperties.length} available ${currentProperty.is_student_housing ? 'student housing' : 'properties'} in this city`
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default SuggestedProperties;
