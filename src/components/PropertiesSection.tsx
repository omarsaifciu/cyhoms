
import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import PropertyTypeFilter from "./PropertyTypeFilter";
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyForCard } from "@/types/property";

interface PropertiesSectionProps {
  properties: PropertyForCard[];
  loading: boolean;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
}

const PropertiesSection = ({
  properties,
  loading,
  selectedFilter = 'all',
  onFilterChange = () => {}
}: PropertiesSectionProps) => {
  const { t, currentLanguage } = useLanguage();
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate property counts for filters
  const propertyCounts = {
    all: properties.length,
    sale: properties.filter(p => p.listing_type === 'sale').length,
    rent: properties.filter(p => p.listing_type === 'rent').length,
    student: properties.filter(p => p.is_student_housing).length,
  };

  // Debug logging
  console.log('PropertiesSection - Properties:', properties.length);
  console.log('PropertiesSection - Property counts:', propertyCounts);
  console.log('PropertiesSection - Selected filter:', selectedFilter);

  const handlePropertyUpdate = () => {
    // Force re-render by updating key
    setRefreshKey(prev => prev + 1);
    // Reload the page to get fresh data
    window.location.reload();
  };

  if (loading) {
    return (
      <section className="py-12 px-4 bg-background dark:bg-[#181926]" id="featured-properties">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
              {currentLanguage === 'ar' ? 'العقارات المميزة' : 
               currentLanguage === 'tr' ? 'Öne Çıkan Emlaklar' : 
               'Featured Properties'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-3xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // إزالة الشرط الذي يخفي الفلاتر عندما تكون النتائج فارغة
  // الآن ستظهر الفلاتر دائماً

  return (
    <section className="py-12 px-4 bg-background dark:bg-[#181926]" id="featured-properties">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
            {currentLanguage === 'ar' ? 'جميع العقارات' :
             currentLanguage === 'tr' ? 'Tüm Mülkler' :
             'All Properties'}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            {currentLanguage === 'ar' ? 'تصفح مجموعتنا الكاملة من العقارات المتاحة' :
             currentLanguage === 'tr' ? 'Mevcut mülklerin tam koleksiyonumuza göz atın' :
             'Browse our complete collection of available properties'}
          </p>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
            {currentLanguage === 'ar' ? `تصحيح: ${properties.length} إجمالي العقارات، ${propertyCounts.sale} متاحة، ${propertyCounts.rent} بعد التصفية` :
             currentLanguage === 'tr' ? `Hata ayıklama: ${properties.length} toplam mülk, ${propertyCounts.sale} mevcut, ${propertyCounts.rent} filtreden sonra` :
             `Debug: ${properties.length} total properties, ${propertyCounts.sale} available, ${propertyCounts.rent} after filter`}
          </p>
        </div>

        {/* Property Type Filters */}
        <PropertyTypeFilter
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
          propertyCounts={propertyCounts}
        />
        
        {/* عرض العقارات أو رسالة عدم وجود عقارات */}
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground dark:text-gray-300">
              {currentLanguage === 'ar' ? 'لا توجد عقارات متاحة حالياً' :
               currentLanguage === 'tr' ? 'Şu anda mevcut emlak yok' :
               'No properties available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" key={refreshKey}>
            {(() => {
              // Debug: Check property order
              const featuredFirst = properties.filter(p => p.featured === true);
              const nonFeatured = properties.filter(p => p.featured !== true);
              console.log('🏠 PropertiesSection Debug:', {
                totalProperties: properties.length,
                featuredFirst: featuredFirst.length,
                nonFeatured: nonFeatured.length,
                firstFewProperties: properties.slice(0, 5).map(p => ({
                  id: p.id,
                  title: p.title,
                  featured: p.featured
                }))
              });
              return null;
            })()}
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PropertyCard
                  property={property}
                  onUpdate={handlePropertyUpdate}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesSection;
