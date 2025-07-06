
import { useEffect, useMemo, useCallback, useState } from "react";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import PropertiesSection from "@/components/PropertiesSection";
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import MobileOptimizedLayout from "@/components/MobileOptimizedLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { usePropertyData } from "@/hooks/usePropertyData";
import SearchQueryDisplay from "@/components/search/SearchQueryDisplay";
import { useFilteredProperties } from "@/hooks/useFilteredProperties";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { testSupabaseConnection, checkUserPermissions } from "@/utils/supabaseTest";

const Index = () => {
  const { t, currentLanguage } = useLanguage();
  const { cities, districts, loading: citiesAndDistrictsLoading } = useData();
  const { settings, loading: settingsLoading } = useSiteSettings();

  const {
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
    clearSearch,
  } = usePropertyFilters({
    initialCities: cities,
    initialDistricts: districts,
    citiesAndDistrictsLoading,
  });

  // Add property filter state
  const [propertyFilter, setPropertyFilter] = useState('all');

  const { properties, loading: propertiesLoading, fetchProperties } = usePropertyData();
  
  useEffect(() => {
    // اختبار اتصال Supabase عند تحميل الصفحة
    const runSupabaseTests = async () => {
      console.log('Running Supabase connection tests...');
      const connectionTest = await testSupabaseConnection();
      const permissionTest = await checkUserPermissions();
      
      console.log('Index page - Connection test:', connectionTest);
      console.log('Index page - Permission test:', permissionTest);
    };
    
    runSupabaseTests();
  }, []);

  useEffect(() => {
    // fetchProperties(); // usePropertyData fetches on mount.
  }, [currentLanguage, fetchProperties]);

  // Update document title and meta description
  useEffect(() => {
    if (!settingsLoading && settings) {
      const siteName = 
        currentLanguage === 'ar' ? settings.siteNameAr :
        currentLanguage === 'en' ? settings.siteNameEn :
        settings.siteNameTr;
      
      const siteDescription =
        currentLanguage === 'ar' ? settings.siteDescriptionAr :
        currentLanguage === 'en' ? settings.siteDescriptionEn :
        settings.siteDescriptionTr;

      // Helper to update meta tags
      const updateMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
        let element = document.querySelector(`meta[${attr}='${key}']`) as HTMLMetaElement;
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attr, key);
          document.head.appendChild(element);
        }
        element.content = content;
      };

      if (siteName) document.title = siteName;
      if (siteDescription) updateMetaTag('name', 'description', siteDescription);
      
      // Update OG/Twitter tags for better sharing
      if (siteName) {
        updateMetaTag('property', 'og:title', siteName);
        updateMetaTag('name', 'twitter:title', siteName);
      }
      if (siteDescription) {
        updateMetaTag('property', 'og:description', siteDescription);
        updateMetaTag('name', 'twitter:description', siteDescription);
      }
    }
  }, [settings, settingsLoading, currentLanguage]);

  // Scroll to #featured-properties on page load إذا كان في الهش
  useEffect(() => {
    if (window.location.hash === '#featured-properties') {
      setTimeout(() => {
        const el = document.getElementById('featured-properties');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  // ==== استماع إلى الايفنت القادمة من الفوتر لتغيير المدينة وعمل scroll فقط ====
  useEffect(() => {
    const handleFooterCitySelect = (event: Event) => {
      const cityId = (event as CustomEvent<string>).detail;
      if (!cityId) return;
      // غير الفلتر للمدينة (search)
      handleCityChange(cityId);

      // يجب إعادة باقي الفلاتر إلى "all" فورًا
      setTimeout(() => {
        handleDistrictChange(t('all'));
        setSelectedLayout(t('all'));
        setSelectedType(t('all'));

        // Scroll للعقارات المميزة
        const el = document.getElementById('featured-properties');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // إذا لم يوجد القسم، مرّر إلى أعلى الصفحة
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 150); // تأخير بسيط للسلاسة
    };

    window.addEventListener('footer-city-select', handleFooterCitySelect);

    return () => {
      window.removeEventListener('footer-city-select', handleFooterCitySelect);
    };
  }, [handleCityChange, handleDistrictChange, setSelectedLayout, setSelectedType, t]);

  const propertyTypes = useMemo(() => [t('all'), t('apartment'), t('villa'), t('studio'), t('house')], [t]);

  const filteredProperties = useFilteredProperties({
    properties,
    searchQuery: {
      selectedCity,
      selectedDistrict,
      selectedType,
      selectedLayout,
      priceRange,
    },
    selectedCity,
    selectedDistrict,
    selectedType,
    selectedLayout,
    priceRange,
    cities,
    districts,
    currentLanguage,
    t,
  });

  // Apply property type filter
  const finalFilteredProperties = useMemo(() => {
    if (propertyFilter === 'all') return filteredProperties;

    return filteredProperties.filter(property => {
      switch (propertyFilter) {
        case 'sale':
          return property.listing_type === 'sale';
        case 'rent':
          return property.listing_type === 'rent';
        case 'student':
          return property.is_student_housing;
        default:
          return true;
      }
    });
  }, [filteredProperties, propertyFilter]);

  const overallLoading = propertiesLoading || citiesAndDistrictsLoading || settingsLoading;

  const handlePriceRangeChangeForFilters = useCallback((newRange: number[]) => {
    if (Array.isArray(newRange) && newRange.length === 2 && typeof newRange[0] === 'number' && typeof newRange[1] === 'number') {
      setPriceRange([newRange[0], newRange[1]]);
    } else {
      console.warn('Price range update received an invalid array, expected [min, max]:', newRange);
    }
  }, [setPriceRange]);

  return (
    <div 
      className="min-h-screen w-full -mt-20 bg-background transition-colors duration-300
      dark:bg-[#181926]"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="animate-fade-in w-full">
        {/* background gradient for hero and page */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-300
            bg-gradient-to-b from-brand-gradient-from-light to-brand-gradient-to-light
            dark:from-[#232433] dark:to-[#181926]"
        />
        
        <HeroSection settings={settings} settingsLoading={settingsLoading} />
        
        <section className="relative -mt-16 lg:-mt-20 z-10">
          <MobileOptimizedLayout>
            <SearchFilters 
              selectedCity={selectedCity}
              setSelectedCity={handleCityChange}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={handleDistrictChange}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedLayout={selectedLayout}
              setSelectedLayout={setSelectedLayout}
              priceRange={priceRange}
              setPriceRange={handlePriceRangeChangeForFilters}
              properties={properties} 
            />
          </MobileOptimizedLayout>
        </section>

        <SearchQueryDisplay
          searchQuery={searchQuery}
          filteredPropertiesCount={finalFilteredProperties.length}
          clearSearchHandler={clearSearch}
        />

        {/* قسم العقارات المميزة - يظهر دائماً في الصفحة الرئيسية */}
        {(() => {
          const allTranslation = t('all');
          // تبسيط الشرط: يظهر القسم فقط عندما لا يوجد بحث نصي
          const shouldShowFeatured = !searchQuery;

          console.log('Featured Properties Section Debug:', {
            searchQuery,
            selectedCity,
            selectedDistrict,
            selectedType,
            allTranslation,
            shouldShowFeatured,
            currentLanguage,
            searchQueryEmpty: !searchQuery
          });
          return shouldShowFeatured;
        })() && (
          <FeaturedPropertiesSection
            properties={properties}
            loading={overallLoading}
            onUpdate={fetchProperties}
          />
        )}

        <div className="w-full">
          <PropertiesSection
            properties={finalFilteredProperties}
            loading={overallLoading}
            selectedFilter={propertyFilter}
            onFilterChange={setPropertyFilter}
          />
        </div>

        {/* قسم التقييمات - يظهر دائماً */}
        <ReviewsSection />

        {/* قسم الخدمات - يظهر دائماً */}
        <ServicesSection />
      </div>
    </div>
  );
};

export default Index;
